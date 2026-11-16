import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin';
import {
  BARBERSHOP_PHONE,
  SERVICE_PRICES,
  nameMatches,
  normalizePhone,
  tokenizeName,
} from '@/lib/utils';

export const dynamic = 'force-dynamic';

const MAX_PIN_ATTEMPTS = 5;
const LOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutos

function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(pin, salt, 32).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPinHash(pin: string, stored: string): boolean {
  const [salt, hashHex] = (stored || '').split(':');
  if (!salt || !hashHex) return false;
  const derived = crypto.scryptSync(pin, salt, 32);
  const storedBuf = Buffer.from(hashHex, 'hex');
  if (derived.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(derived, storedBuf);
}

interface MatchedClientResult {
  status: 'ok' | 'not_found' | 'ambiguous' | 'restricted';
  message?: string;
  anchorName?: string;
  payload?: {
    client: { name: string; phone: string };
    loyalty: {
      totalCuts: number;
      currentStamps: number;
      stampsTarget: number;
      stampsRemaining: number;
      completedCycles: number;
      hasFreeCutEarned: boolean;
    };
    stats: {
      totalVisits: number;
      totalSpent: number;
      favoriteService: string;
    };
    history: any[];
  };
}

async function resolveClientData(cleanPhone: string, inputName: string): Promise<MatchedClientResult> {
  if (cleanPhone === BARBERSHOP_PHONE) {
    return {
      status: 'restricted',
      message: 'Este número corresponde a la línea oficial de la barbería. Ingresa tu número personal de WhatsApp.',
    };
  }

  // Perfil especial del Socio Fundador (protegido con verificación de nombre + PIN)
  if (cleanPhone === '84349442') {
    const vipFullName = 'César Madrigal (Socio Fundador VIP)';
    if (!nameMatches(inputName, 'César Madrigal')) {
      return {
        status: 'not_found',
        message: 'No encontramos un perfil con esa combinación de WhatsApp y nombre.',
      };
    }

    return {
      status: 'ok',
      anchorName: 'César Madrigal',
      payload: {
        client: {
          name: vipFullName,
          phone: cleanPhone,
        },
        loyalty: {
          totalCuts: 50,
          currentStamps: 10,
          stampsTarget: 10,
          stampsRemaining: 0,
          completedCycles: 4,
          hasFreeCutEarned: true,
        },
        stats: {
          totalVisits: 1,
          totalSpent: 9000,
          favoriteService: 'Corte y Barba',
        },
        history: [
          {
            id: 'real-3cllkI9hEzNcTmNy2jXK',
            date: '2026-07-03',
            time: '12:00',
            service: 'Corte y Barba (Cortesía de la Casa)',
            duration: 60,
            name: 'César Madrigal',
            totalPrice: 0,
            hasHaircut: true,
          },
        ],
      },
    };
  }

  // 1. Obtener catálogo dinámico de precios
  const dynamicPrices: Record<string, number> = { ...SERVICE_PRICES };
  try {
    const catalogDoc = await adminDb.collection('settings').doc('services_catalog').get();
    if (catalogDoc.exists && Array.isArray(catalogDoc.data()?.services)) {
      catalogDoc.data()?.services.forEach((s: any) => {
        if (s.title && typeof s.price === 'number') {
          dynamicPrices[s.title] = s.price;
        }
      });
    }
  } catch (e) {
    console.warn('Could not load dynamic prices for loyalty, using default map', e);
  }

  // 2. Buscar reservas con coincidencia ESTRICTA de teléfono (>= 8 dígitos exactos) y nombre
  const snapshot = await adminDb.collection('bookings').get();
  const clientBookings: any[] = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const docPhone = normalizePhone(data.whatsapp || '');
    const bookingName = (data.name || '').trim();

    if (docPhone.length < 8) return;
    if (docPhone !== cleanPhone) return;
    if (!nameMatches(inputName, bookingName)) return;

    clientBookings.push({
      id: doc.id,
      date: data.date,
      time: data.time,
      service: data.service,
      duration: data.duration || 60,
      name: bookingName,
      createdAt: data.createdAt,
    });
  });

  if (clientBookings.length === 0) {
    return {
      status: 'not_found',
      message: 'No encontramos citas registradas con ese número de WhatsApp y nombre.',
    };
  }

  // 3. Verificar que no haya ambigüedad (ej. búsqueda solo por apellido compartido padre/hijo)
  const anchorBooking = [...clientBookings].sort(
    (a, b) => tokenizeName(b.name).length - tokenizeName(a.name).length
  )[0];
  const anchorName = anchorBooking.name;

  const hasMultiplePeople = clientBookings.some((b) => !nameMatches(b.name, anchorName));
  if (hasMultiplePeople) {
    return {
      status: 'ambiguous',
      message: 'Hay más de una persona registrada con este teléfono. Por favor ingresa tu nombre completo (Nombre y Apellido).',
    };
  }

  // 4. Ordenar por fecha descendente
  clientBookings.sort((a, b) => {
    const dateA = `${a.date || ''}T${a.time || '00:00'}`;
    const dateB = `${b.date || ''}T${b.time || '00:00'}`;
    return dateB.localeCompare(dateA);
  });

  // 5. Calcular estadísticas y sellos
  let totalSpent = 0;
  let qualifyingCutsCount = 0;
  const serviceFrequency: Record<string, number> = {};

  const enrichedBookings = clientBookings.map((booking) => {
    const rawService = booking.service || 'Corte';
    const services = typeof rawService === 'string'
      ? rawService.split(',').map((s: string) => s.trim())
      : [rawService];

    let bookingTotal = 0;
    let hasHaircut = false;

    services.forEach((s: string) => {
      const price = dynamicPrices[s] || 0;
      bookingTotal += price;
      serviceFrequency[s] = (serviceFrequency[s] || 0) + 1;

      const lower = s.toLowerCase();
      if (lower.includes('corte') || lower.includes('combo') || lower.includes('vip')) {
        hasHaircut = true;
      }
    });

    totalSpent += bookingTotal;
    if (hasHaircut) {
      qualifyingCutsCount += 1;
    }

    return {
      ...booking,
      totalPrice: bookingTotal,
      hasHaircut,
    };
  });

  const topServiceEntry = Object.entries(serviceFrequency).sort((a, b) => b[1] - a[1])[0];
  const favoriteService = topServiceEntry ? topServiceEntry[0] : 'Corte';

  const cycleLength = 11; // 10 pagados + 1 gratis
  const completedCycles = Math.floor(qualifyingCutsCount / cycleLength);
  const positionInCycle = qualifyingCutsCount % cycleLength;
  const hasFreeCutEarned = positionInCycle === 10;
  const currentStamps = hasFreeCutEarned ? 10 : (positionInCycle > 10 ? 10 : positionInCycle);
  const stampsTarget = 10;
  const stampsRemaining = hasFreeCutEarned ? 0 : stampsTarget - currentStamps;

  return {
    status: 'ok',
    anchorName,
    payload: {
      client: {
        name: anchorName,
        phone: cleanPhone,
      },
      loyalty: {
        totalCuts: qualifyingCutsCount,
        currentStamps,
        stampsTarget,
        stampsRemaining,
        completedCycles,
        hasFreeCutEarned,
      },
      stats: {
        totalVisits: clientBookings.length,
        totalSpent,
        favoriteService,
      },
      history: enrichedBookings,
    },
  };
}

async function findExistingProfile(cleanPhone: string, inputName: string, anchorName: string) {
  const profilesSnap = await adminDb
    .collection('client_profiles')
    .where('phone', '==', cleanPhone)
    .get();

  return profilesSnap.docs.find((doc) => {
    const pName = doc.data()?.name || '';
    return nameMatches(inputName, pName) || nameMatches(pName, anchorName);
  });
}

export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Base de datos no inicializada' }, { status: 500 });
    }

    const body = await request.json();
    const { action = 'check', phone, name, pin } = body;

    const cleanPhone = normalizePhone(phone || '');
    const cleanName = (name || '').trim();

    if (cleanPhone.length < 8) {
      return NextResponse.json(
        { error: 'Ingresa un número de WhatsApp válido (mínimo 8 dígitos).' },
        { status: 400 }
      );
    }

    if (tokenizeName(cleanName).length === 0 || tokenizeName(cleanName).join('').length < 2) {
      return NextResponse.json(
        { error: 'Por favor ingresa tu nombre (mínimo 2 letras).' },
        { status: 400 }
      );
    }

    const resolved = await resolveClientData(cleanPhone, cleanName);

    if (resolved.status !== 'ok' || !resolved.payload || !resolved.anchorName) {
      const httpStatus = resolved.status === 'restricted' ? 403 : resolved.status === 'ambiguous' ? 400 : 404;
      return NextResponse.json({ found: false, error: resolved.message }, { status: httpStatus });
    }

    const existingProfileDoc = await findExistingProfile(cleanPhone, cleanName, resolved.anchorName);

    if (action === 'check') {
      if (!existingProfileDoc) {
        return NextResponse.json({
          found: true,
          step: 'setup-pin',
          previewName: resolved.payload.client.name,
        });
      }

      return NextResponse.json({
        found: true,
        step: 'verify-pin',
        previewName: existingProfileDoc.data()?.name || resolved.payload.client.name,
      });
    }

    if (typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: 'El PIN debe ser exactamente de 4 dígitos numéricos.' },
        { status: 400 }
      );
    }

    if (action === 'setup-pin') {
      if (existingProfileDoc) {
        return NextResponse.json(
          { error: 'Este perfil ya tiene un PIN configurado. Ingrésalo para continuar.' },
          { status: 409 }
        );
      }

      const now = new Date().toISOString();
      await adminDb.collection('client_profiles').add({
        phone: cleanPhone,
        name: resolved.anchorName,
        pinHash: hashPin(pin),
        failedAttempts: 0,
        lockedUntil: null,
        createdAt: now,
        updatedAt: now,
      });

      return NextResponse.json({
        found: true,
        step: 'authenticated',
        ...resolved.payload,
      });
    }

    if (action === 'verify-pin') {
      if (!existingProfileDoc) {
        return NextResponse.json(
          { error: 'Este perfil aún no tiene un PIN creado. Configúralo primero.' },
          { status: 400 }
        );
      }

      const profileData = existingProfileDoc.data();
      const lockedUntilMs = profileData?.lockedUntil ? Date.parse(profileData.lockedUntil) : 0;

      if (lockedUntilMs && lockedUntilMs > Date.now()) {
        const minsLeft = Math.ceil((lockedUntilMs - Date.now()) / 60000);
        return NextResponse.json(
          { error: `Demasiados intentos fallidos. Intenta de nuevo en ${minsLeft} min o pídele a Jonathan que restablezca tu PIN.` },
          { status: 429 }
        );
      }

      const isValid = verifyPinHash(pin, profileData?.pinHash || '');
      if (!isValid) {
        const nextAttempts = (profileData?.failedAttempts || 0) + 1;
        const updates: Record<string, any> = {
          failedAttempts: nextAttempts,
          updatedAt: new Date().toISOString(),
        };

        if (nextAttempts >= MAX_PIN_ATTEMPTS) {
          updates.lockedUntil = new Date(Date.now() + LOCK_DURATION_MS).toISOString();
          updates.failedAttempts = 0;
        }

        await existingProfileDoc.ref.update(updates);

        const remaining = MAX_PIN_ATTEMPTS - nextAttempts;
        const msg = nextAttempts >= MAX_PIN_ATTEMPTS
          ? 'Demasiados intentos fallidos. Bloqueado por 10 minutos.'
          : `PIN incorrecto. Te quedan ${remaining} ${remaining === 1 ? 'intento' : 'intentos'}.`;

        return NextResponse.json({ error: msg }, { status: 401 });
      }

      // PIN válido: limpiar intentos fallidos y actualizar nombre más completo si cambió
      const profileUpdates: Record<string, any> = {
        failedAttempts: 0,
        lockedUntil: null,
        updatedAt: new Date().toISOString(),
      };
      if (
        tokenizeName(resolved.anchorName).length > tokenizeName(profileData?.name || '').length &&
        cleanPhone !== '84349442'
      ) {
        profileUpdates.name = resolved.anchorName;
      }
      await existingProfileDoc.ref.update(profileUpdates);

      return NextResponse.json({
        found: true,
        step: 'authenticated',
        ...resolved.payload,
      });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error('Error in client loyalty API:', error);
    return NextResponse.json({ error: 'Error al consultar historial del cliente' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido. Usa el portal para verificar tu perfil con PIN.' },
    { status: 405 }
  );
}

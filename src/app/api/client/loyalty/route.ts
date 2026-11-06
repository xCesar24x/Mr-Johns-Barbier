import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { SERVICE_PRICES } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function cleanPhoneNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('506') && digits.length === 11) {
    return digits.slice(3);
  }
  return digits;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phoneParam = searchParams.get('phone');

  if (!phoneParam) {
    return NextResponse.json({ error: 'Número de WhatsApp requerido' }, { status: 400 });
  }

  const cleanPhone = cleanPhoneNumber(phoneParam);
  if (cleanPhone.length < 8) {
    return NextResponse.json({ error: 'Número de WhatsApp inválido (mínimo 8 dígitos)' }, { status: 400 });
  }

  // --- MOCK DE DEMOSTRACIÓN PARA PRUEBAS (4 NIVELES) ---
  const demoProfiles: Record<string, any> = {
    "11111111": {
      name: "Alejandro Mora",
      totalCuts: 3, // Nivel 1: Inicio (3 sellos)
      visits: 3,
      spent: 18000,
      fav: "Corte",
      dates: ["2026-11-01", "2026-10-15", "2026-10-01"],
    },
    "22222222": {
      name: "Esteban Ramírez",
      totalCuts: 10, // Nivel 1: ¡10 sellos completados! CORTE 11 GRATIS ACTIVO
      visits: 10,
      spent: 85000,
      fav: "Corte y Barba",
      dates: ["2026-11-05", "2026-10-20", "2026-10-05"],
    },
    "33333333": {
      name: "David Solano",
      totalCuts: 14, // Nivel 2: Ya canjeó el corte 11 gratis y lleva 3 cortes del segundo ciclo
      visits: 14,
      spent: 115000,
      fav: "Corte",
      dates: ["2026-11-04", "2026-10-18", "2026-10-02"],
    },
    "44444444": {
      name: "Carlos Cárdenas VIP",
      totalCuts: 25, // Nivel 3: Cliente legendario en su tercer ciclo
      visits: 25,
      spent: 220000,
      fav: "Corte y Barba",
      dates: ["2026-11-02", "2026-10-19", "2026-10-03"],
    },
  };

  if (demoProfiles[cleanPhone]) {
    const p = demoProfiles[cleanPhone];
    const cycleLength = 11;
    const completedCycles = Math.floor(p.totalCuts / cycleLength);
    const positionInCycle = p.totalCuts % cycleLength;
    const hasFreeCutEarned = positionInCycle === 10;
    const currentStamps = hasFreeCutEarned ? 10 : (positionInCycle > 10 ? 10 : positionInCycle);
    const stampsTarget = 10;
    const stampsRemaining = hasFreeCutEarned ? 0 : stampsTarget - currentStamps;

    const mockHistory = p.dates.map((d: string, idx: number) => ({
      id: `demo-${idx}`,
      date: d,
      time: "10:00",
      service: p.fav,
      duration: 60,
      name: p.name,
      totalPrice: p.fav === "Corte y Barba" ? 9000 : 6000,
      hasHaircut: true,
    }));

    return NextResponse.json({
      found: true,
      client: {
        name: p.name,
        phone: cleanPhone,
      },
      loyalty: {
        totalCuts: p.totalCuts,
        currentStamps,
        stampsTarget,
        stampsRemaining,
        completedCycles,
        hasFreeCutEarned,
      },
      stats: {
        totalVisits: p.visits,
        totalSpent: p.spent,
        favoriteService: p.fav,
      },
      history: mockHistory,
    });
  }
  // --- FIN MOCK DE DEMOSTRACIÓN ---

  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Base de datos no inicializada' }, { status: 500 });
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
      console.warn("Could not load dynamic prices for loyalty, using default map", e);
    }

    // 2. Buscar reservas asociadas. Para ser tolerantes con formatos (+506, 506, con guiones, etc.)
    // Traemos las reservas y filtramos por los últimos 8 dígitos del número
    const snapshot = await adminDb.collection('bookings').get();

    const clientBookings: any[] = [];
    let clientName = '';

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const rawWhatsapp = data.whatsapp || '';
      const docClean = cleanPhoneNumber(rawWhatsapp);

      // Comprobamos si coincide con los 8 dígitos del cliente
      if (docClean.endsWith(cleanPhone) || cleanPhone.endsWith(docClean)) {
        if (!clientName && data.name) {
          clientName = data.name;
        }
        clientBookings.push({
          id: doc.id,
          date: data.date,
          time: data.time,
          service: data.service,
          duration: data.duration || 60,
          name: data.name,
          createdAt: data.createdAt,
        });
      }
    });

    if (clientBookings.length === 0) {
      return NextResponse.json({
        found: false,
        message: 'No encontramos citas registradas con este número de WhatsApp.',
      });
    }

    // 3. Ordenar por fecha cronológica descendente (más recientes primero)
    clientBookings.sort((a, b) => {
      const dateA = `${a.date || ''}T${a.time || '00:00'}`;
      const dateB = `${b.date || ''}T${b.time || '00:00'}`;
      return dateB.localeCompare(dateA);
    });

    // 4. Calcular estadísticas financieras y servicios
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

        // Comprobamos si es un servicio que incluye corte para fidelidad
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

    // Servicio favorito
    const topServiceEntry = Object.entries(serviceFrequency).sort((a, b) => b[1] - a[1])[0];
    const favoriteService = topServiceEntry ? topServiceEntry[0] : 'Corte';

    // 5. Cálculo del programa de fidelidad (Ciclo de 11 cortes: 10 pagados + 11vo de regalo)
    // Ejemplos:
    // Corte 10: 10 sellos ganados, tiene derecho al 11vo gratis.
    // Corte 11: Se canjea el corte gratis (completa el ciclo 1).
    // Corte 12: Vuelve a empezar con sello #1 (Ciclo 2: Nivel 2).
    const cycleLength = 11; // 10 pagados + 1 gratis
    const completedCycles = Math.floor(qualifyingCutsCount / cycleLength);
    const positionInCycle = qualifyingCutsCount % cycleLength;

    // Si lleva 10 en el ciclo actual, el próximo (el 11) es gratis
    const hasFreeCutEarned = positionInCycle === 10;
    const currentStamps = hasFreeCutEarned ? 10 : (positionInCycle > 10 ? 10 : positionInCycle);
    const stampsTarget = 10;
    const stampsRemaining = hasFreeCutEarned ? 0 : stampsTarget - currentStamps;

    return NextResponse.json({
      found: true,
      client: {
        name: clientName,
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
    });
  } catch (error) {
    console.error('Error fetching client loyalty data:', error);
    return NextResponse.json({ error: 'Error al consultar historial del cliente' }, { status: 500 });
  }
}


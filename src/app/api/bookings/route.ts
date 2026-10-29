import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { formatDateKey, getOccupiedSlotsForBooking } from '@/lib/utils';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database not initialized' }, { status: 500 });
    }

    const body = await request.json();
    const { name, email, whatsapp, service, date, time, duration } = body;
    if (!name?.trim() || !whatsapp?.trim() || !date || !time) {
      return NextResponse.json({ success: false, error: 'Faltan datos obligatorios de la reserva' }, { status: 400 });
    }
    if (!service || !service.trim()) {
      return NextResponse.json({ success: false, error: 'Debes seleccionar al menos un servicio' }, { status: 400 });
    }
    const dateKey = formatDateKey(date);
    const cleanEmail = email ? email.trim() : '';
    const bookingDuration = Number(duration) > 0 ? Number(duration) : 60;

    // 0. Verificar disponibilidad en el servidor (evitar doble reserva o día cerrado)
    const [existingSnapshot, dayStatus] = await Promise.all([
      adminDb.collection('bookings').where('date', '==', dateKey).get(),
      adminDb.collection('settings').doc(dateKey).get(),
    ]);

    if (dayStatus.exists && dayStatus.data()?.status === 'closed') {
      return NextResponse.json(
        { success: false, error: 'Este día se encuentra cerrado para reservas.' },
        { status: 409 }
      );
    }

    const occupiedSlots = new Set<string>();
    existingSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const slots = getOccupiedSlotsForBooking(data.time, Number(data.duration) > 0 ? Number(data.duration) : 60);
      slots.forEach(s => occupiedSlots.add(s));
    });

    const lunchTime = dayStatus.exists ? dayStatus.data()?.lunchTime : null;
    if (lunchTime && lunchTime !== 'none') {
      getOccupiedSlotsForBooking(lunchTime, 60).forEach(s => occupiedSlots.add(s));
    }

    const blockedSlots: string[] = dayStatus.exists ? (dayStatus.data()?.blockedSlots || []) : [];
    blockedSlots.forEach(s => occupiedSlots.add(s));

    const requestedSlots = getOccupiedSlotsForBooking(time, bookingDuration);
    const hasConflict = requestedSlots.some(slot => occupiedSlots.has(slot));
    if (hasConflict) {
      return NextResponse.json(
        { success: false, error: 'El horario seleccionado ya fue ocupado o se traslapa con otra cita. Por favor elige otra hora.' },
        { status: 409 }
      );
    }
    
    // 1. Save to Firestore
    const bookingRef = await adminDb.collection('bookings').add({
      name: name.trim(),
      email: cleanEmail,
      whatsapp: whatsapp.trim(),
      service: service.trim(),
      duration: bookingDuration,
      date: dateKey,
      time,
      createdAt: new Date().toISOString(),
    });

    // 2. Add to Google Calendar (Jona's)
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];
    const auth = new google.auth.JWT({
      email: process.env.FIREBASE_CLIENT_EMAIL,
      key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    // Parse date and time in UTC to avoid local server timezone issues
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(`${date}T00:00:00Z`);
    startDate.setUTCHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setUTCMinutes(startDate.getUTCMinutes() + bookingDuration);

    // Format to local ISO (YYYY-MM-DDTHH:mm:ss) by removing the Z and milliseconds
    const formatLocalISO = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, '');

    const emailLine = cleanEmail ? `\n📧 Email: ${cleanEmail}` : '';
    const durHours = Math.floor(bookingDuration / 60);
    const durMins = bookingDuration % 60;
    const durText = durHours > 0 ? (durMins > 0 ? `${durHours}h ${durMins}m` : `${durHours}h`) : `${durMins} min`;

    const event = {
      summary: `Barbería: ${service} - ${name}`,
      location: 'Mr Johns Barbier',
      description: `👤 Cliente: ${name}\n📱 WhatsApp: ${whatsapp}${emailLine}\n✂️ Servicio: ${service}\n⏱️ Duración: ${durText}`,
      start: {
        dateTime: formatLocalISO(startDate),
        timeZone: 'America/Costa_Rica',
      },
      end: {
        dateTime: formatLocalISO(endDate),
        timeZone: 'America/Costa_Rica',
      },
    };

    let calendarEventId = null;
    try {
      const calRes = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'mrjohnsbarbier@gmail.com',
        requestBody: event,
      });
      calendarEventId = calRes.data.id;
    } catch (calError) {
      console.error('Google Calendar Sync Error:', calError);
    }

    if (calendarEventId) {
      try {
        await bookingRef.update({ calendarEventId });
      } catch (dbUpdateError) {
        console.error('Error updating booking with calendarEventId:', dbUpdateError);
      }
    }

    return NextResponse.json({ success: true, bookingId: bookingRef.id });
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

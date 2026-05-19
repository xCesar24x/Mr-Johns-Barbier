import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { formatDateKey } from '@/lib/utils';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, service, date, time } = body;
    const dateKey = formatDateKey(date);
    
    // 1. Save to Firestore
    const bookingRef = await adminDb.collection('bookings').add({
      name,
      email,
      whatsapp,
      service,
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
    endDate.setUTCMinutes(startDate.getUTCMinutes() + 30);

    // Format to local ISO (YYYY-MM-DDTHH:mm:ss) by removing the Z and milliseconds
    const formatLocalISO = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, '');

    const event = {
      summary: `Barbería: ${service} - ${name}`,
      location: 'Mr Johns Barbier',
      description: `👤 Cliente: ${name}\n📱 WhatsApp: ${whatsapp}\n📧 Email: ${email}\n✂️ Servicio: ${service}`,
      start: {
        dateTime: formatLocalISO(startDate),
        timeZone: 'America/Costa_Rica',
      },
      end: {
        dateTime: formatLocalISO(endDate),
        timeZone: 'America/Costa_Rica',
      },
      attendees: [
        { email: email }
      ]
    };

    try {
      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'mrjohnsbarbier@gmail.com',
        requestBody: event,
        sendUpdates: 'all', // Send invitation email to the client
      });
    } catch (calError) {
      console.error('Google Calendar Sync Error:', calError);
    }

    return NextResponse.json({ success: true, bookingId: bookingRef.id });
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

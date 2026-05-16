import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { google } from 'googleapis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, whatsapp, service, date, time } = body;

    // 1. Save to Firestore
    const bookingRef = await adminDb.collection('bookings').add({
      name,
      email,
      whatsapp,
      service,
      date,
      time,
      createdAt: new Date().toISOString(),
    });

    // 2. Add to Google Calendar (Jona's)
    // IMPORTANT: The Service Account email MUST be added to Jona's Google Calendar 
    // with "Make changes to events" permissions.
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];
    const auth = new google.auth.JWT({
      email: process.env.FIREBASE_CLIENT_EMAIL,
      key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });

    const calendar = google.calendar({ version: 'v3', auth });
    
    // Parse date and time
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 30);

    const event = {
      summary: `Barbería: ${service} - ${name}`,
      location: 'Mr Johns Barbier',
      description: `👤 Cliente: ${name}\n📱 WhatsApp: ${whatsapp}\n📧 Email: ${email}\n✂️ Servicio: ${service}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'America/Costa_Rica',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Costa_Rica',
      },
    };

    try {
      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        requestBody: event,
      });
    } catch (calError) {
      console.error('Google Calendar Sync Error:', calError);
      // We don't fail the whole request if calendar fails, but we log it
    }

    return NextResponse.json({ success: true, bookingId: bookingRef.id });
  } catch (error) {
    console.error('Error in booking API:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

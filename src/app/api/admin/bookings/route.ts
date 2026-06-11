import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { formatDateKey, SERVICE_PRICES } from '@/lib/utils';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

  try {
    const dateKey = formatDateKey(date);

    // 1. Get bookings for the selected day
    const snapshot = await adminDb.collection('bookings')
      .where('date', '==', dateKey)
      .get();

    const bookings = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => (a.time || "").localeCompare(b.time || ""));
    
    // 2. Get day status (Open/Closed) and lunchTime
    const dayStatus = await adminDb.collection('settings').doc(dateKey).get();
    const isClosed = dayStatus.exists && dayStatus.data()?.status === 'closed';
    const lunchTime = dayStatus.exists ? dayStatus.data()?.lunchTime || 'none' : 'none';

    // 3. Analytics (For the selected day)
    let totalRevenue = 0;
    const serviceCounts: Record<string, number> = {};

    bookings.forEach((booking: any) => {
      const service = booking.service || "Corte";
      const price = SERVICE_PRICES[service] || 0;
      totalRevenue += price;
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });

    const analytics = {
      totalBookings: bookings.length,
      totalRevenue,
      popularServices: Object.entries(serviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }))
    };

    return NextResponse.json({ bookings, isClosed, lunchTime, analytics });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, date, bookingId, status, lunchTime } = await request.json();
    const dateKey = date ? formatDateKey(date) : null;

    if (action === 'toggle-day' && dateKey) {
      await adminDb.collection('settings').doc(dateKey).set({ status: status }, { merge: true });
      return NextResponse.json({ success: true });
    }

    if (action === 'set-lunch' && dateKey) {
      await adminDb.collection('settings').doc(dateKey).set({ lunchTime: lunchTime || 'none' }, { merge: true });
      return NextResponse.json({ success: true });
    }

    if (action === 'cancel-booking') {
      const bookingDoc = await adminDb.collection('bookings').doc(bookingId).get();
      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data();
        const calendarEventId = bookingData?.calendarEventId;

        if (calendarEventId) {
          try {
            const SCOPES = ['https://www.googleapis.com/auth/calendar'];
            const auth = new google.auth.JWT({
              email: process.env.FIREBASE_CLIENT_EMAIL,
              key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
              scopes: SCOPES,
            });
            const calendar = google.calendar({ version: 'v3', auth });
            await calendar.events.delete({
              calendarId: process.env.GOOGLE_CALENDAR_ID || 'mrjohnsbarbier@gmail.com',
              eventId: calendarEventId,
            });
          } catch (calError) {
            console.error('Error deleting Google Calendar event:', calError);
          }
        }
      }

      await adminDb.collection('bookings').doc(bookingId).delete();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

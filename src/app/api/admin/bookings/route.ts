import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

  try {
    const snapshot = await adminDb.collection('bookings')
      .where('date', '==', date)
      .orderBy('time', 'asc')
      .get();

    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const dayStatus = await adminDb.collection('settings').doc(date).get();
    const isClosed = dayStatus.exists && dayStatus.data()?.status === 'closed';

    return NextResponse.json({ bookings, isClosed });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Para cancelar cita o cerrar día
export async function POST(request: Request) {
  try {
    const { action, date, bookingId, status } = await request.json();

    if (action === 'toggle-day') {
      await adminDb.collection('settings').doc(date).set({ status: status });
      return NextResponse.json({ success: true });
    }

    if (action === 'cancel-booking') {
      await adminDb.collection('bookings').doc(bookingId).delete();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

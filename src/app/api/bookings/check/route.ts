import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { formatDateKey } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    const dateKey = formatDateKey(date);

    // Consultar las citas de ese día
    const snapshot = await adminDb.collection('bookings')
      .where('date', '==', dateKey)
      .get();

    const occupiedSlots = snapshot.docs.map(doc => doc.data().time);
    
    // También consultar si el día está marcado como "Cerrado" por el admin
    const dayStatus = await adminDb.collection('settings').doc(dateKey).get();
    const isClosed = dayStatus.exists && dayStatus.data()?.status === 'closed';

    return NextResponse.json({ occupiedSlots, isClosed });
  } catch (error) {
    console.error('Error checking slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

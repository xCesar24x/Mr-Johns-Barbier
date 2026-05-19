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
    
    // También consultar si el día está marcado como "Cerrado" o tiene hora de almuerzo
    const dayStatus = await adminDb.collection('settings').doc(dateKey).get();
    const isClosed = dayStatus.exists && dayStatus.data()?.status === 'closed';
    const lunchTime = dayStatus.exists ? dayStatus.data()?.lunchTime : null;

    if (lunchTime && lunchTime !== 'none') {
      // Bloqueamos dos rangos de 30 minutos (1 hora de almuerzo total)
      const [h, m] = lunchTime.split(':').map(Number);
      const slot1 = `${h}:${m === 0 ? '00' : m}`;
      
      let h2 = h;
      let m2 = m + 30;
      if (m2 >= 60) {
        m2 -= 60;
        h2 += 1;
      }
      const slot2 = `${h2}:${m2 === 0 ? '00' : m2}`;

      if (!occupiedSlots.includes(slot1)) occupiedSlots.push(slot1);
      if (!occupiedSlots.includes(slot2)) occupiedSlots.push(slot2);
    }

    return NextResponse.json({ occupiedSlots, isClosed });
  } catch (error) {
    console.error('Error checking slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

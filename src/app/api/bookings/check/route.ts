import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { formatDateKey, getOccupiedSlotsForBooking } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    if (!adminDb) {
      return NextResponse.json({
        bookings: [],
        occupiedSlots: [],
        isClosed: false,
        lunchTime: 'none',
        blockedSlots: [],
      });
    }

    const dateKey = formatDateKey(date);

    // 1. Consultar las citas de ese día
    const snapshot = await adminDb.collection('bookings')
      .where('date', '==', dateKey)
      .get();

    const bookings = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        time: data.time as string,
        duration: Number(data.duration) > 0 ? Number(data.duration) : 60,
      };
    });

    const occupiedSlots: string[] = [];

    // Calcular todos los bloques de 30 min ocupados por cada cita según su duración
    bookings.forEach(b => {
      const slots = getOccupiedSlotsForBooking(b.time, b.duration);
      slots.forEach(slot => {
        if (!occupiedSlots.includes(slot)) occupiedSlots.push(slot);
      });
    });
    
    // 2. Consultar si el día está marcado como "Cerrado", tiene hora de almuerzo o bloqueos
    const dayStatus = await adminDb.collection('settings').doc(dateKey).get();
    const isClosed = dayStatus.exists && dayStatus.data()?.status === 'closed';
    const lunchTime = dayStatus.exists ? dayStatus.data()?.lunchTime : null;
    const blockedSlots: string[] = dayStatus.exists ? (dayStatus.data()?.blockedSlots || []) : [];

    if (lunchTime && lunchTime !== 'none') {
      // 1 hora de almuerzo (2 bloques de 30 min)
      const lunchSlots = getOccupiedSlotsForBooking(lunchTime, 60);
      lunchSlots.forEach(slot => {
        if (!occupiedSlots.includes(slot)) occupiedSlots.push(slot);
      });
    }

    // Inyectar slots bloqueados manualmente por el administrador
    blockedSlots.forEach((slot: string) => {
      if (!occupiedSlots.includes(slot)) {
        occupiedSlots.push(slot);
      }
    });

    return NextResponse.json({ 
      bookings, 
      occupiedSlots, 
      isClosed, 
      lunchTime: lunchTime || 'none', 
      blockedSlots 
    });
  } catch (error) {
    console.error('Error checking slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

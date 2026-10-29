import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { DEFAULT_SERVICES } from '@/lib/defaultServices';
import { ServiceItem } from '@/types/service';

export const dynamic = 'force-dynamic';

const SERVICES_DOC = 'services_catalog';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: true, services: DEFAULT_SERVICES });
    }

    const doc = await adminDb.collection('settings').doc(SERVICES_DOC).get();
    
    if (!doc.exists) {
      // Auto seed default services if not present
      try {
        await adminDb.collection('settings').doc(SERVICES_DOC).set({
          services: DEFAULT_SERVICES,
          updatedAt: new Date().toISOString()
        });
      } catch (seedErr) {
        console.warn("Could not seed default services:", seedErr);
      }
      return NextResponse.json({ success: true, services: DEFAULT_SERVICES });
    }

    const data = doc.data();
    const services = (data?.services as ServiceItem[]) || DEFAULT_SERVICES;
    return NextResponse.json({ success: true, services });
  } catch (error) {
    console.error("Error reading services catalog:", error);
    return NextResponse.json({ success: true, services: DEFAULT_SERVICES });
  }
}

export async function POST(request: Request) {
  try {
    if (!adminDb) {
      return NextResponse.json({ success: false, error: 'Database not initialized' }, { status: 500 });
    }

    const body = await request.json();
    const { action, service, serviceId, services } = body;

    const docRef = adminDb.collection('settings').doc(SERVICES_DOC);
    const doc = await docRef.get();
    let currentServices: ServiceItem[] = doc.exists ? (doc.data()?.services || []) : [...DEFAULT_SERVICES];

    if (action === 'save-all') {
      if (!Array.isArray(services)) {
        return NextResponse.json({ error: 'Lista de servicios inválida' }, { status: 400 });
      }
      await docRef.set({
        services,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, services });
    }

    if (action === 'create') {
      if (!service || !service.title || typeof service.price !== 'number') {
        return NextResponse.json({ error: 'Datos de servicio incompletos' }, { status: 400 });
      }

      const newId = service.id || `srv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newService: ServiceItem = {
        id: newId,
        title: service.title.trim(),
        price: Number(service.price) || 0,
        description: service.description ? service.description.trim() : '',
        icon: service.icon || 'scissors',
        active: service.active !== false,
      };

      currentServices.push(newService);
      await docRef.set({
        services: currentServices,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, services: currentServices });
    }

    if (action === 'update') {
      if (!service || !service.id) {
        return NextResponse.json({ error: 'ID de servicio requerido' }, { status: 400 });
      }

      currentServices = currentServices.map(item => {
        if (item.id === service.id) {
          return {
            ...item,
            title: service.title !== undefined ? service.title.trim() : item.title,
            price: service.price !== undefined ? Number(service.price) : item.price,
            description: service.description !== undefined ? service.description.trim() : item.description,
            icon: service.icon !== undefined ? service.icon : item.icon,
            active: service.active !== undefined ? service.active : item.active,
          };
        }
        return item;
      });

      await docRef.set({
        services: currentServices,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, services: currentServices });
    }

    if (action === 'delete') {
      if (!serviceId) {
        return NextResponse.json({ error: 'ID de servicio requerido' }, { status: 400 });
      }

      currentServices = currentServices.filter(item => item.id !== serviceId);
      await docRef.set({
        services: currentServices,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, services: currentServices });
    }

    if (action === 'reset-defaults') {
      await docRef.set({
        services: DEFAULT_SERVICES,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, services: DEFAULT_SERVICES });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (error) {
    console.error("Error updating services catalog:", error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

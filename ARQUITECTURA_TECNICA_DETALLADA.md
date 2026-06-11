# 🏗️ ARQUITECTURA TÉCNICA - SISTEMA DE RESERVAS BARBERÍA (4 BARBEROS)

---

## 1. VISIÓN GENERAL DE LA ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE / USUARIO                        │
│         (Navegador Web + Aplicación Responsive)              │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   [Frontend]      [APIs REST]        [Webhooks]
   Next.js 16      Node.js/Express    Google Calendar
   React 19        TypeScript         WhatsApp API
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
  [Firestore]    [Google APIs]    [Twilio/Meta]
  Database       Calendar Auth     Notifications
  Real-time      Authorization    Messages
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   [Analytics]   [Security Layer]   [Monitoring]
   Firebase      SSL/TLS            Sentry
   BigQuery      JWT Auth           New Relic
```

---

## 2. COMPONENTES PRINCIPALES

### 2.1 FRONTEND (Cliente)
```
src/
├── app/
│   ├── layout.tsx          # Layout principal con fuentes y metadatos
│   ├── page.tsx            # Página principal (Home)
│   ├── globals.css         # Estilos globales y Tailwind
│   ├── admin/
│   │   └── page.tsx        # Dashboard administrativo
│   └── api/
│       ├── bookings/
│       │   ├── route.ts    # POST: crear booking, GET: listar
│       │   └── check/
│       │       └── route.ts# GET: verificar disponibilidad
│       └── admin/
│           └── bookings/
│               └── route.ts# GET: admin data, POST: acciones admin
│
├── components/
│   ├── BookingSystem.tsx      # Sistema de reservas interactivo
│   ├── Hero.tsx               # Sección hero
│   ├── Services.tsx           # Listado de servicios
│   ├── Gallery.tsx            # Galería de fotos
│   ├── History.tsx            # Historia del negocio
│   ├── Navbar.tsx             # Navegación
│   ├── Footer.tsx             # Pie de página
│   ├── FloatingWhatsApp.tsx   # Botón flotante WhatsApp
│   ├── LogoSeal.tsx           # Logo de sello
│   └── ui/                    # Componentes Radix UI
│
└── lib/
    ├── firebase.ts            # Configuración Firebase Client
    ├── firebaseAdmin.ts       # Configuración Firebase Admin
    └── utils.ts               # Utilidades y precios
```

### 2.2 TECNOLOGÍAS CLAVE

#### Frontend Framework
```typescript
// Next.js 16 - Framework React con SSR/SSG
import { NextResponse } from 'next/server';
import { useState, useEffect } from 'react';

// React 19 - Library UI
// Tailwind CSS v4 - Utility-first CSS
// Framer Motion - Animaciones suaves
// GSAP - Animaciones avanzadas
// Lucide React - Iconografía
```

#### Backend/APIs
```typescript
// Next.js API Routes (Node.js)
export async function POST(request: Request) {
  // Maneja bookings
  // Sincroniza con Google Calendar
  // Envía notificaciones por WhatsApp
}

// Firebase Admin SDK
import admin from "firebase-admin";
const adminDb = admin.firestore();
```

#### Base de Datos
```
Firebase Firestore (NoSQL Document Database)
├── Collection: "bookings"
│   ├── Document: {booking_id}
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── whatsapp: string
│   │   ├── service: string
│   │   ├── date: string (YYYY-MM-DD)
│   │   ├── time: string (HH:mm)
│   │   ├── createdAt: timestamp
│   │   └── status: string (confirmed/cancelled)
│   │
└── Collection: "settings"
    └── Document: {date}
        ├── status: string (open/closed)
        ├── lunchTime: string (HH:mm)
        └── notes: string (opcional)
```

#### Integraciones Externas
```
1. Google Calendar API
   - Autenticación: Service Account
   - Scope: calendar.events.insert
   - Sincronización: Automática por reserva

2. Twilio / Meta WhatsApp API
   - Confirmación automática
   - Recordatorios 24h antes
   - Cancelaciones

3. Firebase Authentication
   - Admin dashboard auth
   - Passwords encriptados
```

---

## 3. FLUJO DE DATOS - RESERVA COMPLETA

### 3.1 PROCESS: Creación de Booking

```
START: Usuario selecciona fecha y hora
  │
  ├─> Valida fecha (no sábado, no pasado)
  ├─> Obtiene slots ocupados del día
  ├─> Valida hora disponible
  │   ├─> GET /api/bookings/check?date={date}
  │   └─> Retorna: occupiedSlots[], isClosed, lunchTime
  │
  ├─> Usuario ingresa datos:
  │   ├─ Nombre
  │   ├─ Email
  │   ├─ WhatsApp
  │   └─ Servicio (dropdown)
  │
  ├─> Muestra preview de reserva
  │
  └─> Usuario confirma (click "Confirmar")
       │
       ├─> POST /api/bookings
       │   ├─ Guardar en Firestore
       │   │  └─ Collection: bookings
       │   │     └─ Document: {auto_id}
       │   │
       │   ├─ Sincronizar con Google Calendar
       │   │  ├─ Crear evento
       │   │  ├─ Incluir datos cliente
       │   │  └─ Enviar invitación
       │   │
       │   └─ Enviar confirmación WhatsApp
       │      └─ Mensaje con detalles cita
       │
       ├─> Mostrar QR para agregar a Google Calendar
       │
       ├─> Actualizar slots ocupados en tiempo real
       │
       └─> Mostrar confirmación al usuario
```

### 3.2 SECUENCIA DETALLADA DE API

```
1. GET /api/bookings/check?date=2026-05-20
   Response:
   {
     "occupiedSlots": ["09:00", "09:30", "10:00", ...],
     "isClosed": false,
     "lunchTime": "12:00"
   }

2. POST /api/bookings
   Request:
   {
     "name": "Juan García",
     "email": "juan@example.com",
     "whatsapp": "573015551234",
     "service": "Corte y Barba",
     "date": "2026-05-20",
     "time": "14:30"
   }
   
   Response:
   {
     "success": true,
     "bookingId": "abc123def456"
   }

3. Google Calendar Event Created:
   {
     "summary": "Barbería: Corte y Barba - Juan García",
     "location": "Mr Johns Barbier",
     "description": "Cliente: Juan García...",
     "start": { "dateTime": "2026-05-20T14:30:00", "timeZone": "America/Costa_Rica" },
     "end": { "dateTime": "2026-05-20T15:00:00", "timeZone": "America/Costa_Rica" }
   }

4. WhatsApp Message:
   "Hola Mr. John's, deseo confirmar mi cita.
    💈 *Detalles de la Cita* 💈
    👤 *Nombre:* Juan García
    📅 *Fecha:* martes, 20 de mayo de 2026
    ⏰ *Hora:* 14:30
    ✂️ *Servicio:* Corte y Barba
    📱 *WhatsApp:* +57 301 555 1234"
```

---

## 4. PANEL ADMINISTRATIVO

### 4.1 Funcionalidades del Admin

```typescript
// src/app/admin/page.tsx

interface AdminDashboard {
  // 1. Vista de Citas del Día
  selectedDate: Date;
  bookings: Booking[];
  // Mostrar: Hora, Cliente, Servicio, WhatsApp
  
  // 2. Control de Día
  toggleDayStatus: () => void; // Abrir/Cerrar día
  setLunchTime: (time: string) => void; // Configurar almuerzo
  
  // 3. Gestión de Citas
  cancelBooking: (id: string) => void; // Cancelar cita
  editBooking: (id: string, data) => void; // Editar detalles
  
  // 4. Analytics Global
  analytics: {
    totalBookings: number;
    totalRevenue: number;
    popularServices: Service[];
    monthlyTrend: Trend[];
    occupancyRate: number;
  }
}
```

### 4.2 Pantalla Admin - Secciones

```
┌──────────────────────────────────────────────────────┐
│           DASHBOARD ADMINISTRATIVO                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. SELECTOR DE FECHA                               │
│     ← Mayo 2026 →  [20]                             │
│                                                      │
│  2. ESTADO DEL DÍA                                   │
│     ☐ Día Abierto/Cerrado                          │
│     Hora Almuerzo: [12:00 ▼]                       │
│                                                      │
│  3. CITAS DEL DÍA (20 Mayo)                         │
│     ┌────────────────────────────────────────────┐  │
│     │ 08:00 │ Carlos         │ Corte     │ 573... │ ▼ │
│     │ 08:30 │ María          │ Barba     │ 573... │ ▼ │
│     │ 09:00 │ [DISPONIBLE]   │ ---       │ ---- │   │
│     │ 09:30 │ Juan           │ Keratina  │ 573... │ ▼ │
│     │ 10:00 │ Pedro          │ Corte+Bb  │ 573... │ ▼ │
│     │ ...   │ ...            │ ...       │ ...  │   │
│     └────────────────────────────────────────────┘  │
│                                                      │
│  4. ANALYTICS                                        │
│     Total Reservas: 1,284 | Ingresos: $9.2M       │
│     ════════════════════════════════════════        │
│     🔝 Corte y Barba (42%), Corte (28%), Barba (18%) │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 5. INTEGRACIONES TÉCNICAS

### 5.1 Google Calendar Integration

```typescript
// src/app/api/bookings/route.ts

import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const auth = new google.auth.JWT({
  email: process.env.FIREBASE_CLIENT_EMAIL,
  key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });

// Insertar evento
await calendar.events.insert({
  calendarId: process.env.GOOGLE_CALENDAR_ID,
  requestBody: {
    summary: `Barbería: ${service} - ${name}`,
    start: { dateTime: startDate, timeZone: 'America/Costa_Rica' },
    end: { dateTime: endDate, timeZone: 'America/Costa_Rica' },
  }
});
```

### 5.2 WhatsApp Integration (Twilio)

```typescript
// Opción 1: Twilio (RECOMENDADO)
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  from: 'whatsapp:+1234567890',
  to: `whatsapp:+${whatsapp}`,
  body: message
});

// Opción 2: Meta WhatsApp Business API
const response = await fetch(
  `https://graph.instagram.com/v18.0/${phoneNumber}/messages`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: whatsappNumber,
      type: 'text',
      text: { body: message }
    })
  }
);
```

### 5.3 Firebase Security Rules

```typescript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Bookings: Lectura pública, escritura desde API
    match /bookings/{document=**} {
      allow read: if true;
      allow create: if request.auth != null || request.auth.token.admin == true;
      allow update, delete: if request.auth.token.admin == true;
    }
    
    // Settings: Solo admin
    match /settings/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

---

## 6. CARACTERÍSTICAS DE RENDIMIENTO

### 6.1 Optimizaciones de Velocidad

```
Frontend:
├─ Next.js Image Optimization
│  └─ Lazy loading de imágenes
├─ Code Splitting automático
├─ CSS-in-JS minificado
└─ Caché de assets estáticos

Backend:
├─ Firebase CDN global
├─ Índices optimizados en Firestore
├─ Queries optimizadas por campos
└─ Compresión gzip en respuestas

Métricas Objetivo:
├─ First Contentful Paint (FCP): < 1.5s
├─ Largest Contentful Paint (LCP): < 2.5s
├─ Cumulative Layout Shift (CLS): < 0.1
└─ Time to Interactive (TTI): < 3.5s
```

### 6.2 Monitoreo de Performance

```typescript
// Integración con New Relic / Sentry
import * as Sentry from "@sentry/nextjs";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    // ... código
    Sentry.captureMessage('Booking created', 'info', {
      tags: { service: service, duration: Date.now() - startTime }
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}
```

---

## 7. SEGURIDAD Y COMPLIANCE

### 7.1 Layers de Seguridad

```
┌─────────────────────────────────────┐
│     SSL/TLS Encryption (HTTPS)      │  ← Transport Layer
├─────────────────────────────────────┤
│  JWT Authentication + 2FA           │  ← Authentication
├─────────────────────────────────────┤
│  Firebase Auth + Custom Claims      │  ← Authorization
├─────────────────────────────────────┤
│  Firestore Security Rules           │  ← Data Access Control
├─────────────────────────────────────┤
│  Rate Limiting (API)                │  ← DDoS Protection
├─────────────────────────────────────┤
│  Input Validation & Sanitization    │  ← Injection Prevention
├─────────────────────────────────────┤
│  CORS Configuration                 │  ← XSS Prevention
├─────────────────────────────────────┤
│  Secrets Management (Environment)   │  ← Credentials Protection
└─────────────────────────────────────┘
```

### 7.2 Cumplimiento GDPR/HABEAS

```typescript
// Políticas de datos personales
interface PersonalData {
  name: string;        // Nombre completo
  email: string;       // Email
  whatsapp: string;    // Teléfono
  bookingHistory: any[]; // Historial
}

// Opciones de usuario:
- Derecho al olvido (delete all data)
- Descargar datos (export JSON)
- Corregir datos (update profile)
- Revocar consentimiento (opt-out marketing)
```

---

## 8. ESCALABILIDAD FUTURA

### 8.1 Para Múltiples Sedes

```
Estructura escalada:
┌─────────────────────────────────────┐
│         Multi-Tenancy               │
├─────────────────────────────────────┤
│ Sede 1: San Ramón (actual)          │
│ Sede 2: Palmares (nueva)            │
│ Sede 3: San Isidro (nueva)          │
└─────────────────────────────────────┘

Collections de Firestore:
├── barbershops/
│   ├── {branchId1}/
│   │   ├── settings/
│   │   ├── bookings/
│   │   └── staff/
│   └── {branchId2}/
│       ├── settings/
│       ├── bookings/
│       └── staff/
```

### 8.2 Para Más Barberos por Sede

```
Sistema actual: 4 barberos
Sistema escalado: 40 barberos (10x)

Cambios necesarios:
├─ Asignación automática de barbero
├─ Sistema de rotación/turnos
├─ Agenda individual por barbero
├─ Permisos y roles diferenciados
└─ Reportes por barbero
```

### 8.3 Nuevas Características (Roadmap)

```
Trimestre 2:
├─ App móvil (React Native)
├─ Push notifications
└─ Integración con POS

Trimestre 3:
├─ Sistema de lealtad (puntos)
├─ Promociones automáticas
└─ Email marketing

Trimestre 4:
├─ IA chatbot 24/7
├─ Predicción de no-shows
└─ Análisis de comportamiento cliente
```

---

## 9. VARIABLES DE ENTORNO REQUERIDAS

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=***
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=***
NEXT_PUBLIC_FIREBASE_PROJECT_ID=***
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=***
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=***
NEXT_PUBLIC_FIREBASE_APP_ID=***

# Firebase Admin
FIREBASE_CLIENT_EMAIL=***
FIREBASE_PRIVATE_KEY=***

# Google Calendar
GOOGLE_CALENDAR_ID=***
GOOGLE_PRIVATE_KEY=***

# WhatsApp / Twilio
TWILIO_ACCOUNT_SID=***
TWILIO_AUTH_TOKEN=***
TWILIO_WHATSAPP_FROM=***

# Admin
ADMIN_PASSWORD=***

# Vercel (auto)
VERCEL_URL=***
```

---

## 10. TESTING Y CONTROL DE CALIDAD

### 10.1 Estrategia de Testing

```typescript
// Unit Tests
test('formatDateKey debe formatear fecha correctamente', () => {
  const result = formatDateKey('2026-05-20');
  expect(result).toBe('2026-05-20');
});

// Integration Tests
test('Crear booking debe guardar en Firestore', async () => {
  const response = await POST(mockRequest);
  expect(response.status).toBe(200);
});

// E2E Tests (Playwright)
test('Usuario debe poder hacer reserva completa', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="select-date"]');
  // ... más interacciones
});
```

---

## 11. DEPLOYMENT Y CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

---

## 12. MONITOREO EN PRODUCCIÓN

```
Dashboard de Monitoreo:
├─ Uptime: 99.9%+
├─ Latencia API: < 200ms
├─ Errores: < 0.1%
├─ Usuarios activos: Real-time
├─ Citas por hora: Gráfico en vivo
└─ Ingresos: Dashboard financiero
```

---

**Documento preparado:** Mayo 2026  
*Arquitectura basada en análisis del proyecto Mr Johns Barbier*


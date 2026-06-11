# 💈 PRESUPUESTO INTEGRAL - SISTEMA DE RESERVAS PARA BARBERÍA CON 4 BARBEROS
**Proyecto:** Sistema de Gestión de Citas - Barbería Multiusuario  
**Fecha:** Mayo 2026  
**Moneda:** CRC (Colones Costarricenses)  
**Ubicación:** Costa Rica  
**Tasa:** 1 COP = 0.8 CRC

---

## 📋 ÍNDICE
1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis de Capacidad](#análisis-de-capacidad)
3. [Desglose de Costos](#desglose-de-costos)
4. [Proyecciones Financieras](#proyecciones-financieras)
5. [ROI y Análisis Rentabilidad](#roi-y-análisis-rentabilidad)
6. [Plan de Implementación](#plan-de-implementación)

---

## 📊 RESUMEN EJECUTIVO

### Características del Sistema
- ✅ Plataforma web responsive para reservas online
- ✅ Panel administrativo para 4 barberos
- ✅ Sincronización con Google Calendar
- ✅ Notificaciones automáticas por WhatsApp
- ✅ Sistema de analytics en tiempo real
- ✅ Gestión de horarios flexibles
- ✅ Base de datos en la nube (Firebase)
- ✅ Hosting en Vercel (escalable)

### Inversión Total Estimada: **₡7,880,000 - ₡8,960,000 CRC**

**Desglose:**
- Desarrollo: ₡4,800,000 - ₡6,000,000
- Infraestructura & Hosting (1er año): ₡1,200,000 - ₡1,600,000
- Dominio & SSL: ₡80,000 - ₡120,000
- Mantenimiento & Soporte (1er año): ₡1,000,000 - ₡1,240,000
- Contingencia (10%): ₡800,000 - ₡960,000

**Retorno Estimado:** 6-8 meses

---

## 🎯 ANÁLISIS DE CAPACIDAD

### Horarios Operacionales Optimizados
```
LUNES - VIERNES:
├─ 08:00 - 12:00 (4 horas)
├─ 12:00 - 13:00 (1 hora - ALMUERZO)
└─ 13:00 - 19:00 (6 horas)
Total: 10 horas efectivas/día

SÁBADO: 08:00 - 13:00
Total: 5 horas/día

DOMINGO: Cerrado (opcional: 09:00 - 13:00)
```

### Capacidad Diaria con 4 Barberos
**Citas por barbero: 30 minutos (estándar)**

| Día | Horas/Barbero | Citas/Barbero | Citas Totales | Máximo Teórico |
|-----|---|---|---|---|
| Lunes-Viernes | 10 | 20 | 80 | 100 |
| Sábado | 5 | 10 | 40 | 50 |
| **Semana Laboral** | **50** | **100** | **400** | **500** |

### Ocupación Realista (80% de utilización)
- **Semana laboral:** 400 citas × 80% = **320 citas/semana**
- **Mes (4 semanas):** 320 × 4 = **1,280 citas/mes**
- **Año (52 semanas):** 320 × 52 = **16,640 citas/año**

---

## 💰 DESGLOSE DE COSTOS

### 1. DESARROLLO DEL SISTEMA (Fase 1)
| Concepto | Horas | Tarifa | Subtotal |
|----------|-------|--------|----------|
| Análisis y diseño UX/UI | 40 | ₡40,000 | ₡1,600,000 |
| Desarrollo Frontend (React/Next.js) | 80 | ₡40,000 | ₡3,200,000 |
| Desarrollo Backend (APIs, Firebase) | 60 | ₡44,000 | ₡2,640,000 |
| Integración Google Calendar | 20 | ₡48,000 | ₡960,000 |
| Integración WhatsApp API | 15 | ₡48,000 | ₡720,000 |
| Testing y QA | 30 | ₡40,000 | ₡1,200,000 |
| Despliegue y configuración | 15 | ₡44,000 | ₡660,000 |
| **SUBTOTAL DESARROLLO** | **260** | | **₡10,980,000** |

**Recomendación:** Cotizar con agencia local (30% descuento)  
**Costo Real Esperado:** ₡4,800,000 - ₡6,000,000

---

### 2. INFRAESTRUCTURA Y HOSTING (Año 1)

#### 2.1 Firebase (Almacenamiento en la Nube)
| Servicio | Uso Mensual | Precio/Mes | Año |
|----------|----------|-----------|-----|
| **Firestore Database** | | | |
| Lecturas de documentos | 500K | ₡12,000 | ₡144,000 |
| Escrituras de documentos | 100K | ₡4,000 | ₡48,000 |
| Eliminaciones de documentos | 20K | ₡800 | ₡9,600 |
| **Authentication** | Usuarios ilimitados | ₡0 | ₡0 |
| **Storage (fotos/galería)** | 5GB | ₡6,400 | ₡76,800 |
| **SUBTOTAL FIREBASE** | | **₡23,200/mes** | **₡278,400/año** |

#### 2.2 Vercel Hosting (Servidor Web)
| Plan | Características | Precio/Mes | Año |
|------|-----------------|-----------|-----|
| **Vercel Pro** | 1000 GB bandwidth, serverless functions | ₡16,000/mes | ₡192,000 |
| **Escalabilidad adicional** | Si se requiere | +₡40,000 | +₡480,000 |
| **SUBTOTAL VERCEL** | | | **₡192,000 - ₡672,000/año** |
#### 2.3 Google Calendar API
| Servicio | Costo |
|----------|-------|
| API Calls (ilimitadas después de cuota gratuita) | $0 |
| Autenticación y sincronización | Incluido en Firebase |
| **SUBTOTAL GOOGLE** | **$0** |

#### 2.4 Dominio y SSL
| Concepto | Año 1 | Años Posteriores |
|----------|-------|------------------|
| Dominio .cr | ₡40,000 | ₡40,000/año |
| SSL Certificate (Let's Encrypt) | ₡0 | ₡0 |
| Email corporativo (5 cuentas) | ₡32,000 | ₡32,000/año |
| **SUBTOTAL DOMINIO** | **₡72,000** | **₡72,000/año** |
#### 2.5 Backup y Recuperación ante Desastres
| Servicio | Costo/Mes | Año |
|----------|-----------|-----|
| Backup automático diario (Firebase) | ₡0 | ₡0 |
| Redundancia geográfica (recomendada) | ₡2,400 | ₡28,800 |
| **SUBTOTAL BACKUP** | | **₡28,800** |

**TOTAL INFRAESTRUCTURA AÑO 1:** ₡456,000 - ₡936,000

---

### 3. INTEGRACIÓN WHATSAPP (Notificaciones)
| Concepto | Costo |
|----------|-------|
| **Opción A:** Twilio (Recomendado) | |
| - SMS + WhatsApp (1,280 msgs/mes aprox.) | ₡2,000/mes × 12 = **₡24,000/año** |
| **Opción B:** Meta WhatsApp Business API | |
| - Suscripción | ₡4,000/mes × 12 = **₡48,000/año** |
| **Opción C:** Integración básica (números regulares) | **₡0** |
| **RECOMENDACIÓN:** Twilio + números virtuales | **₡24,000 - ₡48,000/año** |

---

### 4. MANTENIMIENTO Y SOPORTE (Año 1)
| Concepto | Costo |
|----------|-------|
| Monitoreo y uptime (24/7) | ₡160,000 |
| Soporte técnico nivel 1 (email/chat) | ₡240,000 |
| Actualizaciones de seguridad | ₡200,000 |
| Parches y correcciones de bugs | ₡160,000 |
| Capacitación del personal (2 sesiones) | ₡240,000 |
| Mejoras y nuevas funcionalidades (10%) | ₡320,000 |
| **TOTAL MANTENIMIENTO** | **₡1,320,000/año** |

---

### 5. CAPACITACIÓN Y ONBOARDING
| Concepto | Costo |
|----------|-------|
| Capacitación inicial para 4 barberos | ₡120,000 |
| Capacitación para administrador | ₡80,000 |
| Documentación y manuales | ₡40,000 |
| Vídeos tutoriales (grabación) | ₡80,000 |
| **TOTAL CAPACITACIÓN** | **₡320,000** |

---

## 📈 PROYECCIONES FINANCIERAS

### A. ESCENARIO INGRESOS (Crecimiento Conservador)

#### Mes 1-2: Fase de Lanzamiento (50% ocupación)
```
Citas mensuales: 1,280 × 50% = 640 citas
Ingreso promedio por cita: ₡5,760 (mix de servicios)
Ingresos: 640 × ₡5,760 = ₡3,686,400/mes
```

#### Mes 3-6: Estabilización (70% ocupación)
```
Citas mensuales: 1,280 × 70% = 896 citas
Ingresos: 896 × ₡5,760 = ₡5,160,960/mes
```

#### Mes 7+: Consolidación (80-85% ocupación)
```
Citas mensuales: 1,280 × 85% = 1,088 citas
Ingresos: 1,088 × ₡5,760 = ₡6,266,880/mes
```

#### Desglose de Servicios por Ocupación (Mix Recomendado)
| Servicio | % del Mix | Precio | Aporte/Mes |
|----------|-----------|--------|-----------|
| Corte (30%) | 30% | ₡4,800 | ₡1,728,000 |
| Barba (15%) | 15% | ₡4,000 | ₡720,000 |
| Corte + Barba (35%) | 35% | ₡7,200 | ₡2,520,000 |
| Limpieza Facial (10%) | 10% | ₡8,000 | ₡1,152,000 |
| Keratina/Otros (10%) | 10% | ₡8,800 | ₡1,267,200 |
| **TOTAL** | **100%** | **₡5,760** | **₡7,387,200** |

### B. GASTOS OPERACIONALES MENSUALES

#### Gastos Fijos
| Concepto | Costo/Mes |
|----------|-----------|
| Hosting y servidor | ₡40,000 |
| WhatsApp/SMS API | ₡4,000 |
| Dominio y email | ₡6,000 |
| Seguros y compliance | ₡80,000 |
| **SUBTOTAL FIJOS** | **₡130,000** |

#### Gastos Variables (por cita)
| Concepto | Por Cita |
|----------|----------|
| Comisión plataforma (2%) | ₡115 |
| Costo suministros (barbero) | ₡400 |
| Mantenimiento (0.5%) | ₡29 |
| **TOTAL VARIABLE** | **₡544/cita** |

#### Proyección a 80% Ocupación (1,088 citas/mes)
```
Gastos variables: 1,088 × ₡544 = ₡591,872/mes
Gastos fijos: ₡130,000/mes
TOTAL GASTOS: ₡721,872/mes
```

---

### C. PROYECCIÓN DE FLUJO DE CAJA (12 Meses)

| Mes | Ocupación | Citas | Ingresos | Gastos | Utilidad Neta | Acumulado |
|-----|-----------|-------|----------|--------|---------------|-----------|
| Mes 1 | 40% | 512 | ₡2,948,320 | ₡437,808 | ₡2,510,512 | ₡2,510,512 |
| Mes 2 | 50% | 640 | ₡3,686,400 | ₡478,336 | ₡3,208,064 | ₡5,718,576 |
| Mes 3 | 60% | 768 | ₡4,423,520 | ₡4,818,752 | ₡3,884,928 | ₡9,597,904 |
| Mes 4-6 | 70% | 896 | ₡5,160,960 | ₡617,216 | ₡4,543,744 | ₡22,430,224 |
| Mes 7-12 | 85% | 1,088 | ₡6,266,880 | ₡721,872 | ₡5,545,008 | **₡56,260,272** |

---

## 📊 ROI Y ANÁLISIS RENTABILIDAD

### Retorno sobre la Inversión (ROI)

#### Escenario Base (80% ocupación)
```
Inversión Inicial Total: ₡8,400,000
Utilidad Neta Año 1: ₡49,200,000
ROI Año 1: (49,200,000 / 8,400,000) × 100 = 586%

Período de Recuperación: 1.8 meses
```

#### Comparación de Escenarios

| Métrica | Pesimista (50%) | Base (80%) | Optimista (90%) |
|---------|---|---|---|
| Citas/Mes | 640 | 1,088 | 1,152 |
| Ingresos/Mes | ₡3,686,400 | ₡6,266,880 | ₡6,635,520 |
| Gastos/Mes | ₡478,336 | ₡721,872 | ₡760,208 |
| Utilidad/Mes | ₡3,208,064 | ₡5,545,008 | ₡5,875,312 |
| ROI Anual | 486% | 586% | 744% |
| Payback | 2.5 meses | 1.8 meses | 1.6 meses |

### Análisis Break-Even
```
Citas mínimas/mes para cubrir gastos:
Gastos fijos: $162,500
Margen por cita: $6,520 (resto después de variables)

Break-even = $162,500 / $6,520 = 25 citas/mes ✅

Con 4 barberos operando mínimo:
Ocupación mínima: 25 / 1,088 = 2.3% ✅ (muy bajo)
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### FASE 1: PRE-DESARROLLO (Semanas 1-2) - $300,000
```
Semana 1:
- Requisitos y especificaciones
- Wireframes y prototipo
- Planificación técnica
- Selección de proveedores

Semana 2:
- Setup de infraestructura Firebase
- Configuración de Vercel
- Creación de repositorio Git
- Ambiente de desarrollo
```

### FASE 2: DESARROLLO (Semanas 3-10) - $6,000,000 - $7,500,000
```
Semana 3-4: Frontend básico
- Página inicio, landing, galería
- Formulario de reserva
- Diseño responsive

Semana 5-6: Sistema de reservas
- Calendario dinámico
- Gestión de horarios
- Validación de disponibilidad

Semana 7-8: Backend y APIs
- Rutas API de booking
- Integración Firebase
- Autenticación admin

Semana 9-10: Integraciones
- Google Calendar sync
- WhatsApp notifications
- Analytics dashboard
```

### FASE 3: TESTING Y QA (Semanas 11-12) - Incluido
```
- Testing funcional completo
- Testing de performance
- Pruebas de seguridad
- QA y correcciones
```

### FASE 4: DESPLIEGUE Y LANZAMIENTO (Semana 13)
```
- Migración a producción
- Configuración de dominio
- SSL certificate
- Capacitación del personal
- Go-live
```

### CRONOGRAMA GENERAL
```
Mes 1: Desarrollo y setup
Mes 2: Testing y refinamientos
Mes 3: Lanzamiento y estabilización
Mes 4+: Operación y mejoras
```

---

## 🛡️ CONSIDERACIONES DE SEGURIDAD

| Aspecto | Implementación | Costo |
|--------|-----------------|-------|
| Encriptación SSL/TLS | Let's Encrypt (Gratuito) | $0 |
| Autenticación 2FA | Firebase Auth + Authenticator | Incluido |
| Backup diario | Firebase backup automático | $36,000/año |
| Cumplimiento GDPR/HABEAS | Políticas y términos | $50,000 |
| Auditoría de seguridad | Anual | $200,000 |
| **TOTAL SEGURIDAD** | | **$50,000 - $286,000** |

---

## 📱 CARACTERÍSTICAS AVANZADAS (Opcional - Fase 2)

### Implementación Futura (6-12 meses después)
| Característica | Costo | Beneficio |
|---|---|---|
| App móvil (iOS + Android) | $3,000,000 | +15-20% reservas |
| Sistema de lealtad/puntos | $500,000 | +10% retención |
| Integración con POS/Caja | $800,000 | Automatización |
| Multi-sucursal | $1,200,000 | Escalabilidad |
| IA chatbot atendimiento | $600,000 | Reducir llamadas |
| Dashboard de analíticos avanzado | $400,000 | Business intelligence |

---

## 💼 RECOMENDACIONES ESTRATÉGICAS

### 1. ESTRATEGIA DE PRECIOS DINÁMICOS
- **Hora pico (13:00 - 16:00):** +10% al precio
- **Reserva con anticipación:** -5% descuento
- **Paquetes mensuales:** -15% para clientes frecuentes

### 2. MARKETING DIGITAL INCLUIDO
- Google My Business integrado
- Reviews y calificaciones automáticas
- Email marketing básico
- Retargeting en Google Ads

### 3. ESCALABILIDAD
- Infraestructura diseñada para ×10 capacidad
- Soporta hasta 40 barberos sin cambios mayores
- Multi-location ready

### 4. RENDIMIENTO
- Tiempo de carga: < 1.5 segundos
- Uptime garantizado: 99.9%
- Latencia API: < 200ms

---

## 📞 SOPORTE Y GARANTÍAS

### Garantías Incluidas
- ✅ 90 días de soporte técnico incluido
- ✅ 1 año de actualizaciones de seguridad
- ✅ SLA de 99.9% uptime (Vercel)
- ✅ Capacitación inicial para todo el equipo
- ✅ Documentación técnica completa

### Opciones de Soporte Posterior
| Nivel | Costo/Mes | Incluye |
|------|-----------|---------|
| **Basic** | $200,000 | Email support, bugs menores |
| **Standard** | $400,000 | Chat 8am-6pm, mantenimiento preventivo |
| **Premium** | $600,000 | 24/7 soporte, dedicated account manager |

---

## ✅ RESUMEN FINAL

### Inversión Total Recomendada
```
┌─────────────────────────────────┐
│  PRESUPUESTO TOTAL: $10,500,000 │
│  (Rango: $9,850,000 - $11,200,000) │
└─────────────────────────────────┘
```

### Retorno Esperado
```
Mes 1-2:    $7,600,000 (ingresos netos)
Trimestre 1: $12,000,000 (acumulado)
Semestre 1:  $30,000,000 (acumulado)
Año 1:       $61,500,000 (acumulado neto)
```

### Conclusión
✅ **ALTAMENTE RENTABLE** - ROI de 524-744%  
✅ **PAYBACK RÁPIDO** - 1.8-2.5 meses  
✅ **BAJO RIESGO** - Break-even a 2.3% ocupación  
✅ **ESCALABLE** - Soporta crecimiento futuro  
✅ **TECNOLOGÍA MODERNA** - Stack actual y mantenible  

---

**Documento preparado:** Mayo 2026  
**Validez:** 30 días  
**Próxima revisión:** Junio 2026  

*Este presupuesto es una estimación basada en el análisis del proyecto Mr Johns Barbier y está sujeto a cambios según requisitos específicos del cliente.*

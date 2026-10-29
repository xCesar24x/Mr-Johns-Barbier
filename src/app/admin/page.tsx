"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { format, startOfToday, isSameDay, addDays, getDay } from "date-fns";
import { es } from "date-fns/locale";
import { 
  Calendar, 
  Trash2, 
  Power, 
  Scissors, 
  User, 
  Phone, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Check, 
  X, 
  MessageSquare, 
  Lock,
  Sparkles,
  Plus,
  Edit3,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import ServiceIcon, { AVAILABLE_SERVICE_ICONS } from "@/components/ServiceIcon";
import { ServiceItem } from "@/types/service";
import { formatDuration } from "@/lib/defaultServices";
import { getOccupiedSlotsForBooking } from "@/lib/utils";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [bookings, setBookings] = useState<any[]>([]);
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [lunchTime, setLunchTime] = useState("none");
  const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
  
  // Navigation Tabs: Agenda vs Servicios
  const [activeTab, setActiveTab] = useState<"bookings" | "services">("bookings");

  // Servicios State
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [serviceModal, setServiceModal] = useState<{
    isOpen: boolean;
    mode: "create" | "edit";
    service: Partial<ServiceItem>;
  } | null>(null);
  const [isSavingService, setIsSavingService] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notificationModal, setNotificationModal] = useState<{
    booking: any;
    type: "confirm" | "cancel";
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const getWhatsAppUrl = (booking: any, type: "confirm" | "cancel", appType: "business" | "personal" | "standard") => {
    const cleanPhone = (booking.whatsapp || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('506') ? cleanPhone : '506' + cleanPhone;
    
    const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
    const isMultiple = (booking.service || '').includes(',');
    const serviceLabel = isMultiple ? "los servicios de" : "el servicio de";
    
    let message = "";
    if (type === "confirm") {
      message = `Hola Sr(a). *${booking.name}*, le saluda Jonathan de Mr. John's Barbier. 💈\n\nLe confirmo que su cita para el día *${dateStr}* a las *${booking.time}* para ${serviceLabel} *${booking.service}* ha sido *confirmada* con éxito. 👍\n\n¡Le esperamos!`;
    } else {
      message = `Hola Sr(a). *${booking.name}*, le saluda Jonathan de Mr. John's Barbier. 💈\n\nLamentablemente, por motivos de fuerza mayor no podré atenderle en su cita programada para el día *${dateStr}* a las *${booking.time}* (${isMultiple ? 'los servicios de ' : ''}*${booking.service}*). 😔\n\n¿Le quedaría bien si la reprogramamos para otra hora o día? Quedo a su disposición para coordinar.`;
    }
    
    const encodedText = encodeURIComponent(message);
    
    if (appType === 'business') {
      return `whatsapp://send?phone=${phoneWithCountry}&text=${encodedText}`;
    } else if (appType === 'personal') {
      return `whatsapp-consumer://send?phone=${phoneWithCountry}&text=${encodedText}`;
    } else {
      return `https://wa.me/${phoneWithCountry}?text=${encodedText}`;
    }
  };

  const fetchDayData = useCallback(async () => {
    setIsLoading(true);
    try {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const res = await fetch(`/api/admin/bookings?date=${dateKey}`);
      const data = await res.json();
      
      const sortedBookings = (data.bookings || []).sort((a: any, b: any) => 
        a.time.localeCompare(b.time, undefined, { numeric: true })
      );
      
      setBookings(sortedBookings);
      setIsDayClosed(data.isClosed || false);
      setLunchTime(data.lunchTime || "none");
      setBlockedSlots(data.blockedSlots || []);
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  const fetchServices = useCallback(async () => {
    setIsLoadingServices(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServicesList(data.services);
      }
    } catch (e) {
      console.error("Error al cargar servicios en admin:", e);
    } finally {
      setIsLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDayData();
      fetchServices();
    }
  }, [isAuthenticated, fetchDayData, fetchServices]);

  const toggleDayStatus = async () => {
    const newStatus = isDayClosed ? 'open' : 'closed';
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-day', date: dateKey, status: newStatus })
      });
      setIsDayClosed(!isDayClosed);
    } catch {
      alert("Error al cambiar estado del día");
    }
  };

  const handleLunchChange = async (newTime: string) => {
    setLunchTime(newTime);
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set-lunch', date: dateKey, lunchTime: newTime })
      });
    } catch {
      alert("Error al guardar la hora de almuerzo");
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm("¿Seguro que deseas cancelar esta cita? Se liberará el espacio en la web.")) return;
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel-booking', bookingId: id })
      });
      setBookings(bookings.filter(b => b.id !== id));
      fetchDayData();
    } catch {
      alert("Error al cancelar");
    }
  };

  const toggleBlockSlot = async (slot: string) => {
    let newBlockedSlots = [...blockedSlots];
    if (newBlockedSlots.includes(slot)) {
      newBlockedSlots = newBlockedSlots.filter(s => s !== slot);
    } else {
      newBlockedSlots.push(slot);
    }
    setBlockedSlots(newBlockedSlots);

    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'set-blocked-slots', date: dateKey, blockedSlots: newBlockedSlots })
      });
    } catch {
      alert("Error al guardar bloqueo de hora");
    }
  };

  const getDaySlots = () => {
    const dayOfWeek = getDay(selectedDate); // 0 = Sun, 6 = Sat
    const slots = [];
    if (dayOfWeek === 6) return []; // Saturdays closed anyway

    const startHour = dayOfWeek === 0 ? 7 : 8;
    const endHour = dayOfWeek === 0 ? 12 : 19;

    for (let h = startHour; h <= endHour; h++) {
      slots.push(`${h}:00`);
      if (h === endHour) break;
      slots.push(`${h}:30`);
    }
    return slots;
  };

  const occupiedByBookingsSet = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach(b => {
      const slots = getOccupiedSlotsForBooking(b.time, Number(b.duration) > 0 ? Number(b.duration) : 60);
      slots.forEach(s => set.add(s));
    });
    return set;
  }, [bookings]);

  const occupiedByLunchSet = useMemo(() => {
    const set = new Set<string>();
    if (lunchTime && lunchTime !== 'none') {
      getOccupiedSlotsForBooking(lunchTime, 60).forEach(s => set.add(s));
    }
    return set;
  }, [lunchTime]);

  // Service Management Actions
  const handleOpenCreateService = () => {
    setServiceModal({
      isOpen: true,
      mode: "create",
      service: {
        title: "",
        price: 5000,
        duration: 60,
        description: "",
        icon: "scissors",
        active: true,
      }
    });
  };

  const handleOpenEditService = (srv: ServiceItem) => {
    setServiceModal({
      isOpen: true,
      mode: "edit",
      service: { ...srv }
    });
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceModal) return;

    const { mode, service } = serviceModal;
    if (!service.title?.trim() || service.price === undefined || service.price === null) {
      alert("Por favor completa el título y precio del servicio.");
      return;
    }

    setIsSavingService(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode === "create" ? "create" : "update",
          service: {
            ...service,
            price: Number(service.price) || 0,
            duration: Number(service.duration) > 0 ? Number(service.duration) : 60,
          }
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServicesList(data.services);
        setServiceModal(null);
        showToast(mode === "create" ? "✨ ¡Servicio creado con éxito!" : "✅ ¡Servicio actualizado con éxito!");
        // Refresh analytics so new prices reflect immediately
        fetchDayData();
      } else {
        alert(data.error || "Error al guardar el servicio");
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setIsSavingService(false);
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`¿Deseas eliminar "${title}" del catálogo? Ya no aparecerá en la página web.`)) return;

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", serviceId: id })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServicesList(data.services);
        showToast(`🗑️ Servicio "${title}" eliminado`);
        fetchDayData();
      } else {
        alert(data.error || "Error al eliminar");
      }
    } catch {
      alert("Error al eliminar servicio");
    }
  };

  const handleToggleServiceActive = async (srv: ServiceItem) => {
    const newActive = srv.active === false ? true : false;
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          service: { id: srv.id, active: newActive }
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServicesList(data.services);
        showToast(newActive ? "👁️ Servicio visible en la web" : "⏸️ Servicio pausado (oculto en la web)");
      }
    } catch {
      alert("Error al cambiar estado");
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm("¿Deseas restaurar el catálogo a los 7 servicios originales de Mr. John's Barbier? Esta acción sobreescribirá cambios actuales.")) return;

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-defaults" })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.services)) {
        setServicesList(data.services);
        showToast("↺ Catálogo restaurado a valores por defecto");
        fetchDayData();
      }
    } catch {
      alert("Error al restaurar catálogo");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Johns2026") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal texture-leather flex items-center justify-center p-4">
        <div className="glass p-8 rounded-sm max-w-sm w-full border-t-4 border-t-gold shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg">
              <Scissors className="text-charcoal" size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center mb-2 text-parchment">Acceso Privado</h2>
          <p className="text-gold/60 text-xs text-center uppercase tracking-widest font-bold mb-8">Mr. John's Barbier</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Contraseña Maestra"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white/5 border ${loginError ? 'border-red-500' : 'border-white/10'} p-4 rounded-sm text-center text-gold focus:outline-none focus:border-gold transition-all`}
              />
              {loginError && <p className="text-red-500 text-[10px] uppercase font-bold text-center mt-2">Contraseña Incorrecta</p>}
            </div>
            <button className="w-full bg-gold text-charcoal py-4 rounded-sm font-bold uppercase tracking-widest hover:bg-bronze transition-all shadow-lg">
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal texture-leather text-parchment p-4 md:p-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal border-2 border-gold text-parchment px-5 py-4 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="text-gold" size={20} />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
              <Scissors className="text-charcoal" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Panel de Jona</h1>
              <p className="text-gold/60 text-xs uppercase tracking-widest font-bold">Administración y Control</p>
            </div>
          </div>

          {/* Navigation Tab Switcher */}
          <div className="flex bg-white/5 p-1 rounded-sm border border-white/10 gap-1 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 md:flex-initial px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'bookings'
                  ? 'bg-gold text-charcoal shadow-lg'
                  : 'text-parchment/60 hover:text-parchment hover:bg-white/5'
              }`}
            >
              <Calendar size={16} /> Agenda & Citas
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex-1 md:flex-initial px-5 py-2.5 rounded-sm font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-gold text-charcoal shadow-lg'
                  : 'text-parchment/60 hover:text-parchment hover:bg-white/5'
              }`}
            >
              <Sparkles size={16} /> Servicios & Precios
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: AGENDA & CITAS (EXISTENTE) */}
        {/* ============================================================== */}
        {activeTab === 'bookings' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Date Switcher */}
            <div className="flex justify-center md:justify-end">
              <div className="flex items-center gap-4 bg-white/5 p-2 rounded-full border border-white/10">
                <button onClick={() => setSelectedDate(addDays(selectedDate, -1))} className="p-2 hover:bg-gold/20 rounded-full transition-colors text-gold">
                  <ChevronLeft size={24} />
                </button>
                <div className="px-4 font-serif text-lg min-w-[180px] text-center">
                  {isSameDay(selectedDate, startOfToday()) ? "Hoy, " : ""}
                  {format(selectedDate, "d 'de' MMMM", { locale: es })}
                </div>
                <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 hover:bg-gold/20 rounded-full transition-colors text-gold">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-sm border-b-2 border-b-gold">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold"><DollarSign size={20} /></div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Ingresos Totales (Est.)</p>
                </div>
                <h3 className="text-3xl font-serif font-bold text-gold">
                  {analytics ? `₡${analytics.totalRevenue.toLocaleString()}` : '...'}
                </h3>
              </div>
              <div className="glass p-6 rounded-sm border-b-2 border-b-gold">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold"><Users size={20} /></div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Citas Totales</p>
                </div>
                <h3 className="text-3xl font-serif font-bold text-gold">
                  {analytics ? analytics.totalBookings : '...'}
                </h3>
              </div>
              <div className="glass p-6 rounded-sm border-b-2 border-b-gold">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold"><TrendingUp size={20} /></div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Servicio más pedido</p>
                </div>
                <h3 className="text-xl font-serif font-bold text-gold truncate">
                  {analytics && analytics.popularServices.length > 0 ? analytics.popularServices[0].name : '...'}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main List */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-serif flex items-center gap-2">
                  <Calendar className="text-gold" size={20} />
                  Agenda para este día
                </h2>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="py-20 text-center opacity-40">Cargando agenda...</div>
                  ) : bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <div key={booking.id} className="glass p-5 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold/40 transition-colors group">
                        <div className="flex items-center gap-6">
                          <div className="text-2xl font-serif font-bold text-gold w-20">
                            {booking.time}
                          </div>
                          <div className="space-y-1">
                            <div className="font-bold text-lg flex items-center gap-2">
                              <User size={16} className="text-gold/40" />
                              {booking.name}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm opacity-60">
                              <span className="flex items-center gap-1 uppercase tracking-tighter font-bold">
                                <Scissors size={14} /> {booking.service || 'Servicio'} 
                                <span className="text-gold/80 font-normal">({formatDuration(booking.duration || 60)})</span>
                              </span>
                              <a href={`https://wa.me/${(booking.whatsapp || '').replace(/\D/g,'')}`} target="_blank" className="flex items-center gap-1 text-gold hover:underline"><Phone size={14} /> {booking.whatsapp || 'Sin teléfono'}</a>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {/* Botón de Confirmación (Check Verde) */}
                          <button
                            onClick={() => setNotificationModal({ booking, type: "confirm" })}
                            className="p-3 text-green-500/40 hover:text-green-500 hover:bg-green-500/10 rounded-sm transition-all"
                            title="Confirmar cita por WhatsApp"
                          >
                            <Check size={20} />
                          </button>
                          
                          {/* Botón de Cancelación (Equis Roja) */}
                          <button
                            onClick={() => setNotificationModal({ booking, type: "cancel" })}
                            className="p-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all"
                            title="Notificar cancelación por WhatsApp"
                          >
                            <X size={20} />
                          </button>

                          {/* Botón de Eliminar (Basurero) */}
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            className="p-3 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all"
                            title="Eliminar cita del sistema"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass p-12 text-center rounded-sm border-dashed border-2 border-white/5 opacity-40 italic">
                      No hay citas para este día.
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar / Settings */}
              <div className="space-y-8">
                <div className="glass p-6 rounded-sm space-y-6">
                  <h3 className="font-serif text-lg flex items-center gap-2">
                    <Power className="text-gold" size={18} />
                    Estado del Día
                  </h3>
                  <div className={`p-6 rounded-sm flex items-center justify-between border ${isDayClosed ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                    <div>
                      <p className="font-bold">{isDayClosed ? "Cerrado" : "Abierto"}</p>
                      <p className="text-[10px] opacity-60 uppercase tracking-widest">Para reservas web</p>
                    </div>
                    <button 
                      onClick={toggleDayStatus}
                      className={`p-4 rounded-full transition-all shadow-lg ${isDayClosed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      <Power size={20} className="text-white" />
                    </button>
                  </div>
                </div>
     
                {/* Hora de Almuerzo */}
                <div className="glass p-6 rounded-sm space-y-4">
                  <h3 className="font-serif text-lg flex items-center gap-2">
                    <Clock className="text-gold" size={18} />
                    Hora de Almuerzo
                  </h3>
                  <p className="text-xs opacity-60 uppercase tracking-widest leading-relaxed">
                    Bloqueará 1 hora en la web (el espacio seleccionado y el siguiente).
                  </p>
                  <div className="relative">
                    <select
                      value={lunchTime}
                      onChange={(e) => handleLunchChange(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 pr-10 text-parchment focus:border-gold outline-none transition-colors appearance-none font-bold cursor-pointer"
                    >
                      <option value="none" className="bg-charcoal text-parchment">Ninguno (Día Completo)</option>
                      <option value="11:00" className="bg-charcoal text-parchment">11:00 AM</option>
                      <option value="11:30" className="bg-charcoal text-parchment">11:30 AM</option>
                      <option value="12:00" className="bg-charcoal text-parchment">12:00 PM</option>
                      <option value="12:30" className="bg-charcoal text-parchment">12:30 PM</option>
                      <option value="13:00" className="bg-charcoal text-parchment">1:00 PM</option>
                      <option value="13:30" className="bg-charcoal text-parchment">1:30 PM</option>
                      <option value="14:00" className="bg-charcoal text-parchment">2:00 PM</option>
                      <option value="14:30" className="bg-charcoal text-parchment">2:30 PM</option>
                      <option value="15:00" className="bg-charcoal text-parchment">3:00 PM</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold font-bold">▼</div>
                  </div>
                </div>

                {/* Bloqueo de Horas Específicas */}
                <div className="glass p-6 rounded-sm space-y-4">
                  <h3 className="font-serif text-lg flex items-center gap-2">
                    <Lock className="text-gold" size={18} />
                    Bloqueo de Horas
                  </h3>
                  <p className="text-xs opacity-60 uppercase tracking-widest leading-relaxed">
                    Selecciona las horas específicas que deseas bloquear en la web.
                  </p>
                  
                  {getDaySlots().length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                      {getDaySlots().map(slot => {
                        const isBlocked = blockedSlots.includes(slot);
                        const isOccupiedByBooking = occupiedByBookingsSet.has(slot);
                        const isOccupiedByLunch = occupiedByLunchSet.has(slot);
                        const isUnavailable = isOccupiedByBooking || isOccupiedByLunch;
                        
                        return (
                          <button
                            key={slot}
                            disabled={isUnavailable}
                            onClick={() => toggleBlockSlot(slot)}
                            className={`py-2 rounded-sm text-[10px] font-bold transition-all border flex flex-col items-center justify-center gap-1 ${
                              isUnavailable
                                ? 'border-transparent bg-white/5 text-white/20 cursor-not-allowed'
                                : isBlocked
                                  ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30'
                                  : 'border-white/10 text-parchment/60 hover:border-gold hover:text-gold'
                            }`}
                            title={
                              isOccupiedByBooking
                                ? "Horario reservado por cita de cliente"
                                : isOccupiedByLunch
                                  ? "Horario de almuerzo configurado"
                                  : ""
                            }
                          >
                            <span>{slot}</span>
                            {isOccupiedByBooking ? (
                              <span className="text-[8px] opacity-40 uppercase">Reservado</span>
                            ) : isOccupiedByLunch ? (
                              <span className="text-[8px] text-gold/50 uppercase">Almuerzo</span>
                            ) : isBlocked ? (
                              <span className="text-[8px] text-red-500/80 uppercase font-bold">Bloqueado</span>
                            ) : (
                              <span className="text-[8px] opacity-30 uppercase">Libre</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gold/60 italic">No laborable este día (sábado).</p>
                  )}
                </div>

                {analytics && (
                  <div className="glass p-6 rounded-sm space-y-6">
                    <h3 className="font-serif text-lg flex items-center gap-2">
                      <TrendingUp className="text-gold" size={18} />
                      Top Servicios
                    </h3>
                    <div className="space-y-4">
                      {analytics.popularServices.map((service: any, i: number) => (
                        <div key={service.name} className="flex justify-between items-center text-sm">
                          <span className="opacity-60">{i+1}. {service.name}</span>
                          <span className="font-bold text-gold">{service.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: GESTIÓN DE SERVICIOS Y PRECIOS (NUEVO) */}
        {/* ============================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-6 rounded-sm border-t-2 border-t-gold">
              <div>
                <h2 className="text-2xl font-serif font-bold text-parchment flex items-center gap-2">
                  <Sparkles className="text-gold" size={24} />
                  Catálogo de Servicios & Precios
                </h2>
                <p className="text-xs text-parchment/60 uppercase tracking-widest mt-1">
                  {servicesList.length} especialidades configuradas • Actualización en tiempo real en la web
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-3 border border-white/10 hover:border-gold/50 rounded-sm text-xs uppercase tracking-widest font-bold text-parchment/70 hover:text-gold transition-all flex items-center gap-2"
                  title="Restablece los 7 servicios originales si es necesario"
                >
                  <RotateCcw size={14} /> Restaurar Originales
                </button>
                <button
                  onClick={handleOpenCreateService}
                  className="px-5 py-3 bg-gold text-charcoal hover:bg-bronze rounded-sm text-xs uppercase tracking-widest font-bold shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus size={16} strokeWidth={3} /> Nuevo Servicio
                </button>
              </div>
            </div>

            {/* Services Grid */}
            {isLoadingServices ? (
              <div className="py-24 text-center text-parchment/40">
                <div className="h-8 w-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-3" />
                Cargando catálogo de servicios...
              </div>
            ) : servicesList.length === 0 ? (
              <div className="glass p-16 text-center rounded-sm border-dashed border-2 border-white/10 space-y-4">
                <Scissors className="mx-auto text-gold/40" size={48} />
                <h3 className="text-xl font-serif text-parchment">No hay servicios en el catálogo</h3>
                <p className="text-sm text-parchment/60 max-w-md mx-auto">
                  Agrega tu primera especialidad o restaura los servicios originales de Mr. John's Barbier.
                </p>
                <div className="pt-4 flex justify-center gap-3">
                  <button onClick={handleResetDefaults} className="px-4 py-2 border border-gold text-gold rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-gold/10">
                    Restaurar 7 Originales
                  </button>
                  <button onClick={handleOpenCreateService} className="px-4 py-2 bg-gold text-charcoal rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-bronze">
                    Crear Servicio
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesList.map((srv, idx) => {
                  const isActive = srv.active !== false;
                  return (
                    <div 
                      key={srv.id || idx}
                      className={`glass p-6 rounded-sm border transition-all duration-300 relative flex flex-col justify-between group ${
                        isActive 
                          ? 'border-white/10 hover:border-gold/50' 
                          : 'border-white/5 opacity-60 bg-black/20'
                      }`}
                    >
                      {/* Top Row: Icon + Status */}
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-gold/10 border border-gold/30 rounded-sm flex items-center justify-center text-gold group-hover:scale-105 group-hover:bg-gold group-hover:text-charcoal transition-all shadow-md">
                            <ServiceIcon name={srv.icon} className="w-6 h-6" />
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              isActive 
                                ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            }`}>
                              {isActive ? 'En Vivo' : 'Pausado'}
                            </span>
                          </div>
                        </div>

                        {/* Title & Price & Duration */}
                        <h3 className="text-xl font-serif font-bold text-parchment group-hover:text-gold transition-colors">
                          {srv.title}
                        </h3>

                        <div className="flex items-center gap-3 my-2">
                          <div className="text-2xl font-serif font-bold text-gold tracking-tight">
                            ₡{srv.price.toLocaleString()}
                          </div>
                          <span className="text-[11px] font-sans font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm text-gold/90 flex items-center gap-1">
                            <Clock size={12} /> {formatDuration(srv.duration || 60)}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-parchment/60 font-sans leading-relaxed mb-6 line-clamp-3">
                          {srv.description || "Sin descripción proporcionada."}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditService(srv)}
                          className="flex-1 bg-white/5 hover:bg-gold hover:text-charcoal border border-white/10 rounded-sm py-2 px-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-parchment"
                          title="Modificar precio, nombre o descripción"
                        >
                          <Edit3 size={14} /> Editar
                        </button>

                        <button
                          onClick={() => handleToggleServiceActive(srv)}
                          className={`p-2 rounded-sm border transition-all ${
                            isActive
                              ? 'border-white/10 text-parchment/60 hover:text-amber-400 hover:border-amber-400/40 hover:bg-amber-400/10'
                              : 'border-green-500/40 text-green-400 hover:bg-green-500/20'
                          }`}
                          title={isActive ? "Pausar servicio (ocultarlo de la web)" : "Activar servicio (mostrarlo en la web)"}
                        >
                          {isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>

                        <button
                          onClick={() => handleDeleteService(srv.id, srv.title)}
                          className="p-2 rounded-sm border border-white/10 text-white/30 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all"
                          title="Eliminar este servicio"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: CREAR / EDITAR SERVICIO */}
      {/* ============================================================== */}
      {serviceModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="glass p-6 md:p-8 rounded-sm max-w-lg w-full border-t-4 border-t-gold shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-serif font-bold text-gold flex items-center gap-2">
                  <Scissors size={22} />
                  {serviceModal.mode === "create" ? "Nuevo Servicio" : "Editar Servicio"}
                </h3>
                <p className="text-xs opacity-60 uppercase tracking-widest font-bold mt-1">
                  Configura los datos que verán los clientes en la web
                </p>
              </div>
              <button
                onClick={() => setServiceModal(null)}
                className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-5">
              {/* Nombre */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-gold font-bold block">
                  Nombre del Servicio <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Corte Degradado & Toalla Caliente"
                  value={serviceModal.service.title || ""}
                  onChange={(e) => setServiceModal({
                    ...serviceModal,
                    service: { ...serviceModal.service, title: e.target.value }
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-parchment focus:border-gold outline-none transition-colors"
                />
              </div>

              {/* Precio */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold block">
                    Precio en Colones (₡) <span className="text-red-400">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-gold">
                    ₡{Number(serviceModal.service.price || 0).toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold font-serif font-bold">₡</span>
                  <input
                    type="number"
                    required
                    min={0}
                    step={500}
                    placeholder="6000"
                    value={serviceModal.service.price ?? ""}
                    onChange={(e) => setServiceModal({
                      ...serviceModal,
                      service: { ...serviceModal.service, price: Number(e.target.value) }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-8 pr-4 text-parchment focus:border-gold outline-none transition-colors font-mono font-bold"
                  />
                </div>
                
                {/* Presets de Precios Rápidos */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {[2000, 5000, 6000, 8000, 9000, 10000, 15000, 20000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setServiceModal({
                        ...serviceModal,
                        service: { ...serviceModal.service, price: val }
                      })}
                      className="text-[10px] px-2 py-1 bg-white/5 hover:bg-gold/20 hover:text-gold border border-white/10 rounded-sm transition-colors font-mono"
                    >
                      ₡{val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duración */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold block">
                    Duración Estimada <span className="text-red-400">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-gold flex items-center gap-1">
                    <Clock size={12} /> {formatDuration(serviceModal.service.duration ?? 60)}
                  </span>
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/60" size={16} />
                  <input
                    type="number"
                    required
                    min={15}
                    step={15}
                    placeholder="60"
                    value={serviceModal.service.duration ?? 60}
                    onChange={(e) => setServiceModal({
                      ...serviceModal,
                      service: { ...serviceModal.service, duration: Number(e.target.value) }
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-16 text-parchment focus:border-gold outline-none transition-colors font-mono font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-parchment/40 uppercase font-bold">
                    minutos
                  </span>
                </div>
                
                {/* Presets de Duración Rápidos */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {[
                    { val: 30, label: "30 min" },
                    { val: 45, label: "45 min" },
                    { val: 60, label: "1 hora" },
                    { val: 90, label: "1h 30m" },
                    { val: 120, label: "2 horas" },
                  ].map(preset => (
                    <button
                      key={preset.val}
                      type="button"
                      onClick={() => setServiceModal({
                        ...serviceModal,
                        service: { ...serviceModal.service, duration: preset.val }
                      })}
                      className={`text-[10px] px-2.5 py-1 border rounded-sm transition-colors font-bold ${
                        (serviceModal.service.duration ?? 60) === preset.val
                          ? 'bg-gold border-gold text-charcoal'
                          : 'bg-white/5 hover:bg-gold/20 hover:text-gold border-white/10 text-parchment/80'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-parchment/40 italic pt-1">
                  * Este tiempo determina cuántos bloques de 30 minutos se reservan en el calendario y se bloquean en la página web.
                </p>
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-widest text-gold font-bold block">
                  Descripción para Clientes
                </label>
                <textarea
                  rows={3}
                  placeholder="Explica qué incluye este servicio para que el cliente lo valore..."
                  value={serviceModal.service.description || ""}
                  onChange={(e) => setServiceModal({
                    ...serviceModal,
                    service: { ...serviceModal.service, description: e.target.value }
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-sm py-2 px-3 text-parchment focus:border-gold outline-none transition-colors text-sm leading-relaxed"
                />
              </div>

              {/* Selector Visual de Ícono */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gold font-bold block">
                  Ícono Distintivo
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {AVAILABLE_SERVICE_ICONS.map(ic => {
                    const isSelected = (serviceModal.service.icon || 'scissors') === ic.id;
                    const IconComponent = ic.icon;
                    return (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => setServiceModal({
                          ...serviceModal,
                          service: { ...serviceModal.service, icon: ic.id }
                        })}
                        className={`p-3 rounded-sm border flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-gold border-gold text-charcoal shadow-lg font-bold'
                            : 'border-white/10 text-parchment/70 hover:border-gold/50 hover:text-gold bg-white/5'
                        }`}
                        title={ic.label}
                      >
                        <IconComponent size={20} />
                        <span className="text-[8px] truncate max-w-full text-center">{ic.label.split('/')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estado: Mostrar u Ocultar */}
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider font-bold text-parchment">Visible en la Página Web</p>
                  <p className="text-[10px] text-parchment/50">Si lo desactivas, los clientes no podrán seleccionarlo.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setServiceModal({
                    ...serviceModal,
                    service: { ...serviceModal.service, active: serviceModal.service.active === false ? true : false }
                  })}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    serviceModal.service.active !== false ? 'bg-gold justify-end' : 'bg-white/20 justify-start'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full shadow-md ${
                    serviceModal.service.active !== false ? 'bg-charcoal' : 'bg-parchment'
                  }`} />
                </button>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setServiceModal(null)}
                  className="flex-1 py-3 text-xs uppercase tracking-widest font-bold text-parchment/60 hover:text-parchment border border-white/10 rounded-sm hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSavingService}
                  className="flex-1 py-3 bg-gold text-charcoal hover:bg-bronze rounded-sm text-xs uppercase tracking-widest font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSavingService ? (
                    <div className="h-4 w-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check size={16} strokeWidth={3} /> Guardar Servicio
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para seleccionar WhatsApp (Mantenido intacto) */}
      {notificationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass p-6 rounded-sm max-w-md w-full border-t-4 border-t-gold shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-serif font-bold text-gold">Enviar Notificación</h3>
                <p className="text-xs opacity-60 uppercase tracking-widest font-bold mt-1">
                  {notificationModal.type === "confirm" ? "Confirmación de cita" : "Notificación de cancelación"}
                </p>
              </div>
              <button
                onClick={() => setNotificationModal(null)}
                className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-white/5 p-4 rounded-sm border border-white/10 space-y-2 text-sm">
              <p><span className="opacity-60">Cliente:</span> <strong className="text-gold">{notificationModal.booking.name}</strong></p>
              <p><span className="opacity-60">Hora:</span> <strong className="text-gold">{notificationModal.booking.time}</strong></p>
              <p><span className="opacity-60">Servicio:</span> <strong className="text-gold">{notificationModal.booking.service}</strong></p>
            </div>

            <p className="text-xs opacity-80 text-center leading-relaxed">
              Selecciona qué aplicación de WhatsApp deseas usar para abrir el chat y pre-cargar el mensaje:
            </p>

            <div className="grid grid-cols-1 gap-3">
              <a
                href={getWhatsAppUrl(notificationModal.booking, notificationModal.type, 'business')}
                onClick={() => setNotificationModal(null)}
                className="flex items-center justify-between bg-gold text-charcoal p-4 rounded-sm font-bold uppercase tracking-wider hover:bg-bronze transition-all shadow-lg text-sm text-center"
              >
                <span>Abrir WhatsApp Business</span>
                <MessageSquare size={18} />
              </a>

              <a
                href={getWhatsAppUrl(notificationModal.booking, notificationModal.type, 'personal')}
                onClick={() => setNotificationModal(null)}
                className="flex items-center justify-between bg-white/10 text-parchment border border-white/20 p-4 rounded-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-all text-sm text-center"
              >
                <span>Abrir WhatsApp Personal</span>
                <MessageSquare size={18} />
              </a>

              <a
                href={getWhatsAppUrl(notificationModal.booking, notificationModal.type, 'standard')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setNotificationModal(null)}
                className="flex items-center justify-between bg-white/5 text-gold/85 border border-gold/20 p-4 rounded-sm font-bold uppercase tracking-wider hover:bg-gold/10 transition-all text-sm text-center"
              >
                <span>Enlace Estándar (wa.me)</span>
                <Phone size={18} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

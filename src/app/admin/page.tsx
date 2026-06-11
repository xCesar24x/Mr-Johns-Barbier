"use client";

import { useState, useEffect } from "react";
import { format, startOfToday, isSameDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Trash2, Power, Scissors, User, Phone, Clock, ChevronLeft, ChevronRight, TrendingUp, DollarSign, Users, Check, X, MessageSquare } from "lucide-react";

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
  const [notificationModal, setNotificationModal] = useState<{
    booking: any;
    type: "confirm" | "cancel";
  } | null>(null);

  const getWhatsAppUrl = (booking: any, type: "confirm" | "cancel", appType: "business" | "personal" | "standard") => {
    const cleanPhone = (booking.whatsapp || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('506') ? cleanPhone : '506' + cleanPhone;
    
    const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
    let message = "";
    if (type === "confirm") {
      message = `Hola Sr(a). *${booking.name}*, le saluda Jonathan de Mr. John's Barbier. 💈\n\nLe confirmo que su cita para el día *${dateStr}* a las *${booking.time}* para el servicio de *${booking.service}* ha sido *confirmada* con éxito. 👍\n\n¡Le esperamos!`;
    } else {
      message = `Hola Sr(a). *${booking.name}*, le saluda Jonathan de Mr. John's Barbier. 💈\n\nLamentablemente, por motivos de fuerza mayor no podré atenderle en su cita programada para el día *${dateStr}* a las *${booking.time}* (*${booking.service}*). 😔\n\n¿Le quedaría bien si la reprogramamos para otra hora o día? Quedo a su disposición para coordinar.`;
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

  const getWhatsAppConfirmUrl = (booking: any) => {
    const cleanPhone = (booking.whatsapp || '').replace(/\D/g, '');
    const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
    const message = `Hola Sr(a). *${booking.name}*, le saluda Jonathan de Mr. John's Barbier. 💈\n\nLe confirmo que su cita para el día *${dateStr}* a las *${booking.time}* para el servicio de *${booking.service}* ha sido *confirmada* con éxito. 👍\n\n¡Le esperamos!`;
    return `https://wa.me/${cleanPhone.startsWith('506') ? cleanPhone : '506' + cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const getWhatsAppCancelUrl = (booking: any) => {
    const cleanPhone = (booking.whatsapp || '').replace(/\D/g, '');
    const dateStr = format(selectedDate, "EEEE d 'de' MMMM", { locale: es });
    const message = `Hola Sr(a). *${booking.name}*, le saluda Jonathan de Mr. John's Barbier. 💈\n\nLamentablemente, por motivos de fuerza mayor no podré atenderle en su cita programada para el día *${dateStr}* a las *${booking.time}* (*${booking.service}*). 😔\n\n¿Le quedaría bien si la reprogramamos para otra hora o día? Quedo a su disposición para coordinar.`;
    return `https://wa.me/${cleanPhone.startsWith('506') ? cleanPhone : '506' + cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  const fetchDayData = async () => {
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
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDayData();
    }
  }, [selectedDate, isAuthenticated]);

  const toggleDayStatus = async () => {
    const newStatus = isDayClosed ? 'open' : 'closed';
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        body: JSON.stringify({ action: 'toggle-day', date: dateKey, status: newStatus })
      });
      setIsDayClosed(!isDayClosed);
    } catch (error) {
      alert("Error al cambiar estado del día");
    }
  };

  const handleLunchChange = async (newTime: string) => {
    setLunchTime(newTime);
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        body: JSON.stringify({ action: 'set-lunch', date: dateKey, lunchTime: newTime })
      });
    } catch (error) {
      alert("Error al guardar la hora de almuerzo");
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm("¿Seguro que deseas cancelar esta cita? Se liberará el espacio en la web.")) return;
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        body: JSON.stringify({ action: 'cancel-booking', bookingId: id })
      });
      setBookings(bookings.filter(b => b.id !== id));
      // Refresh analytics after cancellation
      fetchDayData();
    } catch (error) {
      alert("Error al cancelar");
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
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
              <Scissors className="text-charcoal" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Panel de Jona</h1>
              <p className="text-gold/60 text-xs uppercase tracking-widest font-bold">Administración y Analíticas</p>
            </div>
          </div>

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                          <span className="flex items-center gap-1 uppercase tracking-tighter font-bold"><Scissors size={14} /> {booking.service || 'Servicio'}</span>
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

      {/* Modal para seleccionar WhatsApp */}
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

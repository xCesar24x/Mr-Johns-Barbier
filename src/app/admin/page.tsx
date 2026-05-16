"use client";

import { useState, useEffect } from "react";
import { format, startOfToday, isSameDay, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Trash2, Power, Scissors, User, Phone, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [bookings, setBookings] = useState<any[]>([]);
  const [isDayClosed, setIsDayClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const fetchDayData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings?date=${selectedDate.toISOString()}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setIsDayClosed(data.isClosed || false);
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
    try {
      await fetch('/api/admin/bookings', {
        method: 'POST',
        body: JSON.stringify({ action: 'toggle-day', date: selectedDate.toISOString(), status: newStatus })
      });
      setIsDayClosed(!isDayClosed);
    } catch (error) {
      alert("Error al cambiar estado del día");
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
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
              <Scissors className="text-charcoal" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold">Panel de Jona</h1>
              <p className="text-gold/60 text-xs uppercase tracking-widest font-bold">Gestión de Citas</p>
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

        {/* Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`glass p-6 rounded-sm flex items-center justify-between border-l-4 ${isDayClosed ? 'border-l-red-500' : 'border-l-green-500'}`}>
            <div>
              <h3 className="font-bold text-lg">{isDayClosed ? "Agenda Cerrada" : "Agenda Abierta"}</h3>
              <p className="text-xs opacity-60">Control de disponibilidad para clientes</p>
            </div>
            <button 
              onClick={toggleDayStatus}
              className={`p-4 rounded-full transition-all shadow-lg ${isDayClosed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
            >
              <Power size={24} className="text-white" />
            </button>
          </div>

          <div className="glass p-6 rounded-sm flex items-center gap-6 border-l-4 border-l-gold">
            <div className="text-4xl font-serif text-gold font-bold">{bookings.length}</div>
            <div>
              <h3 className="font-bold text-lg">Citas Agendadas</h3>
              <p className="text-xs opacity-60">Para este día seleccionado</p>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
            <Calendar className="text-gold" size={20} />
            Agenda Detallada
          </h2>

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
                      <span className="flex items-center gap-1"><Scissors size={14} /> {booking.service || 'Servicio'}</span>
                      <a href={`https://wa.me/${(booking.whatsapp || '').replace(/\D/g,'')}`} target="_blank" className="flex items-center gap-1 text-gold hover:underline"><Phone size={14} /> {booking.whatsapp || 'Sin teléfono'}</a>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => cancelBooking(booking.id)}
                  className="p-3 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className="glass p-12 text-center rounded-sm border-dashed border-2 border-white/5 opacity-40 italic">
              No hay citas para este día.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

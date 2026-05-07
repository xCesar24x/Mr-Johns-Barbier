"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfToday, isBefore, isSameDay, setHours, setMinutes, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Mail, CheckCircle2, ChevronRight, ChevronLeft, Scissors } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.045a11.871 11.871 0 001.592 5.925L0 24l6.135-1.61a11.815 11.815 0 005.915 1.586h.005c6.637 0 12.048-5.411 12.051-12.045a11.815 11.815 0 00-3.592-8.511"/>
  </svg>
);

const realServices = [
  "Corte",
  "Barba",
  "Corte y Barba",
  "Limpieza Facial",
  "Keratina",
  "Cera Depilación",
  "Cejas"
];

export default function BookingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    service: "Corte"
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const today = startOfToday();
  
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 8; h <= 19; h++) {
      slots.push(`${h}:00`);
      slots.push(`${h}:30`);
    }
    return slots;
  }, []);

  // Simple and direct disabled check
  const isTimeDisabled = (time: string) => {
    if (!isClient) return false;
    
    const now = new Date();
    // If selecting a strictly future day, all are enabled
    if (selectedDate.getTime() > today.getTime()) {
      return false;
    }
    
    // If selecting today, check the hours
    if (isSameDay(selectedDate, today)) {
      const [hours, minutes] = time.split(':').map(Number);
      const slotTime = hours * 60 + minutes;
      const currentTime = now.getHours() * 60 + now.getMinutes();
      return slotTime < currentTime;
    }
    
    // Past days (though calendar should block them)
    return selectedDate.getTime() < today.getTime();
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;
    setIsPreviewOpen(true);
  };

  const confirmAndSend = () => {
    const message = `Hola Mr. John's, deseo confirmar mi cita. \n\n💈 *Detalles de la Cita* 💈\n👤 *Nombre:* ${formData.name}\n📅 *Fecha:* ${format(selectedDate, "PPP", { locale: es })}\n⏰ *Hora:* ${selectedTime}\n✂️ *Servicio:* ${formData.service}\n📱 *WhatsApp:* ${formData.whatsapp}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/50672429342?text=${encodedMessage}`, "_blank");
    setIsPreviewOpen(false);
  };

  const daysInMonth = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({ date: addDays(firstDay, -i - 1), currentMonth: false });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i), currentMonth: true });
    }
    return days;
  }, [currentMonth]);

  return (
    <section id="reservar" className="py-24 bg-charcoal relative texture-leather">
      <div className="absolute inset-0 bg-charcoal/80" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-gold font-sans tracking-[0.3em] uppercase text-sm mb-4 block font-semibold"
          >
            Gentleman’s Schedule
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-parchment"
          >
            Reserva tu <span className="italic text-gold">Experiencia</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-6 rounded-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif text-parchment flex items-center gap-2">
                  <CalendarIcon className="text-gold" size={20} />
                  Selecciona una Fecha
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronLeft size={20} className="text-gold" />
                  </button>
                  <button onClick={() => setCurrentMonth(addDays(currentMonth, 30))} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronRight size={20} className="text-gold" />
                  </button>
                </div>
              </div>
              <div className="mb-4 text-center text-parchment font-serif text-lg capitalize">{format(currentMonth, "MMMM yyyy", { locale: es })}</div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className="text-center text-xs uppercase tracking-widest text-gold font-bold py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day, idx) => {
                  const isDisabled = isBefore(day.date, today) && !isSameDay(day.date, today);
                  const isSelected = isSameDay(day.date, selectedDate);
                  return (
                    <button
                      key={idx}
                      disabled={isDisabled || !day.currentMonth}
                      onClick={() => handleDateSelect(day.date)}
                      className={`h-12 flex items-center justify-center rounded-sm transition-all text-sm font-sans ${!day.currentMonth ? 'opacity-0 pointer-events-none' : ''} ${isSelected ? 'bg-gold text-charcoal font-bold scale-105 shadow-lg' : 'hover:bg-white/5 text-parchment'} ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}`}
                    >
                      {format(day.date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="glass p-6 rounded-sm">
              <h3 className="text-xl font-serif text-parchment flex items-center gap-2 mb-6">
                <Clock className="text-gold" size={20} />
                Hora Disponible
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map(time => {
                  const disabled = isTimeDisabled(time);
                  const selected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      disabled={disabled}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 rounded-sm text-xs font-bold transition-all border ${selected ? 'bg-gold border-gold text-charcoal shadow-lg scale-105' : 'border-white/10 text-parchment/60 hover:border-gold hover:text-gold'} ${disabled ? 'opacity-20 cursor-not-allowed border-transparent' : ''}`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="glass p-8 rounded-sm space-y-6">
              <h3 className="text-xl font-serif text-parchment flex items-center gap-2 mb-4">
                <User className="text-gold" size={20} />
                Tus Datos
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold">Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input required type="text" placeholder="Sr. Juan Pérez" className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-parchment focus:border-gold outline-none transition-colors" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold">WhatsApp</label>
                  <div className="relative">
                    <WhatsAppIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input required type="tel" placeholder="+506 8888 8888" className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-parchment focus:border-gold outline-none transition-colors" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input required type="email" placeholder="email@ejemplo.com" className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-parchment focus:border-gold outline-none transition-colors" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold">Servicio</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-parchment focus:border-gold outline-none transition-colors appearance-none" value={formData.service} onChange={(e) => setFormData({...formData, service: e.target.value})}>
                    {realServices.map(s => <option key={s} className="bg-charcoal" value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={!selectedTime} className={`w-full py-4 rounded-sm font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${selectedTime ? 'bg-gold text-charcoal hover:bg-bronze' : 'bg-white/10 text-white/20 cursor-not-allowed'}`}>Confirmar Cita <ChevronRight size={18} /></button>
            </form>
            {selectedTime && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gold p-6 rounded-sm shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Scissors size={80} className="-rotate-45" /></div>
                <h4 className="text-charcoal font-bold uppercase tracking-widest text-xs mb-2">Resumen de Cita</h4>
                <div className="text-charcoal space-y-1">
                  <p className="text-2xl font-serif">{format(selectedDate, "d 'de' MMMM", { locale: es })}</p>
                  <p className="text-xl font-bold">{selectedTime}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Dialog.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101] animate-in zoom-in-95 duration-300 focus:outline-none">
            <div className="glass-light p-8 rounded-sm shadow-2xl border-2 border-gold relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Scissors size={120} /></div>
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto shadow-lg"><CheckCircle2 className="text-charcoal w-10 h-10" /></div>
                <Dialog.Title className="text-3xl font-serif text-charcoal">¡Casi Listo!</Dialog.Title>
                <div className="space-y-4 py-6 border-y border-charcoal/10">
                  <p className="text-charcoal/80 font-sans text-lg">Sr. <span className="font-bold text-charcoal">{formData.name}</span>, su cita para el <span className="font-bold">{format(selectedDate, "d 'de' MMMM", { locale: es })}</span> a las <span className="font-bold">{selectedTime}</span> está lista para ser confirmada.</p>
                  <div className="bg-charcoal/5 p-4 rounded-sm text-left">
                    <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">Servicio seleccionado:</p>
                    <p className="text-charcoal font-serif text-xl">{formData.service}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button onClick={confirmAndSend} className="w-full bg-[#25D366] text-white py-4 rounded-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg"><WhatsAppIcon size={20} /> Confirmar por WhatsApp</button>
                  <button onClick={() => setIsPreviewOpen(false)} className="w-full text-charcoal/60 py-2 text-sm uppercase tracking-widest font-bold hover:text-charcoal transition-colors">Modificar Datos</button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

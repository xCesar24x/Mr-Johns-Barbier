"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, startOfToday, isBefore, isSameDay, setHours, setMinutes, isAfter, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, CheckCircle2, ChevronRight, ChevronLeft, Scissors } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export default function BookingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    service: "Corte de Cabello"
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = startOfToday();
  
  // Available times (8 AM to 7 PM)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 8; h <= 19; h++) {
      slots.push(`${h}:00`);
      slots.push(`${h}:30`);
    }
    return slots;
  }, []);

  const isTimeDisabled = (time: string) => {
    if (!isSameDay(selectedDate, today)) return false;
    
    const [hours, minutes] = time.split(':').map(Number);
    const slotDate = setMinutes(setHours(startOfDay(selectedDate), hours), minutes);
    return isBefore(slotDate, new Date());
  };

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, today)) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) return;
    setIsPreviewOpen(true);
  };

  const confirmAndSend = () => {
    const message = `Hola Mr. John's, deseo confirmar mi cita. \n\n💈 *Detalles de la Cita* 💈\n👤 *Nombre:* ${formData.name}\n📅 *Fecha:* ${format(selectedDate, "PPP", { locale: es })}\n⏰ *Hora:* ${selectedTime}\n✂️ *Servicio:* ${formData.service}\n📧 *Email:* ${formData.email}\n📱 *WhatsApp:* ${formData.whatsapp}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/50672429342?text=${encodedMessage}`, "_blank");
    setIsPreviewOpen(false);
  };

  // Simple calendar grid logic
  const daysInMonth = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Add padding days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({ date: addDays(firstDay, -i - 1), currentMonth: false });
    }
    
    // Add days of current month
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
          
          {/* Step 1: Calendar */}
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

              <div className="mb-4 text-center text-parchment font-serif text-lg capitalize">
                {format(currentMonth, "MMMM yyyy", { locale: es })}
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                  <div key={d} className="text-center text-xs uppercase tracking-widest text-gold font-bold py-2">
                    {d}
                  </div>
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
                      className={`
                        h-12 flex items-center justify-center rounded-sm transition-all text-sm font-sans
                        ${!day.currentMonth ? 'opacity-0 pointer-events-none' : ''}
                        ${isSelected ? 'bg-gold text-charcoal font-bold scale-105 shadow-lg' : 'hover:bg-white/5 text-parchment'}
                        ${isDisabled ? 'opacity-20 cursor-not-allowed' : ''}
                      `}
                    >
                      {format(day.date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Time Selection */}
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
                      className={`
                        py-3 rounded-sm text-xs font-bold transition-all border
                        ${selected ? 'bg-gold border-gold text-charcoal shadow-lg scale-105' : 'border-white/10 text-parchment/60 hover:border-gold hover:text-gold'}
                        ${disabled ? 'opacity-20 cursor-not-allowed border-transparent' : ''}
                      `}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Form */}
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
                    <input 
                      required
                      type="text"
                      placeholder="Sr. Juan Pérez"
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-parchment focus:border-gold outline-none transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold">WhatsApp</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      required
                      type="tel"
                      placeholder="+506 8888 8888"
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-parchment focus:border-gold outline-none transition-colors"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                    <input 
                      required
                      type="email"
                      placeholder="email@ejemplo.com"
                      className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-10 pr-4 text-parchment focus:border-gold outline-none transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-widest text-gold font-bold">Servicio</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 px-4 text-parchment focus:border-gold outline-none transition-colors appearance-none"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                  >
                    <option className="bg-charcoal">Corte de Cabello</option>
                    <option className="bg-charcoal">Barba Tradicional</option>
                    <option className="bg-charcoal">Limpieza Facial</option>
                    <option className="bg-charcoal">Combo VIP</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!selectedTime}
                className={`
                  w-full py-4 rounded-sm font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2
                  ${selectedTime ? 'bg-gold text-charcoal hover:bg-bronze' : 'bg-white/10 text-white/20 cursor-not-allowed'}
                `}
              >
                Confirmar Cita
                <ChevronRight size={18} />
              </button>
            </form>

            {/* Summary Card */}
            {selectedTime && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gold p-6 rounded-sm shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Scissors size={80} className="-rotate-45" />
                </div>
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

      {/* Preview Modal */}
      <Dialog.Root open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-[101] animate-in zoom-in-95 duration-300 focus:outline-none">
            <div className="glass-light p-8 rounded-sm shadow-2xl border-2 border-gold relative overflow-hidden">
              {/* Background watermark */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Scissors size={120} />
              </div>
              
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="text-charcoal w-10 h-10" />
                </div>
                
                <Dialog.Title className="text-3xl font-serif text-charcoal">
                  ¡Casi Listo!
                </Dialog.Title>
                
                <div className="space-y-4 py-6 border-y border-charcoal/10">
                  <p className="text-charcoal/80 font-sans text-lg">
                    Sr. <span className="font-bold text-charcoal">{formData.name}</span>, su cita para el <span className="font-bold">{format(selectedDate, "d 'de' MMMM", { locale: es })}</span> a las <span className="font-bold">{selectedTime}</span> está lista para ser confirmada.
                  </p>
                  <div className="bg-charcoal/5 p-4 rounded-sm text-left">
                    <p className="text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">Servicio seleccionado:</p>
                    <p className="text-charcoal font-serif text-xl">{formData.service}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={confirmAndSend}
                    className="w-full bg-[#25D366] text-white py-4 rounded-sm font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg"
                  >
                    <MessageSquare size={20} />
                    Confirmar por WhatsApp
                  </button>
                  <button 
                    onClick={() => setIsPreviewOpen(false)}
                    className="w-full text-charcoal/60 py-2 text-sm uppercase tracking-widest font-bold hover:text-charcoal transition-colors"
                  >
                    Modificar Datos
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </section>
  );
}

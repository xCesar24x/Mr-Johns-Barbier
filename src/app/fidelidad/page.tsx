"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Scissors, 
  Search, 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import LoyaltyCard from "@/components/LoyaltyCard";
import { formatDuration } from "@/lib/defaultServices";

export default function ClientPortal() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, "");
    if (clean.length < 8) {
      setErrorMsg("Por favor ingresa un número de teléfono válido de al menos 8 dígitos.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/client/loyalty?phone=${clean}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Ocurrió un error al consultar tu cuenta.");
        setClientData(null);
        return;
      }

      if (!data.found) {
        setErrorMsg(data.message || "No encontramos reservas registradas con este número de WhatsApp.");
        setClientData(null);
        return;
      }

      setClientData(data);
    } catch {
      setErrorMsg("Error de conexión. Intenta nuevamente en unos instantes.");
      setClientData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSearch = () => {
    setClientData(null);
    setPhoneNumber("");
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-charcoal text-parchment relative overflow-x-hidden">
      {/* Fondo fotográfico ambiental de barbería con gradiente oscuro y overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 scale-105"
        style={{ backgroundImage: `url('/images/fondoclientes.png')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-charcoal/95 via-charcoal/88 to-charcoal/98 pointer-events-none z-0 backdrop-blur-[2px]" />

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-parchment/60 hover:text-gold transition-colors"
          >
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Gentleman&apos;s Loyalty</span>
          </div>
        </div>

        {/* Header Principal */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gold text-charcoal shadow-xl mb-1">
            <Scissors size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-parchment">
            Portal del <span className="italic text-gold">Caballero</span>
          </h1>
          <p className="text-xs md:text-sm uppercase tracking-widest text-parchment/60 max-w-xl mx-auto">
            Historial de servicios, gastos y tu tarjeta digital de fidelidad Mr. John&apos;s
          </p>
        </div>

        {/* Formulario de Consulta (WhatsApp) */}
        {!clientData && (
          <div className="glass max-w-md mx-auto p-6 md:p-8 rounded-sm border-t-4 border-t-gold shadow-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-xl font-serif font-bold text-parchment">Accede a tu Historial</h2>
              <p className="text-xs text-parchment/60 leading-relaxed">
                Ingresa tu número de WhatsApp para ver tus citas pasadas, total invertido y tus sellos acumulados.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                  Número de WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    type="tel"
                    required
                    placeholder="Ej: 8888 8888"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-11 pr-4 text-parchment focus:border-gold outline-none transition-colors font-mono text-base"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm flex items-start gap-2.5 text-red-400 text-xs animate-in fade-in">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold text-charcoal py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-bronze transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={16} strokeWidth={2.5} /> Consultar mi Perfil
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-white/5 text-center">
              <p className="text-[10px] text-parchment/40 mb-3">
                ¿Aún no tienes citas? <Link href="/#reservar" className="text-gold hover:underline font-bold">Reserva tu primer corte aquí</Link>.
              </p>

              {/* Botones de demostración rápida para probar los 4 niveles */}
              <div className="pt-3 border-t border-white/10 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold/80 block mb-2">
                  Probar demostración de niveles en 1 clic:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => { setPhoneNumber("11111111"); }}
                    className="p-2 bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/50 rounded-sm text-left transition-all"
                  >
                    <span className="font-bold text-gold block">Nivel 1 (Inicial)</span>
                    <span className="text-[10px] text-parchment/60 font-mono">3 de 10 cortes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhoneNumber("22222222"); }}
                    className="p-2 bg-gold/15 hover:bg-gold/25 border border-gold/40 rounded-sm text-left transition-all"
                  >
                    <span className="font-bold text-gold block">Corte #11 Gratis</span>
                    <span className="text-[10px] text-parchment/80 font-mono">10 cortes completos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhoneNumber("33333333"); }}
                    className="p-2 bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/50 rounded-sm text-left transition-all"
                  >
                    <span className="font-bold text-gold block">Nivel 2 (Reiniciado)</span>
                    <span className="text-[10px] text-parchment/60 font-mono">14 cortes totales</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPhoneNumber("44444444"); }}
                    className="p-2 bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/50 rounded-sm text-left transition-all"
                  >
                    <span className="font-bold text-gold block">Nivel 3 (VIP)</span>
                    <span className="text-[10px] text-parchment/60 font-mono">25 cortes totales</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard de Datos del Cliente */}
        {clientData && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Barra Superior de Bienvenida */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 glass p-6 rounded-sm border-l-4 border-l-gold">
              <div>
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold">
                  Bienvenido de vuelta
                </span>
                <h2 className="text-2xl font-serif font-bold text-parchment">
                  Sr. {clientData.client.name || "Cliente"}
                </h2>
                <p className="text-xs text-parchment/60 font-mono mt-0.5">
                  WhatsApp: +506 {clientData.client.phone}
                </p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleResetSearch}
                  className="px-4 py-2 border border-white/10 hover:border-gold/50 rounded-sm text-xs uppercase tracking-wider font-bold text-parchment/70 hover:text-gold transition-all"
                >
                  Consultar otro número
                </button>
                <Link
                  href="/#reservar"
                  className="px-5 py-2 bg-gold text-charcoal hover:bg-bronze rounded-sm text-xs uppercase tracking-wider font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Sparkles size={14} /> Nueva Cita
                </Link>
              </div>
            </div>

            {/* 1. Tarjeta de Fidelidad Digital (10 + 1 Gratis) */}
            <LoyaltyCard
              currentStamps={clientData.loyalty.currentStamps}
              stampsTarget={clientData.loyalty.stampsTarget}
              hasFreeCutEarned={clientData.loyalty.hasFreeCutEarned}
              completedCycles={clientData.loyalty.completedCycles}
              clientName={clientData.client.name}
            />

            {/* 2. Métricas & Resumen Financiero */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass p-6 rounded-sm border-b-2 border-b-gold">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold"><DollarSign size={20} /></div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Total Invertido</p>
                </div>
                <h3 className="text-3xl font-serif font-bold text-gold">
                  ₡{clientData.stats.totalSpent.toLocaleString()}
                </h3>
                <p className="text-[10px] text-parchment/40 mt-1 uppercase tracking-wider">En cuidado personal</p>
              </div>

              <div className="glass p-6 rounded-sm border-b-2 border-b-gold">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold"><CheckCircle2 size={20} /></div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Visitas Totales</p>
                </div>
                <h3 className="text-3xl font-serif font-bold text-gold">
                  {clientData.stats.totalVisits} {clientData.stats.totalVisits === 1 ? "cita" : "citas"}
                </h3>
                <p className="text-[10px] text-parchment/40 mt-1 uppercase tracking-wider">
                  {clientData.loyalty.totalCuts} servicios de corte registrados
                </p>
              </div>

              <div className="glass p-6 rounded-sm border-b-2 border-b-gold">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gold/10 rounded-lg text-gold"><TrendingUp size={20} /></div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-60">Servicio Favorito</p>
                </div>
                <h3 className="text-xl font-serif font-bold text-gold truncate">
                  {clientData.stats.favoriteService}
                </h3>
                <p className="text-[10px] text-parchment/40 mt-1 uppercase tracking-wider">Tu especialidad habitual</p>
              </div>
            </div>

            {/* 3. Historial Cronológico de Citas */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-parchment flex items-center gap-2">
                  <Calendar size={20} className="text-gold" />
                  Historial de Visitas
                </h3>
                <span className="text-xs text-parchment/60 font-mono">
                  {clientData.history.length} {clientData.history.length === 1 ? "registro" : "registros"}
                </span>
              </div>

              <div className="space-y-3">
                {clientData.history.map((booking: any) => {
                  let formattedDate = booking.date;
                  try {
                    formattedDate = format(parseISO(booking.date), "EEEE d 'de' MMMM, yyyy", { locale: es });
                  } catch {
                    formattedDate = booking.date;
                  }

                  return (
                    <div
                      key={booking.id}
                      className="glass p-5 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold/40 transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className="text-center w-16 shrink-0 py-2 bg-white/5 rounded-sm border border-white/10">
                          <span className="text-lg font-serif font-bold text-gold block leading-tight">
                            {booking.time}
                          </span>
                          <span className="text-[9px] uppercase font-bold text-parchment/40 block mt-0.5">
                            {formatDuration(booking.duration || 60)}
                          </span>
                        </div>

                        <div>
                          <p className="font-serif font-bold text-lg text-parchment capitalize">
                            {formattedDate}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-parchment/70">
                            <span className="flex items-center gap-1 font-semibold text-gold/90">
                              <Scissors size={13} /> {booking.service}
                            </span>
                            {booking.hasHaircut && (
                              <span className="rounded-full bg-gold/15 border border-gold/30 px-2 py-0.5 text-[9px] font-bold text-gold uppercase tracking-wider">
                                +1 Sello Fidelidad
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-left md:text-right w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                        <span className="text-xs text-parchment/40 uppercase tracking-widest block font-bold">Inversión</span>
                        <span className="text-xl font-serif font-bold text-gold">
                          ₡{Number(booking.totalPrice || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </div>
      </div>
    </div>
  );
}


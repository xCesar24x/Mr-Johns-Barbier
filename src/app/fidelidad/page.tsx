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
  User,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  KeyRound
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import LoyaltyCard from "@/components/LoyaltyCard";
import { formatDuration } from "@/lib/defaultServices";
import { formatColonPrice } from "@/lib/utils";

type AuthStep = "identify" | "setup-pin" | "verify-pin";

export default function ClientPortal() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientNameInput, setClientNameInput] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  const [authStep, setAuthStep] = useState<AuthStep>("identify");
  const [previewName, setPreviewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [clientData, setClientData] = useState<any>(null);

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const cleanName = clientNameInput.trim();

    if (cleanPhone.length < 8) {
      setErrorMsg("Por favor ingresa un número de WhatsApp válido de al menos 8 dígitos.");
      return;
    }
    if (cleanName.length < 2) {
      setErrorMsg("Por favor ingresa tu nombre (mínimo 2 letras).");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/client/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check",
          phone: cleanPhone,
          name: cleanName,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.found) {
        setErrorMsg(data.error || data.message || "No encontramos citas con esa combinación de WhatsApp y nombre.");
        return;
      }

      setPreviewName(data.previewName || cleanName);
      setPin("");
      setConfirmPin("");
      setShowPin(false);
      setAuthStep(data.step === "setup-pin" ? "setup-pin" : "verify-pin");
    } catch {
      setErrorMsg("Error de conexión. Intenta nuevamente en unos instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      setErrorMsg("Tu PIN debe tener exactamente 4 dígitos numéricos.");
      return;
    }
    if (pin !== confirmPin) {
      setErrorMsg("Los dos PIN no coinciden. Verifícalo e intenta de nuevo.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/client/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "setup-pin",
          phone: phoneNumber.replace(/\D/g, ""),
          name: clientNameInput.trim(),
          pin,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.found) {
        setErrorMsg(data.error || "No se pudo crear tu PIN. Intenta de nuevo.");
        return;
      }

      setClientData(data);
    } catch {
      setErrorMsg("Error de conexión. Intenta nuevamente en unos instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) {
      setErrorMsg("Ingresa tu PIN de 4 dígitos numéricos.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/client/loyalty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-pin",
          phone: phoneNumber.replace(/\D/g, ""),
          name: clientNameInput.trim(),
          pin,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.found) {
        setErrorMsg(data.error || "PIN incorrecto.");
        return;
      }

      setClientData(data);
    } catch {
      setErrorMsg("Error de conexión. Intenta nuevamente en unos instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToIdentify = () => {
    setAuthStep("identify");
    setPin("");
    setConfirmPin("");
    setErrorMsg(null);
  };

  const handleResetSearch = () => {
    setClientData(null);
    setAuthStep("identify");
    setPhoneNumber("");
    setClientNameInput("");
    setPin("");
    setConfirmPin("");
    setPreviewName("");
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

          {/* Flujo de Acceso Seguro (Paso 1: Identificación / Paso 2: Crear o Verificar PIN) */}
          {!clientData && (
            <div className="glass max-w-md mx-auto p-6 md:p-8 rounded-sm border-t-4 border-t-gold shadow-2xl space-y-6">

              {/* PASO 1: WhatsApp + Nombre */}
              {authStep === "identify" && (
                <>
                  <div className="space-y-2 text-center">
                    <h2 className="text-xl font-serif font-bold text-parchment">Accede a tu Historial</h2>
                    <p className="text-xs text-parchment/60 leading-relaxed">
                      Ingresa tu número de WhatsApp y tu nombre para proteger tu perfil y consultar tus sellos.
                    </p>
                  </div>

                  <form onSubmit={handleIdentify} className="space-y-4">
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

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                        Tu Nombre
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                          type="text"
                          required
                          placeholder="Ej: Carlos o Carlos Cárdenas"
                          value={clientNameInput}
                          onChange={(e) => setClientNameInput(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-11 pr-4 text-parchment focus:border-gold outline-none transition-colors text-base"
                        />
                      </div>
                      <p className="text-[10px] text-parchment/40">
                        Si compartes número con un familiar, ingresa tu nombre y apellido.
                      </p>
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
                          <Search size={16} strokeWidth={2.5} /> Continuar
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* PASO 2A: Crear PIN de 4 dígitos (Primera vez) */}
              {authStep === "setup-pin" && (
                <>
                  <div className="space-y-2 text-center">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold mx-auto">
                      <KeyRound size={20} />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-parchment">
                      ¡Hola, {previewName}!
                    </h2>
                    <p className="text-xs text-parchment/70 leading-relaxed">
                      Como es tu primera vez aquí, crea un <strong className="text-gold">PIN secreto de 4 dígitos</strong> para que solo tú puedas ver tu historial y sellos.
                    </p>
                  </div>

                  <form onSubmit={handleSetupPin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                        Elige tu PIN (4 números)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                          type={showPin ? "text" : "password"}
                          inputMode="numeric"
                          pattern="\d{4}"
                          maxLength={4}
                          required
                          autoFocus
                          placeholder="••••"
                          value={pin}
                          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-11 pr-11 text-parchment focus:border-gold outline-none transition-colors font-mono text-xl tracking-[0.5em] text-center"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors"
                          title={showPin ? "Ocultar PIN" : "Ver PIN"}
                        >
                          {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                        Confirma tu PIN
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                          type={showPin ? "text" : "password"}
                          inputMode="numeric"
                          pattern="\d{4}"
                          maxLength={4}
                          required
                          placeholder="••••"
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-11 pr-11 text-parchment focus:border-gold outline-none transition-colors font-mono text-xl tracking-[0.5em] text-center"
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
                          <ShieldCheck size={16} strokeWidth={2.5} /> Crear Perfil y Entrar
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleBackToIdentify}
                      className="w-full text-center text-xs text-parchment/50 hover:text-gold transition-colors py-1"
                    >
                      ← Cambiar número o nombre
                    </button>
                  </form>
                </>
              )}

              {/* PASO 2B: Verificar PIN existente */}
              {authStep === "verify-pin" && (
                <>
                  <div className="space-y-2 text-center">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold/15 border border-gold/40 text-gold mx-auto">
                      <Lock size={20} />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-parchment">
                      Bienvenido, {previewName}
                    </h2>
                    <p className="text-xs text-parchment/60 leading-relaxed">
                      Ingresa tu PIN de 4 dígitos para acceder a tu tarjeta de fidelidad e historial.
                    </p>
                  </div>

                  <form onSubmit={handleVerifyPin} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                        PIN de Seguridad (4 dígitos)
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                          type={showPin ? "text" : "password"}
                          inputMode="numeric"
                          pattern="\d{4}"
                          maxLength={4}
                          required
                          autoFocus
                          placeholder="••••"
                          value={pin}
                          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          className="w-full bg-white/5 border border-white/10 rounded-sm py-3 pl-11 pr-11 text-parchment focus:border-gold outline-none transition-colors font-mono text-xl tracking-[0.5em] text-center"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPin(!showPin)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors"
                          title={showPin ? "Ocultar PIN" : "Ver PIN"}
                        >
                          {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
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
                          <Lock size={16} strokeWidth={2.5} /> Desbloquear Perfil
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-parchment/40 text-center">
                      ¿Olvidaste tu PIN? Pídele a Jonathan que lo restablezca en su panel.
                    </p>

                    <button
                      type="button"
                      onClick={handleBackToIdentify}
                      className="w-full text-center text-xs text-parchment/50 hover:text-gold transition-colors py-1"
                    >
                      ← Cambiar número o nombre
                    </button>
                  </form>
                </>
              )}

              <div className="pt-2 border-t border-white/5 text-center">
                <p className="text-[10px] text-parchment/40">
                  ¿Aún no tienes citas? <Link href="/#reservar" className="text-gold hover:underline font-bold">Reserva tu primer corte aquí</Link>.
                </p>
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
                    Cerrar Sesión
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
                    ₡{formatColonPrice(clientData.stats.totalSpent)}
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
                            ₡{formatColonPrice(Number(booking.totalPrice || 0))}
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

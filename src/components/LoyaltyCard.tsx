"use client";

import { motion } from "framer-motion";
import { Scissors, Gift, Award, Sparkles, Check, Crown, Shield, Star, Gem } from "lucide-react";

interface LoyaltyCardProps {
  currentStamps: number;
  stampsTarget: number;
  hasFreeCutEarned: boolean;
  completedCycles: number;
  clientName: string;
}

// Jerarquía de Rangos y Membresías de Mr. John's
const getTierInfo = (completedCycles: number) => {
  if (completedCycles === 0) {
    return {
      name: "Miembro Classic",
      icon: Shield,
      badgeColor: "bg-white/10 text-parchment/80 border-white/20",
      description: "Iniciando el camino del caballero",
    };
  }
  if (completedCycles === 1) {
    return {
      name: "Miembro Silver",
      icon: Star,
      badgeColor: "bg-slate-300/20 text-slate-200 border-slate-300/40",
      description: "1 corte de regalo canjeado",
    };
  }
  if (completedCycles === 2) {
    return {
      name: "Miembro Gold VIP",
      icon: Crown,
      badgeColor: "bg-gold/25 text-gold border-gold/50",
      description: "2 cortes de regalo canjeados",
    };
  }
  return {
    name: "Miembro Black Legend",
    icon: Gem,
    badgeColor: "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-gold/20 shadow-md",
    description: `${completedCycles} cortes de regalo canjeados`,
  };
};

export default function LoyaltyCard({
  currentStamps,
  stampsTarget = 10,
  hasFreeCutEarned,
  completedCycles,
  clientName,
}: LoyaltyCardProps) {
  const stamps = Array.from({ length: stampsTarget }, (_, i) => i + 1);
  const remaining = stampsTarget - currentStamps;
  const tier = getTierInfo(completedCycles);
  const TierIcon = tier.icon;

  return (
    <div className="relative overflow-hidden rounded-sm border-2 border-gold/50 shadow-2xl bg-gradient-to-br from-[#1a1815] via-[#121110] to-[#0d0c0b]">
      {/* Detalle visual sutil de fondo */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url('/images/fondoclientes.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 pointer-events-none" />

      {/* Decorative Gold Glows */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl z-0" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl z-0" />

      {/* Contenido interior */}
      <div className="relative z-10 p-6 md:p-8">

        {/* Header de la Tarjeta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/25 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-charcoal shadow-lg">
              <Award size={26} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold">
                  Gentleman’s Club
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${tier.badgeColor}`}>
                  <TierIcon size={11} /> {tier.name}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-parchment">
                Tarjeta de Fidelidad
              </h3>
            </div>
          </div>

          <div className="text-left sm:text-right bg-black/40 px-3.5 py-2 rounded-sm border border-gold/25">
            <p className="text-[10px] uppercase tracking-widest text-parchment/60 font-bold">Titular</p>
            <p className="font-serif text-lg font-bold text-gold drop-shadow-sm">{clientName || "Caballero Distinguido"}</p>
          </div>
        </div>

        {/* Mensaje de Estado / Premio */}
        <div className="my-6">
          {hasFreeCutEarned ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-4 rounded-sm border-2 border-gold bg-gold/20 p-4 text-parchment shadow-lg backdrop-blur-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal shadow-md animate-bounce">
                <Gift size={24} />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-gold flex items-center gap-1.5">
                  <Sparkles size={18} /> ¡CORTE N°11 GRATIS DESBLOQUEADO!
                </p>
                <p className="text-xs text-parchment/90 mt-0.5">
                  ¡Felicidades! Completaste tus 10 cortes. En tu próxima cita, este corte corre por cortesía de Jonathan y Mr. John&apos;s Barbier.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between rounded-sm border border-gold/25 bg-black/55 p-4 backdrop-blur-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-gold font-bold">Progreso Actual</p>
                <p className="font-serif text-xl font-bold text-parchment mt-0.5 drop-shadow-sm">
                  {currentStamps} de {stampsTarget} cortes completados
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-serif font-bold text-gold drop-shadow-md">{remaining}</span>
                <p className="text-[10px] uppercase tracking-wider text-parchment/80 font-bold">
                  {remaining === 1 ? "corte para el gratis" : "cortes para el gratis"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sellos de Fidelidad (10 sellos + Sello Premio N°11) */}
        <div>
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] font-bold text-gold/90 drop-shadow-sm">
            Sellos Acumulados (10 cortes = 11° Gratis)
          </p>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-11 gap-2.5">
            {stamps.map((num) => {
              const isEarned = num <= currentStamps;
              return (
                <motion.div
                  key={num}
                  whileHover={{ scale: 1.05 }}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-sm border backdrop-blur-sm transition-all ${
                    isEarned
                      ? "border-gold bg-gradient-to-b from-gold/45 to-black/70 text-gold shadow-lg shadow-gold/25"
                      : "border-white/15 bg-black/55 text-parchment/30"
                  }`}
                >
                  {isEarned ? (
                    <>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-charcoal shadow-md">
                        <Scissors size={14} className="rotate-45" />
                      </div>
                      <span className="mt-1 text-[9px] font-bold text-gold flex items-center gap-0.5 drop-shadow-sm">
                        <Check size={9} strokeWidth={3} /> #{num}
                      </span>
                    </>
                  ) : (
                    <>
                      <Scissors size={18} className="opacity-35" />
                      <span className="mt-1 text-[9px] font-mono font-bold opacity-45">#{num}</span>
                    </>
                  )}
                </motion.div>
              );
            })}

            {/* Sello Especial 11 (Corte Gratis) */}
            <div
              className={`relative flex aspect-square flex-col items-center justify-center rounded-sm border-2 backdrop-blur-sm transition-all ${
                hasFreeCutEarned
                  ? "border-gold bg-gold text-charcoal shadow-xl animate-pulse font-bold"
                  : "border-dashed border-gold/50 bg-gold/15 text-gold shadow-sm"
              }`}
              title="Corte N° 11 de Regalo"
            >
              <Gift size={20} className={hasFreeCutEarned ? "text-charcoal" : "text-gold"} />
              <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-center leading-tight">
                {hasFreeCutEarned ? "¡GRATIS!" : "11° Gratis"}
              </span>
            </div>
          </div>
        </div>

        {/* Jerarquía de Membresías Explicada */}
        <div className="mt-5 pt-3 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
            <span className="text-parchment/50 uppercase tracking-widest font-bold">Rango de Membresía:</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded-sm border ${completedCycles === 0 ? "border-gold text-gold font-bold bg-gold/15" : "border-white/10 text-parchment/40"}`}>
                Classic (1°-10° corte)
              </span>
              <span className="text-parchment/20">→</span>
              <span className={`px-2 py-0.5 rounded-sm border ${completedCycles === 1 ? "border-slate-300 text-slate-200 font-bold bg-slate-300/15" : "border-white/10 text-parchment/40"}`}>
                Silver (+11 cortes)
              </span>
              <span className="text-parchment/20">→</span>
              <span className={`px-2 py-0.5 rounded-sm border ${completedCycles === 2 ? "border-gold text-gold font-bold bg-gold/15" : "border-white/10 text-parchment/40"}`}>
                Gold VIP (+22 cortes)
              </span>
              <span className="text-parchment/20">→</span>
              <span className={`px-2 py-0.5 rounded-sm border ${completedCycles >= 3 ? "border-amber-400 text-amber-300 font-bold bg-amber-400/15" : "border-white/10 text-parchment/40"}`}>
                Black Legend (+33)
              </span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-parchment/60">
          <p>• Válido en servicios de Corte y combos con Corte en Mr. John&apos;s Barbier.</p>
          <p className="font-mono text-gold/80 font-bold">San Ramón, Costa Rica</p>
        </div>

      </div>
    </div>
  );
}

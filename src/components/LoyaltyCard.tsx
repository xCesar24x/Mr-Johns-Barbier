"use client";

import { motion } from "framer-motion";
import { Scissors, Gift, Award, Sparkles, Check } from "lucide-react";

interface LoyaltyCardProps {
  currentStamps: number;
  stampsTarget: number;
  hasFreeCutEarned: boolean;
  completedCycles: number;
  clientName: string;
}

export default function LoyaltyCard({
  currentStamps,
  stampsTarget = 10,
  hasFreeCutEarned,
  completedCycles,
  clientName,
}: LoyaltyCardProps) {
  const stamps = Array.from({ length: stampsTarget }, (_, i) => i + 1);
  const remaining = stampsTarget - currentStamps;

  return (
    <div className="relative overflow-hidden rounded-sm border-2 border-gold/40 bg-gradient-to-br from-charcoal via-[#221f1a] to-charcoal p-6 md:p-8 shadow-2xl texture-leather">
      {/* Decorative Gold Elements */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/5 blur-3xl" />

      {/* Header de la Tarjeta */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/20 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-charcoal shadow-lg">
            <Award size={26} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold">
                Gentleman’s Club
              </span>
              {completedCycles > 0 && (
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-bold text-gold border border-gold/40">
                  Nivel {completedCycles + 1}
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl font-bold text-parchment">
              Tarjeta de Fidelidad
            </h3>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-[11px] uppercase tracking-widest text-parchment/60 font-bold">Titular</p>
          <p className="font-serif text-lg font-bold text-gold">{clientName || "Caballero Distinguido"}</p>
        </div>
      </div>

      {/* Mensaje de Estado / Premio */}
      <div className="relative z-10 my-6">
        {hasFreeCutEarned ? (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-4 rounded-sm border-2 border-gold bg-gold/15 p-4 text-parchment shadow-lg"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal shadow-md animate-bounce">
              <Gift size={24} />
            </div>
            <div>
              <p className="font-serif text-lg font-bold text-gold flex items-center gap-1.5">
                <Sparkles size={18} /> ¡CORTE N°11 GRATIS DESBLOQUEADO!
              </p>
              <p className="text-xs text-parchment/80 mt-0.5">
                ¡Felicidades! Completaste tus 10 cortes. En tu próxima cita, este corte corre por cortesía de Jonathan y Mr. John&apos;s Barbier.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between rounded-sm border border-white/10 bg-black/20 p-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold font-bold">Progreso Actual</p>
              <p className="font-serif text-xl font-bold text-parchment mt-0.5">
                {currentStamps} de {stampsTarget} cortes completados
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-serif font-bold text-gold">{remaining}</span>
              <p className="text-[10px] uppercase tracking-wider text-parchment/60">
                {remaining === 1 ? "corte para el gratis" : "cortes para el gratis"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sellos de Fidelidad (10 sellos + Sello Premio N°11) */}
      <div className="relative z-10">
        <p className="mb-3 text-[10px] uppercase tracking-[0.2em] font-bold text-parchment/60">
          Sellos Acumulados (10 cortes = 11° Gratis)
        </p>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-11 gap-2.5">
          {stamps.map((num) => {
            const isEarned = num <= currentStamps;
            return (
              <motion.div
                key={num}
                whileHover={{ scale: 1.05 }}
                className={`relative flex aspect-square flex-col items-center justify-center rounded-sm border transition-all ${
                  isEarned
                    ? "border-gold bg-gradient-to-b from-gold/30 to-gold/10 text-gold shadow-lg shadow-gold/10"
                    : "border-white/10 bg-white/5 text-parchment/20"
                }`}
              >
                {isEarned ? (
                  <>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-charcoal shadow-sm">
                      <Scissors size={14} className="rotate-45" />
                    </div>
                    <span className="mt-1 text-[9px] font-bold text-gold flex items-center gap-0.5">
                      <Check size={9} strokeWidth={3} /> #{num}
                    </span>
                  </>
                ) : (
                  <>
                    <Scissors size={18} className="opacity-20" />
                    <span className="mt-1 text-[9px] font-mono font-bold opacity-30">#{num}</span>
                  </>
                )}
              </motion.div>
            );
          })}

          {/* Sello Especial 11 (Corte Gratis) */}
          <div
            className={`relative flex aspect-square flex-col items-center justify-center rounded-sm border-2 transition-all ${
              hasFreeCutEarned
                ? "border-gold bg-gold text-charcoal shadow-xl animate-pulse font-bold"
                : "border-dashed border-gold/40 bg-gold/5 text-gold/60"
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

      {/* Footer Info */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-parchment/40">
        <p>• Valido en servicios de Corte y combos con Corte en Mr. John&apos;s Barbier.</p>
        <p className="font-mono text-gold/70">San Ramón, Costa Rica</p>
      </div>
    </div>
  );
}


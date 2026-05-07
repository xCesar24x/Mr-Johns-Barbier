"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import LogoSeal from "./LogoSeal";
import { prefixPath } from "@/lib/utils";

export default function Hero() {
  return (
    <section id="inicio" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax-like effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${prefixPath("/images/hero.png")}')` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-charcoal/60 bg-gradient-to-b from-charcoal/80 via-charcoal/40 to-charcoal" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <LogoSeal />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <span className="text-gold font-sans tracking-[0.3em] uppercase text-sm mb-4 block font-semibold">
            San Ramón, Costa Rica • Desde 1995
          </span>
          <h1 className="text-5xl md:text-8xl font-serif text-parchment mb-8 leading-tight">
            El Arte de la <br />
            <span className="italic text-gold">Barbería Clásica</span>
          </h1>
          <p className="text-parchment/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            Una experiencia de lujo diseñada para el caballero moderno que valora la tradición y la excelencia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#reservar"
              className="px-10 py-5 bg-gold text-charcoal font-bold rounded-sm uppercase tracking-widest hover:bg-bronze transition-all transform hover:scale-105 shadow-xl"
            >
              Reserva tu Experiencia
            </Link>
            <Link 
              href="#servicios"
              className="px-10 py-5 border border-gold/50 text-gold font-bold rounded-sm uppercase tracking-widest hover:bg-gold/10 transition-all shadow-xl"
            >
              Nuestros Servicios
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-gold to-transparent opacity-50" />
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function History() {
  return (
    <section id="historia" className="py-24 bg-parchment relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                src="/images/hero.png" 
                alt="Legado Mr. John's" 
                width={600} 
                height={800}
                className="w-full h-auto"
              />
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gold/30 -z-0" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/10 -z-0 rounded-full blur-3xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-charcoal"
          >
            <span className="text-gold font-sans tracking-[0.2em] uppercase text-sm mb-4 block font-bold">
              Nuestro Legado
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Desde 1995 <br />
              <span className="italic text-bronze">Redefiniendo el Estilo Masculino</span>
            </h2>
            <div className="space-y-6 text-lg font-sans text-charcoal/80 leading-relaxed">
              <p>
                Fundada en el corazón de San Ramón, Barbería Mr. John’s nació con una visión clara: rescatar la elegancia de la barbería clásica y adaptarla a las exigencias del caballero contemporáneo.
              </p>
              <p>
                Durante más de 25 años, hemos sido más que una barbería; somos un santuario para el hombre que busca un momento de distinción, una charla amena y un servicio impecable que honre la tradición artesanal.
              </p>
              <p className="font-serif italic text-xl text-bronze border-l-4 border-gold pl-6 py-2">
                "La calidad no es un acto, es un hábito que cultivamos en cada corte, en cada afeitado, en cada detalle."
              </p>
            </div>
            
            <div className="mt-10 flex items-center gap-8">
              <div>
                <span className="block text-4xl font-serif text-gold">25+</span>
                <span className="text-xs uppercase tracking-widest text-charcoal/60">Años de Experiencia</span>
              </div>
              <div className="w-px h-12 bg-charcoal/10" />
              <div>
                <span className="block text-4xl font-serif text-gold">10k+</span>
                <span className="text-xs uppercase tracking-widest text-charcoal/60">Caballeros Atendidos</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

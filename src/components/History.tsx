"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Award, Star } from "lucide-react";
import { prefixPath } from "@/lib/utils";

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
            <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl border-8 border-white group">
              <Image 
                src={prefixPath("/images/barbero-jonathan.jpg")} 
                alt="Jonathan - Maestro Barbero" 
                width={600} 
                height={800}
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-charcoal/80 backdrop-blur-md p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-gold font-serif italic text-lg text-center">"Cada cliente es un lienzo, cada corte una obra de arte."</p>
              </div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gold/30 -z-0" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gold/5 -z-0 rounded-full blur-3xl" />
            
            {/* Second Image Overlay (Optional small one) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-12 -left-12 w-48 h-64 border-4 border-white shadow-xl z-20 hidden md:block"
            >
              <Image 
                src={prefixPath("/images/barbero-jonathan-2.webp")} 
                alt="Jonathan en acción" 
                fill
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-charcoal"
          >
            <span className="text-gold font-sans tracking-[0.2em] uppercase text-sm mb-4 block font-bold flex items-center gap-2">
              <Star size={16} /> Nuestra Historia & Visión
            </span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Jonathan: <br />
              <span className="italic text-bronze">Pasión y Legado en cada Detalle</span>
            </h2>
            <div className="space-y-6 text-lg font-sans text-charcoal/80 leading-relaxed">
              <p>
                En el corazón de San Ramón, Barbería Mr. John’s es el resultado de la dedicación inquebrantable de **Jonathan**, un maestro barbero que ha dedicado su vida a perfeccionar el arte del cuidado masculino.
              </p>
              <p>
                Con una trayectoria que honra la tradición desde 1995, Jonathan ha transformado Mr. John's en un santuario para el caballero contemporáneo. Su enfoque no es solo estético; es una experiencia de relajación, charla y excelencia técnica que rescata la esencia de las antiguas barberías.
              </p>
              <p className="font-serif italic text-xl text-bronze border-l-4 border-gold pl-6 py-2">
                "Mi compromiso es brindar a cada caballero un momento de distinción, donde el tiempo se detiene y la calidad es la única regla."
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-6">
                <a 
                  href="https://maps.app.goo.gl/nSaBNxD8uBdS4fx39" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold font-bold uppercase tracking-widest text-xs hover:translate-x-2 transition-transform group"
                >
                  <MapPin size={16} className="group-hover:animate-bounce" />
                  Cómo llegar • San Ramón
                </a>
                <div className="flex items-center gap-2 text-charcoal/40 text-xs uppercase tracking-widest font-bold">
                  <Award size={16} className="text-gold" />
                  Especialista en Técnicas Clásicas
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex items-center gap-10">
              <div className="text-center">
                <span className="block text-4xl font-serif text-gold">25+</span>
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold">Años de Maestría</span>
              </div>
              <div className="w-px h-12 bg-gold/20" />
              <div className="text-center">
                <span className="block text-4xl font-serif text-gold">10k+</span>
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold">Clientes Satisfechos</span>
              </div>
              <div className="w-px h-12 bg-gold/20" />
              <div className="text-center">
                <span className="block text-4xl font-serif text-gold">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-charcoal/60 font-bold">Calidad Garantizada</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

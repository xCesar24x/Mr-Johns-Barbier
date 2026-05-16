"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";
import { useState } from "react";

const images = [
  { src: "/images/gal-new-1.webp", alt: "Trabajo en Barbería" },
  { src: "/images/gal-new-3.webp", alt: "Estilo Gentlemen's" },
  { src: "/images/gal-new-4.webp", alt: "Ambiente Premium" },
  { src: "/images/gal-new-5.webp", alt: "Cuidado de barba" },
  { src: "/images/gal-new-6.webp", alt: "Maestría artesanal" },
  { src: "/images/gal-new-7.webp", alt: "Experiencia Mr. John's" },
  { src: "/images/gal-new-8.webp", alt: "Técnica de navaja" },
  { src: "/images/gal-new-9.webp", alt: "Acabados perfectos" },
  { src: "/images/gal-new-10.webp", alt: "Tradición viva" },
];

export default function Gallery() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicamos las imágenes para el efecto infinito
  const doubledImages = [...images, ...images];

  return (
    <section id="galeria" className="py-24 bg-parchment relative overflow-hidden">
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-2xl">
            <span className="text-gold font-sans tracking-[0.2em] uppercase text-sm mb-4 block font-bold">
              Instagram @mrjohnsbarbier
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
              Momentos de <span className="italic text-bronze">Distinción</span>
            </h2>
            <p className="text-charcoal/60 font-sans text-lg">
              Una galería visual de nuestro compromiso con la excelencia y el estilo impecable en San Ramón.
            </p>
          </div>
          <a 
            href="https://www.instagram.com/mrjohnsbarbier" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-10 py-5 bg-charcoal text-parchment rounded-sm font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all duration-500 shadow-xl group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            Explorar Instagram
          </a>
        </div>
      </div>

      {/* Infinite Carousel Row 1 */}
      <div 
        className="relative flex overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          className="flex whitespace-nowrap gap-6 px-4"
          animate={{ x: isPaused ? undefined : "-50%" }}
          transition={{ 
            duration: 35, 
            repeat: Infinity, 
            ease: "linear",
            repeatType: "loop"
          }}
          initial={{ x: 0 }}
        >
          {doubledImages.map((img, index) => (
            <div 
              key={index} 
              className="relative flex-shrink-0 w-[320px] h-[400px] rounded-sm overflow-hidden group shadow-2xl border border-gold/10"
            >
              <Image 
                src={prefixPath(img.src)} 
                alt={img.alt} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-gold font-serif italic text-lg px-4 text-center">{img.alt}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Soft edges fade */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-parchment to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-parchment to-transparent z-10 pointer-events-none" />
      </div>

    </section>
  );
}

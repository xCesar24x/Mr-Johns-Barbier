"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

const images = [
  { src: "/images/gal-new-1.webp", alt: "Trabajo en Barbería", size: "large" },
  { src: "/images/gal-new-3.webp", alt: "Estilo Gentlemen's", size: "small" },
  { src: "/images/gal-new-4.webp", alt: "Ambiente Premium", size: "medium" },
  { src: "/images/gal-new-5.webp", alt: "Cuidado de barba", size: "small" },
  { src: "/images/gal-new-6.webp", alt: "Maestría artesanal", size: "small" },
  { src: "/images/gal-new-7.webp", alt: "Experiencia Mr. John's", size: "medium" },
  { src: "/images/gal-new-8.webp", alt: "Técnica de navaja", size: "small" },
  { src: "/images/gal-new-9.webp", alt: "Acabados perfectos", size: "small" },
  { src: "/images/gal-new-10.webp", alt: "Tradición viva", size: "large" },
  { src: "/images/gal-new-11.webp", alt: "Jonathan en acción", size: "medium" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-24 bg-parchment relative overflow-hidden">
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe.png')]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
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
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:rotate-12 transition-transform"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            Explorar Instagram
          </a>
        </div>

        {/* Dynamic Masonry-like Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`relative overflow-hidden group cursor-pointer rounded-sm shadow-lg
                ${img.size === 'large' ? 'md:col-span-2 md:row-span-2' : ''}
                ${img.size === 'medium' ? 'md:col-span-2 md:row-span-1' : ''}
              `}
            >
              <Image 
                src={prefixPath(img.src)} 
                alt={img.alt} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 border border-gold/50 rounded-full flex items-center justify-center mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a68a56" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                </div>
                <span className="text-gold font-serif italic text-lg opacity-0 group-hover:opacity-100 transition-opacity delay-100">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

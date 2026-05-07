"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";
import { prefixPath } from "@/lib/utils";

const images = [
  { src: "/images/hero.png", alt: "Corte clásico", size: "large" },
  { src: "/images/gal-1.png", alt: "Afeitado tradicional", size: "small" },
  { src: "/images/gal-2.png", alt: "Detalle de tijera", size: "small" },
  { src: "/images/gal-3.png", alt: "Productos premium", size: "medium" },
  { src: "/images/hero.png", alt: "Ambiente Gentlemen's", size: "small" },
  { src: "/images/gal-1.png", alt: "Legado Mr. John's", size: "small" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="py-24 bg-parchment relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-2xl">
            <span className="text-gold font-sans tracking-[0.2em] uppercase text-sm mb-4 block font-bold">
              Instagram @mrjohnsbarbier
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
              Momentos de <span className="italic text-bronze">Distinción</span>
            </h2>
            <p className="text-charcoal/60 font-sans text-lg">
              Sigue nuestro feed para ver las últimas tendencias y el día a día en nuestra barbería.
            </p>
          </div>
          <a 
            href="https://www.instagram.com/mrjohnsbarbier" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-charcoal text-parchment rounded-sm font-bold uppercase tracking-widest hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-lg group"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:scale-110 transition-transform"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            Síguenos
          </a>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden group cursor-pointer rounded-sm shadow-md
                ${img.size === 'large' ? 'col-span-2 row-span-2' : ''}
                ${img.size === 'medium' ? 'col-span-2 row-span-1' : ''}
              `}
            >
              <Image 
                src={prefixPath(img.src)} 
                alt={img.alt} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

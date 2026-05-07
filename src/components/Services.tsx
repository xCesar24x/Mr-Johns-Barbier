"use client";

import { motion } from "framer-motion";
import { Scissors, User, Zap, Sparkles, Smile, Droplets, Target } from "lucide-react";
import { prefixPath } from "@/lib/utils";

const services = [
  {
    title: "Corte",
    description: "Corte de cabello profesional con asesoría de imagen personalizada.",
    price: "₡6,000",
    icon: <Scissors className="w-8 h-8" />,
    image: "/images/haircut.png"
  },
  {
    title: "Barba",
    description: "Diseño y perfilado de barba con ritual de toalla caliente.",
    price: "₡5,000",
    icon: <User className="w-8 h-8" />,
    image: "/images/beard.png"
  },
  {
    title: "Corte y Barba",
    description: "Nuestro servicio estrella para el caballero que cuida cada detalle.",
    price: "₡9,000",
    icon: <Zap className="w-8 h-8" />,
    image: "/images/vip.png"
  },
  {
    title: "Limpieza Facial",
    description: "Tratamiento profundo para revitalizar y limpiar la piel del rostro.",
    price: "₡10,000",
    icon: <Sparkles className="w-8 h-8" />,
    image: "/images/facial.png"
  },
  {
    title: "Keratina",
    description: "Tratamiento alisador y reparador para un cabello impecable.",
    price: "₡20,000",
    icon: <Droplets className="w-8 h-8" />,
  },
  {
    title: "Cera Depilación",
    description: "Eliminación de vello no deseado con técnica suave y efectiva.",
    price: "₡2,000",
    icon: <Target className="w-8 h-8" />,
  },
  {
    title: "Cejas",
    description: "Perfilado y definición de cejas para un marco facial perfecto.",
    price: "₡1,000",
    icon: <Smile className="w-8 h-8" />,
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-charcoal relative overflow-hidden texture-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-sans tracking-[0.3em] uppercase text-sm mb-4 block font-semibold"
          >
            Servicios & Precios
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-parchment"
          >
            Nuestras <span className="italic text-gold">Especialidades</span>
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-1 bg-gold mx-auto mt-6"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-sm group hover:border-gold/50 transition-all duration-500 relative overflow-hidden h-full flex flex-col"
            >
              {/* Decorative background number */}
              <span className="absolute -top-4 -right-2 text-9xl font-serif text-white/5 pointer-events-none group-hover:text-gold/5 transition-colors duration-500">
                0{index + 1}
              </span>
              
              <div className="mb-6 text-gold group-hover:scale-110 transition-transform duration-500 origin-left">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-serif text-parchment mb-4 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              
              <p className="text-parchment/60 mb-8 font-sans text-sm leading-relaxed flex-grow">
                {service.description}
              </p>
              
              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <span className="text-xl font-serif text-gold font-bold">{service.price}</span>
                <button className="text-xs uppercase tracking-widest text-parchment hover:text-gold transition-colors font-bold">
                  Reservar
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-parchment/40 font-sans italic text-sm">
            * Todos nuestros servicios incluyen asesoría de imagen personalizada y productos de cuidado profesional.
          </p>
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DEFAULT_SERVICES } from "@/lib/defaultServices";
import { ServiceItem } from "@/types/service";
import ServiceIcon from "@/components/ServiceIcon";

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        if (data.success && Array.isArray(data.services) && data.services.length > 0) {
          // Filtrar únicamente los activos para la vista de clientes
          setServices(data.services.filter((s: ServiceItem) => s.active !== false));
        }
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };

    fetchServices();
  }, []);

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
              key={service.id || service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass p-8 rounded-sm group hover:border-gold/50 transition-all duration-500 relative overflow-hidden h-full flex flex-col"
            >
              {/* Decorative background number */}
              <span className="absolute -top-4 -right-2 text-9xl font-serif text-white/5 pointer-events-none group-hover:text-gold/5 transition-colors duration-500">
                {String(index + 1).padStart(2, "0")}
              </span>
              
              <div className="mb-6 text-gold group-hover:scale-110 transition-transform duration-500 origin-left">
                <ServiceIcon name={service.icon} className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-serif text-parchment mb-4 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              
              <p className="text-parchment/60 mb-8 font-sans text-sm leading-relaxed flex-grow">
                {service.description}
              </p>
              
              <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <span className="text-xl font-serif text-gold font-bold">
                  ₡{service.price.toLocaleString()}
                </span>
                <a 
                  href="#reservar"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('select-service', { detail: service.title }));
                  }}
                  className="text-xs uppercase tracking-widest text-parchment hover:text-gold transition-colors font-bold cursor-pointer"
                >
                  Reservar
                </a>
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

"use client";

import { MessageSquare, Phone, MapPin, Mail, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-parchment pt-20 border-t border-gold/10 relative overflow-hidden">
      {/* Decorative texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand & Mission */}
          <div className="space-y-6 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image 
                  src={prefixPath("/images/logo.png")} 
                  alt="Mr. John's Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-2xl tracking-widest text-gold font-bold">
                MR. JOHN'S
              </span>
            </Link>
            <p className="text-parchment/60 font-sans text-sm leading-relaxed">
              Dedicados al arte de la barbería clásica desde 1995. Un espacio exclusivo para el caballero que valora la tradición y la distinción.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/mrjohnsbarbier" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://wa.me/50672429342" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-lg">
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-gold font-serif text-xl mb-6 uppercase tracking-widest text-sm font-bold">Navegación</h4>
            <ul className="space-y-4 font-sans text-xs uppercase tracking-[0.2em] font-bold">
              <li><Link href="#inicio" className="hover:text-gold transition-colors">Inicio</Link></li>
              <li><Link href="#historia" className="hover:text-gold transition-colors">Historia</Link></li>
              <li><Link href="#servicios" className="hover:text-gold transition-colors">Servicios</Link></li>
              <li><Link href="#galeria" className="hover:text-gold transition-colors">Galería</Link></li>
              <li><Link href="#reservar" className="hover:text-gold transition-colors">Citas</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-serif text-xl mb-6 uppercase tracking-widest text-sm font-bold">Contacto</h4>
            <ul className="space-y-6 font-sans text-parchment/60 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                <a href="https://maps.app.goo.gl/nSaBNxD8uBdS4fx39" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors leading-relaxed">
                  San Ramón, Alajuela, Costa Rica.<br/>Frente al parque central.
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <span className="font-bold tracking-wider">+506 7242-9342</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <span className="text-xs tracking-tighter">info@mrjohnsbarbier.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-gold font-serif text-xl mb-6 uppercase tracking-widest text-sm font-bold">Horario</h4>
            <ul className="space-y-4 font-sans text-parchment/60 text-sm">
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" />
                  <span>Lun - Vie</span>
                </div>
                <span className="font-bold">9:00 - 19:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sábados</span>
                <span className="font-bold">8:00 - 18:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Domingos</span>
                <span className="text-gold font-bold italic uppercase text-xs">Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Mini Map - Small Square */}
          <div className="lg:col-span-1">
            <h4 className="text-gold font-serif text-xl mb-6 uppercase tracking-widest text-sm font-bold opacity-0 lg:block hidden">Ubicación</h4>
            <div className="rounded-sm overflow-hidden border border-gold/20 shadow-xl aspect-square relative grayscale hover:grayscale-0 transition-all duration-700 group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d500832.7437839459!2d-84.9519924!3d10.0908959!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa045dbdb8e8abd%3A0xc2e9c4a8d9d6c77e!2sMrJohnsbarbier!5e1!3m2!1ses-419!2scr!4v1778168620814!5m2!1ses-419!2scr"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 pointer-events-none border-4 border-charcoal/30" />
            </div>
          </div>

        </div>

        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-parchment/30 font-bold">
          <p>© {currentYear} MR. JOHN'S GENTLEMEN'S BARBERÍA. TODOS LOS DERECHOS RESERVADOS.</p>
          <p>DESARROLLADO CON DISTINCIÓN POR ANTIGRAVITY</p>
        </div>
      </div>
    </footer>
  );
}

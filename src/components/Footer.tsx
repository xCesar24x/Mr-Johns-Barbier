"use client";

import { MessageSquare, Phone, MapPin, Mail, Clock, Scissors } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
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
            <p className="text-parchment/60 font-sans leading-relaxed">
              Dedicados al arte de la barbería clásica desde 1995. Un espacio exclusivo para el caballero que valora la tradición y la distinción.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/mrjohnsbarbier" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300">
                <svg
                  width="20"
                  height="20"
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
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://wa.me/50672429342" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300">
                <MessageSquare size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gold font-serif text-xl mb-6">Navegación</h4>
            <ul className="space-y-4 font-sans text-sm uppercase tracking-widest">
              <li><Link href="#inicio" className="hover:text-gold transition-colors">Inicio</Link></li>
              <li><Link href="#historia" className="hover:text-gold transition-colors">Historia</Link></li>
              <li><Link href="#servicios" className="hover:text-gold transition-colors">Servicios</Link></li>
              <li><Link href="#galeria" className="hover:text-gold transition-colors">Galería</Link></li>
              <li><Link href="#reservar" className="hover:text-gold transition-colors">Citas</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-serif text-xl mb-6">Contacto</h4>
            <ul className="space-y-4 font-sans text-parchment/60">
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-gold shrink-0 group-hover:scale-110 transition-transform" />
                <a 
                  href="https://maps.app.goo.gl/nSaBNxD8uBdS4fx39" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  San Ramón, Alajuela, Costa Rica.<br/>Frente al parque central.
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <span>+506 7242-9342</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <span>info@mrjohnsbarbier.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-gold font-serif text-xl mb-6">Horario</h4>
            <ul className="space-y-4 font-sans text-parchment/60">
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gold" />
                  <span>Lun - Vie</span>
                </div>
                <span>9:00 - 19:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sábados</span>
                <span>8:00 - 18:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Domingos</span>
                <span className="text-gold">Cerrado</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mini Map Section */}
        <div className="mb-20 rounded-sm overflow-hidden border border-gold/20 shadow-2xl h-[300px] relative grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3928.0988751269915!2d-84.4681118!3d10.0909841!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1ses-419!2scr!4v1778168337560!5m2!1ses-419!2scr"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="opacity-60 hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 pointer-events-none border-[12px] border-charcoal/30" />
        </div>

        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-parchment/40 font-bold">
          <p>© {currentYear} MR. JOHN'S GENTLEMEN'S BARBERÍA. TODOS LOS DERECHOS RESERVADOS.</p>
          <p>DESARROLLADO CON DISTINCIÓN POR ANTIGRAVITY</p>
        </div>
      </div>
    </footer>
  );
}

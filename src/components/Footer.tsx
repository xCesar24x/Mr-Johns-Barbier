"use client";

import { MessageSquare, Phone, MapPin, Mail, Clock, Scissors } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
                  src="/images/logo.png" 
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
              Dedicados al arte de la barbería clásica en San Ramón desde 1995. Elevamos el estándar del cuidado masculino con elegancia y tradición.
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
            <ul className="space-y-4 text-parchment/60 font-sans uppercase tracking-widest text-xs font-bold">
              <li><Link href="#inicio" className="hover:text-gold transition-colors">Inicio</Link></li>
              <li><Link href="#historia" className="hover:text-gold transition-colors">Historia</Link></li>
              <li><Link href="#servicios" className="hover:text-gold transition-colors">Servicios</Link></li>
              <li><Link href="#galeria" className="hover:text-gold transition-colors">Galería</Link></li>
              <li><Link href="#reservar" className="hover:text-gold transition-colors">Reservas</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-gold font-serif text-xl mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <MapPin className="text-gold mt-1 shrink-0" size={18} />
                <span className="text-parchment/60">San Ramón de Alajuela, <br />Costado Norte del Parque Central.</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-gold shrink-0" size={18} />
                <span className="text-parchment/60">+506 7242 9342</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-gold shrink-0" size={18} />
                <span className="text-parchment/60">info@mrjohns.cr</span>
              </li>
              <li className="flex items-start gap-4">
                <Clock className="text-gold mt-1 shrink-0" size={18} />
                <span className="text-parchment/60">Lun - Sáb: 8:00 AM - 7:00 PM <br />Dom: Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Map Integration (Placeholder for Google Maps API) */}
          <div className="rounded-sm overflow-hidden h-48 md:h-full min-h-[200px] relative border border-gold/20 shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15715.46554523992!2d-84.478796!3d10.088339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0435163351f03%3A0xe54e38e15d86b7c5!2sSan%20Ram%C3%B3n%2C%20Alajuela%20Province!5e0!3m2!1sen!2scr!4v1715080000000!5m2!1sen!2scr" 
              className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500" 
              loading="lazy"
            ></iframe>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-[0.2em] text-parchment/40">
          <p>© {currentYear} Mr. John’s Gentlemen's Barbería. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-gold">Privacidad</Link>
            <Link href="#" className="hover:text-gold">Términos</Link>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/50672429342"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
      >
        <MessageSquare size={28} />
        <span className="absolute right-full mr-4 bg-charcoal text-parchment px-4 py-2 rounded-sm text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gold/20 shadow-xl">
          ¿Necesitas ayuda?
        </span>
      </a>
    </footer>
  );
}

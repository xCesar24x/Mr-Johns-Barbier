"use client";

import { Phone, MapPin, Mail, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

// WhatsApp Icon Component
const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.045a11.871 11.871 0 001.592 5.925L0 24l6.135-1.61a11.815 11.815 0 005.915 1.586h.005c6.637 0 12.048-5.411 12.051-12.045a11.815 11.815 0 00-3.592-8.511"/>
  </svg>
);

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
              <div className="relative w-16 h-16">
                <Image 
                  src={prefixPath("/images/logo.png")} 
                  alt="Mr. John's Logo" 
                  fill
                  className="object-contain rounded-full"
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
              <a href="https://www.facebook.com/MrJohnsBarbier" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://wa.me/50672429342" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-lg">
                <WhatsAppIcon size={18} />
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
                  San Ramón, Alajuela, Costa Rica.
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <span className="font-bold tracking-wider">+506 7242-9342</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <a href="mailto:mrjohnsbarbier@gmail.com" className="text-xs tracking-tighter hover:text-gold transition-colors">mrjohnsbarbier@gmail.com</a>
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
                <span className="font-bold">8:00 - 19:00</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sábados</span>
                <span className="text-gold font-bold italic uppercase text-xs">Cerrado</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Domingos</span>
                <span className="font-bold">7:00 - 12:00</span>
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

        <div className="py-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-[0.3em] text-parchment/30 font-bold">
          <p>© {currentYear} MR. JOHN'S GENTLEMEN'S BARBERÍA. TODOS LOS DERECHOS RESERVADOS.</p>
          <a 
            href="https://www.instagram.com/rutadigitalcr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:text-gold transition-colors group"
          >
            <span className="text-sm">Desarrollado por Ruta Digital</span>
            <div className="relative w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity">
              <Image 
                src={prefixPath("/images/ruta-digital-logo.png")} 
                alt="Ruta Digital" 
                fill
                className="object-contain"
              />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { prefixPath } from "@/lib/utils";

const navLinks = [
  { name: "Inicio", href: "#inicio" },
  { name: "Historia", href: "#historia" },
  { name: "Servicios", href: "#servicios" },
  { name: "Galería", href: "#galeria" },
  { name: "Reservar", href: "#reservar" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src={prefixPath("/images/logo4k.png")} 
                alt="Mr. John's Logo" 
                width={56} 
                height={56}
                className="object-contain rounded-full shadow-lg"
              />
              <span className="font-serif text-xl tracking-widest text-gold font-bold hidden sm:block">
                MR. JOHN'S
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-parchment hover:text-gold transition-colors duration-200 text-sm font-medium tracking-widest uppercase"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="#reservar"
                className="bg-gold text-charcoal px-6 py-2 rounded-sm font-bold uppercase tracking-wider text-xs hover:bg-bronze transition-all transform hover:scale-105"
              >
                Reservar
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-parchment hover:text-gold p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-gold/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-parchment hover:text-gold transition-colors py-3 text-lg font-medium border-b border-white/5"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  href="#reservar"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-gold text-charcoal py-4 rounded-sm font-bold uppercase tracking-widest"
                >
                  Reservar Ahora
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

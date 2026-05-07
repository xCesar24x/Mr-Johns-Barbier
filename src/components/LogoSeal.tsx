import { motion } from "framer-motion";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

export default function LogoSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center ${className}`}>
      {/* Subtle background glow instead of hard rings */}
      <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full" />
      
      {/* The actual logo image - now without forced rounding as the user provided a 'sin fondo' version */}
      <div className="relative w-full h-full p-2">
        <Image 
          src={prefixPath("/images/logo.png")} 
          alt="Mr. John's Logo" 
          fill
          className="object-contain"
          priority
        />
      </div>
      
      {/* Minimal decorative element */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute -inset-2 border border-gold/10 rounded-full pointer-events-none" 
      />
    </div>
  );
}

import { motion } from "framer-motion";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

export default function LogoSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full" />
      
      {/* 
        Option 1: 'Sello Blanco' effect 
        - brightness(0) invert(1) makes the dark parts white.
        - contrast(200%) makes it sharper.
        - mix-blend-mode: screen hides any black areas (like the inverted background).
      */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full mix-blend-screen"
        style={{ 
          filter: "brightness(0) invert(1) contrast(150%)",
        }}
      >
        <Image 
          src={prefixPath("/images/logo.png")} 
          alt="Mr. John's Logo" 
          fill
          className="object-contain p-2"
          priority
        />
      </motion.div>
      
      {/* Decorative floating particles or minimal frame could go here if needed */}
    </div>
  );
}

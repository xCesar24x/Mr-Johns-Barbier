import { motion } from "framer-motion";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

export default function LogoSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center ${className}`}>
      {/* Outer rings animation */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-gold/30 rounded-full border-dashed"
      />
      
      {/* The actual logo image */}
      <div className="relative w-full h-full p-4">
        <Image 
          src={prefixPath("/images/logo.png")} 
          alt="Mr. John's Logo" 
          fill
          className="object-contain rounded-full shadow-2xl"
        />
      </div>
      
      {/* Decorative pulse ring */}
      <div className="absolute inset-0 border-4 border-gold rounded-full opacity-10 animate-pulse" />
    </div>
  );
}

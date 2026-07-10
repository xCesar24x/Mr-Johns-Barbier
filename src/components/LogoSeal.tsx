import { motion } from "framer-motion";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

export default function LogoSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center ${className}`}>

      {/* The actual logo image */}
      <div className="relative w-full h-full p-4">
        <Image 
          src={prefixPath("/images/logo4k.png")} 
          alt="Mr. John's Logo" 
          fill
          className="object-contain rounded-full shadow-2xl"
          priority
        />
      </div>
      
      {/* Decorative pulse ring */}
      <div className="absolute inset-0 border-4 border-gold rounded-full opacity-10 animate-pulse" />
    </div>
  );
}

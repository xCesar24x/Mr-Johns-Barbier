import { motion } from "framer-motion";
import Image from "next/image";
import { prefixPath } from "@/lib/utils";

export default function LogoSeal({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center ${className}`}>
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full h-full mix-blend-screen"
        style={{ 
          filter: "invert(1) grayscale(1) brightness(1.2)",
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
    </div>
  );
}

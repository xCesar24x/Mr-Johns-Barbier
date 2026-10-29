import React from "react";
import { 
  Scissors, 
  User, 
  Zap, 
  Sparkles, 
  Droplets, 
  Target, 
  Smile, 
  Flame, 
  Crown, 
  Star, 
  ShieldCheck, 
  Gem
} from "lucide-react";

export const AVAILABLE_SERVICE_ICONS = [
  { id: "scissors", label: "Tijeras", icon: Scissors },
  { id: "beard", label: "Barba / Silueta", icon: User },
  { id: "zap", label: "Rayo / VIP", icon: Zap },
  { id: "sparkles", label: "Brillo / Facial", icon: Sparkles },
  { id: "droplets", label: "Gotas / Keratina", icon: Droplets },
  { id: "target", label: "Precisión / Depilación", icon: Target },
  { id: "smile", label: "Sonrisa / Cejas", icon: Smile },
  { id: "flame", label: "Fuego / Ritual", icon: Flame },
  { id: "crown", label: "Corona / Premium", icon: Crown },
  { id: "star", label: "Estrella / Clásico", icon: Star },
  { id: "gem", label: "Joya / Exclusivo", icon: Gem },
  { id: "shield", label: "Cuidado Total", icon: ShieldCheck },
];

export default function ServiceIcon({ 
  name, 
  className = "w-8 h-8" 
}: { 
  name?: string; 
  className?: string;
}) {
  const normalized = (name || "scissors").toLowerCase();
  
  switch (normalized) {
    case "scissors":
      return <Scissors className={className} />;
    case "beard":
    case "user":
      return <User className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "droplets":
      return <Droplets className={className} />;
    case "target":
      return <Target className={className} />;
    case "smile":
      return <Smile className={className} />;
    case "flame":
      return <Flame className={className} />;
    case "crown":
      return <Crown className={className} />;
    case "star":
      return <Star className={className} />;
    case "gem":
      return <Gem className={className} />;
    case "shield":
      return <ShieldCheck className={className} />;
    default:
      return <Scissors className={className} />;
  }
}

import { ServiceItem } from "@/types/service";

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "corte",
    title: "Corte",
    description: "Corte de cabello profesional con asesoría de imagen personalizada.",
    price: 6000,
    icon: "scissors",
    active: true,
  },
  {
    id: "barba",
    title: "Barba",
    description: "Diseño y perfilado de barba con ritual de toalla caliente.",
    price: 5000,
    icon: "beard",
    active: true,
  },
  {
    id: "corte-y-barba",
    title: "Corte y Barba",
    description: "Nuestro servicio estrella para el caballero que cuida cada detalle.",
    price: 9000,
    icon: "zap",
    active: true,
  },
  {
    id: "limpieza-facial",
    title: "Limpieza Facial",
    description: "Tratamiento profundo para revitalizar y limpiar la piel del rostro.",
    price: 10000,
    icon: "sparkles",
    active: true,
  },
  {
    id: "keratina",
    title: "Keratina",
    description: "Tratamiento alisador y reparador para un cabello impecable.",
    price: 20000,
    icon: "droplets",
    active: true,
  },
  {
    id: "cera-depilacion",
    title: "Cera Depilación",
    description: "Eliminación de vello no deseado con técnica suave y efectiva.",
    price: 2000,
    icon: "target",
    active: true,
  },
  {
    id: "cejas",
    title: "Cejas",
    description: "Perfilado y definición de cejas para un marco facial perfecto.",
    price: 1000,
    icon: "smile",
    active: true,
  },
];

export const getPricesMap = (services: ServiceItem[]): Record<string, number> => {
  const map: Record<string, number> = {};
  for (const s of services) {
    map[s.title] = s.price;
  }
  return map;
};

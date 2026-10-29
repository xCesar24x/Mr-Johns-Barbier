export interface ServiceItem {
  id: string;
  title: string;
  price: number;
  duration?: number; // Duración en minutos (por defecto 60)
  description: string;
  icon?: string;
  active?: boolean;
}

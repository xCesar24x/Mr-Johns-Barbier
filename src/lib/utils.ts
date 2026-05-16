export const prefixPath = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
};

export const formatDateKey = (date: Date | string) => {
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  const d = new Date(date);
  // If it's a Date object or an ISO string, we extract parts carefully
  // We use local time for Date objects (as they come from the UI)
  // but we prefer the string as-is if it exists.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const SERVICE_PRICES: Record<string, number> = {
  "Corte": 6000,
  "Barba": 5000,
  "Corte y Barba": 9000,
  "Limpieza Facial": 10000,
  "Keratina": 20000,
  "Cera Depilación": 2000,
  "Cejas": 1000
};

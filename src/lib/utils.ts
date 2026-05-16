export const prefixPath = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath;
};

export const formatDateKey = (date: Date | string) => {
  const d = new Date(date);
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

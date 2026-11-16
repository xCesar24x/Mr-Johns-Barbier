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

export const formatColonPrice = (price: number): string => {
  return (price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

export function getOccupiedSlotsForBooking(time: string, duration: number): string[] {
  if (!time || !time.includes(':')) return [];
  const slots: string[] = [];
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return [];
  let currentMinutes = h * 60 + m;
  const endMinutes = currentMinutes + (duration > 0 ? duration : 60);

  while (currentMinutes < endMinutes) {
    const slotH = Math.floor(currentMinutes / 60);
    const slotM = currentMinutes % 60;
    const slotStr = `${slotH}:${slotM === 0 ? '00' : slotM}`;
    slots.push(slotStr);
    currentMinutes += 30;
  }
  return slots;
}

export const BARBERSHOP_PHONE = '72429342';

export function normalizePhone(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00506') && digits.length === 13) {
    return digits.slice(5);
  }
  if (digits.startsWith('506') && digits.length === 11) {
    return digits.slice(3);
  }
  return digits;
}

const NAME_STOP_WORDS = new Set(['de', 'del', 'la', 'las', 'los', 'y']);

export function tokenizeName(name: string): string[] {
  const normalized = (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();

  if (!normalized) return [];
  const rawTokens = normalized.split(/\s+/).filter(Boolean);
  const filtered = rawTokens.filter((t) => !NAME_STOP_WORDS.has(t));
  return filtered.length > 0 ? filtered : rawTokens;
}

export function nameMatches(inputName: string, candidateName: string): boolean {
  const inputTokens = tokenizeName(inputName);
  const candidateTokens = tokenizeName(candidateName);

  if (inputTokens.length === 0 || candidateTokens.length === 0) return false;
  if (inputTokens.join('').length < 2) return false;

  const allInputInCandidate = inputTokens.every((t) => candidateTokens.includes(t));
  if (allInputInCandidate) return true;

  if (candidateTokens.length === 1 && inputTokens.includes(candidateTokens[0])) {
    return true;
  }

  return false;
}

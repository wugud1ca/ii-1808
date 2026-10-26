export interface StorageCodeItem {
  code: string;
  name: string;
  ts: string;
}

export const HISTORY_STORAGE_KEY = 'et_tnved_history';
export const FAVORITES_STORAGE_KEY = 'et_tnved_favorites';

export const MAX_HISTORY_ITEMS = 20;
export const MAX_FAVORITES_ITEMS = 100;

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) return (globalThis as any).localStorage;
  return null;
}

function safeGetItem(key: string): string | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore quota or private-browsing errors
  }
}

function safeRemoveItem(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Ignore
  }
}

function parseItems(raw: string | null): StorageCodeItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === 'object' && typeof item.code === 'string' && typeof item.name === 'string')
      .map((item) => ({
        code: String(item.code).trim(),
        name: String(item.name).trim(),
        ts: typeof item.ts === 'string' && item.ts ? item.ts : new Date(item.ts || Date.now()).toISOString(),
      }));
  } catch {
    return [];
  }
}

export function loadHistory(): StorageCodeItem[] {
  return parseItems(safeGetItem(HISTORY_STORAGE_KEY)).slice(0, MAX_HISTORY_ITEMS);
}

export function saveHistory(items: StorageCodeItem[]): void {
  safeSetItem(HISTORY_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_HISTORY_ITEMS)));
}

export function addHistoryItem(code: string, name: string, now = new Date()): StorageCodeItem[] {
  const cleanCode = code.trim();
  const cleanName = name.trim();
  if (!cleanCode) return loadHistory();

  const current = loadHistory();
  // Уникальность по code: повторное открытие — обновить ts и переместить наверх
  const filtered = current.filter((item) => item.code !== cleanCode);
  const updated: StorageCodeItem[] = [
    { code: cleanCode, name: cleanName, ts: now.toISOString() },
    ...filtered,
  ].slice(0, MAX_HISTORY_ITEMS);

  saveHistory(updated);
  return updated;
}

export function clearHistory(): void {
  safeRemoveItem(HISTORY_STORAGE_KEY);
}

export function loadFavorites(): StorageCodeItem[] {
  return parseItems(safeGetItem(FAVORITES_STORAGE_KEY)).slice(0, MAX_FAVORITES_ITEMS);
}

export function saveFavorites(items: StorageCodeItem[]): void {
  safeSetItem(FAVORITES_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_FAVORITES_ITEMS)));
}

export function toggleFavoriteItem(code: string, name: string, now = new Date()): { items: StorageCodeItem[]; isFav: boolean } {
  const cleanCode = code.trim();
  const cleanName = name.trim();
  const current = loadFavorites();
  const exists = current.some((item) => item.code === cleanCode);

  let updated: StorageCodeItem[];
  let isFav: boolean;

  if (exists) {
    updated = current.filter((item) => item.code !== cleanCode);
    isFav = false;
  } else {
    updated = [
      { code: cleanCode, name: cleanName, ts: now.toISOString() },
      ...current.filter((item) => item.code !== cleanCode),
    ].slice(0, MAX_FAVORITES_ITEMS);
    isFav = true;
  }

  saveFavorites(updated);
  return { items: updated, isFav };
}

export function removeFavoriteItem(code: string): StorageCodeItem[] {
  const cleanCode = code.trim();
  const current = loadFavorites();
  const updated = current.filter((item) => item.code !== cleanCode);
  saveFavorites(updated);
  return updated;
}

export function isFavoriteCode(code: string, items: StorageCodeItem[]): boolean {
  const clean = code.trim();
  return items.some((item) => item.code === clean);
}

export function pluralizeCodes(count: number): string {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  if (mod100 >= 11 && mod100 <= 19) return `${count} кодов`;
  if (mod10 === 1) return `${count} код`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} кода`;
  return `${count} кодов`;
}

export function formatLeadContext(codes: string[]): string {
  const cleanCodes = Array.from(new Set(codes.map((c) => c.trim()).filter(Boolean)));
  if (cleanCodes.length === 0) return 'Просчёт поставки';
  return `Просчёт поставки по кодам: ${cleanCodes.join(', ')}`;
}

// Шина «центра сообщений»: блок приходов (DailyArrivalsBlock) публикует
// текущий ТТН-пуш, а ToastCenter отображает его вместе с промо-пушем
// единой колонкой. ТТН-пуши сменяют друг друга (один слот).
import type { DailyArrival } from '../data/dailyArrivals';

let ttn: DailyArrival | null = null;
const TTN_SUPPRESSION_KEY = 'et-no-arrival-toasts';

function readTtnSuppressed(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(TTN_SUPPRESSION_KEY) === '1';
  } catch {
    return false;
  }
}

let ttnSuppressed = readTtnSuppressed();
let highlightHandler: ((ttn: string) => void) | null = null;
const subs = new Set<() => void>();

function notify(): void {
  subs.forEach((f) => f());
}

export const toastCenter = {
  get ttn(): DailyArrival | null {
    return ttn;
  },
  get ttnSuppressed(): boolean {
    return ttnSuppressed;
  },
  setTtn(v: DailyArrival | null): void {
    ttn = v && ttnSuppressed ? null : v;
    notify();
  },
  setTtnSuppressed(v: boolean): void {
    ttnSuppressed = v;
    if (v) ttn = null;
    try {
      localStorage.setItem(TTN_SUPPRESSION_KEY, v ? '1' : '0');
    } catch {
      // localStorage may be unavailable in private/restricted browsing modes.
    }
    notify();
  },
  setHighlightHandler(h: ((ttn: string) => void) | null): void {
    highlightHandler = h;
  },
  highlight(ttnValue: string): void {
    highlightHandler?.(ttnValue);
  },
  subscribe(f: () => void): () => void {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

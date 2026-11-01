// Шина «центра сообщений»: блок приходов (DailyArrivalsBlock) публикует
// текущий ТТН-пуш, а ToastCenter отображает его вместе с промо-пушем
// единой колонкой. ТТН-пуши сменяют друг друга (один слот).
import type { DailyArrival } from '../data/dailyArrivals';

let ttn: DailyArrival | null = null;
let highlightHandler: ((ttn: string) => void) | null = null;
const subs = new Set<() => void>();

function notify(): void {
  subs.forEach((f) => f());
}

export const toastCenter = {
  get ttn(): DailyArrival | null {
    return ttn;
  },
  setTtn(v: DailyArrival | null): void {
    ttn = v;
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

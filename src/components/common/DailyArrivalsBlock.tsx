import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Truck, ZoomIn, ArrowDownRight } from 'lucide-react';
import { dailyArrivals, DailyArrival } from '../../data/dailyArrivals';

const INITIAL_COUNT = 8;               // показываем сразу
const TOTAL_APPEAR_MS = 2.5 * 60 * 1000; // оставшиеся растягиваем на 2.5 минуты (ускорено в 2 раза)
const FIRST_WINDOW_MS = 30 * 1000;     // первые 4 груза — в первые 30 секунд
const FIRST_IN_WINDOW = 4;
const SKELETON_MS = 1300;              // сколько «прорисовывается» скелетон
const TOAST_MS = 8000;                 // автоскрытие пуша

// Накопительные моменты появления: случайные интервалы.
// Первые FIRST_IN_WINDOW грузов — в течение первой минуты, остальные — до конца TOTAL_APPEAR_MS.
function buildAppearSchedule(count: number, totalMs: number): number[] {
  const delays: number[] = [];
  const inWindow = Math.min(count, FIRST_IN_WINDOW);

  const ws1 = Array.from({ length: inWindow }, () => 0.35 + Math.random());
  const sum1 = ws1.reduce((a, b) => a + b, 0);
  let acc = 0;
  for (const w of ws1) {
    acc += (w / sum1) * FIRST_WINDOW_MS;
    delays.push(Math.round(acc));
  }

  const rest = count - inWindow;
  if (rest > 0) {
    const restMs = Math.max(totalMs - FIRST_WINDOW_MS, rest * 4000);
    const ws2 = Array.from({ length: rest }, () => 0.35 + Math.random());
    const sum2 = ws2.reduce((a, b) => a + b, 0);
    let acc2 = FIRST_WINDOW_MS;
    for (const w of ws2) {
      acc2 += (w / sum2) * restMs;
      delays.push(Math.round(acc2));
    }
  }
  return delays;
}

export const DailyArrivalsBlock: React.FC = () => {
  const [renderedCount, setRenderedCount] = useState<number>(INITIAL_COUNT);
  const [skeletonCount, setSkeletonCount] = useState<number>(0);
  const [active, setActive] = useState<number | null>(null);
  const [toastItem, setToastItem] = useState<DailyArrival | null>(null);
  const [highlightTtn, setHighlightTtn] = useState<string | null>(null);

  const blockRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<number[]>([]);
  if (scheduleRef.current.length === 0) {
    scheduleRef.current = buildAppearSchedule(dailyArrivals.length - INITIAL_COUNT, TOTAL_APPEAR_MS);
  }

  const isBlockVisible = () => {
    if (!blockRef.current) return true;
    const rect = blockRef.current.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  // Появление оставшихся грузов: скелетон -> реальная карточка, со случайными интервалами
  useEffect(() => {
    const timers: number[] = [];
    scheduleRef.current.forEach((at, idx) => {
      timers.push(
        window.setTimeout(() => {
          // Шаг 1: показываем скелетон
          setSkeletonCount((c) => c + 1);
          timers.push(
            window.setTimeout(() => {
              // Шаг 2: скелетон «прорисовывается» в реальную карточку
              setSkeletonCount((c) => c - 1);
              setRenderedCount((r) => r + 1);
              const item = dailyArrivals[INITIAL_COUNT + idx];
              if (item && !isBlockVisible()) {
                setToastItem(item);
              }
            }, SKELETON_MS)
          );
        }, at)
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Автоскрытие пуша
  useEffect(() => {
    if (!toastItem) return;
    const t = window.setTimeout(() => setToastItem(null), TOAST_MS);
    return () => window.clearTimeout(t);
  }, [toastItem]);

  // Подсветка при переходе к грузу из пуша
  useEffect(() => {
    if (!highlightTtn) return;
    const t = window.setTimeout(() => setHighlightTtn(null), 3000);
    return () => window.clearTimeout(t);
  }, [highlightTtn]);

  const handleGoToCargo = (ttn: string) => {
    setToastItem(null);
    setHighlightTtn(ttn);
    const el = document.getElementById(`arrival-${ttn}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + renderedCount) % renderedCount)),
    [renderedCount]
  );
  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % renderedCount)),
    [renderedCount]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [active, close, prev, next]);

  const visible = dailyArrivals.slice(0, renderedCount);

  return (
    <div ref={blockRef} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </span>
            Грузы получаемые нами ежедневно:
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Реальные партии, полученные клиентам в России. Нажмите на груз, чтобы рассмотреть фото.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-3.5 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-700">
            Получено клиентами
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {visible.map((item, idx) => (
          <div
            key={item.ttn}
            id={`arrival-${item.ttn}`}
            className={`group bg-slate-50 border rounded-2xl overflow-hidden transition-all animate-in fade-in duration-500 ${
              highlightTtn === item.ttn
                ? 'border-orange-500 ring-2 ring-orange-400 shadow-lg shadow-orange-600/20'
                : 'border-slate-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-600/10'
            }`}
          >
            <button
              onClick={() => setActive(idx)}
              className="relative w-full aspect-[4/3] overflow-hidden cursor-zoom-in focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              aria-label={`Увеличить фото груза ${item.ttn}`}
            >
              <img
                src={item.photo}
                alt={`Груз ${item.ttn}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute bottom-2 right-2 bg-slate-900/70 text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3 h-3" /> Увеличить
              </span>
            </button>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-900 font-mono tracking-wide">ТТН {item.ttn}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  Получен
                </span>
              </div>
              {(() => {
                const hasPlaces = item.places !== null;
                const hasWeight = item.weight !== null;
                const hasVolume = item.volume !== null;
                const total = (hasPlaces ? 1 : 0) + (hasWeight ? 1 : 0) + (hasVolume ? 1 : 0);
                if (total === 0) {
                  // Параметров нет — показываем «Мест: Скрыто» на 1/3 ширины
                  return (
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-white rounded-lg border border-slate-200 py-1.5 px-1">
                        <div className="text-[10px] text-slate-400 hidden sm:block">Мест</div>
                        <div className="text-[10px] text-slate-400 sm:hidden">шт</div>
                        <div className="text-xs font-bold text-slate-400">Скрыто</div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className={`grid gap-1.5 text-center ${total === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {hasPlaces && (
                      <div className="bg-white rounded-lg border border-slate-200 py-1.5 px-1">
                        <div className="text-[10px] text-slate-400 hidden sm:block">Мест</div>
                        <div className="text-[10px] text-slate-400 sm:hidden">шт</div>
                        <div className="text-xs font-bold text-slate-800">{item.places}</div>
                      </div>
                    )}
                    {hasWeight && (
                      <div className="bg-white rounded-lg border border-slate-200 py-1.5 px-1">
                        <div className="text-[10px] text-slate-400 hidden sm:block">Вес, кг</div>
                        <div className="text-[10px] text-slate-400 sm:hidden">кг</div>
                        <div className="text-xs font-bold text-slate-800">{item.weight}</div>
                      </div>
                    )}
                    {hasVolume && (
                      <div className="bg-white rounded-lg border border-slate-200 py-1.5 px-1">
                        <div className="text-[10px] text-slate-400 hidden sm:block">Объём, м³</div>
                        <div className="text-[10px] text-slate-400 sm:hidden">м3</div>
                        <div className="text-xs font-bold text-slate-800">{item.volume}</div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        ))}

        {/* Скелетоны: грузы «прорисовываются» перед появлением */}
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div key={`skeleton-${i}`} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-slate-200/80"></div>
            <div className="p-3 space-y-2">
              <div className="h-3.5 bg-slate-200/80 rounded w-24"></div>
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-9 bg-slate-200/70 rounded-lg"></div>
                <div className="h-9 bg-slate-200/70 rounded-lg"></div>
                <div className="h-9 bg-slate-200/70 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderedCount < dailyArrivals.length && (
        <p className="text-center text-xs text-slate-400 animate-pulse">
          Информация обновляется по мере обработки грузов...
        </p>
      )}

      {/* Lightbox */}
      {active !== null && visible[active] && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-2 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Предыдущий груз"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <figure
            className="max-w-4xl w-full flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={visible[active].photo}
              alt={`Груз ${visible[active].ttn}`}
              className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <figcaption className="text-sm text-white/90 font-medium text-center space-y-1">
              <div>
                ТТН <span className="font-black font-mono">{visible[active].ttn}</span> · Фото {active + 1} из {renderedCount}
              </div>
              {(visible[active].places !== null || visible[active].weight !== null || visible[active].volume !== null) && (
                <div className="text-white/60 text-xs">
                  {[
                    visible[active].places !== null ? `Мест: ${visible[active].places}` : null,
                    visible[active].weight !== null ? `Вес: ${visible[active].weight} кг` : null,
                    visible[active].volume !== null ? `Объём: ${visible[active].volume} м³` : null,
                  ].filter(Boolean).join(' · ')}
                </div>
              )}
            </figcaption>
          </figure>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Следующий груз"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Пуш слева внизу о полученном грузе (как на странице 1688) */}
      <AnimatePresence>
        {toastItem && (
          <motion.aside
            initial={{ opacity: 0, y: 40, x: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed bottom-6 left-4 sm:left-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-[380px] bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 ring-1 ring-white/10"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <img
                src={toastItem.photo}
                alt={`Груз ${toastItem.ttn}`}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700/80 shadow-xs"
              />

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="truncate">Груз получен в России · ТТН {toastItem.ttn}</span>
                </div>

                {(toastItem.places !== null || toastItem.weight !== null || toastItem.volume !== null) && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    {[
                      toastItem.places !== null ? `Мест: ${toastItem.places}` : null,
                      toastItem.weight !== null ? `${toastItem.weight} кг` : null,
                      toastItem.volume !== null ? `${toastItem.volume} м³` : null,
                    ].filter(Boolean).map((part, i, arr) => (
                      <React.Fragment key={part}>
                        {i > 0 && <span>•</span>}
                        <span>{part}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => handleGoToCargo(toastItem.ttn)}
                  className="mt-2 text-xs font-extrabold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30"
                >
                  <span>Показать груз</span>
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setToastItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Закрыть уведомление"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
};

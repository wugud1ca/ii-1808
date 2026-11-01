import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Truck, ZoomIn } from 'lucide-react';
import { dailyArrivals } from '../../data/dailyArrivals';
import { toastCenter } from '../../utils/toastCenter';

const INITIAL_COUNT = 8;               // показываем сразу
const FIRST_EXACT_COUNT = 3;           // первые грузы — ровно каждые 10 секунд
const BASE_STEP_MS = 10000;            // базовый интервал появления (в 2 раза медленнее)
const RAND_STEP_MS = 10000;            // + случайная добавка до 10 секунд
const SKELETON_MS = 1300;              // сколько «прорисовывается» скелетон

// Накопительные моменты появления: первые FIRST_EXACT_COUNT грузов — ровно
// каждые BASE_STEP_MS, остальные — BASE_STEP_MS + случайная добавка до RAND_STEP_MS.
function buildAppearSchedule(count: number): number[] {
  const delays: number[] = [];
  const firstN = Math.min(count, FIRST_EXACT_COUNT);
  for (let i = 0; i < firstN; i++) {
    delays.push(BASE_STEP_MS * (i + 1));
  }
  let acc = firstN * BASE_STEP_MS;
  for (let i = firstN; i < count; i++) {
    acc += BASE_STEP_MS + Math.random() * RAND_STEP_MS;
    delays.push(Math.round(acc));
  }
  return delays;
}

export const DailyArrivalsBlock: React.FC = () => {
  const [renderedCount, setRenderedCount] = useState<number>(INITIAL_COUNT);
  const [skeletonCount, setSkeletonCount] = useState<number>(0);
  const [active, setActive] = useState<number | null>(null);
  const [highlightTtn, setHighlightTtn] = useState<string | null>(null);
  const [suppressToasts, setSuppressToasts] = useState<boolean>(() => {
    try { return localStorage.getItem('et-no-arrival-toasts') === '1'; } catch { return false; }
  });

  // Регистрируем обработчик «Показать груз» из ТТН-пуша: подсветка + скролл
  useEffect(() => {
    toastCenter.setHighlightHandler((t) => {
      setHighlightTtn(t);
      const el = document.getElementById(`arrival-${t}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    return () => toastCenter.setHighlightHandler(null);
  }, []);

  const blockRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<number[]>([]);
  const showAllRef = useRef(false);
  const suppressRef = useRef(suppressToasts);
  suppressRef.current = suppressToasts;
  if (scheduleRef.current.length === 0) {
    scheduleRef.current = buildAppearSchedule(dailyArrivals.length - INITIAL_COUNT);
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
          if (showAllRef.current) return;
          // Шаг 1: показываем скелетон
          setSkeletonCount((c) => c + 1);
          timers.push(
            window.setTimeout(() => {
              if (showAllRef.current) { setSkeletonCount((c) => Math.max(0, c - 1)); return; }
              // Шаг 2: скелетон «прорисовывается» в реальную карточку
              setSkeletonCount((c) => c - 1);
              setRenderedCount((r) => r + 1);
              const item = dailyArrivals[INITIAL_COUNT + idx];
              if (item && !isBlockVisible() && !suppressRef.current && !showAllRef.current) {
                toastCenter.setTtn(item);
              }
            }, SKELETON_MS)
          );
        }, at)
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // «Вывести примеры ТТН» — показать все сразу, без пушей
  const handleShowAll = () => {
    showAllRef.current = true;
    toastCenter.setTtn(null);
    setSkeletonCount(0);
    setRenderedCount(dailyArrivals.length);
  };

  // Галочка «Не показывать сообщения о примерах ТТН»
  const handleSuppressChange = (v: boolean) => {
    setSuppressToasts(v);
    if (v) toastCenter.setTtn(null);
    try { localStorage.setItem('et-no-arrival-toasts', v ? '1' : '0'); } catch { /* noop */ }
  };

  // Подсветка при переходе к грузу из пуша
  useEffect(() => {
    if (!highlightTtn) return;
    const t = window.setTimeout(() => setHighlightTtn(null), 3000);
    return () => window.clearTimeout(t);
  }, [highlightTtn]);

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
          <label className="inline-flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={suppressToasts}
              onChange={(e) => handleSuppressChange(e.target.checked)}
              className="w-4 h-4 accent-orange-600 cursor-pointer"
            />
            <span>Не показывать сообщения о примерах ТТН</span>
          </label>
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
        <div className="text-center space-y-1.5">
          <p className="text-xs text-slate-400 animate-pulse">
            Информация обновляется по мере обработки грузов...
          </p>
          <button
            onClick={handleShowAll}
            className="text-xs font-bold text-orange-600 hover:text-orange-500 hover:underline cursor-pointer"
          >
            Вывести примеры грузов
          </button>
        </div>
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
    </div>
  );
};

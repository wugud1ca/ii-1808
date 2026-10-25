import React, { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Package } from 'lucide-react';

const IMAGES: string[] = Array.from(
  { length: 31 },
  (_, i) => `/cargo-gallery/cg${String(i + 1).padStart(2, '0')}.webp`
);

export const CargoGallery: React.FC = () => {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + IMAGES.length) % IMAGES.length)),
    []
  );
  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % IMAGES.length)),
    []
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

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </span>
          Грузы, прошедшие через наш склад
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Реальные партии клиентов: приемка, проверка, упаковка и отправка из Гуанчжоу в Россию. Нажмите на фото, чтобы увеличить.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
        {IMAGES.map((src, idx) => (
          <button
            key={src}
            onClick={() => setActive(idx)}
            className="relative group overflow-hidden rounded-xl border border-slate-200 aspect-[4/3] cursor-zoom-in focus:outline-hidden focus:ring-2 focus:ring-orange-500 transition-shadow hover:shadow-lg hover:shadow-orange-600/10"
            aria-label={`Фото груза ${idx + 1}`}
          >
            <img
              src={src}
              alt={`Груз, прошедший через склад Express Today — фото ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null && (
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
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <figure className="max-w-5xl w-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={IMAGES[active]}
              alt={`Груз, прошедший через склад Express Today — фото ${active + 1}`}
              className="max-h-[78vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
            />
            <figcaption className="text-sm text-white/80 font-medium">
              Фото {active + 1} из {IMAGES.length}
            </figcaption>
          </figure>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-2 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Следующее фото"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

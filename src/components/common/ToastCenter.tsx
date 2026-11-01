import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, ArrowRight, ArrowDownRight } from 'lucide-react';
import { toastCenter } from '../../utils/toastCenter';
import type { DailyArrival } from '../../data/dailyArrivals';

interface ToastCenterProps {
  onOpenLeadModal: (requestType?: string) => void;
}

const PROMO_APPEAR_MS = 6000;   // промо появляется через 6 секунд
const TTN_AUTOHIDE_MS = 8000;   // автоскрытие ТТН-пуша
const SWIPE_DISMISS_PX = 90;    // порог смахивания
const PROMO_REQUEST = 'Заявка: Отсрочка платежа поставок из Китая (до получения груза, до +20% к заработку)';

// Единый «центр сообщений»: фиксированная колонка слева внизу.
// Сверху — промо «Отсрочка платежа» (постоянный, пока не закрыт),
// под ним — ТТН-пуши, которые сменяют друг друга. Оба можно смахнуть.
export const ToastCenter: React.FC<ToastCenterProps> = ({ onOpenLeadModal }) => {
  const [ttn, setTtn] = useState<DailyArrival | null>(toastCenter.ttn);
  const [promoClosed, setPromoClosed] = useState(false);
  const [promoDelayDone, setPromoDelayDone] = useState(false);
  const [promoExpanded, setPromoExpanded] = useState(false);

  // Подписка на новые ТТН-пуши
  useEffect(() => toastCenter.subscribe(() => setTtn(toastCenter.ttn)), []);

  // Промо появляется через 6 секунд
  useEffect(() => {
    const t = window.setTimeout(() => setPromoDelayDone(true), PROMO_APPEAR_MS);
    return () => window.clearTimeout(t);
  }, []);

  // Автоскрытие ТТН-пуша
  useEffect(() => {
    if (!ttn) return;
    const t = window.setTimeout(() => toastCenter.setTtn(null), TTN_AUTOHIDE_MS);
    return () => window.clearTimeout(t);
  }, [ttn]);

  const openPromoForm = () => onOpenLeadModal(PROMO_REQUEST);
  const closePromo = () => setPromoClosed(true);
  const dismissTtn = () => toastCenter.setTtn(null);

  const goToCargo = (ttnValue: string) => {
    toastCenter.setTtn(null);
    toastCenter.highlight(ttnValue);
  };

  return (
    <div
      className="fixed bottom-6 sm:bottom-2 left-4 sm:left-6 z-[70] flex flex-col items-start gap-2.5 sm:gap-1.5 pointer-events-none"
      style={{ marginBottom: 0 }}
    >
      {/* ===== Промо «Отсрочка платежа» ===== */}
      <AnimatePresence>
        {promoDelayDone && !promoClosed && (
          <motion.aside
            initial={{ opacity: 0, y: 40, x: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            whileDrag={{ scale: 1.02 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > SWIPE_DISMISS_PX || info.offset.x < -SWIPE_DISMISS_PX) closePromo();
            }}
            className="pointer-events-auto cursor-grab active:cursor-grabbing select-none w-[calc(100vw-2rem)] max-w-sm sm:w-[400px] rounded-2xl p-4 shadow-2xl ring-2 ring-white/30 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white"
            role="dialog"
            aria-label="Отсрочка платежа поставок из Китая"
          >
            {/* Десктоп: полная версия */}
            <div className="hidden sm:block space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[11px] font-bold uppercase tracking-widest text-orange-100">
                  Не замораживайте деньги
                </div>
                <button
                  onClick={closePromo}
                  className="text-orange-100 hover:text-white p-1 -m-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer shrink-0"
                  aria-label="Закрыть"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xl font-black leading-tight">
                <span className="underline decoration-white/90 decoration-2 underline-offset-4">Отсрочка платежа</span>{' '}
                поставок из Китая
              </div>
              <div className="text-sm text-orange-50 leading-snug">
                Зарабатывайте до 20% больше за счёт отсрочки до получения груза
              </div>
              <button
                onClick={openPromoForm}
                className="mt-0.5 w-full bg-white text-orange-700 hover:bg-orange-50 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-2 shadow-md"
              >
                Узнать об отсрочке
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Мобильная: компактная версия; тап по ней раскрывает полную форму */}
            {!promoExpanded ? (
              <motion.div
                className="sm:hidden flex items-center justify-between gap-2.5 cursor-pointer"
                onTap={(e) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  setPromoExpanded(true);
                }}
              >
                <div className="text-base font-black leading-tight min-w-0">
                  <span className="underline decoration-white/90 decoration-2 underline-offset-4">Отсрочка платежа</span>{' '}
                  <span className="font-bold text-orange-100">поставок из Китая</span>
                </div>
                <button
                  onClick={closePromo}
                  className="w-9 h-9 rounded-lg hover:bg-white/15 flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <div className="sm:hidden space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-orange-100">
                    Не замораживайте деньги
                  </div>
                  <button
                    onClick={closePromo}
                    className="text-orange-100 hover:text-white p-1 -m-1 rounded-lg hover:bg-white/15 transition-colors cursor-pointer shrink-0"
                    aria-label="Закрыть"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xl font-black leading-tight">
                  <span className="underline decoration-white/90 decoration-2 underline-offset-4">Отсрочка платежа</span>{' '}
                  поставок из Китая
                </div>
                <div className="text-sm text-orange-50 leading-snug">
                  Зарабатывайте до 20% больше за счёт отсрочки до получения груза
                </div>
                <button
                  onClick={openPromoForm}
                  className="mt-0.5 w-full bg-white text-orange-700 hover:bg-orange-50 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm flex items-center justify-center gap-2 shadow-md"
                >
                  Узнать об отсрочке
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ===== ТТН-пуш (слот сменяющихся уведомлений) ===== */}
      <AnimatePresence>
        {ttn && (
          <motion.aside
            key={ttn.ttn}
            initial={{ opacity: 0, y: 40, x: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            whileDrag={{ scale: 1.02 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > SWIPE_DISMISS_PX || info.offset.x < -SWIPE_DISMISS_PX) dismissTtn();
            }}
            className="pointer-events-auto cursor-grab active:cursor-grabbing select-none w-[calc(100vw-2rem)] max-w-sm sm:w-[400px] bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 ring-1 ring-white/10"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <img
                src={ttn.photo}
                alt={`Груз ${ttn.ttn}`}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700/80 shadow-xs"
              />

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="truncate">Груз получен в России · ТТН {ttn.ttn}</span>
                </div>

                {(ttn.places !== null || ttn.weight !== null || ttn.volume !== null) && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    {[
                      ttn.places !== null ? `Мест: ${ttn.places}` : null,
                      ttn.weight !== null ? `${ttn.weight} кг` : null,
                      ttn.volume !== null ? `${ttn.volume} м³` : null,
                    ].filter(Boolean).map((part, i, arr) => (
                      <React.Fragment key={part}>
                        {i > 0 && <span>•</span>}
                        <span>{part}</span>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => goToCargo(ttn.ttn)}
                  className="mt-2 text-xs font-extrabold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30"
                >
                  <span>Показать груз</span>
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={dismissTtn}
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

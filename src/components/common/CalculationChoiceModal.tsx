import React, { useEffect } from 'react';
import { X, FileSpreadsheet, PlaneTakeoff, Sparkles, ArrowRight, ShieldCheck, Zap, PhoneCall, CheckCircle2 } from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface CalculationChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: () => void;
  onSearchOnlineTariffs: () => void;
  contextTitle?: string;
}

export const CalculationChoiceModal: React.FC<CalculationChoiceModalProps> = ({
  isOpen,
  onClose,
  onRequestQuote,
  onSearchOnlineTariffs,
  contextTitle = 'Расчет доставки груза',
}) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectQuote = () => {
    trackEvent('calculation_choice_selected', { choice: 'manual_quote', context: contextTitle });
    onClose();
    onRequestQuote();
  };

  const handleSelectOnline = () => {
    trackEvent('calculation_choice_selected', { choice: 'online_tariffs', context: contextTitle });
    onClose();
    onSearchOnlineTariffs();
  };

  return (
    <div 
      className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[95vh] overflow-y-auto cursor-default space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Закрыть окно"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Калькуляция поставки</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            Как вам удобнее рассчитать поставку?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Выберите персональный расчет от специалиста ВЭД или мгновенный поиск онлайн-тарифов
          </p>
        </div>

        {/* The 2 Core Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Option A: Запросить расчет поставки */}
          <div 
            onClick={handleSelectQuote}
            className="group relative p-5 rounded-2xl border-2 border-slate-200 hover:border-orange-500 bg-white hover:bg-orange-50/40 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-0.5 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Менеджер ВЭД
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-orange-700 transition-colors">
                  Запросить расчет поставки
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Персональный детальный расчет по вашей спецификации, инвойсу или ссылке на товар.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Подбор кодов ТН ВЭД и пошлин</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Учет НДС 20% или карго</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ответ в течение 10–15 минут</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-slate-900 group-hover:bg-orange-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Заполнить форму</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Option B: Найти онлайн тариф для моей поставки (Aviasales-style) */}
          <div 
            onClick={handleSelectOnline}
            className="group relative p-5 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 bg-gradient-to-b from-indigo-50/50 via-white to-sky-50/30 hover:from-indigo-50 hover:to-indigo-50/50 transition-all duration-200 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-lg hover:-translate-y-0.5 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center font-bold">
                  <PlaneTakeoff className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-600" />
                  Как в Aviasales
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                  Найти онлайн тариф
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Мгновенный поисковик тарифов: сравнение ставок Авто, Авиа, ЖД, Море, цены за кг, м³ и контейнер.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Выдача актуального маршрута</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Пересчет за кг, м³ и контейнерные слоты</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Учет хрупкости и обрешетки</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 group-hover:from-indigo-500 group-hover:to-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <span>Искать тарифы онлайн ⚡</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Прямые контракты с фабриками и таможенными терминалами</span>
          </div>
          <span className="text-slate-400 hidden sm:inline text-[11px]">Express Today 2026</span>
        </div>

      </div>
    </div>
  );
};

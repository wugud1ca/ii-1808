import React, { useState, useEffect } from 'react';
import { Calculator, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { trackEvent } from '../../utils/analytics';

interface CalculatorWidgetProps {
  onOpenLeadModal: (requestType?: string) => void;
  fullPage?: boolean;
}

export const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({ onOpenLeadModal, fullPage = false }) => {
  const [costRmb, setCostRmb] = useState<number>(12000);
  const [exchangeRate, setExchangeRate] = useState<number>(13.2); // RMB to RUB rate
  const [weightKg, setWeightKg] = useState<number>(150);
  const [volumeM3, setVolumeM3] = useState<number>(0.8);
  const [category, setCategory] = useState<string>('clothing');
  const [transport, setTransport] = useState<string>('truck_fast');
  const [needsDocs, setNeedsDocs] = useState<boolean>(false);
  const [destinationCity, setDestinationCity] = useState<string>('Москва');

  const costRub = Math.round(costRmb * exchangeRate);

  // Dynamic estimate calculation formula
  const density = weightKg / (volumeM3 || 0.1); // kg/m3

  let ratePerKg = 3.2; // base $ per kg
  let speedDays = '13–20 дней';

  if (transport === 'air') {
    ratePerKg = 7.5;
    speedDays = '9–15 дней';
  } else if (transport === 'truck_fast') {
    ratePerKg = 3.5;
    speedDays = '13–20 дней';
  } else if (transport === 'truck_regular') {
    ratePerKg = 2.8;
    speedDays = '20–25 дней';
  } else if (transport === 'railway') {
    ratePerKg = 2.2;
    speedDays = '30–60 дней';
  } else if (transport === 'sea') {
    ratePerKg = 1.6;
    speedDays = '30–70 дней';
  }

  // Adjust for density and category
  if (density < 100) {
    ratePerKg += 1.2; // light volume cargo
  }
  if (category === 'electronics') {
    ratePerKg += 0.8;
  }

  const estimatedUSD = Math.round(weightKg * ratePerKg);
  const usdToRub = 92.5;
  const estimatedShippingRub = Math.round(estimatedUSD * usdToRub);

  const isLowValueOrder = costRmb < 5000;

  const handleCalculateClick = () => {
    trackEvent('calculator_submit', {
      costRmb,
      weightKg,
      volumeM3,
      category,
      transport,
      needsDocs,
    });

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('express_today_lead_draft') || localStorage.getItem('express_today_lead_draft_backup');
        const existing = raw ? JSON.parse(raw) : {};
        const updated = {
          ...existing,
          weightKg: String(weightKg),
          volumeM3: String(volumeM3),
          costEstimate: `${costRmb} ¥ (${costRub} ₽)`,
          destinationCity: destinationCity,
          needsDocuments: needsDocs,
          comment: existing.comment || `Расчет калькулятора: Категория - ${category}, Транспорт - ${transport}`,
        };
        localStorage.setItem('express_today_lead_draft', JSON.stringify(updated));
        localStorage.setItem('express_today_lead_draft_backup', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not update lead draft from calculator', e);
      }
    }
    
    const summaryText = `Расчет калькулятора: ${costRmb} ¥ (${costRub} ₽), ${weightKg}кг, ${volumeM3}м³, тип: ${category}, транспорт: ${transport}, город: ${destinationCity}`;
    onOpenLeadModal(summaryText);
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden ${fullPage ? 'p-6 sm:p-10' : 'p-6'}`}>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-xs">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Предварительный калькулятор доставки</h3>
          <p className="text-sm text-slate-600">Укажите параметры партии для мгновенной оценки стоимости</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Goods value in RMB and RUB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Стоимость товара в юанях (¥)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="500"
                  value={costRmb}
                  onChange={e => setCostRmb(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">¥</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">
                Ориентир в рублях (по курсу {exchangeRate} ₽)
              </label>
              <div className="bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900">
                ~ {costRub.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          {/* Low Value Disclaimer */}
          {isLowValueOrder && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-sm text-amber-950 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Стоимость заказа менее 5 000 ¥:</span> менеджер предварительно проверит целесообразность и возможность официальной или сборной перевозки до финального расчета.
              </div>
            </div>
          )}

          {/* Weight & Volume */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Вес груза (кг)</label>
              <input
                type="number"
                min="1"
                value={weightKg}
                onChange={e => setWeightKg(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Объем груза (м³)</label>
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={volumeM3}
                onChange={e => setVolumeM3(Math.max(0.01, Number(e.target.value)))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Category & Transport Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Категория товара</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                <option value="small_household">Малые хоз. товары</option>
                <option value="large_household">Большие хоз. товары</option>
                <option value="clothing">Одежда и текстиль</option>
                <option value="electronics">Электроника и техника</option>
                <option value="equipment">Оборудование и станки</option>
                <option value="auto_parts">Автозапчасти</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Способ транспортировки</label>
              <select
                value={transport}
                onChange={e => setTransport(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              >
                <option value="air">Авиадоставка (9–15 дней)</option>
                <option value="truck_fast">Авто ускоренное (13–20 дней)</option>
                <option value="truck_regular">Авто обычное (20–25 дней)</option>
                <option value="railway">Ж/Д перевозка (30–60 дней)</option>
                <option value="sea">Морской контейнер (30–70 дней)</option>
              </select>
            </div>
          </div>

          {/* City & Docs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1">Город получения в РФ</label>
              <input
                type="text"
                value={destinationCity}
                onChange={e => setDestinationCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-5">
              <input
                type="checkbox"
                id="calcDocs"
                checked={needsDocs}
                onChange={e => setNeedsDocs(e.target.checked)}
                className="w-5 h-5 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
              />
              <label htmlFor="calcDocs" className="text-sm text-slate-800 cursor-pointer font-medium">
                Нужна официальная «белая» доставка с ГТД
              </label>
            </div>
          </div>

        </div>

        {/* Results Box & Hand-off */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-md border border-slate-700">
          
          <div className="space-y-4">
            <div className="text-sm font-bold uppercase tracking-wider text-orange-400 border-b border-slate-700 pb-2">
              Ориентировочная оценка логистики
            </div>

            <div className="space-y-1">
              <div className="text-sm text-slate-300">Примерная стоимость перевозки:</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                ~ ${estimatedUSD.toLocaleString()} <span className="text-base text-slate-300 font-normal">({estimatedShippingRub.toLocaleString('ru-RU')} ₽)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
              <div>
                <span className="text-slate-300 block text-xs">Плотность груза:</span>
                <span className="font-semibold text-white">{Math.round(density)} кг/м³</span>
              </div>
              <div>
                <span className="text-slate-300 block text-xs">Срок доставки:</span>
                <span className="font-semibold text-emerald-400">{speedDays}</span>
              </div>
            </div>

            {/* Mandatory Disclaimer */}
            <div className="bg-slate-800/70 border border-slate-700 p-3.5 rounded-xl text-sm text-slate-200 leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Внимание:</strong> Расчёт предварительный. Итоговые условия зависят от товара, категории, упаковки, маршрута, документов, веса и объёма.
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculateClick}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-orange-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-sm"
          >
            <span>Получить точный КП у менеджера</span>
            <ArrowRight className="w-5 h-5" />
          </button>

        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Phone, Plane, Truck, MapPin, CheckCircle2, Calculator, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { LeadForm } from '../common/LeadForm';

interface TurkeyPageProps {
  onOpenLeadModal: (requestType?: string) => void;
}

export const TurkeyPage: React.FC<TurkeyPageProps> = ({ onOpenLeadModal }) => {
  const [weightKg, setWeightKg] = useState(120);
  const [costUsd, setCostUsd] = useState(3500);

  const approxAirDays = '2–5 дней';
  const approxTruckDays = '12–18 дней';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Hero Header World */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 text-slate-900 rounded-3xl p-6 sm:p-12 border border-orange-200 shadow-xl space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-orange-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-700 text-sm font-bold uppercase tracking-wider">
            <Globe className="w-4 h-4 text-orange-600" />
            <span>🌍 Направление: Доставка и выкуп по всему миру</span>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-orange-200 text-sm font-bold text-orange-700 shadow-xs">
            <Phone className="w-4 h-4 text-orange-600" />
            <span>Единый отдел международной логистики:</span>
            <a href={siteConfig.phone.mainHref} className="text-slate-900 hover:text-orange-600 font-extrabold">
              {siteConfig.phone.mainDisplay}
            </a>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Доставка и выкуп товаров по всему миру
        </h1>

        <p className="text-base text-slate-700 max-w-3xl leading-relaxed">
          Организуем выкуп одежды, оборудования, комплектующих, косметики и потребительских товаров со складов Европы, Азии, ОАЭ и стран СНГ. Инспекция качества, упаковка, консолидация и ускоренная логистика в РФ.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-bold">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Международная Авиадоставка:</div>
              <div className="font-extrabold text-slate-900 text-lg">{approxAirDays}</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500">Ускоренное авто / мультимодал:</div>
              <div className="font-extrabold text-slate-900 text-lg">{approxTruckDays}</div>
            </div>
          </div>
        </div>

      </div>

      {/* World Calculator & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* World Info */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Возможности международного отдела Express Today:</h2>
            
            <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Выкуп брендовых товаров и оборудования:</strong> прямые договоры с поставщиками и фабриками по всему миру.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Проверка качества на складе отправки:</strong> замеры, фото- и видеофиксация комплектации перед отгрузкой.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Консолидация партий:</strong> сбор товаров от нескольких зарубежных продавцов на единый склад.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-800 shadow-lg">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-6 h-6 text-orange-400" />
              <span>Экспресс-расчёт доставки по миру ($)</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Вес груза (кг):</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={e => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Стоимость инвойса ($):</label>
                <input
                  type="number"
                  value={costUsd}
                  onChange={e => setCostUsd(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold"
                />
              </div>
            </div>

            <button
              onClick={() => onOpenLeadModal(`Расчет по миру: ${weightKg}кг, $${costUsd}`)}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 text-sm"
            >
              <span>Получить персональный расчёт</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Form Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900">Заявка на международную логистику</h3>
            <LeadForm initialRequestType="Доставка и выкуп по всему миру" compact />
          </div>
        </div>

      </div>

    </div>
  );
};

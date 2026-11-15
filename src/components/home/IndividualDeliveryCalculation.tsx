import React from 'react';
import {
  ArrowRight,
  Box,
  Calculator,
  CheckCircle2,
  FileCheck2,
  MapPin,
  Package,
  Percent,
  Route,
  Scale,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';

interface IndividualDeliveryCalculationProps {
  onOpenLeadModal: (requestType?: string) => void;
}

const costItems = [
  {
    icon: Package,
    title: 'Товар и валютный платёж',
    text: 'Инвойс поставщика, курс валюты и комиссия за международный перевод.',
  },
  {
    icon: Truck,
    title: 'Логистика и защита груза',
    text: 'Погрузка, выбранный маршрут, страхование, маркировка мест и упаковка.',
  },
  {
    icon: ShieldCheck,
    title: 'Таможенное оформление',
    text: 'Пошлина, НДС, таможенный сбор и процедуры выпуска декларации.',
  },
  {
    icon: FileCheck2,
    title: 'Документы и подготовка к продаже',
    text: 'Сертификация, Честный ЗНАК, экологический сбор и сопровождение сделки.',
  },
];

export const IndividualDeliveryCalculation: React.FC<IndividualDeliveryCalculationProps> = ({
  onOpenLeadModal,
}) => {
  const openCalculation = () => {
    trackEvent('lead_start', { source: 'individual_delivery_calculation' });
    onOpenLeadModal('Индивидуальный расчёт доставки до себестоимости единицы товара');
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-2xl shadow-slate-900/15">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(249,115,22,0.24),transparent_34%),radial-gradient(circle_at_5%_90%,rgba(59,130,246,0.14),transparent_30%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 p-6 sm:p-9 lg:p-12 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-200">
              <Calculator className="h-4 w-4" />
              Не только ставка за килограмм
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Получите индивидуальный расчёт доставки
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-slate-300 max-w-2xl">
              Посчитаем поставку целиком — от инвойса поставщика и валютного платежа до таможни,
              документов и себестоимости одной единицы товара в России.
            </p>
          </div>

          <button
            type="button"
            onClick={openCalculation}
            className="group inline-flex w-full lg:w-auto min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-900/30 transition-all hover:from-orange-500 hover:to-amber-400 active:scale-[0.98] cursor-pointer"
          >
            <span>Рассчитать мою поставку</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 sm:p-7 backdrop-blur-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-300">
                  Пример структуры КП · 22.06.2026
                </div>
                <div className="flex items-center gap-3 text-lg sm:text-xl font-black">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-orange-400" />
                    Иу
                  </span>
                  <span className="flex min-w-16 flex-1 items-center gap-2 text-orange-300">
                    <span className="h-px flex-1 border-t border-dashed border-orange-300/60" />
                    <Route className="h-5 w-5" />
                    <span className="h-px flex-1 border-t border-dashed border-orange-300/60" />
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-blue-300" />
                    Москва
                  </span>
                </div>
                <p className="text-xs text-slate-400">Спортивный инвентарь · авто · 25–30 дней + таможенное оформление</p>
              </div>
              <span className="shrink-0 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                Расчёт под ключ
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Box, value: '2 000', label: 'единиц товара' },
                { icon: Scale, value: '334,8 кг', label: 'вес партии' },
                { icon: Package, value: '1,66 м³', label: 'объём партии' },
                { icon: Truck, value: 'Авто', label: 'маршрут доставки' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-slate-900/60 p-3.5">
                  <item.icon className="h-4 w-4 text-orange-300" />
                  <div className="mt-2 text-base font-black tabular-nums">{item.value}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {costItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="rounded-lg bg-orange-400/10 p-2 text-orange-300 shrink-0">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-orange-400/25 bg-gradient-to-b from-orange-400/15 to-white/[0.04] p-5 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-200">Результат расчёта</div>
              <div className="mt-4 text-3xl sm:text-4xl font-black tabular-nums">556 131,53 ₽</div>
              <div className="mt-1 text-sm text-slate-300">примерная стоимость поставки</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Calculator className="h-4 w-4 text-orange-300" />
                  Себестоимость единицы
                </div>
                <strong className="whitespace-nowrap text-base tabular-nums">278,07 ₽</strong>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Percent className="h-4 w-4 text-orange-300" />
                  Накладные расходы
                </div>
                <strong className="whitespace-nowrap text-base tabular-nums">+83,6%</strong>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                'Видно, из чего складывается итоговая сумма',
                'Можно сравнить маршруты и сроки',
                'Понятна себестоимость товара в России',
              ].map((text) => (
                <div key={text} className="flex items-start gap-2 text-xs leading-relaxed text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-6">
          <p className="max-w-3xl text-[11px] sm:text-xs leading-relaxed text-slate-400">
            Пример показывает формат расчёта, а не действующий публичный тариф. Курсы валют, пошлины,
            стоимость логистики и дополнительные расходы фиксируются для вашей партии на дату расчёта.
          </p>
          <div className="shrink-0 text-xs font-semibold text-slate-300">
            Для старта достаточно ссылки на товар или инвойса
          </div>
        </div>
      </div>
    </section>
  );
};

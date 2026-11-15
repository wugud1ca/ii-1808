import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Box,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
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

type Currency = 'RUB' | 'USD' | 'CNY';

interface CostLine {
  label: string;
  amount?: number;
  currency?: Currency;
  note?: string;
}

interface CostGroup {
  title: string;
  total: number;
  currency: Currency;
  items: CostLine[];
}

interface CommercialOfferExample {
  id: string;
  tabTitle: string;
  title: string;
  date: string;
  origin: string;
  destination: string;
  deliveryType: string;
  deliveryTerm: string;
  quantity: number;
  weight: number;
  volume: number;
  calculatedVolume?: number;
  customsCode?: string;
  rates: Array<{ label: string; value: number }>;
  groups: CostGroup[];
  conditions: string[];
  total: number;
  unitCost: number;
  overheadPercent?: number;
  includedVat?: number;
}

const commercialOffers: CommercialOfferExample[] = [
  {
    id: 'sports-knee-pads',
    tabTitle: 'Спортинвентарь',
    title: 'Наколенники и спортивный инвентарь',
    date: '22.06.2026',
    origin: 'Иу',
    destination: 'Москва',
    deliveryType: 'Авто',
    deliveryTerm: '25–30 дней + таможенное оформление',
    quantity: 2000,
    weight: 334.8,
    volume: 1.66,
    rates: [
      { label: '¥', value: 11.07615 },
      { label: '$', value: 73.439 },
      { label: '€', value: 84.1684 },
    ],
    groups: [
      {
        title: 'Инвойс и валютный платёж',
        total: 29410.526315789473,
        currency: 'CNY',
        items: [
          { label: 'Инвойс', amount: 27340, currency: 'CNY' },
          { label: 'Банковская и агентская комиссия', amount: 2070.5263157894733, currency: 'CNY' },
        ],
      },
      {
        title: 'Международная логистика',
        total: 1200.0344858998624,
        currency: 'USD',
        items: [
          { label: 'Погрузо-разгрузочные работы', amount: 30, currency: 'USD' },
          { label: 'Логистика', amount: 1128.8, currency: 'USD' },
          { label: 'Гарантия утраты и порчи', amount: 41.23448589986246, currency: 'USD' },
        ],
      },
      {
        title: 'Таможенное оформление',
        total: 120987.56430754944,
        currency: 'RUB',
        items: [
          { label: 'Таможенная пошлина', amount: 1582.7917824001643, currency: 'CNY' },
          { label: 'НДС', amount: 7312.498034688758, currency: 'CNY' },
          { label: 'Таможенный сбор', amount: 2462, currency: 'RUB' },
          { label: 'Процедуры таможенной очистки', amount: 20000, currency: 'RUB' },
        ],
      },
      {
        title: 'Сопровождение и документы',
        total: 21259.23564,
        currency: 'RUB',
        items: [
          { label: 'Сопровождение сделки', amount: 15000, currency: 'RUB' },
          { label: 'Отказное письмо', amount: 6000, currency: 'RUB' },
          { label: 'Экологический сбор', amount: 259.23564, currency: 'RUB' },
          { label: 'Сложность проработки заказа', amount: 0, currency: 'RUB' },
        ],
      },
    ],
    conditions: [
      'Маркировка грузовых мест — по факту',
      'Упаковка — зависит от типа груза',
      'Маркировка «Честный ЗНАК» — не требуется',
    ],
    total: 556131.533610181,
    unitCost: 278.06576680509045,
    overheadPercent: 83.64968263979957,
  },
  {
    id: 'phone-cases',
    tabTitle: 'Чехлы для телефона',
    title: 'Чехлы для телефона',
    date: '12.03.2026',
    origin: 'Иу',
    destination: 'Москва',
    deliveryType: 'Авто',
    deliveryTerm: '25–30 дней + таможенное оформление',
    quantity: 5950,
    weight: 476,
    volume: 1.12,
    calculatedVolume: 1.9,
    customsCode: '4202321000',
    rates: [
      { label: '¥', value: 11.7927275 },
      { label: '$', value: 79.068 },
      { label: '€', value: 91.9378 },
    ],
    groups: [
      {
        title: 'Инвойс и валютный платёж',
        total: 39337.89473684211,
        currency: 'CNY',
        items: [
          { label: 'Инвойс (+3%)', amount: 36771, currency: 'CNY' },
          { label: 'Банковская и агентская комиссия', amount: 2566.894736842107, currency: 'CNY' },
        ],
      },
      {
        title: 'Международная логистика',
        total: 1376.8427154983685,
        currency: 'USD',
        items: [
          { label: 'Погрузо-разгрузочные работы', amount: 30, currency: 'USD' },
          { label: 'Логистика', amount: 1292, currency: 'USD' },
          { label: 'Гарантия утраты и порчи', amount: 54.84271549836849, currency: 'USD' },
        ],
      },
      {
        title: 'Таможенное оформление',
        total: 224226.77543167103,
        currency: 'RUB',
        items: [
          { label: 'Таможенная пошлина', amount: 6290.501877389219, currency: 'CNY' },
          { label: 'НДС', amount: 10609.979833196483, currency: 'CNY' },
          { label: 'Таможенный сбор', amount: 4924, currency: 'RUB' },
          { label: 'Процедуры таможенной очистки', amount: 20000, currency: 'RUB' },
        ],
      },
      {
        title: 'Сопровождение и документы',
        total: 31000,
        currency: 'RUB',
        items: [
          { label: 'Сопровождение сделки', amount: 15000, currency: 'RUB' },
          { label: 'Декларация соответствия (1 день)', amount: 16000, currency: 'RUB' },
          { label: 'Экологический сбор', amount: 0, currency: 'RUB' },
          { label: 'Сложность проработки заказа', amount: 0, currency: 'RUB' },
        ],
      },
    ],
    conditions: [
      'Маркировка грузовых мест — по факту',
      'Упаковка — зависит от типа груза',
      'Маркировка «Честный ЗНАК» — не требуется',
    ],
    total: 827992.0483159592,
    unitCost: 139.15832744806036,
    overheadPercent: 96.67252189687863,
  },
  {
    id: 'adult-goods',
    tabTitle: 'Товары 18+',
    title: 'Товары категории 18+',
    date: '20.07.2026',
    origin: 'Иу',
    destination: 'Москва',
    deliveryType: 'Авто',
    deliveryTerm: '25–30 дней + таможенное оформление',
    quantity: 1800,
    weight: 561.5,
    volume: 1.43,
    rates: [
      { label: '¥', value: 11.849205 },
      { label: '$', value: 78.3987 },
      { label: '€', value: 89.8998 },
    ],
    groups: [
      {
        title: 'Инвойс и валютный платёж',
        total: 28690.947368421053,
        currency: 'CNY',
        items: [
          { label: 'Инвойс (+3%)', amount: 26656.4, currency: 'CNY' },
          { label: 'Банковская и агентская комиссия', amount: 2034.547368421052, currency: 'CNY' },
        ],
      },
      {
        title: 'Международная логистика',
        total: 1384.1985696015367,
        currency: 'USD',
        items: [
          { label: 'Погрузо-разгрузочные работы', amount: 30, currency: 'USD' },
          { label: 'Логистика', amount: 1313.91, currency: 'USD' },
          { label: 'Гарантия утраты и порчи', amount: 40.28856960153676, currency: 'USD' },
        ],
      },
      {
        title: 'Таможенное оформление',
        total: 133462.66303886805,
        currency: 'RUB',
        items: [
          { label: 'Таможенная пошлина', amount: 2034.4311627828665, currency: 'CNY' },
          { label: 'НДС', amount: 7333.341868308085, currency: 'CNY' },
          { label: 'Таможенный сбор', amount: 2462, currency: 'RUB' },
          { label: 'Процедуры таможенной очистки', amount: 20000, currency: 'RUB' },
        ],
      },
      {
        title: 'Сопровождение и документы',
        total: 30434.76945,
        currency: 'RUB',
        items: [
          { label: 'Сопровождение сделки', amount: 15000, currency: 'RUB' },
          { label: 'Отказное письмо', amount: 6000, currency: 'RUB' },
          { label: 'Экологический сбор', amount: 434.76945, currency: 'RUB' },
          { label: 'Сложность проработки заказа', amount: 9000, currency: 'RUB' },
        ],
      },
    ],
    conditions: [
      'Маркировка грузовых мест — по факту',
      'Упаковка — зависит от типа груза',
      'Маркировка «Честный ЗНАК» — не требуется',
    ],
    total: 612381.7179001197,
    unitCost: 340.2120655000665,
  },
  {
    id: 'holsters',
    tabTitle: 'Кобуры',
    title: 'Кобуры',
    date: '23.09.2026',
    origin: 'Иу',
    destination: 'Москва',
    deliveryType: 'Авто',
    deliveryTerm: '25–30 дней + таможенное оформление',
    quantity: 3000,
    weight: 345,
    volume: 1.63,
    rates: [
      { label: '¥', value: 12.8423 },
      { label: '¥ Alipay', value: 13.47 },
      { label: '$', value: 84.0657 },
      { label: '€', value: 96.5915 },
    ],
    groups: [
      {
        title: 'Инвойс и валютный платёж',
        total: 18752.63157894737,
        currency: 'CNY',
        items: [
          { label: 'Инвойс', amount: 17215, currency: 'CNY' },
          { label: 'Банковская и агентская комиссия', amount: 1537.6315789473701, currency: 'CNY' },
        ],
      },
      {
        title: 'Международная логистика',
        total: 1213.5985015886383,
        currency: 'USD',
        items: [
          { label: 'Погрузо-разгрузочные работы', amount: 30, currency: 'USD' },
          { label: 'Логистика', amount: 1157.3, currency: 'USD' },
          { label: 'Гарантия утраты и порчи', amount: 26.298501588638405, currency: 'USD' },
        ],
      },
      {
        title: 'Таможенное оформление',
        total: 131277.51743645428,
        currency: 'RUB',
        items: [
          { label: 'Таможенная пошлина', amount: 3153.800614874078, currency: 'CNY' },
          { label: 'НДС', amount: 5319.410370420945, currency: 'CNY' },
          { label: 'Таможенный сбор', amount: 2462, currency: 'RUB' },
          { label: 'Процедуры таможенной очистки', amount: 20000, currency: 'RUB' },
        ],
      },
      {
        title: 'Сопровождение, налоги и документы',
        total: 57891.29504784,
        currency: 'RUB',
        items: [
          { label: 'Сопровождение сделки', amount: 30000, currency: 'RUB' },
          { label: 'Разрешительные документы', amount: 0, currency: 'RUB' },
          { label: 'Экологический сбор', amount: 267.1335, currency: 'RUB' },
          { label: 'Прочие налоги и сборы', amount: 27624.16154784, currency: 'RUB' },
        ],
      },
    ],
    conditions: [
      'Маркировка грузовых мест — по факту',
      'Упаковка — зависит от типа груза',
      'Маркировка «Честный ЗНАК» — не требуется',
    ],
    total: 532017.7405656101,
    unitCost: 177.33924685520338,
    overheadPercent: 140.64468631793705,
    includedVat: 95937.62534789692,
  },
];

const valueFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const totalFormatter = new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencySymbols: Record<Currency, string> = {
  RUB: '₽',
  USD: '$',
  CNY: '¥',
};

const formatMoney = (value: number, currency: Currency, fixed = false) =>
  `${fixed ? totalFormatter.format(value) : valueFormatter.format(value)} ${currencySymbols[currency]}`;

const formatNumber = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits }).format(value);

const marketingItems = [
  {
    icon: Package,
    title: 'Товар и валютный платёж',
    text: 'Инвойс поставщика, курс валюты и комиссия за международный перевод.',
  },
  {
    icon: Truck,
    title: 'Логистика и защита груза',
    text: 'Погрузка, выбранный маршрут, гарантия сохранности, маркировка мест и упаковка.',
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
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeOffer = commercialOffers[activeOfferIndex];

  const openCalculation = () => {
    trackEvent('lead_start', { source: 'individual_delivery_calculation' });
    onOpenLeadModal('Индивидуальный расчёт доставки до себестоимости единицы товара');
  };

  const selectOffer = (
    index: number,
    source: 'tab' | 'previous' | 'next' | 'keyboard',
    focusTab = false,
  ) => {
    const normalizedIndex = (index + commercialOffers.length) % commercialOffers.length;
    setActiveOfferIndex(normalizedIndex);
    trackEvent('commercial_offer_example_change', {
      source,
      offer: commercialOffers[normalizedIndex].id,
    });

    window.requestAnimationFrame(() => {
      const activeTab = tabRefs.current[normalizedIndex];
      activeTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      if (focusTab) activeTab?.focus();
    });
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === 'ArrowLeft') nextIndex = index - 1;
    if (event.key === 'ArrowRight') nextIndex = index + 1;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = commercialOffers.length - 1;

    if (nextIndex === null) return;
    event.preventDefault();
    selectOffer(nextIndex, 'keyboard', true);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-[0_1px_5px_-4px_rgba(15,23,42,0.7),0_0_0_1px_rgba(15,23,42,0.04),0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

      <div className="relative p-4 sm:p-7 lg:p-10">
        <header className="mb-6 sm:mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-orange-700">
            4 примера коммерческих предложений
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Получите индивидуальный расчёт доставки
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Ниже — примеры коммерческих предложений по поставкам. Выберите товар, чтобы увидеть характеристики партии,
            статьи расходов, итоговую стоимость и себестоимость одной единицы.
          </p>
        </header>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-slate-950">Выберите пример КП</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => selectOffer(activeOfferIndex - 1, 'previous')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700 active:scale-95 cursor-pointer"
              aria-label="Показать предыдущее коммерческое предложение"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-12 text-center text-sm font-bold tabular-nums text-slate-600" aria-live="polite">
              {activeOfferIndex + 1} / {commercialOffers.length}
            </span>
            <button
              type="button"
              onClick={() => selectOffer(activeOfferIndex + 1, 'next')}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700 active:scale-95 cursor-pointer"
              aria-label="Показать следующее коммерческое предложение"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Примеры коммерческих предложений"
          className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4"
        >
          {commercialOffers.map((offer, index) => {
            const isActive = index === activeOfferIndex;
            return (
              <button
                key={offer.id}
                ref={(element: HTMLButtonElement | null) => {
                  tabRefs.current[index] = element;
                }}
                type="button"
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls="commercial-offer-panel"
                id={`commercial-offer-tab-${offer.id}`}
                onClick={() => selectOffer(index, 'tab')}
                onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => handleTabKeyDown(event, index)}
                className={`min-w-[210px] rounded-xl px-4 py-3 text-left transition sm:min-w-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-900/15'
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-orange-300 hover:bg-orange-50/60'
                }`}
              >
                <span className={`block text-[10px] font-bold uppercase tracking-[0.14em] ${isActive ? 'text-orange-300' : 'text-slate-500'}`}>
                  Пример {index + 1}
                </span>
                <span className="mt-1 block text-sm font-bold leading-snug">{offer.tabTitle}</span>
                <span className={`mt-1.5 block text-xs tabular-nums ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                  {formatMoney(offer.total, 'RUB')}
                </span>
              </button>
            );
          })}
        </div>

        <article
          id="commercial-offer-panel"
          role="tabpanel"
          aria-labelledby={`commercial-offer-tab-${activeOffer.id}`}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 shadow-[0_4px_18px_rgba(15,23,42,0.05)]"
        >
          <div className="border-b border-slate-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-700">
                  <span>Коммерческое предложение</span>
                  <span className="text-slate-300">•</span>
                  <span>Расчёт от {activeOffer.date}</span>
                  {activeOffer.customsCode && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>ТН ВЭД {activeOffer.customsCode}</span>
                    </>
                  )}
                </div>
                <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                  {activeOffer.title}
                </h3>
                <div className="mt-4 flex max-w-xl items-center gap-3 text-sm font-bold sm:text-base">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    {activeOffer.origin}
                  </span>
                  <span className="flex min-w-20 flex-1 items-center gap-2 text-orange-600">
                    <span className="h-px flex-1 border-t border-dashed border-orange-300" />
                    <Route className="h-5 w-5" />
                    <span className="h-px flex-1 border-t border-dashed border-orange-300" />
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    {activeOffer.destination}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {activeOffer.deliveryType} · {activeOffer.deliveryTerm}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Курсы в этом КП</div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold tabular-nums text-slate-700">
                  {activeOffer.rates.map((rate) => (
                    <span key={rate.label}>{rate.label} {formatNumber(rate.value, 4)} ₽</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { icon: Box, value: formatNumber(activeOffer.quantity, 0), label: 'единиц товара' },
                { icon: Scale, value: `${formatNumber(activeOffer.weight)} кг`, label: 'вес партии' },
                {
                  icon: Package,
                  value: `${formatNumber(activeOffer.calculatedVolume ?? activeOffer.volume, 2)} м³`,
                  label: activeOffer.calculatedVolume
                    ? `расчётный объём · физический ${formatNumber(activeOffer.volume, 2)} м³`
                    : 'объём партии',
                },
                { icon: Truck, value: activeOffer.deliveryType, label: 'вид доставки' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                  <item.icon className="h-4 w-4 text-orange-600" />
                  <div className="mt-2 text-base font-black tabular-nums text-slate-950">{item.value}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_330px] xl:items-start">
            <div className="grid gap-4 md:grid-cols-2">
              {activeOffer.groups.map((group) => (
                <section key={group.title} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black leading-snug text-slate-950">{group.title}</h4>
                    <strong className="whitespace-nowrap text-sm tabular-nums text-orange-700">
                      {formatMoney(group.total, group.currency)}
                    </strong>
                  </div>
                  <dl className="mt-3 space-y-2.5">
                    {group.items.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-3 text-xs leading-snug">
                        <dt className="text-slate-600">{item.label}</dt>
                        <dd className="whitespace-nowrap font-semibold tabular-nums text-slate-900">
                          {item.amount !== undefined && item.currency
                            ? formatMoney(item.amount, item.currency)
                            : item.note}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              <div className="md:col-span-2 rounded-xl border border-dashed border-slate-300 bg-white/70 p-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                  Условия, рассчитываемые отдельно
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {activeOffer.conditions.map((condition) => (
                    <div key={condition} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="order-first rounded-2xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 sm:p-6 xl:order-last xl:sticky xl:top-24">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-orange-300">Итого по примеру КП</div>
              <div className="mt-3 text-3xl font-black tracking-tight tabular-nums sm:text-4xl">
                {formatMoney(activeOffer.total, 'RUB', true)}
              </div>
              <div className="mt-1 text-sm text-slate-300">примерная стоимость поставки</div>

              <div className="my-5 h-px bg-white/10" />

              <div className="space-y-3">
                <div className="rounded-xl bg-white/[0.07] p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Calculator className="h-4 w-4 text-orange-300" />
                    Себестоимость одной единицы
                  </div>
                  <div className="mt-1.5 text-xl font-black tabular-nums">
                    {formatMoney(activeOffer.unitCost, 'RUB', true)}
                  </div>
                </div>

                {activeOffer.overheadPercent !== undefined && (
                  <div className="rounded-xl bg-white/[0.07] p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Percent className="h-4 w-4 text-orange-300" />
                      Увеличение стоимости из-за накладных расходов
                    </div>
                    <div className="mt-1.5 text-xl font-black tabular-nums">
                      +{formatNumber(activeOffer.overheadPercent)}%
                    </div>
                  </div>
                )}

                {activeOffer.includedVat !== undefined && (
                  <div className="rounded-xl bg-white/[0.07] p-4">
                    <div className="text-xs text-slate-300">В том числе НДС</div>
                    <div className="mt-1.5 text-lg font-black tabular-nums">
                      {formatMoney(activeOffer.includedVat, 'RUB', true)}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => selectOffer(activeOfferIndex + 1, 'next')}
                className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-orange-50 active:scale-[0.98] cursor-pointer"
              >
                Следующее КП
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </aside>
          </div>

          <footer className="border-t border-slate-200 bg-white px-5 py-4 text-[11px] leading-relaxed text-slate-500 sm:px-7 sm:text-xs">
            Примеры приведены по данным приложенных коммерческих предложений и не являются публичным тарифом или офертой.
            Итог зависит от курса валют на дату платежа и регистрации декларации, характеристик груза, упаковки и назначенных таможенных процедур.
          </footer>
        </article>

        <div className="mt-8 border-t border-slate-200 pt-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700">
                <Calculator className="h-4 w-4" />
                Расчёт именно для вашей партии
              </div>
              <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Покажем не только ставку за килограмм
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                Посчитаем поставку целиком — от оплаты поставщику до таможни, документов и себестоимости товара в России.
              </p>
            </div>

            <button
              type="button"
              onClick={openCalculation}
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-900/15 transition-all hover:from-orange-500 hover:to-amber-400 active:scale-[0.98] lg:w-auto cursor-pointer"
            >
              Рассчитать мою поставку
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {marketingItems.map((item) => (
              <div key={item.title} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <div className="shrink-0 rounded-lg bg-orange-100 p-2 text-orange-700">
                  <item.icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950">{item.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

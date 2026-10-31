import React from 'react';
import {
  Truck, Route, Clock3, Scale, ShieldCheck, Boxes, FileCheck2,
  PackageCheck, BatteryCharging, AlertTriangle, ArrowLeft, BadgeCheck,
  MapPin, TrendingUp, Phone,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';

interface AvtoDeliveryPageProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const AVTO_REQUEST = 'Заявка: Автодоставка из Китая';

export const AvtoDeliveryPage: React.FC<AvtoDeliveryPageProps> = ({ onNavigate, onOpenLeadModal }) => {
  const scrollToForm = () => {
    const el = document.getElementById('avto-lead-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 pb-4">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'linear-gradient(100deg, rgba(2,6,23,0.88) 8%, rgba(2,6,23,0.72) 45%, rgba(2,6,23,0.38) 100%), url(/avto/avto-hero.webp)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/40 text-orange-300 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Truck className="w-4 h-4" />
            <span>Автоперевозки из Китая · сборные грузы и отдельные фуры</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl">
            Автодоставка грузов из Китая в Россию
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Сборные грузы (LTL) и отдельные транспортные средства (FTL) со склада в Гуанчжоу через пограничные
            переходы Забайкальск и Хоргос. Накладная CMR, страхование, таможенный выпуск и доставка до вашего
            склада — <strong className="text-white">13–25 дней</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLeadModal(AVTO_REQUEST)}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-900/40 transition-all cursor-pointer text-sm"
            >
              Рассчитать тариф авто
            </button>
            <button
              onClick={scrollToForm}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all cursor-pointer text-sm"
            >
              Отправить заявку
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl pt-2">
            {[
              { icon: Clock3, value: '13–25 дней', label: 'от склада до склада' },
              { icon: Scale, value: '1 м³ ≈ 250 кг', label: 'честный расчёт сборного груза' },
              { icon: Boxes, value: '2 000 м²', label: 'склад консолидации в Гуанчжоу' },
              { icon: BadgeCheck, value: 'CMR', label: 'отслеживание статуса в ЛК' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex items-start gap-3">
                <s.icon className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <div className="text-white font-black text-sm sm:text-base leading-tight">{s.value}</div>
                  <div className="text-slate-300 text-[11px] sm:text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* ================= УТП ================= */}
        <section className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="bg-orange-100 rounded-xl p-2.5 shrink-0">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Почему автодоставка с Express Today</h2>
              <p className="text-sm text-slate-500 mt-1">Собственный пул перевозчиков и склад консолидации — без посреднических накруток</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: 'Прямой пул перевозчиков', text: 'Работаем с проверенными транспортными компаниями по прямым договорам. Ставка — как у прямого заказчика, без цепочки экспедиторов.' },
              { icon: Boxes, title: 'Консолидация LTL на складе', text: 'Объединяем товары от 10+ фабрик в одну сборную отправку, паллетизируем и грузим в одну машину. Одна CMR на всю партию.' },
              { icon: Scale, title: 'Честный расчёт по объёму', text: 'Сборные грузы считаем по большему из фактического веса и объёма (1 м³ ≈ 250 кг) и показываем расчёт прозрачно.' },
              { icon: BadgeCheck, title: 'Отслеживание по CMR в ЛК', text: 'Статусы «загружен», «прошёл границу», «в пути», «прибыл» видны в личном кабинете. Менеджер дублирует ключевые события.' },
              { icon: ShieldCheck, title: 'Страхование груза', text: 'Оформляем страховку на полную стоимость партии на всём маршруте: склад — граница — перегон по РФ — выгрузка.' },
              { icon: FileCheck2, title: 'Упаковка и обрешётка', text: 'Влагозащитная упаковка, жёсткая обрешётка и углы для хрупких грузов. Экспортное и импортное оформление — под ключ.' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2.5 hover:border-orange-300 hover:shadow-md transition-all">
                <div className="bg-orange-50 rounded-xl p-2.5 w-fit">
                  <c.icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= СРОКИ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Сроки автодоставки: от погрузки до двери</h2>
            <p className="text-sm text-slate-500">Ускоренное авто — 13–20 дней, обычное — 20–25 дней от приёмки на складе в Гуанчжоу</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { day: 'День 0–1', title: 'Приёмка и консолидация', text: 'Груз принимается на складе в Гуанчжоу: взвешивание, обмер, сверка с инвойсом. Собираем партию от нескольких фабрик в одну отправку.' },
              { day: 'День 1–3', title: 'Экспортное оформление', text: 'Экспортная декларация в КНР, паллетизация, упаковка. Оформляем накладную CMR и страховку на всю партию.' },
              { day: 'День 3–5', title: 'Перегон до границы', text: 'Машина выходит со склада и идёт до пограничного перехода: МАПП Забайкальск (Маньчжурия) или Хоргос через Казахстан.' },
              { day: 'День 5–14', title: 'Переход границы и транзит', text: 'Прохождение перехода, транзит по территории РФ. Статусы движения обновляются в личном кабинете.' },
              { day: 'День 14–25', title: 'Прибытие и выдача', text: 'Прибытие на склад в Москве, импортное оформление (ДТ), выпуск и доставка до склада получателя по России.' },
            ].map((s, i) => (
              <div key={i} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-orange-600">{s.day}</div>
                <div className="font-bold text-slate-900 text-sm">{s.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src="/avto/avto-terminal.webp" alt="Грузовик у логистического терминала" className="w-full h-48 sm:h-64 object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ТАРИФЫ ================= */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Тарифы автодоставки из Китая</h2>
            <p className="text-sm text-slate-500">Три уровня срочности — от сборного груза до отдельной машины</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Авто-эконом',
                badge: null,
                days: '20–25 дней',
                price: 'от 0,7 $/кг',
                desc: 'Сборный груз (LTL), отправка с ближайшей загрузкой. Для регулярных поставок без жёстких сроков — самый бюджетный вариант.',
                feat: ['Консолидация на складе Гуанчжоу', 'Ближайшая загрузка машины', 'Одна CMR на партию', 'Статусы в ЛК'],
                popular: false,
              },
              {
                name: 'Авто-ускоренное',
                badge: 'Самый популярный',
                days: '13–20 дней',
                price: 'от 0,9 $/кг',
                desc: 'Приоритетная загрузка и отправка без ожидания полной машины. Оптимальный баланс цены и скорости — основной выбор наших клиентов.',
                feat: ['Приоритетная загрузка', 'Экспортное оформление включено', 'Страхование по желанию', 'Персональный менеджер'],
                popular: true,
              },
              {
                name: 'Авто-экспресс',
                badge: null,
                days: '10–14 дней',
                price: 'от 1,2 $/кг',
                desc: 'Отдельное транспортное средство (FTL) под вашу партию. Для крупных отгрузок, срочных заказов и негабарита.',
                feat: ['Отдельная машина (FTL)', 'Без перегрузок в пути', 'Прямой маршрут до Москвы', 'Доставка день-в-день'],
                popular: false,
              },
            ].map((t, i) => (
              <div key={i} className={`relative rounded-3xl border p-6 space-y-4 flex flex-col transition-all ${t.popular ? 'border-orange-400 bg-gradient-to-b from-orange-50/80 to-white shadow-lg shadow-orange-600/10' : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-md'}`}>
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow-md">
                    {t.badge}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Truck className={`w-5 h-5 ${t.popular ? 'text-orange-600' : 'text-slate-400'}`} />
                  <h3 className="font-black text-slate-900 text-lg">{t.name}</h3>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{t.price}</div>
                  <div className="text-sm font-semibold text-orange-600">{t.days}</div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.desc}</p>
                <ul className="space-y-2 text-xs text-slate-700 flex-1">
                  {t.feat.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <PackageCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onOpenLeadModal(`${AVTO_REQUEST} — тариф «${t.name}»`)}
                  className={`w-full font-bold px-5 py-3 rounded-xl transition-all cursor-pointer text-sm ${t.popular ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-600/25' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  Рассчитать партию
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl p-3.5 leading-relaxed">
            * Ставки ориентировочные и зависят от оплачиваемого веса/объёма, маршрута и сезона. В услугу входит экспортное оформление, накладная CMR и обработка груза на складе. Импортное оформление в РФ, доставка по России и страхование рассчитываются отдельно — менеджер подготовит точный расчёт по вашему запросу.
          </p>
        </section>

        {/* ================= МАРШРУТЫ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-xl p-2.5 shrink-0">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Маршруты автодоставки из Китая</h2>
              <p className="text-sm text-slate-500 mt-1">Основные коридоры через Забайкальск и Казахстан — маршрут подбираем под партию</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { from: 'Гуанчжоу', via: 'МАПП Забайкальск (Маньчжурия)', to: 'Москва', days: '13–18 дней', note: 'Основной коридор со склада Express Today' },
              { from: 'Гуанчжоу / Иу', via: 'Хоргос — Казахстан', to: 'Москва', days: '16–22 дней', note: 'Альтернатива при очередях на Забайкальске' },
              { from: 'Пекин / Урумчи', via: 'МАПП Забайкальск', to: 'Москва', days: '12–16 дней', note: 'Короткое плечо до границы с севера Китая' },
              { from: 'Шанхай / Нинбо', via: 'МАПП Пограничный (Суйфэньхэ)', to: 'Владивосток / Москва', days: '15–20 дней', note: 'Для Дальнего Востока и Приморья' },
            ].map((r, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="bg-blue-600 text-white font-black text-xs rounded-lg px-2 py-1.5 shrink-0 w-12 text-center">{r.days}</div>
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{r.from} → {r.to}</div>
                  <div className="text-xs font-semibold text-orange-600">{r.via}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{r.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Из Москвы доставляем до склада получателя: Санкт-Петербург, Казань, Екатеринбург, Новосибирск и другие
              города — магистральными перевозками. Возможна выдача на терминалах транспортных компаний в вашем городе.
            </p>
          </div>
        </section>

        {/* ================= ОБЪЁМНЫЙ ВЕС ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900">Как считаем сборный груз</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              В автоперевозках сборный груз тарифицируется по <strong className="text-slate-900">оплачиваемому весу</strong> —
              большему из фактического веса и расчётного по объёму. Стандарт отрасли: 1 м³ приравнивается к 250 кг.
            </p>
            <div className="bg-slate-900 rounded-2xl p-5 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1.5">Расчётный вес по объёму</div>
              <div className="text-white font-mono text-lg sm:text-xl font-bold">Объём (м³) × 250 кг</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-sm">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Пример</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Место объёмом 2 м³, фактический вес 300 кг.<br />
                Расчётный вес: 2 × 250 = <strong className="text-slate-900">500 кг</strong><br />
                Оплачиваемый вес: max(300; 500) = <strong className="text-orange-600">500 кг</strong>
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Перед отправкой мы замеряем каждое место на складе и присылаем весогабаритный лист — вы всегда знаете, за что платите.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-200 min-h-[240px]">
            <img src="/avto/avto-volvo.webp" alt="Седельный тягач с контейнером" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ЧТО ВЕЗЁМ ================= */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Какие грузы везём авто</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Мебель и предметы интерьера', 'Оборудование и станки', 'Автозапчасти и комплектующие', 'Текстиль и одежда',
              'Товары для дома', 'Крупногабаритные изделия', 'Товары для маркетплейсов', 'Стройматериалы',
            ].map(g => (
              <span key={g} className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-orange-300 transition-colors">{g}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <BatteryCharging className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>Батареи и аккумуляторы</strong> — по автодороге литиевые грузы возятся проще, чем авиа: по правилам
                перевозки опасных грузов (ADR) с паспортом MSDS и протоколом UN 38.3. Оформляем и согласовываем с перевозчиком.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Опасные грузы (ADR)</strong> — жидкости, химия и прочие классы опасности перевозим отдельным запросом
                с декларацией отправителя и допуском водителя по ADR.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Частые вопросы об автодоставке</h2>
          {[
            { q: 'Почему авто дешевле авиа, но дольше?', a: 'Фура вмещает до 86 м³ груза — стоимость километра делится на большой объём. Поэтому автоперевозка выгодна для тяжёлых и объёмных партий, а «плата» за экономию — время в пути и прохождение пограничных переходов.' },
            { q: 'Что такое сборный груз (LTL)?', a: 'Сборный груз — это когда в одной машине едут партии нескольких отправителей. Вы платите только за своё место: по большему из фактического веса и объёма (1 м³ ≈ 250 кг). Мы консолидируем товары на складе в Гуанчжоу и отправляем единой машиной.' },
            { q: 'Можно ли везти батареи и жидкости?', a: 'Да, автотранспортом это проще, чем авиа. Литиевые батареи и часть опасных грузов перевозятся по ADR — нужны паспорт MSDS и протокол UN 38.3. Остальное согласуем с перевозчиком до отправки.' },
            { q: 'Как отслеживать машину в пути?', a: 'После загрузки вы получаете номер накладной CMR. Статусы «загружен», «прошёл границу», «в пути», «прибыл» видны в личном кабинете, а менеджер присылает уведомления о ключевых событиях.' },
          ].map((f, i) => (
            <details key={i} className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 open:bg-white open:border-orange-200 transition-colors">
              <summary className="cursor-pointer list-none font-bold text-slate-900 text-sm flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-orange-600 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </section>

        {/* ================= ФОРМА ================= */}
        <section id="avto-lead-form" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Рассчитайте автодоставку вашего груза</h2>
              <p className="text-sm text-slate-500">
                Оставьте заявку — менеджер подберёт маршрут, посчитает оплачиваемый вес и пришлёт точный тариф в течение рабочего дня.
              </p>
            </div>
            <LeadForm initialRequestType={AVTO_REQUEST} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-4">
              <h3 className="font-bold text-lg">Срочный вопрос?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Напишите в мессенджер — дежурный менеджер на связи и подскажет по срокам и ставкам.
              </p>
              <div className="space-y-2.5">
                <a href="tel:+78005559425" className="flex items-center gap-2.5 text-sm font-bold hover:text-orange-300 transition-colors">
                  <Phone className="w-4 h-4 text-orange-400" /> 8 (800) 555-94-25
                </a>
                <a href="https://wa.me/79282568263" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-orange-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px]">WA</span> WhatsApp
                </a>
                <a href="https://t.me/ExpressTodayHelp_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-orange-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[9px]">TG</span> Telegram
                </a>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-orange-900 text-sm">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                Работаем официально
              </div>
              <p className="text-xs text-orange-900/80 leading-relaxed">
                ООО «Экспресс-тудей» · склад в Гуанчжоу 2000 м² · полный пакет документов по каждой отправке: накладная CMR, инвойс, пакинг-лист, ДТ.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SEO-ТЕКСТ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Автодоставка из Китая: как устроена перевозка, тарифы и нюансы
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Автодоставка — самый сбалансированный способ привезти товар из Китая в Россию: заметно дешевле авиа
            и быстрее моря. Фура берёт до 86 м³ груза, поэтому стоимость килограмма получается низкой, а сроки
            укладываются в 13–25 дней в зависимости от тарифа. Для большинства товаров народного потребления,
            мебели, оборудования и комплектующих это оптимальный маршрут.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Какие грузы выгодно везти автотранспортом</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Авто — правильный выбор для тяжёлых и объёмных партий: мебель, станки и оборудование, стройматериалы,
            автозапчасти, текстиль, товары для дома. Выгодно возить и сборные грузы от нескольких фабрик — консолидация
            на складе в Гуанчжоу позволяет заполнить машину и разделить стоимость доставки между партиями. Отдельно
            отметим: по автодороге без проблем везут литиевые батареи и часть опасных грузов — то, что авиакомпании
            берут с большими ограничениями. А вот сверхсрочные и дорогие лёгкие грузы лучше отправить{' '}
            <a href="/dostavka-avia-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avia-iz-kitaja'); }} className="text-orange-600 font-semibold hover:underline">авиадоставкой</a>:
            там сроки начинаются от шести дней.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">От чего зависит стоимость автоперевозки</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Итоговая цена складывается из нескольких факторов:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">оплачиваемый вес</strong> — для сборных грузов большее из фактического веса и расчётного по объёму (1 м³ ≈ 250 кг);</li>
            <li><strong className="text-slate-900">маршрут и пограничный переход</strong> — Забайкальск или Хоргос, от этого зависят километраж и время;</li>
            <li><strong className="text-slate-900">сезонность</strong> — перед китайским Новым годом и в пиковый сезон ставки растут, а на переходах возможны очереди;</li>
            <li><strong className="text-slate-900">тип отправки</strong> — сборный груз (LTL) или отдельная машина (FTL);</li>
            <li><strong className="text-slate-900">дополнительные услуги</strong> — экспортное и импортное оформление, страхование, доставка до двери.</li>
          </ul>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Точную цену можно назвать только по параметрам конкретной партии — менеджер Express Today рассчитывает её
            в течение одного рабочего дня.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Кому подходит автодоставка из Китая</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">Импортёрам и оптовикам</strong> — для регулярных поставок крупных партий;</li>
            <li><strong className="text-slate-900">Селлерам маркетплейсов</strong> — для планового пополнения стока Wildberries, Ozon и Яндекс.Маркет;</li>
            <li><strong className="text-slate-900">Производителям</strong> — для оборудования, оснастки и комплектующих;</li>
            <li><strong className="text-slate-900">Рознице и интернет-магазинам</strong> — для мебели, товаров для дома и габаритных позиций.</li>
          </ul>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Сколько груза помещается в одну фуру</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Стандартная еврофура вмещает 82–86 м³ или 20–22 тонны. Сборные партии от разных отправителей заполняют машину
            совместно — вы платите только за своё место. Если ваша партия занимает половину фуры и больше, выгоднее
            отдельная машина (FTL): она идёт без промежуточных выгрузок и приходит быстрее. Менеджер подскажет, какой
            вариант дешевле для вашего объёма.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Как проходит перевозка</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Партия принимается на{' '}
            <a href="/konsolidaciya-tovara-v-kitaye" onClick={(e) => { e.preventDefault(); onNavigate('/konsolidaciya-tovara-v-kitaye'); }} className="text-orange-600 font-semibold hover:underline">складе консолидации в Гуанчжоу</a>,
            взвешивается и обмеряется, оформляется накладная CMR. После экспортного оформления машина идёт через
            пограничный переход — Забайкальск или Хоргос — и далее транзитом по России до склада в Москве, где партия
            проходит импортное оформление и выпуск, после чего доставляется получателю. Статусы каждого этапа видны
            в личном кабинете.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Авто, авиа или карго: как выбрать</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Авто — золотая середина по цене и срокам для большинства товаров. <a href="/dostavka-avia-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avia-iz-kitaja'); }} className="text-orange-600 font-semibold hover:underline">Авиа</a> —
            для срочных и ценных партий, <a href="/kargo-dostavka-iz-kitaia" onClick={(e) => { e.preventDefault(); onNavigate('/kargo-dostavka-iz-kitaia'); }} className="text-orange-600 font-semibold hover:underline">карго</a> — для
            максимальной экономии без привязки к срокам. Часто выгодно комбинировать: регулярные поставки везти авто,
            а срочные дозаказы — авиа. Подобрать схему под ваш товар поможет менеджер: оставьте заявку в форме выше,
            расчёт и рекомендация будут готовы в течение рабочего дня.
          </p>
        </section>

        {/* ================= АТРИБУЦИЯ ФОТО ================= */}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Фото: Wikimedia Commons — «40 foot container turnpike double» (CC0, Wikideas1), «Vos Logistics cargo truck warehouse Oss» (CC BY-SA 4.0, Joyce Roosenhart), «A Volvo FM truck carrying a container at Taichung» (CC BY-SA 4.0, Lokseng01).
        </p>

        {/* ================= НАЗАД ================= */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </a>
      </div>
    </div>
  );
};

import React from 'react';
import {
  TrainFront, Container, Clock3, Scale, ShieldCheck, Boxes, FileCheck2,
  PackageCheck, BatteryCharging, AlertTriangle, ArrowLeft, BadgeCheck,
  MapPin, TrendingUp, Phone, RailSymbol,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';

interface PoezdDeliveryPageProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const POEZD_REQUEST = 'Заявка: Доставка поездом из Китая';

export const PoezdDeliveryPage: React.FC<PoezdDeliveryPageProps> = ({ onNavigate, onOpenLeadModal }) => {
  const scrollToForm = () => {
    const el = document.getElementById('poezd-lead-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 pb-4">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'linear-gradient(100deg, rgba(2,6,23,0.88) 8%, rgba(2,6,23,0.72) 45%, rgba(2,6,23,0.38) 100%), url(/poezd/poezd-hero.webp)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
            <TrainFront className="w-4 h-4" />
            <span>Железнодорожные перевозки из Китая · контейнерные поезда</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl">
            Доставка поездом из Китая в Россию
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Контейнерные поезда из Гуанчжоу, Чунцина и Сианя через Забайкальск и Достык до станций Москвы.
            Накладная СМГС, пломбировка, таможенный выпуск и доставка до склада —
            <strong className="text-white"> 16–30 дней</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLeadModal(POEZD_REQUEST)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all cursor-pointer text-sm"
            >
              Рассчитать тариф поездом
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
              { icon: Clock3, value: '16–30 дней', label: 'от склада до склада' },
              { icon: Scale, value: '1 м³ ≈ 300 кг', label: 'расчёт сборного контейнера' },
              { icon: Container, value: '20′ / 40′ HC', label: 'контейнеры на фитинговых платформах' },
              { icon: BadgeCheck, value: 'СМГС', label: 'накладная и отслеживание в ЛК' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex items-start gap-3">
                <s.icon className="w-5 h-5 text-emerald-400 shrink-0" />
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
            <div className="bg-emerald-100 rounded-xl p-2.5 shrink-0">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Почему поезд с Express Today</h2>
              <p className="text-sm text-slate-500 mt-1">Золотая середина: быстрее моря, дешевле авиа, стабильнее авто</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: TrainFront, title: 'Регулярные контейнерные поезда', text: 'Отправки по расписанию несколько раз в неделю: Гуанчжоу, Чунцин, Сиань, Иу. Ваш контейнер не ждёт загрузки судна.' },
              { icon: Container, title: 'Стабильные сроки в пути', text: 'Поезд не стоит в пробках и не зависит от очередей на автомобильных переходах — сроки предсказуемы, отклонения минимальны.' },
              { icon: Scale, title: 'Честный расчёт по объёму', text: 'Сборные контейнеры считаем по большему из фактического веса и объёма (1 м³ ≈ 300 кг) и показываем расчёт прозрачно.' },
              { icon: BadgeCheck, title: 'Накладная СМГС и отслеживание', text: 'Оформляем железнодорожную накладную СМГС, отслеживаем контейнер по номеру: погрузка — граница — станция — выгрузка.' },
              { icon: ShieldCheck, title: 'Пломбы и страхование', text: 'Контейнер пломбируется на складе отправителя, страхование на полную стоимость на всём маршруте до склада получателя.' },
              { icon: FileCheck2, title: 'Оформление под ключ', text: 'Экспортное оформление в КНР, перегруз на границе, импортная очистка и вывоз со станции — одна команда, один договор.' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2.5 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="bg-emerald-50 rounded-xl p-2.5 w-fit">
                  <c.icon className="w-5 h-5 text-emerald-600" />
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Сроки ЖД доставки: от погрузки до двери</h2>
            <p className="text-sm text-slate-500">Экспресс-поезд — 16–20 дней, сборный контейнер — 25–30 дней от приёмки на складе</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { day: 'День 0–2', title: 'Приёмка и консолидация', text: 'Груз принимается на складе в Гуанчжоу: взвешивание, обмер, сверка с инвойсом. Собираем партию от нескольких фабрик в один контейнер.' },
              { day: 'День 2–4', title: 'Затарка и оформление', text: 'Загрузка контейнера, пломбировка, экспортная декларация в КНР и оформление железнодорожной накладной СМГС.' },
              { day: 'День 4–6', title: 'Отправление поезда', text: 'Контейнер грузится на фитинговую платформу и уходит с приграничной станции — Забайкальск или Достык.' },
              { day: 'День 6–14', title: 'Переход границы', text: 'Перегруз контейнера с колеи 1435 мм на 1520 мм на пограничном переходе и движение по сети РЖД.' },
              { day: 'День 14–30', title: 'Прибытие и выдача', text: 'Прибытие на станцию в Московском регионе, импортное оформление (ДТ), выпуск и доставка до склада получателя.' },
            ].map((s, i) => (
              <div key={i} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-emerald-600">{s.day}</div>
                <div className="font-bold text-slate-900 text-sm">{s.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src="/poezd/poezd-terminal.webp" alt="Китайский локомотив с контейнерным составом на терминале Чжэнчжоу" className="w-full h-48 sm:h-64 object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ТАРИФЫ ================= */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Тарифы ЖД доставки из Китая</h2>
            <p className="text-sm text-slate-500">Три уровня срочности — от сборного контейнера до экспресс-поезда</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'ЖД-эконом',
                badge: null,
                days: '25–30 дней',
                price: 'от 0,4 $/кг',
                desc: 'Сборный контейнер, отправка с ближайшим поездом. Для регулярных поставок без жёстких сроков — дешевле авиа и быстрее моря.',
                feat: ['Сборный контейнер LCL', 'Ближайший поезд по расписанию', 'Одна СМГС на партию', 'Статусы в ЛК'],
                popular: false,
              },
              {
                name: 'ЖД-стандарт',
                badge: 'Самый популярный',
                days: '20–25 дней',
                price: 'от 0,6 $/кг',
                desc: 'Приоритетная загрузка в регулярный контейнерный поезд. Оптимальный баланс цены и скорости — основной выбор наших клиентов.',
                feat: ['Приоритетная загрузка', 'Экспортное оформление включено', 'Страхование по желанию', 'Персональный менеджер'],
                popular: true,
              },
              {
                name: 'ЖД-экспресс',
                badge: null,
                days: '16–20 дней',
                price: 'от 0,9 $/кг',
                desc: 'Ускоренный контейнерный поезд с минимальными остановками. Для срочных партий, где авиа неоправданна по весу.',
                feat: ['Ускоренный поезд', 'Минимум остановок в пути', 'Прямой маршрут до Москвы', 'Доставка день-в-день'],
                popular: false,
              },
            ].map((t, i) => (
              <div key={i} className={`relative rounded-3xl border p-6 space-y-4 flex flex-col transition-all ${t.popular ? 'border-emerald-400 bg-gradient-to-b from-emerald-50/80 to-white shadow-lg shadow-emerald-600/10' : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'}`}>
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow-md">
                    {t.badge}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <TrainFront className={`w-5 h-5 ${t.popular ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <h3 className="font-black text-slate-900 text-lg">{t.name}</h3>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{t.price}</div>
                  <div className="text-sm font-semibold text-emerald-600">{t.days}</div>
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
                  onClick={() => onOpenLeadModal(`${POEZD_REQUEST} — тариф «${t.name}»`)}
                  className={`w-full font-bold px-5 py-3 rounded-xl transition-all cursor-pointer text-sm ${t.popular ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/25' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  Рассчитать партию
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl p-3.5 leading-relaxed">
            * Ставки ориентировочные и зависят от оплачиваемого веса/объёма, станции отправления и сезона. В услугу входит экспортное оформление, накладная СМГС и обработка груза на складе. Импортное оформление в РФ, доставка по России и страхование рассчитываются отдельно — менеджер подготовит точный расчёт по вашему запросу.
          </p>
        </section>

        {/* ================= МАРШРУТЫ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 rounded-xl p-2.5 shrink-0">
              <RailSymbol className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Маршруты ЖД доставки из Китая</h2>
              <p className="text-sm text-slate-500 mt-1">Основные коридоры контейнерных поездов — станцию отправления подбираем под партию</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { from: 'Гуанчжоу / Шэньчжэнь', via: 'Маньчжурия — Забайкальск', to: 'Москва', days: '18–24 дня', note: 'Основной коридор со склада Express Today' },
              { from: 'Чунцин / Чэнду', via: 'Алашанькоу (Казахстан)', to: 'Москва', days: '16–20 дней', note: 'Короткий маршрут, частые отправки' },
              { from: 'Сиань', via: 'Достык (Казахстан)', to: 'Москва', days: '16–22 дня', note: 'Стабильное расписание ускоренных поездов' },
              { from: 'Иу / Шанхай', via: 'Маньчжурия — Забайкальск', to: 'Москва', days: '18–24 дня', note: 'Для грузов с востока Китая' },
            ].map((r, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="bg-emerald-600 text-white font-black text-xs rounded-lg px-2 py-1.5 shrink-0 w-20 text-center">{r.days}</div>
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{r.from} → {r.to}</div>
                  <div className="text-xs font-semibold text-emerald-600">{r.via}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{r.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Приёмка контейнеров на станциях Московского региона: Электроугли, Белый Раст, Силикатная, Ховрино.
              После выпуска доставляем до склада получателя: Санкт-Петербург, Казань, Екатеринбург, Новосибирск и другие города.
            </p>
          </div>
        </section>

        {/* ================= КАК СЧИТАЕМ ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">Как считаем сборный контейнер</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Сборный контейнер тарифицируется по <strong className="text-slate-900">оплачиваемому весу</strong> — большему
              из фактического веса и расчётного по объёму. Железнодорожный стандарт: 1 м³ приравнивается к 300 кг.
            </p>
            <div className="bg-slate-900 rounded-2xl p-5 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1.5">Расчётный вес по объёму</div>
              <div className="text-white font-mono text-lg sm:text-xl font-bold">Объём (м³) × 300 кг</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-sm">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Пример</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Место объёмом 2 м³, фактический вес 400 кг.<br />
                Расчётный вес: 2 × 300 = <strong className="text-slate-900">600 кг</strong><br />
                Оплачиваемый вес: max(400; 600) = <strong className="text-emerald-600">600 кг</strong>
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Перед отправкой мы замеряем каждое место на складе и присылаем весогабаритный лист — вы всегда знаете, за что платите.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-200 min-h-[240px]">
            <img src="/poezd/poezd-yard.webp" alt="Контейнерные вагоны на МЦК в Москве" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ЧТО ВЕЗЁМ ================= */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Какие грузы везём поездом</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Электроника и техника', 'Станки и оборудование', 'Автозапчасти и комплектующие', 'Товары для маркетплейсов',
              'Обувь и одежда', 'Текстиль', 'Товары для дома', 'Мебель в разобранном виде',
            ].map(g => (
              <span key={g} className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 transition-colors">{g}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <BatteryCharging className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>Батареи и аккумуляторы</strong> — по железной дороге литиевые грузы перевозятся с паспортом MSDS
                и протоколом UN 38.3, проще и дешевле, чем авиа. Согласовываем с перевозчиком до отправки.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Опасные грузы</strong> — жидкости, химия и прочие классы опасности перевозим отдельным запросом
                с декларацией отправителя и согласованием с железной дорогой.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Частые вопросы о ЖД доставке</h2>
          {[
            { q: 'Чем поезд лучше авто и авиа?', a: 'Поезд занимает нишу между ними: дешевле авиа и быстрее моря. По сравнению с авто — стабильные сроки: состав идёт по графику, не зависит от очередей на автомобильных погранпереходах и погоды.' },
            { q: 'Как перегружают контейнеры на границе?', a: 'В Китае и Казахстане колея 1435 мм, в России — 1520 мм. На пограничных станциях (Забайкальск, Достык, Алашанькоу) контейнер перегружается краном с одной платформы на другую. Перегруз занимает часы и не влияет на содержимое контейнера.' },
            { q: 'Как отслеживать контейнер в пути?', a: 'По номеру контейнера и железнодорожной накладной СМГС. Статусы «погружен», «прошёл границу», «в пути», «прибыл на станцию» видны в личном кабинете, а менеджер присылает уведомления о ключевых событиях.' },
            { q: 'На какие станции приходит груз в Москве?', a: 'Контейнеры принимаем на станциях Московского региона: Электроугли, Белый Раст, Силикатная, Ховрино. После таможенного выпуска доставляем до склада получателя автоперевозкой.' },
          ].map((f, i) => (
            <details key={i} className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 open:bg-white open:border-emerald-200 transition-colors">
              <summary className="cursor-pointer list-none font-bold text-slate-900 text-sm flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-emerald-600 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </section>

        {/* ================= ФОРМА ================= */}
        <section id="poezd-lead-form" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Рассчитайте ЖД доставку вашего груза</h2>
              <p className="text-sm text-slate-500">
                Оставьте заявку — менеджер подберёт станцию отправления, поезд и тариф и пришлёт расчёт в течение рабочего дня.
              </p>
            </div>
            <LeadForm initialRequestType={POEZD_REQUEST} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-4">
              <h3 className="font-bold text-lg">Срочный вопрос?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Напишите в мессенджер — дежурный менеджер на связи и подскажет по расписаниям поездов и ставкам.
              </p>
              <div className="space-y-2.5">
                <a href="tel:+78005559425" className="flex items-center gap-2.5 text-sm font-bold hover:text-emerald-300 transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400" /> 8 (800) 555-94-25
                </a>
                <a href="https://wa.me/79282568263" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-emerald-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px]">WA</span> WhatsApp
                </a>
                <a href="https://t.me/ExpressTodayHelp_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-emerald-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px]">TG</span> Telegram
                </a>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Работаем официально
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                ООО «Экспресс-тудей» · склад в Гуанчжоу 2000 м² · полный пакет документов по каждой отправке: СМГС, инвойс, пакинг-лист, ДТ.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SEO-ТЕКСТ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            ЖД доставка из Китая: как устроена перевозка, тарифы и нюансы
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Железнодорожная доставка — золотая середина среди каналов доставки из Китая: быстрее моря, дешевле авиа,
            а по срокам стабильнее авто. Контейнерный поезд идёт по графику и не зависит от очередей на автомобильных
            пограничных переходах — партия приходит за 16–30 дней от приёмки на складе в Гуанчжоу.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Какие грузы выгодно везти поездом</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            По железной дороге выгодно везти средние партии: электронику и технику, станки и оборудование, автозапчасти,
            обувь, одежду, товары для дома и маркетплейсов. Контейнер 40′ HC вмещает до 68 м³ — для грузов от 15 м³ поезд
            уже конкурирует с авто по цене, а приходит предсказуемее. Срочные лёгкие грузы отправляйте{' '}
            <a href="/dostavka-avia-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avia-iz-kitaja'); }} className="text-emerald-600 font-semibold hover:underline">авиадоставкой</a>,
            а сверхтяжёлые недорогие партии —{' '}
            <a href="/dostavka-morem-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-morem-iz-kitaja'); }} className="text-emerald-600 font-semibold hover:underline">морем</a>.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">От чего зависит стоимость ЖД перевозки</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Итоговая цена складывается из нескольких факторов:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">оплачиваемый вес</strong> — для сборных контейнеров большее из фактического веса и расчётного по объёму (1 м³ ≈ 300 кг);</li>
            <li><strong className="text-slate-900">станция отправления</strong> — Чунцин и Сиань ближе к границе, чем Гуанчжоу, от этого зависит километраж;</li>
            <li><strong className="text-slate-900">пограничный переход</strong> — Забайкальск или Достык/Алашанькоу через Казахстан;</li>
            <li><strong className="text-slate-900">тип поезда</strong> — регулярный или ускоренный с минимальными остановками;</li>
            <li><strong className="text-slate-900">дополнительные услуги</strong> — экспортное и импортное оформление, страхование, доставка до двери.</li>
          </ul>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Точную цену можно назвать только по параметрам конкретной партии — менеджер Express Today рассчитывает её
            в течение одного рабочего дня.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Кому подходит ЖД доставка из Китая</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">Импортёрам и оптовикам</strong> — для регулярных поставок средних партий;</li>
            <li><strong className="text-slate-900">Селлерам маркетплейсов</strong> — для планового пополнения стока с предсказуемыми сроками;</li>
            <li><strong className="text-slate-900">Производителям</strong> — для станков, оснастки и комплектующих;</li>
            <li><strong className="text-slate-900">Рознице и интернет-магазинам</strong> — для электроники, обуви, одежды и товаров для дома.</li>
          </ul>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Сколько груза помещается в контейнер</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Для ЖД используются те же контейнеры: 20-футовый — около 28 м³ или 17,5 тонны, 40-футовый High Cube —
            до 68 м³ или 26,5 тонны. Партии меньше половины контейнера выгоднее везти сборным контейнером (LCL),
            больше — полным (FCL). Менеджер подскажет, какой формат дешевле для вашего объёма.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Как проходит перевозка</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Партия принимается на{' '}
            <a href="/konsolidaciya-tovara-v-kitaye" onClick={(e) => { e.preventDefault(); onNavigate('/konsolidaciya-tovara-v-kitaye'); }} className="text-emerald-600 font-semibold hover:underline">складе консолидации в Гуанчжоу</a>,
            грузится в контейнер и пломбируется, оформляется железнодорожная накладная СМГС. После экспортного оформления
            контейнер уходит поездом через Забайкальск или Достык, на границе перегружается с колеи 1435 мм на 1520 мм
            и следует до станции Московского региона, где проходит импортное оформление (ДТ), выпуск и доставку получателю.
            Статусы по номеру контейнера видны в личном кабинете.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Поезд, авто, море или авиа: как выбрать</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Поезд — для стабильных сроков на средних партиях,{' '}
            <a href="/dostavka-avto-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avto-iz-kitaja'); }} className="text-emerald-600 font-semibold hover:underline">авто</a>{' '}
            — для гибкости по маршруту,{' '}
            <a href="/dostavka-morem-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-morem-iz-kitaja'); }} className="text-emerald-600 font-semibold hover:underline">море</a>{' '}
            — для максимальной экономии,{' '}
            <a href="/dostavka-avia-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avia-iz-kitaja'); }} className="text-emerald-600 font-semibold hover:underline">авиа</a>{' '}
            — для срочных грузов. Часто выгодно комбинировать: регулярные поставки везти поездом, а срочные дозаказы — авиа.
            Подобрать схему под ваш товар поможет менеджер: оставьте заявку в форме выше, расчёт и рекомендация будут готовы
            в течение рабочего дня.
          </p>
        </section>

        {/* ================= АТРИБУЦИЯ ФОТО ================= */}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Фото: Wikimedia Commons — «CR Express train near Putian, Zhengzhou» (CC BY-SA 4.0, Windmemories), «DF8B-5034 leaving Zhengzhou Railway Container Terminal» (CC BY-SA 4.0, Windmemories), «Контейнерные вагоны на МЦК» (CC BY-SA 3.0, Leonrid).
        </p>

        {/* ================= НАЗАД ================= */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </a>
      </div>
    </div>
  );
};

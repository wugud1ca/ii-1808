import React from 'react';
import {
  Ship, Container, Clock3, Scale, ShieldCheck, Boxes, FileCheck2,
  PackageCheck, BatteryCharging, AlertTriangle, ArrowLeft, BadgeCheck,
  MapPin, TrendingUp, Phone, Anchor,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';

interface MoreDeliveryPageProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const MORE_REQUEST = 'Заявка: Доставка морем из Китая';

export const MoreDeliveryPage: React.FC<MoreDeliveryPageProps> = ({ onNavigate, onOpenLeadModal }) => {
  const scrollToForm = () => {
    const el = document.getElementById('more-lead-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 pb-4">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'linear-gradient(100deg, rgba(2,6,23,0.88) 8%, rgba(2,6,23,0.72) 45%, rgba(2,6,23,0.38) 100%), url(/more/more-hero.webp)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Ship className="w-4 h-4" />
            <span>Морские перевозки из Китая · контейнеры FCL и LCL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl">
            Доставка морем из Китая в Россию
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Контейнерные перевозки FCL и LCL из портов Гуанчжоу, Шэньчжэня и Нинбо во Владивосток, Находку
            и Санкт-Петербург. Коносамент B/L, пломбировка, таможенный выпуск и доставка до склада —
            <strong className="text-white"> от 18 дней</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLeadModal(MORE_REQUEST)}
              className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-sky-900/40 transition-all cursor-pointer text-sm"
            >
              Рассчитать тариф морем
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
              { icon: Clock3, value: '18–60 дней', label: 'в зависимости от тарифа' },
              { icon: Scale, value: '1 м³ ≈ 500 кг', label: 'расчёт сборного контейнера LCL' },
              { icon: Container, value: '20′ / 40′ HC', label: 'полные контейнеры FCL' },
              { icon: BadgeCheck, value: 'B/L', label: 'коносамент и отслеживание в ЛК' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex items-start gap-3">
                <s.icon className="w-5 h-5 text-sky-400 shrink-0" />
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
            <div className="bg-sky-100 rounded-xl p-2.5 shrink-0">
              <TrendingUp className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Почему море с Express Today</h2>
              <p className="text-sm text-slate-500 mt-1">Самый экономичный канал для крупных партий — контейнерная логистика под ключ</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Container, title: 'FCL и LCL в одном окне', text: 'Полный контейнер 20′ или 40′ HC под вашу партию либо сборный контейнер (LCL) от нескольких отправителей — платите только за своё место.' },
              { icon: Anchor, title: 'Прямые линии и расписания', text: 'Работаем по прямым договорам с морскими линиями: Шэньчжэнь, Гуанчжоу, Нинбо. Расписание отходов судов знаем на месяц вперёд.' },
              { icon: Scale, title: 'Честный расчёт LCL', text: 'Сборные контейнеры считаем по большему из фактического веса и объёма (1 м³ ≈ 500 кг) и показываем расчёт прозрачно.' },
              { icon: BadgeCheck, title: 'Коносамент и отслеживание', text: 'Оформляем B/L на грузополучателя, статусы судна и контейнера видны в личном кабинете: порт — море — выгрузка — доставка.' },
              { icon: ShieldCheck, title: 'Пломбировка и страхование', text: 'Контейнер пломбируется на складе отправителя, страхование на полную стоимость на всём маршруте до склада получателя.' },
              { icon: FileCheck2, title: 'Портовая обработка под ключ', text: 'Экспортное оформление в КНР, терминальные операции, импортная очистка и вывоз с порта — одна команда, один договор.' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2.5 hover:border-sky-300 hover:shadow-md transition-all">
                <div className="bg-sky-50 rounded-xl p-2.5 w-fit">
                  <c.icon className="w-5 h-5 text-sky-600" />
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Сроки морской доставки: от брони до двери</h2>
            <p className="text-sm text-slate-500">Экспресс через Владивосток — 18–25 дней, полный контейнер FCL — 35–45 дней</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { day: 'День 0–2', title: 'Бронирование места', text: 'Резервируем слот на судне по расписанию линии, оформляем букинг и экспортную декларацию в КНР.' },
              { day: 'День 2–5', title: 'Затарка контейнера', text: 'Партия грузится в контейнер на складе в Гуанчжоу, пломбируется, оформляется коносамент B/L.' },
              { day: 'День 5–8', title: 'Отход судна', text: 'Контейнер сдаётся в порт Шэньчжэнь (Шэкоу/Яньтянь) или Гуанчжоу (Наньша) и грузится на судно.' },
              { day: 'День 8–35', title: 'Морское плечо', text: 'Переход до Владивостока, Находки или Санкт-Петербурга. Статусы судна обновляются в личном кабинете.' },
              { day: 'День 15–60', title: 'Выгрузка и выдача', text: 'Выгрузка в порту, импортное оформление (ДТ), выпуск и доставка контейнера до склада получателя по России.' },
            ].map((s, i) => (
              <div key={i} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-sky-600">{s.day}</div>
                <div className="font-bold text-slate-900 text-sm">{s.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src="/more/more-terminal.webp" alt="Портовые краны контейнерного терминала" className="w-full h-48 sm:h-64 object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ТАРИФЫ ================= */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Тарифы морской доставки из Китая</h2>
            <p className="text-sm text-slate-500">Три формата отправки — от сборного контейнера до ускоренного плеча</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Море-эконом',
                badge: null,
                days: '45–60 дней',
                price: 'от 0,1 $/кг',
                desc: 'Сборный контейнер (LCL), отправка с ближайшим судном. Для плановых закупок без жёстких сроков — самый дешёвый способ привезти товар.',
                feat: ['Сборный контейнер LCL', 'Ближайшее судно по расписанию', 'Один B/L на партию', 'Статусы в ЛК'],
                popular: false,
              },
              {
                name: 'Море-стандарт FCL',
                badge: 'Самый популярный',
                days: '35–45 дней',
                price: 'от 0,2 $/кг',
                desc: 'Полный контейнер 20′ или 40′ HC под вашу партию. Оптимально для крупных отгрузок: ставка за контейнер, а не за килограмм.',
                feat: ['Полный контейнер 20′ / 40′ HC', 'Ставка за контейнер', 'Пломбировка на складе', 'Персональный менеджер'],
                popular: true,
              },
              {
                name: 'Море-экспресс',
                badge: null,
                days: '18–25 дней',
                price: 'от 0,5 $/кг',
                desc: 'Ускоренное плечо через Владивосток: короткий морской переход, быстрая выгрузка и отправка по России. Для партий, которые не ждут.',
                feat: ['Короткое плечо до Владивостока', 'Выгрузка без очередей', 'Приоритетная обработка', 'Доставка день-в-день'],
                popular: false,
              },
            ].map((t, i) => (
              <div key={i} className={`relative rounded-3xl border p-6 space-y-4 flex flex-col transition-all ${t.popular ? 'border-sky-400 bg-gradient-to-b from-sky-50/80 to-white shadow-lg shadow-sky-600/10' : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'}`}>
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 text-white text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow-md">
                    {t.badge}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Ship className={`w-5 h-5 ${t.popular ? 'text-sky-600' : 'text-slate-400'}`} />
                  <h3 className="font-black text-slate-900 text-lg">{t.name}</h3>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{t.price}</div>
                  <div className="text-sm font-semibold text-sky-600">{t.days}</div>
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
                  onClick={() => onOpenLeadModal(`${MORE_REQUEST} — тариф «${t.name}»`)}
                  className={`w-full font-bold px-5 py-3 rounded-xl transition-all cursor-pointer text-sm ${t.popular ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-md shadow-sky-600/25' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  Рассчитать партию
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl p-3.5 leading-relaxed">
            * Ставки ориентировочные: FCL считается за контейнер, LCL — по оплачиваемому весу (1 м³ ≈ 500 кг). В тариф входит экспортное оформление, букинг и обработка в порту отправления. Импортное оформление в РФ, портовые сборы, вывоз и доставка по России рассчитываются отдельно — менеджер подготовит точный расчёт по вашему запросу.
          </p>
        </section>

        {/* ================= МАРШРУТЫ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-xl p-2.5 shrink-0">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Маршруты морской доставки из Китая</h2>
              <p className="text-sm text-slate-500 mt-1">Основные порты отправления и прибытия — плечо подбираем под партию</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { from: 'Шэньчжэнь (Шэкоу / Яньтянь)', via: 'прямое судно', to: 'Владивосток (ВМТП)', days: '10–16 дней морем', note: 'Короткое плечо, далее авто/ЖД по России' },
              { from: 'Гуанчжоу (Наньша)', via: 'трансшипмент через Пусан', to: 'Владивосток / Находка', days: '18–25 дней', note: 'Стабильное расписание, регулярные отходы' },
              { from: 'Нинбо / Шанхай', via: 'прямое судно', to: 'Находка (ВСК)', days: '12–18 дней морем', note: 'Для Дальнего Востока и Сибири' },
              { from: 'Гуанчжоу / Шэньчжэнь', via: 'через Суэцкий канал', to: 'Санкт-Петербург', days: '35–45 дней', note: 'Для Северо-Запада и центральной России' },
            ].map((r, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="bg-blue-600 text-white font-black text-xs rounded-lg px-2 py-1.5 shrink-0 w-16 text-center">{r.days}</div>
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{r.from} → {r.to}</div>
                  <div className="text-xs font-semibold text-sky-600">{r.via}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{r.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              После выгрузки в порту доставляем контейнер до склада получателя: Москва, Санкт-Петербург, Екатеринбург,
              Новосибирск и другие города — автоперевозкой или по железной дороге. Возможна выдача груза прямо в порту.
            </p>
          </div>
        </section>

        {/* ================= КАК СЧИТАЕМ ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl font-bold text-slate-900">Как считаем сборный контейнер</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Полный контейнер (FCL) тарифицируется <strong className="text-slate-900">ставкой за контейнер</strong>,
              сборный (LCL) — по оплачиваемому весу: большему из фактического веса и расчётного по объёму.
              Морской стандарт: 1 м³ приравнивается к 500 кг.
            </p>
            <div className="bg-slate-900 rounded-2xl p-5 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1.5">Расчётный вес по объёму (LCL)</div>
              <div className="text-white font-mono text-lg sm:text-xl font-bold">Объём (м³) × 500 кг</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-sm">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Пример</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Место объёмом 3 м³, фактический вес 600 кг.<br />
                Расчётный вес: 3 × 500 = <strong className="text-slate-900">1 500 кг</strong><br />
                Оплачиваемый вес: max(600; 1 500) = <strong className="text-sky-600">1 500 кг</strong>
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Перед затаркой мы обмеряем каждое место на складе и присылаем весогабаритный лист — вы всегда знаете, за что платите.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-200 min-h-[240px]">
            <img src="/more/more-yard.webp" alt="Контейнерный терминал в порту" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ЧТО ВЕЗЁМ ================= */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Какие грузы везём морем</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Крупногабаритные станки', 'Стройматериалы и плитка', 'Мебель крупными партиями', 'Промышленное оборудование',
              'Сырьё в биг-бегах', 'Товары для маркетплейсов', 'Автозапчасти паллетами', 'Садовая техника',
            ].map(g => (
              <span key={g} className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-sky-300 transition-colors">{g}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <BatteryCharging className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                <strong>Батареи и аккумуляторы</strong> — морем литиевые грузы перевозятся по кодексу IMDG с паспортом MSDS
                и протоколом UN 38.3. Морской транспорт принимает практически все классы опасных грузов, которые не берёт авиа.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Опасные грузы (IMDG)</strong> — химия, жидкости и прочие классы опасности перевозим отдельным запросом
                с декларацией отправителя и согласованием с линией до бронирования.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Частые вопросы о морской доставке</h2>
          {[
            { q: 'Почему море — самый дешёвый канал?', a: 'Контейнеровоз перевозит тысячи контейнеров за рейс, поэтому стоимость единицы груза минимальна. Плата за экономию — время: от 18 дней экспрессом до 60 дней сборным контейнером. Для плановых закупок это самый выгодный вариант.' },
            { q: 'Что такое FCL и LCL?', a: 'FCL — полный контейнер: 20-футовый (около 28 м³ / 17,5 т) или 40-футовый High Cube (около 68 м³ / 26,5 т). Вы платите ставку за контейнер целиком. LCL — сборный контейнер: платите только за своё место по оплачиваемому весу (1 м³ ≈ 500 кг).' },
            { q: 'Долго ли идёт контейнер из Гуанчжоу?', a: 'До Владивостока — 10–16 дней морем, до Санкт-Петербурга через Суэц — 35–45 дней. Полный цикл «от склада до склада» с оформлением и вывозом занимает от 18 до 60 дней в зависимости от тарифа и порта назначения.' },
            { q: 'Нужна ли растаможка?', a: 'Да, импортное оформление (ДТ) проходит после выгрузки в порту назначения. Мы делаем его под ключ: декларация, платежи, выпуск и вывоз контейнера. Документы: B/L, инвойс, пакинг-лист, сертификаты при необходимости.' },
          ].map((f, i) => (
            <details key={i} className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 open:bg-white open:border-sky-200 transition-colors">
              <summary className="cursor-pointer list-none font-bold text-slate-900 text-sm flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-sky-600 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </section>

        {/* ================= ФОРМА ================= */}
        <section id="more-lead-form" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Рассчитайте морскую доставку вашего груза</h2>
              <p className="text-sm text-slate-500">
                Оставьте заявку — менеджер подберёт порт, линию и тариф FCL или LCL и пришлёт расчёт в течение рабочего дня.
              </p>
            </div>
            <LeadForm initialRequestType={MORE_REQUEST} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-4">
              <h3 className="font-bold text-lg">Срочный вопрос?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Напишите в мессенджер — дежурный менеджер на связи и подскажет по расписаниям линий и ставкам.
              </p>
              <div className="space-y-2.5">
                <a href="tel:+78005559425" className="flex items-center gap-2.5 text-sm font-bold hover:text-sky-300 transition-colors">
                  <Phone className="w-4 h-4 text-sky-400" /> 8 (800) 555-94-25
                </a>
                <a href="https://wa.me/79282568263" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-sky-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px]">WA</span> WhatsApp
                </a>
                <a href="https://t.me/ExpressTodayHelp_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-sky-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[9px]">TG</span> Telegram
                </a>
              </div>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sky-900 text-sm">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                Работаем официально
              </div>
              <p className="text-xs text-sky-900/80 leading-relaxed">
                ООО «Экспресс-тудей» · склад в Гуанчжоу 2000 м² · полный пакет документов по каждой отправке: B/L, инвойс, пакинг-лист, ДТ.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SEO-ТЕКСТ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Морская доставка из Китая: как устроена перевозка, тарифы и нюансы
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Морская доставка — самый экономичный способ привезти товар из Китая в Россию. Контейнеровоз перевозит
            тысячи TEU за один рейс, поэтому стоимость единицы груза минимальна, а сроки начинаются от 18 дней
            экспресс-плечом через Владивосток. Для плановых закупок, крупных партий и тяжёлых грузов это оптимальный канал.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Какие грузы выгодно везти морем</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Морем выгодно везти всё тяжёлое, крупное и не срочное: станки и оборудование, стройматериалы, плитку, мебель
            крупными партиями, сырьё в биг-бегах, автозапчасти паллетами. Морской транспорт принимает почти все классы
            опасных грузов по кодексу IMDG — включая литиевые батареи, которые авиакомпании берут с большими ограничениями.
            А вот срочные и дорогие лёгкие грузы выгоднее отправить{' '}
            <a href="/dostavka-avia-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avia-iz-kitaja'); }} className="text-sky-600 font-semibold hover:underline">авиадоставкой</a>:
            там сроки начинаются от шести дней.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">От чего зависит стоимость морской перевозки</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Итоговая цена складывается из нескольких факторов:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">формат отправки</strong> — полный контейнер FCL (ставка за контейнер) или сборный LCL (по оплачиваемому весу, 1 м³ ≈ 500 кг);</li>
            <li><strong className="text-slate-900">порт отправления и назначения</strong> — короткое плечо на Владивосток дешевле, чем транзит через Суэц в Санкт-Петербург;</li>
            <li><strong className="text-slate-900">тип контейнера</strong> — 20′, 40′ или 40′ High Cube, рефрижераторные контейнеры дороже;</li>
            <li><strong className="text-slate-900">сезонность</strong> — перед китайским Новым годом и в пик сезона фрахт растёт;</li>
            <li><strong className="text-slate-900">портовые и терминальные сборы</strong>, экспортное и импортное оформление, вывоз с порта.</li>
          </ul>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Точную цену можно назвать только по параметрам конкретной партии — менеджер Express Today рассчитывает её
            в течение одного рабочего дня.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Кому подходит морская доставка из Китая</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">Импортёрам и оптовикам</strong> — для регулярных плановых поставок крупных партий;</li>
            <li><strong className="text-slate-900">Селлерам маркетплейсов</strong> — для сезонных закупок под распродажи с запасом по времени;</li>
            <li><strong className="text-slate-900">Производителям</strong> — для станков, линий и сырья;</li>
            <li><strong className="text-slate-900">Торговым сетям</strong> — для массовых позиций с низкой стоимостью за килограмм.</li>
          </ul>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Сколько груза помещается в контейнер</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            20-футовый контейнер вмещает около 28 м³ или 17,5 тонны, 40-футовый — 58–60 м³ или 26,5 тонны,
            а 40-футовый High Cube — до 68 м³. Если ваша партия меньше половины контейнера, выгоднее сборный LCL:
            вы платите только за своё место. Если больше — ставка FCL за контейнер целиком. Менеджер подскажет,
            какой формат дешевле для вашего объёма.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Как проходит перевозка</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Партия принимается на{' '}
            <a href="/konsolidaciya-tovara-v-kitaye" onClick={(e) => { e.preventDefault(); onNavigate('/konsolidaciya-tovara-v-kitaye'); }} className="text-sky-600 font-semibold hover:underline">складе консолидации в Гуанчжоу</a>,
            грузится в контейнер, пломбируется, после экспортного оформления контейнер сдаётся в порт и уходит на судне
            во Владивосток, Находку или Санкт-Петербург. После выгрузки проходит импортное оформление (ДТ), выпуск
            и доставку до склада получателя. Номер контейнера и статусы каждого этапа видны в личном кабинете.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Море, авто, ЖД или авиа: как выбрать</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Море — для максимальной экономии без привязки к срокам.{' '}
            <a href="/dostavka-avto-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avto-iz-kitaja'); }} className="text-sky-600 font-semibold hover:underline">Автодоставка</a>{' '}
            — для баланса цены и скорости,{' '}
            <a href="/dostavka-poezdom-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-poezdom-iz-kitaja'); }} className="text-sky-600 font-semibold hover:underline">ЖД</a>{' '}
            — для стабильных сроков на средних партиях,{' '}
            <a href="/dostavka-avia-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avia-iz-kitaja'); }} className="text-sky-600 font-semibold hover:underline">авиа</a>{' '}
            — для срочных грузов. Подобрать схему под ваш товар поможет менеджер: оставьте заявку в форме выше,
            расчёт и рекомендация будут готовы в течение рабочего дня.
          </p>
        </section>

        {/* ================= АТРИБУЦИЯ ФОТО ================= */}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Фото: Wikimedia Commons — «Container ship in Koper 2013» (CC0), «Container cranes at the Port of Oakland» (CC BY-SA 4.0), «Belfast Container Terminal, April 2019» (CC BY-SA 4.0).
        </p>

        {/* ================= НАЗАД ================= */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-sky-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </a>
      </div>
    </div>
  );
};

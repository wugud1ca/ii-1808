import React from 'react';
import {
  Plane, PlaneTakeoff, Clock3, Scale, ShieldCheck, Boxes, FileCheck2,
  PackageCheck, BatteryCharging, AlertTriangle, ArrowLeft, Route, BadgeCheck,
  MapPin, TrendingUp, Phone,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';

interface AirDeliveryPageProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const AIR_REQUEST = 'Заявка: Авиадоставка из Китая';

export const AirDeliveryPage: React.FC<AirDeliveryPageProps> = ({ onNavigate, onOpenLeadModal }) => {
  const scrollToForm = () => {
    const el = document.getElementById('air-lead-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 pb-4">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'linear-gradient(100deg, rgba(2,6,23,0.88) 8%, rgba(2,6,23,0.72) 45%, rgba(2,6,23,0.38) 100%), url(/air/air-hero.webp)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-400/40 text-orange-300 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Plane className="w-4 h-4" />
            <span>Авиафрахт из Китая · сборные и генеральные грузы</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl">
            Авиадоставка грузов из Китая в Россию
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Регулярные и чартерные рейсы из Гуанчжоу, Шэньчжэня, Пекина и Шанхая.
            Консолидация партии на собственном складе, оформление авианакладной (AWB),
            таможенный выпуск и доставка до вашего склада — <strong className="text-white">9–15 дней</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenLeadModal(AIR_REQUEST)}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-900/40 transition-all cursor-pointer text-sm"
            >
              Рассчитать тариф авиа
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
              { icon: Clock3, value: '9–15 дней', label: 'от склада до склада' },
              { icon: Scale, value: '1 : 6000', label: 'честный оплачиваемый вес' },
              { icon: Boxes, value: '2 000 м²', label: 'склад консолидации в Гуанчжоу' },
              { icon: BadgeCheck, value: 'AWB', label: 'отслеживание статуса в ЛК' },
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
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Почему авиадоставка с Express Today</h2>
              <p className="text-sm text-slate-500 mt-1">Работаем с авиаперевозчиками напрямую, без посреднических накруток</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: PlaneTakeoff, title: 'Прямые тарифы авиакомпаний', text: 'Бронируем слоты у перевозчиков по прямым договорам. Ставка — как у генерального агента, без цепочки посредников.' },
              { icon: Boxes, title: 'Консолидация на складе Гуанчжоу', text: 'Собираем товары от разных фабрик в одну партию, паллетизируем и загружаем в ULD. Один AWB на всю отправку.' },
              { icon: Scale, title: 'Честный оплачиваемый вес', text: 'Считаем по большему из фактического и объёмного веса (1:6000) и показываем расчёт прозрачно — без скрытых коэффициентов.' },
              { icon: BadgeCheck, title: 'Отслеживание по AWB в ЛК', text: 'Статусы бронирования, вылета, транзита и выпуска видны в личном кабинете. Менеджер дублирует ключевые события.' },
              { icon: ShieldCheck, title: 'Страхование груза', text: 'Оформляем страховку на полную стоимость партии на всех этапах: склад — аэропорт — перелёт — доставка.' },
              { icon: FileCheck2, title: 'Экспортное и импортное оформление', text: 'Экспортная декларация в КНР, подготовка инвойса и пакинг-листа, импортный выпуск (ДТ) в России — под ключ.' },
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Сроки авиадоставки: от брони до двери</h2>
            <p className="text-sm text-slate-500">Полный цикл — 9–15 дней от момента приёмки на складе в Гуанчжоу</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {[
              { day: 'День 0–1', title: 'Приёмка и бронирование', text: 'Груз принимается на складе в Гуанчжоу: взвешивание, обмер габаритов, сверка с инвойсом. Бронируем слот и оформляем авианакладную (AWB).' },
              { day: 'День 1–3', title: 'Экспортное оформление', text: 'Экспортная декларация, таможенное оформление КНР, рентген-досмотр, паллетизация и загрузка в ULD.' },
              { day: 'День 3–8', title: 'Авиаперевозка', text: 'Вылет из CAN/SZX/PEK/PVG. Прямой рейс или стыковка через хаб (DXB, DOH, IST). Груз в пути — статус виден в ЛК.' },
              { day: 'День 8–12', title: 'Прилёт и выпуск в РФ', text: 'Прибытие в SVO/DME, размещение на СВХ, импортное оформление (ДТ) и выпуск для свободного обращения.' },
              { day: 'День 12–15', title: 'Доставка получателю', text: 'Передаём груз в магистральную доставку по России — до вашего склада или пункта выдачи.' },
            ].map((s, i) => (
              <div key={i} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-orange-600">{s.day}</div>
                <div className="font-bold text-slate-900 text-sm">{s.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src="/air/air-terminal.webp" alt="Загрузка паллет в грузовой отсек самолёта" className="w-full h-48 sm:h-64 object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ТАРИФЫ ================= */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Тарифы авиадоставки из Китая</h2>
            <p className="text-sm text-slate-500">Три уровня срочности — от консолидации до экспресс-бронирования</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: 'Авиа-эконом',
                badge: null,
                days: '12–18 дней',
                price: 'от 4,9 $/кг',
                desc: 'Консолидация сборных партий, отправка ближайшим свободным бортом. Для регулярных отгрузок без жёстких сроков.',
                feat: ['Консолидация на складе Гуанчжоу', 'Ближайший свободный борт', 'Один AWB на партию', 'Статусы в ЛК'],
                popular: false,
              },
              {
                name: 'Авиа-стандарт',
                badge: 'Самый популярный',
                days: '9–15 дней',
                price: 'от 6,5 $/кг',
                desc: 'Гарантированное бронирование слота под вашу партию. Оптимальный баланс цены и скорости — основной выбор наших клиентов.',
                feat: ['Бронирование слота под партию', 'Экспортное оформление включено', 'Страхование по желанию', 'Персональный менеджер'],
                popular: true,
              },
              {
                name: 'Авиа-приоритет',
                badge: null,
                days: '6–10 дней',
                price: 'от 8,9 $/кг',
                desc: 'Экспресс-бронирование, прямые рейсы, приоритетная обработка. Для срочных партий, образцов и товара с горящими сроками.',
                feat: ['Прямые рейсы без стыковок', 'Приоритетная обработка в аэропорту', 'Срочное таможенное оформление', 'Доставка день-в-день'],
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
                  <Plane className={`w-5 h-5 ${t.popular ? 'text-orange-600' : 'text-slate-400'}`} />
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
                  onClick={() => onOpenLeadModal(`${AIR_REQUEST} — тариф «${t.name}»`)}
                  className={`w-full font-bold px-5 py-3 rounded-xl transition-all cursor-pointer text-sm ${t.popular ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-md shadow-orange-600/25' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                >
                  Рассчитать партию
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded-xl p-3.5 leading-relaxed">
            * Ставки ориентировочные и зависят от оплачиваемого веса, плотности груза и маршрута. В услугу входит экспортное оформление, авианакладная (AWB) и обработка груза на складе. Импортное оформление в РФ, доставка по России и страхование рассчитываются отдельно — менеджер подготовит точный расчёт по вашему запросу.
          </p>
        </section>

        {/* ================= МАРШРУТЫ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-xl p-2.5 shrink-0">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Маршруты авиадоставки из Китая</h2>
              <p className="text-sm text-slate-500 mt-1">Прямые и стыковочные рейсы — оптимальный маршрут подбираем под каждую партию</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { from: 'Гуанчжоу', code: 'CAN', to: 'Москва (SVO / DME)', days: '9–12 дней', note: 'Ближайший к нашему складу аэропорт вылета' },
              { from: 'Шэньчжэнь', code: 'SZX', to: 'Москва (SVO / DME)', days: '10–13 дней', note: 'Для товаров из Гуандуна и электроники' },
              { from: 'Пекин', code: 'PEK', to: 'Москва (SVO / DME)', days: '9–12 дней', note: 'Для партий с севера Китая' },
              { from: 'Шанхай', code: 'PVG', to: 'Москва (SVO / DME)', days: '10–14 дней', note: 'Крупнейший карго-хаб восточного Китая' },
            ].map((r, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="bg-blue-600 text-white font-black text-xs rounded-lg px-2 py-1.5 shrink-0 w-12 text-center">{r.code}</div>
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{r.from} → {r.to}</div>
                  <div className="text-xs font-semibold text-orange-600">{r.days}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{r.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700 self-center">Стыковочные хабы:</span>
            {['Дубай (DXB)', 'Доха (DOH)', 'Стамбул (IST)', 'Алматы (ALA)'].map(h => (
              <span key={h} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800">{h}</span>
            ))}
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              По России доставляем из Москвы до склада получателя: Санкт-Петербург, Казань, Екатеринбург, Новосибирск и другие города — магистральными перевозками или экспресс-службами.
            </p>
          </div>
        </section>

        {/* ================= ОПЛАЧИВАЕМЫЙ ВЕС ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-bold text-slate-900">Как считаем оплачиваемый вес</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              В авиафрахте тариф применяется к <strong className="text-slate-900">оплачиваемому весу</strong> — большему из двух значений:
              фактического (брутто) и объёмного. Объёмный вес вычисляется по стандарту IATA 1:6000.
            </p>
            <div className="bg-slate-900 rounded-2xl p-5 text-center">
              <div className="text-slate-400 text-xs uppercase tracking-wider mb-1.5">Объёмный вес (IATA 1:6000)</div>
              <div className="text-white font-mono text-lg sm:text-xl font-bold">Д × Ш × В (см) ÷ 6000</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-sm">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">Пример</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Коробка 100 × 80 × 60 см, фактический вес 120 кг.<br />
                Объёмный вес: 100 × 80 × 60 ÷ 6000 = <strong className="text-slate-900">80 кг</strong><br />
                Оплачиваемый вес: max(120; 80) = <strong className="text-orange-600">120 кг</strong>
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Перед отправкой мы замеряем каждое место на складе и присылаем вам весогабаритный лист — вы всегда знаете, за что платите.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-200 min-h-[240px]">
            <img src="/air/air-uld.webp" alt="Загрузка авиационного контейнера ULD" className="w-full h-full object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= ЧТО ВЕЗЁМ ================= */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Какие грузы летают авиа</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Электроника и гаджеты', 'Комплектующие и запчасти', 'Образцы для испытаний', 'Документы и печатная продукция',
              'Одежда и текстиль', 'Оборудование и станки', 'Товары для маркетплейсов', 'Медицинские изделия',
            ].map(g => (
              <span key={g} className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-orange-300 transition-colors">{g}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <BatteryCharging className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-900 leading-relaxed">
                <strong>Батареи и аккумуляторы</strong> — литий-ионные грузы возим по регламенту IATA DGR: нужны паспорт MSDS и протокол UN 38.3. Оформляем и согласовываем с авиакомпанией.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-xs text-rose-900 leading-relaxed">
                <strong>Опасные грузы (DG)</strong> — жидкости, химия и прочие классы опасности перевозим отдельным запросом с полным пакетом документов и декларацией отправителя.
              </p>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Частые вопросы об авиадоставке</h2>
          {[
            { q: 'Почему авиа дороже карго-доставки?', a: 'Авиафрахт платится за скорость, регулярность и сохранность: рейсы вылетают по расписанию, груз меньше времени в пути и минимально рискует при перегрузках. Авиа выбирают для дорогих, срочных и лёгких партий, где стоимость доставки окупается скоростью оборота денег.' },
            { q: 'Что такое оплачиваемый вес 1:6000?', a: 'Авиакомпании тарифицируют место в грузовом отсеке. Объёмный вес считается по формуле Д×Ш×В (см) ÷ 6000, а к оплате принимается больший из объёмного и фактического веса. Для плотных грузов оплачивается факт, для лёгких объёмных — объём.' },
            { q: 'Можно ли отправить товар с батареями?', a: 'Да. Литий-ионные грузы перевозятся по регламенту IATA DGR. Нам нужны паспорт безопасности (MSDS) и протокол испытаний UN 38.3 — дальше оформляем и согласовываем с авиакомпанией. Ограниченные партии отправляются штатными рейсами.' },
            { q: 'Как отслеживать груз в пути?', a: 'После бронирования вы получаете номер авианакладной (AWB). Статусы — «принят на складе», «вылетел», «транзит», «прибыл», «выпущен» — видны в личном кабинете, а менеджер присылает уведомления о ключевых событиях.' },
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
        <section id="air-lead-form" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Рассчитайте авиадоставку вашего груза</h2>
              <p className="text-sm text-slate-500">
                Оставьте заявку — менеджер подберёт рейс, посчитает оплачиваемый вес и пришлёт точный тариф в течение рабочего дня.
              </p>
            </div>
            <LeadForm initialRequestType={AIR_REQUEST} />
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
                ООО «Экспресс-тудей» · склад в Гуанчжоу 2000 м² · полный пакет документов по каждой отправке: авианакладная (AWB), инвойс, пакинг-лист, ДТ.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SEO-ТЕКСТ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Авиадоставка из Китая: как устроена перевозка, тарифы и нюансы
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Авиадоставка — самый быстрый способ привезти товар из Китая в Россию. Её выбирают, когда сроки важнее экономии:
            груз летит прямым или стыковочным рейсом, а весь цикл «от склада до склада» укладывается в 6–18 дней в зависимости
            от тарифа. Для срочных партий, ценных товаров и образцов это единственный вариант, который позволяет не останавливать
            продажи и не срывать сроки поставки.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Какие грузы имеет смысл отправлять самолётом</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Воздушный транспорт оправдан не для всего. Авиа — правильный выбор, когда партия лёгкая и компактная
            (электроника, аксессуары, комплектующие), товар дорогой или срочный (образцы для сертификации, запчасти для
            оборудования), склад или маркетплейс ждёт пополнения к дате акции, а также когда нужен легальный ввоз с полным
            пакетом документов и быстрым таможенным выпуском. Напротив, тяжёлые и объёмные товары с невысокой стоимостью —
            мебель, упаковка, стройматериалы — дешевле везти{' '}
            <a href="/dostavka" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka'); }} className="text-orange-600 font-semibold hover:underline">авто или по железной дороге</a>:
            на них авиатариф съест всю маржу.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">От чего зависит стоимость авиаперевозки</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Тариф авиакомпании — лишь часть итоговой цены. Стоимость складывается из нескольких факторов:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">оплачиваемый вес</strong> — большее из фактического и объёмного (по формуле IATA 1:6000);</li>
            <li><strong className="text-slate-900">плотность груза</strong> — чем компактнее партия, тем дешевле обходится килограмм;</li>
            <li><strong className="text-slate-900">сезонность</strong> — перед китайским Новым годом и в конце года ставки растут;</li>
            <li><strong className="text-slate-900">топливный и аэропортовые сборы</strong>, сборы за безопасность и обработку груза;</li>
            <li><strong className="text-slate-900">дополнительные услуги</strong> — экспортное и импортное оформление, страхование, доставка до двери.</li>
          </ul>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Поэтому точную цену можно назвать только по параметрам конкретной партии — менеджер Express Today рассчитывает её
            в течение одного рабочего дня.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Кому подходит авиадоставка из Китая</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">Импортёрам и оптовикам</strong> — для регулярных быстрых поставок ходового товара;</li>
            <li><strong className="text-slate-900">Селлерам маркетплейсов</strong> (Wildberries, Ozon, Яндекс.Маркет) — для срочного пополнения стока перед распродажами;</li>
            <li><strong className="text-slate-900">Производителям</strong> — для комплектующих, оснастки и запчастей, от которых зависит производственный цикл;</li>
            <li><strong className="text-slate-900">Всем, кто везёт образцы, документы</strong> или единичные ценные позиции.</li>
          </ul>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Как проходит перевозка</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Партия принимается на{' '}
            <a href="/konsolidaciya-tovara-v-kitaye" onClick={(e) => { e.preventDefault(); onNavigate('/konsolidaciya-tovara-v-kitaye'); }} className="text-orange-600 font-semibold hover:underline">складе консолидации в Гуанчжоу</a>,
            взвешивается и обмеряется, оформляется авианакладная (AWB). После экспортного оформления в КНР груз улетает рейсом
            из Гуанчжоу, Шэньчжэня, Пекина или Шанхая в Москву (Шереметьево или Домодедово), проходит импортный выпуск
            и доставляется получателю по России. Статусы каждого этапа видны в личном кабинете, а менеджер дублирует
            ключевые события в мессенджере.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Авиа или карго: как выбрать</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Авиа — про скорость, сохранность и предсказуемость: рейсы по расписанию, минимум перегрузок и жёсткий контроль
            сроков. <a href="/kargo-dostavka-iz-kitaia" onClick={(e) => { e.preventDefault(); onNavigate('/kargo-dostavka-iz-kitaia'); }} className="text-orange-600 font-semibold hover:underline">Карго-доставка</a> — про экономию
            на больших и плотных партиях, когда сроки позволяют подождать. Часто выгодно комбинировать: регулярные поставки
            вести карго, а срочные дозаказы — авиа. Подобрать схему под ваш товар поможет менеджер: оставьте заявку в форме выше,
            расчёт и рекомендация будут готовы в течение рабочего дня.
          </p>
        </section>

        {/* ================= АТРИБУЦИЯ ФОТО ================= */}
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Фото: Wikimedia Commons — «Palletized cargo being loaded onto EVA Air Boeing 777-300ER» (CC BY 4.0, 4300streetcar), «Aircraft cargo (ULD) loader» (CC BY-SA 3.0, Jamesshliu), «Unloading JAL 747» (Public domain, Dtom).
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

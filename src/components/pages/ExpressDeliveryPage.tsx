import React from 'react';
import {
  Zap, Clock3, Scale, ShieldCheck, Boxes, FileCheck2,
  PackageSearch, BadgeCheck, AlertTriangle, ArrowLeft, Route,
  MapPin, TrendingUp, Phone, PackageCheck, Search, UserPlus, Send,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';

interface ExpressDeliveryPageProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const EXPRESS_REQUEST = 'Заявка: Экспресс-доставка из Китая';
const CABINET_REGISTRATION_URL = 'https://my.express-today.ru/registration';

export const ExpressDeliveryPage: React.FC<ExpressDeliveryPageProps> = ({ onNavigate, onOpenLeadModal }) => {
  const scrollToForm = () => {
    const el = document.getElementById('express-lead-form');
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-400/40 text-violet-300 text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            <span>Экспресс-доставка из Китая · срочные партии и образцы</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl">
            Экспресс-доставка из Китая в Россию
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Срочная перевозка малых партий, образцов и документов из Гуанчжоу и Шэньчжэня:
            приёмка на складе, экспортное оформление, ближайший авиарейс и доставка курьером
            до двери — <strong className="text-white">5–12 дней</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-violet-900/40 transition-all cursor-pointer text-sm"
            >
              Отправить заявку
            </button>
            <button
              onClick={() => onNavigate('/online-tariffs')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all cursor-pointer text-sm"
            >
              Найти тариф онлайн
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl pt-2">
            {[
              { icon: Clock3, value: '5–12 дней', label: 'от склада до двери' },
              { icon: Scale, value: 'от 1 кг', label: 'мелкие партии и посылки' },
              { icon: Boxes, value: '2 000 м²', label: 'склад консолидации в Гуанчжоу' },
              { icon: BadgeCheck, value: 'Трек-номер', label: 'отслеживание статуса в ЛК' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex items-start gap-3">
                <s.icon className="w-5 h-5 text-violet-400 shrink-0" />
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
            <div className="bg-violet-100 rounded-xl p-2.5 shrink-0">
              <TrendingUp className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Почему экспресс-доставка с Express Today</h2>
              <p className="text-sm text-slate-500 mt-1">Срочные грузы — приоритетная обработка на каждом этапе</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: 'Приоритетная обработка', text: 'Бронируем место на ближайшем рейсе и обрабатываем партию вне очереди — без ожидания консолидации больших сборных отправок.' },
              { icon: Boxes, title: 'Консолидация на складе Гуанчжоу', text: 'Собираем заказы от разных фабрик в одну партию, проверяем комплектность и упаковываем под авиаперевозку.' },
              { icon: PackageSearch, title: 'Мелкие партии от 1 кг', text: 'Работаем с посылками и малыми партиями без жёсткой минималки: образцы, документы, запчасти, аксессуары.' },
              { icon: BadgeCheck, title: 'Отслеживание по трек-номеру', text: 'Статусы «принят», «вылетел», «прибыл», «выпущен» видны в личном кабинете, менеджер дублирует события.' },
              { icon: ShieldCheck, title: 'Страхование груза', text: 'Оформляем страховку на полную стоимость партии на всех этапах: склад — аэропорт — перелёт — доставка.' },
              { icon: FileCheck2, title: 'Таможенное оформление', text: 'Экспортная декларация в КНР, подготовка инвойса и пакинг-листа, импортный выпуск (ДТ) в России — под ключ.' },
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2.5 hover:border-violet-300 hover:shadow-md transition-all">
                <div className="bg-violet-50 rounded-xl p-2.5 w-fit">
                  <c.icon className="w-5 h-5 text-violet-600" />
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
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Сроки экспресс-доставки: от приёмки до двери</h2>
            <p className="text-sm text-slate-500">Полный цикл — 5–12 дней от момента приёмки на складе в Гуанчжоу</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {[
              { day: 'День 0–1', title: 'Приёмка на складе', text: 'Груз принимается на складе в Гуанчжоу: взвешивание, обмер габаритов, сверка с инвойсом.' },
              { day: 'День 1–2', title: 'Консолидация и упаковка', text: 'Объединяем места в одну партию, упаковываем под авиаперевозку, оформляем авианакладную (AWB).' },
              { day: 'День 2–3', title: 'Экспортное оформление', text: 'Экспортная декларация, таможенное оформление КНР, досмотр и передача авиакомпании.' },
              { day: 'День 3–8', title: 'Авиаперевозка', text: 'Вылет из CAN/SZX/PEK/PVG прямым или стыковочным рейсом. Груз в пути — статус виден в ЛК.' },
              { day: 'День 8–12', title: 'Выпуск и доставка до двери', text: 'Импортный выпуск в РФ и курьерская доставка до двери получателя.' },
            ].map((s, i) => (
              <div key={i} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                <div className="text-[11px] font-black uppercase tracking-wider text-violet-600">{s.day}</div>
                <div className="font-bold text-slate-900 text-sm">{s.title}</div>
                <div className="text-xs text-slate-600 leading-relaxed">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img src="/air/air-terminal.webp" alt="Загрузка паллет в грузовой отсек самолёта" className="w-full h-48 sm:h-64 object-cover" loading="lazy" />
          </div>
        </section>

        {/* ================= КАК НАЧАТЬ (без тарифов) ================= */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Три способа начать работу</h2>
            <p className="text-sm text-slate-500">Точная ставка зависит от веса, габаритов и срочности — выберите удобный способ её узнать</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 flex flex-col hover:border-violet-300 hover:shadow-md transition-all">
              <div className="bg-violet-50 rounded-xl p-2.5 w-fit">
                <Send className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Оставить заявку</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                Опишите груз — менеджер подберёт маршрут, посчитает сроки и пришлёт точный расчёт в течение рабочего дня.
              </p>
              <button
                onClick={scrollToForm}
                className="w-full font-bold px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer text-sm"
              >
                Оставить заявку
              </button>
            </div>

            <div className="relative bg-gradient-to-b from-violet-50/80 to-white rounded-3xl border border-violet-400 p-6 space-y-4 flex flex-col shadow-lg shadow-violet-600/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow-md">
                Быстрее всего
              </div>
              <div className="bg-violet-100 rounded-xl p-2.5 w-fit">
                <Search className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Найти тариф онлайн</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                Посмотрите ориентировочные ставки по видам доставки и сравните варианты в онлайн-калькуляторе тарифов.
              </p>
              <button
                onClick={() => onNavigate('/online-tariffs')}
                className="w-full font-bold px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-md shadow-violet-600/25 transition-all cursor-pointer text-sm"
              >
                Перейти к тарифам
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 flex flex-col hover:border-violet-300 hover:shadow-md transition-all">
              <div className="bg-violet-50 rounded-xl p-2.5 w-fit">
                <UserPlus className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Регистрация в личном кабинете</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                Зарегистрируйтесь в ЛК, чтобы отслеживать грузы, загружать инвойсы и видеть статусы поставок в реальном времени.
              </p>
              <a
                href={CABINET_REGISTRATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center font-bold px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 transition-all cursor-pointer text-sm"
              >
                Регистрация
              </a>
            </div>
          </div>
        </section>

        {/* ================= МАРШРУТЫ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-xl p-2.5 shrink-0">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Маршруты экспресс-доставки из Китая</h2>
              <p className="text-sm text-slate-500 mt-1">Прямые и стыковочные рейсы — оптимальный маршрут подбираем под каждую партию</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { from: 'Гуанчжоу', code: 'CAN', to: 'Москва (SVO / DME)', days: '5–8 дней', note: 'Ближайший к нашему складу аэропорт вылета' },
              { from: 'Шэньчжэнь', code: 'SZX', to: 'Москва (SVO / DME)', days: '6–9 дней', note: 'Для товаров из Гуандуна и электроники' },
              { from: 'Пекин', code: 'PEK', to: 'Москва (SVO / DME)', days: '5–8 дней', note: 'Для партий с севера Китая' },
              { from: 'Шанхай', code: 'PVG', to: 'Москва (SVO / DME)', days: '6–10 дней', note: 'Крупнейший карго-хаб восточного Китая' },
            ].map((r, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3.5">
                <div className="bg-blue-600 text-white font-black text-xs rounded-lg px-2 py-1.5 shrink-0 w-12 text-center">{r.code}</div>
                <div className="space-y-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">{r.from} → {r.to}</div>
                  <div className="text-xs font-semibold text-violet-600">{r.days}</div>
                  <div className="text-[11px] text-slate-500 leading-snug">{r.note}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
            <MapPin className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              По России доставляем курьером до двери из Москвы: Санкт-Петербург, Казань, Екатеринбург, Новосибирск и другие города — экспресс-службами и магистральными перевозками.
            </p>
          </div>
        </section>

        {/* ================= ЧТО ВЕЗЁМ ================= */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Какие грузы едут экспрессом</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Образцы для сертификации', 'Документы и печатная продукция', 'Электроника и аксессуары',
              'Запчасти и комплектующие', 'Одежда и текстиль', 'Медицинские изделия',
              'Товары для маркетплейсов', 'Мелкие партии опта',
            ].map(g => (
              <span key={g} className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-violet-300 transition-colors">{g}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <PackageCheck className="w-5 h-5 text-amber-600 shrink-0" />
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
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Частые вопросы об экспресс-доставке</h2>
          {[
            { q: 'Чем экспресс-доставка отличается от обычной авиа?', a: 'Экспресс — это приоритетная обработка: место бронируется на ближайшем рейсе, партия обрабатывается вне очереди, выпуск ускоряется, а доставка идёт курьером до двери. Сроки — 5–12 дней против 9–18 дней у обычной авиадоставки.' },
            { q: 'Какой минимальный вес отправки?', a: 'Работаем с партиями от 1 кг. Мелкие посылки и образцы консолидируем на складе в Гуанчжоу в одну отправку, чтобы не переплачивать за каждое место отдельно.' },
            { q: 'Можно ли отправить товар с батареями?', a: 'Да. Литий-ионные грузы перевозятся по регламенту IATA DGR. Нам нужны паспорт безопасности (MSDS) и протокол испытаний UN 38.3 — дальше оформляем и согласовываем с авиакомпанией.' },
            { q: 'Как отслеживать груз в пути?', a: 'После бронирования вы получаете трек-номер. Статусы — «принят на складе», «вылетел», «прибыл», «выпущен» — видны в личном кабинете, а менеджер присылает уведомления о ключевых событиях.' },
          ].map((f, i) => (
            <details key={i} className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 open:bg-white open:border-violet-200 transition-colors">
              <summary className="cursor-pointer list-none font-bold text-slate-900 text-sm flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-violet-600 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </section>

        {/* ================= ФОРМА ================= */}
        <section id="express-lead-form" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Рассчитайте экспресс-доставку вашего груза</h2>
              <p className="text-sm text-slate-500">
                Оставьте заявку — менеджер подберёт рейс, посчитает сроки и пришлёт точный расчёт в течение рабочего дня.
              </p>
            </div>
            <LeadForm initialRequestType={EXPRESS_REQUEST} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-4">
              <h3 className="font-bold text-lg">Срочный вопрос?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Напишите в мессенджер — дежурный менеджер на связи и подскажет по срокам и ставкам.
              </p>
              <div className="space-y-2.5">
                <a href="tel:+78005559425" className="flex items-center gap-2.5 text-sm font-bold hover:text-violet-300 transition-colors">
                  <Phone className="w-4 h-4 text-violet-400" /> 8 (800) 555-94-25
                </a>
                <a href="https://wa.me/79282568263" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-violet-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px]">WA</span> WhatsApp
                </a>
                <a href="https://t.me/ExpressTodayHelp_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-violet-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[9px]">TG</span> Telegram
                </a>
              </div>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-violet-900 text-sm">
                <ShieldCheck className="w-5 h-5 text-violet-600" />
                Работаем официально
              </div>
              <p className="text-xs text-violet-900/80 leading-relaxed">
                ООО «Экспресс-тудей» · склад в Гуанчжоу 2000 м² · полный пакет документов по каждой отправке: авианакладная (AWB), инвойс, пакинг-лист, ДТ.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SEO-ТЕКСТ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Экспресс-доставка из Китая: как устроена срочная перевозка
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Экспресс-доставка из Китая — это срочная перевозка малых партий, образцов и документов, когда груз нужен
            «ещё вчера»: приёмка на складе, ближайший авиарейс, приоритетная обработка и доставка курьером до двери.
            Полный цикл занимает 5–12 дней, а главное преимущество формата — предсказуемость сроков и минимум перегрузок
            в пути.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Какие грузы выгодно везти экспрессом</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">образцы для сертификации и испытаний</strong> — когда от скорости зависит запуск партии;</li>
            <li><strong className="text-slate-900">документы и печатная продукция</strong>;</li>
            <li><strong className="text-slate-900">электроника и аксессуары</strong> — компактные и дорогие позиции;</li>
            <li><strong className="text-slate-900">запчасти и комплектующие</strong>, от которых зависит производственный цикл;</li>
            <li><strong className="text-slate-900">мелкие партии опта и товары для маркетплейсов</strong> перед акциями и распродажами.</li>
          </ul>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Тяжёлые и объёмные грузы — мебель, станки, упаковку — дешевле везти{' '}
            <a href="/dostavka" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka'); }} className="text-violet-600 font-semibold hover:underline">авто или по железной дороге</a>:
            на них экспресс-тариф съест всю маржу.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">От чего зависит стоимость экспресс-перевозки</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">оплачиваемый вес</strong> — большее из фактического и объёмного веса груза;</li>
            <li><strong className="text-slate-900">плотность груза</strong> — чем компактнее партия, тем дешевле обходится килограмм;</li>
            <li><strong className="text-slate-900">срочность</strong> — ближайший рейс и приоритетная обработка стоят дороже;</li>
            <li><strong className="text-slate-900">сезонность</strong> — перед китайским Новым годом и в конце года ставки растут;</li>
            <li><strong className="text-slate-900">дополнительные услуги</strong> — таможенное оформление, страхование, доставка до двери.</li>
          </ul>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Поэтому точную цену можно назвать только по параметрам конкретной партии — менеджер Express Today рассчитывает
            её в течение одного рабочего дня. Ориентировочные ставки по видам доставки доступны в{' '}
            <a href="/online-tariffs" onClick={(e) => { e.preventDefault(); onNavigate('/online-tariffs'); }} className="text-violet-600 font-semibold hover:underline">онлайн-калькуляторе тарифов</a>.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Кому подходит экспресс-доставка из Китая</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700 leading-relaxed">
            <li><strong className="text-slate-900">Импортёрам и оптовикам</strong> — для срочных дозаказов ходового товара;</li>
            <li><strong className="text-slate-900">Селлерам маркетплейсов</strong> (Wildberries, Ozon, Яндекс.Маркет) — для быстрого пополнения стока;</li>
            <li><strong className="text-slate-900">Производителям</strong> — для запчастей и оснастки, от которых зависит производство;</li>
            <li><strong className="text-slate-900">Всем, кто везёт образцы и документы</strong> или единичные ценные позиции.</li>
          </ul>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Как проходит перевозка</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Партия принимается на{' '}
            <a href="/konsolidaciya-tovara-v-kitaye" onClick={(e) => { e.preventDefault(); onNavigate('/konsolidaciya-tovara-v-kitaye'); }} className="text-violet-600 font-semibold hover:underline">складе консолидации в Гуанчжоу</a>,
            взвешивается и обмеряется, оформляется авианакладная (AWB). После экспортного оформления в КНР груз улетает
            рейсом из Гуанчжоу, Шэньчжэня, Пекина или Шанхая в Москву, проходит импортный выпуск и доставляется курьером
            до двери. Статусы каждого этапа видны в личном кабинете, а менеджер дублирует ключевые события в мессенджере.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Что входит в экспресс-доставку</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            В услугу входят приёмка и обмер на складе, консолидация мест, экспортное оформление в КНР, авианакладная (AWB),
            перевозка до Москвы, импортный выпуск и курьерская доставка до двери. Отдельно по желанию оформляются страхование
            груза, таможенное оформление с полным пакетом документов и доставка по России в регионы.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Экспресс, авиа или карго: как выбрать</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Экспресс — про максимальную скорость малых партий: ближайший рейс, приоритетная обработка, доставка до двери.
            Обычная{' '}
            <a href="/dostavka-avia-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-avia-iz-kitaja'); }} className="text-violet-600 font-semibold hover:underline">авиадоставка</a> — для
            регулярных партий, где важна скорость, но можно подождать ближайший свободный борт.{' '}
            <a href="/kargo-dostavka-iz-kitaia" onClick={(e) => { e.preventDefault(); onNavigate('/kargo-dostavka-iz-kitaia'); }} className="text-violet-600 font-semibold hover:underline">Карго-доставка</a> — про
            экономию на больших и плотных партиях, когда сроки позволяют подождать. Часто выгодно комбинировать: регулярные
            поставки вести карго, а срочные дозаказы — экспрессом. Оставьте заявку в форме или найдите тариф онлайн — расчёт
            и рекомендация по схеме будут готовы в течение рабочего дня.
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
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-violet-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </a>
      </div>
    </div>
  );
};

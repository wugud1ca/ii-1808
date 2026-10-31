import React from 'react';
import {
  ArrowLeft, ShieldCheck, Phone, TrendingUp, Route, MapPin,
  PackageCheck, Clock3, BadgeCheck, Boxes,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';
import { SeoLandingData, Accent } from '../../data/seoLandingData';

interface SeoLandingPageProps {
  data: SeoLandingData;
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const CABINET_REGISTRATION_URL = 'https://my.express-today.ru/registration';

type AccentStyles = {
  badge: string;
  badgeIcon: string;
  btn: string;
  iconBox: string;
  iconText: string;
  headingBox: string;
  headingText: string;
  accentText: string;
  cardHover: string;
  faqOpen: string;
  statIcon: string;
  chipHover: string;
  backHover: string;
};

const ACCENTS: Record<Accent, AccentStyles> = {
  orange: {
    badge: 'bg-orange-500/15 border-orange-400/40 text-orange-300',
    badgeIcon: 'text-orange-400',
    btn: 'from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-900/40',
    iconBox: 'bg-orange-50',
    iconText: 'text-orange-600',
    headingBox: 'bg-orange-100',
    headingText: 'text-orange-600',
    accentText: 'text-orange-600',
    cardHover: 'hover:border-orange-300',
    faqOpen: 'open:border-orange-200',
    statIcon: 'text-orange-400',
    chipHover: 'hover:border-orange-300',
    backHover: 'hover:text-orange-600',
  },
  violet: {
    badge: 'bg-violet-500/15 border-violet-400/40 text-violet-300',
    badgeIcon: 'text-violet-400',
    btn: 'from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-900/40',
    iconBox: 'bg-violet-50',
    iconText: 'text-violet-600',
    headingBox: 'bg-violet-100',
    headingText: 'text-violet-600',
    accentText: 'text-violet-600',
    cardHover: 'hover:border-violet-300',
    faqOpen: 'open:border-violet-200',
    statIcon: 'text-violet-400',
    chipHover: 'hover:border-violet-300',
    backHover: 'hover:text-violet-600',
  },
  emerald: {
    badge: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
    badgeIcon: 'text-emerald-400',
    btn: 'from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40',
    iconBox: 'bg-emerald-50',
    iconText: 'text-emerald-600',
    headingBox: 'bg-emerald-100',
    headingText: 'text-emerald-600',
    accentText: 'text-emerald-600',
    cardHover: 'hover:border-emerald-300',
    faqOpen: 'open:border-emerald-200',
    statIcon: 'text-emerald-400',
    chipHover: 'hover:border-emerald-300',
    backHover: 'hover:text-emerald-600',
  },
  sky: {
    badge: 'bg-sky-500/15 border-sky-400/40 text-sky-300',
    badgeIcon: 'text-sky-400',
    btn: 'from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-sky-900/40',
    iconBox: 'bg-sky-50',
    iconText: 'text-sky-600',
    headingBox: 'bg-sky-100',
    headingText: 'text-sky-600',
    accentText: 'text-sky-600',
    cardHover: 'hover:border-sky-300',
    faqOpen: 'open:border-sky-200',
    statIcon: 'text-sky-400',
    chipHover: 'hover:border-sky-300',
    backHover: 'hover:text-sky-600',
  },
  rose: {
    badge: 'bg-rose-500/15 border-rose-400/40 text-rose-300',
    badgeIcon: 'text-rose-400',
    btn: 'from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-900/40',
    iconBox: 'bg-rose-50',
    iconText: 'text-rose-600',
    headingBox: 'bg-rose-100',
    headingText: 'text-rose-600',
    accentText: 'text-rose-600',
    cardHover: 'hover:border-rose-300',
    faqOpen: 'open:border-rose-200',
    statIcon: 'text-rose-400',
    chipHover: 'hover:border-rose-300',
    backHover: 'hover:text-rose-600',
  },
  indigo: {
    badge: 'bg-indigo-500/15 border-indigo-400/40 text-indigo-300',
    badgeIcon: 'text-indigo-400',
    btn: 'from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-900/40',
    iconBox: 'bg-indigo-50',
    iconText: 'text-indigo-600',
    headingBox: 'bg-indigo-100',
    headingText: 'text-indigo-600',
    accentText: 'text-indigo-600',
    cardHover: 'hover:border-indigo-300',
    faqOpen: 'open:border-indigo-200',
    statIcon: 'text-indigo-400',
    chipHover: 'hover:border-indigo-300',
    backHover: 'hover:text-indigo-600',
  },
  amber: {
    badge: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
    badgeIcon: 'text-amber-400',
    btn: 'from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/40',
    iconBox: 'bg-amber-50',
    iconText: 'text-amber-600',
    headingBox: 'bg-amber-100',
    headingText: 'text-amber-600',
    accentText: 'text-amber-600',
    cardHover: 'hover:border-amber-300',
    faqOpen: 'open:border-amber-200',
    statIcon: 'text-amber-400',
    chipHover: 'hover:border-amber-300',
    backHover: 'hover:text-amber-600',
  },
  blue: {
    badge: 'bg-blue-500/15 border-blue-400/40 text-blue-300',
    badgeIcon: 'text-blue-400',
    btn: 'from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 shadow-blue-900/40',
    iconBox: 'bg-blue-50',
    iconText: 'text-blue-600',
    headingBox: 'bg-blue-100',
    headingText: 'text-blue-600',
    accentText: 'text-blue-600',
    cardHover: 'hover:border-blue-300',
    faqOpen: 'open:border-blue-200',
    statIcon: 'text-blue-400',
    chipHover: 'hover:border-blue-300',
    backHover: 'hover:text-blue-600',
  },
};

export const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ data, onNavigate, onOpenLeadModal }) => {
  const a = ACCENTS[data.accent] || ACCENTS.orange;
  const isArticle = data.kind === 'article';
  const isCity = data.kind === 'city';

  const scrollToForm = () => {
    const el = document.getElementById('seo-landing-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 pb-4">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {data.heroImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(100deg, rgba(2,6,23,0.88) 8%, rgba(2,6,23,0.72) 45%, rgba(2,6,23,0.38) 100%), url(${data.heroImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
        )}
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-7">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-semibold uppercase tracking-wider text-xs sm:text-sm backdrop-blur-sm ${a.badge}`}>
            <Boxes className={`w-4 h-4 ${a.badgeIcon}`} />
            <span>{data.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl">{data.h1}</h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">{data.subtitle}</p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToForm}
              className={`bg-gradient-to-r text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer text-sm ${a.btn}`}
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

          {data.stats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl pt-2">
              {data.stats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex items-start gap-3">
                  {i === 0 ? <Clock3 className={`w-5 h-5 shrink-0 ${a.statIcon}`} /> : <BadgeCheck className={`w-5 h-5 shrink-0 ${a.statIcon}`} />}
                  <div>
                    <div className="text-white font-black text-sm sm:text-base leading-tight">{s.value}</div>
                    <div className="text-slate-300 text-[11px] sm:text-xs mt-0.5">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* ================= УТП ================= */}
        {data.usp.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-start gap-3">
              <div className={`rounded-xl p-2.5 shrink-0 ${a.headingBox}`}>
                <TrendingUp className={`w-6 h-6 ${a.headingText}`} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Почему Express Today</h2>
                <p className="text-sm text-slate-500 mt-1">Полный цикл — от выкупа до доставки на ваш склад</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.usp.map((c, i) => (
                <div key={i} className={`bg-white rounded-3xl border border-slate-200 p-5 space-y-2.5 transition-all ${a.cardHover} hover:shadow-md`}>
                  <div className={`rounded-xl p-2.5 w-fit ${a.iconBox}`}>
                    <PackageCheck className={`w-5 h-5 ${a.iconText}`} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= СРОКИ ================= */}
        {data.timeline && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Как проходит доставка</h2>
              <p className="text-sm text-slate-500">Полный цикл — от заявки до выдачи груза</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {data.timeline.map((s, i) => (
                <div key={i} className="relative bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1.5">
                  <div className={`text-[11px] font-black uppercase tracking-wider ${a.accentText}`}>{s.day}</div>
                  <div className="font-bold text-slate-900 text-sm">{s.title}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{s.text}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= МАРШРУТЫ ================= */}
        {data.routes && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-xl p-2.5 shrink-0">
                <Route className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Маршруты доставки</h2>
                <p className="text-sm text-slate-500 mt-1">Оптимальный маршрут подбираем под каждую партию</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.routes.map((r, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3.5">
                  <div className="bg-blue-600 text-white font-black text-xs rounded-lg px-2 py-1.5 shrink-0 w-12 text-center">{r.code}</div>
                  <div className="space-y-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm">{r.from} → {r.to}</div>
                    <div className={`text-xs font-semibold ${a.accentText}`}>{r.days}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{r.note}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${a.accentText}`} />
              <p className="text-xs text-slate-600 leading-relaxed">
                Доставляем по России из Москвы до склада получателя: Санкт-Петербург, Казань, Екатеринбург, Новосибирск и другие города — магистральными перевозками или экспресс-службами.
              </p>
            </div>
          </section>
        )}

        {/* ================= ЧТО ВЕЗЁМ ================= */}
        {data.cargo && (
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Какие грузы возим</h2>
            <div className="flex flex-wrap gap-2">
              {data.cargo.map(g => (
                <span key={g} className={`text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full bg-white border border-slate-200 text-slate-700 transition-colors ${a.chipHover}`}>{g}</span>
              ))}
            </div>
          </section>
        )}

        {/* ================= FAQ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Частые вопросы</h2>
          {data.faq.map((f, i) => (
            <details key={i} className={`group bg-slate-50 border border-slate-100 rounded-2xl p-4 open:bg-white transition-colors ${a.faqOpen}`}>
              <summary className="cursor-pointer list-none font-bold text-slate-900 text-sm flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className={`text-lg leading-none group-open:rotate-45 transition-transform ${a.accentText}`}>+</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </section>

        {/* ================= ФОРМА ================= */}
        <section id="seo-landing-form" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{data.formTitle}</h2>
              <p className="text-sm text-slate-500">{data.formSubtitle}</p>
            </div>
            <LeadForm initialRequestType={data.requestType} />
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
            <div className={`border rounded-3xl p-5 space-y-2 ${a.iconBox}`}>
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className={`w-5 h-5 ${a.iconText}`} />
                Работаем официально
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ООО «Экспресс-тудей» · склад в Гуанчжоу 2000 м² · полный пакет документов по каждой отправке: ДТ (ГТД), инвойс, пакинг-лист.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SEO-ТЕКСТ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{data.seoH2}</h2>
          {data.seoText.map((p, i) => (
            <p key={i} className="text-sm sm:text-base text-slate-700 leading-relaxed">{p}</p>
          ))}
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Оставьте заявку в форме выше или{' '}
            <a href="/online-tariffs" onClick={(e) => { e.preventDefault(); onNavigate('/online-tariffs'); }} className={`font-semibold hover:underline ${a.accentText}`}>
              найдите тариф онлайн
            </a>{' '}
            — расчёт и рекомендация по схеме будут готовы в течение рабочего дня.
          </p>
        </section>

        {/* ================= АТРИБУЦИЯ ФОТО ================= */}
        {data.attribution && (
          <p className="text-[11px] text-slate-400 leading-relaxed">{data.attribution}</p>
        )}

        {/* ================= НАЗАД ================= */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
          className={`inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors cursor-pointer ${a.backHover}`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </a>
      </div>
    </div>
  );
};

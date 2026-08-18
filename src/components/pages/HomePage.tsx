import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  ShoppingBag, 
  PackageCheck, 
  Calculator as CalcIcon, 
  FileCheck2, 
  Store, 
  Container, 
  Globe2, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ChevronDown,
  ExternalLink,
  MapPin,
  Clock,
  Layers,
  Truck,
  Box,
  ChevronRight
} from 'lucide-react';
import { siteConfig, customerScenarios, coreServices, deliveryMethods, faqList } from '../../siteConfig';
import { CabinetWalkthrough } from '../common/CabinetWalkthrough';
import { CabinetVideoShowcase } from '../common/CabinetVideoShowcase';
import { TrackingWidget } from '../common/TrackingWidget';
import { CalculatorWidget } from '../common/CalculatorWidget';
import { OfficialLegalEntitySection } from '../home/OfficialLegalEntitySection';
import { trackEvent } from '../../utils/analytics';

interface HomePageProps {
  onOpenLeadModal: (requestType?: string) => void;
  onNavigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenLeadModal, onNavigate }) => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search className="w-5 h-5 text-blue-600" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
      case 'PackageCheck': return <PackageCheck className="w-5 h-5 text-indigo-600" />;
      case 'Calculator': return <CalcIcon className="w-5 h-5 text-purple-600" />;
      case 'FileCheck2': return <FileCheck2 className="w-5 h-5 text-blue-600" />;
      case 'Store': return <Store className="w-5 h-5 text-amber-600" />;
      case 'Container': return <Container className="w-5 h-5 text-teal-600" />;
      case 'Globe2': return <Globe2 className="w-5 h-5 text-amber-600" />;
      default: return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200/60">
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-10">
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            
            {/* Eyebrow & Platform Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              {/* Main Service Process Pill with orange dot */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 border border-orange-200 text-orange-950 text-xs font-bold uppercase tracking-wider shadow-xs animate-in fade-in duration-300">
                <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse"></span>
                <span>Выкуп · проверка · консолидация · доставка</span>
              </div>

              {/* 1688 Badge */}
              <button
                onClick={() => onNavigate('/vikup-1688-alibaba')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-300 text-slate-900 text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95 group"
                title="Оптовый выкуп с 1688.com"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="group-hover:text-orange-600 transition-colors">1688</span>
              </button>

              {/* ALIBABA Badge */}
              <button
                onClick={() => onNavigate('/vikup-1688-alibaba')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-300 text-slate-900 text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95 group"
                title="Оптовый выкуп с Alibaba.com"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="group-hover:text-orange-600 transition-colors">ALIBABA</span>
              </button>

              {/* POIZON Badge */}
              <button
                onClick={() => onNavigate('/vikup-poizon-tmall-taobao')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 text-slate-900 text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95 group"
                title="Выкуп с POIZON (Dewu)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="group-hover:text-emerald-600 transition-colors">POIZON</span>
              </button>

              {/* TMALL Badge */}
              <button
                onClick={() => onNavigate('/vikup-poizon-tmall-taobao')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-red-300 text-slate-900 text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95 group"
                title="Выкуп с TMALL.com"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="group-hover:text-red-600 transition-colors">TMALL</span>
              </button>

              {/* TAOBAO Badge */}
              <button
                onClick={() => onNavigate('/vikup-poizon-tmall-taobao')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-orange-300 text-slate-900 text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all cursor-pointer active:scale-95 group"
                title="Выкуп с TAOBAO.com"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="group-hover:text-orange-600 transition-colors">TAOBAO</span>
              </button>
            </div>

            {/* H1 Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
              Доставка и выкуп товаров из Китая <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-orange-600 to-amber-600">для бизнеса</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              От первой закупки до генерального груза - с заботой персонального менеджера.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onOpenLeadModal('Рассчитать поставку из первого экрана');
                  trackEvent('lead_start', { source: 'hero_primary' });
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-base px-8 py-4 rounded-2xl shadow-xl shadow-orange-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Рассчитать поставку</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href={siteConfig.clientCabinet.loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-base px-7 py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Войти в личный кабинет</span>
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </a>
            </div>

            {/* Trust Block - 4 Interactive Facts */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-6">
              <div 
                onClick={() => onNavigate('/vikup-tovara-iz-kitaya')}
                className="bg-white/90 hover:bg-orange-50/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 hover:border-orange-400 shadow-xs hover:shadow-md text-left space-y-1 transition-all cursor-pointer active:scale-98 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Выкуп за 24 часа</div>
                <div className="text-sm text-slate-600">После подтверждения оплаты</div>
              </div>

              <div 
                onClick={() => onNavigate('/konsolidaciya-tovara-v-kitaye')}
                className="bg-white/90 hover:bg-orange-50/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 hover:border-orange-400 shadow-xs hover:shadow-md text-left space-y-1 transition-all cursor-pointer active:scale-98 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 group-hover:bg-orange-200 text-orange-700 flex items-center justify-center transition-colors">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Фото, вес и объем в ЛК</div>
                <div className="text-sm text-slate-600">Точные замеры со склада КНР</div>
              </div>

              <div 
                onClick={() => {
                  const elem = document.getElementById('cabinet-video-showcase');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/90 hover:bg-orange-50/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 hover:border-orange-400 shadow-xs hover:shadow-md text-left space-y-1 transition-all cursor-pointer active:scale-98 group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Консолидация заказов</div>
                <div className="text-sm text-slate-600">Сбор от разных поставщиков</div>
              </div>

              <div 
                onClick={() => {
                  const elem = document.getElementById('tracking');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white/90 hover:bg-orange-50/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 hover:border-orange-400 shadow-xs hover:shadow-md text-left space-y-1 transition-all cursor-pointer active:scale-98 group"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 group-hover:bg-orange-200 text-orange-700 flex items-center justify-center transition-colors">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">Прозрачный трекинг</div>
                <div className="text-sm text-slate-600">Все этапы пути в реальном времени</div>
              </div>
            </div>

            {/* Compact Anchor Widget: "Уже есть накладная?" */}
            <div className="pt-2">
              <a
                href="#tracking"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-orange-50 text-slate-800 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 transition-colors cursor-pointer"
              >
                <span>Уже есть накладная? Перейти к отслеживанию</span>
                <ChevronDown className="w-4 h-4 text-orange-600 animate-bounce" />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* Customer Scenario Selector ("Какая задача у вас сейчас?") */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="text-sm font-bold uppercase tracking-wider text-orange-600 mb-1">Сценарии решения</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Какая задача у вас сейчас?</h2>
            </div>
            <p className="text-sm text-slate-600 max-w-md">
              Выберите ваше направление — система предзаполнит нужные данные для мгновенного ответа
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {customerScenarios.map(scen => (
              <div
                key={scen.id}
                onClick={() => {
                  trackEvent('select_request_type', { requestType: scen.requestType });
                  if (scen.targetSlug && scen.targetSlug !== '/raschet-stoimosti-dostavki-gruza-iz-kitaja') {
                    onNavigate(scen.targetSlug);
                  } else {
                    onOpenLeadModal(scen.requestType);
                  }
                }}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-orange-400 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-orange-50 flex items-center justify-center transition-colors">
                      {getScenarioIcon(scen.iconName)}
                    </div>
                    {scen.badge && (
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-orange-100 group-hover:text-orange-900 transition-colors">
                        {scen.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition-colors">
                    {scen.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {scen.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
                  <span>Выбрать сценарий</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* How It Works - 6-Step Workflow Schema */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 text-slate-900 rounded-3xl p-6 sm:p-12 border border-orange-200/80 space-y-8 shadow-xl">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-sm font-bold uppercase tracking-wider text-orange-600">Прозрачный процесс</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">Как мы работаем</h2>
            <p className="text-sm sm:text-base text-slate-600">
              Понятные 6 шагов от первого обращения до получения партии груза
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Заявка и расчет', text: 'Оставляете заявку, ссылку на товар или инвойс поставщика. Менеджер производит расчет.' },
              { num: '02', title: 'Уточнение деталей', text: 'Согласуем категорию товара, объемы, требуемые документы и тип транспортировки.' },
              { num: '03', title: 'Выкуп или приемка', text: 'Выкупаем за 24ч или принимаем партию от вашей фабрики на складе в Гуанчжоу.' },
              { num: '04', title: 'Проверка и упаковка', text: 'Проверяем брак, делаем фотоотчет в ЛК, упаковываем в жесткую обрешетку.' },
              { num: '05', title: 'Международная доставка', text: 'Отправляем груз выбранным маршрутом с полным отслеживанием на пути в РФ.' },
              { num: '06', title: 'Получение в России', text: 'Выдача со склада в Москве, отправка через ТК в ваш город или доставка на маркетплейс.' },
            ].map(step => (
              <div key={step.num} className="bg-white rounded-2xl p-5 border border-orange-200/80 shadow-sm hover:shadow-md transition-shadow space-y-2 relative">
                <div className="text-3xl font-black text-orange-600 font-mono">{step.num}</div>
                <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Official Chinese Legal Entity Block ("Мы работаем официально") */}
      <OfficialLegalEntitySection onOpenLeadModal={onOpenLeadModal} />

      {/* Core Services Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="text-sm font-bold uppercase tracking-wider text-orange-600">Наши возможности</div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Комплексные логистические услуги</h2>
            <p className="text-sm sm:text-base text-slate-600">
              Сопровождаем цепочку поставок от поиска фабрики в КНР до выдачи товара на складе в РФ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreServices.map(srv => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Box className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">{srv.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{srv.shortDesc}</p>

                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {srv.features.map((feat, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigate(`/${srv.slug}`)}
                    className="w-full bg-slate-100 hover:bg-orange-600 hover:text-white text-slate-800 font-semibold text-sm py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Подробнее об услуге</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Dedicated Video Showcase for LK Consolidation & Shipping */}
      <div id="cabinet-video-showcase">
        <CabinetVideoShowcase onOpenLeadModal={onOpenLeadModal} />
      </div>

      {/* Client Cabinet Walkthrough Component */}
      <CabinetWalkthrough />

      {/* Independent Tracking Module Anchor */}
      <div className="max-w-7xl mx-auto px-4">
        <TrackingWidget />
      </div>

      {/* Delivery Calculator Widget */}
      <section className="max-w-7xl mx-auto px-4">
        <CalculatorWidget onOpenLeadModal={onOpenLeadModal} />
      </section>

      {/* Trust & Searchable FAQ Accordions */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Вопросы и ответы</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">Ответы на частые вопросы</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Подробная информация о выкупе, складе в КНР, проверке и получении
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqList.map(faq => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-4 sm:p-5 font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:text-blue-600"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${openFaqId === faq.id ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {openFaqId === faq.id && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ShieldCheck, Building2, Globe2, Navigation, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { LeadForm } from '../common/LeadForm';

const YandexMapConstructor: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Reset container contents
    container.innerHTML = '';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.async = true;
    script.src =
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Aa0cf1eb81f6b39fdbe1e6f06397347cca88733eeca29a54ea5a905b42fc8bd54&width=100%25&height=495&lang=ru_RU&scroll=true';

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
      <div 
        ref={mapContainerRef} 
        className="w-full min-h-[380px] sm:min-h-[495px] flex items-center justify-center text-slate-400 text-sm"
      >
        <span className="animate-pulse flex items-center gap-2">
          <MapPin className="w-4 h-4 text-orange-500 animate-bounce" />
          <span>Загрузка интерактивной карты офисов...</span>
        </span>
      </div>
    </div>
  );
};

export const ContactsPage: React.FC = () => {
  const offices = siteConfig.russianOffices || [
    { city: 'Москва', address: 'пер. Огородная Слобода, 5А, оф. 205' },
    { city: 'Санкт-Петербург', address: 'Петроградская наб., 18, оф. 27' },
    { city: 'Краснодар', address: 'Пушкина 2, оф. 6' },
    { city: 'Новосибирск', address: 'ул. Фрунзе, 5, оф. 311' },
    { city: 'Хабаровск', address: 'ул. Карла Маркса, 96А, оф. 77' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-950 text-sm font-bold uppercase tracking-wider">
          <Building2 className="w-4 h-4 text-orange-600" />
          <span>Контакты и офисы</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">Свяжитесь с нами</h1>
        <p className="text-sm sm:text-base text-slate-600">
          Мы всегда на связи для расчета поставок, выкупа, проверки и логистических консультаций по Китаю и всему миру
        </p>
      </div>

      {/* Main Grid: Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Expanded Russian Offices Block */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">Офисы и филиалы в России</h3>
                  <p className="text-xs text-slate-500">Прием клиентов, оформление договоров, выдача образцов</p>
                </div>
              </div>
              <a
                href={siteConfig.phone.mainHref}
                className="inline-flex items-center gap-1.5 font-extrabold text-slate-900 hover:text-orange-600 text-sm sm:text-base transition-colors shrink-0"
              >
                <Phone className="w-4 h-4 text-orange-500" />
                <span>{siteConfig.phone.mainDisplay}</span>
              </a>
            </div>

            {/* List of 5 Offices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {offices.map((off, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-2xl border transition-all ${
                    idx === 0 
                      ? 'bg-orange-50/50 border-orange-200 sm:col-span-2' 
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <Navigation className={`w-4 h-4 mt-0.5 shrink-0 ${idx === 0 ? 'text-orange-600' : 'text-slate-400'}`} />
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>{off.city}</span>
                        {idx === 0 && (
                          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                            Центральный офис
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{off.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 65 Cities Nationwide Coverage Badge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-orange-50 border border-blue-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900">Широкая география:</span> также имеем официальные{' '}
                <span className="font-extrabold text-blue-700">представительства и пункты выдачи в 65 городах России</span> для оперативной выдачи и забора сборных грузов.
              </div>
            </div>
          </div>

          {/* International Branch & China Warehouse Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* International Branch */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Международный отдел</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Выкуп, оплата инвойсов в юанях/долларах и доставка товаров по всему миру (КНР, Турция, ОАЭ, Азия).
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-sm">
                <div className="text-xs text-slate-500">Горячая линия ВЭД:</div>
                <a href={siteConfig.phone.mainHref} className="font-bold text-slate-900 hover:text-orange-600 block text-sm sm:text-base">
                  {siteConfig.phone.mainDisplay}
                </a>
              </div>
            </div>

            {/* Warehouse Guangzhou */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Склад в Гуанчжоу</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Консолидация, фотофиксация, проверка брака и деревянная обрешетка 6 дней в неделю.
              </p>
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 font-mono truncate" title={siteConfig.chinaWarehouse}>
                {siteConfig.chinaWarehouse}
              </div>
            </div>

          </div>

          {/* Corporate Messengers Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <span>Быстрая связь в мессенджерах и чат-ботах</span>
            </h3>
            <p className="text-sm text-slate-600">
              Выберите удобный мессенджер для оперативного расчета стоимости, отправки ссылок или консультаций:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={siteConfig.social.max}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-sm border border-purple-200 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Чат MAX</span>
              </a>

              <a
                href={siteConfig.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-950 font-bold text-sm border border-blue-200 transition-all"
              >
                <Send className="w-4 h-4 text-blue-600" />
                <span>Telegram</span>
              </a>

              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm border border-emerald-200 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Legal Information Box */}
          <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-2 text-sm text-slate-700">
            <h4 className="font-bold text-slate-900 text-base">Юридические данные компании:</h4>
            <div>{siteConfig.legal.company}</div>
            <div>ИНН/КПП: {siteConfig.legal.innKpp}</div>
            <div>ОГРН: {siteConfig.legal.ogrn}</div>
            <div className="text-slate-500 pt-1">Партнер КНР: {siteConfig.legal.chinaCompany}</div>
          </div>

        </div>

        {/* Lead Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900">Задать вопрос или рассчитать доставку</h3>
            <LeadForm initialRequestType="Обращение со страницы Контакты" compact />
          </div>
        </div>

      </div>

      {/* Yandex Interactive Map Section */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Интерактивная карта</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Наши офисы на карте России
            </h2>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Москва • Санкт-Петербург • Краснодар • Новосибирск • Хабаровск</span>
          </div>
        </div>

        <YandexMapConstructor />
      </div>

    </div>
  );
};


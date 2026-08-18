import React from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ShieldCheck, Building2 } from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { LeadForm } from '../common/LeadForm';

export const ContactsPage: React.FC = () => {
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
          Мы всегда на связи для расчета поставок, выкупа и логистических консультаций
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Info Cards */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Main Russia Office */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Офис в России</h3>
              <p className="text-sm text-slate-600">{siteConfig.officeAddress}</p>
              
              <div className="pt-2 border-t border-slate-100 space-y-1 text-sm">
                <div className="text-slate-500">Телефон РФ:</div>
                <a href={siteConfig.phone.mainHref} className="font-bold text-slate-900 hover:text-orange-600 block text-base">
                  {siteConfig.phone.mainDisplay}
                </a>
              </div>
            </div>

            {/* International Branch */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Международный отдел</h3>
              <p className="text-sm text-slate-600">Выкупы и доставка по всему Миру</p>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-sm">
                <div className="text-slate-500">Телефон (горячая линия):</div>
                <a href={siteConfig.phone.mainHref} className="font-bold text-slate-900 hover:text-orange-600 block text-base">
                  {siteConfig.phone.mainDisplay}
                </a>
              </div>
            </div>

          </div>

          {/* Warehouse Guangzhou */}
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 text-slate-900 rounded-3xl p-6 sm:p-8 space-y-3 border border-orange-200 shadow-md">
            <div className="text-sm text-orange-600 font-bold uppercase tracking-wider">Собственный склад в Китае</div>
            <h3 className="text-xl font-bold text-slate-950">Склад консолидации Гуанчжоу</h3>
            <p className="text-sm text-slate-800 font-mono bg-white p-3 rounded-xl border border-orange-200/80 shadow-xs">
              {siteConfig.chinaWarehouse}
            </p>
            <p className="text-sm text-slate-600">
              Приемка, фотофиксация, проверка брака, вакуумирование и деревянная обрешетка 6 дней в неделю.
            </p>
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

    </div>
  );
};

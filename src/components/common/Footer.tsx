import React from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, Shield, FileText, ChevronRight } from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLeadModal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand & Address Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mt-2">
              B2B-сервис международной логистики, выкупа, проверки, консолидации и доставки товаров из Китая и всех стран мира в Россию.
            </p>

            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Офис в РФ:</span> {siteConfig.officeAddress}
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Склад в КНР:</span> {siteConfig.chinaWarehouse}
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-300 pt-1">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={siteConfig.emailHref} className="hover:text-blue-300 transition-colors font-medium">
                  {siteConfig.email}
                </a>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenLeadModal('Позвонить и рассчитать из футера')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Позвонить и рассчитать</span>
              </button>
            </div>

            {/* Messengers in Footer */}
            <div className="pt-4 space-y-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>Быстрая связь в чатах:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={siteConfig.social.max}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-100 border border-purple-600/70 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-300" />
                  <span>Корпоративный чат MAX</span>
                </a>
                <a
                  href={siteConfig.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-900/80 hover:bg-blue-800 text-blue-100 border border-blue-600/70 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-blue-300" />
                  <span>Telegram</span>
                </a>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/70 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links / Services */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Услуги</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/vikup-tovara-iz-kitaya')} className="hover:text-white transition-colors cursor-pointer">
                  Выкуп товаров (1688, Taobao)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/poisk-proizvodstva-tovarov-v-kitae-optom')} className="hover:text-white transition-colors cursor-pointer">
                  Поиск поставщиков и фабрик
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/konsolidaciya-tovara-v-kitaye')} className="hover:text-white transition-colors cursor-pointer">
                  Консолидация и склад в КНР
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/belaya-dostavka')} className="hover:text-white transition-colors cursor-pointer">
                  Официальная «белая» доставка
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/kargo-dostavka-iz-kitaia')} className="hover:text-white transition-colors cursor-pointer">
                  Карго-доставка из Китая
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/stat-importerom')} className="hover:text-white transition-colors cursor-pointer">
                  Стать импортером (На своё Юр. лицо)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dokumenty-dlya-vvoza')} className="hover:text-white transition-colors cursor-pointer">
                  Документы для ввоза (Честный Знак & Сертификация)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/dostavka-kontejnera-iz-kitaja')} className="hover:text-white transition-colors cursor-pointer">
                  Контейнеры 20ft / 40ft & Оборудование
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Directions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Для бизнеса</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/dostavka-tovarov-iz-kitaia-dlia-marketpleisov')} className="hover:text-white transition-colors cursor-pointer">
                  Доставка для маркетплейсов
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/fulfilment-dlya-marketpleisov')} className="hover:text-white transition-colors cursor-pointer">
                  Фулфилмент & Маркировка ЧЗ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/1688')} className="hover:text-white transition-colors cursor-pointer">
                  Закупки на 1688 / POIZON
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/world')} className="hover:text-orange-400 transition-colors font-bold text-orange-300 cursor-pointer text-sm">
                  🌍 Выкуп и доставка по всему миру
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/raschet-stoimosti-dostavki-gruza-iz-kitaja')} className="hover:text-white transition-colors cursor-pointer">
                  Калькулятор доставки
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Information Column */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Реквизиты</h3>
            <div className="space-y-1.5 text-sm text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
              <div className="font-semibold text-white">{siteConfig.legal.company}</div>
              <div>ИНН / КПП: {siteConfig.legal.innKpp}</div>
              <div>ОГРН: {siteConfig.legal.ogrn}</div>
              <div className="pt-1 text-slate-400 border-t border-slate-700 mt-1">
                КНР: {siteConfig.legal.chinaCompany}
              </div>
            </div>

            <div className="space-y-1.5 text-sm text-slate-400 pt-1">
              <div>
                <a href={siteConfig.documents.privacyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span>Политика конфиденциальности</span>
                </a>
              </div>
              <div>
                <a href={siteConfig.documents.offerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span>Публичная оферта</span>
                </a>
              </div>
              <div>
                <a href={siteConfig.documents.referralOfferUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>Партнерская оферта</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {siteConfig.brandName}. Все права защищены. Все расчеты являются предварительными.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/faq')} className="hover:text-slate-300 transition-colors cursor-pointer">
              База знаний FAQ
            </button>
            <button onClick={() => onNavigate('/kontakti')} className="hover:text-slate-300 transition-colors cursor-pointer">
              Контакты
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

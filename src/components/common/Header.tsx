import React, { useState, useEffect } from 'react';
import { withTrackingParams } from '../../utils/urlParams';
import { 
  Phone, 
  User, 
  UserPlus, 
  Eye, 
  Send, 
  MessageSquare, 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  Calculator as CalcIcon, 
  Truck, 
  Package, 
  Globe2, 
  Info,
  ChevronRight,
  HelpCircle,
  MapPin,
  Building2,
  ShieldCheck,
  ShoppingBag,
  Boxes,
  Zap
} from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { Logo } from './Logo';
import { Direction } from '../../types';
import { trackEvent } from '../../utils/analytics';

interface HeaderProps {
  currentDirection: Direction;
  onDirectionChange: (dir: Direction) => void;
  accessibilityMode: boolean;
  onToggleAccessibility: () => void;
  onOpenLeadModal: (requestType?: string) => void;
  activeNav: string;
  onNavigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDirection,
  onDirectionChange,
  accessibilityMode,
  onToggleAccessibility,
  onOpenLeadModal,
  activeNav,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [businessDropdownOpen, setBusinessDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileBusinessOpen, setMobileBusinessOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState<string | null>(null);

  // Lock body scroll when mobile/tablet drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isPlaceholderUrl = (url: string) => url.startsWith('REPLACE_WITH_');

  const handleMessengerClick = (channel: string, url: string) => {
    trackEvent('click_messenger', { channel });
    if (isPlaceholderUrl(url)) {
      setTooltipText(`URL для ${channel} пока не указан в siteConfig.ts`);
      setTimeout(() => setTooltipText(null), 3000);
      return;
    }
    window.open(url, '_blank');
  };

  const handlePhoneClick = (href: string, type: string) => {
    trackEvent('click_phone', { type });
    window.location.href = href;
  };

  const handleLoginClick = () => {
    trackEvent('click_login');
    window.open(withTrackingParams(siteConfig.clientCabinet.loginUrl), '_blank');
  };

  const handleRegClick = () => {
    trackEvent('click_registration');
    window.open(withTrackingParams(siteConfig.clientCabinet.registrationUrl), '_blank');
  };

  return (
    <header className="relative min-[1200px]:sticky min-[1200px]:top-0 z-[1000] bg-white border-b border-slate-200 shadow-xs transition-all w-full">
      
      {/* =========================================================================
          MODE 1: DESKTOP (1200px and wider)
          - Standard 2-row header: Utility Bar + Main Navigation Bar with full links
         ========================================================================= */}
      <div className="hidden min-[1200px]:block">
        {/* Desktop Utility Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            
            {/* Left: Phone & Direction Switch */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-medium shrink-0">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-slate-400 text-xs">РФ / Бесплатно:</span>
                <button 
                  onClick={() => handlePhoneClick(siteConfig.phone.mainHref, 'russia')}
                  className="text-white hover:text-orange-300 transition-colors font-bold tracking-tight cursor-pointer text-sm whitespace-nowrap"
                  aria-label="Позвонить в отдел РФ"
                >
                  {siteConfig.phone.mainDisplay}
                </button>
              </div>

              {/* Direction Selector */}
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs shrink-0">
                <a
                   href="/" onClick={(e) => { e.preventDefault(); onDirectionChange('china'); onNavigate('/');
                    trackEvent('select_direction', { direction: 'china' });
                  }}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer text-xs ${
                    currentDirection === 'china' 
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🇨🇳 Китай
                </a>
                <a
                   href="/world" onClick={(e) => { e.preventDefault(); onDirectionChange('world'); onNavigate('/world');
                    trackEvent('select_direction', { direction: 'world' });
                  }}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer text-xs ${
                    currentDirection === 'world' 
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  🌍 Весь мир
                </a>
              </div>
            </div>

            {/* Right: Messengers, Accessibility, README, Cabinet */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Messengers */}
              <div className="relative flex items-center gap-1.5">
                <button
                  onClick={() => handleMessengerClick('MAX', siteConfig.social.max)}
                  className="px-2 py-1 rounded-md bg-purple-900/80 hover:bg-purple-700 text-purple-200 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-1 border border-purple-700/60"
                  title="Корпоративный чат MAX"
                  aria-label="Корпоративный чат MAX"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-300" />
                  <span>Чат MAX</span>
                </button>

                <button
                  onClick={() => handleMessengerClick('Telegram', siteConfig.social.telegram)}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Telegram"
                  aria-label="Telegram"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleMessengerClick('WhatsApp', siteConfig.social.whatsapp)}
                  className="p-1.5 rounded-md bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                {tooltipText && (
                  <div className="absolute right-0 top-8 bg-amber-900/95 text-amber-200 text-xs py-1 px-2.5 rounded-md whitespace-nowrap shadow-lg border border-amber-700/50 z-50 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-300" />
                    {tooltipText}
                  </div>
                )}
              </div>

              {/* Accessibility Button */}
              <button
                onClick={() => {
                  onToggleAccessibility();
                  trackEvent('accessibility_mode_toggle', { active: !accessibilityMode });
                }}
                aria-pressed={accessibilityMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  accessibilityMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
                title="Версия для слабовидящих"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Слабовидящим</span>
              </button>

              {/* Cabinet Login / Registration */}
              <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors font-semibold text-xs cursor-pointer whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 text-orange-400" />
                  <span>Войти в ЛК</span>
                </button>
                
                <button
                  onClick={handleRegClick}
                  className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors font-semibold text-xs cursor-pointer whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Регистрация</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Desktop Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <a 
             href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
            className="text-left cursor-pointer focus:outline-hidden shrink-0"
          >
            <Logo />
          </a>

          {/* Desktop Nav Links */}
          <nav className="flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700">
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button 
                onClick={() => setServicesDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeNav.startsWith('/services') || activeNav === '/dostavka' || activeNav.includes('vikup') || activeNav === '/stat-importerom' || activeNav === '/dokumenty-dlya-vvoza'
                    ? 'text-orange-600 font-semibold bg-orange-50' 
                    : 'hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                <span>Услуги</span>
                <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border border-orange-200/80 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                    <span>Основные услуги</span>
                    <a 
                       href="/dostavka" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka'); setServicesDropdownOpen(false); }}
                      className="text-orange-600 hover:underline normal-case font-semibold text-xs cursor-pointer"
                    >
                      Все услуги →
                    </a>
                  </div>
                  <a
                     href="/vikup-tovara-iz-kitaya" onClick={(e) => { e.preventDefault(); onNavigate('/vikup-tovara-iz-kitaya'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Выкуп товаров</div>
                      <div className="text-xs text-slate-500">1688, Taobao, POIZON за 24ч</div>
                    </div>
                  </a>
                  <a
                     href="/poisk-proizvodstva-tovarov-v-kitae-optom" onClick={(e) => { e.preventDefault(); onNavigate('/poisk-proizvodstva-tovarov-v-kitae-optom'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Поиск фабрик и поставщиков</div>
                      <div className="text-xs text-slate-500">Переговоры и аудит в Китае</div>
                    </div>
                  </a>
                  <a
                     href="/konsolidaciya-tovara-v-kitaye" onClick={(e) => { e.preventDefault(); onNavigate('/konsolidaciya-tovara-v-kitaye'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Консолидация на складе</div>
                      <div className="text-xs text-slate-500">Склад Гуанчжоу, упаковка и фото</div>
                    </div>
                  </a>
                  <a
                     href="/belaya-dostavka" onClick={(e) => { e.preventDefault(); onNavigate('/belaya-dostavka'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Globe2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Официальная «белая» доставка</div>
                      <div className="text-xs text-slate-500">ГТД, закрывающие документы, НДС</div>
                    </div>
                  </a>
                  <a
                     href="/kargo-dostavka-iz-kitaia" onClick={(e) => { e.preventDefault(); onNavigate('/kargo-dostavka-iz-kitaia'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Доставка сборных грузов из Китая</div>
                      <div className="text-xs text-slate-500">Для оперативных коммерческих партий</div>
                    </div>
                  </a>
                  <a
                     href="/stat-importerom" onClick={(e) => { e.preventDefault(); onNavigate('/stat-importerom'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer border-t border-slate-100/80"
                  >
                    <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Стать импортером</div>
                      <div className="text-xs text-slate-500">Оформить все на своё Юр. лицо</div>
                    </div>
                  </a>
                  <a
                     href="/dokumenty-dlya-vvoza" onClick={(e) => { e.preventDefault(); onNavigate('/dokumenty-dlya-vvoza'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Документы для ввоза</div>
                      <div className="text-xs text-slate-500">Честный Знак & Сертификация под ключ</div>
                    </div>
                  </a>
                  <a
                     href="/tnved" onClick={(e) => { e.preventDefault(); onNavigate('/tnved'); setServicesDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <CalcIcon className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <span>ТН ВЭД & Таможня</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">Расчёт</span>
                      </div>
                      <div className="text-xs text-slate-500">Подбор кода, пошлины, Честный ЗНАК</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* Business Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setBusinessDropdownOpen(true)}
              onMouseLeave={() => setBusinessDropdownOpen(false)}
            >
              <button 
                onClick={() => setBusinessDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  activeNav.includes('marketpleisov') || activeNav.includes('fulfilment') || activeNav === '/world' || activeNav === '/raschet-stoimosti-dostavki-gruza-iz-kitaja' || activeNav === '/tnved2' || activeNav === '/tnved'
                    ? 'text-orange-600 font-semibold bg-orange-50' 
                    : 'hover:text-orange-600 hover:bg-slate-50'
                }`}
              >
                <span>Для бизнеса</span>
                <ChevronDown className={`w-4 h-4 opacity-70 transition-transform duration-200 ${businessDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {businessDropdownOpen && (
                <div className="absolute top-full left-0 w-80 bg-white border border-orange-200/80 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <a
                     href="/world" onClick={(e) => { e.preventDefault(); onNavigate('/world'); setBusinessDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Globe2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Направления (Весь мир)</div>
                      <div className="text-xs text-slate-500">Турция, ОАЭ, Европа, Азия, Америка</div>
                    </div>
                  </a>

                  <a
                     href="/raschet-stoimosti-dostavki-gruza-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/raschet-stoimosti-dostavki-gruza-iz-kitaja'); setBusinessDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <CalcIcon className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Калькулятор доставки</div>
                      <div className="text-xs text-slate-500">Расчет ориентировочной стоимости</div>
                    </div>
                  </a>

                  <a
                     href="/tnved" onClick={(e) => { e.preventDefault(); onNavigate('/tnved'); setBusinessDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        <span>ТН ВЭД & Таможенный расчёт</span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">NEW</span>
                      </div>
                      <div className="text-xs text-slate-500">Подбор кода, пошлины, Честный ЗНАК</div>
                    </div>
                  </a>

                  <div className="my-1 border-t border-slate-100" />

                  <a
                     href="/dostavka-tovarov-iz-kitaia-dlia-marketpleisov" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-tovarov-iz-kitaia-dlia-marketpleisov'); setBusinessDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Маркетплейсы</div>
                      <div className="text-xs text-slate-500">WB, Ozon, Я.Маркет — сдача на склады FBS/FBO</div>
                    </div>
                  </a>
                  <a
                     href="/fulfilment-dlya-marketpleisov" onClick={(e) => { e.preventDefault(); onNavigate('/fulfilment-dlya-marketpleisov'); setBusinessDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50/60 flex items-center gap-2.5 text-slate-800 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Boxes className="w-4 h-4 text-orange-600 shrink-0" />
                    <div>
                      <div className="font-semibold">Фулфилмент & Маркировка ЧЗ</div>
                      <div className="text-xs text-slate-500">Стикеровка, упаковка, отгрузка на маркетплейсы</div>
                    </div>
                  </a>
                </div>
              )}
            </div>

            <a
               href="/online-tariffs" onClick={(e) => { e.preventDefault(); onNavigate('/online-tariffs'); }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNav === '/online-tariffs' ? 'text-orange-600 font-bold bg-orange-50' : 'hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-4 h-4 text-orange-600" />
              <span>Тарифы онлайн ⚡</span>
            </a>

            <a
               href="/#tracking" onClick={(e) => { e.preventDefault(); onNavigate('/#tracking'); }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeNav === '/#tracking' ? 'text-orange-600 font-semibold bg-orange-50' : 'hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Трекинг
            </a>

            <a
               href="/faq" onClick={(e) => { e.preventDefault(); onNavigate('/faq'); }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeNav === '/faq' ? 'text-orange-600 font-semibold bg-orange-50' : 'hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              FAQ
            </a>

            <a
               href="/kontakti" onClick={(e) => { e.preventDefault(); onNavigate('/kontakti'); }}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeNav === '/kontakti' ? 'text-orange-600 font-semibold bg-orange-50' : 'hover:text-orange-600 hover:bg-slate-50'
              }`}
            >
              Контакты
            </a>
          </nav>

          {/* Desktop CTA */}
          <button
            onClick={() => {
              onOpenLeadModal('Рассчитать доставку из шапки');
              trackEvent('open_calculator', { source: 'desktop_header' });
            }}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/25 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-98 whitespace-nowrap"
          >
            <CalcIcon className="w-4 h-4 shrink-0" />
            <span>Рассчитать доставку</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          MODE 2: TABLET (768px to 1199px)
          - Compact top dark bar + brand bar with full logo, CTA and burger button
         ========================================================================= */}
      <div className="hidden min-[768px]:max-[1199px]:block">
        {/* Tablet Service Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Phone */}
            <div className="flex items-center gap-1.5 font-medium shrink-0">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <button 
                onClick={() => handlePhoneClick(siteConfig.phone.mainHref, 'russia')}
                className="text-white hover:text-orange-300 font-bold tracking-tight text-xs sm:text-sm cursor-pointer whitespace-nowrap"
              >
                {siteConfig.phone.mainDisplay}
              </button>
            </div>

            {/* Direction Selector */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs shrink-0">
              <a
                 href="/" onClick={(e) => { e.preventDefault(); onDirectionChange('china'); onNavigate('/');
                  trackEvent('select_direction', { direction: 'china' });
                }}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer text-xs ${
                  currentDirection === 'china' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🇨🇳 Китай
              </a>
              <a
                 href="/world" onClick={(e) => { e.preventDefault(); onDirectionChange('world'); onNavigate('/world');
                  trackEvent('select_direction', { direction: 'world' });
                }}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer text-xs ${
                  currentDirection === 'world' 
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                🌍 Весь мир
              </a>
            </div>

            {/* LK Login & Accessibility */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleLoginClick}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold text-xs cursor-pointer whitespace-nowrap"
              >
                <User className="w-4 h-4 text-orange-400" />
                <span>Войти в ЛК</span>
              </button>

              <button
                onClick={onToggleAccessibility}
                aria-pressed={accessibilityMode}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Версия для слабовидящих"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tablet Brand & Main Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo (Always fully visible) */}
          <a 
             href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
            className="text-left cursor-pointer focus:outline-hidden shrink-0"
          >
            <Logo />
          </a>

          {/* Tablet Right Controls */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onOpenLeadModal('Рассчитать доставку из шапки планшета');
                trackEvent('open_calculator', { source: 'tablet_header' });
              }}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md shadow-orange-600/25 transition-all cursor-pointer flex items-center gap-2 min-h-[44px] active:scale-98 whitespace-nowrap"
            >
              <CalcIcon className="w-4 h-4 shrink-0" />
              <span>Рассчитать</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 text-slate-900 font-bold text-sm min-h-[44px] cursor-pointer transition-colors active:scale-95"
              aria-label="Открыть меню"
            >
              <Menu className="w-5 h-5 text-slate-800" />
              <span>Меню</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODE 3: MOBILE (< 768px)
          - Three distinct in-flow rows inside sticky Header:
            Row 1: Dark Service Bar (~44-48px)
            Row 2: White Brand Bar (~64-72px, ALWAYS VISIBLE)
            Row 3: Mobile CTA Bar (2 equal buttons or vertical stack)
         ========================================================================= */}
      <div className="block min-[768px]:hidden">
        {/* Row 1: Mobile Service Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs px-3 py-2 border-b border-slate-800 flex items-center justify-between gap-2">
          {/* Clickable Phone Number */}
          <a
            href={siteConfig.phone.mainHref}
            onClick={() => trackEvent('click_phone', { source: 'mobile_service_bar' })}
            className="flex items-center gap-1.5 font-bold text-white text-xs hover:text-orange-300 transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>8 (800) 555-94-25</span>
          </a>

          {/* Compact Direction Toggle */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[11px] shrink-0">
            <a
               href="/" onClick={(e) => { e.preventDefault(); onDirectionChange('china'); onNavigate('/');
                trackEvent('select_direction', { direction: 'china' });
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                currentDirection === 'china' 
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🇨🇳 Китай
            </a>
            <a
               href="/world" onClick={(e) => { e.preventDefault(); onDirectionChange('world'); onNavigate('/world');
                trackEvent('select_direction', { direction: 'world' });
              }}
              className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                currentDirection === 'world' 
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              🌍 Весь мир
            </a>
          </div>
        </div>

        {/* Row 2: Mobile Brand Bar (ALWAYS VISIBLE) */}
        <div className="bg-white px-3 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 min-h-[64px]">
          {/* Brand Logo */}
          <a 
             href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} 
            className="text-left cursor-pointer focus:outline-hidden shrink-0"
          >
            <Logo />
          </a>

          {/* Cabinet & Burger Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* LK Login Icon Button */}
            <button
              onClick={handleLoginClick}
              aria-label="Войти в личный кабинет"
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-orange-50 border border-slate-200 flex items-center justify-center text-slate-800 cursor-pointer active:scale-95 transition-colors"
            >
              <User className="w-5 h-5 text-orange-600" />
            </button>

            {/* Burger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Открыть меню"
              className="h-11 px-3 sm:px-3.5 rounded-xl bg-slate-100 hover:bg-orange-50 border border-slate-200 flex items-center justify-center gap-1.5 text-slate-900 font-bold text-xs sm:text-sm cursor-pointer active:scale-95 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-800" />
              <span className="hidden min-[375px]:inline">Меню</span>
            </button>
          </div>
        </div>

        {/* Row 3: Mobile CTA Bar (In Normal Flow) */}
        <div className="bg-slate-50/80 p-2.5 border-b border-slate-200">
          <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
            {/* Primary CTA: Calculate */}
            <button
              onClick={() => {
                onOpenLeadModal('Мобильная кнопка Рассчитать');
                trackEvent('open_calculator', { source: 'mobile_cta_bar' });
              }}
              className="w-full min-h-[52px] bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-xl shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CalcIcon className="w-5 h-5 shrink-0" />
              <span>Рассчитать доставку</span>
            </button>

            {/* Secondary CTA: Call */}
            <a
              href={siteConfig.phone.mainHref}
              onClick={() => trackEvent('click_phone', { source: 'mobile_cta_bar' })}
              className="w-full min-h-[52px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Phone className="w-5 h-5 text-orange-400 shrink-0" />
              <span>Позвонить</span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DRAWER / SLIDE-OVER MENU (MOBILE & TABLET)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[360px] sm:max-w-[400px] bg-white h-full shadow-2xl flex flex-col overflow-y-auto z-10 animate-in slide-in-from-right duration-250">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 shrink-0">
              <Logo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Закрыть меню"
                className="w-11 h-11 rounded-xl bg-slate-200 hover:bg-orange-100 text-slate-800 hover:text-orange-600 flex items-center justify-center cursor-pointer transition-colors active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-4 space-y-4 flex-1">
              
              {/* Direction Switcher inside Drawer */}
              <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl border border-slate-200">
                <a
                   href="/" onClick={(e) => { e.preventDefault(); onDirectionChange('china'); onNavigate('/');
                    setMobileMenuOpen(false);
                    trackEvent('select_direction', { direction: 'china' });
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                    currentDirection === 'china'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  🇨🇳 Доставка из Китая
                </a>
                <a
                   href="/world" onClick={(e) => { e.preventDefault(); onDirectionChange('world'); onNavigate('/world');
                    setMobileMenuOpen(false);
                    trackEvent('select_direction', { direction: 'world' });
                  }}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm text-center transition-all cursor-pointer ${
                    currentDirection === 'world'
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  🌍 Весь мир
                </a>
              </div>

              {/* Quick Calculate Banner */}
              <button
                onClick={() => {
                  onOpenLeadModal('Из бокового меню');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-orange-600/25 text-center text-sm flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-98"
              >
                <CalcIcon className="w-5 h-5" />
                <span>Рассчитать доставку</span>
              </button>

              {/* Main Navigation Links */}
              <div className="space-y-1">
                <a
                   href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); setMobileMenuOpen(false); }}
                  className="w-full p-3 rounded-xl hover:bg-orange-50/60 text-slate-900 font-bold text-sm text-left flex items-center justify-between cursor-pointer min-h-[48px]"
                >
                  <span>Главная страница</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                {/* Services Collapsible Accordion */}
                <div className="border rounded-xl border-slate-200 overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full p-3 text-slate-900 font-bold text-sm text-left flex items-center justify-between cursor-pointer min-h-[48px]"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-600" />
                      <span>Услуги и сервис</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileServicesOpen ? 'rotate-180 text-orange-600' : ''}`} />
                  </button>

                  {mobileServicesOpen && (
                    <div className="bg-white border-t border-slate-200 p-2 space-y-1 text-xs">
                      <a
                         href="/vikup-tovara-iz-kitaya" onClick={(e) => { e.preventDefault(); onNavigate('/vikup-tovara-iz-kitaya'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Package className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Выкуп товаров (1688, Taobao, POIZON)</span>
                      </a>
                      <a
                         href="/poisk-proizvodstva-tovarov-v-kitae-optom" onClick={(e) => { e.preventDefault(); onNavigate('/poisk-proizvodstva-tovarov-v-kitae-optom'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Search className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Поиск фабрик и поставщиков</span>
                      </a>
                      <a
                         href="/konsolidaciya-tovara-v-kitaye" onClick={(e) => { e.preventDefault(); onNavigate('/konsolidaciya-tovara-v-kitaye'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Консолидация на складе в КНР</span>
                      </a>
                      <a
                         href="/belaya-dostavka" onClick={(e) => { e.preventDefault(); onNavigate('/belaya-dostavka'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Globe2 className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Официальная «белая» доставка</span>
                      </a>
                      <a
                         href="/kargo-dostavka-iz-kitaia" onClick={(e) => { e.preventDefault(); onNavigate('/kargo-dostavka-iz-kitaia'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>Доставка сборных грузов из Китая</span>
                      </a>
                      <a
                         href="/stat-importerom" onClick={(e) => { e.preventDefault(); onNavigate('/stat-importerom'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>Стать импортером (На своё Юр. лицо)</span>
                      </a>
                      <a
                         href="/dokumenty-dlya-vvoza" onClick={(e) => { e.preventDefault(); onNavigate('/dokumenty-dlya-vvoza'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Документы для ввоза (Честный Знак & Сертификация)</span>
                      </a>
                      <a
                         href="/tnved" onClick={(e) => { e.preventDefault(); onNavigate('/tnved'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <CalcIcon className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>ТН ВЭД & Таможенный расчёт (Честный ЗНАК, пошлины)</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* For Business Collapsible Accordion */}
                <div className="border rounded-xl border-slate-200 overflow-hidden bg-slate-50/50">
                  <button
                    onClick={() => setMobileBusinessOpen(!mobileBusinessOpen)}
                    className="w-full p-3 text-slate-900 font-bold text-sm text-left flex items-center justify-between cursor-pointer min-h-[48px]"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-orange-600" />
                      <span>Для бизнеса</span>
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileBusinessOpen ? 'rotate-180 text-orange-600' : ''}`} />
                  </button>

                  {mobileBusinessOpen && (
                    <div className="bg-white border-t border-slate-200 p-2 space-y-1 text-xs">
                      <a
                         href="/world" onClick={(e) => { e.preventDefault(); onNavigate('/world'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Globe2 className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Направления (Весь мир)</span>
                      </a>
                      <a
                         href="/raschet-stoimosti-dostavki-gruza-iz-kitaja" onClick={(e) => { e.preventDefault(); onNavigate('/raschet-stoimosti-dostavki-gruza-iz-kitaja'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <CalcIcon className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Калькулятор стоимости доставки</span>
                      </a>
                      <a
                         href="/tnved" onClick={(e) => { e.preventDefault(); onNavigate('/tnved'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>ТН ВЭД & Таможенный расчёт</span>
                      </a>
                      <div className="my-1 border-t border-slate-100" />
                      <a
                         href="/dostavka-tovarov-iz-kitaia-dlia-marketpleisov" onClick={(e) => { e.preventDefault(); onNavigate('/dostavka-tovarov-iz-kitaia-dlia-marketpleisov'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <ShoppingBag className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Маркетплейсы (WB, Ozon, Я.Маркет)</span>
                      </a>
                      <a
                         href="/fulfilment-dlya-marketpleisov" onClick={(e) => { e.preventDefault(); onNavigate('/fulfilment-dlya-marketpleisov'); setMobileMenuOpen(false); }}
                        className="w-full text-left p-3 rounded-lg hover:bg-orange-50 text-slate-800 font-semibold flex items-center gap-2 min-h-[44px]"
                      >
                        <Boxes className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Фулфилмент & Маркировка ЧЗ</span>
                      </a>
                    </div>
                  )}
                </div>

                <a
                   href="/online-tariffs" onClick={(e) => { e.preventDefault(); onNavigate('/online-tariffs'); setMobileMenuOpen(false); }}
                  className="w-full p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-orange-950 font-bold text-sm text-left flex items-center justify-between cursor-pointer min-h-[48px]"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    <span>Тарифы онлайн ⚡ (Aviasales-стиль)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-orange-600" />
                </a>

                <a
                   href="/#tracking" onClick={(e) => { e.preventDefault(); onNavigate('/#tracking'); setMobileMenuOpen(false); }}
                  className="w-full p-3 rounded-xl hover:bg-orange-50/60 text-slate-900 font-bold text-sm text-left flex items-center justify-between cursor-pointer min-h-[48px]"
                >
                  <span className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-orange-600" />
                    <span>Трекинг накладных</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                   href="/faq" onClick={(e) => { e.preventDefault(); onNavigate('/faq'); setMobileMenuOpen(false); }}
                  className="w-full p-3 rounded-xl hover:bg-orange-50/60 text-slate-900 font-bold text-sm text-left flex items-center justify-between cursor-pointer min-h-[48px]"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-orange-600" />
                    <span>База знаний (FAQ)</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                   href="/kontakti" onClick={(e) => { e.preventDefault(); onNavigate('/kontakti'); setMobileMenuOpen(false); }}
                  className="w-full p-3 rounded-xl hover:bg-orange-50/60 text-slate-900 font-bold text-sm text-left flex items-center justify-between cursor-pointer min-h-[48px]"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <span>Контакты и офисы</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Action Buttons Section */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }}
                  className="w-full bg-slate-100 hover:bg-orange-50 text-slate-900 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer border border-slate-200 min-h-[48px]"
                >
                  <User className="w-5 h-5 text-orange-600" />
                  <span>Войти в ЛК</span>
                </button>

                <button
                  onClick={() => { handleRegClick(); setMobileMenuOpen(false); }}
                  className="w-full bg-orange-50 hover:bg-orange-100 text-orange-950 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer border border-orange-200 min-h-[48px]"
                >
                  <UserPlus className="w-5 h-5 text-orange-600" />
                  <span>Регистрация</span>
                </button>

                <button
                  onClick={() => {
                    onToggleAccessibility();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer border min-h-[48px] ${
                    accessibilityMode
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <Eye className="w-5 h-5 text-amber-600" />
                  <span>Версия для слабовидящих</span>
                </button>
              </div>

              {/* Support & Messengers Footer */}
              <div className="pt-3 border-t border-slate-100 space-y-2 mt-auto">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Быстрый вопрос менеджеру</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleMessengerClick('MAX', siteConfig.social.max)}
                    className="p-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-950 font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer border border-purple-200 min-h-[48px]"
                  >
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <span>Чат MAX</span>
                  </button>
                  <button
                    onClick={() => handleMessengerClick('Telegram', siteConfig.social.telegram)}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 font-semibold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer border border-slate-200 min-h-[48px]"
                  >
                    <Send className="w-4 h-4 text-blue-500" />
                    <span>Telegram</span>
                  </button>
                  <button
                    onClick={() => handleMessengerClick('WhatsApp', siteConfig.social.whatsapp)}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 font-semibold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer border border-slate-200 min-h-[48px]"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </header>
  );
};

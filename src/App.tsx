import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LeadModal } from './components/common/LeadModal';
import { CalculationChoiceModal } from './components/common/CalculationChoiceModal';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Direction } from './types';

// Pages
import { HomePage } from './components/pages/HomePage';
import { ServicePage } from './components/pages/ServicePage';
import { TurkeyPage } from './components/pages/TurkeyPage';
import { FAQPage } from './components/pages/FAQPage';
import { ContactsPage } from './components/pages/ContactsPage';
import { LegalPage } from './components/pages/LegalPage';
import { CalculatorWidget } from './components/common/CalculatorWidget';
import { OnlineTariffSearchPage } from './components/pages/OnlineTariffSearchPage';
import { WholesaleBuyoutPage } from './components/pages/WholesaleBuyoutPage';
import { RetailBuyoutPage } from './components/pages/RetailBuyoutPage';
import TnvedApp from './tnved/TnvedApp';

// Известные маршруты сайта: всё, что рендерит renderCurrentView.
// Всё остальное считается 404 и редиректится на выкуп с 1688.
function isKnownRoute(path: string): boolean {
  if (path === '/') return true;
  const exact = [
    '/tnved', '/tnved2', '/tnved3', '/tamozhnya-tnved', '/podbor-koda-tnved',
    '/online-tariffs', '/tariffs', '/turkey', '/world', '/faq', '/kontakti', '/test2', '/original19102026',
    '/raschet-stoimosti-dostavki-gruza-iz-kitaja',
    '/publichnaya-oferta',
    '/soglashenie-o-konfidencialnosti-i-polzovatelskoe-soglashenie',
    '/partnerskoye-referalnoye-soglasheniye-oferta',
    '/oferta-dostavka',
    '/vikup-1688-alibaba', '/1688-alibaba', '/1688', '/alibaba',
    '/vikup-optom', '/optoviy-vikup-1688-alibaba',
    '/vikup-poizon-tmall-taobao', '/poizon-tmall-taobao', '/poizon',
    '/tmall', '/taobao', '/vikup-roznica', '/roznichniy-vikup-poizon-tmall-taobao',
  ];
  if (exact.includes(path)) return true;
  const prefixes = [
    '/vikup', '/poisk', '/konsolidaciya', '/belaya', '/kargo', '/dostavka',
    '/1688', '/fulfilment', '/stat-importerom', '/dokumenty-dlya-vvoza',
  ];
  return prefixes.some((p) => path.startsWith(p));
}

export default function App() {
  const [direction, setDirection] = useState<Direction>('china');
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    // Every page has its own URL path: read it on first load so deep links
    // like /faq or /vikup-tovara-iz-kitaya open the right page directly.
    if (typeof window !== 'undefined' && window.location.pathname && window.location.pathname !== '/') {
      return window.location.pathname;
    }
    return '/';
  });

  // Accessibility mode state
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('express_today_accessibility') === 'true';
    }
    return false;
  });

  // Modal states
  const [choiceModalOpen, setChoiceModalOpen] = useState<boolean>(false);
  const [choiceContextTitle, setChoiceContextTitle] = useState<string>('Расчет поставки груза');
  const [leadModalOpen, setLeadModalOpen] = useState<boolean>(false);
  const [leadRequestType, setLeadRequestType] = useState<string>('Общий запрос на логистику');

  // Sync accessibility mode with body classes & localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('express_today_accessibility', String(accessibilityMode));
      if (accessibilityMode) {
        document.documentElement.classList.add('accessibility-mode');
      } else {
        document.documentElement.classList.remove('accessibility-mode');
      }
    }
  }, [accessibilityMode]);

  // Browser back/forward: re-read the URL and render the matching page
  useEffect(() => {
    const onPopState = () => {
      const p = window.location.pathname;
      setCurrentRoute(p && p !== '/' ? p : '/');
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keitaro: отправляем просмотр каждой страницы в трекер при SPA-навигации.
  // Первый заход уже отправлен inline-скриптом в <head>, поэтому его пропускаем.
  // se_referrer для внутренних переходов = предыдущая страница сайта (видно в
  // стандартной колонке «Реферер» лога Keitaro), page = текущая страница
  // (можно вывести отдельной колонкой в настройках лога).
  const trackerFirstRun = useRef(true);
  const prevPathRef = useRef('/');
  useEffect(() => {
    if (trackerFirstRun.current) {
      trackerFirstRun.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    const cfg = (window as any)._BgkHWKYY9PrVTVhR;
    if (!cfg || !cfg.R_PATH) return;

    const currentPath = window.location.pathname || '/';
    const prevPath = prevPathRef.current;
    const internalReferrer = 'https://' + window.location.hostname + (prevPath === '/' ? '/' : prevPath);

    let q = '?return=js.client';
    q += '&' + decodeURIComponent(window.location.search.replace('?', ''));
    q += '&se_referrer=' + encodeURIComponent(internalReferrer);
    const heading = document.querySelector('h1')?.textContent?.trim().slice(0, 120);
    q += '&default_keyword=' + encodeURIComponent(heading || document.title);
    q += '&landing_url=' + encodeURIComponent(window.location.hostname + currentPath);
    q += '&url_site_20=' + encodeURIComponent('https://' + window.location.hostname + currentPath);
    q += '&name=' + encodeURIComponent('_BgkHWKYY9PrVTVhR');
    q += '&host=' + encodeURIComponent(cfg.R_PATH);

    const a = document.createElement('script');
    a.type = 'application/javascript';
    a.src = cfg.R_PATH + q;
    document.head.appendChild(a);

    prevPathRef.current = currentPath;
  }, [currentRoute]);

  // 404: неизвестный адрес редиректим на страницу выкупа с 1688
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;
    if (!isKnownRoute(path)) {
      window.history.replaceState({}, '', '/vikup-1688-alibaba' + window.location.search);
      setCurrentRoute('/vikup-1688-alibaba');
    }
  }, [currentRoute]);

  // Handle client-side route navigation (updates the URL so each page is linkable)
  const handleNavigate = (route: string) => {
    if (typeof window === 'undefined') return;
    if (route.startsWith('/#')) {
      // In-page anchor (e.g. /#tracking): go to home first, then scroll to the section
      const id = route.replace('/#', '');
      if (window.location.pathname !== '/') {
        setCurrentRoute('/');
        window.history.pushState({}, '', '/' + window.location.search);
      }
      window.setTimeout(() => {
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
      return;
    }
    setCurrentRoute(route);
    if (window.location.pathname !== route) {
      // Сохраняем строку параметров (?utm_*, yclid и пр.) при внутренних переходах
      window.history.pushState({}, '', route + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Primary handler for all calculation CTA buttons: opens Choice Modal
  const handleOpenCalculationFlow = (reqType?: string) => {
    const title = reqType || 'Расчет поставки груза';
    setLeadRequestType(title);
    setChoiceContextTitle(title);
    setChoiceModalOpen(true);
  };

  // Direct opening of LeadModal (Option A from Choice Modal or direct explicit requests)
  const handleOpenDirectLeadModal = (reqType?: string) => {
    if (reqType) {
      setLeadRequestType(reqType);
    }
    setLeadModalOpen(true);
  };

  // Option B from Choice Modal: navigates to Online Tariffs search page
  const handleNavigateToOnlineTariffs = () => {
    handleNavigate('/online-tariffs');
  };

  const renderCurrentView = () => {
    if (currentRoute === '/online-tariffs' || currentRoute === '/tariffs') {
      return (
        <OnlineTariffSearchPage
          onOpenLeadModal={handleOpenDirectLeadModal}
          onNavigate={handleNavigate}
        />
      );
    }

    if (
      currentRoute === '/tnved' ||
      currentRoute === '/tnved2' ||
      currentRoute === '/tnved3' ||
      currentRoute === '/tamozhnya-tnved' ||
      currentRoute === '/podbor-koda-tnved'
    ) {
      return (
        <TnvedApp
          embedded
          onOpenLeadModal={handleOpenDirectLeadModal}
        />
      );
    }

    if (currentRoute === '/turkey' || currentRoute === '/world') {
      return <TurkeyPage onOpenLeadModal={handleOpenCalculationFlow} />;
    }

    if (currentRoute === '/faq') {
      return <FAQPage onOpenLeadModal={handleOpenCalculationFlow} />;
    }

    if (currentRoute === '/kontakti') {
      return <ContactsPage />;
    }

    if (currentRoute === '/raschet-stoimosti-dostavki-gruza-iz-kitaja') {
      return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900">Калькулятор доставки из Китая</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Расчет ориентировочной стоимости транспортировки груза
            </p>
          </div>
          <CalculatorWidget onOpenLeadModal={handleOpenCalculationFlow} fullPage />
        </div>
      );
    }

    if (currentRoute === '/publichnaya-oferta') {
      return <LegalPage type="offer" onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/soglashenie-o-konfidencialnosti-i-polzovatelskoe-soglashenie') {
      return <LegalPage type="privacy" onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/partnerskoye-referalnoye-soglasheniye-oferta') {
      return <LegalPage type="referral" onNavigate={handleNavigate} />;
    }

    if (currentRoute === '/oferta-dostavka') {
      return <LegalPage type="delivery" onNavigate={handleNavigate} />;
    }

    // Wholesale Platforms Buyout (1688, Alibaba, Factories)
    if (
      currentRoute === '/vikup-1688-alibaba' ||
      currentRoute === '/1688-alibaba' ||
      currentRoute === '/1688' ||
      currentRoute === '/alibaba' ||
      currentRoute === '/vikup-optom' ||
      currentRoute === '/optoviy-vikup-1688-alibaba'
    ) {
      return (
        <WholesaleBuyoutPage
          onOpenLeadModal={handleOpenCalculationFlow}
          onNavigate={handleNavigate}
        />
      );
    }

    // Retail Platforms Buyout (Poizon, Tmall, Taobao)
    if (
      currentRoute === '/vikup-poizon-tmall-taobao' ||
      currentRoute === '/poizon-tmall-taobao' ||
      currentRoute === '/poizon' ||
      currentRoute === '/tmall' ||
      currentRoute === '/taobao' ||
      currentRoute === '/vikup-roznica' ||
      currentRoute === '/roznichniy-vikup-poizon-tmall-taobao'
    ) {
      return (
        <RetailBuyoutPage
          onOpenLeadModal={handleOpenCalculationFlow}
          onNavigate={handleNavigate}
        />
      );
    }

    // Service routes
    if (
      currentRoute.startsWith('/vikup') ||
      currentRoute.startsWith('/poisk') ||
      currentRoute.startsWith('/konsolidaciya') ||
      currentRoute.startsWith('/belaya') ||
      currentRoute.startsWith('/kargo') ||
      currentRoute.startsWith('/dostavka') ||
      currentRoute.startsWith('/1688') ||
      currentRoute.startsWith('/fulfilment') ||
      currentRoute.startsWith('/stat-importerom') ||
      currentRoute.startsWith('/dokumenty-dlya-vvoza')
    ) {
      const cleanSlug = currentRoute.replace('/', '');
      return <ServicePage slug={cleanSlug} onNavigate={handleNavigate} onOpenLeadModal={handleOpenCalculationFlow} />;
    }

    // Default Home Page
    if (currentRoute === '/test2') {
      return <HomePage onOpenLeadModal={handleOpenCalculationFlow} onNavigate={handleNavigate} showDailyArrivals />;
    }

    // Сохранённая версия главной без блока приходов (original19102026)
    if (currentRoute === '/original19102026') {
      return <HomePage onOpenLeadModal={handleOpenCalculationFlow} onNavigate={handleNavigate} />;
    }

    // Главная: теперь с блоком «Грузы получаемые нами ежедневно»
    return <HomePage onOpenLeadModal={handleOpenCalculationFlow} onNavigate={handleNavigate} showDailyArrivals />;
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all ${
      accessibilityMode 
        ? 'bg-white text-slate-950 text-xl font-medium' 
        : 'bg-slate-50/50 text-slate-800 text-base'
    }`}>
      
      {/* Header */}
      <Header
        currentDirection={direction}
        onDirectionChange={setDirection}
        accessibilityMode={accessibilityMode}
        onToggleAccessibility={() => setAccessibilityMode(!accessibilityMode)}
        onOpenLeadModal={handleOpenCalculationFlow}
        activeNav={currentRoute}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLeadModal={handleOpenCalculationFlow}
      />

      {/* 2-Option Choice Modal (Запросить расчет vs Найти онлайн тариф как в Aviasales) */}
      <CalculationChoiceModal
        isOpen={choiceModalOpen}
        onClose={() => setChoiceModalOpen(false)}
        onRequestQuote={() => handleOpenDirectLeadModal(choiceContextTitle)}
        onSearchOnlineTariffs={handleNavigateToOnlineTariffs}
        contextTitle={choiceContextTitle}
      />

      {/* Universal Lead Modal */}
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        requestType={leadRequestType}
      />

      {/* Floating Scroll To Top Button for Mobile & Tablet */}
      <ScrollToTop />

    </div>
  );
}

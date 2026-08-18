import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LeadModal } from './components/common/LeadModal';
import { CalculationChoiceModal } from './components/common/CalculationChoiceModal';
import { ReadmeDrawer } from './components/common/ReadmeDrawer';
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

export default function App() {
  const [direction, setDirection] = useState<Direction>('china');
  const [currentRoute, setCurrentRoute] = useState<string>('/');
  
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
  const [readmeOpen, setReadmeOpen] = useState<boolean>(false);

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

  // Handle client-side route navigation
  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      if (route.startsWith('/#')) {
        const id = route.replace('/#', '');
        const elem = document.getElementById(id);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
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
    return <HomePage onOpenLeadModal={handleOpenCalculationFlow} onNavigate={handleNavigate} />;
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
        onOpenReadme={() => setReadmeOpen(true)}
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

      {/* Developer Readme Drawer */}
      <ReadmeDrawer
        isOpen={readmeOpen}
        onClose={() => setReadmeOpen(false)}
      />

      {/* Floating Scroll To Top Button for Mobile & Tablet */}
      <ScrollToTop />

    </div>
  );
}

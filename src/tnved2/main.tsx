import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import TnvedApp from '../tnved/TnvedApp';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { LeadModal } from '../components/common/LeadModal';
import type { Direction } from '../types';
import '../index.css';

/**
 * /tnved2 — the TN VED calculator embedded in the main site chrome
 * (site Header + Footer, site styles).
 */
function Tnved2Page() {
  const [direction, setDirection] = useState<Direction>('china');
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadRequestType, setLeadRequestType] = useState('ТН ВЭД — подбор кода и расчёт платежей');

  const onToggleAccessibility = useCallback(() => {
    setAccessibilityMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('accessibility-mode', next);
      return next;
    });
  }, []);

  const onNavigate = useCallback((route: string) => {
    window.location.href = route;
  }, []);

  const onOpenLeadModal = useCallback((reqType?: string) => {
    if (reqType) {
      setLeadRequestType(reqType);
    }
    setLeadModalOpen(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        currentDirection={direction}
        onDirectionChange={setDirection}
        accessibilityMode={accessibilityMode}
        onToggleAccessibility={onToggleAccessibility}
        onOpenLeadModal={onOpenLeadModal}
        activeNav="/tnved2"
        onNavigate={onNavigate}
      />
      <main className="flex-1">
        <TnvedApp embedded onOpenLeadModal={onOpenLeadModal} />
      </main>
      <Footer onNavigate={onNavigate} onOpenLeadModal={onOpenLeadModal} />
      <LeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        requestType={leadRequestType}
      />
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <Tnved2Page />
    </StrictMode>,
  );
}

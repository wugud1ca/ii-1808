import React, { useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import { LeadForm } from './LeadForm';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestType?: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, requestType }) => {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          aria-label="Закрыть окно"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Рассчитать поставку</h2>
            <p className="text-sm text-slate-600">Оставьте заявку, менеджер свяжется с вами с точным расчетом или запросом уточнений</p>
          </div>
        </div>

        {/* Form */}
        <LeadForm initialRequestType={requestType} onSuccessClose={onClose} />
      </div>
    </div>
  );
};

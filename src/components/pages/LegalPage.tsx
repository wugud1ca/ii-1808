import React from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';
import { siteConfig } from '../../siteConfig';

interface LegalPageProps {
  type: 'privacy' | 'offer' | 'referral';
  onNavigate: (route: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  let title = 'Политика конфиденциальности';
  let targetUrl = siteConfig.documents.privacyUrl;

  if (type === 'offer') {
    title = 'Публичная оферта';
    targetUrl = siteConfig.documents.offerUrl;
  } else if (type === 'referral') {
    title = 'Партнерское реферальное соглашение (оферта)';
    targetUrl = siteConfig.documents.referralOfferUrl;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Вернуться на главную</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
        </div>

        <div className="text-sm sm:text-base text-slate-600 space-y-4 leading-relaxed border-t border-slate-100 pt-6">
          <p>
            Настоящий документ регулирует порядок оказания услуг логистики, выкупа и сопровождения грузов ООО «Экспресс-тудей» ({siteConfig.legal.innKpp}).
          </p>
          <p>
            Для ознакомления с оригиналом утвержденного юридического документа в актуальной редакции перейдите по прямой ссылке:
          </p>
          <div className="pt-2">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-orange-600/25"
            >
              <span>Открыть {title} (Официальный ресурс)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

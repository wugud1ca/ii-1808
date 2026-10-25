import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { privacyPolicyBlocks } from '../../data/privacyPolicy';
import { offerBlocks, referralBlocks, deliveryBlocks, LegalBlock } from '../../data/legalDocuments';

interface LegalPageProps {
  type: 'privacy' | 'offer' | 'referral' | 'delivery';
  onNavigate: (route: string) => void;
}

// Inline renderer for [text](url) links and **bold** segments inside document text
const renderInlineText = (text: string, keyPrefix: string): React.ReactNode[] => {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return boldParts.map((part, bi) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={`${keyPrefix}-b${bi}`} className="text-slate-800">
          {renderInlineText(inner, `${keyPrefix}-b${bi}`)}
        </strong>
      );
    }
    const linkParts = part.split(/(\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
    return linkParts.map((lp, li) => {
      const m = lp.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (!m) return <React.Fragment key={`${keyPrefix}-${bi}-${li}`}>{lp}</React.Fragment>;
      const [, label, href] = m;
      const isExternal = href.startsWith('http') && !href.includes('express-today.ru');
      return (
        <a
          key={`${keyPrefix}-${bi}-${li}`}
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-orange-600 hover:text-orange-700 underline decoration-orange-300 underline-offset-2"
        >
          {label}
        </a>
      );
    });
  });
};

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  let title = 'Политика конфиденциальности';
  let blocks: LegalBlock[] = privacyPolicyBlocks;

  if (type === 'offer') {
    title = 'Публичная оферта';
    blocks = offerBlocks;
  } else if (type === 'referral') {
    title = 'Партнерское (реферальное) соглашение (оферта)';
    blocks = referralBlocks;
  } else if (type === 'delivery') {
    title = 'Оферта — Доставка';
    blocks = deliveryBlocks;
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

        <div className="text-sm sm:text-base text-slate-600 space-y-3 leading-relaxed border-t border-slate-100 pt-6">
          {blocks.map((block, idx) => {
            const key = `lb-${idx}`;
            switch (block.t) {
              case 'h2':
                return (
                  <h2 key={key} className="text-lg sm:text-xl font-bold text-slate-900 pt-5 pb-1">
                    {renderInlineText(block.x, key)}
                  </h2>
                );
              case 'h3':
                return (
                  <h3 key={key} className="text-base font-semibold text-slate-900 pt-3">
                    {renderInlineText(block.x, key)}
                  </h3>
                );
              case 'h4':
                return (
                  <h4 key={key} className="text-sm font-semibold text-slate-800 pt-2">
                    {renderInlineText(block.x, key)}
                  </h4>
                );
              case 'def':
                return (
                  <p key={key} className="pl-4 border-l-2 border-orange-200">
                    <strong className="text-slate-800">{renderInlineText(block.term, `${key}-t`)}</strong> — {renderInlineText(block.x, key)}
                  </p>
                );
              case 'ul':
                return (
                  <ul key={key} className="list-disc pl-8 space-y-1">
                    {block.items.map((item, i2) => (
                      <li key={`${key}-${i2}`}>{renderInlineText(item, `${key}-${i2}`)}</li>
                    ))}
                  </ul>
                );
              default:
                return <p key={key}>{renderInlineText(block.x, key)}</p>;
            }
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { faqList } from '../../siteConfig';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

interface FAQPageProps {
  onOpenLeadModal: (requestType?: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onOpenLeadModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs = faqList.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-950 text-sm font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-orange-600" />
          <span>База знаний & FAQ</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">Вопросы и ответы</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Все об условиях работы, выкупе, проверке на складе, оплатах и доставке из Китая и по всему миру
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Поиск по базе знаний..."
          className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3.5 pl-11 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 shadow-xs"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* FAQ items */}
      <div className="space-y-3 pt-4">
        {filteredFaqs.map(faq => (
          <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full text-left p-5 font-bold text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:text-orange-600"
            >
              <span>{faq.question}</span>
              <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${openId === faq.id ? 'rotate-180 text-orange-600' : ''}`} />
            </button>

            {openId === faq.id && (
              <div className="px-5 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 border border-orange-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 max-w-2xl mx-auto shadow-md">
        <h3 className="text-lg font-bold text-slate-900">Не нашли ответ на ваш вопрос?</h3>
        <p className="text-sm text-slate-600">Наши менеджеры готовы проконсультировать вас по любому нестандартному грузу</p>
        <button
          onClick={() => onOpenLeadModal('Задать вопрос из FAQ')}
          className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md shadow-orange-600/25 cursor-pointer"
        >
          Связаться с менеджером
        </button>
      </div>

    </div>
  );
};

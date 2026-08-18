import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Handshake, 
  FileCheck2, 
  CheckCircle2, 
  Maximize2, 
  X,
  BadgeCheck
} from 'lucide-react';

interface OfficialLegalEntitySectionProps {
  onOpenLeadModal?: (requestType?: string) => void;
}

export const OfficialLegalEntitySection: React.FC<OfficialLegalEntitySectionProps> = ({
  onOpenLeadModal
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgSrc] = useState('/china-legal-license.jpg');
  const [hasImgError, setHasImgError] = useState(false);

  const chessCards = [
    {
      num: '01',
      icon: Building2,
      text: 'Являемся официальной компанией в Китае - 佛山星科拓贸易有限公司, зарегистрированной в г. Фошань.'
    },
    {
      num: '02',
      icon: Handshake,
      text: 'Имеем прямые контракты с китайскими поставщиками и фабриками.'
    },
    {
      num: '03',
      icon: FileCheck2,
      text: 'Лицензия подтверждает нашу легальную работу с поставщиками, фабриками и таможней.'
    },
    {
      num: '04',
      icon: ShieldCheck,
      text: 'Работаем без посредников – минимизируем риски и повышаем надежность сделок.'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>Юридическая чистота</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Мы работаем официально
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Гарантируем прозрачность сделок, юридическую чистоту и надежность доставки в соответствии с законодательством РФ и КНР.
          </p>
        </div>

        {/* License Certificate Container (1244x874 px, 257 kb spec) */}
        <div className="max-w-3xl mx-auto">
          <div 
            onClick={() => setIsZoomed(true)}
            className="relative w-full aspect-[1244/874] rounded-2xl overflow-hidden cursor-zoom-in bg-slate-50 border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            {!hasImgError ? (
              <img
                src={imgSrc}
                alt="Лицензия компании 佛山星科拓贸易有限公司 (г. Фошань, Китай)"
                onError={() => setHasImgError(true)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                loading="lazy"
              />
            ) : null}

            {/* Clean Document Placeholder if image file is not present */}
            {hasImgError && (
              <div className="absolute inset-0 bg-[#faf8f2] text-slate-900 p-6 sm:p-8 flex flex-col justify-between select-none border-4 border-amber-900/10">
                <div className="text-center space-y-1">
                  <div className="text-red-600 font-bold text-lg sm:text-2xl font-serif">★</div>
                  <div className="text-lg sm:text-2xl font-serif font-black tracking-widest text-slate-900 uppercase">
                    营业执照
                  </div>
                  <div className="text-[11px] text-slate-500 font-serif">
                    BUSINESS LICENSE OF ENTERPRISE LEGAL PERSON
                  </div>
                </div>

                <div className="bg-white/90 p-4 rounded-xl border border-amber-200/80 space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Компания:</span>
                    <strong className="text-slate-900 font-mono">佛山星科拓贸易有限公司</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-500">Город регистрации:</span>
                    <strong className="text-slate-900">г. Фошань, провинция Гуандун, КНР</strong>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-slate-500">Деятельность:</span>
                    <span className="text-slate-800 font-medium">Международная торговля, экспорт и логистика</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span>Государственный реестр КНР</span>
                  </div>
                  <div className="text-red-600 font-bold text-xs border border-red-500/30 px-2 py-0.5 rounded-full bg-red-50">
                    佛山星科拓贸易有限公司 · 印
                  </div>
                </div>
              </div>
            )}

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs sm:text-sm backdrop-blur-2xs">
              <Maximize2 className="w-4 h-4 text-orange-400" />
              <span>Нажмите для увеличения</span>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-400">
            Официальное свидетельство о регистрации: 佛山星科拓贸易有限公司 (г. Фошань, КНР)
          </div>
        </div>

        {/* 4 Text Blocks in Clean 2x2 Chessboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {chessCards.map((card, idx) => {
            const Icon = card.icon;
            const isHighlighted = idx === 0 || idx === 3;
            return (
              <div
                key={card.num}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isHighlighted 
                    ? 'bg-orange-50/50 border-orange-200/90 text-slate-900' 
                    : 'bg-slate-50/80 border-slate-200 text-slate-900'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isHighlighted ? 'bg-orange-100 text-orange-700' : 'bg-slate-200/70 text-slate-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-orange-600 font-mono">
                      #{card.num}
                    </span>
                  </div>
                  <p className="text-sm text-slate-800 leading-snug font-medium">
                    {card.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Clean Fullscreen Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div 
            className="relative max-w-4xl w-full bg-white rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <span>Лицензия: 佛山星科拓贸易有限公司 (г. Фошань, КНР)</span>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-[1244/874] rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center">
              {!hasImgError ? (
                <img
                  src={imgSrc}
                  alt="Лицензия компании 佛山星科拓贸易有限公司"
                  onError={() => setHasImgError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center space-y-4 bg-[#faf8f2] w-full h-full flex flex-col justify-center items-center">
                  <div className="text-2xl font-serif font-black text-slate-900">营业执照 (Лицензия КНР)</div>
                  <div className="text-base font-bold text-slate-800">佛山星科拓贸易有限公司</div>
                  <div className="text-sm text-slate-600">г. Фошань, провинция Гуандун, Китай</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

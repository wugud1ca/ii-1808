import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Trash2, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { LeadFormData } from '../../types';
import { trackEvent } from '../../utils/analytics';

interface LeadFormProps {
  initialRequestType?: string;
  onSuccessClose?: () => void;
  compact?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialRequestType = 'Общий запрос на расчет логистики',
  onSuccessClose,
  compact = false,
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    requestType: initialRequestType,
    productLinkOrName: '',
    weightKg: '',
    volumeM3: '',
    costEstimate: '',
    destinationCity: 'Москва',
    needsDocuments: false,
    comment: '',
    agreedToPolicy: true,
  });

  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper to load draft object safely
  const getStoredDraft = () => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('express_today_lead_draft') || localStorage.getItem('express_today_lead_draft_backup');
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('Error reading lead draft from localStorage', e);
    }
    return null;
  };

  // Auto-restore saved draft on mount or when requestType changes
  useEffect(() => {
    const draft = getStoredDraft();
    if (draft) {
      const hasContent = Boolean(
        (draft.name && draft.name.trim()) ||
        (draft.phone && draft.phone.trim()) ||
        (draft.productLinkOrName && draft.productLinkOrName.trim()) ||
        (draft.comment && draft.comment.trim()) ||
        draft.weightKg ||
        draft.volumeM3
      );

      if (hasContent) {
        setFormData(prev => ({
          ...prev,
          name: prev.name.trim() ? prev.name : (draft.name || ''),
          phone: prev.phone.trim() ? prev.phone : (draft.phone || ''),
          productLinkOrName: prev.productLinkOrName.trim() ? prev.productLinkOrName : (draft.productLinkOrName || ''),
          weightKg: prev.weightKg || draft.weightKg || '',
          volumeM3: prev.volumeM3 || draft.volumeM3 || '',
          costEstimate: prev.costEstimate || draft.costEstimate || '',
          destinationCity: prev.destinationCity || draft.destinationCity || 'Москва',
          needsDocuments: typeof draft.needsDocuments === 'boolean' ? draft.needsDocuments : prev.needsDocuments,
          comment: prev.comment.trim() ? prev.comment : (draft.comment || ''),
          requestType: initialRequestType || draft.requestType || prev.requestType,
        }));

        if (draft.weightKg || draft.volumeM3 || draft.comment || draft.productLinkOrName) {
          setShowDetails(true);
        }
      }
    }
  }, [initialRequestType]);

  // Parse UTM params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    setFormData(prev => ({
      ...prev,
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
      utm_content: urlParams.get('utm_content') || undefined,
      utm_term: urlParams.get('utm_term') || undefined,
    }));
  }, []);

  useEffect(() => {
    if (initialRequestType) {
      setFormData(prev => ({ ...prev, requestType: initialRequestType }));
    }
  }, [initialRequestType]);

  // Save unsubmitted draft to localStorage whenever fields change
  useEffect(() => {
    if (typeof window !== 'undefined' && !submitted) {
      try {
        const draftToSave = {
          name: formData.name,
          phone: formData.phone,
          productLinkOrName: formData.productLinkOrName,
          weightKg: formData.weightKg,
          volumeM3: formData.volumeM3,
          costEstimate: formData.costEstimate,
          destinationCity: formData.destinationCity,
          needsDocuments: formData.needsDocuments,
          comment: formData.comment,
          requestType: formData.requestType,
        };
        const hasContent = Object.values(draftToSave).some(val => 
          typeof val === 'string' ? val.trim().length > 0 : Boolean(val)
        );

        if (hasContent) {
          localStorage.setItem('express_today_lead_draft', JSON.stringify(draftToSave));
          localStorage.setItem('express_today_lead_draft_backup', JSON.stringify(draftToSave));
        }
      } catch (err) {
        console.warn('Could not save lead form draft', err);
      }
    }
  }, [formData, submitted]);

  // Manual reset
  const handleResetForm = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('express_today_lead_draft');
      } catch (e) {}
    }

    setFormData({
      name: '',
      phone: '',
      requestType: initialRequestType,
      productLinkOrName: '',
      weightKg: '',
      volumeM3: '',
      costEstimate: '',
      destinationCity: 'Москва',
      needsDocuments: false,
      comment: '',
      agreedToPolicy: true,
    });
    setShowDetails(false);
  };

  const getUrlMetadata = () => {
    if (typeof window === 'undefined') {
      return {
        pageUrl: '',
        queryString: '',
        utmParams: {},
        referrer: '',
      };
    }

    const pageUrl = window.location.href;
    const queryString = window.location.search;
    const referrer = document.referrer || '';
    const utmParams: Record<string, string> = {};

    try {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) => {
        utmParams[key] = value;
      });
    } catch (err) {
      console.warn('Error parsing URL search params:', err);
    }

    return {
      pageUrl,
      queryString,
      utmParams,
      referrer,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Пожалуйста, укажите ваше имя');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      setErrorMessage('Пожалуйста, введите корректный номер телефона');
      return;
    }
    if (!formData.agreedToPolicy) {
      setErrorMessage('Необходимо согласие на обработку персональных данных');
      return;
    }

    setLoading(true);
    trackEvent('lead_submit', { requestType: formData.requestType });

    const urlMeta = getUrlMetadata();
    const payload = {
      ...formData,
      ...urlMeta,
      timestamp: new Date().toISOString(),
    };

    try {
      const endpoint = siteConfig.api.leadEndpoint || '/api/lead';
      console.log(`Sending lead payload to endpoint: ${endpoint}`, payload);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`Endpoint ${endpoint} returned status ${res.status}`);
      }

      // Direct client backup call to Telegram bot API to guarantee delivery
      try {
        const botToken = '614478298:AAFM1bFmrCerHEuGKMmqnSlFWhfNPGjgt6g';
        const chatId = '614478298';

        let msg = `🚀 <b>НОВАЯ ЗАЯВКА С САЙТА EXPRESS TODAY</b>\n\n`;
        if (payload.requestType) msg += `📋 <b>Тип:</b> ${payload.requestType}\n`;
        if (payload.name) msg += `👤 <b>Имя:</b> ${payload.name}\n`;
        if (payload.phone) msg += `📞 <b>Тел:</b> <code>${payload.phone}</code>\n`;

        const details = [];
        if (payload.weightKg) details.push(`• Вес: ${payload.weightKg} кг`);
        if (payload.volumeM3) details.push(`• Объем: ${payload.volumeM3} м³`);
        if (payload.costEstimate) details.push(`• Оценка стоимости: ${payload.costEstimate}`);
        if (payload.destinationCity) details.push(`• Город назначения: ${payload.destinationCity}`);
        if (payload.needsDocuments) details.push(`• С документами: ${payload.needsDocuments ? 'Да' : 'Нет'}`);

        if (details.length > 0) msg += `\n📦 <b>Детали груза:</b>\n${details.join('\n')}\n`;
        if (payload.comment) msg += `\n💬 <b>Комментарий / Запрос:</b>\n${payload.comment}\n`;

        msg += `\n🌐 <b>ИСТОЧНИК И МЕТКИ URL:</b>\n`;
        msg += `🔗 <b>URL страницы:</b> ${payload.pageUrl || 'Не указан'}\n`;
        msg += `❓ <b>Строка параметров URL (?):</b>\n<code>${payload.queryString || '(нет)'}</code>\n`;

        if (payload.utmParams && Object.keys(payload.utmParams).length > 0) {
          msg += `\n🎯 <b>UTM-метки:</b>\n`;
          for (const [k, v] of Object.entries(payload.utmParams)) {
            msg += `• <b>${k}:</b> ${v}\n`;
          }
        }

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: msg,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          }),
        }).catch(err => console.warn('Client telegram backup request note:', err));
      } catch (tgErr) {
        console.warn('Client telegram backup note:', tgErr);
      }

      setLoading(false);
      setSubmitted(true);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('express_today_lead_draft');
      }

      if (onSuccessClose) {
        setTimeout(onSuccessClose, 3500);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз или позвоните нам.');
      trackEvent('lead_error', { error: err?.message });
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Заявка успешно принята!</h3>
        <p className="text-sm text-slate-700 leading-relaxed max-w-md mx-auto">
          Спасибо, запрос принят. Менеджер Express Today свяжется с вами по указанному номеру для уточнения всех деталей и предоставления точного расчета.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('express_today_lead_draft');
            }
            setFormData(prev => ({
              ...prev,
              name: '',
              phone: '',
              productLinkOrName: '',
              weightKg: '',
              volumeM3: '',
              costEstimate: '',
              comment: '',
            }));
          }}
          className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950 transition-colors pt-2 cursor-pointer"
        >
          Отправить еще один запрос
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-sm text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Name & Phone Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Ваше имя <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Иван Петров"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Номер телефона <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            required
            placeholder="+7 (999) 000-00-00"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      {/* Optional Cargo Details Collapsible Block */}
      {!compact && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowDetails(prev => !prev)}
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 text-xs font-semibold text-slate-700 transition-all flex items-center justify-between cursor-pointer group select-none"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-orange-600 group-hover:rotate-45 transition-transform" />
              <span>{showDetails ? 'Скрыть дополнительные детали' : '+ Указать детали груза (вес, объем, город, комментарий)'}</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDetails ? 'rotate-180 text-orange-600' : ''}`} />
          </button>

          {showDetails && (
            <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-200 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-200/70">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Вес (кг)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={formData.weightKg}
                    onChange={e => setFormData({ ...formData, weightKg: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Объем (м³)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.8"
                    value={formData.volumeM3}
                    onChange={e => setFormData({ ...formData, volumeM3: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Город назначения</label>
                  <input
                    type="text"
                    placeholder="Москва"
                    value={formData.destinationCity}
                    onChange={e => setFormData({ ...formData, destinationCity: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="needsDocuments"
                  checked={formData.needsDocuments}
                  onChange={e => setFormData({ ...formData, needsDocuments: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="needsDocuments" className="text-xs text-slate-700 cursor-pointer font-medium select-none">
                  Нужны официальные закрывающие документы (ГТД, ДТ, НДС)
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Комментарий или ссылка на товар
                </label>
                <textarea
                  rows={2}
                  placeholder="Ссылка на товар, запрос на поиск, пожелания по упаковке, срокам или вопросу к поставщику..."
                  value={formData.comment}
                  onChange={e => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-orange-500 leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Privacy Agreement */}
      <div className="flex items-start gap-2 pt-0.5">
        <input
          type="checkbox"
          id="agreedToPolicy"
          required
          checked={formData.agreedToPolicy}
          onChange={e => setFormData({ ...formData, agreedToPolicy: e.target.checked })}
          className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 mt-0.5 cursor-pointer"
        />
        <label htmlFor="agreedToPolicy" className="text-xs text-slate-600 leading-tight cursor-pointer select-none">
          Согласен на обработку персональных данных в соответствии с{' '}
          <a
            href={siteConfig.documents.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline hover:text-orange-800 font-medium"
          >
            Политикой конфиденциальности
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98 text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Отправка запроса...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Получить точный расчет</span>
          </>
        )}
      </button>

      <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 pt-0.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Конфиденциально. Запрос будет направлен персональному менеджеру.</span>
      </div>

      {/* Auto-save draft status & safe reset action */}
      {(formData.name.trim() || formData.phone.trim() || formData.comment.trim() || formData.weightKg.trim()) && (
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1.5 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Черновик сохранен
          </span>
          <button
            type="button"
            onClick={handleResetForm}
            className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
            title="Очистить форму"
          >
            <Trash2 className="w-3 h-3" />
            <span>Очистить форму</span>
          </button>
        </div>
      )}
    </form>
  );
};

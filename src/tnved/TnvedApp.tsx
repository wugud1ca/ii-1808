import React, { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import {
  Search,
  Calculator,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Layers,
  Info,
  PhoneCall,
  QrCode,
  FileCheck,
  ChevronRight,
  ChevronDown,
  Building2,
  Globe2,
  BookOpen,
  HelpCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  Scale,
  TrendingUp,
  X,
} from 'lucide-react';

import {
  POPULAR_TNVED_PRODUCTS,
  CUSTOMS_FEES_TIERS,
  TNVED_FAQ,
  calculateCustomsFee,
  type TnvedProductItem,
} from './tnvedData';
import { api, formatCurrencyRub, formatDateTime, parsePositiveDecimal, ApiError } from './api';
import type {
  CalculationRequest,
  CalculationResponse,
  ItsResponse,
  CardResponse,
  ExchangeRatesResponse,
  SearchItem,
  SearchResponse,
} from './types';

export { parsePositiveDecimal };

export interface CalcFields {
  customsValueRub: string;
  weightKg: string;
  quantity: string;
  volumeM3: string;
  eurRub: string;
  usdRub: string;
}

export function buildCalculationRequest(
  card: CardResponse,
  fields: CalcFields,
  confirmed: boolean,
): { request: CalculationRequest | null; errors: Record<string, string> } {
  if (!/^\d{10}$/.test(card.code)) return { request: null, errors: { form: 'Некорректный код ТН ВЭД.' } };
  if (!card.estimation.supported) return { request: null, errors: { form: card.estimation.reason || 'Расчёт по этому коду недоступен.' } };
  if (!confirmed) return { request: null, errors: {} };
  const errors: Record<string, string> = {};
  const request: CalculationRequest = { code: card.code, customsValueRub: 0, confirmedBaseRates: true };
  const value = parsePositiveDecimal(fields.customsValueRub);
  if (value === null) errors.customsValueRub = 'Укажите таможенную стоимость в рублях.'; else request.customsValueRub = value;
  for (const input of card.estimation.requiredInputs) {
    if (input === 'weightKg') {
      const w = parsePositiveDecimal(fields.weightKg);
      if (w === null) errors.weightKg = 'Укажите вес брутто в кг.'; else request.weightKg = w;
    } else if (input === 'quantity') {
      const q = parsePositiveDecimal(fields.quantity);
      if (q === null || !Number.isInteger(q)) errors.quantity = `Укажите целое количество (${card.estimation.measureUnit || 'шт'}).`; else request.quantity = q;
    } else if (input === 'volumeM3') {
      const v = parsePositiveDecimal(fields.volumeM3);
      if (v === null) errors.volumeM3 = 'Укажите объём в м³.'; else request.volumeM3 = v;
    } else if (input === 'eurRate') {
      const r = parsePositiveDecimal(fields.eurRub);
      if (r === null) errors.eurRub = 'Укажите курс евро к рублю.'; else request.eurRub = r;
    } else if (input === 'usdRate') {
      const r = parsePositiveDecimal(fields.usdRub);
      if (r === null) errors.usdRub = 'Укажите курс доллара к рублю.'; else request.usdRub = r;
    }
  }
  if (Object.keys(errors).length > 0) return { request: null, errors };
  return { request, errors: {} };
}

interface TnvedAppProps {
  embedded?: boolean;
  onOpenLeadModal?: (requestType?: string) => void;
}


type MainTab = 'calculator' | 'chestny_znak' | 'permits' | 'duties_kts' | 'faq';

const EXAMPLE_CHIPS = [
  { label: 'стул', query: 'стул' },
  { label: 'кроссовки', query: 'кроссовки' },
  { label: '9401790009', query: '9401790009' },
  { label: '6402999800', query: '6402999800' },
  { label: '8517130000 (смартфоны)', query: '8517130000' },
  { label: '6109100000 (футболки)', query: '6109100000' },
];

export default function TnvedApp({ embedded = false, onOpenLeadModal }: TnvedAppProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<MainTab>('calculator');

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);

  // Search results list state
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showAllResults, setShowAllResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Active Code Card state
  const [activeCard, setActiveCard] = useState<CardResponse | null>(null);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Indicative price (UN Comtrade) for the open card
  const [itsData, setItsData] = useState<ItsResponse | null>(null);
  const itsSeqRef = useRef(0);

  // Код, выбранный из подсказок/списка как группа (для заголовка «Подгруппы кода …»)
  const [selectedGroup, setSelectedGroup] = useState<{ code: string; name: string } | null>(null);

  // Accordion state for Requirements
  const [openAccordions, setOpenAccordions] = useState<Record<number, boolean>>({});

  // CBR exchange rates
  const [exchangeRates, setExchangeRates] = useState<ExchangeRatesResponse | null>(null);
  const [apiReady, setApiReady] = useState<boolean | null>(null);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);

  // Calculator Form state
  const [calcInputs, setCalcInputs] = useState<{
    customsValueRub: string;
    weightKg: string;
    quantity: string;
    volumeM3: string;
    eurRub: string;
    usdRub: string;
    confirmedBaseRates: boolean;
  }>({
    customsValueRub: '100000',
    weightKg: '50',
    quantity: '100',
    volumeM3: '1',
    eurRub: '',
    usdRub: '',
    confirmedBaseRates: true,
  });

  const [eurRateModifiedByUser, setEurRateModifiedByUser] = useState(false);
  const [usdRateModifiedByUser, setUsdRateModifiedByUser] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState<CalculationResponse | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  // KTS interactive risk state
  const [ktsPriceUsd, setKtsPriceUsd] = useState<string>('6000');
  const [ktsWeightKg, setKtsWeightKg] = useState<string>('400');

  // FAQ state
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const cardSectionRef = useRef<HTMLDivElement>(null);

  // 1. Initial Load: Check session and fetch CBR rates
  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const session = await api.session();
        if (active) setApiReady(session.ready);
      } catch {
        if (active) setApiReady(false);
      }

      try {
        const rates = await api.rates();
        if (active && rates) {
          setExchangeRates(rates);
          setCalcInputs((prev) => ({
            ...prev,
            eurRub: prev.eurRub || rates.eurRub.toFixed(4),
            usdRub: prev.usdRub || rates.usdRub.toFixed(4),
          }));
        }
      } catch {
        // Fallback default
      }
    }

    init();
    return () => {
      active = false;
    };
  }, []);

  // Rate limit countdown effect
  useEffect(() => {
    if (rateLimitCountdown === null || rateLimitCountdown <= 0) return;
    const timer = setInterval(() => {
      setRateLimitCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [rateLimitCountdown]);

  // Load default test item "9401790009" on mount
  useEffect(() => {
    loadCard('9401790009', false);
    // Also perform initial search for "стул" so the left list is populated
    executeSearch('стул', 1, false);
  }, []);

  // 2. Autocomplete Debounce (500ms)
  useEffect(() => {
    const q = searchQuery.trim();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (q.length < 2) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      setIsSearchingSuggestions(false);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const res = await api.search(q, 1);
        // Show up to 8 items in autocomplete dropdown
        const top8 = res.items.slice(0, 8);
        setSuggestions(top8);
        setSuggestionsOpen(top8.length > 0);
        setActiveSuggestionIndex(-1);
      } catch (err) {
        if (err instanceof ApiError && err.status === 429) {
          setRateLimitCountdown(err.retryAfter || 60);
        }
        setSuggestions([]);
        setSuggestionsOpen(false);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Click outside suggestions listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Search Executor
  const executeSearch = async (queryText: string, page = 1, scrollToCard = false) => {
    const q = queryText.trim();
    if (!q) return;

    setIsSearchLoading(true);
    setSearchError(null);
    setCurrentPage(page);
    setShowAllResults(false);

    try {
      const res = await api.search(q, page);
      setSearchResults(res);

      // If exact 10-digit code search or single leaf result, automatically load its card
      if (res.items.length > 0) {
        const exact = res.items.find((item) => item.code === q && item.isLeaf);
        const target = exact || (page === 1 && res.items[0].isLeaf ? res.items[0] : null);
        if (target) {
          await loadCard(target.code, scrollToCard);
        }
      }
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 429) {
        setRateLimitCountdown(err.retryAfter || 60);
        setSearchError(`Слишком много запросов. Подождите ${err.retryAfter || 60} сек.`);
      } else {
        setSearchError(err?.message || 'Не удалось выполнить поиск. Попробуйте ещё раз.');
      }
      setSearchResults(null);
    } finally {
      setIsSearchLoading(false);
    }
  };

  // 4. Card Loader
  const loadCard = async (code: string, shouldScroll = true) => {
    if (!/^\d{10}$/.test(code)) return;

    setIsCardLoading(true);
    setCardError(null);
    setCalcResult(null);
    setCalcError(null);

    try {
      const card = await api.card(code);
      setActiveCard(card);
      setItsData(null);
      const itsSeq = ++itsSeqRef.current;
      api.its(code)
        .then((d) => { if (d.found && itsSeqRef.current === itsSeq) setItsData(d); })
        .catch(() => { /* ориентир — не критично */ });

      // Requirements accordions stay collapsed until the user opens them
      setOpenAccordions({});

      // Scroll to card section if requested
      if (shouldScroll && cardSectionRef.current) {
        cardSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 429) {
        setRateLimitCountdown(err.retryAfter || 60);
        setCardError(`Слишком много запросов. Подождите ${err.retryAfter || 60} сек.`);
      } else {
        setCardError(err?.message || 'Не удалось загрузить карточку кода ТН ВЭД.');
      }
      setActiveCard(null);
    } finally {
      setIsCardLoading(false);
    }
  };

  // Handle Form Submission
  const handleSearchSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    setSuggestionsOpen(false);
    setSelectedGroup(null);
    if (!searchQuery.trim()) return;
    executeSearch(searchQuery, 1, true);
  };

  // Keyboard navigation inside Autocomplete suggestions
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        e.preventDefault();
        const selected = suggestions[activeSuggestionIndex];
        selectSuggestion(selected);
      }
    } else if (e.key === 'Escape') {
      setSuggestionsOpen(false);
    }
  };

  // Select a suggestion item
  const selectSuggestion = (item: SearchItem) => {
    setSearchQuery(item.code);
    setSuggestionsOpen(false);
    if (item.isLeaf) {
      setSelectedGroup(null);
      setSearchResults(null); // сброс прошлой выдачи
      loadCard(item.code, true);
    } else {
      setSelectedGroup({ code: item.code, name: item.name });
      executeSearch(item.code, 1, true);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // Fallback
    }
  };

  // Toggle Accordion Group
  const toggleAccordion = (type: number) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  // 5. Calculator Form Handler
  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeCard) return;

    if (!activeCard.estimation.supported) {
      setCalcError(activeCard.estimation.reason || 'Расчёт по данному коду не поддерживается онлайн.');
      return;
    }

    if (!calcInputs.confirmedBaseRates) {
      setCalcError('Подтвердите условия расчёта (флажок обязателен).');
      return;
    }

    const customsVal = parsePositiveDecimal(calcInputs.customsValueRub);
    if (customsVal === null) {
      setCalcError('Укажите корректную таможенную стоимость в рублях.');
      return;
    }

    const req: CalculationRequest = {
      code: activeCard.code,
      customsValueRub: customsVal,
      confirmedBaseRates: true,
    };

    // Include dynamically required fields
    for (const inputKey of activeCard.estimation.requiredInputs) {
      if (inputKey === 'weightKg') {
        const w = parsePositiveDecimal(calcInputs.weightKg);
        if (w === null) {
          setCalcError('Укажите вес брутто в кг.');
          return;
        }
        req.weightKg = w;
      } else if (inputKey === 'quantity') {
        const q = parsePositiveDecimal(calcInputs.quantity);
        if (q === null || !Number.isInteger(q)) {
          setCalcError(`Укажите целое количество (${activeCard.estimation.measureUnit || 'шт'}).`);
          return;
        }
        req.quantity = q;
      } else if (inputKey === 'volumeM3') {
        const v = parsePositiveDecimal(calcInputs.volumeM3);
        if (v === null) {
          setCalcError('Укажите объём в м³.');
          return;
        }
        req.volumeM3 = v;
      } else if (inputKey === 'eurRate') {
        const r = parsePositiveDecimal(calcInputs.eurRub);
        if (r === null) {
          setCalcError('Укажите курс евро к рублю.');
          return;
        }
        req.eurRub = r;
      } else if (inputKey === 'usdRate') {
        const r = parsePositiveDecimal(calcInputs.usdRub);
        if (r === null) {
          setCalcError('Укажите курс доллара к рублю.');
          return;
        }
        req.usdRub = r;
      }
    }

    setIsCalculating(true);
    setCalcError(null);

    try {
      const response = await api.calculate(req);
      setCalcResult(response);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 429) {
        setRateLimitCountdown(err.retryAfter || 60);
        setCalcError(`Слишком много запросов. Подождите ${err.retryAfter || 60} сек.`);
      } else {
        setCalcError(err?.message || 'Не удалось выполнить расчёт таможенных платежей.');
      }
      setCalcResult(null);
    } finally {
      setIsCalculating(false);
    }
  };

  // Filtered FAQ items
  const filteredFaq = useMemo(() => {
    return TNVED_FAQ.filter((item) => {
      const matchesCat = faqCategory === 'all' || item.category === faqCategory;
      if (!matchesCat) return false;
      if (!faqSearch.trim()) return true;
      const q = faqSearch.toLowerCase();
      return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
    });
  }, [faqCategory, faqSearch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* 1. HERO & SEARCH HEADER */}
      <section className="relative z-30 overflow-visible bg-gradient-to-b from-slate-900 via-slate-900 to-slate-850 pt-8 pb-12 text-white">
        {/* Background pattern contained within an overflow-hidden absolute layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Badge */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-blue-300 ring-1 ring-blue-500/30">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              ТН ВЭД & Таможенный расчёт
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="text-slate-400">База TKS 2026</span>
            {exchangeRates && (
              <>
                <span className="hidden sm:inline text-slate-500">•</span>
                <span className="text-emerald-400 font-medium">
                  Курс ЦБ ({exchangeRates.date}): EUR {exchangeRates.eurRub.toFixed(2)} ₽ · USD {exchangeRates.usdRub.toFixed(2)} ₽ · CNY {exchangeRates.cnyRub.toFixed(2)} ₽
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            ТН ВЭД — подбор кода и расчёт пошлины и НДС
          </h1>
          <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
            Официальный классификатор ЕАЭС, ставки таможенных пошлин, базовый НДС, акцизы,
            обязательная маркировка <strong className="text-white">«Честный Знак»</strong> и требования к сертификации.
          </p>

          {/* Rate limit warning banner */}
          {rateLimitCountdown !== null && (
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-500/20 p-4 text-amber-200 ring-1 ring-amber-500/40">
              <Clock className="h-5 w-5 flex-shrink-0 animate-spin text-amber-400" />
              <div>
                <p className="font-semibold text-sm">Превышен лимит запросов к базе ТКС (90 запр./мин)</p>
                <p className="text-xs text-amber-300">
                  Пожалуйста, подождите {rateLimitCountdown} сек. перед следующим поиском.
                </p>
              </div>
            </div>
          )}

          {/* Search Box with 500ms Debounce and Autocomplete Dropdown */}
          <div className="mt-8 relative z-50 max-w-4xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex flex-col sm:flex-row shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-blue-600 transition-all">
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (suggestions.length > 0) setSuggestionsOpen(true);
                    }}
                    placeholder="Введите название товара (напр. «стул», «кроссовки») или код (напр. 9401790009)…"
                    className="w-full pl-12 pr-10 py-3.5 text-slate-900 placeholder-slate-400 text-sm sm:text-base focus:outline-none"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        setSuggestionsOpen(false);
                      }}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSearchLoading || isSearchingSuggestions}
                  className="mt-2 sm:mt-0 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-75 shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {isSearchLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Поиск…</span>
                    </>
                  ) : (
                    <>
                      <span>Найти</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Autocomplete Suggestions Dropdown (Up to 8 items, keyboard accessible, elevated z-index) */}
            {suggestionsOpen && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/15 border border-slate-200 overflow-hidden divide-y divide-slate-100"
                style={{ zIndex: 9999 }}
              >
                <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Подсказки из базы ТКС</span>
                  <span className="text-[10px] text-slate-400">↑↓ выбор · Enter открыть · Esc закрыть</span>
                </div>
                <ul className="max-h-80 overflow-y-auto py-1">
                  {suggestions.map((item, idx) => {
                    const isSelected = idx === activeSuggestionIndex;
                    return (
                      <li key={`${item.code}-${idx}`}>
                        <button
                          type="button"
                          onClick={() => selectSuggestion(item)}
                          className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                            isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {item.code}
                              </span>
                              {item.isLeaf && (
                                <span className="text-[10px] font-semibold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                  10 знаков
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs sm:text-sm line-clamp-1 font-medium text-slate-700">
                              {item.name}
                            </p>
                          </div>
                          {item.examples !== null && (
                            <span className="text-xs font-medium text-slate-400 flex-shrink-0">
                              {item.examples} декл.
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Quick Example Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Примеры для проверки:</span>
              {EXAMPLE_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(chip.query);
                    executeSearch(chip.query, 1, true);
                  }}
                  className="rounded-lg bg-slate-800/90 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-200 ring-1 ring-slate-700 transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Nav Subtabs (Clear high-contrast buttons) */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'calculator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400/50'
                  : 'bg-slate-850 text-slate-100 hover:bg-slate-750 hover:text-white border border-slate-700/80 shadow-sm'
              }`}
            >
              <Calculator className={`h-4 w-4 ${activeTab === 'calculator' ? 'text-white' : 'text-blue-400'}`} />
              <span>Подбор кода и расчёт</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chestny_znak')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'chestny_znak'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400/50'
                  : 'bg-slate-850 text-slate-100 hover:bg-slate-750 hover:text-white border border-slate-700/80 shadow-sm'
              }`}
            >
              <QrCode className={`h-4 w-4 ${activeTab === 'chestny_znak' ? 'text-white' : 'text-emerald-400'}`} />
              <span>Честный Знак & Маркировка</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('permits')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'permits'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400/50'
                  : 'bg-slate-850 text-slate-100 hover:bg-slate-750 hover:text-white border border-slate-700/80 shadow-sm'
              }`}
            >
              <FileCheck className={`h-4 w-4 ${activeTab === 'permits' ? 'text-white' : 'text-amber-400'}`} />
              <span>Разрешительные документы</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('duties_kts')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'duties_kts'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400/50'
                  : 'bg-slate-850 text-slate-100 hover:bg-slate-750 hover:text-white border border-slate-700/80 shadow-sm'
              }`}
            >
              <Scale className={`h-4 w-4 ${activeTab === 'duties_kts' ? 'text-white' : 'text-purple-400'}`} />
              <span>Пошлины, сборы и КТС</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40 ring-1 ring-blue-400/50'
                  : 'bg-slate-850 text-slate-100 hover:bg-slate-750 hover:text-white border border-slate-700/80 shadow-sm'
              }`}
            >
              <HelpCircle className={`h-4 w-4 ${activeTab === 'faq' ? 'text-white' : 'text-cyan-400'}`} />
              <span>Вопросы и ответы (FAQ)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* TAB 1: CALCULATOR & CODE SEARCH WORKSPACE */}
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            {/* Search error alert */}
            {searchError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">Ошибка поиска</p>
                  <p className="text-xs text-red-700 mt-0.5">{searchError}</p>
                </div>
              </div>
            )}

            {/* 2-Column Responsive Layout (Section 7.7) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Search Results (Section 7.3: First 5 items + "Показать ещё" + pagination) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                    <Layers className="h-5 w-5 text-blue-600" />
                    <span>{selectedGroup ? `Подгруппы кода ${selectedGroup.code}` : 'Результаты поиска'}</span>
                    {selectedGroup && (
                      <span className="text-xs font-medium text-slate-500 max-w-[260px] truncate" title={selectedGroup.name}>
                        {selectedGroup.name}
                      </span>
                    )}
                    {searchResults && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {searchResults.total}
                      </span>
                    )}
                  </h2>
                  {searchResults?.source && (
                    <span className="text-xs text-slate-500">
                      Источник: {searchResults.source}
                    </span>
                  )}
                </div>

                {/* Loading state for search list */}
                {isSearchLoading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="h-4 w-32 bg-slate-200 rounded mb-2" />
                        <div className="h-3 w-full bg-slate-100 rounded mb-1" />
                        <div className="h-3 w-2/3 bg-slate-100 rounded" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty result state */}
                {!isSearchLoading && searchResults && searchResults.items.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <Info className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700 text-sm">Ничего не найдено</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Попробуйте изменить формулировку, указать общее название категории или код товарной группы.
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenLeadModal?.('Подбор кода ТН ВЭД по товару: ' + searchQuery)}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <PhoneCall className="h-3.5 w-3.5" />
                      <span>Подобрать с декларантом</span>
                    </button>
                  </div>
                )}

                {/* Items List (Initial 5 items visible + "Показать ещё" button) */}
                {!isSearchLoading && searchResults && searchResults.items.length > 0 && (
                  <div className="space-y-3">
                    {(() => {
                      const visibleItems = showAllResults
                        ? searchResults.items
                        : searchResults.items.slice(0, 5);

                      return visibleItems.map((item) => {
                        const isCurrentActive = activeCard?.code === item.code;
                        return (
                          <div
                            key={item.code}
                            onClick={() => {
                              if (item.isLeaf) {
                                loadCard(item.code, true);
                              } else {
                                setSelectedGroup({ code: item.code, name: item.name });
                                executeSearch(item.code, 1, true);
                              }
                            }}
                            className={`group cursor-pointer rounded-2xl border p-4 transition-all ${
                              isCurrentActive
                                ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600'
                                : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-sm tracking-wider text-slate-900 group-hover:text-blue-600">
                                    {item.code}
                                  </span>
                                  {item.isLeaf ? (
                                    <span className="text-[10px] font-semibold uppercase text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                      Код товара
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold uppercase text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                      Группа
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-xs sm:text-sm font-medium text-slate-700 line-clamp-2 leading-relaxed">
                                  {item.name}
                                </p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0 mt-1" />
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                              <span>
                                {item.examples !== null
                                  ? `${item.examples} деклараций в базе`
                                  : 'Подкатегория дерева'}
                              </span>
                              <span className="font-semibold text-blue-600 group-hover:underline">
                                {isCurrentActive ? 'Выбран ✓' : 'Открыть карточку →'}
                              </span>
                            </div>
                          </div>
                        );
                      });
                    })()}

                    {/* Show more button if page items > 5 */}
                    {searchResults.items.length > 5 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAllResults((prev) => !prev)}
                          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {showAllResults ? (
                            <>
                              <span>Свернуть список (показывать 5)</span>
                              <ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
                            </>
                          ) : (
                            <>
                              <span>Показать ещё ({searchResults.items.length - 5})</span>
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Pagination (Section 7.3) */}
                    {(searchResults.hasMore || searchResults.page > 1) && (
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs">
                        <button
                          type="button"
                          disabled={searchResults.page <= 1 || isSearchLoading}
                          onClick={() => executeSearch(searchResults.query, searchResults.page - 1, false)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        >
                          ← Назад
                        </button>
                        <span className="font-semibold text-slate-600">
                          Страница {searchResults.page} (всего {searchResults.total} поз.)
                        </span>
                        <button
                          type="button"
                          disabled={!searchResults.hasMore || isSearchLoading}
                          onClick={() => executeSearch(searchResults.query, searchResults.page + 1, false)}
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                        >
                          Дальше →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Code Card & Calculator (Section 7.4) */}
              <div ref={cardSectionRef} className="lg:col-span-7 space-y-6">
                {/* Card Loading skeleton */}
                {isCardLoading && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm animate-pulse space-y-6">
                    <div className="h-6 w-3/4 bg-slate-200 rounded" />
                    <div className="h-10 w-48 bg-slate-200 rounded" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="h-20 bg-slate-100 rounded-xl" />
                      <div className="h-20 bg-slate-100 rounded-xl" />
                      <div className="h-20 bg-slate-100 rounded-xl" />
                    </div>
                    <div className="h-32 bg-slate-100 rounded-2xl" />
                  </div>
                )}

                {/* Card Error banner */}
                {cardError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <span className="font-bold">Ошибка загрузки карточки</span>
                    </div>
                    <p className="text-sm">{cardError}</p>
                    <button
                      type="button"
                      onClick={() => activeCard && loadCard(activeCard.code, false)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:underline"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Повторить запрос</span>
                    </button>
                  </div>
                )}

                {/* Active Code Card Content */}
                {!isCardLoading && activeCard && (
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-8">
                    {/* Top: Product Name, Code, Badges, Copy button */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          База ТКС {activeCard.version || '2026'}
                        </span>
                        {activeCard.active ? (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Действующий
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Срок действия ограничен
                          </span>
                        )}
                        {(activeCard.validFrom || activeCard.validTo) && (
                          <span className="text-xs text-slate-500">
                            {activeCard.validFrom && `с ${activeCard.validFrom}`}
                            {activeCard.validTo && ` по ${activeCard.validTo}`}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                        {activeCard.name}
                      </h3>

                      {/* Code + Copy Button */}
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-white shadow-md">
                          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Код ТН ВЭД:</span>
                          <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-blue-400">
                            {activeCard.code}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(activeCard.code)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          {copiedCode === activeCard.code ? (
                            <>
                              <Check className="h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-700">Скопировано!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 text-slate-500" />
                              <span>Скопировать код</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* 3 Rate Tiles (Section 3.1 & 7.4: Пошлина, НДС, Акциз) */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Базовые ставки таможенных платежей
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* 1. Пошлина */}
                        <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
                          <p className="text-xs font-semibold text-blue-700">Ввозная пошлина</p>
                          <p className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-slate-900">
                            {activeCard.rates.importDuty.text}
                          </p>
                          {activeCard.rates.importDuty.notes.length > 0 && (
                            <p className="mt-1 text-[11px] text-slate-600">
                              {activeCard.rates.importDuty.notes.join(' ')}
                            </p>
                          )}
                        </div>

                        {/* 2. НДС */}
                        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                          <p className="text-xs font-semibold text-emerald-700">Ставка НДС</p>
                          <p className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-slate-900">
                            {activeCard.rates.vat.text}
                          </p>
                          {activeCard.rates.vat.notes.length > 0 && (
                            <p className="mt-1 text-[10px] text-emerald-800/80 leading-tight">
                              Есть льготные категории (10% или 0%)
                            </p>
                          )}
                        </div>

                        {/* 3. Акциз */}
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p className="text-xs font-semibold text-slate-600">Акциз</p>
                          <p className="mt-1 font-mono text-lg sm:text-xl font-extrabold text-slate-900">
                            {activeCard.rates.excise.text}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500">
                            {activeCard.rates.excise.text === 'нет'
                              ? 'Не облагается'
                              : 'Взимается по ставке'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Yellow Warnings Box (Section 7.4) */}
                    {activeCard.warnings && activeCard.warnings.length > 0 && (
                      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1 text-xs sm:text-sm">
                          <p className="font-bold text-amber-950">Особенности расчёта ставок</p>
                          {activeCard.warnings.map((w, idx) => (
                            <p key={idx} className="leading-relaxed">
                              • {w}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CALCULATOR BLOCK (Section 3.3, 4, 7.4) */}
                    <div className="border-t border-slate-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-blue-600" />
                          <span>Калькулятор пошлины и НДС</span>
                        </h4>
                        <span className="text-xs text-slate-500">
                          Китай · базовые ставки
                        </span>
                      </div>

                      {/* If calculation is not supported for this code */}
                      {!activeCard.estimation.supported ? (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center space-y-3">
                          <Info className="h-6 w-6 text-slate-400 mx-auto" />
                          <p className="font-semibold text-sm text-slate-800">
                            {activeCard.estimation.reason || 'Автоматический расчёт недоступен для данного кода.'}
                          </p>
                          <p className="text-xs text-slate-500 max-w-md mx-auto">
                            Специфика ставки или нетарифные ограничения требуют индивидуальной проверки документов специалистом по таможенному оформлению.
                          </p>
                          <button
                            type="button"
                            onClick={() => onOpenLeadModal?.(`Индивидуальный расчёт для кода ${activeCard.code}`)}
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            <PhoneCall className="h-4 w-4" />
                            <span>Запросить расчёт у декларанта</span>
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleCalculate} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 1. Customs Value (Always required) */}
                            <div className="sm:col-span-2">
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                Таможенная стоимость товара, ₽ *
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={calcInputs.customsValueRub}
                                  onChange={(e) =>
                                    setCalcInputs((prev) => ({ ...prev, customsValueRub: e.target.value }))
                                  }
                                  placeholder="100 000"
                                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                  required
                                />
                                <span className="absolute right-4 top-2.5 text-sm font-bold text-slate-400">₽</span>
                              </div>
                              <p className="mt-1 text-[11px] text-slate-500">
                                Стоимость товара по инвойсу + стоимость доставки и страховки до границы ЕАЭС/РФ.
                              </p>
                            </div>

                            {/* 2. Weight in kg (if in requiredInputs) */}
                            {activeCard.estimation.requiredInputs.includes('weightKg') && (
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                  Вес брутто, кг *
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={calcInputs.weightKg}
                                    onChange={(e) =>
                                      setCalcInputs((prev) => ({ ...prev, weightKg: e.target.value }))
                                    }
                                    placeholder="50"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    required
                                  />
                                  <span className="absolute right-4 top-2.5 text-sm font-bold text-slate-400">кг</span>
                                </div>
                              </div>
                            )}

                            {/* 3. Quantity (if in requiredInputs) */}
                            {activeCard.estimation.requiredInputs.includes('quantity') && (
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                  Количество ({activeCard.estimation.measureUnit || 'шт'}) *
                                </label>
                                <input
                                  type="text"
                                  value={calcInputs.quantity}
                                  onChange={(e) =>
                                    setCalcInputs((prev) => ({ ...prev, quantity: e.target.value }))
                                  }
                                  placeholder="100"
                                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                  required
                                />
                              </div>
                            )}

                            {/* 4. Volume in m3 (if in requiredInputs) */}
                            {activeCard.estimation.requiredInputs.includes('volumeM3') && (
                              <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                  Объём, м³ *
                                </label>
                                <input
                                  type="text"
                                  value={calcInputs.volumeM3}
                                  onChange={(e) =>
                                    setCalcInputs((prev) => ({ ...prev, volumeM3: e.target.value }))
                                  }
                                  placeholder="1.5"
                                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                  required
                                />
                              </div>
                            )}

                            {/* 5. EUR Rate (if in requiredInputs) */}
                            {activeCard.estimation.requiredInputs.includes('eurRate') && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Курс EUR к рублю *
                                  </label>
                                  {eurRateModifiedByUser && (
                                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                                      введено вручную
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={calcInputs.eurRub}
                                  onChange={(e) => {
                                    setEurRateModifiedByUser(true);
                                    setCalcInputs((prev) => ({ ...prev, eurRub: e.target.value }));
                                  }}
                                  placeholder="90.2429"
                                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                  required
                                />
                              </div>
                            )}

                            {/* 6. USD Rate (if in requiredInputs) */}
                            {activeCard.estimation.requiredInputs.includes('usdRate') && (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                    Курс USD к рублю *
                                  </label>
                                  {usdRateModifiedByUser && (
                                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-medium">
                                      введено вручную
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={calcInputs.usdRub}
                                  onChange={(e) => {
                                    setUsdRateModifiedByUser(true);
                                    setCalcInputs((prev) => ({ ...prev, usdRub: e.target.value }));
                                  }}
                                  placeholder="80.5381"
                                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                  required
                                />
                              </div>
                            )}
                          </div>

                          {/* Mandatory Base Rates Confirmation Checkbox */}
                          <div className="pt-2">
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={calcInputs.confirmedBaseRates}
                                onChange={(e) =>
                                  setCalcInputs((prev) => ({
                                    ...prev,
                                    confirmedBaseRates: e.target.checked,
                                  }))
                                }
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                required
                              />
                              <span className="text-xs text-slate-600 leading-snug">
                                Подтверждаю применение базовых ставок (страна происхождения — Китай, без тарифных преференций).
                              </span>
                            </label>
                          </div>

                          {/* Error message */}
                          {calcError && (
                            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                              {calcError}
                            </div>
                          )}

                          {/* Submit button */}
                          <button
                            type="submit"
                            disabled={isCalculating}
                            className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                          >
                            {isCalculating ? (
                              <>
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Расчёт по формулам API…</span>
                              </>
                            ) : (
                              <>
                                <Calculator className="h-4 w-4" />
                                <span>Рассчитать пошлину и НДС</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}

                      {/* CALCULATION RESULTS PANEL (Section 4 & 7.4) */}
                      {calcResult && (
                        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
                          {/* Total Banner */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/60 pb-4">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wider text-blue-900">
                                Предварительная пошлина и НДС
                              </p>
                              <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                                {formatCurrencyRub(calcResult.totalRub)}
                              </p>
                            </div>
                            <span className="text-xs text-slate-500 self-start sm:self-auto">
                              Без сборов и доставки
                            </span>
                          </div>

                          {/* Breakdown Table with Formula beside amounts (Section 4 & 7.4) */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-blue-200/60 text-slate-500">
                                  <th className="py-2 pr-3 font-semibold">Статья платежа</th>
                                  <th className="py-2 px-3 font-semibold">Формула расчёта</th>
                                  <th className="py-2 pl-3 text-right font-semibold">Сумма, ₽</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-blue-100">
                                {calcResult.breakdown.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-blue-100/30">
                                    <td className="py-2.5 pr-3 font-medium text-slate-800">
                                      {row.label}
                                    </td>
                                    <td className="py-2.5 px-3 font-mono text-slate-600">
                                      {row.formula}
                                    </td>
                                    <td className="py-2.5 pl-3 text-right font-mono font-bold text-slate-900">
                                      {formatCurrencyRub(row.amountRub)}
                                    </td>
                                  </tr>
                                ))}
                                <tr className="font-bold border-t-2 border-blue-200 text-slate-900">
                                  <td className="py-2.5 pr-3">Итого пошлина и НДС</td>
                                  <td className="py-2.5 px-3 font-mono text-slate-500">
                                    {formatCurrencyRub(calcResult.dutyRub)} + {formatCurrencyRub(calcResult.vatRub)}
                                  </td>
                                  <td className="py-2.5 pl-3 text-right font-mono text-blue-700 text-sm">
                                    {formatCurrencyRub(calcResult.totalRub)}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Estimation Disclaimers from API */}
                          {activeCard.estimation.notes && activeCard.estimation.notes.length > 0 && (
                            <div className="text-[11px] text-slate-600 space-y-1 border-t border-blue-200/60 pt-3">
                              {activeCard.estimation.notes.map((note, idx) => (
                                <p key={idx} className="leading-normal">
                                  • {note}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Oriентировочная стоимость (UN Comtrade) */}
                    {itsData && itsData.found && (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-bold text-sm sm:text-base text-amber-950">
                              Ориентировочная стоимость: ≈ {itsData.price.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} $/{itsData.unit}
                              {itsData.priceAlt && (
                                <span className="font-semibold text-amber-900/70"> · ≈ {itsData.priceAlt.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} $/{itsData.unitAlt}</span>
                              )}
                            </p>
                            <p className="text-[11px] leading-relaxed text-amber-900/80 mt-1">
                              Средняя цена импорта по 6-значному коду {itsData.hs6}, данные за {itsData.period} год (UN Comtrade).
                              Это ориентир для понимания уровня цен, а не индекс таможенной стоимости ФТС — точную оценку даст таможенный брокер по вашему товару.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* REQUIREMENTS ACCORDIONS (Section 3.2 & 7.4) */}
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span>Особенности, требования и регулирование</span>
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {activeCard.requirements.length} категорий
                        </span>
                      </h4>

                      {activeCard.requirements.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          Специфических нетарифных ограничений в базе не зафиксировано.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {activeCard.requirements.map((group) => {
                            const isOpen = openAccordions[group.type] ?? false;
                            return (
                              <div
                                key={group.type}
                                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleAccordion(group.type)}
                                  className="w-full px-5 py-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                                      {group.title}
                                    </span>
                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                                      {group.items.length}
                                    </span>
                                  </div>
                                  <ChevronDown
                                    className={`h-4 w-4 text-slate-400 transition-transform ${
                                      isOpen ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>

                                {isOpen && (
                                  <div className="p-4 sm:p-5 space-y-4 divide-y divide-slate-100 text-xs sm:text-sm">
                                    {group.items.map((item, idx) => (
                                      <div key={idx} className={idx > 0 ? 'pt-3' : ''}>
                                        {/* Metadata row: document, dates, country, rate */}
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs">
                                          {item.document && (
                                            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                                              {item.document}
                                            </span>
                                          )}
                                          {(item.validFrom || item.validTo) && (
                                            <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                              {item.validFrom && `с ${item.validFrom}`}
                                              {item.validTo && ` по ${item.validTo}`}
                                            </span>
                                          )}
                                          {item.country && (
                                            <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                              Страна: {item.country}
                                            </span>
                                          )}
                                          {item.rate && (
                                            <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                              Ставка: {item.rate}
                                            </span>
                                          )}
                                        </div>

                                        {/* Multi-line legal text with linebreaks (Section 3.2) */}
                                        <div className="text-slate-700 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                                          {item.text}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Card Source and Disclaimer Footer (Section 7.4 & 7.6) */}
                    <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                      <div>
                        <p className="font-semibold text-slate-600">
                          Источник: {activeCard.source} (проверено {formatDateTime(activeCard.fetchedAt)})
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Результат предварительный и не является решением о классификации товаров в соответствии с ТН ВЭД ЕАЭС.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenLeadModal?.(`Консультация брокера по коду ТН ВЭД ${activeCard.code}`)
                        }
                        className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>Помощь брокера</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHESTNY ZNAK & MARKING GUIDE (Retaining content for visitors) */}
        {activeTab === 'chestny_znak' && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <QrCode className="h-3.5 w-3.5" />
                    ГИС МТ «Честный ЗНАК»
                  </span>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
                    Обязательная маркировка товаров при импорте из Китая
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Ввоз немаркированной продукции грозит конфискацией партии и штрафом по ст. 15.12 КоАП РФ до 300 000 ₽.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenLeadModal?.('Маркировка Честный Знак в Китае (склад консолидации)')}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Заказать маркировку на складе в Китае
                </button>
              </div>

              {/* 5 Steps of Marking during Import */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Пошаговая схема маркировки импортного груза
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {[
                    {
                      step: '01',
                      title: 'Регистрация',
                      desc: 'Регистрация импортера в «Честном ЗНАКе» с УКЭП и членство в GS1 Rus.',
                    },
                    {
                      step: '02',
                      title: 'Заказ кодов',
                      desc: 'Эмиссия кодов маркировки Data Matrix в личном кабинете СУЗ.',
                    },
                    {
                      step: '03',
                      title: 'Наклейка в Китае',
                      desc: 'Печать и физическое нанесение стикеров на фабрике или нашем складе в Иу/Гуанчжоу.',
                    },
                    {
                      step: '04',
                      title: 'Декларация (ДТ)',
                      desc: 'Указание кодов идентификации в графе 31 декларации на товары на таможне.',
                    },
                    {
                      step: '05',
                      title: 'Ввод в оборот',
                      desc: 'После выпуска таможней подача отчёта о вводе в оборот в систему «Честный ЗНАК».',
                    },
                  ].map((s) => (
                    <div key={s.step} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 relative">
                      <span className="font-mono text-2xl font-black text-blue-600/30">
                        {s.step}
                      </span>
                      <h4 className="mt-1 font-bold text-sm text-slate-900">{s.title}</h4>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Categories in 2025–2026 */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Товарные группы, подлежащие маркировке в 2025–2026 гг.
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {[
                    { name: 'Обувь (коды 6401–6405)', status: 'Обязательно с 2020', note: 'Кожаная, спортивная, резиновая обувь, сапоги, туфли.' },
                    { name: 'Одежда и легпром (коды 61–63)', status: 'Расширение 2024–2025', note: 'Куртки, пальто, блузки, трикотаж, постельное белье, костюмы.' },
                    { name: 'Духи и парфюмерия (код 3303)', status: 'Обязательно', note: 'Туалетная вода, одеколоны, духи в любой фасовке.' },
                    { name: 'Шины и покрышки (код 4011)', status: 'Обязательно', note: 'Легковые, грузовые, автобусные, с/х шины.' },
                    { name: 'Электроника и радиоэлектроника', status: 'Эксперимент / 2025', note: 'Смартфоны, ноутбуки, печатные платы, светильники.' },
                    { name: 'Мебель и товары для сна', status: 'Пилот 2024–2025', note: 'Матрасы, кресла, отдельные виды деревянной и металлической мебели.' },
                  ].map((cat, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{cat.name}</span>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {cat.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs">{cat.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERMITS & CERTIFICATION (Retaining content) */}
        {activeTab === 'permits' && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <FileCheck className="h-3.5 w-3.5" />
                    Технические регламенты ЕАЭС
                  </span>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
                    Разрешительные документы для таможенного оформления
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600">
                    Сертификаты, декларации, нотификации ФСБ и свидетельства государственной регистрации.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenLeadModal?.('Оформление разрешительных документов ТР ТС')}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Рассчитать стоимость сертификата
                </button>
              </div>

              {/* 5 Types of Permit Documents */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    type: 'Декларация о соответствии (ДС)',
                    regs: 'ТР ТС 017/2011, 004/2011, 020/2011',
                    term: '3–7 рабочих дней',
                    cost: 'от 12 000 ₽',
                    desc: 'Регистрируется заявителем в реестре ФГИС Росаккредитации на основании протоколов испытаний аккредитованной лаборатории.',
                  },
                  {
                    type: 'Сертификат соответствия (СС)',
                    regs: 'ТР ТС 008/2011 (игрушки), 007/2011 (дети)',
                    term: '10–20 рабочих дней',
                    cost: 'от 35 000 ₽',
                    desc: 'Обязательный аудит производства или испытания образцов экспертом органа по сертификации. Требуется для детских товаров.',
                  },
                  {
                    type: 'Нотификация ФСБ',
                    regs: 'Положение 2.19 ЕЭК',
                    term: '7–12 рабочих дней',
                    cost: 'от 18 000 ₽',
                    desc: 'Регистрация криптографических (шифровальных) алгоритмов для электроники с Wi-Fi, Bluetooth: смартфоны, ноутбуки, роутеры.',
                  },
                  {
                    type: 'Свидетельство гос. регистрации (СГР)',
                    regs: 'Решение КТС № 299 (Роспотребнадзор)',
                    term: '3–6 недель',
                    cost: 'от 45 000 ₽',
                    desc: 'Подтверждает санитарно-эпидемиологическую безопасность: бытовая химия, детская косметика, БАДы, контакт с пищей.',
                  },
                  {
                    type: 'Отрицательное решение (Отказное письмо)',
                    regs: 'ВНИИС / Органы по сертификации',
                    term: '1–2 рабочих дня',
                    cost: 'от 4 000 ₽',
                    desc: 'Официальный документ о том, что продукция не подлежит обязательному подтверждению соответствия в рамках ЕАЭС.',
                  },
                ].map((doc, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded">
                      {doc.term} · {doc.cost}
                    </span>
                    <h4 className="font-bold text-base text-slate-900 mt-2">{doc.type}</h4>
                    <p className="text-xs font-semibold text-slate-500">{doc.regs}</p>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">{doc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DUTIES, FEES & KTS RISK (Retaining content) */}
        {activeTab === 'duties_kts' && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="border-b border-slate-100 pb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Scale className="h-3.5 w-3.5" />
                  Таможенная стоимость и контроль
                </span>
                <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
                  Таможенные сборы 2026 и риски корректировки стоимости (КТС)
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Ставки сборов за таможенное оформление по Постановлению Правительства РФ № 342 и правила подтверждения цены по 1-му методу.
                </p>
              </div>

              {/* Customs Fees Table (ПП РФ № 342) */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Шкала сборов за совершение таможенных операций (Постановление № 342)
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-bold">Таможенная стоимость партии</th>
                        <th className="py-3 px-4 font-bold text-right">Сумма сбора, ₽</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {CUSTOMS_FEES_TIERS.map((tier, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-medium text-slate-800">{tier.label}</td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                            {tier.feeRub.toLocaleString('ru-RU')} ₽
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* KTS Risk Assessment */}
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/40 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h4 className="font-bold text-base text-slate-900">
                    Как избежать корректировки таможенной стоимости (КТС)?
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Таможня сверяет заявленную стоимость за 1 кг с индикативным профилем риска (ИПР).
                  Если заявленная цена ниже профиля риска, инспектор запрашивает дополнительную проверку
                  и обеспечение уплаты пошлин.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="rounded-xl bg-white p-3 border border-amber-200">
                    <p className="font-bold text-slate-900">Прямой контракт</p>
                    <p className="text-slate-600 mt-1">Официальный внешнеторговый контракт с заводом-изготовителем.</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-amber-200">
                    <p className="font-bold text-slate-900">Swift / Банковская выписка</p>
                    <p className="text-slate-600 mt-1">100% подтверждение банковской оплаты через уполномоченный банк.</p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-amber-200">
                    <p className="font-bold text-slate-900">Экспортная декларация</p>
                    <p className="text-slate-600 mt-1">Китайская экспортная декларация с отметкой таможни КНР.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FAQ (Retaining content) */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="border-b border-slate-100 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    <HelpCircle className="h-3.5 w-3.5" />
                    База знаний ВЭД
                  </span>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-900">
                    Часто задаваемые вопросы по классификации и таможне
                  </h2>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Поиск по вопросам…"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* FAQ Accordions */}
              <div className="mt-6 space-y-3">
                {filteredFaq.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                      >
                        <span>{item.question}</span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

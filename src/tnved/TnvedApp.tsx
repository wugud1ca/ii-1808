import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { ApiError, api, formatDateTime, initializeSession, parsePositiveDecimal } from './api';
import type {
  CalculationRequest, CalculationResponse, CardResponse, ExchangeRatesResponse, SearchItem, SearchResponse, TnvedSession,
} from './types';

export { initializeSession, parsePositiveDecimal };

const EXAMPLE_QUERIES = ['стул', 'кроссовки', '9401790009'];

export interface CalcFields {
  customsValueRub: string;
  weightKg: string;
  quantity: string;
  volumeM3: string;
  eurRub: string;
  usdRub: string;
}

export function buildCalculationRequest(
  card: CardResponse, fields: CalcFields, confirmed: boolean,
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

function CodePill({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); } catch { /* clipboard may be unavailable */ }
    setCopied(true); window.setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button type="button" onClick={copy} title="Скопировать код"
      className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-mono text-sm tracking-wider text-slate-800 hover:bg-orange-100 transition-colors">
      {code}<span className="text-xs text-slate-500">{copied ? 'скопировано' : '⧉'}</span>
    </button>
  );
}

function CardView({ card, rates }: { card: CardResponse; rates: ExchangeRatesResponse | null }) {
  const required = card.estimation.requiredInputs;
  const [fields, setFields] = useState<CalcFields>({ customsValueRub: '', weightKg: '', quantity: '', volumeM3: '', eurRub: '', usdRub: '' });
  const [confirmed, setConfirmed] = useState(false);
  const [manualRates, setManualRates] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResponse | null>(null);
  const set = (key: keyof CalcFields) => (e: ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (key === 'eurRub' || key === 'usdRub') setManualRates(true);
  };

  useEffect(() => {
    if (rates && !manualRates) {
      setFields((prev) => ({
        ...prev,
        ...(required.includes('eurRate') ? { eurRub: String(rates.eurRub) } : {}),
        ...(required.includes('usdRate') ? { usdRub: String(rates.usdRub) } : {}),
      }));
    }
  }, [rates, manualRates, required]);

  useEffect(() => { setResult(null); setError(null); }, [fields, confirmed, card.code]);

  const submit = async () => {
    setError(null);
    const { request, errors } = buildCalculationRequest(card, fields, confirmed);
    if (!request) { setError(Object.values(errors)[0] || 'Проверьте заполненные поля.'); return; }
    setCalculating(true);
    try { setResult(await api.calculate(request)); }
    catch (e: any) { setError(e instanceof Error ? e.message : 'Не удалось выполнить расчёт.'); }
    finally { setCalculating(false); }
  };

  const rub = (n: number) => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }).format(n);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{card.name}</h2>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          <CodePill code={card.code} />
          <span>Версия базы: {card.version}</span>
          {card.validFrom && <span>с {card.validFrom}</span>}
          {card.validTo && <span>по {card.validTo}</span>}
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Импортная пошлина</dt>
          <dd className="mt-1 text-base font-semibold text-slate-900">{card.rates.importDuty.text}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">НДС</dt>
          <dd className="mt-1 text-base font-semibold text-slate-900">{card.rates.vat.text}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Акциз</dt>
          <dd className="mt-1 text-base font-semibold text-slate-900">{card.rates.excise.text}</dd>
        </div>
      </dl>

      {card.warnings.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {card.warnings.map((w, i) => <p key={i} className={i > 0 ? 'mt-1' : ''}>{w}</p>)}
        </div>
      )}

      <div className="rounded-lg border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5">
          <h3 className="text-sm font-semibold text-slate-800">Предварительный расчёт платежей</h3>
        </div>
        <div className="space-y-3 p-4">
          {!card.estimation.supported ? (
            <p className="text-sm text-slate-600">{card.estimation.reason || 'Расчёт по этому коду недоступен.'}</p>
          ) : (
            <>
              <label className="block">
                <span className="text-sm text-slate-700">Таможенная стоимость, ₽</span>
                <input inputMode="decimal" value={fields.customsValueRub} onChange={set('customsValueRub')} placeholder="Например, 100000"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-orange-500 focus:outline-none" />
                <span className="mt-1 block text-xs text-slate-500">Стоимость товара с доставкой и иными расходами до границы ЕАЭС, а не цена покупки.</span>
              </label>
              {required.includes('weightKg') && (
                <label className="block">
                  <span className="text-sm text-slate-700">Вес брутто, кг</span>
                  <input inputMode="decimal" value={fields.weightKg} onChange={set('weightKg')} placeholder="Например, 50"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-orange-500 focus:outline-none" />
                </label>
              )}
              {required.includes('quantity') && (
                <label className="block">
                  <span className="text-sm text-slate-700">Количество, {card.estimation.measureUnit || 'шт'}</span>
                  <input inputMode="numeric" value={fields.quantity} onChange={set('quantity')} placeholder="Например, 10"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-orange-500 focus:outline-none" />
                </label>
              )}
              {required.includes('volumeM3') && (
                <label className="block">
                  <span className="text-sm text-slate-700">Объём, м³</span>
                  <input inputMode="decimal" value={fields.volumeM3} onChange={set('volumeM3')} placeholder="Например, 1,5"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-orange-500 focus:outline-none" />
                </label>
              )}
              {(required.includes('eurRate') || required.includes('usdRate')) && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {required.includes('eurRate') && (
                    <label className="block">
                      <span className="text-sm text-slate-700">Курс евро → ₽</span>
                      <input inputMode="decimal" value={fields.eurRub} onChange={set('eurRub')}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-orange-500 focus:outline-none" />
                    </label>
                  )}
                  {required.includes('usdRate') && (
                    <label className="block">
                      <span className="text-sm text-slate-700">Курс доллара → ₽</span>
                      <input inputMode="decimal" value={fields.usdRub} onChange={set('usdRub')}
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-orange-500 focus:outline-none" />
                    </label>
                  )}
                </div>
              )}
              {(required.includes('eurRate') || required.includes('usdRate')) && (
                <p className="text-xs text-slate-500">
                  {rates ? `Курсы ЦБ РФ от ${rates.date} (обновлено ${formatDateTime(rates.fetchedAt)}).` : 'Курс ЦБ РФ недоступен — укажите вручную.'}
                </p>
              )}
              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 accent-orange-600" />
                <span>Подтверждаю: расчёт по обычным базовым ставкам без льгот; не включает таможенные сборы за оформление, доставку, страхование, услуги брокера и утилизационный сбор.</span>
              </label>
              <button type="button" onClick={submit} disabled={calculating || !confirmed}
                className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50">
                {calculating ? 'Расчёт…' : 'Рассчитать пошлину и НДС'}
              </button>
              {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
              {result && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="space-y-1 text-sm">
                    {result.breakdown.map((row, i) => (
                      <div key={i} className="flex justify-between gap-2">
                        <span className="text-slate-600">{row.label} <span className="text-xs text-slate-400">({row.formula})</span></span>
                        <span className="font-medium text-slate-900">{rub(row.amountRub)} ₽</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-base font-bold text-slate-900">
                      <span>Пошлина + НДС (итого)</span>
                      <span>{rub(result.totalRub)} ₽</span>
                    </div>
                  </div>
                  {result.warnings.map((w, i) => <p key={i} className="mt-2 text-xs text-amber-700">{w}</p>)}
                </div>
              )}
            </>
          )}
          {card.estimation.notes.map((n, i) => <p key={i} className="text-xs text-slate-500">{n}</p>)}
        </div>
      </div>

      {card.requirements.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-800">Особенности, требования и условия</h3>
          {card.requirements.map((group) => (
            <details key={group.type} className="rounded-lg border border-slate-200">
              <summary className="cursor-pointer px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50">{group.title}</summary>
              <div className="space-y-3 border-t border-slate-200 p-4">
                {group.items.map((item, i) => (
                  <div key={i} className="text-sm text-slate-700">
                    <p className="whitespace-pre-wrap">{item.text}</p>
                    {(item.validFrom || item.validTo) && (
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                        {item.validFrom && <span>с {item.validFrom}</span>}
                        {item.validTo && <span>по {item.validTo}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-500">Источник: TKS (проверено {formatDateTime(card.fetchedAt)}). Результат предварительный и не является решением о классификации.</p>
    </div>
  );
}

function SearchPane({ onOpenCard }: { onOpenCard: (code: string) => void }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const seq = useRef(0);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<SearchResponse | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const suggestSeq = useRef(0);
  const debounceTimer = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLFormElement>(null);

  const closeSuggest = useCallback(() => { setSuggestOpen(false); setHighlight(-1); }, []);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) closeSuggest();
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown);
      if (debounceTimer.current !== null) window.clearTimeout(debounceTimer.current);
    };
  }, [closeSuggest]);

  const runSearch = useCallback(async (q: string, p: number) => {
    const id = ++seq.current;
    suggestSeq.current++;
    closeSuggest();
    setSuggestions(null);
    setLoading(true); setError(null);
    try {
      const res = await api.search(q, p);
      if (id !== seq.current) return;
      setResult(res); setQuery(q); setPage(p);
      setVisibleCount(5);
      if (res.kind === 'code' && res.items.length === 1 && res.items[0].isLeaf) onOpenCard(res.items[0].code);
    } catch (e: any) {
      if (id !== seq.current) return;
      if (e instanceof ApiError && e.status === 401) return;
      setError(e instanceof Error ? e.message : 'Ошибка поиска.');
      setResult(null);
    } finally {
      if (id === seq.current) setLoading(false);
    }
  }, [onOpenCard, closeSuggest]);

  const fetchSuggestions = useCallback(async (q: string) => {
    const id = ++suggestSeq.current;
    try {
      const res = await api.search(q, 1);
      if (id !== suggestSeq.current) return;
      setSuggestions(res);
      setSuggestOpen(true);
      setHighlight(-1);
    } catch {
      if (id === suggestSeq.current) setSuggestions(null);
    }
  }, []);

  const onChangeQuery = (e: ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setQuery(q);
    if (debounceTimer.current !== null) window.clearTimeout(debounceTimer.current);
    const trimmed = q.trim();
    if (trimmed.length >= 2) {
      debounceTimer.current = window.setTimeout(() => fetchSuggestions(trimmed), 500);
    } else {
      suggestSeq.current++;
      setSuggestions(null);
      closeSuggest();
    }
  };

  const selectSuggestion = (item: SearchItem) => {
    suggestSeq.current++;
    setSuggestions(null);
    closeSuggest();
    setQuery(item.code);
    if (item.isLeaf) onOpenCard(item.code);
    else runSearch(item.code, 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!suggestOpen || !suggestions || suggestions.items.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => Math.min(h + 1, suggestions.items.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && highlight >= 0) { e.preventDefault(); selectSuggestion(suggestions.items[highlight]); }
    else if (e.key === 'Escape') closeSuggest();
  };

  const submit = (e: FormEvent) => { e.preventDefault(); const q = query.trim(); if (q.length >= 2) runSearch(q, 1); };

  const shownItems = result ? result.items.slice(0, visibleCount) : [];
  const remaining = result ? result.items.length - visibleCount : 0;

  return (
    <div className="space-y-4">
      <form onSubmit={submit} ref={wrapperRef} className="relative flex gap-2">
        <input value={query} onChange={onChangeQuery} onKeyDown={onKeyDown}
          onFocus={() => { if (suggestions && suggestions.items.length > 0) setSuggestOpen(true); }}
          placeholder="Название товара или код ТН ВЭД"
          aria-label="Название товара или код ТН ВЭД"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2.5 text-slate-900 focus:border-orange-500 focus:outline-none" />
        <button type="submit" disabled={loading || query.trim().length < 2}
          className="shrink-0 rounded-md bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
          {loading ? 'Поиск…' : 'Найти'}
        </button>
        {suggestOpen && suggestions && suggestions.items.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-10 mt-1 max-h-80 overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
            {suggestions.items.slice(0, 8).map((item, i) => (
              <li key={item.code}>
                <button type="button"
                  onMouseDown={(e) => { e.preventDefault(); selectSuggestion(item); }}
                  onMouseEnter={() => setHighlight(i)}
                  className={`flex w-full items-baseline gap-2 px-3 py-2 text-left text-sm ${highlight === i ? 'bg-orange-50' : 'hover:bg-slate-50'}`}>
                  <span className="shrink-0 font-mono text-slate-800">{item.code}</span>
                  <span className="truncate text-slate-600">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>Например:</span>
        {EXAMPLE_QUERIES.map((q) => (
          <button key={q} type="button" onClick={() => runSearch(q, 1)}
            className="rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:border-orange-400 hover:text-orange-700">{q}</button>
        ))}
      </div>

      {loading && <p className="text-sm text-slate-500">Поиск…</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

      {result && !loading && (
        <div>
          <p className="text-sm text-slate-500">
            {result.kind === 'name'
              ? <>Найдено {result.total} записей (показано {shownItems.length})</>
              : <>Совпадения по коду (показано {shownItems.length})</>}
          </p>
          {result.items.length === 0 && <p className="mt-2 text-sm text-slate-600">Ничего не найдено. Попробуйте иначе сформулировать запрос.</p>}
          <ul className="mt-2 space-y-2">
            {shownItems.map((item) => (
              <li key={item.code}>
                <button type="button" onClick={() => onOpenCard(item.code)}
                  className="w-full rounded-lg border border-slate-200 p-3 text-left transition-colors hover:border-orange-400 hover:bg-orange-50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-slate-800">{item.code}</span>
                    {item.examples !== null && <span className="text-xs text-slate-400">{item.examples} записей</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{item.name}</p>
                </button>
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <button type="button" onClick={() => setVisibleCount(result.items.length)}
              className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-orange-400 hover:text-orange-700">
              Показать ещё ({remaining})
            </button>
          )}
          {result.hasMore && (
            <div className="mt-3 flex items-center gap-3">
              {page > 1 && <button type="button" onClick={() => runSearch(query, page - 1)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">← Назад</button>}
              <button type="button" onClick={() => runSearch(query, page + 1)} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">Дальше →</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AuthScreen({ onAuthed }: { onAuthed: (s: TnvedSession) => void }) {
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(null);
    try { onAuthed(await api.access(token.trim())); }
    catch (err: any) { setError(err instanceof Error ? err.message : 'Неверная ссылка доступа.'); }
    finally { setBusy(false); }
  };
  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900">Закрытое тестирование</h2>
      <p className="mt-2 text-sm text-slate-600">Страница доступна только по приглашению. Введите код доступа из персональной ссылки.</p>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <input value={token} onChange={(e) => setToken(e.target.value)} type="password" autoComplete="off" placeholder="Код доступа" aria-label="Код доступа"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-orange-500 focus:outline-none" />
        <button type="submit" disabled={busy || token.trim().length < 8}
          className="w-full rounded-md bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
          {busy ? 'Проверка…' : 'Войти'}
        </button>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}

export default function TnvedApp() {
  const [session, setSession] = useState<TnvedSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [card, setCard] = useState<CardResponse | null>(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [rates, setRates] = useState<ExchangeRatesResponse | null>(null);
  const ratesRequested = useRef(false);

  const loadRates = useCallback(async () => {
    if (ratesRequested.current) return;
    ratesRequested.current = true;
    try { setRates(await api.rates()); } catch { /* rates stay null; user may enter manually */ }
  }, []);

  const openCard = useCallback(async (code: string) => {
    setCardLoading(true); setCardError(null); setCard(null);
    loadRates();
    try { setCard(await api.card(code)); }
    catch (e: any) { setCardError(e instanceof Error ? e.message : 'Не удалось загрузить карточку.'); }
    finally { setCardLoading(false); }
  }, [loadRates]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await initializeSession();
        if (!cancelled) setSession(s);
      } catch (e: any) {
        if (!cancelled) {
          setAccessError(e instanceof Error ? e.message : null);
          try { const s = await api.session(); if (!cancelled) setSession(s); } catch { /* stays unauthenticated */ }
        }
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const logout = async () => { try { await api.logout(); } catch { /* ignore */ } setSession(null); setCard(null); };

  if (sessionLoading) {
    return <div className="mx-auto max-w-3xl p-6 text-center text-slate-500">Загрузка…</div>;
  }
  if (!session?.authenticated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">ТН ВЭД — подбор кода и предварительный расчёт</h1>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Закрытое тестирование</span>
        </header>
        {accessError && <p className="mb-4 text-sm text-red-600">{accessError}</p>}
        <AuthScreen onAuthed={setSession} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ТН ВЭД — подбор кода и предварительный расчёт</h1>
          <p className="text-sm text-slate-500">Поиск кода по товару, ставки пошлины и НДС. Предварительный расчёт — не решение о классификации.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Закрытое тестирование</span>
          <button type="button" onClick={logout} className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">Выйти</button>
        </div>
      </header>

      <SearchPane onOpenCard={openCard} />

      <div className="mt-6">
        {cardLoading && <p className="text-sm text-slate-500">Загрузка карточки…</p>}
        {cardError && <p role="alert" className="text-sm text-red-600">{cardError}</p>}
        {card && <CardView card={card} rates={rates} />}
      </div>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <p>Страница в режиме закрытого тестирования. Данные ТН ВЭД предоставлены TKS.</p>
        <p className="mt-1"><a className="text-orange-600 hover:underline" href="https://express-today.ru/">← Вернуться на сайт Express Today</a></p>
      </footer>
    </div>
  );
}

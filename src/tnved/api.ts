import type {
  ApiFailure, CalculationRequest, CalculationResponse, CardResponse, ExchangeRatesResponse, ItsResponse, SearchResponse, TnvedSession,
} from './types';

export class ApiError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (options.signal?.aborted) abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(abort, 30_000);
  try {
    const response = await fetch(`/api/tnved${path}`, {
      ...options,
      signal: controller.signal,
      credentials: 'same-origin',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers },
    });
    if (!response.ok) {
      const failure: Partial<ApiFailure> = await response.json().catch(() => ({}));
      throw new ApiError(response.status, failure.message || 'Сервис временно недоступен. Попробуйте ещё раз.', failure.retryAfter);
    }
    return response.status === 204 ? undefined as T : await response.json();
  } catch (error) {
    if (controller.signal.aborted && !options.signal?.aborted) {
      throw new ApiError(408, 'Сервис не ответил за 30 секунд. Попробуйте ещё раз.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', abort);
  }
}

export function parsePositiveDecimal(value: string): number | null {
  const clean = value.trim();
  if (!/^(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(clean)) return null;
  const number = Number(clean.replace(',', '.'));
  return Number.isFinite(number) && number > 0 ? number : null;
}

export const api = {
  session: () => requestJson<TnvedSession>('/session'),
  search: (q: string, page: number) => requestJson<SearchResponse>(`/search?q=${encodeURIComponent(q)}&page=${page}`),
  card: (code: string) => requestJson<CardResponse>(`/card/${code}`),
  its: (code: string) => requestJson<ItsResponse>(`/its/${code}`),
  rates: () => requestJson<ExchangeRatesResponse>('/rates'),
  calculate: (body: CalculationRequest) => requestJson<CalculationResponse>('/calculate', { method: 'POST', body: JSON.stringify(body) }),
};

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return '';
  return date.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatCurrencyRub(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ' ₽';
}


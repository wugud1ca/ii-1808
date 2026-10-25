import type { ExchangeRatesResponse } from '../../src/tnved/types';
import { DomainError } from './domain';

const CBR_URL = 'https://www.cbr.ru/scripts/XML_daily.asp';
const REQUIRED = ['EUR', 'USD'] as const;

function parseDecimal(value: string): number {
  const normalized = value.trim().replace(',', '.');
  const number = Number(normalized);
  if (!Number.isFinite(number) || number <= 0) throw new Error('invalid rate');
  return number;
}

export function parseExchangeRates(xml: string, fetchedAt: string): ExchangeRatesResponse {
  if (!xml || typeof xml !== 'string' || !xml.includes('ValCurs')) {
    throw new DomainError('RATES_UNAVAILABLE', 'ЦБ РФ не вернул курсы валют.', 502);
  }
  const dateMatch = /<ValCurs[^>]*Date="([^"]+)"/.exec(xml);
  const rates = new Map<string, number>();
  const block = /<Valute[^>]*>[\s\S]*?<\/Valute>/g;
  let match: RegExpExecArray | null;
  while ((match = block.exec(xml)) !== null) {
    const chunk = match[0];
    const code = /<CharCode>([^<]+)<\/CharCode>/.exec(chunk)?.[1];
    const nominal = /<Nominal>(\d+)<\/Nominal>/.exec(chunk)?.[1];
    const value = /<Value>([^<]+)<\/Value>/.exec(chunk)?.[1];
    if (!code || !nominal || !value) continue;
    try { rates.set(code, parseDecimal(value) / parseDecimal(nominal)); } catch { /* skip malformed rows */ }
  }
  for (const code of REQUIRED) {
    if (!rates.has(code) || !Number.isFinite(rates.get(code)!)) {
      throw new DomainError('RATES_UNAVAILABLE', `ЦБ РФ не вернул курс ${code}.`, 502);
    }
  }
  const cny = rates.get('CNY');
  if (cny !== undefined && (!Number.isFinite(cny) || cny <= 0)) throw new DomainError('RATES_UNAVAILABLE', 'Некорректный курс CNY.', 502);
  return {
    source: 'Банк России',
    date: dateMatch ? dateMatch[1] : '',
    eurRub: rates.get('EUR')!,
    usdRub: rates.get('USD')!,
    cnyRub: cny ?? 0,
    fetchedAt,
  };
}

let cached: { rates: ExchangeRatesResponse; until: number } | null = null;

export async function fetchExchangeRates(fetcher: typeof fetch = fetch): Promise<ExchangeRatesResponse> {
  if (cached && cached.until > Date.now()) return { ...cached.rates, fetchedAt: cached.rates.fetchedAt };
  try {
    const response = await fetcher(CBR_URL, {
      headers: { 'User-Agent': 'ExpressToday-Tnved-Private/1.0' },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error('cbr http ' + response.status);
    const xml = await response.text();
    const rates = parseExchangeRates(xml, new Date().toISOString());
    cached = { rates, until: Date.now() + 6 * 60 * 60_000 };
    return rates;
  } catch (error) {
    // A stale cache beats failing hard: return it with the original timestamp.
    if (cached) return { ...cached.rates, fetchedAt: cached.rates.fetchedAt };
    if (error instanceof DomainError) throw error;
    throw new DomainError('RATES_UNAVAILABLE', 'Не удалось получить курсы ЦБ РФ. Введите курс вручную.', 502);
  }
}

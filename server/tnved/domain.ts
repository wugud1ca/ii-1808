import type {
  CalculationRequest, CalculationResponse, CardResponse,
  RequirementGroup, RequirementItem, SearchItem, SearchResponse,
} from '../../src/tnved/types';
import { COUNTRY_SHORT, MEASURE_SHORT, PRIZNAK_TITLES, RATE_UNIT_LOOKUP } from './dictionaries.generated';

export class DomainError extends Error {
  constructor(public code: string, message: string, public status = 422) {
    super(message);
    this.name = 'DomainError';
  }
}

type Currency = 'EUR' | 'USD' | 'RUB';
type MeasureInput = 'weightKg' | 'quantity' | 'volumeM3';
interface Measure { input: MeasureInput; factor: number; unit: string }
type DutyComponent =
  | { type: 'percent'; value: number; label: string }
  | { type: 'specific'; value: number; measure: Measure; currency: Currency; label: string };

const SCOPE = 'Предварительно: страна происхождения — Китай, обычные (базовые) ставки без преференций. Это не полная стоимость таможенного оформления.';

function measureToInput(short: string): Measure | null {
  const s = (short || '').trim().toUpperCase();
  if (s === 'КГ') return { input: 'weightKg', factor: 1, unit: 'кг' };
  if (s === 'Т') return { input: 'weightKg', factor: 1 / 1000, unit: 'т' };
  if (s === 'ШТ') return { input: 'quantity', factor: 1, unit: 'шт' };
  if (s === '100 ШТ') return { input: 'quantity', factor: 100, unit: 'шт' };
  if (s === '1000 ШТ') return { input: 'quantity', factor: 1000, unit: 'шт' };
  if (s === 'ПАР') return { input: 'quantity', factor: 1, unit: 'пар' };
  if (s === 'М3') return { input: 'volumeM3', factor: 1, unit: 'м³' };
  return null;
}

function describeUnsupportedUnit(unit: unknown): string {
  const u = String(unit ?? '').trim();
  const match = /^(\d+)(D|Р)?$/.exec(u);
  if (match && MEASURE_SHORT[match[1]]) {
    return `Ставка за единицу «${MEASURE_SHORT[match[1]]}» пока не поддерживается в предварительном расчёте.`;
  }
  return 'Неизвестная единица измерения ставки пошлины.';
}

function parseUnit(unit: unknown): { kind: 'percent' } | { kind: 'specific'; measure: Measure; currency: Currency } | null {
  if (unit === null || unit === undefined) return null;
  const u = String(unit).trim();
  if (u === '' || u === '1') return { kind: 'percent' };
  const match = /^(\d+)(D|Р)?$/.exec(u);
  if (!match) return null;
  const measure = measureToInput(MEASURE_SHORT[match[1]]);
  if (!measure) return null;
  const currency: Currency = match[2] === 'D' ? 'USD' : match[2] === 'Р' ? 'RUB' : 'EUR';
  return { kind: 'specific', measure, currency };
}

function rateUnitLabel(priznak: number, code: unknown): string {
  const c = String(code ?? '').trim();
  const direct = RATE_UNIT_LOOKUP[`${priznak}|${c}`];
  if (direct) return direct;
  const match = /^(\d+)(D|Р)?$/.exec(c);
  if (match) {
    const base = RATE_UNIT_LOOKUP[`${priznak}|${match[1]}`];
    if (base) return match[2] === 'D' ? base.replace(/^Евро/, 'ДолларСША') : match[2] === 'Р' ? base.replace(/^Евро/, 'Руб') : base;
    if (MEASURE_SHORT[match[1]]) {
      const currency = match[2] === 'D' ? 'ДолларСША' : match[2] === 'Р' ? 'Руб' : 'Евро';
      return `${currency}/${MEASURE_SHORT[match[1]].toLowerCase()}`;
    }
  }
  return c || '';
}

function fmtNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 4 }).format(value);
}
function fmtRub(value: number): number { return Math.round(value * 100) / 100; }
function asDate(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}
function absent(value: unknown): boolean { return value === null || value === undefined || value === ''; }

interface ParsedDuty { text: string; components: DutyComponent[]; unsupported: string | null }

function parseDuty(tnved: any): ParsedDuty {
  const imp = tnved?.IMP;
  if (absent(imp)) {
    return { text: 'нет', components: [], unsupported: 'Базовая ставка пошлины не определена в источнике.' };
  }
  if (!isNumber(imp) || imp < 0 || imp > 1e9) {
    return { text: 'уточняется', components: [], unsupported: 'Некорректная ставка пошлины в источнике.' };
  }
  if (imp === 0) {
    const hasLater = !absent(tnved?.IMPSIGN) || !absent(tnved?.IMP2) || !absent(tnved?.IMPSIGN2) || !absent(tnved?.IMP3);
    if (hasLater) return { text: 'уточняется', components: [], unsupported: 'Нулевая базовая ставка с дополнительными компонентами требует проверки.' };
    return { text: '0 %', components: [], unsupported: null };
  }
  const first = parseUnit(tnved?.IMPEDI);
  const firstLabel = fmtNumber(imp) + (first?.kind === 'percent' ? ' %' : ' ' + rateUnitLabel(1, tnved.IMPEDI));
  if (!first) return { text: firstLabel || String(imp), components: [], unsupported: describeUnsupportedUnit(tnved?.IMPEDI) };
  const components: DutyComponent[] = [];
  if (first.kind === 'percent') components.push({ type: 'percent', value: imp, label: fmtNumber(imp) + ' %' });
  else components.push({ type: 'specific', value: imp, measure: first.measure, currency: first.currency, label: fmtNumber(imp) + ' ' + rateUnitLabel(1, tnved.IMPEDI) });
  let text = firstLabel;
  const sign = tnved?.IMPSIGN;
  if (sign && !absent(tnved?.IMP2)) {
    const second = parseUnit(tnved?.IMPEDI2);
    if (!second || !isNumber(tnved.IMP2) || tnved.IMP2 < 0) {
      return { text, components, unsupported: 'Дополнительный компонент ставки пошлины не поддерживается или некорректен.' };
    }
    const secondLabel = fmtNumber(tnved.IMP2) + (second.kind === 'percent' ? ' %' : ' ' + rateUnitLabel(1, tnved.IMPEDI2));
    text += sign === '+' ? ' + ' + secondLabel : sign === '>' ? ', но не менее ' + secondLabel : sign === '<' ? ', но не более ' + secondLabel : ' / ' + secondLabel;
    if (second.kind === 'percent') components.push({ type: 'percent', value: tnved.IMP2, label: fmtNumber(tnved.IMP2) + ' %' });
    else components.push({ type: 'specific', value: tnved.IMP2, measure: second.measure, currency: second.currency, label: fmtNumber(tnved.IMP2) + ' ' + rateUnitLabel(1, tnved.IMPEDI2) });
  }
  if (tnved?.IMPSIGN2 && !absent(tnved?.IMP3)) {
    const third = parseUnit(tnved?.IMPEDI3);
    if (!third || !isNumber(tnved.IMP3) || tnved.IMP3 < 0) {
      return { text, components, unsupported: 'Третья часть комбинированной ставки не поддерживается.' };
    }
    const thirdLabel = fmtNumber(tnved.IMP3) + (third.kind === 'percent' ? ' %' : ' ' + rateUnitLabel(1, tnved.IMPEDI3));
    text += tnved.IMPSIGN2 === '+' ? ' + ' + thirdLabel : ', ' + thirdLabel;
    if (third.kind === 'percent') components.push({ type: 'percent', value: tnved.IMP3, label: fmtNumber(tnved.IMP3) + ' %' });
    else components.push({ type: 'specific', value: tnved.IMP3, measure: third.measure, currency: third.currency, label: fmtNumber(tnved.IMP3) + ' ' + rateUnitLabel(1, tnved.IMPEDI3) });
  }
  return { text, components, unsupported: null };
}

function parseVat(tnved: any, tnvedAll: any): { percent: number | null; text: string; notes: string[] } {
  const nds = tnved?.NDS;
  if (absent(nds)) return { percent: null, text: 'нет', notes: [] };
  if (!isNumber(nds) || nds < 0 || nds > 100) return { percent: null, text: 'уточняется', notes: ['Некорректная ставка НДС в источнике.'] };
  const notes: string[] = [];
  const alternatives = (tnvedAll?.['3'] || []).filter((row: any) => Number(row?.PRIM) === 1);
  if (alternatives.length > 0) {
    notes.push('Есть льготные (пониженные или нулевые) ставки НДС для отдельных категорий товаров и получателей — применяются только при подтверждении условий, автоматически не учитываются.');
  }
  return { percent: nds, text: fmtNumber(nds) + ' %', notes };
}

function parseExcise(tnved: any): { present: boolean; text: string } {
  const akc = tnved?.AKC;
  if (absent(akc) || akc === 0) return { present: false, text: 'нет' };
  return { present: true, text: fmtNumber(akc) + ' ' + rateUnitLabel(2, tnved?.AKCEDI) };
}

function compositeText(row: any): string | null {
  const min = row?.MIN;
  if (absent(min)) return null;
  if (!isNumber(min)) return null;
  let out = fmtNumber(min) + ' ' + rateUnitLabel(1, row?.TYPEMIN);
  const sign = row?.SIGN;
  if (sign && !absent(row?.MAX)) {
    const maxPart = fmtNumber(row.MAX) + ' ' + rateUnitLabel(1, row.TYPEMAX);
    out += sign === '+' ? ' + ' + maxPart : sign === '>' ? ', но не менее ' + maxPart : sign === '<' ? ', но не более ' + maxPart : ' / ' + maxPart;
  }
  if (row?.SIGN2 && !absent(row?.MIN2)) {
    const min2Part = fmtNumber(row.MIN2) + ' ' + rateUnitLabel(1, row.TYPEMIN2);
    out += (row.SIGN2 === '+' ? ' + ' : ', ') + min2Part;
  }
  return out;
}

function requirementRate(row: any, priznak: number): string | null {
  if (priznak === 30) return compositeText(row);
  const min = row?.MIN;
  if (absent(min) || !isNumber(min)) return null;
  return fmtNumber(min) + (String(row.TYPEMIN ?? '').trim() === '1' ? ' %' : '');
}

function countryName(cu: unknown): string | null {
  if (cu === null || cu === undefined) return null;
  const s = String(cu).trim();
  if (!/^\d+$/.test(s)) return null;
  return COUNTRY_SHORT[s] || null;
}

function buildRequirements(tnvedAll: any): RequirementGroup[] {
  if (!tnvedAll || typeof tnvedAll !== 'object') return [];
  const groups: RequirementGroup[] = [];
  for (const [key, rawRows] of Object.entries(tnvedAll)) {
    const priznak = Number(key);
    if (!Number.isInteger(priznak) || priznak === 1 || priznak === 2 || priznak === 3) continue;
    const rows = Array.isArray(rawRows) ? rawRows : [];
    if (rows.length === 0) continue;
    const items: RequirementItem[] = rows.map((row: any) => {
      const rate = requirementRate(row, priznak);
      const country = countryName(row?.CU);
      const document = row?.DOC_N ? `${row.DOC_N}${row.DOC_D ? ' от ' + row.DOC_D : ''}` : null;
      const subtitle = [rate, country, document].filter(Boolean).join(' · ');
      return {
        text: (subtitle ? subtitle + '\n' : '') + String(row?.NOTE ?? '').trim(),
        rate, country, document,
        validFrom: asDate(row?.DBEGIN), validTo: asDate(row?.DEND),
      };
    });
    groups.push({ type: priznak, title: PRIZNAK_TITLES[priznak] || `Особенность (признак ${priznak})`, items });
  }
  const order = [5, 7, 9, 11, 14, 15, 27, 28, 29, 30, 31, 32, 34, 35, 6, 8, 0];
  groups.sort((a, b) => {
    const ai = order.indexOf(a.type); const bi = order.indexOf(b.type);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.type - b.type;
  });
  return groups;
}

interface Analyzed {
  code: string; name: string; validFrom: string | null; validTo: string | null; active: boolean; version: string;
  duty: ParsedDuty; vat: { percent: number | null; text: string; notes: string[] }; excise: { present: boolean; text: string };
  requirements: RequirementGroup[];
  requiredInputs: Array<'weightKg' | 'quantity' | 'volumeM3' | 'eurRate' | 'usdRate'>;
  measureUnit: string | null;
  supported: boolean; reason: string | null;
}

function analyzeCard(raw: unknown, now: Date): Analyzed {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new DomainError('UPSTREAM_RESPONSE', 'Источник не вернул данные по коду.', 502);
  const card = raw as any;
  if (typeof card.CODE !== 'string' || !/^\d{10}$/.test(card.CODE)) throw new DomainError('INVALID_CODE', 'Источник вернул некорректный код.', 502);
  const name = typeof card.KR_NAIM === 'string' ? card.KR_NAIM.trim() : '';
  const tnved = card.TNVED || {};
  const tnvedAll = card.TNVEDALL || {};
  const validFrom = asDate(card.DBEGIN); const validTo = asDate(card.DEND);
  const today = now.toISOString().slice(0, 10);
  const active = (!validFrom || validFrom <= today) && (!validTo || validTo >= today);
  const duty = parseDuty(tnved);
  const vat = parseVat(tnved, tnvedAll);
  const excise = parseExcise(tnved);
  const requiredInputs = new Set<'weightKg' | 'quantity' | 'volumeM3' | 'eurRate' | 'usdRate'>();
  let measureUnit: string | null = null;
  for (const component of duty.components) {
    if (component.type !== 'specific') continue;
    requiredInputs.add(component.measure.input);
    measureUnit = component.measure.unit;
    if (component.currency === 'EUR') requiredInputs.add('eurRate');
    else if (component.currency === 'USD') requiredInputs.add('usdRate');
  }
  let supported = duty.unsupported === null && !excise.present && active && vat.percent !== null;
  let reason: string | null = null;
  if (!active) reason = 'Код не действует в текущий период.';
  else if (duty.unsupported) reason = duty.unsupported;
  else if (excise.present) reason = 'Товар подлежит акцизу — расчёт уточнит специалист.';
  else if (vat.percent === null) reason = 'Ставка НДС по коду не определена.';
  return {
    code: card.CODE, name: name || card.CODE, validFrom, validTo, active,
    version: String(card.VERSION ?? card.API_VERSION ?? ''),
    duty, vat, excise,
    requirements: buildRequirements(tnvedAll),
    requiredInputs: [...requiredInputs],
    measureUnit,
    supported, reason,
  };
}

export function normalizeCard(raw: unknown, fetchedAt: string, cached = false): CardResponse {
  const a = analyzeCard(raw, new Date());
  const warnings: string[] = [];
  if (!a.active) warnings.push('Срок действия кода ограничен — проверьте даты.');
  warnings.push(...a.vat.notes);
  if (a.requiredInputs.includes('weightKg') || a.requiredInputs.includes('quantity') || a.requiredInputs.includes('volumeM3')) {
    warnings.push('Пошлина комбинированная: помимо процента включает ставку за единицу (вес, количество или объём).');
  }
  return {
    code: a.code, name: a.name, validFrom: a.validFrom, validTo: a.validTo, active: a.active,
    source: 'TKS', fetchedAt, cached, version: a.version,
    rates: {
      importDuty: { text: a.duty.text, notes: [] },
      vat: { text: a.vat.text, notes: a.vat.notes },
      excise: { text: a.excise.text, notes: a.excise.present ? ['Акциз в предварительный расчёт не включается.'] : [] },
    },
    requirements: a.requirements,
    warnings,
    estimation: {
      supported: a.supported,
      reason: a.reason,
      requiredInputs: a.requiredInputs,
      measureUnit: a.measureUnit,
      notes: [SCOPE, 'В расчёт не входят: таможенные сборы за оформление, доставка, страхование, услуги брокера, утилизационный/экологический сбор, хранение.'],
    },
  };
}

export function normalizeSearch(raw: unknown, query: string, page: number, kind: 'name' | 'code', fetchedAt: string, cached = false): SearchResponse {
  if (kind === 'name') {
    const data = (raw as any)?.data;
    if (!Array.isArray(data)) throw new DomainError('UPSTREAM_RESPONSE', 'Источник не вернул результаты поиска.', 502);
    const total = Number((raw as any)?.hm ?? data.length);
    const perPage = Number((raw as any)?.per_page ?? 20);
    const safeTotal = Number.isFinite(total) ? total : data.length;
    const safePerPage = Number.isFinite(perPage) ? perPage : 20;
    const items = data.map((r: any) => toSearchItem(r)).filter((x): x is SearchItem => x !== null);
    return { query, kind, items, total: safeTotal, page, perPage: safePerPage, hasMore: page * safePerPage < safeTotal, source: 'TKS', fetchedAt, cached, warnings: [] };
  }
  const rows = Array.isArray(raw) ? raw : [];
  const items = rows.map((r: any) => toSearchItem(r)).filter((x): x is SearchItem => x !== null);
  return { query, kind, items, total: items.length, page: 1, perPage: 20, hasMore: false, source: 'TKS', fetchedAt, cached, warnings: [] };
}

function toSearchItem(row: any): SearchItem | null {
  if (!row || typeof row !== 'object') return null;
  const code = String(row.CODE ?? row.code ?? '').trim();
  if (!/^\d{2,10}$/.test(code)) return null;
  const name = String(row.KR_NAIM ?? row.TEXT ?? row.name ?? '').trim() || code;
  return {
    code, name,
    examples: typeof row.CNT === 'number' && Number.isFinite(row.CNT) ? row.CNT : null,
    isLeaf: code.length === 10,
    validFrom: asDate(row.DBEGIN), validTo: asDate(row.DEND),
  };
}

export function estimatePayments(raw: unknown, input: CalculationRequest, now = new Date()): CalculationResponse {
  const a = analyzeCard(raw, now);
  if (typeof input?.code !== 'string' || input.code !== a.code) throw new DomainError('CODE_MISMATCH', 'Код в запросе не совпадает с выбранным товаром.', 422);
  if (!a.active) throw new DomainError('INACTIVE_CODE', 'Код не действует в текущий период.', 422);
  if (a.duty.unsupported) throw new DomainError('UNSUPPORTED_RATE', a.duty.unsupported, 422);
  if (a.excise.present) throw new DomainError('UNSUPPORTED_EXCISE', 'Товар подлежит акцизу — расчёт уточнит специалист.', 422);
  if (a.vat.percent === null) throw new DomainError('UNSUPPORTED_VAT', 'Ставка НДС по коду не определена.', 422);
  if (input?.confirmedBaseRates !== true) throw new DomainError('CONFIRMATION_REQUIRED', 'Подтвердите условия расчёта.', 422);
  const value = input?.customsValueRub;
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) throw new DomainError('INVALID_VALUE', 'Укажите таможенную стоимость в рублях.', 422);
  if (value > 1e12) throw new DomainError('INVALID_VALUE', 'Слишком большое значение стоимости.', 422);
  const eurRub = input?.eurRub; const usdRub = input?.usdRub;
  const breakdown: Array<{ label: string; formula: string; amountRub: number }> = [];
  let dutyRub = 0;
  for (const component of a.duty.components) {
    if (component.type === 'percent') {
      const amount = value * component.value / 100;
      dutyRub += amount;
      breakdown.push({ label: 'Пошлина (адвалорная часть)', formula: `${fmtNumber(value)} ₽ × ${fmtNumber(component.value)} %`, amountRub: fmtRub(amount) });
    } else {
      const measureValue = component.measure.input === 'weightKg' ? input?.weightKg
        : component.measure.input === 'volumeM3' ? input?.volumeM3
        : input?.quantity;
      if (typeof measureValue !== 'number' || !Number.isFinite(measureValue) || measureValue <= 0) {
        throw new DomainError('INPUT_REQUIRED',
          component.measure.input === 'weightKg' ? 'Укажите вес брутто в кг.'
          : component.measure.input === 'volumeM3' ? 'Укажите объём в м³.'
          : `Укажите количество (${component.measure.unit}).`, 422);
      }
      if (component.measure.input === 'quantity' && !Number.isInteger(measureValue)) {
        throw new DomainError('INVALID_VALUE', 'Количество должно быть целым числом.', 422);
      }
      const quantity = measureValue * component.measure.factor;
      let rate: number;
      if (component.currency === 'RUB') rate = 1;
      else {
        const r = component.currency === 'EUR' ? eurRub : usdRub;
        if (typeof r !== 'number' || !Number.isFinite(r) || r <= 0) throw new DomainError('RATE_REQUIRED', 'Укажите курс ' + (component.currency === 'EUR' ? 'евро' : 'доллара') + ' к рублю.', 422);
        rate = r;
      }
      const amount = component.value * quantity * rate;
      dutyRub += amount;
      breakdown.push({ label: 'Пошлина (специфическая часть)', formula: `${fmtNumber(component.value)} × ${fmtNumber(quantity)} × ${fmtNumber(rate)} ₽`, amountRub: fmtRub(amount) });
    }
  }
  const vatBase = value + dutyRub;
  const vatRub = vatBase * a.vat.percent / 100;
  breakdown.push({ label: 'НДС', formula: `${fmtNumber(vatBase)} ₽ × ${fmtNumber(a.vat.percent)} %`, amountRub: fmtRub(vatRub) });
  const total = dutyRub + vatRub;
  return {
    code: a.code, customsValueRub: fmtRub(value), dutyRub: fmtRub(dutyRub), vatRub: fmtRub(vatRub), exciseRub: 0, totalRub: fmtRub(total),
    breakdown, warnings: a.vat.notes, source: 'TKS', calculatedAt: now.toISOString(),
  };
}

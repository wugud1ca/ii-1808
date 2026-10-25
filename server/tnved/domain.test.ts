import assert from 'node:assert/strict';
import test from 'node:test';
import { DomainError, estimatePayments, normalizeCard, normalizeSearch } from './domain';

const CODE = '9401790009';
const fetchedAt = '2026-10-25T09:00:00.000Z';

function chairCard(overrides: any = {}): any {
  return {
    CODE,
    KR_NAIM: 'ПРОЧАЯ МЕБЕЛЬ ДЛЯ СИДЕНИЯ С МЕТАЛЛИЧЕСКИМ КАРКАСОМ',
    DBEGIN: null, DEND: null, VERSION: 2026, PRIM: null, PRIM2: null,
    TNVED: {
      CODE, IMP: 10, IMPEDI: '1', IMP2: 0.08, IMPEDI2: '166', IMPSIGN: '+', IMP3: null, IMPEDI3: null, IMPSIGN2: null,
      NDS: 22, NDSEDI: 'ОО', NDS_PR: 1, AKC: null, AKCEDI: null, AKC2: null, AKCEDI2: null, AKCSIGN: null,
    },
    TNVEDALL: {
      '3': [
        { PRIZNAK: 3, MIN: 22, TYPEMIN: null, PREF: 'ОО', PRIM: 0, DBEGIN: '2026-01-01', DEND: null, NOTE: '' },
        { PRIZNAK: 3, MIN: 10, TYPEMIN: null, PREF: 'ЛД', PRIM: 1, DBEGIN: '2024-04-01', DEND: null, NOTE: 'Детская мебель' },
      ],
      '11': [{ PRIZNAK: 11, MIN: null, TYPEMIN: '1', PRIM: 1, DOC_N: '44', DOC_D: '2014-03-18', DBEGIN: '2014-07-01', DEND: null, NOTE: 'Требуется сертификат ТР ТС 025/2011', CU: null }],
      '30': [{ PRIZNAK: 30, MIN: 10, TYPEMIN: '1', SIGN: '+', MAX: 0.08, TYPEMAX: '166', PRIM: 0, CU: '704', DOC_N: '36', DOC_D: '2016-04-19', NOTE: 'Вьетнам: ставка отличная от нуля', DBEGIN: '2022-01-01', DEND: null }],
    },
    TNVEDCC: [],
    ...overrides,
  };
}
function request(overrides: any = {}): any {
  return { code: CODE, customsValueRub: 100000, confirmedBaseRates: true, ...overrides };
}
function expectError(fn: () => unknown, code: string) {
  assert.throws(fn, (error: any) => error instanceof DomainError && error.code === code);
}

test('normalizeCard renders composite duty, VAT, excise and required inputs', () => {
  const card = normalizeCard(chairCard(), fetchedAt);
  assert.equal(card.code, CODE);
  assert.equal(card.active, true);
  assert.equal(card.rates.importDuty.text, '10 % + 0,08 Евро/кг');
  assert.equal(card.rates.vat.text, '22 %');
  assert.equal(card.rates.excise.text, 'нет');
  assert.deepEqual(card.estimation.requiredInputs, ['weightKg', 'eurRate']);
  assert.equal(card.estimation.supported, true);
  assert.equal(card.estimation.reason, null);
  assert.ok(card.warnings.some((w) => w.includes('льготные')));
  assert.ok(card.estimation.notes.some((n) => n.includes('Китай')));
  const cert = card.requirements.find((g) => g.type === 11)!;
  assert.ok(cert.items[0].text.includes('ТР ТС 025/2011'));
  assert.equal(cert.items[0].document, '44 от 2014-03-18');
  const other = card.requirements.find((g) => g.type === 30)!;
  assert.equal(other.items[0].rate, '10 % + 0,08 Евро/кг');
  assert.equal(other.items[0].country, 'ВЬЕТНАМ');
});

test('normalizeCard reports expired codes inactive and unsupported', () => {
  const card = normalizeCard(chairCard({ DEND: '2020-01-01' }), fetchedAt);
  assert.equal(card.active, false);
  assert.equal(card.estimation.supported, false);
  assert.ok(card.estimation.reason!.includes('не действует'));
});

test('normalizeCard: zero duty is "0 %" supported; null duty is unsupported "нет"', () => {
  const zero = chairCard(); zero.TNVED.IMP = 0; zero.TNVED.IMPEDI = null; zero.TNVED.IMP2 = null; zero.TNVED.IMPEDI2 = null; zero.TNVED.IMPSIGN = null;
  const zc = normalizeCard(zero, fetchedAt);
  assert.equal(zc.rates.importDuty.text, '0 %');
  assert.equal(zc.estimation.supported, true);
  const none = chairCard(); none.TNVED.IMP = null;
  const nc = normalizeCard(none, fetchedAt);
  assert.equal(nc.rates.importDuty.text, 'нет');
  assert.equal(nc.estimation.supported, false);
});

test('normalizeCard rejects malformed card identity', () => {
  for (const raw of [null, [], {}, { error: 'x' }, { ...chairCard(), CODE: ' 9401790009' }, { ...chairCard(), CODE: 9401790009 }, { ...chairCard(), CODE: '940179000' }]) {
    assert.throws(() => normalizeCard(raw, fetchedAt), DomainError);
  }
});

test('normalizeSearch maps grouped goods results with pagination', () => {
  const raw = { data: [{ CNT: 490, CODE, KR_NAIM: 'МЕБЕЛЬ', DBEGIN: null, DEND: null }], hm: 54, page: 1, per_page: 20 };
  const out = normalizeSearch(raw, 'стул', 1, 'name', fetchedAt);
  assert.equal(out.kind, 'name');
  assert.equal(out.total, 54);
  assert.equal(out.items[0].examples, 490);
  assert.equal(out.items[0].isLeaf, true);
  assert.equal(out.hasMore, true);
});

test('normalizeSearch maps tree (code) results', () => {
  const raw = [{ ID: '20640000', CODE, TEXT: '--- прочая', DBEGIN: null, DEND: null }];
  const out = normalizeSearch(raw, CODE, 1, 'code', fetchedAt);
  assert.equal(out.kind, 'code');
  assert.equal(out.items[0].name, '--- прочая');
  assert.equal(out.hasMore, false);
});

test('normalizeSearch rejects malformed payloads', () => {
  assert.throws(() => normalizeSearch({}, 'стул', 1, 'name', fetchedAt), DomainError);
});

test('estimatePayments computes composite duty + VAT', () => {
  const calc = estimatePayments(chairCard(), request({ weightKg: 50, eurRub: 100 }));
  assert.equal(calc.dutyRub, 10400);
  assert.equal(calc.vatRub, 24288);
  assert.equal(calc.totalRub, 34688);
  assert.equal(calc.exciseRub, 0);
  assert.equal(calc.breakdown.length, 3);
});

test('estimatePayments handles percent-only duty', () => {
  const raw = chairCard();
  raw.TNVED.IMP = 5; raw.TNVED.IMP2 = null; raw.TNVED.IMPEDI2 = null; raw.TNVED.IMPSIGN = null; raw.TNVED.NDS = 20;
  const calc = estimatePayments(raw, request());
  assert.equal(calc.dutyRub, 5000);
  assert.equal(calc.vatRub, 21000);
  assert.equal(calc.totalRub, 26000);
});

test('estimatePayments requires the specific-component inputs', () => {
  expectError(() => estimatePayments(chairCard(), request({ eurRub: 100 })), 'INPUT_REQUIRED');
  expectError(() => estimatePayments(chairCard(), request({ weightKg: 50 })), 'RATE_REQUIRED');
  expectError(() => estimatePayments(chairCard(), request({ weightKg: 50, eurRub: 0 })), 'RATE_REQUIRED');
});

test('estimatePayments enforces confirmation and validates values', () => {
  expectError(() => estimatePayments(chairCard(), request({ weightKg: 50, eurRub: 100, confirmedBaseRates: false })), 'CONFIRMATION_REQUIRED');
  expectError(() => estimatePayments(chairCard(), request({ customsValueRub: -5, weightKg: 50, eurRub: 100 })), 'INVALID_VALUE');
  expectError(() => estimatePayments(chairCard(), request({ customsValueRub: NaN, weightKg: 50, eurRub: 100 })), 'INVALID_VALUE');
});

test('estimatePayments refuses excise, inactive and code mismatch', () => {
  const raw = chairCard(); raw.TNVED.AKC = 50; raw.TNVED.AKCEDI = '1';
  expectError(() => estimatePayments(raw, request({ weightKg: 50, eurRub: 100 })), 'UNSUPPORTED_EXCISE');
  expectError(() => estimatePayments(chairCard({ DEND: '2020-01-01' }), request({ weightKg: 50, eurRub: 100 })), 'INACTIVE_CODE');
  expectError(() => estimatePayments(chairCard(), request({ code: '1234567890', weightKg: 50, eurRub: 100 })), 'CODE_MISMATCH');
});

test('estimatePayments supports EUR/USD/RUB specific rates and piece units', () => {
  const raw = chairCard();
  raw.TNVED.IMP = 5; raw.TNVED.IMP2 = null; raw.TNVED.IMPEDI2 = null; raw.TNVED.IMPSIGN = null;
  const eur = estimatePayments({ ...raw, TNVED: { ...raw.TNVED, IMPEDI: '166' } }, request({ weightKg: 2, eurRub: 100 }));
  assert.equal(eur.dutyRub, 1000); // 5 * 2 * 100
  const usd = estimatePayments({ ...raw, TNVED: { ...raw.TNVED, IMPEDI: '166D' } }, request({ weightKg: 2, usdRub: 90 }));
  assert.equal(usd.dutyRub, 900);
  const rub = estimatePayments({ ...raw, TNVED: { ...raw.TNVED, IMPEDI: '166Р' } }, request({ weightKg: 2 }));
  assert.equal(rub.dutyRub, 10); // 5 * 2 * 1
  const piece = estimatePayments({ ...raw, TNVED: { ...raw.TNVED, IMPEDI: '796' } }, request({ quantity: 3, eurRub: 100 }));
  assert.equal(piece.dutyRub, 1500);
});

test('estimatePayments rejects fractional piece counts', () => {
  const raw = chairCard();
  raw.TNVED.IMP = 5; raw.TNVED.IMP2 = null; raw.TNVED.IMPEDI2 = null; raw.TNVED.IMPSIGN = null; raw.TNVED.IMPEDI = '796';
  expectError(() => estimatePayments(raw, request({ quantity: 1.5, eurRub: 100 })), 'INVALID_VALUE');
});

test('estimatePayments rejects malformed card before computing', () => {
  expectError(() => estimatePayments(null, request()), 'UPSTREAM_RESPONSE');
  expectError(() => estimatePayments(chairCard({ CODE: '123' }), request()), 'INVALID_CODE');
});

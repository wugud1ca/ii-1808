import assert from 'node:assert/strict';
import test from 'node:test';
import type { CardResponse } from './types';

test('calculator requires server eligibility, all required inputs, and explicit base-rate consent', async () => {
  const { buildCalculationRequest } = await import('./TnvedApp');
  const card = { code: '9401790009', estimation: { supported: true, reason: null, requiredInputs: ['weightKg', 'eurRate'], measureUnit: 'кг', notes: [] } } as CardResponse;
  const fields = { customsValueRub: '100000,50', weightKg: '25,5', quantity: '', volumeM3: '', eurRub: '99,25', usdRub: '' };
  assert.deepEqual(buildCalculationRequest(card, fields, true), {
    request: { code: '9401790009', customsValueRub: 100000.5, weightKg: 25.5, eurRub: 99.25, confirmedBaseRates: true }, errors: {},
  });
  assert.equal(buildCalculationRequest(card, fields, false).request, null);
  for (const name of ['customsValueRub', 'weightKg', 'eurRub']) {
    const invalid = buildCalculationRequest(card, { ...fields, [name]: '' }, true);
    assert.equal(invalid.request, null);
    assert.ok(invalid.errors[name]);
  }
  const unsupported = { ...card, estimation: { ...card.estimation, supported: false, reason: 'Нужна проверка специалиста' } };
  assert.equal(buildCalculationRequest(unsupported, fields, true).errors.form, 'Нужна проверка специалиста');
  assert.equal(buildCalculationRequest({ ...card, code: '9401' }, fields, true).request, null);
});

// Pure frontend tests; no production API or provider is contacted.
test('decimal input accepts a comma and rejects non-positive or non-finite values', async () => {
  const { parsePositiveDecimal } = await import('./TnvedApp');
  assert.equal(parsePositiveDecimal(' 1250,50 '), 1250.5);
  assert.equal(parsePositiveDecimal('0.25'), 0.25);
  for (const value of ['', '0', '-1', 'Infinity', 'NaN', '1e3', '1,2,3', '1 2', '9'.repeat(400)]) {
    assert.equal(parsePositiveDecimal(value), null, value);
  }
});

test('history and favorites storage rules, deduplication, and limits', async () => {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, val: string) => { store.set(key, val); },
    removeItem: (key: string) => { store.delete(key); },
    clear: () => { store.clear(); },
  };

  const {
    addHistoryItem,
    clearHistory,
    loadHistory,
    toggleFavoriteItem,
    removeFavoriteItem,
    loadFavorites,
    isFavoriteCode,
    pluralizeCodes,
    formatLeadContext,
  } = await import('./storage');

  clearHistory();
  assert.deepEqual(loadHistory(), []);

  // 1. Add history items and verify deduplication & move-to-top
  addHistoryItem('9401790009', 'Стул 1', new Date('2026-10-25T10:00:00Z'));
  addHistoryItem('6402999800', 'Обувь', new Date('2026-10-25T11:00:00Z'));
  let hist = loadHistory();
  assert.equal(hist.length, 2);
  assert.equal(hist[0].code, '6402999800');
  assert.equal(hist[1].code, '9401790009');

  // Re-opening 9401790009 moves it to top with new timestamp
  addHistoryItem('9401790009', 'Стул 1 обновлённый', new Date('2026-10-25T12:00:00Z'));
  hist = loadHistory();
  assert.equal(hist.length, 2);
  assert.equal(hist[0].code, '9401790009');
  assert.equal(hist[0].name, 'Стул 1 обновлённый');

  // Max 20 items limit
  for (let i = 1; i <= 25; i++) {
    const code = String(1000000000 + i);
    addHistoryItem(code, `Товар ${i}`);
  }
  hist = loadHistory();
  assert.equal(hist.length, 20);

  // Clear history
  clearHistory();
  assert.deepEqual(loadHistory(), []);

  // 2. Favorites toggle and removal
  const f1 = toggleFavoriteItem('9401790009', 'Стул металлический');
  assert.equal(f1.isFav, true);
  assert.equal(isFavoriteCode('9401790009', loadFavorites()), true);

  const f2 = toggleFavoriteItem('9401790009', 'Стул металлический');
  assert.equal(f2.isFav, false);
  assert.equal(isFavoriteCode('9401790009', loadFavorites()), false);

  toggleFavoriteItem('6402999800', 'Обувь резиновая');
  assert.equal(loadFavorites().length, 1);
  removeFavoriteItem('6402999800');
  assert.equal(loadFavorites().length, 0);

  // 3. Pluralization
  assert.equal(pluralizeCodes(1), '1 код');
  assert.equal(pluralizeCodes(2), '2 кода');
  assert.equal(pluralizeCodes(3), '3 кода');
  assert.equal(pluralizeCodes(4), '4 кода');
  assert.equal(pluralizeCodes(5), '5 кодов');
  assert.equal(pluralizeCodes(11), '11 кодов');
  assert.equal(pluralizeCodes(21), '21 код');
  assert.equal(pluralizeCodes(24), '24 кода');
  assert.equal(pluralizeCodes(25), '25 кодов');

  // 4. Lead context formatting
  assert.equal(formatLeadContext(['9401790009']), 'Просчёт поставки по кодам: 9401790009');
  assert.equal(
    formatLeadContext(['9401790009', '6402999800']),
    'Просчёт поставки по кодам: 9401790009, 6402999800'
  );
  assert.equal(
    formatLeadContext(['9401790009', ' 9401790009 ', '6402999800']),
    'Просчёт поставки по кодам: 9401790009, 6402999800'
  );

  delete (globalThis as any).localStorage;
});

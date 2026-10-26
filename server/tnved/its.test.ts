import assert from 'node:assert/strict';
import { test } from 'node:test';
import { itsForCode, loadItsDataset, type ItsDataset } from './its';

const fixture: ItsDataset = {
  meta: { period: '2024', source: 'UN Comtrade (fixture)', generatedAt: '2026-10-26T00:00:00Z' },
  codes: {
    // 940179: есть вес → цена за кг
    '940179': { hs6: '940179', period: '2024', value: 200_000_000, kg: 40_000_000 },
    // 640299: только количество → цена за шт
    '640299': { hs6: '640299', period: '2024', value: 10_000_000, units: 2_000_000, unitAbbr: 'u' },
    // 851713: нет ни веса, ни количества → found:false
    '851713': { hs6: '851713', period: '2024', value: 5_000 },
  },
};

test('its: цена за кг по префиксу 10-значного кода', () => {
  loadItsDataset(fixture);
  const a = itsForCode('9401790009');
  assert.equal(a.found, true);
  assert.equal(a.hs6, '940179');
  assert.equal(a.unit, 'кг');
  assert.equal(a.price, 5);
  assert.equal(a.period, '2024');
  assert.ok(a.source && a.source.includes('fixture'));
});

test('its: цена за штуку, когда веса нет', () => {
  loadItsDataset(fixture);
  const a = itsForCode('6402999800');
  assert.equal(a.found, true);
  assert.equal(a.unit, 'u');
  assert.equal(a.price, 5);
});

test('its: при наличии и веса, и количества показываем обе цены', () => {
  loadItsDataset({
    meta: { period: '2021', source: 't', generatedAt: 'x' },
    codes: { '847130': { hs6: '847130', period: '2021', value: 1_000_000, kg: 4_000, units: 2_500, unitAbbr: 'шт' } },
  });
  const a = itsForCode('8471300000');
  assert.equal(a.price, 250);   // $/кг
  assert.equal(a.unit, 'кг');
  assert.equal(a.priceAlt, 400); // $/шт
  assert.equal(a.unitAlt, 'шт');
});

test('its: нет веса и количества → не показываем', () => {
  loadItsDataset(fixture);
  assert.equal(itsForCode('8517130000').found, false);
});

test('its: неизвестный код / неверный формат', () => {
  loadItsDataset(fixture);
  assert.equal(itsForCode('9999990000').found, false);
  assert.equal(itsForCode('abc').found, false);
  assert.equal(itsForCode('940179').found, false);
});

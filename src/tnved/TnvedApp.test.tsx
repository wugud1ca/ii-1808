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
test('invitation fragment is removed before access and is never included in a GET', async () => {
  const { initializeSession } = await import('./TnvedApp');
  const originalFetch = globalThis.fetch;
  const events: string[] = [];
  const session = { authenticated: true, ready: true, mode: 'private', expiresAt: null };
  globalThis.fetch = async (url, options) => {
    events.push(String(url));
    assert.equal(options?.credentials, 'same-origin');
    assert.equal(options?.referrerPolicy, 'no-referrer');
    if (String(url).endsWith('/access')) {
      assert.equal(events[0], '/tnved?view=test');
      assert.equal(options?.method, 'POST');
      assert.deepEqual(JSON.parse(String(options?.body)), { token: 'offline-fixture-only' });
      return new Response(null, { status: 204 });
    }
    assert.equal(options?.body, undefined);
    return Response.json(session);
  };
  try {
    const result = await initializeSession(
      { hash: '#access=offline-fixture-only', pathname: '/tnved', search: '?view=test' },
      { replaceState: (_state, _unused, url) => { events.push(String(url)); } },
    );
    assert.deepEqual(result, session);
    assert.deepEqual(events, ['/tnved?view=test', '/api/tnved/access', '/api/tnved/session']);
  } finally { globalThis.fetch = originalFetch; }
});
test('decimal input accepts a comma and rejects non-positive or non-finite values', async () => {
  const { parsePositiveDecimal } = await import('./TnvedApp');
  assert.equal(parsePositiveDecimal(' 1250,50 '), 1250.5);
  assert.equal(parsePositiveDecimal('0.25'), 0.25);
  for (const value of ['', '0', '-1', 'Infinity', 'NaN', '1e3', '1,2,3', '1 2', '9'.repeat(400)]) {
    assert.equal(parsePositiveDecimal(value), null, value);
  }
});

import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import express from 'express';
import { createTnvedRouter, type TnvedDependencies } from './http';
import { TksClient, TnvedError } from './client';
import { parseExchangeRates } from './rates';

async function harness(overrides: Partial<TnvedDependencies> = {}) {
  const app = express();
  const calls: string[] = [];
  const deps: TnvedDependencies = {
    key: 'a'.repeat(32),
    api: { card: async(code) => { calls.push(code); return { data: { CODE: code }, fetchedAt: new Date().toISOString(), cached: false }; }, search: async(q) => { calls.push(q); return { data: [], fetchedAt: new Date().toISOString(), cached: false }; } },
    normalizeCard: (raw: any, fetchedAt, cached) => ({ code: raw.CODE, fetchedAt, cached }) as any,
    normalizeSearch: (_raw, q) => ({ query: q, items: [] }) as any,
    estimatePayments: (_raw, data) => ({ code: data.code, totalRub: 100 }) as any,
    exchangeRates: async () => ({ source: 'Банк России', date: '01.01.2026', eurRub: 100, usdRub: 90, cnyRub: 13, fetchedAt: new Date().toISOString() }),
    itsForCode: () => ({ found: false }),
    ...overrides,
  };
  app.use('/api/tnved', createTnvedRouter(deps));
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address() as any;
  const base = `http://127.0.0.1:${address.port}/api/tnved`;
  const close = () => new Promise<void>((resolve) => server.close(() => resolve()));
  return { base, close, calls };
}

test('public endpoints work without any authentication', async () => {
  const h = await harness();
  try {
    assert.deepEqual(await fetch(h.base + '/session').then((r) => r.json()), { ready: true, mode: 'public' });
    assert.equal((await fetch(h.base + '/card/9401790009')).status, 200);
    assert.equal((await fetch(h.base + '/search?q=стул')).status, 200);
    assert.equal((await fetch(h.base + '/rates')).status, 200);
    assert.deepEqual(h.calls, ['9401790009', 'стул']);
  } finally { await h.close(); }
});

test('missing key reports ready:false and 503s data endpoints without contacting TKS', async () => {
  const h = await harness({ key: '' });
  try {
    assert.deepEqual(await fetch(h.base + '/session').then((r) => r.json()), { ready: false, mode: 'public' });
    for (const path of ['/search?q=стул', '/card/9401790009', '/rates']) {
      assert.equal((await fetch(h.base + path)).status, 503, path);
    }
    assert.deepEqual(h.calls, []);
  } finally { await h.close(); }
});

test('responses carry no-store/noindex hygiene headers', async () => {
  const h = await harness();
  try {
    const res = await fetch(h.base + '/session');
    assert.match(res.headers.get('x-robots-tag')!, /noindex/);
    assert.match(res.headers.get('cache-control')!, /no-store/);
  } finally { await h.close(); }
});

test('malformed queries, excessive pagination and invalid code never reach TKS', async () => {
  const h = await harness();
  try {
    for (const path of ['/search?q=x', '/search?q=%3Cscript%3E', '/search?q=12345678901', '/search?q=стул&page=999', '/card/9401', '/search?q[]=стул']) {
      assert.equal((await fetch(h.base + path)).status, 400, path);
    }
    assert.deepEqual(h.calls, []);
  } finally { await h.close(); }
});

test('calculate validates the code and runs the estimator', async () => {
  const h = await harness();
  try {
    const res = await fetch(h.base + '/calculate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: '9401790009', customsValueRub: 100, confirmedBaseRates: true }) });
    assert.equal(res.status, 200);
    assert.equal((await res.json()).totalRub, 100);
    assert.deepEqual(h.calls, ['9401790009']);
  } finally { await h.close(); }
});

test('upstream exception text cannot leak a credential-bearing URL', async () => {
  const h = await harness({ api: { card: async () => { throw new Error('https://api1.tks.ru/tnved.json/json/' + 'a'.repeat(32)); }, search: async () => { throw new Error('secret'); } } });
  try {
    const res = await fetch(h.base + '/card/9401790009');
    assert.equal(res.status, 502);
    assert.ok(!(await res.text()).includes('a'.repeat(32)));
  } finally { await h.close(); }
});

test('same upstream request is coalesced and cached; redirects are prohibited', async () => {
  let calls = 0;
  const api = new TksClient('a'.repeat(32), { spacingMs: 0, fetcher: async (_url, init) => {
    calls++; assert.equal(init?.redirect, 'error');
    return new Response(JSON.stringify({ CODE: '9401790009', TNVED: {} }), { status: 200 });
  } });
  const [a, b] = await Promise.all([api.card('9401790009'), api.card('9401790009')]);
  assert.equal(calls, 1); assert.deepEqual(a.data, b.data);
  const c = await api.card('9401790009'); assert.equal(c.cached, true); assert.equal(calls, 1);
});

test('upstream errors and malformed JSON fail safely and do not poison cache', async () => {
  let calls = 0;
  const api = new TksClient('a'.repeat(32), { spacingMs: 0, fetcher: async () => {
    calls++; return new Response(calls === 1 ? 'bad response' : JSON.stringify({ CODE: '9401790009' }), { status: 200 });
  } });
  await assert.rejects(() => api.card('9401790009'), TnvedError);
  await api.card('9401790009'); assert.equal(calls, 2);
});

test('CBR nominal handling uses per-unit rates and rejects missing/invalid currencies', () => {
  const xml = '<ValCurs Date="24.10.2026"><Valute><CharCode>USD</CharCode><Nominal>1</Nominal><Value>90,00</Value></Valute><Valute><CharCode>EUR</CharCode><Nominal>1</Nominal><Value>100,00</Value></Valute><Valute><CharCode>CNY</CharCode><Nominal>10</Nominal><Value>130,00</Value></Valute></ValCurs>';
  const rates = parseExchangeRates(xml, '2026-10-25T00:00:00Z');
  assert.equal(rates.cnyRub, 13); assert.equal(rates.eurRub, 100); assert.equal(rates.date, '24.10.2026');
  assert.throws(() => parseExchangeRates('<html>blocked</html>', '2026-10-25T00:00:00Z'));
  assert.throws(() => parseExchangeRates(xml.replace('100,00', 'NaN'), '2026-10-25T00:00:00Z'));
});

test('GET /its/:code validates format and passes through the lookup', async () => {
  const h = await harness({
    itsForCode: (code) => (code === '9401790009'
      ? { found: true, hs6: '940179', period: '2024', price: 5, unit: 'кг', source: 'test' }
      : { found: false }),
  });
  try {
    const ok = await fetch(`${h.base}/its/9401790009`);
    assert.equal(ok.status, 200);
    const body: any = await ok.json();
    assert.equal(body.price, 5);
    assert.equal(body.unit, 'кг');
    const miss = await fetch(`${h.base}/its/9999990000`);
    assert.equal(miss.status, 200);
    assert.equal((await miss.json() as any).found, false);
    const bad = await fetch(`${h.base}/its/123`);
    assert.equal(bad.status, 400);
  } finally {
    await h.close();
  }
});

test('CORS headers and preflight allow external studio previews', async () => {
  const h = await harness();
  try {
    const res = await fetch(`${h.base}/session`);
    assert.equal(res.headers.get('access-control-allow-origin'), '*');
    const preflight = await fetch(`${h.base}/card/9401790009`, {
      method: 'OPTIONS',
      headers: { Origin: 'https://preview.studio.example', 'Access-Control-Request-Method': 'GET' },
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), '*');
    assert.ok(preflight.headers.get('access-control-allow-methods')?.includes('GET'));
  } finally {
    await h.close();
  }
});

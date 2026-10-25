import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import test from 'node:test';
import express from 'express';
import { createTnvedRouter, type TnvedDependencies } from './http';
import { TksClient, TnvedError } from './client';
import { parseExchangeRates } from './rates';

const invitation = 't'.repeat(43); // synthetic offline fixture, not an access credential
const previewHash = createHash('sha256').update(invitation).digest('hex');
const origin = 'https://express-today.ru';

async function harness(overrides: Partial<TnvedDependencies> = {}) {
  const app = express();
  const calls: string[] = [];
  const deps: TnvedDependencies = {
    key: 'a'.repeat(32), previewHash, sessionSecret: 'b'.repeat(64),
    previewExpiresAt: '2099-01-01T00:00:00.000Z', origin, secureCookies: true,
    api: { card: async(code) => { calls.push(code); return { data: { CODE: code }, fetchedAt: new Date().toISOString(), cached: false }; }, search: async(q) => { calls.push(q); return { data: [], fetchedAt: new Date().toISOString(), cached: false }; } },
    normalizeCard: (raw: any, fetchedAt, cached) => ({ code: raw.CODE, fetchedAt, cached }) as any,
    normalizeSearch: (_raw, q) => ({ query: q, items: [] }) as any,
    estimatePayments: (_raw, data) => ({ code: data.code, totalRub: 100 }) as any,
    exchangeRates: async () => ({ source: 'Банк России', date: '01.01.2026', eurRub: 100, usdRub: 90, cnyRub: 13, fetchedAt: new Date().toISOString() }),
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

async function login(base: string) {
  const response = await fetch(base + '/access', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify({ token: invitation }) });
  assert.equal(response.status, 200);
  return response.headers.get('set-cookie')!;
}

test('private endpoints reject unauthenticated access without contacting TKS', async () => {
  const h = await harness();
  try {
    for (const path of ['/search?q=стул', '/card/9401790009', '/rates']) {
      const res = await fetch(h.base + path);
      assert.equal(res.status, 401);
      assert.match(res.headers.get('x-robots-tag')!, /noindex/);
      assert.match(res.headers.get('cache-control')!, /no-store/);
    }
    assert.deepEqual(h.calls, []);
  } finally { await h.close(); }
});

test('invitation produces a signed HttpOnly Secure session, not a provider key', async () => {
  const h = await harness();
  try {
    const cookie = await login(h.base);
    assert.match(cookie, /HttpOnly/); assert.match(cookie, /Secure/); assert.match(cookie, /SameSite=Strict/);
    assert.ok(!cookie.includes(invitation)); assert.ok(!cookie.includes('a'.repeat(32)));
    const session = await fetch(h.base + '/session', { headers: { cookie: cookie.split(';')[0] } }).then(r => r.json());
    assert.equal(session.authenticated, true);
    const card = await fetch(h.base + '/card/9401790009', { headers: { cookie: cookie.split(';')[0] } });
    assert.equal(card.status, 200); assert.equal((await card.json()).code, '9401790009');
  } finally { await h.close(); }
});

test('wrong invitation, cross-origin requests and tampered cookies fail closed', async () => {
  const h = await harness();
  try {
    const other = await fetch(h.base + '/access', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://evil.example' }, body: JSON.stringify({ token: invitation }) });
    assert.equal(other.status, 403);
    const wrong = await fetch(h.base + '/access', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify({ token: 'x'.repeat(43) }) });
    assert.equal(wrong.status, 401);
    const cookie = await login(h.base);
    const bad = cookie.split(';')[0] + 'x';
    assert.equal((await fetch(h.base + '/card/9401790009', { headers: { cookie: bad } })).status, 401);
  } finally { await h.close(); }
});

test('missing config or expired invitation cannot grant access', async () => {
  for (const config of [{ key: '' }, { previewExpiresAt: '2000-01-01T00:00:00Z' }]) {
    const h = await harness(config);
    try {
      const res = await fetch(h.base + '/access', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify({ token: invitation }) });
      assert.ok([401, 503].includes(res.status)); assert.deepEqual(h.calls, []);
    } finally { await h.close(); }
  }
});

test('malformed queries, excessive pagination and invalid code never reach TKS', async () => {
  const h = await harness();
  try {
    const cookie = (await login(h.base)).split(';')[0];
    for (const path of ['/search?q=x', '/search?q=%3Cscript%3E', '/search?q=12345678901', '/search?q=стул&page=999', '/card/9401', '/search?q[]=стул']) {
      assert.equal((await fetch(h.base + path, { headers: { cookie } })).status, 400, path);
    }
    assert.deepEqual(h.calls, []);
  } finally { await h.close(); }
});

test('upstream exception text cannot leak a credential-bearing URL', async () => {
  const h = await harness({ api: { card: async () => { throw new Error('https://api1.tks.ru/tnved.json/json/' + 'a'.repeat(32)); }, search: async () => { throw new Error('secret'); } } });
  try {
    const cookie = (await login(h.base)).split(';')[0];
    const res = await fetch(h.base + '/card/9401790009', { headers: { cookie } });
    assert.equal(res.status, 502); assert.ok(!(await res.text()).includes('a'.repeat(32)));
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

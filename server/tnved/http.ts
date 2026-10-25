import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import express, { type Request, type Response } from 'express';
import type { CalculationRequest, CalculationResponse, CardResponse, ExchangeRatesResponse, SearchResponse } from '../../src/tnved/types';
import { TnvedError, type TksApi } from './client';

export interface TnvedDependencies {
  key: string;
  previewHash: string;
  sessionSecret: string;
  previewExpiresAt: string;
  origin: string;
  secureCookies: boolean;
  api: TksApi;
  normalizeCard: (raw: unknown, fetchedAt: string, cached?: boolean) => CardResponse;
  normalizeSearch: (raw: unknown, query: string, page: number, kind: 'name' | 'code', fetchedAt: string, cached?: boolean) => SearchResponse;
  estimatePayments: (raw: unknown, input: CalculationRequest, now?: Date) => CalculationResponse;
  exchangeRates: () => Promise<ExchangeRatesResponse>;
}

const COOKIE = 'et_tnved_preview';
const SESSION_SECONDS = 7 * 24 * 60 * 60;

export function privateHeaders(_req: Request, res: Response, next: () => void) {
  res.set({ 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' });
  next();
}

export function createTnvedRouter(deps: TnvedDependencies) {
  const router = express.Router();
  const attempts = new Map<string, { count: number; until: number }>();
  const traffic = new Map<string, { count: number; until: number }>();
  const previewExpiry = Date.parse(deps.previewExpiresAt);
  const ready = /^[a-z0-9]{32}$/.test(deps.key) && /^[a-f0-9]{64}$/.test(deps.previewHash) && deps.sessionSecret.length >= 48 && Number.isFinite(previewExpiry);
  const cookieOptions = { httpOnly: true, secure: deps.secureCookies, sameSite: 'strict' as const, path: '/api/tnved' };
  const sign = (value: string) => createHmac('sha256', deps.sessionSecret).update(value).digest('base64url');
  const equal = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
  const ip = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown';

  function limited(map: typeof traffic, key: string, cap: number, ms: number) {
    const now = Date.now();
    if (map.size > 2000) for (const [name, value] of map) if (value.until <= now) map.delete(name);
    if (map.size > 3000 && !map.has(key)) return true;
    const item = map.get(key);
    if (!item || item.until <= now) { map.set(key, { count: 1, until: now + ms }); return false; }
    item.count++; return item.count > cap;
  }

  function readSession(req: Request): number | null {
    if (!ready || Date.now() >= previewExpiry) return null;
    const raw = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(COOKIE + '='))?.slice(COOKIE.length + 1);
    if (!raw || raw.length > 600) return null;
    const parts = raw.split('.');
    if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !equal(sign(parts[0]), parts[1])) return null;
    try {
      const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
      if (!Number.isSafeInteger(payload.exp) || payload.exp <= Date.now() || payload.exp > previewExpiry) return null;
      return payload.exp;
    } catch { return null; }
  }

  function fail(res: Response, error: unknown) {
    if (error instanceof TnvedError || (error instanceof Error && error.name === 'DomainError')) {
      const e = error as TnvedError;
      const status = Number.isInteger(e.status) && e.status >= 400 && e.status <= 599 ? e.status : 422;
      if (e.retryAfter) res.set('Retry-After', String(e.retryAfter));
      res.status(status).json({ error: String(e.code || 'INVALID_REQUEST').slice(0, 80), message: e.message.slice(0, 500), ...(e.retryAfter ? { retryAfter: e.retryAfter } : {}) });
    } else {
      // No exception messages or provider objects are reflected to visitors/logs.
      res.status(502).json({ error: 'SERVICE_UNAVAILABLE', message: 'Не удалось обработать запрос. Повторите позже.' });
    }
  }

  router.use(privateHeaders);
  router.use(express.json({ limit: '4kb' }));
  router.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.headers.origin !== deps.origin) {
      res.status(403).json({ error: 'ORIGIN_DENIED', message: 'Запрос разрешён только со страницы сервиса.' }); return;
    }
    next();
  });
  router.get('/session', (req, res) => {
    const exp = readSession(req);
    res.json({ authenticated: exp !== null, ready, mode: 'private', expiresAt: exp ? new Date(exp).toISOString() : null });
  });
  router.post('/access', (req, res) => {
    if (!ready) { res.status(503).json({ error: 'NOT_CONFIGURED', message: 'Тестовая версия пока не настроена.' }); return; }
    if (limited(attempts, ip(req), 8, 15 * 60_000)) {
      res.set('Retry-After', '900').status(429).json({ error: 'AUTH_LIMIT', message: 'Слишком много попыток входа. Повторите через 15 минут.', retryAfter: 900 }); return;
    }
    const token = req.body?.token;
    if (Date.now() >= previewExpiry || typeof token !== 'string' || !/^[A-Za-z0-9_-]{43,128}$/.test(token) || !equal(createHash('sha256').update(token).digest('hex'), deps.previewHash)) {
      res.status(401).json({ error: 'INVALID_INVITATION', message: 'Ссылка доступа недействительна или срок тестирования истёк.' }); return;
    }
    const exp = Math.min(Date.now() + SESSION_SECONDS * 1000, previewExpiry);
    const payload = Buffer.from(JSON.stringify({ exp, nonce: randomBytes(16).toString('hex') })).toString('base64url');
    res.cookie(COOKIE, `${payload}.${sign(payload)}`, { ...cookieOptions, maxAge: exp - Date.now() });
    res.json({ authenticated: true, ready: true, mode: 'private', expiresAt: new Date(exp).toISOString() });
  });
  router.post('/logout', (_req, res) => {
    res.clearCookie(COOKIE, cookieOptions);
    res.json({ authenticated: false, ready, mode: 'private', expiresAt: null });
  });
  router.use((req, res, next) => {
    if (readSession(req) === null) { res.status(401).json({ error: 'AUTH_REQUIRED', message: 'Откройте персональную ссылку для доступа к тестовой версии.' }); return; }
    if (limited(traffic, ip(req), 90, 60_000)) {
      res.set('Retry-After', '60').status(429).json({ error: 'RATE_LIMIT', message: 'Слишком много запросов. Подождите минуту.', retryAfter: 60 }); return;
    }
    next();
  });

  router.get('/search', async (req, res) => {
    try {
      if (typeof req.query.q !== 'string' || (req.query.page !== undefined && typeof req.query.page !== 'string')) throw new TnvedError('INVALID_QUERY', 'Введите название товара или код ТН ВЭД.', 400);
      const q = req.query.q.trim();
      const pageText = (req.query.page as string | undefined) || '1';
      if (q.length < 2 || q.length > 120 || !/^[A-Za-zА-Яа-яЁё0-9\s-]+$/.test(q) || !/^[1-9]\d?$/.test(pageText) || Number(pageText) > 50) throw new TnvedError('INVALID_QUERY', 'Введите 2–120 букв/цифр. Номер страницы — от 1 до 50.', 400);
      const kind = /^\d+$/.test(q) ? 'code' : 'name';
      if (kind === 'code' && !/^\d{2,10}$/.test(q)) throw new TnvedError('INVALID_CODE', 'Код должен содержать от 2 до 10 цифр.', 400);
      const page = Number(pageText);
      if (kind === 'code' && q.length === 10) {
        const raw = await deps.api.card(q);
        const card = deps.normalizeCard(raw.data, raw.fetchedAt, raw.cached);
        res.json({ query: q, kind, items: [{ code: card.code, name: card.name, examples: null, isLeaf: true, validFrom: card.validFrom, validTo: card.validTo }], total: 1, page: 1, perPage: 20, hasMore: false, source: 'TKS', fetchedAt: raw.fetchedAt, cached: raw.cached, warnings: card.active ? [] : ['Срок действия кода ограничен. Проверьте даты в карточке.'] });
      } else {
        const result = await deps.api.search(q, page);
        res.json(deps.normalizeSearch(result.data, q, page, kind, result.fetchedAt, result.cached));
      }
    } catch (error) { fail(res, error); }
  });
  router.get('/card/:code', async (req, res) => {
    try {
      const code = String(req.params.code);
      if (!/^\d{10}$/.test(code)) throw new TnvedError('INVALID_CODE', 'Выберите полный код из 10 цифр.', 400);
      const result = await deps.api.card(code);
      res.json(deps.normalizeCard(result.data, result.fetchedAt, result.cached));
    } catch (error) { fail(res, error); }
  });
  router.get('/rates', async (_req, res) => {
    try { res.json(await deps.exchangeRates()); } catch (error) { fail(res, error); }
  });
  router.post('/calculate', async (req, res) => {
    try {
      if (!req.body || typeof req.body.code !== 'string' || !/^\d{10}$/.test(req.body.code)) throw new TnvedError('INVALID_CODE', 'Выберите полный код из 10 цифр.', 400);
      const result = await deps.api.card(req.body.code);
      res.json(deps.estimatePayments(result.data, req.body));
    } catch (error) { fail(res, error); }
  });
  router.use((_req, res) => res.status(404).json({ error: 'NOT_FOUND', message: 'Метод не найден.' }));
  router.use((error: any, _req: Request, res: Response, _next: unknown) => {
    res.status(error?.type === 'entity.too.large' ? 413 : 400).json({ error: 'INVALID_BODY', message: 'Неверный формат запроса.' });
  });
  return router;
}

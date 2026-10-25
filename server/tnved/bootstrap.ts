import { createHash } from 'node:crypto';
import { TksClient } from './client';
import { estimatePayments, normalizeCard, normalizeSearch } from './domain';
import { createTnvedRouter, type TnvedDependencies } from './http';
import { fetchExchangeRates } from './rates';

/**
 * Builds the /api/tnved router from environment variables. Returns a router that
 * reports `ready: false` (503 on /access) when the required secrets are missing,
 * so the app can always be mounted without leaking configuration state.
 */
export function createTnvedRouterFromEnv(env: NodeJS.ProcessEnv) {
  const key = (env.TKS_API_KEY || '').trim();
  const token = (env.TNVED_PREVIEW_TOKEN || '').trim();
  const previewHash = /^[a-f0-9]{64}$/.test(env.TNVED_PREVIEW_HASH || '')
    ? env.TNVED_PREVIEW_HASH!
    : token ? createHash('sha256').update(token).digest('hex') : '';
  const sessionSecret = env.TNVED_SESSION_SECRET || '';
  const previewExpiresAt = env.TNVED_PREVIEW_EXPIRES_AT || '';
  const origin = (env.TNVED_ORIGIN || 'https://express-today.ru').trim();
  const secureCookies = env.TNVED_INSECURE_COOKIES !== '1';
  const api = new TksClient(key);
  const deps: TnvedDependencies = {
    key, previewHash, sessionSecret, previewExpiresAt, origin, secureCookies, api,
    normalizeCard, normalizeSearch, estimatePayments,
    exchangeRates: fetchExchangeRates,
  };
  return createTnvedRouter(deps);
}

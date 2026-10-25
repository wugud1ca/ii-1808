import { TksClient } from './client';
import { estimatePayments, normalizeCard, normalizeSearch } from './domain';
import { createTnvedRouter, type TnvedDependencies } from './http';
import { fetchExchangeRates } from './rates';

/**
 * Builds the public /api/tnved router from environment variables. The router
 * reports `ready: false` (503 on data endpoints) when the license key is missing,
 * so the app can always be mounted without leaking configuration state.
 */
export function createTnvedRouterFromEnv(env: NodeJS.ProcessEnv) {
  const key = (env.TKS_API_KEY || '').trim();
  const deps: TnvedDependencies = {
    key,
    api: new TksClient(key),
    normalizeCard, normalizeSearch, estimatePayments,
    exchangeRates: fetchExchangeRates,
  };
  return createTnvedRouter(deps);
}

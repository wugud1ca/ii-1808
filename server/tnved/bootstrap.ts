import { TksClient } from './client';
import { MockTksClient } from './mockClient';
import { estimatePayments, normalizeCard, normalizeSearch } from './domain';
import { createTnvedRouter, type TnvedDependencies } from './http';
import { fetchExchangeRates } from './rates';

/**
 * Builds the public /api/tnved router from environment variables.
 * When TKS_API_KEY is valid, uses live TKS API.
 * When missing, uses the spec-compliant MockTksClient so the UI works out of the box with sample data.
 */
export function createTnvedRouterFromEnv(env: NodeJS.ProcessEnv) {
  const key = (env.TKS_API_KEY || '').trim();
  const isReal = /^[a-z0-9]{32}$/.test(key);
  const api = isReal ? new TksClient(key) : new MockTksClient();
  const deps: TnvedDependencies = {
    key: isReal ? key : 'mock-active-spec-conforming-key',
    api,
    normalizeCard, normalizeSearch, estimatePayments,
    exchangeRates: fetchExchangeRates,
  };
  return createTnvedRouter(deps);
}


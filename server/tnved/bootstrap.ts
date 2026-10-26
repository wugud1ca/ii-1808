import { TksClient } from './client';
import { estimatePayments, normalizeCard, normalizeSearch } from './domain';
import { createTnvedRouter, type TnvedDependencies } from './http';
import { fetchExchangeRates } from './rates';
import { itsForCode, loadItsDataset, type ItsDataset } from './its';
import { ITS_DATASET } from './its-data.generated';

/**
 * Builds the public /api/tnved router from environment variables.
 * Uses the live TKS API only; when TKS_API_KEY is missing the router reports
 * `ready: false` (503 on data endpoints) so the page never shows sample data
 * in production.
 */
export function createTnvedRouterFromEnv(env: NodeJS.ProcessEnv) {
  const key = (env.TKS_API_KEY || '').trim();
  loadItsDataset(ITS_DATASET as ItsDataset);
  const deps: TnvedDependencies = {
    key,
    api: new TksClient(key),
    normalizeCard, normalizeSearch, estimatePayments,
    exchangeRates: fetchExchangeRates,
    itsForCode,
  };
  return createTnvedRouter(deps);
}


export interface TnvedSession {
  ready: boolean;
  mode: 'public';
}

export interface SearchItem {
  code: string;
  name: string;
  examples: number | null;
  isLeaf: boolean;
  validFrom: string | null;
  validTo: string | null;
}

export interface SearchResponse {
  query: string;
  kind: 'name' | 'code';
  items: SearchItem[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
  source: 'TKS';
  fetchedAt: string;
  cached: boolean;
  warnings: string[];
}

export interface RateSummary {
  text: string;
  notes: string[];
}

export interface RequirementItem {
  text: string;
  rate: string | null;
  country: string | null;
  document: string | null;
  validFrom: string | null;
  validTo: string | null;
}

export interface RequirementGroup {
  type: number;
  title: string;
  items: RequirementItem[];
}

export interface CardResponse {
  code: string;
  name: string;
  validFrom: string | null;
  validTo: string | null;
  active: boolean;
  source: 'TKS';
  fetchedAt: string;
  cached: boolean;
  version: string;
  rates: { importDuty: RateSummary; vat: RateSummary; excise: RateSummary };
  requirements: RequirementGroup[];
  warnings: string[];
  estimation: {
    supported: boolean;
    reason: string | null;
    requiredInputs: Array<'weightKg' | 'quantity' | 'volumeM3' | 'eurRate' | 'usdRate'>;
    measureUnit: string | null;
    notes: string[];
  };
}

export interface CalculationRequest {
  code: string;
  customsValueRub: number;
  weightKg?: number;
  quantity?: number;
  volumeM3?: number;
  eurRub?: number;
  usdRub?: number;
  confirmedBaseRates: boolean;
}

export interface CalculationResponse {
  code: string;
  customsValueRub: number;
  dutyRub: number;
  vatRub: number;
  exciseRub: number;
  totalRub: number;
  breakdown: Array<{ label: string; formula: string; amountRub: number }>;
  warnings: string[];
  source: 'TKS';
  calculatedAt: string;
}

export interface ExchangeRatesResponse {
  source: 'Банк России';
  date: string;
  eurRub: number;
  usdRub: number;
  cnyRub: number;
  fetchedAt: string;
}

export interface ApiFailure {
  error: string;
  message: string;
  retryAfter?: number;
}

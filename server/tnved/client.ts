export class TnvedError extends Error {
  constructor(public code: string, message: string, public status = 502, public retryAfter?: number) {
    super(message);
    this.name = 'TnvedError';
  }
}

export interface ApiResult { data: unknown; fetchedAt: string; cached: boolean }
export interface TksApi {
  card(code: string): Promise<ApiResult>;
  search(query: string, page: number): Promise<ApiResult>;
}
interface Options {
  fetcher?: typeof fetch;
  spacingMs?: number;
  cacheLimit?: number;
  maxQueue?: number;
}

/** One shared queue/cache per process. Credential-bearing URLs never leave this class. */
export class TksClient implements TksApi {
  private cache = new Map<string, { result: ApiResult; expires: number }>();
  private pending = new Map<string, Promise<ApiResult>>();
  private tail: Promise<void> = Promise.resolve();
  private lastStart = 0;
  private fetcher: typeof fetch;
  private spacingMs: number;
  private cacheLimit: number;
  private maxQueue: number;

  constructor(private key: string, options: Options = {}) {
    this.fetcher = options.fetcher || fetch;
    this.spacingMs = options.spacingMs ?? 1300;
    this.cacheLimit = options.cacheLimit ?? 256;
    this.maxQueue = options.maxQueue ?? 12;
  }

  card(code: string): Promise<ApiResult> {
    if (!/^\d{10}$/.test(code)) throw new TnvedError('INVALID_CODE', 'Нужен код ТН ВЭД из 10 цифр.', 400);
    return this.request('tnved.json', `${code}.json`, {}, 60 * 60_000);
  }

  async search(query: string, page: number): Promise<ApiResult> {
    if (/^\d{2,10}$/.test(query)) {
      const found = await this.request('tree.json', 'search/', { code: query }, 30 * 60_000);
      const rows: any[] = Array.isArray(found.data) ? found.data : [];
      const exact = rows.find(row => String(row?.CODE) === query);
      if (query.length < 10 && exact && /^\d{1,8}$/.test(String(exact.ID))) {
        const node = String(exact.ID).padStart(8, '0');
        const branch = await this.request('tree.json', `${node}.json`, {}, 30 * 60_000);
        if (Array.isArray(branch.data) && branch.data.length) return branch;
      }
      return found;
    }
    return this.request('goods.json', '', { searchstr: query, page: String(page), group: 'code' }, 10 * 60_000);
  }

  private request(module: string, suffix: string, params: Record<string, string>, ttl: number): Promise<ApiResult> {
    if (!/^[a-z0-9]{32}$/.test(this.key)) return Promise.reject(new TnvedError('NOT_CONFIGURED', 'Сервис временно не настроен.', 503));
    const query = new URLSearchParams(params).toString();
    const cacheKey = `${module}/${suffix}?${query}`;
    const hit = this.cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      this.cache.delete(cacheKey); this.cache.set(cacheKey, hit);
      return Promise.resolve({ ...hit.result, cached: true });
    }
    if (hit) this.cache.delete(cacheKey);
    const duplicate = this.pending.get(cacheKey);
    if (duplicate) return duplicate;
    if (this.pending.size >= this.maxQueue) return Promise.reject(new TnvedError('BUSY', 'Очередь запросов заполнена. Повторите через несколько секунд.', 429, 15));

    const run = this.tail.then(async () => {
      const wait = this.spacingMs - (Date.now() - this.lastStart);
      if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
      this.lastStart = Date.now();
      const url = `https://api1.tks.ru/${module}/json/${this.key}/${suffix}${query ? '?' + query : ''}`;
      let data: unknown;
      try {
        const response = await this.fetcher(url, {
          headers: { Accept: 'application/json', 'User-Agent': 'ExpressToday-Tnved-Private/1.0' },
          redirect: 'error', signal: AbortSignal.timeout(15_000),
        });
        if (response.status === 429) throw new TnvedError('UPSTREAM_LIMIT', 'TKS временно ограничил запросы. Повторите позже.', 429, 30);
        if (!response.ok) throw new TnvedError('UPSTREAM_UNAVAILABLE', 'Источник TKS временно недоступен. Повторите запрос позже.', 502);
        const length = Number(response.headers.get('content-length') || 0);
        if (length > 1_048_576) throw new TnvedError('UPSTREAM_RESPONSE', 'Источник вернул слишком большой ответ.', 502);
        // Streaming bound prevents an unexpectedly large source response from exhausting memory.
        const reader = response.body?.getReader();
        if (!reader) throw new TnvedError('UPSTREAM_RESPONSE', 'Источник вернул пустой ответ.', 502);
        const chunks: Uint8Array[] = []; let size = 0;
        while (true) {
          const part = await reader.read();
          if (part.done) break;
          size += part.value.byteLength;
          if (size > 1_048_576) { await reader.cancel(); throw new TnvedError('UPSTREAM_RESPONSE', 'Источник вернул слишком большой ответ.', 502); }
          chunks.push(part.value);
        }
        const bytes = new Uint8Array(size); let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
        const text = new TextDecoder().decode(bytes).replace(/^\uFEFF/, '');
        if (text.includes(this.key)) throw new TnvedError('UPSTREAM_RESPONSE', 'Не удалось безопасно обработать ответ источника.', 502);
        data = JSON.parse(text);
        if (data === null || typeof data !== 'object') throw new TnvedError('UPSTREAM_RESPONSE', 'Источник вернул неполные данные.', 502);
        if (!Array.isArray(data) && ['error', 'ERROR', 'errors'].some(k => (data as any)[k])) {
          throw new TnvedError('UPSTREAM_RESPONSE', 'Источник не предоставил запрошенные данные.', 502);
        }
      } catch (error) {
        if (error instanceof TnvedError) throw error;
        // Never return/log exception.message: fetch errors can contain the licensed URL.
        throw new TnvedError('UPSTREAM_UNAVAILABLE', 'Не удалось получить данные TKS. Повторите запрос позже.', 502);
      }
      const result: ApiResult = { data, fetchedAt: new Date().toISOString(), cached: false };
      this.cache.set(cacheKey, { result, expires: Date.now() + ttl });
      while (this.cache.size > this.cacheLimit) this.cache.delete(this.cache.keys().next().value!);
      return result;
    });
    this.pending.set(cacheKey, run);
    this.tail = run.then(() => undefined, () => undefined);
    void run.finally(() => this.pending.delete(cacheKey)).catch(() => {});
    return run;
  }
}

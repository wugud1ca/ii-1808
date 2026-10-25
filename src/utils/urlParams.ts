// Проброс параметров текущего URL (utm_*, yclid, gclid, fbclid и любые другие)
// в ссылки на личный кабинет my.express-today.ru, чтобы не терять источник клика.

export function withTrackingParams(url: string): string {
  if (typeof window === 'undefined') return url;
  const params = window.location.search.replace(/^\?/, '');
  if (!params) return url;
  try {
    const u = new URL(url, window.location.origin);
    const incoming = new URLSearchParams(params);
    for (const [key, value] of incoming.entries()) {
      if (!u.searchParams.has(key)) {
        u.searchParams.set(key, value);
      }
    }
    return u.toString();
  } catch {
    // Если URL не распарсился — просто дописываем строку параметров
    const sep = url.includes('?') ? '&' : '?';
    return url + sep + params;
  }
}

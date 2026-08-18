/**
 * Analytics event tracking abstraction for Express Today
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  console.log(`[Analytics Track] ${eventName}:`, params || {});
  
  // Safe window checks for Yandex Metrika and GA4 if present
  if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.ym && typeof win.ym === 'function') {
      win.ym(win.yandexMetrikaId || 'REPLACE_WITH_METRIKA_ID', 'reachGoal', eventName, params);
    }
    if (win.gtag && typeof win.gtag === 'function') {
      win.gtag('event', eventName, params);
    }
  }
}

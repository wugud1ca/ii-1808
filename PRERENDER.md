# Пререндер-снапшоты для поисковых и AI-ботов (prerendered/)

Сайт — клиентский SPA (React + Vite). Чтобы Google, Яндекс и AI-краулеры
(GPTBot, PerplexityBot, ClaudeBot и др.) видели контент без исполнения JS,
для ботов отдаются статические HTML-снапшоты отрендеренных страниц.

## Как это устроено

- `src/seo/routes.ts` — единый источник маршрутов: title, description,
  canonical, lang, robots, приоритеты sitemap, старые URL → 301.
- `server.ts` (production-ветка) — отдаёт `/robots.txt`, `/sitemap.xml`,
  `/llms.txt`, 301-редиректы старых URL, честный 404; по User-Agent бота
  отдаёт файл из `prerendered/` (регулярка BOT_UA), иначе — SPA-шелл.
- `prerendered/<путь>.html` — снапшоты (главная = `index.html`). Каталог
  монтируется в контейнер: `-v /opt/hephaestus/app/prerendered:/app/prerendered:ro`
  (см. /tmp/deploy-hephaestus.sh). Контейнер читает файлы на каждый запрос —
  обновление снапшотов не требует пересборки образа.

## Когда перегенерировать снапшоты

После ЛЮБОГО изменения контента страниц (тексты, услуги, тарифы, FAQ):
1. Открыть каждую страницу в headless-браузере, дождаться полного рендера
   (~8-10 секунд — мета title переприменяется с задержкой из-за скрипта
   трекера Keitaro js.client, который переписывает title на клиенте).
2. Сохранить `document.documentElement.outerHTML` в
   `prerendered/<путь без ведущего слэша>.html`, главная — `index.html`.
3. Проверка: `curl -A "Googlebot/2.1" https://express-today.ru/<путь>`
   должен вернуть снапшот с уникальным `<title>`; обычный браузер — SPA.
   Быстрая проверка без бот-UA: добавить `?__prerender=1`.

Список страниц для снапшотов = URL из `https://express-today.ru/sitemap.xml`
(кроме статических /tnved, /tnved2, /tnved3 — они отдаются как есть).

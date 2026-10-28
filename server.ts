import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import 'dotenv/config';
import { createTnvedRouterFromEnv } from './server/tnved/bootstrap';
import {
  SEO_ROUTES,
  KNOWN_PREFIXES,
  OLD_REDIRECTS,
  SITE_URL,
} from './src/seo/routes';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '614478298';

// Bitrix24 inbound webhook (https://<portal>.bitrix24.ru/rest/<user>/<token>/)
const BITRIX_WEBHOOK_URL = (process.env.BITRIX_WEBHOOK_URL || '').replace(/\/+$/, '');
const BITRIX_ENABLED = BITRIX_WEBHOOK_URL.length > 0;

function escapeHtml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatTelegramMessage(data: any): string {
  const {
    name,
    phone,
    requestType,
    productLinkOrName,
    weightKg,
    volumeM3,
    costEstimate,
    destinationCity,
    needsDocuments,
    comment,
    pageUrl,
    queryString,
    utmParams,
    referrer
  } = data || {};

  let text = `🚀 <b>НОВАЯ ЗАЯВКА С САЙТА EXPRESS TODAY</b>\n\n`;

  if (requestType) text += `📋 <b>Тип запроса:</b> ${escapeHtml(requestType)}\n`;
  if (name) text += `👤 <b>Имя:</b> ${escapeHtml(name)}\n`;
  if (phone) text += `📞 <b>Телефон:</b> <code>${escapeHtml(phone)}</code>\n`;

  const cargoDetails: string[] = [];
  if (productLinkOrName) cargoDetails.push(`• <b>Товар / Ссылка:</b> ${escapeHtml(productLinkOrName)}`);
  if (weightKg) cargoDetails.push(`• <b>Вес:</b> ${escapeHtml(weightKg)} кг`);
  if (volumeM3) cargoDetails.push(`• <b>Объем:</b> ${escapeHtml(volumeM3)} м³`);
  if (costEstimate) cargoDetails.push(`• <b>Оценка стоимости:</b> ${escapeHtml(costEstimate)}`);
  if (destinationCity) cargoDetails.push(`• <b>Город назначения:</b> ${escapeHtml(destinationCity)}`);
  if (needsDocuments !== undefined && needsDocuments !== '') {
    cargoDetails.push(`• <b>Поставка с документами (ДС/Сертификаты/НДС):</b> ${needsDocuments ? 'Да' : 'Нет'}`);
  }

  if (cargoDetails.length > 0) {
    text += `\n📦 <b>Детали заявки:</b>\n${cargoDetails.join('\n')}\n`;
  }

  if (comment) {
    text += `\n💬 <b>Комментарий клиента:</b>\n${escapeHtml(comment)}\n`;
  }

  text += `\n🌐 <b>ИСТОЧНИК И МЕТКИ URL:</b>\n`;
  text += `🔗 <b>URL страницы:</b> ${escapeHtml(pageUrl || 'Не указан')}\n`;
  
  if (queryString && queryString.trim().length > 0) {
    text += `❓ <b>Строка параметров URL (?):</b>\n<code>${escapeHtml(queryString)}</code>\n`;
  } else {
    text += `❓ <b>Строка параметров URL (?):</b> (параметры отсутствуют)\n`;
  }

  if (utmParams && typeof utmParams === 'object' && Object.keys(utmParams).length > 0) {
    text += `\n🎯 <b>UTM и URL параметры:</b>\n`;
    for (const [key, val] of Object.entries(utmParams)) {
      text += `• <b>${escapeHtml(key)}:</b> ${escapeHtml(String(val))}\n`;
    }
  }

  if (referrer) {
    text += `\n↩️ <b>Реферер (Referrer):</b> ${escapeHtml(referrer)}\n`;
  }

  text += `\n⏰ <b>Московское время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

  return text;
}

async function sendTelegramNotification(messageText: string): Promise<boolean> {
  const targetChatIds = new Set<string>();
  if (DEFAULT_CHAT_ID) {
    targetChatIds.add(String(DEFAULT_CHAT_ID));
  }

  // Try to discover recent chat IDs from getUpdates
  try {
    const updatesRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?timeout=1`, {
      signal: AbortSignal.timeout(15000),
    });
    if (updatesRes.ok) {
      const updatesData: any = await updatesRes.json();
      if (updatesData.ok && Array.isArray(updatesData.result)) {
        for (const update of updatesData.result) {
          const chatId = update.message?.chat?.id || update.my_chat_member?.chat?.id;
          if (chatId) {
            targetChatIds.add(String(chatId));
          }
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch Telegram getUpdates:', err);
  }

  if (targetChatIds.size === 0) {
    targetChatIds.add('614478298');
  }

  let sentSuccessfully = false;
  for (const chatId of targetChatIds) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data: any = await res.json();
      if (data.ok) {
        sentSuccessfully = true;
        console.log(`Successfully delivered Telegram notification to chat_id ${chatId}`);
      } else {
        console.error(`Telegram API error for chat_id ${chatId}:`, data);
      }
    } catch (err) {
      console.error(`Failed to send Telegram message to chat_id ${chatId}:`, err);
    }
  }

  return sentSuccessfully;
}

// ---- Bitrix24 CRM: lead creation via inbound webhook ----

function buildBitrixFields(data: any): Record<string, any> {
  const utmParams: Record<string, any> = (data.utmParams && typeof data.utmParams === 'object') ? data.utmParams : {};
  const name = String(data.name || '').trim();
  const nameParts = name.split(/\s+/);

  const fields: Record<string, any> = {
    TITLE: `Заявка с сайта: ${data.requestType || 'Общий запрос'}${name ? ' — ' + name : ''}`.slice(0, 255),
    SOURCE_ID: 'WEB',
    STATUS_ID: 'NEW',
    OPENED: 'Y',
  };

  if (nameParts.length > 0) fields.NAME = nameParts[0];
  if (nameParts.length > 1) fields.LAST_NAME = nameParts.slice(1).join(' ');

  if (data.phone) {
    fields.PHONE = [{ VALUE: String(data.phone), VALUE_TYPE: 'WORK' }];
  }

  // UTM macros as separate standard Bitrix24 lead fields
  const utmFieldMap: Record<string, string> = {
    utm_source: 'UTM_SOURCE',
    utm_medium: 'UTM_MEDIUM',
    utm_campaign: 'UTM_CAMPAIGN',
    utm_content: 'UTM_CONTENT',
    utm_term: 'UTM_TERM',
  };
  for (const [param, field] of Object.entries(utmFieldMap)) {
    if (utmParams[param]) fields[field] = String(utmParams[param]);
  }

  const sourceDesc: string[] = [];
  if (data.pageUrl) sourceDesc.push('Страница: ' + data.pageUrl);
  if (data.referrer) sourceDesc.push('Реферер: ' + data.referrer);
  if (sourceDesc.length > 0) fields.SOURCE_DESCRIPTION = sourceDesc.join(' | ').slice(0, 512);

  // Full lead details + ALL visit macros (every URL parameter) in the comment
  const lines: string[] = [];
  if (data.requestType) lines.push(`Тип запроса: ${data.requestType}`);
  if (data.productLinkOrName) lines.push(`Товар / Ссылка: ${data.productLinkOrName}`);
  if (data.weightKg) lines.push(`Вес: ${data.weightKg} кг`);
  if (data.volumeM3) lines.push(`Объем: ${data.volumeM3} м³`);
  if (data.costEstimate) lines.push(`Оценка стоимости: ${data.costEstimate}`);
  if (data.destinationCity) lines.push(`Город назначения: ${data.destinationCity}`);
  if (data.needsDocuments !== undefined && data.needsDocuments !== '') {
    lines.push(`Поставка с документами (ДС/Сертификаты/НДС): ${data.needsDocuments ? 'Да' : 'Нет'}`);
  }
  if (data.comment) lines.push(`Комментарий клиента: ${data.comment}`);
  lines.push('');
  lines.push(`URL страницы: ${data.pageUrl || 'Не указан'}`);
  lines.push(`Строка параметров URL: ${data.queryString || '(параметры отсутствуют)'}`);
  if (data.referrer) lines.push(`Реферер: ${data.referrer}`);
  const allParams = Object.entries(utmParams);
  if (allParams.length > 0) {
    lines.push('');
    lines.push('Все макросы визита (URL-параметры):');
    for (const [k, v] of allParams) {
      lines.push(`  ${k}=${String(v)}`);
    }
  }
  if (data.timestamp) lines.push(`Время заявки (UTC): ${data.timestamp}`);
  fields.COMMENTS = lines.join('\n').slice(0, 4096);

  return fields;
}

async function sendToBitrix24(data: any): Promise<{ sent: boolean; leadId?: number; error?: string }> {
  if (!BITRIX_ENABLED) {
    return { sent: false, error: 'Bitrix24 webhook is not configured (BITRIX_WEBHOOK_URL)' };
  }
  try {
    const url = `${BITRIX_WEBHOOK_URL}/crm.lead.add.json`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: buildBitrixFields(data),
        params: { REGISTER_SONET_EVENT: 'N' },
      }),
      signal: AbortSignal.timeout(20000),
    });
    const json: any = await res.json();
    if (json && json.result) {
      console.log(`Bitrix24 lead created: ID=${json.result}`);
      return { sent: true, leadId: Number(json.result) };
    }
    console.error('Bitrix24 error response:', json);
    return { sent: false, error: json?.error_description || json?.error || 'unknown Bitrix24 error' };
  } catch (err: any) {
    console.error('Failed to send lead to Bitrix24:', err?.message || err);
    return { sent: false, error: String(err?.message || err) };
  }
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const BIND_ADDR = process.env.BIND_ADDR || '0.0.0.0';

  // ---- SEO: robots.txt / sitemap.xml / llms.txt (генерируются из src/seo/routes.ts) ----

  const robotsTxt = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /test2',
    'Disallow: /original19102026',
    '',
    '# AI-краулеры (поиск и цитирование) — разрешены',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: ChatGPT-User',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: Claude-SearchBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    '',
    'Sitemap: ' + SITE_URL + '/sitemap.xml',
    '',
  ].join('\n');

  function buildSitemapXml(): string {
    const lastmod = new Date().toISOString().slice(0, 10);
    const urls: string[] = [];
    const added = new Set<string>();
    const push = (loc: string, priority?: string) => {
      if (added.has(loc)) return;
      added.add(loc);
      urls.push(
        '  <url>' +
          `<loc>${SITE_URL}${loc}</loc>` +
          `<lastmod>${lastmod}</lastmod>` +
          (priority ? `<priority>${priority}</priority>` : '') +
          '</url>'
      );
    };
    for (const [route, entry] of Object.entries(SEO_ROUTES)) {
      if (entry.sitemap === false) continue;
      if (entry.robots === 'noindex') continue;
      if (entry.canonical && entry.canonical !== route) continue; // алиасы — не дублируем
      push(route, entry.priority || '0.7');
    }
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.join('\n') +
      '\n</urlset>\n'
    );
  }

  const llmsTxt = [
    '# Express Today',
    '',
    '> Официальная доставка и выкуп товаров из Китая в Россию под ключ: 1688, Taobao, Alibaba, POIZON, склад в Гуанчжоу, таможенное оформление, полный пакет документов (белая схема ВЭД, Честный Знак, фулфилмент для маркетплейсов). Работаем с 2015 года, собственная компания в КНР (佛山星科拓贸易有限公司, г. Фошань).',
    '',
    '## Ключевые страницы',
    `- [Главная](${SITE_URL}/): выкуп, проверка, консолидация, доставка из Китая для бизнеса`,
    `- [Доставка из Китая](${SITE_URL}/dostavka): авиа 9–15 дней, авто ускоренное 13–20 дней, ЖД, море`,
    `- [Белая доставка / ВЭД](${SITE_URL}/belaya-dostavka): 9 шагов легального импорта, ДТ (ГТД), УПД с НДС`,
    `- [Выкуп с 1688 и Alibaba](${SITE_URL}/vikup-1688-alibaba): оптовый выкуп за 24 часа`,
    `- [Выкуп с POIZON, Tmall, Taobao](${SITE_URL}/vikup-poizon-tmall-taobao): розничный выкуп`,
    `- [Поиск поставщиков в Китае](${SITE_URL}/poisk-proizvodstva-tovarov-v-kitae-optom)`,
    `- [Консолидация на складе в Гуанчжоу](${SITE_URL}/konsolidaciya-tovara-v-kitaye)`,
    `- [Фулфилмент для маркетплейсов](${SITE_URL}/fulfilment-dlya-marketpleisov): WB, Ozon, Яндекс.Маркет`,
    `- [Честный Знак и сертификация](${SITE_URL}/dokumenty-dlya-vvoza)`,
    `- [Стать импортёром](${SITE_URL}/stat-importerom): ВЭД-контракт на ваше юрлицо`,
    `- [ТН ВЭД: подбор кода и пошлины](${SITE_URL}/tnved)`,
    `- [Онлайн-тарифы на доставку](${SITE_URL}/online-tariffs)`,
    `- [Калькулятор доставки](${SITE_URL}/raschet-stoimosti-dostavki-gruza-iz-kitaja)`,
    `- [FAQ](${SITE_URL}/faq)`,
    '',
    '## Контакты',
    '- Телефон: 8 (800) 555-94-25 (бесплатно по РФ)',
    '- Email: hello@express-today.ru',
    '- Склад в Китае: г. Гуанчжоу; выдача в Москве, доставка по РФ через транспортные компании',
    '',
    '## Примечания',
    '- Работаем с юридическими и физическими лицами; оплата по договору или через личный кабинет.',
    '- Доставка: авиа, авто (ускоренное/обычное), ж/д, морские контейнеры 20ft/40ft.',
    '- Последнее обновление: ' + new Date().toISOString().slice(0, 10),
    '',
  ].join('\n');

  // Behind the Cloudflare proxy (caddy appends the CF edge IP to
  // X-Forwarded-For), trust one proxy hop so per-IP rate limits see the
  // real client IP instead of the shared CF egress address.
  app.set('trust proxy', 1);

  app.use(express.json());

  // Private TKS TN VED search/calculator (closed testing, /api/tnved/*).
  app.use('/api/tnved', createTnvedRouterFromEnv(process.env));

  // API Route for receiving leads
  app.post('/api/lead', (req, res) => {
    console.log('Received lead submission:', req.body);
    const messageText = formatTelegramMessage(req.body);

    // Answer immediately so the form never hangs; notifications go out in background
    res.status(200).json({ success: true, message: 'Lead accepted' });

    sendToBitrix24(req.body)
      .then((r) => console.log(`Bitrix24 result: ${JSON.stringify(r)}`))
      .catch((e) => console.error('Bitrix24 failed:', e));

    sendTelegramNotification(messageText)
      .then((ok) => console.log(`Telegram notification result: ${ok}`))
      .catch((e) => console.error('Telegram notification failed:', e));
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    app.get(['/tnved2', '/tnved2/'], (_req, _res, next) => {
      _req.url = '/tnved2.html';
      next();
    });
    app.get(['/tnved3', '/tnved3/'], (_req, _res, next) => {
      _req.url = '/tnved3.html';
      next();
    });
    app.get(['/tnved', '/tnved/'], (_req, _res, next) => {
      _req.url = '/tnved.html';
      next();
    });
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    const prerenderDir = path.join(process.cwd(), 'prerendered');

    // Поисковые и AI-боты, которым отдаём пререндеренные HTML-снапшоты
    const BOT_UA =
      /googlebot|google-extended|bingbot|yandex|baiduspider|duckduckbot|facebookexternalhit|twitterbot|linkedinbot|gptbot|oai-searchbot|chatgpt-user|perplexitybot|claudebot|claude-searchbot|anthropic-ai|bytespider|amazonbot|applebot|petalbot|mj12bot|ahrefsbot|semrushbot|ccbot|ia_archiver|slurp/i;

    // Хэшированные ассеты кэшируем навсегда, остальное — revalidate
    app.use(
      express.static(distPath, {
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            res.setHeader('Cache-Control', 'no-cache');
          }
        },
      })
    );

    app.get('/tnved', (_req, res) => {
      res.sendFile(path.join(distPath, 'tnved.html'));
    });
    app.get('/tnved2', (_req, res) => {
      res.sendFile(path.join(distPath, 'tnved2.html'));
    });
    app.get('/tnved3', (_req, res) => {
      res.sendFile(path.join(distPath, 'tnved3.html'));
    });

    // SEO-файлы
    app.get('/robots.txt', (_req, res) => {
      res.type('text/plain; charset=utf-8').send(robotsTxt);
    });
    app.get('/sitemap.xml', (_req, res) => {
      res.type('application/xml; charset=utf-8').send(buildSitemapXml());
    });
    app.get('/llms.txt', (_req, res) => {
      res.type('text/plain; charset=utf-8').send(llmsTxt);
    });

    // 301 для старых URL (старый сайт): сохраняем накопленный поисковый вес
    for (const [from, to] of Object.entries(OLD_REDIRECTS)) {
      app.get(from, (_req, res) => {
        res.redirect(301, to);
      });
    }

    const knownExact = new Set(Object.keys(SEO_ROUTES).concat(['/tnved', '/tnved2', '/tnved3']));
    const isKnownPath = (p: string): boolean => {
      if (p === '/') return true;
      if (knownExact.has(p)) return true;
      return KNOWN_PREFIXES.some((pre) => p.startsWith(pre));
    };

    // SPA-fallback: ботам отдаём пререндер (если есть), неизвестным URL — честный 404
    app.get('*', (req, res) => {
      const p = req.path;
      if (p.startsWith('/api')) {
        return res.status(404).json({ error: 'Not found' });
      }
      const ua = String(req.headers['user-agent'] || '');
      const wantPrerender = BOT_UA.test(ua) || req.query.__prerender !== undefined;
      if (wantPrerender) {
        const rel = p === '/' ? 'index.html' : p.replace(/^\/+/, '').replace(/\/+$/, '') + '.html';
        const snap = path.join(prerenderDir, rel);
        if (fs.existsSync(snap) && !fs.statSync(snap).isDirectory()) {
          res.setHeader('Vary', 'User-Agent');
          return res.status(200).sendFile(snap);
        }
      }
      if (!isKnownPath(p)) {
        res.status(404);
        return res.sendFile(path.join(distPath, 'index.html'));
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, BIND_ADDR, () => {
    console.log(`Express Today Server running on http://${BIND_ADDR}:${PORT}`);
  });
}

startServer();

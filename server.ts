import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import 'dotenv/config';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '614478298:AAFM1bFmrCerHEuGKMmqnSlFWhfNPGjgt6g';
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '614478298';

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
    const updatesRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?timeout=1`);
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for receiving leads
  app.post('/api/lead', async (req, res) => {
    try {
      console.log('Received lead submission:', req.body);
      const messageText = formatTelegramMessage(req.body);
      
      const ok = await sendTelegramNotification(messageText);

      return res.status(200).json({
        success: true,
        message: 'Lead processed successfully',
        telegramSent: ok,
      });
    } catch (err: any) {
      console.error('Error handling lead submission:', err);
      return res.status(500).json({
        success: false,
        error: err?.message || 'Server error processing lead',
      });
    }
  });

  // Vite development middleware or static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express Today Server running on http://localhost:${PORT}`);
  });
}

startServer();

#!/usr/bin/env node
/**
 * Генератор its-data.generated.json из UN Comtrade.
 *
 * Режим 1 (пилот, без ключа): public preview API, список кодов из argv.
 *   node scripts/fetch-its.mjs 940179 640299 851713 ...
 * Режим 2 (полная база, с бесплатным ключом UN Comtrade+):
 *   COMTRADE_API_KEY=... node scripts/fetch-its.mjs --full [--year 2024]
 *   Пагинация всего мирового импорта за год, агрегация по HS6.
 */
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREVIEW = 'https://comtradeapi.un.org/public/v1/preview/C/A/HS';
const API = 'https://comtradeapi.un.org/v1/C/A/HS';
const KEY = process.env.COMTRADE_API_KEY || '';
const OUT = path.join(__dirname, '..', 'server', 'tnved', 'its-data.generated.ts');
const SPACING_MS = 15000; // preview API агрессивно лимитирует (429)

function writeOut(out) {
  const body = `/* Автогенерировано: scripts/fetch-its.mjs — не редактировать вручную. */\nimport type { ItsDataset } from './its';\n\nexport const ITS_DATASET: ItsDataset = ${JSON.stringify(out, null, 2)} as ItsDataset;\n`;
  fs.writeFileSync(OUT, body);
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 200)}`));
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(60000, () => req.destroy(new Error('timeout')));
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function aggregate(rows) {
  let value = 0, kg = 0, units = 0;
  for (const r of rows) {
    value += Number(r.primaryValue) || 0;
    kg += Number(r.netWgt) || 0;
    units += Number(r.qty) || 0;
  }
  return { value: Math.round(value * 100) / 100, kg: Math.round(kg), units: Math.round(units) };
}

async function fetchHs6(hs6, year, reporter) {
  const base = KEY ? API : PREVIEW;
  const url = `${base}?${new URLSearchParams({
    reporterCode: reporter, // для пилота 643 (РФ, данные до 2021); с ключом 0 (Мир)
    period: String(year),
    cmdCode: hs6,
    flowCode: 'M',
    ...(KEY ? { subscription_key: KEY } : {}),
  })}`;
  const d = await getJson(url);
  const rows = (d.data || []).filter((r) => Number(r.primaryValue) > 0);
  return aggregate(rows);
}

async function runPilot(codes, year, reporter) {
  const label = reporter === '643' ? 'средняя цена импорта в РФ (последний открытый год официальной статистики)' : 'средняя цена импорта (HS6)';
  const out = { codes: {}, meta: { period: String(year), source: `UN Comtrade: ${label}`, generatedAt: new Date().toISOString() } };
  for (const c of codes) {
    const hs6 = c.slice(0, 6);
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const { value, kg, units } = await fetchHs6(hs6, year, reporter);
        if (value > 0) {
          out.codes[hs6] = { hs6, period: String(year), value, ...(kg > 0 ? { kg } : {}), ...(units > 0 ? { units } : {}) };
          console.log(`${hs6}: $${value} / ${kg} кг / ${units} шт`);
        } else {
          console.log(`${hs6}: нет данных за ${year}`);
        }
        break;
      } catch (e) {
        if (attempt === 2) console.log(`${hs6}: FAILED ${e.message}`);
        await sleep(SPACING_MS * (attempt + 1));
      }
    }
    await sleep(SPACING_MS);
  }
  writeOut(out);
  console.log(`\nзаписано в ${OUT}: ${Object.keys(out.codes).length} кодов`);
}

async function runFull(year) {
  if (!KEY) throw new Error('нужен COMTRADE_API_KEY для полной генерации');
  const out = { codes: {}, meta: { period: String(year), source: 'UN Comtrade: средняя цена мирового импорта (HS6)', generatedAt: new Date().toISOString() } };
  // Список всех HS6 из справочника
  const refs = await getJson(`https://comtradeapi.un.org/v1/refs/da/HS?subscription_key=${KEY}`);
  const hs6List = (refs.data || []).filter((r) => /^\d{6}$/.test(r.id)).map((r) => r.id);
  console.log(`кодов HS6 в справочнике: ${hs6List.length}`);
  // По 5 кодов на запрос
  for (let i = 0; i < hs6List.length; i += 5) {
    const batch = hs6List.slice(i, i + 5);
    const url = `${API}?${new URLSearchParams({
      reporterCode: '0', period: String(year), flowCode: 'M',
      cmdCode: batch.join(','), subscription_key: KEY,
    })}`;
    try {
      const d = await getJson(url);
      const byCode = {};
      for (const r of d.data || []) {
        const c6 = r.cmdCode;
        byCode[c6] = byCode[c6] || { value: 0, kg: 0, units: 0 };
        byCode[c6].value += Number(r.primaryValue) || 0;
        byCode[c6].kg += Number(r.netWgt) || 0;
        byCode[c6].units += Number(r.qty) || 0;
      }
      for (const [c6, v] of Object.entries(byCode)) {
        if (v.value > 0) out.codes[c6] = { hs6: c6, period: String(year), value: Math.round(v.value * 100) / 100, ...(v.kg > 0 ? { kg: Math.round(v.kg) } : {}), ...(v.units > 0 ? { units: Math.round(v.units) } : {}) };
      }
      if (i % 500 === 0) console.log(`${i}/${hs6List.length} готово`);
    } catch (e) {
      console.log(`batch ${i} FAILED: ${e.message}`);
    }
    await sleep(1200);
  }
  writeOut(out);
  console.log(`записано в ${OUT}: ${Object.keys(out.codes).length} кодов`);
}

(async () => {
  const args = process.argv.slice(2);
  const full = args.includes('--full');
  const year = (args.includes('--year') ? args[args.indexOf('--year') + 1] : (full ? '2024' : '2021'));
  const reporter = (args.includes('--reporter') ? args[args.indexOf('--reporter') + 1] : (full ? '0' : '643'));
  if (full) return runFull(year);
  const codes = args.filter((a) => /^\d{6,10}$/.test(a));
  if (!codes.length) { console.log('usage: node scripts/fetch-its.mjs <code...> | --full [--year 2024] [--reporter 0]'); process.exit(1); }
  return runPilot(codes, year, reporter);
})().catch((e) => { console.error(e.message); process.exit(1); });

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
const API = 'https://comtradeapi.un.org/data/v1/get/C/A/HS';
const KEY = process.env.COMTRADE_API_KEY || '';
const OUT = path.join(__dirname, '..', 'server', 'tnved', 'its-data.generated.ts');
const SPACING_MS = 15000; // preview API агрессивно лимитирует (429)
const BATCH_REPORTERS = 10;
const REQ_SPACING_MS = 3500;

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
    ...(KEY ? { 'subscription-key': KEY, partnerCode: '0' } : {}),
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

/** Полная база: мировой импорт за год, агрегация по HS6. */
async function runFull(year) {
  if (!KEY) throw new Error('нужен COMTRADE_API_KEY для полной генерации');
  // Стандартный список стран-репортёров UN Comtrade (M49, без агрегатов)
  const reporters = [
    '4','8','12','16','20','24','28','31','32','36','40','44','48','50','51','52','56','60','64','68','70','72','76','84','90','92','96','100','104','108','112','116','120','124','132','136','140','144','148','152','156','158','162','166','170','174','175','178','180','184','188','191','192','196','203','204','208','212','214','218','222','226','231','232','233','234','238','242','246','248','250','254','258','260','262','266','268','270','275','276','288','292','296','300','304','308','312','316','320','324','328','332','336','340','344','348','352','356','360','364','368','372','376','380','384','388','392','398','400','404','408','410','414','417','418','422','426','428','430','434','438','440','442','446','450','454','458','462','466','470','474','478','480','484','492','496','498','499','500','504','508','512','516','520','524','528','531','533','534','535','540','548','554','558','562','566','570','574','578','580','583','584','585','586','591','598','600','604','608','612','616','620','624','626','630','634','638','642','643','646','652','654','659','660','662','663','666','670','674','678','682','686','688','690','694','702','703','704','705','706','710','716','724','728','729','732','740','748','752','756','760','762','764','768','772','776','780','784','788','792','795','796','798','800','804','807','818','826','831','832','833','834','840','850','854','858','860','862','866','868','870','872','876','882','887','894',
  ];
  console.log(`репортёров: ${reporters.length}`);

  const acc = new Map(); // hs6 → {value, kg, units, unitAbbr}
  const add = (c6, r) => {
    const rec = acc.get(c6) || { value: 0, kg: 0, units: 0, unitAbbr: null };
    rec.value += Number(r.primaryValue) || 0;
    rec.kg += Number(r.netWgt) || 0;
    rec.units += Number(r.qty) || 0;
    if (!rec.unitAbbr && r.qtyUnitAbbr) rec.unitAbbr = String(r.qtyUnitAbbr).toLowerCase();
    acc.set(c6, rec);
  };

  let batches = 0, rows = 0;
  for (let i = 0; i < reporters.length; i += BATCH_REPORTERS) {
    const batch = reporters.slice(i, i + BATCH_REPORTERS);
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const url = `${API}?${new URLSearchParams({
          period: String(year), flowCode: 'M',
          reporterCode: batch.join(','), partnerCode: '0',
          'subscription-key': KEY,
        })}`;
        const d = await getJson(url);
        for (const r of d.data || []) {
          const c6 = String(r.cmdCode);
          if (/^\d{6}$/.test(c6)) add(c6, r);
        }
        rows += (d.data || []).length;
        batches++;
        console.log(`батч ${i}-${i + batch.length - 1}: ok (строк всего: ${rows})`);
        break;
      } catch (e) {
        const backoff = 5000 * (attempt + 1);
        console.log(`батч ${i}: ${e.message} — пауза ${backoff / 1000}с`);
        await sleep(backoff);
        if (attempt === 3) throw e;
      }
    }
    await sleep(REQ_SPACING_MS);
  }

  const codes = {};
  for (const [c6, v] of acc) {
    codes[c6] = {
      hs6: c6, period: String(year),
      value: Math.round(v.value * 100) / 100,
      ...(v.kg > 0 ? { kg: Math.round(v.kg) } : {}),
      ...(v.units > 0 ? { units: Math.round(v.units) } : {}),
      ...(v.unitAbbr ? { unitAbbr: v.unitAbbr } : {}),
    };
  }
  const out = {
    codes,
    meta: {
      period: String(year),
      source: 'UN Comtrade: средняя цена мирового импорта (HS6, все репортёры)',
      generatedAt: new Date().toISOString(),
    },
  };
  writeOut(out);
  console.log(`\nготово: ${batches} батчей, ${Object.keys(codes).length} кодов HS6 → ${OUT}`);
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

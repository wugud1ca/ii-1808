/**
 * Indicative import prices (ориентировочная стоимость) from UN Comtrade.
 *
 * ИТС ФТС (индексы таможенной стоимости) в открытом виде не публикуются;
 * официальная по-кодовая статистика РФ/ЕАЭС закрыта с 2022 года. Поэтому
 * ориентиром служит средняя цена МИРОВОГО импорта по 6-значному коду (HS6),
 * рассчитанная из открытых данных UN Comtrade: суммарная стоимость /
 * суммарный вес (кг) за год. Это не индекс ФТС и не цена конкретного товара.
 */

export interface ItsRecord {
  /** 6-значный код HS */
  hs6: string;
  /** Год данных */
  period: string;
  /** Стоимость импорта, USD */
  value: number;
  /** Вес нетто, кг (может отсутствовать) */
  kg?: number;
  /** Количество в доп. единицах (шт и т.п., может отсутствовать) */
  units?: number;
  /** Аббревиатура доп. единицы */
  unitAbbr?: string;
}

export interface ItsDataset {
  meta: { period: string; source: string; generatedAt: string };
  codes: Record<string, ItsRecord>;
}

export interface ItsAnswer {
  found: boolean;
  hs6?: string;
  period?: string;
  /** Ориентировочная цена, USD за основную единицу */
  price?: number;
  /** 'кг' | шт/доп. единица */
  unit?: string;
  /** Альтернативная цена (за шт), когда есть и вес, и количество */
  priceAlt?: number;
  unitAlt?: string;
  source?: string;
}

let dataset: ItsDataset | null = null;

export function loadItsDataset(data: ItsDataset): void {
  dataset = data;
}

function roundPrice(v: number): number {
  if (!Number.isFinite(v) || v <= 0) {
    return 0;
  }
  if (v >= 100) return Math.round(v * 10) / 10;
  if (v >= 1) return Math.round(v * 100) / 100;
  return Math.round(v * 1000) / 1000;
}

/** Ищет ориентир по 10-значному коду ТН ВЭД (префикс 6 знаков). */
export function itsForCode(code10: string): ItsAnswer {
  if (!dataset || !/^\d{10}$/.test(code10)) {
    return { found: false };
  }
  const hs6 = code10.slice(0, 6);
  const rec = dataset.codes[hs6];
  if (!rec) {
    return { found: false };
  }
  const priceKg = rec.kg ? roundPrice(rec.value / rec.kg) : 0;
  const priceUnit = rec.units ? roundPrice(rec.value / rec.units) : 0;
  if (priceKg <= 0 && priceUnit <= 0) {
    return { found: false };
  }
  const answer: ItsAnswer = {
    found: true,
    hs6,
    period: rec.period,
    source: dataset.meta.source,
  };
  if (priceKg > 0) {
    answer.price = priceKg;
    answer.unit = 'кг';
    // Альтернатива за штуку — только если реально отличается (в статистике
    // для многих кодов «количество» указано в кг и совпадает с весом).
    if (priceUnit > 0 && Math.abs(priceUnit - priceKg) / priceKg > 0.005) {
      answer.priceAlt = priceUnit;
      answer.unitAlt = rec.unitAbbr || 'шт';
    }
  } else if (priceUnit > 0) {
    answer.price = priceUnit;
    answer.unit = rec.unitAbbr || 'шт';
  }
  return answer;
}

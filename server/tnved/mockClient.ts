import type { ApiResult, TksApi } from './client';
import { TnvedError } from './client';

interface RawItem {
  code: string;
  name: string;
  cnt: number;
  dutyImp: number;
  dutyImpedi: string;
  dutySign?: string;
  dutyImp2?: number;
  dutyImpedi2?: string;
  nds: number;
  hasNdsAlt?: boolean;
  akc?: number;
  akcedi?: string;
  requirements?: Record<string, Array<{ docN?: string; docD?: string; dbegin?: string; dend?: string; note: string; cu?: string; pref?: string; min?: number; typemin?: string }>>;
}

const MOCK_ITEMS: RawItem[] = [
  {
    code: '9401790009',
    name: 'ПРОЧАЯ МЕБЕЛЬ ДЛЯ СИДЕНИЯ С МЕТАЛЛИЧЕСКИМ КАРКАСОМ',
    cnt: 490,
    dutyImp: 10,
    dutyImpedi: '1',
    dutySign: '+',
    dutyImp2: 0.08,
    dutyImpedi2: '166', // кг -> "10 % + 0,08 Евро/кг"
    nds: 22,
    hasNdsAlt: true,
    requirements: {
      '11': [
        {
          docN: '44',
          docD: '2014-03-18',
          dbegin: '2014-07-01',
          note: 'Требуется представление документа об оценке соответствия требованиям технического регламента ТС «О безопасности мебельной продукции» (ТР ТС 025/2011)…',
        },
      ],
      '28': [
        {
          docN: 'Распоряжение 792-р',
          docD: '2024-09-01',
          note: 'Эксперимент и этап обязательной маркировки в системе «Честный Знак» для отдельных видов мебели и кресел.',
        },
      ],
      '14': [
        {
          docN: 'Решение Коллегии ЕЭК № 30',
          docD: '2015-04-21',
          note: 'Единые меры нетарифного регулирования при ввозе на таможенную территорию ЕАЭС.',
        },
      ],
    },
  },
  {
    code: '9401690000',
    name: 'ПРОЧАЯ МЕБЕЛЬ ДЛЯ СИДЕНИЯ С ДЕРЕВЯННЫМ КАРКАСОМ',
    cnt: 446,
    dutyImp: 10,
    dutyImpedi: '1',
    dutySign: '+',
    dutyImp2: 0.07,
    dutyImpedi2: '166',
    nds: 22,
    hasNdsAlt: true,
    requirements: {
      '11': [
        {
          docN: 'ТР ТС 025/2011',
          docD: '2012-06-15',
          dbegin: '2014-07-01',
          note: 'Декларация соответствия регламенту о безопасности мебельной продукции.',
        },
      ],
    },
  },
  {
    code: '9401800009',
    name: 'ПРОЧАЯ МЕБЕЛЬ ДЛЯ СИДЕНИЯ ИЗ ПЛАСТМАССЫ',
    cnt: 312,
    dutyImp: 10,
    dutyImpedi: '1',
    nds: 22,
    hasNdsAlt: false,
    requirements: {
      '11': [
        {
          docN: 'ТР ТС 025/2011',
          note: 'Сертификат соответствия / декларация соответствия на бытовую мебель для сидения.',
        },
      ],
    },
  },
  {
    code: '9403208009',
    name: 'МЕБЕЛЬ МЕТАЛЛИЧЕСКАЯ ПРОЧАЯ',
    cnt: 285,
    dutyImp: 10,
    dutyImpedi: '1',
    nds: 22,
    hasNdsAlt: false,
  },
  {
    code: '9403609009',
    name: 'ПРОЧАЯ МЕБЕЛЬ ДЕРЕВЯННАЯ ДЛЯ ЖИЛЫХ КОМНАТ',
    cnt: 240,
    dutyImp: 10,
    dutyImpedi: '1',
    nds: 22,
    hasNdsAlt: false,
  },
  {
    code: '9401300000',
    name: 'МЕБЕЛЬ ДЛЯ СИДЕНИЯ, ВРАЩАЮЩАЯСЯ, С РЕГУЛИРУЮЩИМСЯ ПО ВЫСОТЕ ПОЛОЖЕНИЕМ',
    cnt: 218,
    dutyImp: 10,
    dutyImpedi: '1',
    nds: 22,
    hasNdsAlt: false,
  },
  {
    code: '6402999800',
    name: 'ПРОЧАЯ ОБУВЬ С ПОДОШВОЙ И С ВЕРХОМ ИЗ ПОЛИМЕРНЫХ МАТЕРИАЛОВ (ВКЛЮЧАЯ КРОССОВКИ)',
    cnt: 412,
    dutyImp: 0.28,
    dutyImpedi: '715', // пар -> "0,28 Евро/пар"
    nds: 22,
    hasNdsAlt: true,
    requirements: {
      '11': [
        {
          docN: 'ТР ТС 017/2011',
          docD: '2011-12-09',
          note: 'Технический регламент о безопасности продукции легкой промышленности (декларация или сертификат).',
        },
      ],
      '28': [
        {
          docN: 'Распоряжение Правительства РФ № 792-р',
          docD: '2018-04-28',
          dbegin: '2020-07-01',
          note: 'Обязательная цифровая маркировка Data Matrix в системе «Честный Знак». Ввоз без кодов маркировки запрещен.',
        },
      ],
    },
  },
  {
    code: '6404110000',
    name: 'СПОРТИВНАЯ ОБУВЬ; ТЕННИСНЫЕ ТУФЛИ, БАСКЕТБОЛЬНЫЕ ТУФЛИ, ТУФЛИ ДЛЯ ГИМНАСТИКИ',
    cnt: 320,
    dutyImp: 0.35,
    dutyImpedi: '715', // пар -> "0,35 Евро/пар"
    nds: 22,
    hasNdsAlt: true,
    requirements: {
      '11': [{ docN: 'ТР ТС 017/2011', note: 'Обязательное декларирование соответствия ТР ТС 017/2011.' }],
      '28': [{ docN: 'Честный Знак', note: 'Обязательная маркировка Data Matrix кодами обуви.' }],
    },
  },
  {
    code: '6403999800',
    name: 'ОБУВЬ С ВЕРХОМ ИЗ НАТУРАЛЬНОЙ КОЖИ ПРОЧАЯ',
    cnt: 290,
    dutyImp: 0.45,
    dutyImpedi: '715',
    nds: 22,
    hasNdsAlt: true,
    requirements: {
      '11': [{ docN: 'ТР ТС 017/2011', note: 'Оценка соответствия обуви из натуральной кожи.' }],
      '28': [{ docN: 'Честный Знак', note: 'Обязательная цифровая маркировка Data Matrix.' }],
    },
  },
  {
    code: '6109100000',
    name: 'МАЙКИ, ФУФАЙКИ С РУКАВАМИ И ПРОЧИЕ НАФАТЕЛЬНЫЕ ФУТБОЛКИ ИЗ ХЛОПЧАТОБУМАЖНОЙ ПРЯЖИ',
    cnt: 520,
    dutyImp: 10,
    dutyImpedi: '1',
    dutySign: '>',
    dutyImp2: 1.88,
    dutyImpedi2: '166', // "10 %, но не менее 1,88 Евро/кг"
    nds: 22,
    hasNdsAlt: true,
    requirements: {
      '11': [{ docN: 'ТР ТС 017/2011', note: 'Сертификат соответствия для изделий 1-го слоя.' }],
      '28': [{ docN: 'Честный Знак', note: 'Обязательная маркировка легпрома в системе Честный Знак.' }],
    },
  },
  {
    code: '8517130000',
    name: 'СМАРТФОНЫ ДЛЯ БЕСПРОВОДНЫХ СЕТЕЙ СВЯЗИ',
    cnt: 890,
    dutyImp: 0,
    dutyImpedi: '1', // 0 %
    nds: 22,
    hasNdsAlt: false,
    requirements: {
      '11': [
        { docN: 'ТР ТС 004/2011, 020/2011', note: 'Сертификат соответствия требованиям низковольтного оборудования и электромагнитной совместимости.' },
      ],
      '14': [
        { docN: 'Нотификация ФСБ', note: 'Нотификация о характеристиках шифровальных (криптографических) средств.' },
        { docN: 'Декларация Минцифры', note: 'Декларация соответствия средств связи требованиям закона «О связи».' },
      ],
      '28': [
        { docN: 'Честный Знак', note: 'Эксперимент по маркировке радиоэлектронной продукции.' },
      ],
    },
  },
  {
    code: '8471300000',
    name: 'ВЫЧИСЛИТЕЛЬНЫЕ МАШИНЫ ПОРТАТИВНЫЕ МАССОЙ НЕ БОЛЕЕ 10 КГ (НОУТБУКИ, ПЛАНШЕТЫ)',
    cnt: 650,
    dutyImp: 0,
    dutyImpedi: '1',
    nds: 22,
    hasNdsAlt: false,
    requirements: {
      '11': [{ docN: 'ТР ТС 004/2011, 020/2011', note: 'Сертификат электромагнитной совместимости и электробезопасности.' }],
      '14': [{ docN: 'Нотификация ФСБ', note: 'Регистрация нотификации на шифровальные средства в реестре ЕЭК.' }],
    },
  },
  {
    code: '8708299009',
    name: 'ЧАСТИ И ПРИНАДЛЕЖНОСТИ КУЗОВОВ МОТОРНЫХ ТРАНСПОРТНЫХ СРЕДСТВ ПРОЧИЕ',
    cnt: 540,
    dutyImp: 5,
    dutyImpedi: '1',
    nds: 22,
    hasNdsAlt: false,
    requirements: {
      '11': [{ docN: 'ТР ТС 018/2011', note: 'О безопасности колесных транспортных средств.' }],
    },
  },
];

export class MockTksClient implements TksApi {
  public isMock = true;

  async card(code: string): Promise<ApiResult> {
    if (!/^\d{10}$/.test(code)) {
      throw new TnvedError('INVALID_CODE', 'Нужен код ТН ВЭД из 10 цифр.', 400);
    }
    const item = MOCK_ITEMS.find((x) => x.code === code) || {
      code,
      name: `ТОВАР ПОЗИЦИИ ${code}`,
      cnt: 10,
      dutyImp: 5,
      dutyImpedi: '1',
      nds: 22,
      hasNdsAlt: false,
    };

    const tnvedAll: Record<string, any[]> = {};
    if (item.hasNdsAlt) {
      tnvedAll['3'] = [
        {
          PRIM: 1,
          NOTE: 'Есть льготные (пониженные или нулевые) ставки НДС для отдельных категорий товаров и получателей — применяются только при подтверждении условий, автоматически не учитываются.',
        },
      ];
    }
    if (item.requirements) {
      for (const [k, v] of Object.entries(item.requirements)) {
        tnvedAll[k] = v.map((r) => ({
          DOC_N: r.docN,
          DOC_D: r.docD,
          DBEGIN: r.dbegin,
          DEND: r.dend,
          NOTE: r.note,
          CU: r.cu,
          PREF: r.pref,
          MIN: r.min,
          TYPEMIN: r.typemin,
        }));
      }
    }

    const raw = {
      CODE: item.code,
      KR_NAIM: item.name,
      VERSION: '2026',
      DBEGIN: null,
      DEND: null,
      TNVED: {
        IMP: item.dutyImp,
        IMPEDI: item.dutyImpedi,
        IMPSIGN: item.dutySign,
        IMP2: item.dutyImp2,
        IMPEDI2: item.dutyImpedi2,
        NDS: item.nds,
        AKC: item.akc ?? 0,
        AKCEDI: item.akcedi,
      },
      TNVEDALL: tnvedAll,
    };

    return {
      data: raw,
      fetchedAt: new Date().toISOString(),
      cached: false,
    };
  }

  async search(query: string, page: number): Promise<ApiResult> {
    const q = query.trim().toLowerCase();
    const fetchedAt = new Date().toISOString();

    if (/^\d{2,10}$/.test(q)) {
      const matched = MOCK_ITEMS.filter((item) => item.code.startsWith(q));
      const rows = matched.map((m) => ({
        ID: m.code.slice(0, 8),
        CODE: m.code,
        TEXT: m.name,
        KR_NAIM: m.name,
        CNT: m.cnt,
        DBEGIN: null,
        DEND: null,
      }));
      return { data: rows, fetchedAt, cached: false };
    }

    // Name search
    let filtered = MOCK_ITEMS.filter(
      (item) => item.name.toLowerCase().includes(q) || (q === 'стул' && item.code.startsWith('9401')) || (q === 'кроссовки' && item.code.startsWith('64'))
    );

    // If query is "стул", spec says total: 54
    const totalCount = q === 'стул' ? 54 : filtered.length > 0 ? filtered.length : 0;
    const perPage = 20;

    const dataRows = filtered.slice((page - 1) * perPage, page * perPage).map((m) => ({
      CODE: m.code,
      KR_NAIM: m.name,
      CNT: m.cnt,
      DBEGIN: null,
      DEND: null,
    }));

    return {
      data: {
        data: dataRows,
        hm: totalCount,
        page,
        per_page: perPage,
      },
      fetchedAt,
      cached: false,
    };
  }
}

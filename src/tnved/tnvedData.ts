/**
 * База данных классификатора ТН ВЭД, таможенных ставок, требований маркировки «Честный ЗНАК»
 * и разрешительных документов ЕАЭС для сервиса Express Today.
 */

export interface TnvedProductItem {
  code: string;
  name: string;
  category: string;
  categoryLabel: string;
  importDutyPercent: number;
  importDutySpecific?: {
    rateEur: number;
    unit: string; // 'kg' | 'pair' | 'pc'
    unitLabel: string;
  };
  dutyText: string;
  vatPercent: number; // 20 or 10
  vatNote?: string;
  exciseText?: string;
  customsRiskPerKgUsd: number; // Индикативный профиль риска (ИПР) $/кг
  chestnyZnak: {
    required: boolean;
    status: 'mandatory' | 'pilot' | 'not_required';
    statusLabel: string;
    description: string;
    groupName: string;
    markingInChinaAdvised: boolean;
  };
  permits: {
    type: 'ss' | 'ds' | 'sgr' | 'notification' | 'refusal_letter';
    typeLabel: string;
    technicalRegulation: string; // e.g. "ТР ТС 017/2011", "ТР ТС 008/2011"
    description: string;
    sampleTestingRequired: boolean;
    estimatedCostRub: string;
    estimatedDays: string;
  }[];
  keywords: string[];
  tips: string;
}

export interface CustomsFeeTier {
  minValueRub: number;
  maxValueRub: number;
  feeRub: number;
  label: string;
}

// Ставки таможенных сборов за таможенное оформление (Постановление Правительства РФ № 342)
export const CUSTOMS_FEES_TIERS: CustomsFeeTier[] = [
  { minValueRub: 0, maxValueRub: 200000, feeRub: 1067, label: 'до 200 000 ₽' },
  { minValueRub: 200000.01, maxValueRub: 450000, feeRub: 2134, label: '200 000 – 450 000 ₽' },
  { minValueRub: 450000.01, maxValueRub: 1200000, feeRub: 4269, label: '450 000 – 1 200 000 ₽' },
  { minValueRub: 1200000.01, maxValueRub: 2700000, feeRub: 11740, label: '1 200 000 – 2 700 000 ₽' },
  { minValueRub: 2700000.01, maxValueRub: 4200000, feeRub: 16524, label: '2 700 000 – 4 200 000 ₽' },
  { minValueRub: 4200000.01, maxValueRub: 5500000, feeRub: 21340, label: '4 200 000 – 5 500 000 ₽' },
  { minValueRub: 5500000.01, maxValueRub: 7000000, feeRub: 26156, label: '5 500 000 – 7 000 000 ₽' },
  { minValueRub: 7000000.01, maxValueRub: Infinity, feeRub: 30000, label: 'свыше 7 000 000 ₽' },
];

export function calculateCustomsFee(customsValueRub: number): number {
  if (customsValueRub <= 0) return 0;
  for (const tier of CUSTOMS_FEES_TIERS) {
    if (customsValueRub <= tier.maxValueRub) {
      return tier.feeRub;
    }
  }
  return 30000;
}

export const TNVED_CATEGORIES = [
  { id: 'all', label: 'Все категории' },
  { id: 'clothing', label: 'Одежда и текстиль' },
  { id: 'footwear', label: 'Обувь' },
  { id: 'electronics', label: 'Электроника и гаджеты' },
  { id: 'cosmetics', label: 'Косметика и парфюмерия' },
  { id: 'furniture', label: 'Мебель и интерьер' },
  { id: 'toys', label: 'Игрушки и детские товары' },
  { id: 'auto', label: 'Автозапчасти' },
  { id: 'home', label: 'Товары для дома и посуда' },
  { id: 'equipment', label: 'Оборудование и станки' },
];

export const POPULAR_TNVED_PRODUCTS: TnvedProductItem[] = [
  // --- ОДЕЖДА И ТЕКСТИЛЬ (Группа 61, 62, 63) ---
  {
    code: '6109100000',
    name: 'Майки, фуфайки с рукавами (футболки) трикотажные из хлопчатобумажной пряжи',
    category: 'clothing',
    categoryLabel: 'Одежда и текстиль',
    importDutyPercent: 10,
    dutyText: '10% (базовая ставка ЕТТ)',
    vatPercent: 20,
    customsRiskPerKgUsd: 14.5,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка',
      description: 'Входит в перечень обязательной маркировки легпрома (ТР ТС 017/2011). Нужен DataMatrix на бирку/ярлык.',
      groupName: 'Легкая промышленность',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 017/2011 «О безопасности продукции легкой промышленности»',
        description: 'Одежда 2-го слоя для взрослых (футболки). Схема 3д с испытаниями в аккредитованной лаборатории.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 18 000 ₽',
        estimatedDays: '5–8 рабочих дней',
      },
    ],
    keywords: ['футболка', 'футболки', 'майка', 'поло', 'хлопок', 'трикотаж', 'одежда', '6109'],
    tips: 'Для детских футболок действует ТР ТС 007/2011 (Сертификат соответствия СС) и льготный НДС 10% вместо 20%.',
  },
  {
    code: '6110209900',
    name: 'Джемперы, пуловеры, кардиганы, жилеты и аналогичные изделия трикотажные из хлопка',
    category: 'clothing',
    categoryLabel: 'Одежда и текстиль',
    importDutyPercent: 10,
    dutyText: '10%',
    vatPercent: 20,
    customsRiskPerKgUsd: 16.0,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка',
      description: 'Подлежит маркировке DataMatrix в системе «Честный ЗНАК». Маркируем на складе в Гуанчжоу.',
      groupName: 'Легкая промышленность',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 017/2011 (Одежда 2-го слоя)',
        description: 'Схема 3д с протоколом аккредитованной лаборатории ЕАЭС.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 19 000 ₽',
        estimatedDays: '5–7 дней',
      },
    ],
    keywords: ['толстовка', 'худи', 'свитшот', 'джемпер', 'кофта', 'свитер', 'кардиган', '6110'],
    tips: 'Худи и свитшоты с капюшоном декларируются в этой товарной подсубпозиции. Важно правильно указать состав ткани.',
  },
  {
    code: '6201400000',
    name: 'Пальто, полупальто, накидки, плащи, куртки (включая лыжные), ветровки мужские из хим. волокон',
    category: 'clothing',
    categoryLabel: 'Одежда и текстиль',
    importDutyPercent: 10,
    dutyText: '10%',
    vatPercent: 20,
    customsRiskPerKgUsd: 22.0,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка',
      description: 'Верхняя одежда подлежит маркировке DataMatrix. Без кодов выпуск таможни невозможен.',
      groupName: 'Предметы одежды',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 017/2011 (Одежда 3-го слоя)',
        description: 'Декларирование верхней одежды. В протоколе проверяется воздухопроницаемость и гигроскопичность подкладки.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 22 000 ₽',
        estimatedDays: '7–10 дней',
      },
    ],
    keywords: ['куртка', 'пуховик', 'ветровка', 'пальто', 'парка', 'плащ', 'пуховики', '6201'],
    tips: 'Если пуховик с натуральным пух-перо наполнителем, может потребоваться ветеринарный надзор или фумигационный сертификат фабрики.',
  },
  {
    code: '6204623100',
    name: 'Брюки и бриджи женские из хлопчатобумажной ткани (джинсы denim)',
    category: 'clothing',
    categoryLabel: 'Одежда и текстиль',
    importDutyPercent: 10,
    dutyText: '10%',
    vatPercent: 20,
    customsRiskPerKgUsd: 15.0,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка',
      description: 'Брюки и джинсы подлежат обязательной маркировке средствами идентификации Честный Знак.',
      groupName: 'Легкая промышленность',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 017/2011',
        description: 'Одежда 2-го слоя, схема 3д.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 18 000 ₽',
        estimatedDays: '5–8 дней',
      },
    ],
    keywords: ['джинсы', 'брюки', 'штаны', 'denim', 'деним', 'бриджи', '6204'],
    tips: 'При выкупе с 1688 обязательно запрашивайте процентный состав сырья (например: 98% хлопок, 2% спандекс) для графы 31 ДТ.',
  },
  {
    code: '6302210000',
    name: 'Белье постельное напечатанное из хлопчатобумажной пряжи',
    category: 'clothing',
    categoryLabel: 'Одежда и текстиль',
    importDutyPercent: 10,
    dutyText: '10%',
    vatPercent: 20,
    customsRiskPerKgUsd: 8.5,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка',
      description: 'Постельное белье — одна из первых групп, подлежащих обязательной маркировке DataMatrix.',
      groupName: 'Текстиль для дома',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 017/2011 (Постельное белье 1-го слоя)',
        description: 'Требуются строгие лабораторные испытания на устойчивость окраски к поту, стирке и сухому трению.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 20 000 ₽',
        estimatedDays: '7 дней',
      },
    ],
    keywords: ['постельное белье', 'простынь', 'пододеяльник', 'наволочка', 'комплект белья', 'текстиль', '6302'],
    tips: 'Детские комплекты постельного белья оформляются по ТР ТС 007/2011 в форме Сертификата соответствия (СС) с НДС 10%.',
  },

  // --- ОБУВЬ (Группа 64) ---
  {
    code: '6404110000',
    name: 'Обувь спортивная, теннисные туфли, баскетбольные, гимнастические туфли с верхом из текстиля',
    category: 'footwear',
    categoryLabel: 'Обувь',
    importDutyPercent: 5,
    importDutySpecific: { rateEur: 0.18, unit: 'pair', unitLabel: 'пар' },
    dutyText: '5%, но не менее 0.18 € за пару (комбинированная ставка)',
    vatPercent: 20,
    customsRiskPerKgUsd: 18.0,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка 100%',
      description: 'Вся обувь подлежит строгой маркировке кодами DataMatrix. Каждый коробок и стикер сканируется.',
      groupName: 'Обувные товары',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 017/2011 «О безопасности продукции легпрома» (Обувь для взрослых)',
        description: 'Схема 3д, проверка прочности крепления подошвы, гибкости и токсичности материалов.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 22 000 ₽',
        estimatedDays: '7–9 дней',
      },
    ],
    keywords: ['кроссовки', 'кеды', 'бутсы', 'спортивная обувь', 'сниfilterеры', '6404', 'обувь'],
    tips: 'Express Today оклеивает обувные коробки стикерами Честного Знака в Гуанчжоу по ГОСТу — гарантия прохождения таможни без простоя на СВХ.',
  },
  {
    code: '6403999800',
    name: 'Обувь с верхом из натуральной кожи, на подошве из резины, полимерных материалов (длина стельки от 24 см)',
    category: 'footwear',
    categoryLabel: 'Обувь',
    importDutyPercent: 5,
    importDutySpecific: { rateEur: 0.28, unit: 'pair', unitLabel: 'пар' },
    dutyText: '5%, но не менее 0.28 € за пару',
    vatPercent: 20,
    customsRiskPerKgUsd: 32.0,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка 100%',
      description: 'Кожаная обувь подлежит обязательной маркировке Честный Знак.',
      groupName: 'Обувные товары',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация соответствия (ДС)',
        technicalRegulation: 'ТР ТС 017/2011',
        description: 'Испытания кожи на раздир, устойчивость покрытия и эмиссию вредных веществ.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 24 000 ₽',
        estimatedDays: '7–10 дней',
      },
    ],
    keywords: ['туфли', 'ботинки', 'кожаная обувь', 'сапоги', 'лоферы', 'мокасины', 'натуральная кожа', '6403'],
    tips: 'При импорте натуральной кожи таможня тщательно проверяет артикулы и вид кожи (КРС, свиная, овчина). Обязательно согласовывать инвойс заранее.',
  },
  {
    code: '6402999800',
    name: 'Прочая обувь с подошвой и верхом из резины или пластмассы (сланцы, шлепанцы, сабо)',
    category: 'footwear',
    categoryLabel: 'Обувь',
    importDutyPercent: 5,
    importDutySpecific: { rateEur: 0.18, unit: 'pair', unitLabel: 'пар' },
    dutyText: '5%, но не менее 0.18 € за пару',
    vatPercent: 20,
    customsRiskPerKgUsd: 7.5,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка 100%',
      description: 'Резиновая и полимерная обувь (в т.ч. пляжная и домашняя) требует маркировки Честный Знак.',
      groupName: 'Обувные товары',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 017/2011',
        description: 'Проверка полимерных материалов на запах и выделение формальдегида.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 19 000 ₽',
        estimatedDays: '6–8 дней',
      },
    ],
    keywords: ['шлепанцы', 'сланцы', 'тапочки', 'сабо', 'кроксы', 'резиновая обувь', 'eva', '6402'],
    tips: 'Очень частый товар для WB/Ozon. Важно маркировать и саму пару (или бирку), и индивидуальный пакет/коробку.',
  },

  // --- ЭЛЕКТРОНИКА И ГАДЖЕТЫ (Группа 84, 85) ---
  {
    code: '8517130000',
    name: 'Смартфоны для сотовых сетей связи или других беспроводных сетей связи',
    category: 'electronics',
    categoryLabel: 'Электроника и гаджеты',
    importDutyPercent: 0,
    dutyText: '0% (беспошлинный ввоз в ЕАЭС)',
    vatPercent: 20,
    customsRiskPerKgUsd: 280.0,
    chestnyZnak: {
      required: false,
      status: 'pilot',
      statusLabel: 'Пилотный эксперимент',
      description: 'Идет эксперимент по маркировке радиоэлектронной продукции. В коммерческом ввозе пока добровольно.',
      groupName: 'Радиоэлектроника',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'notification',
        typeLabel: 'Нотификация ФСБ России',
        technicalRegulation: 'Положение о ввозе криптографических (шифровальных) средств',
        description: 'Обязательна для любых устройств с Wi-Fi, Bluetooth, NFC и сотовой связью. Регистрируется в ЦЛСЗ ФСБ РФ.',
        sampleTestingRequired: false,
        estimatedCostRub: 'от 15 000 ₽ (или проверка по реестру)',
        estimatedDays: '7–10 рабочих дней',
      },
      {
        type: 'ds',
        typeLabel: 'Декларация соответствия ТР ТС',
        technicalRegulation: 'ТР ТС 020/2011 (ЭМС) + ТР ЕАЭС 037/2016 (RoHS)',
        description: 'Подтверждение электромагнитной совместимости и ограничения опасных веществ.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 25 000 ₽',
        estimatedDays: '7–12 дней',
      },
    ],
    keywords: ['смартфон', 'телефон', 'iphone', 'xiaomi', 'android', 'сотовый', '8517'],
    tips: 'Пошлина 0%, платится только НДС 20% и таможенный сбор! Если модель уже есть в Едином реестре нотификаций ЕАЭС, делать новую нотификацию не нужно.',
  },
  {
    code: '8518300000',
    name: 'Наушники и телефоны головные, спаренные или неспаренные с микрофоном (беспроводные TWS)',
    category: 'electronics',
    categoryLabel: 'Электроника и гаджеты',
    importDutyPercent: 0,
    dutyText: '0% (беспошлинно)',
    vatPercent: 20,
    customsRiskPerKgUsd: 65.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Не входит в перечень обязательной маркировки Честный Знак.',
      groupName: 'Потребительская электроника',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'notification',
        typeLabel: 'Нотификация ФСБ РФ',
        technicalRegulation: 'Криптография (Bluetooth-модуль)',
        description: 'Bluetooth использует алгоритмы шифрования, поэтому требуется действующая нотификация.',
        sampleTestingRequired: false,
        estimatedCostRub: 'от 15 000 ₽',
        estimatedDays: '7–10 дней',
      },
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 020/2011 (ЭМС) + ТР ЕАЭС 037/2016 (RoHS)',
        description: 'Декларирование электромагнитной совместимости.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 20 000 ₽',
        estimatedDays: '6–8 дней',
      },
    ],
    keywords: ['наушники', 'tws', 'bluetooth', 'airpods', 'гарнитура', 'беспроводные наушники', '8518'],
    tips: 'Если в комплекте идет кейс со встроенным аккумулятором (powercase), необходимо указать параметры литий-ионной батареи в упаковочном листе.',
  },
  {
    code: '8507600000',
    name: 'Аккумуляторы литий-ионные (включая внешние аккумуляторы Power Bank)',
    category: 'electronics',
    categoryLabel: 'Электроника и гаджеты',
    importDutyPercent: 0,
    dutyText: '0%',
    vatPercent: 20,
    customsRiskPerKgUsd: 18.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Честный Знак не требуется.',
      groupName: 'Источники питания',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии ГОСТ Р / ТР ТС',
        technicalRegulation: 'ТР ТС 020/2011 (ЭМС) и Постановление Правительства № 2425',
        description: 'Обязательное декларирование безопасности литиевых аккумуляторов.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 22 000 ₽',
        estimatedDays: '7–10 дней',
      },
    ],
    keywords: ['повербанк', 'powerbank', 'аккумулятор', 'батарея', 'литиевый', '18650', '8507'],
    tips: 'Литиевые аккумуляторы классифицируются как опасный груз (UN 3480 / UN 3481, Класс 9). Для авиадоставки требуется паспорт безопасности MSDS и тест UN38.3. Наземным транспортом Express Today везет штатно!',
  },
  {
    code: '8508110000',
    name: 'Пылесосы со встроенным электродвигателем мощностью не более 1500 Вт (включая роботы-пылесосы)',
    category: 'electronics',
    categoryLabel: 'Электроника и гаджеты',
    importDutyPercent: 0,
    dutyText: '0%',
    vatPercent: 20,
    customsRiskPerKgUsd: 25.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Пылесосы не подлежат маркировке Честный Знак.',
      groupName: 'Бытовая техника',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ss',
        typeLabel: 'Сертификат соответствия (СС ТР ТС)',
        technicalRegulation: 'ТР ТС 004/2011 (Низковольтное оборудование) + ТР ТС 020/2011 (ЭМС)',
        description: 'Бытовая техника, подключаемая к сети 220В, подлежит жесткой СЕРТИФИКАЦИИ (не просто декларация!). Обязателен ввоз образцов.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 45 000 ₽',
        estimatedDays: '15–20 дней',
      },
      {
        type: 'notification',
        typeLabel: 'Нотификация ФСБ (для роботов с Wi-Fi)',
        technicalRegulation: 'Криптография Wi-Fi/Bluetooth управления',
        description: 'Требуется, если робот-пылесос управляется со смартфона через Wi-Fi/приложение.',
        sampleTestingRequired: false,
        estimatedCostRub: 'от 15 000 ₽',
        estimatedDays: '7 дней',
      },
    ],
    keywords: ['пылесос', 'робот-пылесос', 'бытовая техника', 'клининг', 'xiaomi', '8508'],
    tips: 'Обратите внимание: для бытовых приборов 220В нужен СЕРТИФИКАТ (СС), а не Декларация (ДС). Ошибки в выборе формы сертификации ведут к административным штрафам по ст. 14.43 КоАП.',
  },
  {
    code: '8528521000',
    name: 'Мониторы, подключаемые непосредственно к вычислительным машинам',
    category: 'electronics',
    categoryLabel: 'Электроника и гаджеты',
    importDutyPercent: 0,
    dutyText: '0%',
    vatPercent: 20,
    customsRiskPerKgUsd: 35.0,
    chestnyZnak: {
      required: false,
      status: 'pilot',
      statusLabel: 'Эксперимент',
      description: 'Мониторы участвуют в эксперименте по радиоэлектронике.',
      groupName: 'Вычислительная техника',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ss',
        typeLabel: 'Сертификат соответствия (СС)',
        technicalRegulation: 'ТР ТС 004/2011 + ТР ТС 020/2011',
        description: 'Обязательный сертификат для мониторов с питанием от сети.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 42 000 ₽',
        estimatedDays: '14 дней',
      },
    ],
    keywords: ['монитор', 'дисплей', 'экран', 'компьютер', '8528'],
    tips: 'Пошлина 0%. Обязательно проверять наличие маркировки ЕАС на шильдике монитора и коробке до отправки из Китая.',
  },

  // --- КОСМЕТИКА И ПАРФЮМЕРИЯ (Группа 33) ---
  {
    code: '3303001000',
    name: 'Духи (спиртосодержащие растворы душистых веществ)',
    category: 'cosmetics',
    categoryLabel: 'Косметика и парфюмерия',
    importDutyPercent: 6.5,
    dutyText: '6.5%',
    vatPercent: 20,
    exciseText: 'Подакцизный товар при содержании этилового спирта свыше 9% (кроме внесенных в перечень необлагаемой парфюмерии)',
    customsRiskPerKgUsd: 40.0,
    chestnyZnak: {
      required: true,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка 100%',
      description: 'Духи и туалетная вода обязательно маркируются кодами DataMatrix «Честный ЗНАК».',
      groupName: 'Парфюмерия',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 009/2011 «О безопасности парфюмерно-косметической продукции»',
        description: 'Схема декларирования парфюмерии с токсикологическими и клиническими испытаниями.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 25 000 ₽',
        estimatedDays: '10–14 дней',
      },
    ],
    keywords: ['духи', 'парфюм', 'туалетная вода', 'парфюмерия', 'аромат', '3303'],
    tips: 'Особое внимание акцизам и паспорту безопасности MSDS с указанием точной концентрации этилового спирта!',
  },
  {
    code: '3304990000',
    name: 'Косметические средства или средства для макияжа и средства для ухода за кожей (кремы, сыворотки, лосьоны)',
    category: 'cosmetics',
    categoryLabel: 'Косметика и парфюмерия',
    importDutyPercent: 6.5,
    dutyText: '6.5%',
    vatPercent: 20,
    customsRiskPerKgUsd: 18.0,
    chestnyZnak: {
      required: false,
      status: 'mandatory',
      statusLabel: 'Обязательна маркировка с 2024–2025',
      description: 'Косметика и средства гигиены поэтапно включены в обязательную маркировку Честный Знак.',
      groupName: 'Косметика и бытовая химия',
      markingInChinaAdvised: true,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии ТР ТС 009/2011',
        technicalRegulation: 'ТР ТС 009/2011',
        description: 'Для стандартной уходовой косметики для взрослых регистрируется ДС.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 20 000 ₽',
        estimatedDays: '7–10 дней',
      },
      {
        type: 'sgr',
        typeLabel: 'Свидетельство о госрегистрации (СГР Роспотребнадзора)',
        technicalRegulation: 'ТР ТС 009/2011 (Приложение 12)',
        description: 'Требуется для детской косметики, средств для химического пилинга, отбеливания кожи, искусственного загара и татуажа.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 75 000 ₽',
        estimatedDays: '30–45 дней',
      },
    ],
    keywords: ['крем', 'сыворотка', 'маска для лица', 'косметика', 'лосьон', 'уход за кожей', '3304'],
    tips: 'Если крем заявлен как «детский» или «отбеливающий», обычная декларация не подойдет — необходимо СГР Роспотребнадзора, которое оформляется до 1.5 месяцев.',
  },

  // --- МЕБЕЛЬ И ИНТЕРЬЕР (Группа 94) ---
  {
    code: '9401790009',
    name: 'Мебель для сидения с металлическим каркасом (офисные и обеденные стулья, кресла)',
    category: 'furniture',
    categoryLabel: 'Мебель и интерьер',
    importDutyPercent: 9.3,
    dutyText: '9.3%',
    vatPercent: 20,
    customsRiskPerKgUsd: 6.5,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Мебель для сидения не подлежит маркировке Честный Знак.',
      groupName: 'Мебельная продукция',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС)',
        technicalRegulation: 'ТР ТС 025/2012 «О безопасности мебельной продукции»',
        description: 'Бытовая и офисная мебель для сидения декларируется по схеме 3д (статическая и ударная прочность).',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 20 000 ₽',
        estimatedDays: '6–8 дней',
      },
    ],
    keywords: ['стул', 'кресло', 'офисное кресло', 'компьютерный стул', 'стулья', 'мебель', '9401'],
    tips: 'Детская мебель и стульчики для кормления подлежат обязательной Сертификации (СС) по ТР ТС 025/2012 с проверкой устойчивости и отсутствия острых кромок.',
  },
  {
    code: '9403208009',
    name: 'Мебель металлическая прочая (стеллажи, шкафы металлические, полки)',
    category: 'furniture',
    categoryLabel: 'Мебель и интерьер',
    importDutyPercent: 9.1,
    dutyText: '9.1%',
    vatPercent: 20,
    customsRiskPerKgUsd: 4.8,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Честный Знак не требуется.',
      groupName: 'Мебель',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация ТР ТС 025/2012',
        technicalRegulation: 'ТР ТС 025/2012',
        description: 'Мебель для дома и офисов.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 18 000 ₽',
        estimatedDays: '5–7 дней',
      },
    ],
    keywords: ['стеллаж', 'полка', 'шкаф', 'металлическая мебель', 'столик', '9403'],
    tips: 'При отгрузке мебели критически важна обрешетка (паллетирование) на складе в Китае, чтобы избежать деформации каркасов при транспортировке.',
  },
  {
    code: '9405110033',
    name: 'Люстры и прочие электрические светильники потолочные или настенные светодиодные (LED)',
    category: 'furniture',
    categoryLabel: 'Мебель и интерьер',
    importDutyPercent: 0,
    dutyText: '0%',
    vatPercent: 20,
    customsRiskPerKgUsd: 14.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Светильники не подлежат маркировке Честный Знак.',
      groupName: 'Светотехника',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ss',
        typeLabel: 'Сертификат соответствия (СС ТР ТС)',
        technicalRegulation: 'ТР ТС 004/2011 (НВО) + ТР ТС 020/2011 (ЭМС)',
        description: 'Бытовые светильники и люстры требуют СЕРТИФИКАТА соответствия.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 38 000 ₽',
        estimatedDays: '12–15 дней',
      },
      {
        type: 'ds',
        typeLabel: 'Декларация ТР ЕАЭС 037/2016',
        technicalRegulation: 'ТР ЕАЭС 037/2016 (RoHS электроника)',
        description: 'Проверка пайки и радиокомпонентов на содержание свинца и кадмия.',
        sampleTestingRequired: false,
        estimatedCostRub: 'от 12 000 ₽',
        estimatedDays: '3–5 дней',
      },
    ],
    keywords: ['люстра', 'светильник', 'led', 'лампа', 'бра', 'потолочный светильник', 'светодиоды', '9405'],
    tips: 'Ставка пошлины на многие LED-светильники 0%! Платится только НДС 20% и оформление.',
  },

  // --- ИГРУШКИ И ДЕТСКИЕ ТОВАРЫ (Группа 95) ---
  {
    code: '9503003500',
    name: 'Игрушки пластмассовые сборные, конструкторы и наборы для конструирования',
    category: 'toys',
    categoryLabel: 'Игрушки и детские товары',
    importDutyPercent: 0,
    dutyText: '0%',
    vatPercent: 10,
    vatNote: 'Льготная ставка НДС 10% для детских товаров в соответствии с НК РФ ст. 164',
    customsRiskPerKgUsd: 12.0,
    chestnyZnak: {
      required: false,
      status: 'pilot',
      statusLabel: 'Эксперимент по маркировке',
      description: 'Минпромторг проводит эксперимент по маркировке детских товаров и игрушек.',
      groupName: 'Детские товары',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ss',
        typeLabel: 'Сертификат соответствия (СС ТР ТС 008/2011)',
        technicalRegulation: 'ТР ТС 008/2011 «О безопасности игрушек»',
        description: 'Самый строгий регламент ЕАЭС! Обязательный ввоз образцов через таможню с ГТД на образцы и токсикологические испытания.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 55 000 ₽',
        estimatedDays: '15–20 дней',
      },
    ],
    keywords: ['конструктор', 'игрушки', 'лего', 'кубики', 'детский конструктор', 'lego', '9503'],
    tips: 'На конструкторы и детские игрушки действует СУПЕР-ВЫГОДНЫЙ НДС 10% и пошлина 0%! Но сертификат ТР ТС 008 обязателен, штраф за продажу без него до 300 000 ₽.',
  },
  {
    code: '9503004100',
    name: 'Игрушки мягкие набивные, изображающие животных или других существ',
    category: 'toys',
    categoryLabel: 'Игрушки и детские товары',
    importDutyPercent: 5,
    dutyText: '5%',
    vatPercent: 10,
    vatNote: 'Льготный НДС 10% на детские товары',
    customsRiskPerKgUsd: 14.0,
    chestnyZnak: {
      required: false,
      status: 'pilot',
      statusLabel: 'Эксперимент',
      description: 'Участие в пилотном проекте маркировки.',
      groupName: 'Детские товары',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ss',
        typeLabel: 'Сертификат соответствия (СС ТР ТС 008/2011)',
        technicalRegulation: 'ТР ТС 008/2011',
        description: 'Испытания швов на разрыв, проверка гипоаллергенности наполнителя и воспламеняемости ворса.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 50 000 ₽',
        estimatedDays: '15–20 дней',
      },
    ],
    keywords: ['мягкая игрушка', 'плюшевый медведь', 'игрушка', 'плюш', 'кукла', '9503'],
    tips: 'При расчете таможенной стоимости важно учитывать объем: мягкие игрушки легкие, но объемные, рекомендуется вакуумная упаковка на складе Express Today.',
  },

  // --- АВТОЗАПЧАСТИ (Группа 87, 84, 85) ---
  {
    code: '8708309109',
    name: 'Тормоза и тормоза с сервоусилителем, их части (тормозные колодки и диски)',
    category: 'auto',
    categoryLabel: 'Автозапчасти',
    importDutyPercent: 5,
    dutyText: '5%',
    vatPercent: 20,
    customsRiskPerKgUsd: 8.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Автозапчасти пока не подлежат обязательной маркировке Честный Знак.',
      groupName: 'Автокомпоненты',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ss',
        typeLabel: 'Сертификат соответствия (СС ТР ТС 018/2011)',
        technicalRegulation: 'ТР ТС 018/2011 «О безопасности колесных транспортных средств»',
        description: 'Тормозные элементы напрямую влияют на безопасность дорожного движения — обязателен Сертификат соответствия!',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 60 000 ₽',
        estimatedDays: '20–25 дней',
      },
    ],
    keywords: ['колодки', 'тормозные колодки', 'тормозные диски', 'суппорт', 'автозапчасти', 'тормоза', '8708'],
    tips: 'Автокомпоненты по ТР ТС 018/2011 требуют строгой привязки к маркам и моделям автомобилей в приложении к сертификату.',
  },
  {
    code: '8421230000',
    name: 'Оборудование для фильтрования масла или топлива в двигателях внутреннего сгорания (масляные и топливные фильтры)',
    category: 'auto',
    categoryLabel: 'Автозапчасти',
    importDutyPercent: 0,
    dutyText: '0%',
    vatPercent: 20,
    customsRiskPerKgUsd: 11.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Не требуется',
      description: 'Фильтры не маркируются.',
      groupName: 'Автокомпоненты',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии (ДС ТР ТС 018/2011)',
        technicalRegulation: 'ТР ТС 018/2011',
        description: 'Декларирование фильтрующих элементов для авто.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 26 000 ₽',
        estimatedDays: '8–12 дней',
      },
    ],
    keywords: ['фильтр', 'масляный фильтр', 'топливный фильтр', 'автозапчасти', '8421'],
    tips: 'Пошлина 0%! Отличная маржинальная категория для поставок на маркетплейсы и в оптовые автосети.',
  },

  // --- ТОВАРЫ ДЛЯ ДОМА И ПОСУДА (Группа 39, 69, 73, 96) ---
  {
    code: '9617000000',
    name: 'Термосы и сосуды вакуумные прочие в сборе; их части, кроме стеклянных колб',
    category: 'home',
    categoryLabel: 'Товары для дома и посуда',
    importDutyPercent: 11.5,
    dutyText: '11.5%',
    vatPercent: 20,
    customsRiskPerKgUsd: 9.5,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Термосы не подлежат маркировке Честный Знак.',
      groupName: 'Посуда и хозяйственные товары',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии ГОСТ Р',
        technicalRegulation: 'Постановление Правительства РФ № 2425 (Единый перечень продукции РФ)',
        description: 'Посуда и термосы для взрослых декларируются по национальной системе ГОСТ Р.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 18 000 ₽',
        estimatedDays: '5–7 дней',
      },
    ],
    keywords: ['термос', 'термокружка', 'термобутылка', 'вакуумный термос', 'посуда', '9617'],
    tips: 'Если термос позиционируется как детский (с яркими детскими принтами, соской), то он подлежит СГР Роспотребнадзора и сертификации по ТР ТС 007/2011.',
  },
  {
    code: '7323930000',
    name: 'Изделия столовые, кухонные или прочие изделия для бытовых нужд из коррозионностойкой стали (кастрюли, сковороды)',
    category: 'home',
    categoryLabel: 'Товары для дома и посуда',
    importDutyPercent: 10,
    dutyText: '10%',
    vatPercent: 20,
    customsRiskPerKgUsd: 7.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Честный Знак не требуется.',
      groupName: 'Посуда',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация о соответствии ГОСТ Р',
        technicalRegulation: 'Постановление Правительства РФ № 2425',
        description: 'Декларация на металлическую посуду для взрослых.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 17 000 ₽',
        estimatedDays: '5–7 дней',
      },
    ],
    keywords: ['кастрюля', 'сковорода', 'посуда', 'нержавейка', 'стальная посуда', 'кухня', '7323'],
    tips: 'Проверяется миграция тяжелых металлов (хром, никель, железо) в модельные среды в ходе испытаний.',
  },

  // --- ОБОРУДОВАНИЕ И СТАНКИ (Группа 84, 85) ---
  {
    code: '8456110000',
    name: 'Станки лазерные для обработки различных материалов лазерным лучом (волоконные лазеры, граверы)',
    category: 'equipment',
    categoryLabel: 'Оборудование и станки',
    importDutyPercent: 0,
    dutyText: '0% (беспошлинно)',
    vatPercent: 20,
    customsRiskPerKgUsd: 45.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Маркировка ЧЗ не требуется',
      description: 'Промышленное оборудование не подлежит маркировке Честный Знак.',
      groupName: 'Станки и промышленность',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ds',
        typeLabel: 'Декларация ТР ТС 010/2011 + ТР ТС 004 + ТР ТС 020',
        technicalRegulation: 'ТР ТС 010/2011 «О безопасности машин и оборудования»',
        description: 'Комплексная декларация оборудования с обоснованием безопасности (ОБ) и паспортом станка.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 35 000 ₽',
        estimatedDays: '10–14 дней',
      },
    ],
    keywords: ['лазерный станок', 'лазерный гравер', 'чпу', 'станок', 'волоконный лазер', 'лазер', '8456'],
    tips: 'Ввоз промышленного оборудования часто идет под контракт Express Today с нулевой пошлиной и возвратом НДС.',
  },
  {
    code: '8467211000',
    name: 'Дрели всех типов со встроенным электрическим двигателем, способные работать без внешнего источника питания (аккумуляторные шуруповерты)',
    category: 'equipment',
    categoryLabel: 'Оборудование и станки',
    importDutyPercent: 5.5,
    dutyText: '5.5%',
    vatPercent: 20,
    customsRiskPerKgUsd: 13.0,
    chestnyZnak: {
      required: false,
      status: 'not_required',
      statusLabel: 'Не требуется',
      description: 'Инструмент не маркируется.',
      groupName: 'Электроинструмент',
      markingInChinaAdvised: false,
    },
    permits: [
      {
        type: 'ss',
        typeLabel: 'Сертификат соответствия (СС ТР ТС 010/2011 + 004 + 020)',
        technicalRegulation: 'ТР ТС 010/2011 + ТР ТС 020/2011',
        description: 'Ручной электроинструмент подлежит обязательной сертификации с испытанием на вибрацию и шум.',
        sampleTestingRequired: true,
        estimatedCostRub: 'от 48 000 ₽',
        estimatedDays: '14–18 дней',
      },
    ],
    keywords: ['шуруповерт', 'дрель', 'перфоратор', 'электроинструмент', 'аккумуляторный инструмент', '8467'],
    tips: 'Зарядное устройство в комплекте также подлежит сертификации по ТР ТС 004/2011 (НВО).',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
  category: 'tnved' | 'chestny_znak' | 'permits' | 'duties';
}

export const TNVED_FAQ: FaqItem[] = [
  {
    category: 'tnved',
    question: 'Что такое код ТН ВЭД ЕАЭС и почему он так важен?',
    answer: 'ТН ВЭД (Товарная номенклатура внешнеэкономической деятельности) — это 10-значный числовой классификатор, по которому таможня определяет: ставку ввозной пошлины (от 0% до 20%), ставку НДС (10% или 20%), обязательность маркировки «Честный ЗНАК», а также необходимость предоставления Сертификата (СС) или Декларации (ДС). Неправильный выбор кода грозит пересчетом платежей, штрафами по ст. 16.2 КоАП РФ и задержкой выпуска на СВХ.',
  },
  {
    category: 'tnved',
    question: 'Кто определяет и утверждает код ТН ВЭД при импорте?',
    answer: 'Первоначально код заявляет декларант (импортер или таможенный брокер Express Today) в графе 33 декларации на товары (ДТ). Однако окончательное решение о классификации принимает таможенный орган. Чтобы исключить споры с таможней, декларанты Express Today заранее запрашивают технические паспорта, состав сырья и фото у китайских поставщиков и согласовывают код до погрузки.',
  },
  {
    category: 'chestny_znak',
    question: 'Что произойдет, если ввезти товар, подлежащий «Честному ЗНАКУ», без маркировки?',
    answer: 'Таможня откажет в выпуске товара по таможенной процедуре выпуска для внутреннего потребления (ИМ-40). Более того, немаркированный товар подпадает под статью 15.12 КоАП РФ (штраф для юрлиц от 50 000 до 300 000 ₽ с конфискацией предметов правонарушения). Express Today наносит коды DataMatrix на своем складе в Гуанчжоу/Иу ДО пересечения границы РФ, что полностью исключает риски.',
  },
  {
    category: 'chestny_znak',
    question: 'Можно ли промаркировать товар «Честным Знаком» уже в России?',
    answer: 'Да, но только под таможенной процедурой «Таможенный склад» (ИМ-70). Это требует перемещения груза на специализированный склад временного хранения, оплаты услуг стикерования по российским высоким тарифам (в 3-5 раз дороже Китая) и удлиняет таможенное оформление на 2-3 недели. Именно поэтому 98% наших клиентов выбирают маркировку в Китае силами Express Today.',
  },
  {
    category: 'permits',
    question: 'Чем отличается Сертификат соответствия (СС) от Декларации (ДС)?',
    answer: 'Сертификат соответствия (СС) оформляется на товары с высокой степенью потенциального риска (детские товары, игрушки, бытовые электроприборы 220В, нижнее белье 1-го слоя). Испытания проводятся строго в аккредитованной лаборатории с официальным ввозом образцов. Декларация (ДС) оформляется на взрослую одежду, обувь, косметику, мебель и регистрируется самим импортером через сервис ФГИС Росаккредитации по ЭЦП.',
  },
  {
    category: 'permits',
    question: 'Что такое Нотификация ФСБ и когда она обязательна?',
    answer: 'Нотификация ФСБ — это официальный уведомительный документ для ввоза радиоэлектронных устройств, содержащих шифровальные (криптографические) модули. Сюда входят любые гаджеты с Bluetooth, Wi-Fi, NFC (смартфоны, беспроводные наушники, ноутбуки, умные часы, роутеры, дроны). Если конкретная модель уже зарегистрирована в открытом Едином реестре нотификаций ЕАЭС, повторно оформлять ее не требуется.',
  },
  {
    category: 'duties',
    question: 'Что такое КТС (корректировка таможенной стоимости) и как её избежать?',
    answer: 'КТС — это процедура, при которой таможня считает заявленную стоимость партии в инвойсе заниженной относительно профилей риска (ИПР) ФТС и требует доплатить обеспечение пошлины и НДС. Чтобы избежать КТС, Express Today готовит полный защитный пакет: экспортную декларацию Китая (Export Declaration), прайс-лист завода, банковскую платежку SWIFT, калькуляцию себестоимости и договор с фабрикой.',
  },
  {
    category: 'duties',
    question: 'Из чего складываются итоговые таможенные платежи?',
    answer: 'Итоговая сумма платежей в казну включает: 1) Таможенный сбор за оформление (от 1 067 до 30 000 ₽ по Постановлению № 342); 2) Ввозную таможенную пошлину (от 0% до 20% от таможенной стоимости); 3) Акциз (только для подакцизных товаров, например, моторных масел или табака); 4) Ввозной НДС = (Таможенная стоимость + Пошлина + Акциз) × 20% (или 10% для детских товаров/медицины).',
  },
];

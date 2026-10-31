/**
 * SEO-маршруты сайта: единый источник данных для клиента (title/description/canonical/lang)
 * и сервера (robots.txt, sitemap.xml, llms.txt, 404, 301-редиректы старых URL).
 *
 * Правки: добавлять новые маршруты сюда, а не дублировать в App.tsx / server.ts.
 */

export const SITE_URL = 'https://express-today.ru';

export interface SeoEntry {
  /** <title> страницы */
  title: string;
  /** meta description */
  description: string;
  /** канонический путь (для алиасов одного контента) */
  canonical?: string;
  /** язык документа (по умолчанию 'ru') */
  lang?: string;
  /** 'noindex' — страница не для индекса */
  robots?: string;
  /** включать в sitemap.xml (по умолчанию true) */
  sitemap?: boolean;
  /** приоритет в sitemap.xml */
  priority?: string;
}

export const SEO_ROUTES: Record<string, SeoEntry> = {
  '/': {
    title: 'Express Today — доставка и выкуп товаров из Китая для бизнеса: склад в Гуанчжоу, белая схема ВЭД',
    description:
      'Официальная доставка и выкуп товаров из Китая в Россию под ключ: 1688, Taobao, Alibaba, POIZON, склад в Гуанчжоу, таможенное оформление, полный пакет документов. Онлайн-калькулятор и тарифы.',
    priority: '1.0',
  },
  '/dostavka': {
    title: 'Международная доставка из Китая в Россию: авиа, авто, ЖД, море — Express Today',
    description:
      'Доставка грузов из Китая в Россию: авиа 9–15 дней, ускоренное авто 13–20 дней, обычное авто, ЖД и морские контейнеры. Таможенное оформление и полный пакет документов. Расчёт онлайн.',
    priority: '0.9',
  },
  '/dostavka-avia-iz-kitaja': {
    title: 'Авиадоставка грузов из Китая: сроки 9–15 дней, тарифы от 4,9 $/кг — Express Today',
    description:
      'Авиадоставка из Китая в Россию: рейсы из Гуанчжоу, Шэньчжэня, Пекина и Шанхая, консолидация на складе, авианакладная AWB, таможенный выпуск. Сроки 9–15 дней, оплачиваемый вес 1:6000, отслеживание в ЛК.',
    priority: '0.8',
  },
  '/dostavka-avto-iz-kitaja': {
    title: 'Автодоставка из Китая: сроки 13–25 дней, тарифы от 0,7 $/кг — Express Today',
    description:
      'Автоперевозки грузов из Китая в Россию: сборные грузы LTL и отдельные фуры FTL, маршруты через Забайкальск и Хоргос, накладная CMR, страхование и таможенное оформление. Сроки 13–25 дней, отслеживание в ЛК.',
    priority: '0.8',
  },
  '/dostavka-morem-iz-kitaja': {
    title: 'Морская доставка из Китая: контейнеры FCL/LCL от 18 дней, тарифы от 0,1 $/кг — Express Today',
    description:
      'Морские контейнерные перевозки из Китая в Россию: FCL 20′/40′ HC и сборные LCL из Гуанчжоу, Шэньчжэня и Нинбо во Владивосток, Находку и Санкт-Петербург. Коносамент B/L, сроки от 18 дней, отслеживание в ЛК.',
    priority: '0.8',
  },
  '/dostavka-poezdom-iz-kitaja': {
    title: 'ЖД доставка из Китая: контейнерные поезда 16–30 дней, тарифы от 0,4 $/кг — Express Today',
    description:
      'Железнодорожные перевозки грузов из Китая в Россию: контейнерные поезда из Гуанчжоу, Чунцина и Сианя через Забайкальск и Достык, накладная СМГС, пломбировка, таможенное оформление. Сроки 16–30 дней.',
    priority: '0.8',
  },
  '/express-dostavka-iz-kitaia': {
    title: 'Экспресс-доставка из Китая в Россию: срочные грузы от 5 дней — Express Today',
    description:
      'Экспресс-доставка из Китая: срочные партии, образцы и документы авиа от 5 дней до двери. Консолидация на складе в Гуанчжоу, приоритетная обработка, таможенное оформление, отслеживание в личном кабинете.',
    priority: '0.8',
  },
  '/belaya-dostavka': {
    title: 'Белая доставка из Китая под ключ: ВЭД, ГТД, УПД с НДС 20% — Express Today',
    description:
      'Официальная «белая» поставка из Китая: договор поставки, фапьяо, ДТ (ГТД), УПД с НДС, Честный Знак. 9 шагов легального импорта с полным комплектом документов.',
    priority: '0.9',
  },
  '/kargo-dostavka-iz-kitaia': {
    title: 'Доставка сборных грузов из Китая в Россию — Express Today',
    description:
      'Сборные грузы из Китая: консолидация на складе в Гуанчжоу, надёжная упаковка, доставка в РФ с отслеживанием. Онлайн-тарифы и расчёт стоимости доставки.',
    priority: '0.8',
  },
  '/dostavka-kontejnera-iz-kitaja': {
    title: 'Контейнерные перевозки из Китая 20ft и 40ft — Express Today',
    description:
      'Доставка контейнеров из Китая в Россию: морские и ЖД маршруты, станки, спецтехника, крупногабаритные грузы. Полный пакет документов и таможенное оформление.',
    priority: '0.8',
  },
  '/dostavka-tovarov-iz-kitaia-dlia-marketpleisov': {
    title: 'Доставка из Китая для маркетплейсов Wildberries, Ozon, Яндекс.Маркет — Express Today',
    description:
      'Поставки из Китая для селлеров: выкуп, проверка на складе, фулфилмент, маркировка Честный Знак, сдача на склады WB, Ozon и Яндекс.Маркет под ключ.',
    priority: '0.8',
  },
  '/fulfilment-dlya-marketpleisov': {
    title: 'Фулфилмент для маркетплейсов: WB, Ozon, Яндекс.Маркет — Express Today',
    description:
      'Складской фулфилмент в Москве: приёмка, маркировка, упаковка по требованиям Wildberries, Ozon и Яндекс.Маркет, сдача на склады FBS/FBO.',
    priority: '0.8',
  },
  '/vikup-tovara-iz-kitaya': {
    title: 'Выкуп товаров из Китая за 24 часа: 1688, Taobao, POIZON — Express Today',
    description:
      'Выкуп по ссылке или инвойсу с 1688, Taobao, POIZON, Alibaba за 24 часа: проверка продавца, фотоотчёт, консолидация на складе в Гуанчжоу.',
    priority: '0.9',
  },
  '/vikup-1688-alibaba': {
    title: 'Выкуп с 1688 и Alibaba оптом за 24 часа — Express Today',
    description:
      'Оптовый выкуп с 1688.com и Alibaba: поиск фабрики, переговоры на китайском, проверка поставщика, фотоотчёт и доставка в Россию с документами.',
    priority: '0.9',
  },
  '/1688': {
    title: 'Выкуп с 1688: товары оптом с доставкой в Россию — Express Today',
    description:
      'Выкуп с 1688.com под ключ: проверка фабрик, фотоотчёт со склада в Гуанчжоу, доставка в РФ, полный пакет документов.',
    canonical: '/vikup-1688-alibaba',
    priority: '0.8',
  },
  '/alibaba': {
    title: 'Посредник Alibaba: выкуп товаров с доставкой в Россию — Express Today',
    description:
      'Выкуп с Alibaba.com: аудит поставщика, переговоры, заказ образцов, доставка в Россию с таможенным оформлением.',
    canonical: '/vikup-1688-alibaba',
    priority: '0.8',
  },
  '/1688-alibaba': {
    title: 'Выкуп с 1688 и Alibaba — Express Today',
    description: 'Оптовый выкуп с 1688.com и Alibaba с проверкой поставщиков и доставкой в Россию.',
    canonical: '/vikup-1688-alibaba',
  },
  '/vikup-optom': {
    title: 'Оптовый выкуп из Китая — Express Today',
    description: 'Оптовый выкуп товаров из Китая с проверкой фабрик, фотоотчётом и доставкой в Россию.',
    canonical: '/vikup-1688-alibaba',
  },
  '/optoviy-vikup-1688-alibaba': {
    title: 'Оптовый выкуп с 1688 и Alibaba — Express Today',
    description: 'Оптовый выкуп с 1688.com и Alibaba: поиск фабрики, переговоры, доставка в Россию.',
    canonical: '/vikup-1688-alibaba',
  },
  '/vikup-poizon-tmall-taobao': {
    title: 'Выкуп с POIZON, Tmall, Taobao с доставкой в Россию — Express Today',
    description:
      'Выкуп с розничных площадок Китая: POIZON (DEWU), Tmall, Taobao, JD.com. Проверка оригинальности, консолидация, доставка в РФ.',
    priority: '0.9',
  },
  '/poizon': {
    title: 'Выкуп с POIZON (DEWU) с доставкой в Россию — Express Today',
    description: 'Выкуп с POIZON: кроссовки и брендовые товары с проверкой оригинальности и доставкой в Россию.',
    canonical: '/vikup-poizon-tmall-taobao',
    priority: '0.8',
  },
  '/tmall': {
    title: 'Выкуп с Tmall с доставкой в Россию — Express Today',
    description: 'Выкуп с Tmall.com: брендовые товары с проверкой и доставкой в Россию.',
    canonical: '/vikup-poizon-tmall-taobao',
    priority: '0.8',
  },
  '/taobao': {
    title: 'Посредник Taobao: выкуп и доставка в Россию — Express Today',
    description: 'Выкуп товаров с Taobao: поиск, проверка поставщика, доставка в Россию с документами.',
    canonical: '/vikup-poizon-tmall-taobao',
    priority: '0.8',
  },
  '/vikup-roznica': {
    title: 'Выкуп с розничных площадок Китая — Express Today',
    description: 'Выкуп с POIZON, Tmall, Taobao и JD.com с доставкой в Россию.',
    canonical: '/vikup-poizon-tmall-taobao',
  },
  '/roznichniy-vikup-poizon-tmall-taobao': {
    title: 'Розничный выкуп с POIZON, Tmall, Taobao — Express Today',
    description: 'Розничный выкуп с POIZON, Tmall, Taobao с доставкой в Россию.',
    canonical: '/vikup-poizon-tmall-taobao',
  },
  '/poisk-proizvodstva-tovarov-v-kitae-optom': {
    title: 'Поиск поставщиков и фабрик в Китае под ваше ТЗ — Express Today',
    description:
      'Найдём проверенных производителей в Китае: переговоры на китайском, аудит юридического лица, заказ образцов, контроль качества.',
    priority: '0.8',
  },
  '/konsolidaciya-tovara-v-kitaye': {
    title: 'Консолидация товаров в Китае: склад в Гуанчжоу — Express Today',
    description:
      'Сбор заказов от разных фабрик в один груз: приёмка, фотоотчёт, проверка брака, упаковка и обрешётка на складе в Гуанчжоу.',
    priority: '0.8',
  },
  '/stat-importerom': {
    title: 'Стать импортёром: оформление поставок на ваше юрлицо — Express Today',
    description:
      'Прямой ВЭД-контракт на вашу компанию: валютные платежи, сертификаты на ваше юрлицо, таможенное оформление с ГТД и вычетом НДС.',
    priority: '0.8',
  },
  '/dokumenty-dlya-vvoza': {
    title: 'Документы для ввоза: Честный Знак и сертификация под ключ — Express Today',
    description:
      'Честный Знак полного цикла и сертификация: заказ кодов, контроль оклейки в Китае, таможенный учёт, ДС и сертификаты от проверенных лабораторий.',
    priority: '0.8',
  },
  '/tnved': {
    title: 'ТН ВЭД — подбор кода и расчёт пошлин и НДС | Express Today',
    description:
      'Онлайн-подбор кода ТН ВЭД: поиск по названию товара, ставки пошлин, НДС и таможенные сборы. Калькулятор таможенных платежей из Китая.',
    priority: '0.8',
  },
  '/tnved2': {
    title: 'ТН ВЭД: подбор кода товара | Express Today',
    description: 'Подбор кода ТН ВЭД по названию товара с расчётом пошлин и НДС.',
    canonical: '/tnved',
  },
  '/tnved3': {
    title: 'ТН ВЭД: подбор кода товара | Express Today',
    description: 'Подбор кода ТН ВЭД по названию товара с расчётом пошлин и НДС.',
    canonical: '/tnved',
  },
  '/tamozhnya-tnved': {
    title: 'ТН ВЭД и таможня: коды, пошлины, НДС — Express Today',
    description: 'Подбор кода ТН ВЭД, ставки пошлин и НДС, таможенные сборы при ввозе из Китая.',
    canonical: '/tnved',
  },
  '/podbor-koda-tnved': {
    title: 'Подбор кода ТН ВЭД онлайн — Express Today',
    description: 'Подбор кода ТН ВЭД по названию товара: пошлины, НДС, таможенные сборы.',
    canonical: '/tnved',
  },
  '/online-tariffs': {
    title: 'Тарифы на доставку из Китая в Россию онлайн — Express Today',
    description:
      'Поиск тарифов Китай → Россия: авиа, авто, ЖД, море. Сравните стоимость доставки по весу и объёму в онлайн-калькуляторе тарифов.',
    priority: '0.9',
  },
  '/tariffs': {
    title: 'Тарифы на доставку из Китая в Россию онлайн — Express Today',
    description: 'Поиск тарифов Китай → Россия: авиа, авто, ЖД, море.',
    canonical: '/online-tariffs',
  },
  '/faq': {
    title: 'Вопросы и ответы: выкуп и доставка из Китая — Express Today',
    description:
      'Частые вопросы о выкупе с 1688, Taobao, POIZON, складе в Гуанчжоу, доставке в Россию, документах и таможенном оформлении.',
    priority: '0.7',
  },
  '/kontakti': {
    title: 'Контакты Express Today: доставка и выкуп из Китая',
    description:
      'Телефон, мессенджеры и офисы Express Today. Склад в Гуанчжоу, выдача в Москве. Бесплатная консультация по доставке из Китая.',
    priority: '0.6',
  },
  '/raschet-stoimosti-dostavki-gruza-iz-kitaja': {
    title: 'Калькулятор доставки из Китая: расчёт стоимости онлайн — Express Today',
    description:
      'Рассчитайте стоимость доставки груза из Китая в Россию: вес, объём, категория товара, способ перевозки. Мгновенная оценка стоимости.',
    priority: '0.9',
  },
  '/world': {
    title: 'Выкуп и доставка из Турции и других стран мира в Россию — Express Today',
    description:
      'Прямые поставки товаров, одежды и оборудования из Турции и других стран мира в Россию: выкуп, инспекция, международная логистика.',
    priority: '0.7',
  },
  '/turkey': {
    title: 'Доставка из Турции в Россию — Express Today',
    description: 'Выкуп и доставка товаров из Турции в Россию: инспекция, международная логистика.',
    canonical: '/world',
    priority: '0.6',
  },
  '/publichnaya-oferta': {
    title: 'Публичная оферта — Express Today',
    description: 'Публичная оферта сервиса доставки и выкупа товаров из Китая Express Today.',
    priority: '0.3',
  },
  '/soglashenie-o-konfidencialnosti-i-polzovatelskoe-soglashenie': {
    title: 'Политика конфиденциальности — Express Today',
    description: 'Соглашение о конфиденциальности и пользовательское соглашение Express Today.',
    priority: '0.3',
  },
  '/partnerskoye-referalnoye-soglasheniye-oferta': {
    title: 'Партнёрское (реферальное) соглашение — Express Today',
    description: 'Условия партнёрской и реферальной программы Express Today.',
    priority: '0.3',
  },
  '/oferta-dostavka': {
    title: 'Оферта доставки — Express Today',
    description: 'Условия оказания услуг доставки Express Today.',
    priority: '0.3',
  },
  '/test2': {
    title: 'Express Today — тестовая страница',
    description: 'Служебная страница.',
    robots: 'noindex',
    sitemap: false,
  },
  '/original19102026': {
    title: 'Express Today — сохранённая версия главной',
    description: 'Служебная страница.',
    robots: 'noindex',
    sitemap: false,
  },
};

/** Префиксы, под которые попадают страницы услуг ServicePage (slug-роутинг). */
export const KNOWN_PREFIXES = [
  '/vikup',
  '/poisk',
  '/konsolidaciya',
  '/belaya',
  '/kargo',
  '/dostavka',
  '/1688',
  '/fulfilment',
  '/stat-importerom',
  '/dokumenty-dlya-vvoza',
];

/** Старые URL (старый сайт / старые версии), которых больше нет — 301 на актуальные. */
export const OLD_REDIRECTS: Record<string, string> = {
  '/dostavka-zootovarov-iz-kitaja': '/dostavka',
  '/tovary-iz-kitaja-optom': '/vikup-optom',
  '/dostavka-opt': '/dostavka',
  '/ch': '/vikup-1688-alibaba',
  '/services': '/dostavka',
  '/session': '/',
};

export const FALLBACK_TITLE =
  'Express Today — доставка и выкуп товаров из Китая для бизнеса';
export const FALLBACK_DESCRIPTION =
  'Официальная доставка и выкуп товаров из Китая в Россию под ключ: 1688, Taobao, Alibaba, склад в Гуанчжоу, таможенное оформление, полный пакет документов.';

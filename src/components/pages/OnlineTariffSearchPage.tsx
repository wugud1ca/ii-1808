import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Plane,
  Truck,
  Train,
  Ship,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Clock,
  Boxes,
  HelpCircle,
  Package,
  Layers,
  Calendar,
  X,
  FileCheck,
  Send,
  UserCheck,
  Compass,
  ArrowUpDown,
  TrendingDown,
  Info,
  Building2,
  Scale
} from 'lucide-react';
import { trackEvent } from '../../utils/analytics';
import { siteConfig } from '../../siteConfig';

interface OnlineTariffSearchPageProps {
  onOpenLeadModal?: (requestType?: string) => void;
  onNavigate?: (route: string) => void;
}

export type TransportFilter = 'all' | 'auto' | 'air' | 'rail' | 'sea';
export type CargoNature = 'standard' | 'fragile' | 'battery';

interface CityOption {
  code: string;
  name: string;
  hub: string;
  region: string;
}

const ORIGIN_CITIES: CityOption[] = [
  { code: 'CAN', name: 'Гуанчжоу', hub: 'Склад консолидации Express Today (Байюнь)', region: 'Южный Китай / Гуандун' },
  { code: 'YIW', name: 'Иу', hub: 'Логистический центр Иу (Чжэцзян)', region: 'Восточный Китай' },
  { code: 'SZX', name: 'Шэньчжэнь', hub: 'Техно-хаб Баоань / Хуацянбэй', region: 'Гуандун' },
  { code: 'NGB', name: 'Нинбо', hub: 'Морской и ЖД контейнерный терминал', region: 'Чжэцзян' },
  { code: 'SHA', name: 'Шанхай', hub: 'Сборный терминал Пудун / Сунцзян', region: 'Шанхай' },
  { code: 'PEK', name: 'Пекин', hub: 'Северный хаб Чаоян', region: 'Северный Китай' },
  { code: 'FOS', name: 'Фошань', hub: 'Мебельный и строительный терминал', region: 'Гуандун' },
  { code: 'NZH', name: 'Маньчжурия', hub: 'Приграничный терминал сухого порта', region: 'Внутренняя Монголия' },
];

const DESTINATION_CITIES: CityOption[] = [
  { code: 'MOW', name: 'Москва', hub: 'Южные Ворота / Люблино / СВХ Ворсино', region: 'Центральный ФО' },
  { code: 'LED', name: 'Санкт-Петербург', hub: 'Склад Шушары / Парнас', region: 'Северо-Западный ФО' },
  { code: 'OVB', name: 'Новосибирск', hub: 'Транзитный хаб Толмачево / Клещиха', region: 'Сибирский ФО' },
  { code: 'SVX', name: 'Екатеринбург', hub: 'Логистический парк Кольцово', region: 'Уральский ФО' },
  { code: 'VVO', name: 'Владивосток', hub: 'Порт ВМТП / Рыбный порт', region: 'Дальневосточный ФО' },
  { code: 'KZN', name: 'Казань', hub: 'Иннополис / Лаишево', region: 'Приволжский ФО' },
  { code: 'KRR', name: 'Краснодар', hub: 'Южный хаб Западный обход', region: 'Южный ФО' },
  { code: 'KUF', name: 'Самара', hub: 'Терминал Преображенка', region: 'Приволжский ФО' },
  { code: 'CEK', name: 'Челябинск', hub: 'Транспортный узел Южный', region: 'Уральский ФО' },
  { code: 'MSQ', name: 'Минск', hub: 'Колядичи / Великий Камень', region: 'Беларусь' },
];

interface RawTariffTemplate {
  id: string;
  name: string;
  transportType: 'auto' | 'air' | 'rail' | 'sea';
  tag: string;
  tagColor: string; // 'emerald' | 'orange' | 'blue' | 'purple' | 'amber' | 'cyan'
  carrierBadge: string;
  transitMinDays: number;
  transitMaxDays: number;
  departureSchedule: string;
  transitBorder: string;
  baseKgRate: number; // in USD for average density
  baseM3Rate: number; // in USD for LCL
  container20ftRate: number; // in USD FCL
  container40ftRate: number; // in USD FCL (includes ~$2,200 COC equipment)
  densityMultiplier: number;
  minWeight: number;
  highlights: string[];
  insurancePct: number;
  benchmarkSource: string;
}

const TARIFF_TEMPLATES: RawTariffTemplate[] = [
  // =========================================================================
  // 1. АВТОМОБИЛЬНЫЕ МАРШРУТЫ (AUTO) - 5 тарифов
  // =========================================================================
  {
    id: 'express-auto-fast',
    name: 'Express Fast Truck (Хоргос Экспресс)',
    transportType: 'auto',
    tag: 'Хит продаж • Самый востребованный',
    tagColor: 'orange',
    carrierBadge: 'Express Today Direct Truck Line',
    transitMinDays: 13,
    transitMaxDays: 16,
    departureSchedule: 'Отправление: ежедневно из Гуанчжоу и Иу',
    transitBorder: 'Хоргос / Алашанькоу (собственный коридор)',
    baseKgRate: 2.65,
    baseM3Rate: 265,
    container20ftRate: 0,
    container40ftRate: 14800, // FTL Eurotruck $14,800
    densityMultiplier: 1.0,
    minWeight: 30,
    highlights: [
      'Прямая ускоренная автоколонна без перегрузок в пути',
      'Еврофура FTL: ~$14 800 (Гуанчжоу/Шэньчжэнь), ~$14 500 (Шанхай/Нинбо)',
      'Сборный груз LTL: от $0.60 до $2.65/кг в зависимости от плотности',
      'Полный фотоотчет и взвешивание в личном кабинете'
    ],
    insurancePct: 1.0,
    benchmarkSource: 'Собственная регулярная автолиния Express Today'
  },
  {
    id: 'standard-auto-optimal',
    name: 'Стандарт Авто Оптимал (Забайкальск)',
    transportType: 'auto',
    tag: 'Оптимальный автобаланс',
    tagColor: 'emerald',
    carrierBadge: 'Express Today Silk Road Direct',
    transitMinDays: 18,
    transitMaxDays: 24,
    departureSchedule: 'Отправление: 4 раза в неделю',
    transitBorder: 'Маньчжурия / Забайкальск',
    baseKgRate: 2.15,
    baseM3Rate: 220,
    container20ftRate: 0,
    container40ftRate: 14500, // FTL Eurotruck $14,500
    densityMultiplier: 0.95,
    minWeight: 50,
    highlights: [
      'Экономичный автомаршрут для регулярных поставок с фабрик',
      'Еврофура FTL: ~$14 500 из Шанхая / Нинбо / Циндао',
      'Усиленная паллетизация и деревянная обрешетка на складе консолидации',
      'Маркировка «Честный Знак» и стикеровка до пересечения границы'
    ],
    insurancePct: 1.0,
    benchmarkSource: 'Собственный северный коридор Express Today'
  },
  {
    id: 'auto-heavy-cargo',
    name: 'Авто-Тяжеловоз & Станки (FTL Трал / Тент)',
    transportType: 'auto',
    tag: 'Для станков и тяжелых грузов',
    tagColor: 'purple',
    carrierBadge: 'Express Today Heavy Logistics',
    transitMinDays: 20,
    transitMaxDays: 26,
    departureSchedule: 'Отправление: под загрузку завода (индивидуально)',
    transitBorder: 'Хоргос / Забайкальск (негабаритный терминал)',
    baseKgRate: 1.85,
    baseM3Rate: 205,
    container20ftRate: 0,
    container40ftRate: 13900,
    densityMultiplier: 0.9,
    minWeight: 1000,
    highlights: [
      'Подача тентованных фур и низкорамных тралов к воротам завода в КНР',
      'Крепление промышленного оборудования, стяжные ремни и ложементы',
      'Оформление специальных разрешений на перевозку негабарита',
      'Прямая выгрузка на склад заказчика в РФ'
    ],
    insurancePct: 1.0,
    benchmarkSource: 'Спецпарк тралов и еврофур Express Today'
  },
  {
    id: 'auto-marketplace-fulfillment',
    name: 'Авто Маркетплейс Express (WB / Ozon)',
    transportType: 'auto',
    tag: 'Готово к сдаче на маркетплейсы',
    tagColor: 'orange',
    carrierBadge: 'Express Today Marketplace Line',
    transitMinDays: 14,
    transitMaxDays: 17,
    departureSchedule: 'Отправление: ежедневно',
    transitBorder: 'Хоргос / Достык (зеленый коридор)',
    baseKgRate: 2.45,
    baseM3Rate: 250,
    container20ftRate: 0,
    container40ftRate: 14600,
    densityMultiplier: 1.0,
    minWeight: 30,
    highlights: [
      'Бесплатная проверка маркировки ШК и DataMatrix перед отправкой',
      'Кросс-докинг и прямая сдача на склады Коледино, Электросталь, Софьино',
      'Индивидуальный номер отслеживания коробки в личном кабинете',
      'Страховка от утери и повреждения 100%'
    ],
    insurancePct: 1.0,
    benchmarkSource: 'Специализированная E-commerce линия Express Today'
  },
  {
    id: 'auto-economy-consolidated',
    name: 'Авто Эконом Сборный (Консолидация)',
    transportType: 'auto',
    tag: 'Минимальный бюджет на авто',
    tagColor: 'amber',
    carrierBadge: 'Express Today Cargo Line',
    transitMinDays: 22,
    transitMaxDays: 28,
    departureSchedule: 'Отправление: вторник и суббота',
    transitBorder: 'Такескен / Маньчжурия',
    baseKgRate: 1.75,
    baseM3Rate: 185,
    container20ftRate: 0,
    container40ftRate: 13200,
    densityMultiplier: 0.9,
    minWeight: 50,
    highlights: [
      'Самый доступный автотариф для коммерческих партий',
      'Бесплатное хранение до 14 дней на складах Иу и Гуанчжоу для накопления партии',
      'Доставка в любые регионы России через партнерскую сеть терминалов',
      'Фиксированная стоимость без скрытых терминальных доплат'
    ],
    insurancePct: 1.0,
    benchmarkSource: 'Сборный автосервис Express Today'
  },

  // =========================================================================
  // 2. АВИАЦИОННЫЕ МАРШРУТЫ (AIR) - 5 тарифов
  // =========================================================================
  {
    id: 'air-cargo-express',
    name: 'Прямой Авиа Карго Экспресс',
    transportType: 'air',
    tag: 'Сверхсрочно • 3–5 дней',
    tagColor: 'blue',
    carrierBadge: 'Express Today Sky Direct (CAN / SZX / SHA → SVO)',
    transitMinDays: 3,
    transitMaxDays: 5,
    departureSchedule: 'Вылеты: 5 раз в неделю (Гуанчжоу / Шэньчжэнь / Шанхай)',
    transitBorder: 'Шереметьево-Карго / Домодедово Карго',
    baseKgRate: 3.95, // $3.60–$4.30/kg for >70kg; $5.50–$7.80/kg for <70kg
    baseM3Rate: 590,
    container20ftRate: 0,
    container40ftRate: 0,
    densityMultiplier: 1.2,
    minWeight: 10,
    highlights: [
      'Ставка от $3.60–$4.30/кг (для партий >70 кг) и $5.50–$7.80/кг (до 70 кг)',
      'Срочный транзит 3–5 дней door-to-door / airport-to-door',
      'Приоритетный таможенный выпуск в день прилета рейса',
      'Идеально для новинок электроники, трендов маркетплейсов и образцов'
    ],
    insurancePct: 1.2,
    benchmarkSource: 'Собственные забронированные грузовые слоты Express Today'
  },
  {
    id: 'air-samples-express',
    name: 'Авиа Экспресс: Образцы & Тестовые Партии',
    transportType: 'air',
    tag: 'Доставка образцов за 48–72 ч',
    tagColor: 'purple',
    carrierBadge: 'Express Today Fast Sample Line',
    transitMinDays: 2,
    transitMaxDays: 4,
    departureSchedule: 'Вылеты: ежедневно',
    transitBorder: 'Авиаузел Москва (SVO / VKO)',
    baseKgRate: 5.50,
    baseM3Rate: 750,
    container20ftRate: 0,
    container40ftRate: 0,
    densityMultiplier: 1.3,
    minWeight: 5,
    highlights: [
      'Быстрый забор образцов с фабрики в любой провинции Китая курьером',
      'Экспресс-доставка прямо в офис или на производство в РФ',
      'Проверка качества и фотоотчет фабричной продукции перед вылетом',
      'Минимальный порог отправки от 5 кг'
    ],
    insurancePct: 1.5,
    benchmarkSource: 'Курьерская экспресс-служба Express Today Sky'
  },
  {
    id: 'air-electronics-battery',
    name: 'Авиа Электроника & АКБ (DG Cargo)',
    transportType: 'air',
    tag: 'Официальный провоз батарей & DG',
    tagColor: 'orange',
    carrierBadge: 'Express Today DG Sky Cargo',
    transitMinDays: 4,
    transitMaxDays: 6,
    departureSchedule: 'Вылеты: 3 раза в неделю (Гонконг / Шэньчжэнь)',
    transitBorder: 'Грузовой авиатерминал Москва',
    baseKgRate: 4.60,
    baseM3Rate: 640,
    container20ftRate: 0,
    container40ftRate: 0,
    densityMultiplier: 1.2,
    minWeight: 20,
    highlights: [
      'Официальный провоз литий-ионных аккумуляторов (Section II / IB)',
      'Оформление декларации опасного груза (DGR) и паспорт безопасности MSDS',
      'Специализированная UN-сертифицированная тара и маркировка',
      'Прямой рейс без промежуточных перегрузок'
    ],
    insurancePct: 1.5,
    benchmarkSource: 'Специализированная авиалиния опасных грузов Express Today'
  },
  {
    id: 'air-standard-economy',
    name: 'Авиа Эконом Чартер (Сборный рейс)',
    transportType: 'air',
    tag: 'Выгодный тариф от 100 кг',
    tagColor: 'emerald',
    carrierBadge: 'Express Today Sky Cargo Economy',
    transitMinDays: 6,
    transitMaxDays: 9,
    departureSchedule: 'Вылеты: 2 раза в неделю (Пекин / Шанхай)',
    transitBorder: 'Аэропорт Внуково Карго / Пулково',
    baseKgRate: 3.45,
    baseM3Rate: 520,
    container20ftRate: 0,
    container40ftRate: 0,
    densityMultiplier: 1.1,
    minWeight: 100,
    highlights: [
      'Оптимальный тариф для регулярных коммерческих партий от 100 кг',
      'Консолидация на авиатерминалах Пекина, Шанхая и Чжэнчжоу',
      'Полная таможенная очистка по белому контракту ВЭД с НДС 20%',
      'Доставка в регионы РФ авиатранзитом'
    ],
    insurancePct: 1.0,
    benchmarkSource: 'Регулярная чартерная программа Express Today'
  },
  {
    id: 'air-white-customs-dme',
    name: 'Авиа Белая Схема (ДТ + НДС 20% под ключ)',
    transportType: 'air',
    tag: '100% официальный импорт',
    tagColor: 'blue',
    carrierBadge: 'Express Today White Import Sky',
    transitMinDays: 4,
    transitMaxDays: 7,
    departureSchedule: 'Вылеты: 4 раза в неделю',
    transitBorder: 'Таможенный пост Домодедово / Шереметьево',
    baseKgRate: 4.10,
    baseM3Rate: 610,
    container20ftRate: 0,
    container40ftRate: 0,
    densityMultiplier: 1.2,
    minWeight: 50,
    highlights: [
      'Подача электронной декларации на товары (ДТ) до приземления борта',
      'Предоставление всех закрывающих документов: ДТ, УПД, ГТД, сертификаты',
      'Оплата по безналичному расчету в рублях с НДС 20%',
      'Выпуск день-в-день без задержек на СВХ'
    ],
    insurancePct: 1.0,
    benchmarkSource: 'Собственный брокерский отдел Express Today'
  },

  // =========================================================================
  // 3. ЖЕЛЕЗНОДОРОЖНЫЕ МАРШРУТЫ (RAIL) - 5 тарифов
  // =========================================================================
  {
    id: 'direct-rail-container',
    name: 'Прямой ЖД Блок-Поезд (CR Express Direct)',
    transportType: 'rail',
    tag: 'Идеально для объема и белой схемы',
    tagColor: 'purple',
    carrierBadge: 'Express Today Block Train Direct Line',
    transitMinDays: 25,
    transitMaxDays: 32,
    departureSchedule: 'Отправление поездов: Сиань, Сучжоу, Чэнду, Иу (3 раза/нед)',
    transitBorder: 'Достык / Алтынколь / Забайкальск → Ворсино / Белый Раст',
    baseKgRate: 1.45,
    baseM3Rate: 160, // LCL $155–$165/m3
    container20ftRate: 5400,
    container40ftRate: 9200, // $9,000–$9,400 (включая ~$2,200 оборудования COC)
    densityMultiplier: 0.9,
    minWeight: 100,
    highlights: [
      '40’HQ Контейнер: $9 000 (Шанхай/Нинбо) – $9 400 (Гуанчжоу/Шэньчжэнь)',
      'Сборный ЖД LCL: $155–$165/м³ (Сиань/Сучжоу → Ворсино / Шушары / Колядичи)',
      'Включено предоставление контейнерного оборудования COC (~$2 200)',
      'Полный комплект закрывающих документов: ДТ, УПД с НДС 20%'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Собственные контейнерные поезда Express Today'
  },
  {
    id: 'rail-fast-express-train',
    name: 'Ускоренный ЖД Экспресс (Сиань → Москва)',
    transportType: 'rail',
    tag: 'Скоростной ЖД поезд • 18–24 дн',
    tagColor: 'orange',
    carrierBadge: 'Express Today Silk Rail Fast Line',
    transitMinDays: 18,
    transitMaxDays: 24,
    departureSchedule: 'Отправление: вторник и суббота из Сианя',
    transitBorder: 'Хоргос / Алтынколь (приоритетный транзит)',
    baseKgRate: 1.65,
    baseM3Rate: 185,
    container20ftRate: 5800,
    container40ftRate: 9600,
    densityMultiplier: 0.95,
    minWeight: 100,
    highlights: [
      'Приоритетный пропуск по графику скоростного контейнерного поезда',
      'Фиксированное окно перегрузки на колее 1520 мм (до 48 часов)',
      'Прямое прибытие на узловую станцию Белый Раст (Московская обл.)',
      'Ежедневный спутниковый трекинг платформы'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Прямой экспресс-сервис Express Today'
  },
  {
    id: 'rail-lcl-consolidation',
    name: 'Сборный ЖД Контейнер (LCL Короба & Паллеты)',
    transportType: 'rail',
    tag: 'Сборный груз от 1 м³',
    tagColor: 'emerald',
    carrierBadge: 'Express Today Rail LCL Service',
    transitMinDays: 26,
    transitMaxDays: 34,
    departureSchedule: 'Отправление: еженедельно (Иу, Гуанчжоу, Сучжоу)',
    transitBorder: 'Забайкальск / Достык',
    baseKgRate: 1.35,
    baseM3Rate: 155, // $155/m3
    container20ftRate: 0,
    container40ftRate: 0,
    densityMultiplier: 0.9,
    minWeight: 50,
    highlights: [
      'Тарификация по объему: всего $155–$165/м³ для коробочных и паллетных грузов',
      'Консолидация на сухих терминалах Сучжоу, Иу и Сианя',
      'Адресная доставка до двери в Москве, СПб, Екатеринбурге, Новосибирске',
      'Электронный документооборот (Диадок / СБИС)'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Сборная ж/д линия Express Today LCL'
  },
  {
    id: 'rail-spb-northwest',
    name: 'ЖД Маршрут Северо-Запад (СПб Шушары)',
    transportType: 'rail',
    tag: 'Прямо в Санкт-Петербург',
    tagColor: 'blue',
    carrierBadge: 'Express Today Baltic Rail Express',
    transitMinDays: 24,
    transitMaxDays: 32,
    departureSchedule: 'Отправление: 2 раза в неделю',
    transitBorder: 'Забайкальск → ст. Шушары (СПб)',
    baseKgRate: 1.48,
    baseM3Rate: 165,
    container20ftRate: 5500,
    container40ftRate: 9350,
    densityMultiplier: 0.9,
    minWeight: 100,
    highlights: [
      'Прямой поезд без перегрузки в Московском ж/д узле',
      'Выгрузка на современном терминале Шушары с прямым автовывозом',
      'Экономия до $400 на внутрироссийском плече доставки для клиентов СЗФО',
      'Полная таможенная очистка на Балтийской и Санкт-Петербургской таможне'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Прямой ж/д коридор Express Today Северо-Запад'
  },
  {
    id: 'rail-siberia-ural',
    name: 'ЖД Сибирь & Урал (Новосибирск / Екатеринбург)',
    transportType: 'rail',
    tag: 'Быстро в регионы Сибири и Урала',
    tagColor: 'amber',
    carrierBadge: 'Express Today Ural-Siberia Line',
    transitMinDays: 16,
    transitMaxDays: 22,
    departureSchedule: 'Отправление: 3 раза в неделю',
    transitBorder: 'Достык / Забайкальск → Клещиха / Екатеринбург-Товарный',
    baseKgRate: 1.25,
    baseM3Rate: 140,
    container20ftRate: 4700,
    container40ftRate: 8200,
    densityMultiplier: 0.88,
    minWeight: 100,
    highlights: [
      'Кратчайший транзит 16–22 дня за счет прямого захода в Новосибирск и Екатеринбург',
      'Сниженная стоимость фрахта контейнера (минус $800–$1 000 по сравнению с Москвой)',
      'Собственный автопарк доставки от ж/д станции до вашего склада',
      'Таможенное оформление в Сибирском и Уральском ЦЭД'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Региональная ЖД сеть Express Today'
  },

  // =========================================================================
  // 4. МОРСКИЕ И МУЛЬТИМОДАЛЬНЫЕ МАРШРУТЫ (SEA) - 5 тарифов
  // =========================================================================
  {
    id: 'sea-multimodal-transsib',
    name: 'Мультимодал: Море + Транссиб (Владивосток / Восточный)',
    transportType: 'sea',
    tag: 'Лучшая цена на контейнер 20/40ft',
    tagColor: 'amber',
    carrierBadge: 'Express Today Pacific Intermodal Line',
    transitMinDays: 38,
    transitMaxDays: 48,
    departureSchedule: 'Судозаходы: еженедельно (Шанхай, Нинбо, Циндао, Наньша, Шэньчжэнь)',
    transitBorder: 'Порт Владивосток / Восточный → ж/д Транссиб в Москву',
    baseKgRate: 0.95,
    baseM3Rate: 90, // LCL $85–$95/m3
    container20ftRate: 5100, // 20' $5,100 по отчету
    container40ftRate: 8300, // 40' $8,000–$8,300 по отчету
    densityMultiplier: 0.85,
    minWeight: 200,
    highlights: [
      'Контейнер 20’GP: $5 100 | Контейнер 40’HQ: $8 000–$8 300 (FOB Владивосток → Москва)',
      'Сборный морской LCL: $85–$95/м³ (Шанхай, Нинбо, Гуанчжоу)',
      'В ставку включено использование контейнерного оборудования (~$2 200 COC)',
      'Прием тяжеловесного промышленного оборудования и генеральных партий'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Собственный дальневосточный морской коридор Express Today'
  },
  {
    id: 'deep-sea-spb-bronka',
    name: 'Deep Sea Прямое Море (СПб Порт Бронка)',
    transportType: 'sea',
    tag: 'Экономичный ocean-маршрут',
    tagColor: 'cyan',
    carrierBadge: 'Express Today Ocean Baltic Service',
    transitMinDays: 48,
    transitMaxDays: 58,
    departureSchedule: 'Судозаходы: 2 раза в месяц из портов Китая',
    transitBorder: 'Порт Бронка (Санкт-Петербург)',
    baseKgRate: 0.88,
    baseM3Rate: 88, // LCL $88/м3
    container20ftRate: 4830, // 20' $4,830 СПб
    container40ftRate: 7430, // 40' $7,430 СПб
    densityMultiplier: 0.85,
    minWeight: 300,
    highlights: [
      'Контейнер 20’GP: $4 830 | Контейнер 40’HQ: $7 430 (FOB → порт СПб)',
      'Сборный морской LCL: $88/м³ (прямой океанский сервис без перегруза)',
      'Терминальные сборы ПРР: $500, включено 5 свободных дней на терминале',
      'Идеально для крупных партий сырья, химической продукции и стройматериалов'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Прямая океанская линия Express Today Ocean Baltic'
  },
  {
    id: 'deep-sea-novorossiysk',
    name: 'Морская Линия Юг (Порт Новороссийск НУТЭП)',
    transportType: 'sea',
    tag: 'Кратчайший путь на Юг России',
    tagColor: 'blue',
    carrierBadge: 'Express Today South Sea Line',
    transitMinDays: 32,
    transitMaxDays: 45,
    departureSchedule: 'Судозаходы: каждые 10 дней',
    transitBorder: 'Порт Новороссийск (терминал НУТЭП)',
    baseKgRate: 0.85,
    baseM3Rate: 82, // LCL $82/м3
    container20ftRate: 4800, // 20' $4,800
    container40ftRate: 6900, // 40' $6,900
    densityMultiplier: 0.85,
    minWeight: 200,
    highlights: [
      'Контейнер 20’GP: $4 800 | Контейнер 40’HQ: $6 900 (порт Новороссийск)',
      'Сборный LCL фрахт: от $82/м³ (Нинбо / Шанхай / Наньша)',
      'Прямая доставка автоконтейнеровозами в Краснодар, Ростов, Самару, Москву',
      'Оперативное таможенное оформление в Новороссийском ЦЭД'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Собственный Черноморский сервис Express Today'
  },
  {
    id: 'sea-lcl-economy-hub',
    name: 'Морской Сборный Хаб (LCL Шанхай / Нинбо → МСК)',
    transportType: 'sea',
    tag: 'Абсолютный ценовой минимум за м³',
    tagColor: 'emerald',
    carrierBadge: 'Express Today LCL Sea Master',
    transitMinDays: 42,
    transitMaxDays: 52,
    departureSchedule: 'Отправление контейнеров: каждую пятницу',
    transitBorder: 'Порт Восточный → Терминал Москва (Ворсино)',
    baseKgRate: 0.78,
    baseM3Rate: 85, // LCL $85/м3
    container20ftRate: 0,
    container40ftRate: 0,
    densityMultiplier: 0.85,
    minWeight: 50,
    highlights: [
      'Ставка от $85/м³ — максимальная экономия логистического бюджета',
      'Еженедельная загрузка собственных сборных контейнеров в Нинбо и Шанхае',
      'Бесплатное паллетирование и стрейч-пленка на терминале консолидации',
      'Страхование груза от всех рисков 0.8%'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Сборный морской хаб Express Today'
  },
  {
    id: 'sea-direct-vladivostok-door',
    name: 'Море ДВ + Автодоставка до Двери (Intermodal Door)',
    transportType: 'sea',
    tag: 'Полный комплекс от двери до двери',
    tagColor: 'purple',
    carrierBadge: 'Express Today Full Intermodal Door Line',
    transitMinDays: 35,
    transitMaxDays: 46,
    departureSchedule: 'Судозаходы: еженедельно',
    transitBorder: 'Владивостокский морской торговый порт (ВМТП)',
    baseKgRate: 1.05,
    baseM3Rate: 98,
    container20ftRate: 5350,
    container40ftRate: 8650,
    densityMultiplier: 0.85,
    minWeight: 200,
    highlights: [
      'Забор контейнера с завода в Китае (EXW/FCA) + Морской фрахт + ЖД + Вывоз на склад в РФ',
      'В ставку включен автовывоз по Москве и МО до склада заказчика',
      'Предоставление порожнего оборудования под погрузку за 24 часа',
      'Персональный менеджер ВЭД и круглосуточный статус в личном кабинете'
    ],
    insurancePct: 0.8,
    benchmarkSource: 'Сквозной мультимодальный сервис Express Today Door-to-Door'
  }
];

export const OnlineTariffSearchPage: React.FC<OnlineTariffSearchPageProps> = ({
  onOpenLeadModal,
  onNavigate
}) => {
  // Search state
  const [originCode, setOriginCode] = useState<string>('CAN');
  const [destinationCode, setDestinationCode] = useState<string>('MOW');
  const [weightKg, setWeightKg] = useState<number>(350);
  const [volumeM3, setVolumeM3] = useState<number>(2.0);
  const [cargoNature, setCargoNature] = useState<CargoNature>('standard');
  const [transportFilter, setTransportFilter] = useState<TransportFilter>('all');
  const [sortBy, setSortBy] = useState<'cheap' | 'fast' | 'popular'>('cheap');

  // Loading animation state (Aviasales-style)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [loadingStepText, setLoadingStepText] = useState<string>('');

  // Selected tariff for booking
  const [selectedTariff, setSelectedTariff] = useState<any | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingClientName, setBookingClientName] = useState<string>('');
  const [bookingClientPhone, setBookingClientPhone] = useState<string>('');
  const [bookingComment, setBookingComment] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingOrderNumber, setBookingOrderNumber] = useState<string>('');

  const usdToRubRate = 92.5;

  const originCity = useMemo(() => ORIGIN_CITIES.find(c => c.code === originCode) || ORIGIN_CITIES[0], [originCode]);
  const destinationCity = useMemo(() => DESTINATION_CITIES.find(c => c.code === destinationCode) || DESTINATION_CITIES[0], [destinationCode]);

  // Density calculation
  const density = useMemo(() => {
    if (!volumeM3 || volumeM3 <= 0) return 0;
    return Math.round(weightKg / volumeM3);
  }, [weightKg, volumeM3]);

  const densityLabel = useMemo(() => {
    if (density >= 300) return { text: 'Тяжелый / Плотный груз (выгодный тариф за вес)', color: 'text-emerald-700 bg-emerald-100' };
    if (density >= 160) return { text: 'Стандартная плотность (оптимальный баланс)', color: 'text-blue-700 bg-blue-100' };
    return { text: 'Объемный / Легкий груз (расчет по объему м³)', color: 'text-amber-800 bg-amber-100' };
  }, [density]);

  // Trigger loading animation whenever search is initiated
  const handleTriggerSearch = () => {
    setIsLoading(true);
    setLoadingProgress(0);
    trackEvent('online_tariff_search', {
      origin: originCode,
      destination: destinationCode,
      weight: weightKg,
      volume: volumeM3,
      cargoNature,
      transportFilter
    });

    const steps = [
      { pct: 15, text: 'Подключение к терминалам Express Today в Гуанчжоу, Иу, Шанхае и Шэньчжэне...' },
      { pct: 42, text: 'Сверка свободных слотов контейнеров COC и регулярных автоколонн Хоргос / Забайкальск...' },
      { pct: 74, text: 'Расчет плотности W/M партии и тарификация по собственным прямым линиям...' },
      { pct: 92, text: 'Проверка станционных сборов Ворсино, Белый Раст, Шушары и портов ДВ / СПб...' },
      { pct: 100, text: 'Тарифы обновлены: сортировка от самых выгодных цен!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLoadingProgress(steps[currentStep].pct);
        setLoadingStepText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
      }
    }, 280);
  };

  // Initial trigger on mount
  useEffect(() => {
    handleTriggerSearch();
  }, []);

  // Calculate calculated tariffs
  const calculatedTariffs = useMemo(() => {
    const isFullContainer20 = (volumeM3 >= 28 && volumeM3 <= 38) || (weightKg >= 10000 && weightKg <= 18000 && volumeM3 <= 38);
    const isFullContainer40 = volumeM3 > 38 || weightKg > 18000;

    return TARIFF_TEMPLATES.map(t => {
      // Base calculation
      let kgRate = t.baseKgRate;
      let m3Rate = t.baseM3Rate;

      // Dynamic Air Cargo rate based on weight tier per report:
      // > 70 kg: $3.60–$4.30/kg (avg $3.95)
      // <= 70 kg: $5.50–$7.80/kg (avg $6.50)
      if (t.transportType === 'air') {
        if (weightKg >= 70) {
          kgRate = 3.95;
        } else {
          kgRate = 6.20;
        }
      }

      // Origin regional adjustments per report:
      // Direct rail from Guangzhou/Shenzhen is ~$9,400 vs Shanghai/Ningbo ~$9,000 (+400)
      // FTL Eurotruck from Guangzhou/Shenzhen is ~$14,800 vs Shanghai/Ningbo ~$14,500 (+300)
      let originAdjustmentUsd = 0;
      if (originCode === 'CAN' || originCode === 'SZX' || originCode === 'FOS') {
        if (t.id === 'direct-rail-container') {
          originAdjustmentUsd = 400;
          kgRate += 0.08;
        } else if (t.id === 'express-auto-fast' || t.id === 'standard-auto-optimal') {
          originAdjustmentUsd = 300;
        }
      }

      // Adjust for destination (e.g. SPb, Novosibirsk, Vladivostok, etc.)
      if (destinationCode === 'LED') {
        if (t.id === 'deep-sea-spb-novoross') {
          kgRate -= 0.05;
        } else {
          kgRate += 0.10;
          m3Rate += 10;
        }
      } else if (destinationCode === 'OVB') {
        kgRate -= 0.10;
        m3Rate -= 10;
      } else if (destinationCode === 'SVX') {
        kgRate += 0.05;
        m3Rate += 8;
      } else if (destinationCode === 'VVO') {
        if (t.transportType === 'sea') {
          kgRate -= 0.30;
          m3Rate -= 30;
        } else {
          kgRate += 0.20;
        }
      }

      // Fragile extra
      let packagingExtraUsd = 0;
      if (cargoNature === 'fragile') {
        packagingExtraUsd = Math.round(volumeM3 * 22); // $22 per m3 for heavy wooden crate + pallets
      } else if (cargoNature === 'battery') {
        kgRate += 0.45; // DG surcharge for battery cargo
      }

      // Weight volume pricing rule vs Full Container pricing
      let totalFreightUsd = 0;

      if (isFullContainer40 && t.container40ftRate > 0) {
        // Full 40ft HQ container / FTL
        totalFreightUsd = t.container40ftRate + originAdjustmentUsd;
      } else if (isFullContainer20 && t.container20ftRate > 0) {
        // Full 20ft container
        totalFreightUsd = t.container20ftRate;
      } else {
        // Standard LCL (Chargeable weight / volume)
        if (density >= 180 || t.transportType === 'air') {
          // Charged by weight
          totalFreightUsd = weightKg * kgRate;
        } else {
          // Charged by volume (m3)
          totalFreightUsd = volumeM3 * m3Rate;
        }
      }

      // Add packaging and insurance
      const insuranceUsd = totalFreightUsd * (t.insurancePct / 100);
      const grandTotalUsd = Math.round(totalFreightUsd + packagingExtraUsd + insuranceUsd);
      const grandTotalRub = Math.round(grandTotalUsd * usdToRubRate);

      const effectiveKgRate = (grandTotalUsd / (weightKg || 1)).toFixed(2);
      const effectiveM3Rate = (grandTotalUsd / (volumeM3 || 1)).toFixed(1);

      return {
        ...t,
        calculatedTotalUsd: grandTotalUsd,
        calculatedTotalRub: grandTotalRub,
        effectiveKgRate,
        effectiveM3Rate,
        packagingExtraUsd,
        insuranceUsd: Math.round(insuranceUsd),
        routeTitle: `${originCity.name} (${originCity.code}) → ${destinationCity.name} (${destinationCity.code})`
      };
    });
  }, [originCity, destinationCity, weightKg, volumeM3, cargoNature, destinationCode, originCode, density]);

  // Filtered and sorted tariffs
  const filteredTariffs = useMemo(() => {
    let list = calculatedTariffs;

    if (transportFilter !== 'all') {
      list = list.filter(t => t.transportType === transportFilter);
    }

    if (sortBy === 'fast') {
      list = [...list].sort((a, b) => a.transitMinDays - b.transitMinDays);
    } else if (sortBy === 'cheap') {
      list = [...list].sort((a, b) => a.calculatedTotalUsd - b.calculatedTotalUsd);
    }

    return list;
  }, [calculatedTariffs, transportFilter, sortBy]);

  // Open booking modal
  const handleOpenBooking = (tariff: any) => {
    setSelectedTariff(tariff);
    setBookingSuccess(false);
    setBookingModalOpen(true);
    trackEvent('online_tariff_booking_opened', { tariffId: tariff.id, totalUsd: tariff.calculatedTotalUsd });
  };

  // Submit booking
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingClientName.trim() || !bookingClientPhone.trim()) return;

    const orderNum = `ET-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingOrderNumber(orderNum);
    setBookingSuccess(true);

    trackEvent('online_tariff_booking_submitted', {
      orderNumber: orderNum,
      tariffId: selectedTariff?.id,
      tariffName: selectedTariff?.name,
      name: bookingClientName,
      phone: bookingClientPhone,
      weight: weightKg,
      volume: volumeM3,
      totalUsd: selectedTariff?.calculatedTotalUsd
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-100/60 pb-20 overflow-x-hidden">
      
      {/* =========================================================================
          HERO & AVIASALES-STYLE SEARCH CONSOLE
          ========================================================================= */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-8 pb-14 px-4 border-b border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          
          {/* Header Title */}
          <div className="space-y-3 text-center max-w-3xl mx-auto px-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase tracking-wider text-center max-w-full">
              <Sparkles className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span className="truncate">Онлайн-поисковик логистических тарифов Express Today</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Поиск тарифов на доставку Китай&nbsp;→&nbsp;Россия
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Сравнивайте котировки Авто, Авиа, ЖД и Море в реальном времени с точным пересчетом за кг, м³ и контейнер.
            </p>
          </div>

          {/* Aviasales-style Search Console Box */}
          <div className="bg-white text-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200/80 space-y-5">
            
            {/* Top row: Transport Filter Tabs (ВСЕ / Авто / Авиа / ЖД / Море) - Variant B without native scrollbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {[
                  { id: 'all', label: 'Все маршруты', icon: Compass },
                  { id: 'auto', label: '🚛 Авто (13–28 дн)', icon: Truck },
                  { id: 'air', label: '✈️ Авиа (2–9 дн)', icon: Plane },
                  { id: 'rail', label: '🚆 ЖД Поезд (16–35 дн)', icon: Train },
                  { id: 'sea', label: '🚢 Море / ДВ / СПб / Юг (32–60 дн)', icon: Ship },
                ].map(tab => {
                  const isActive = transportFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setTransportFilter(tab.id as TransportFilter);
                        handleTriggerSearch();
                      }}
                      className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Прямые линии и актуальные тарифные сетки Express Today 2026</span>
              </div>
            </div>

            {/* Main Search Inputs: Row 1 - Route (Origin / Destination) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Origin City (China) */}
              <div className="space-y-1.5 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    <span>Откуда (Китай)</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">Склад отправления</span>
                </label>
                <div className="relative">
                  <select
                    value={originCode}
                    onChange={e => {
                      setOriginCode(e.target.value);
                      handleTriggerSearch();
                    }}
                    title={`${originCity.name} (${originCity.code})`}
                    className="w-full h-12 bg-slate-50 hover:bg-slate-100 font-bold text-slate-900 text-sm sm:text-base px-3.5 pr-8 rounded-2xl border border-slate-300 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer appearance-none transition-all truncate"
                  >
                    {ORIGIN_CITIES.map(c => (
                      <option key={c.code} value={c.code}>
                        🇨🇳 {c.name} ({c.code}) — {c.region}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none font-bold">
                    ▼
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate px-1 flex items-center gap-1" title={originCity.hub}>
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{originCity.hub}</span>
                </p>
              </div>

              {/* Destination City (Russia) */}
              <div className="space-y-1.5 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Куда (Россия)</span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">Город получения</span>
                </label>
                <div className="relative">
                  <select
                    value={destinationCode}
                    onChange={e => {
                      setDestinationCode(e.target.value);
                      handleTriggerSearch();
                    }}
                    title={`${destinationCity.name} (${destinationCity.code})`}
                    className="w-full h-12 bg-slate-50 hover:bg-slate-100 font-bold text-slate-900 text-sm sm:text-base px-3.5 pr-8 rounded-2xl border border-slate-300 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 cursor-pointer appearance-none transition-all truncate"
                  >
                    {DESTINATION_CITIES.map(c => (
                      <option key={c.code} value={c.code}>
                        🇷🇺 {c.name} ({c.code}) — {c.region}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none font-bold">
                    ▼
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate px-1 flex items-center gap-1" title={destinationCity.hub}>
                  <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{destinationCity.hub}</span>
                </p>
              </div>

            </div>

            {/* Main Search Inputs: Row 2 - Cargo Parameters (Weight & Volume) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-1">
              
              {/* Weight */}
              <div className="space-y-1.5 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-orange-500" />
                    <span>Вес груза</span>
                  </span>
                  <span className="text-orange-600 font-extrabold whitespace-nowrap">{weightKg.toLocaleString('ru-RU')}&nbsp;кг</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={weightKg}
                    onChange={e => setWeightKg(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full h-12 bg-slate-50 font-bold text-slate-900 text-sm sm:text-base px-3.5 pr-12 rounded-2xl border border-slate-300 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold whitespace-nowrap select-none bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                    кг
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate px-1">
                  Фактический вес партии (по брутто / упаковочному листу)
                </p>
              </div>

              {/* Volume */}
              <div className="space-y-1.5 min-w-0">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-blue-500" />
                    <span>Объем партии</span>
                  </span>
                  <span className="text-blue-600 font-extrabold whitespace-nowrap">{volumeM3}&nbsp;м³</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={volumeM3}
                    onChange={e => setVolumeM3(Math.max(0.1, Number(e.target.value) || 0.1))}
                    className="w-full h-12 bg-slate-50 font-bold text-slate-900 text-sm sm:text-base px-3.5 pr-12 rounded-2xl border border-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold whitespace-nowrap select-none bg-slate-100 px-1.5 py-0.5 rounded-md border border-slate-200">
                    м³
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate px-1">
                  Габаритный объем коробки / паллет (Д × Ш × В, м³)
                </p>
              </div>

            </div>

            {/* Quick Weight & Volume Presets Bar + Nature Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
              
              {/* Presets */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs text-slate-500 font-semibold mr-1 whitespace-nowrap">Быстрый выбор:</span>
                {[
                  { label: '50\u00A0кг (LTL)', w: 50, v: 0.3 },
                  { label: '300\u00A0кг (LCL)', w: 300, v: 1.5 },
                  { label: '1\u00A0000\u00A0кг (Партия)', w: 1000, v: 5.0 },
                  { label: '20ft Контейнер (33\u00A0м³)', w: 12000, v: 33.0 },
                  { label: '40ft HQ (68\u00A0м³)', w: 22000, v: 68.0 },
                  { label: 'Еврофура FTL (86\u00A0м³)', w: 20000, v: 86.0 },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setWeightKg(p.w);
                      setVolumeM3(p.v);
                      handleTriggerSearch();
                    }}
                    className="whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Cargo Nature Radio */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
                <span className="text-xs text-slate-500 font-semibold mr-1 whitespace-nowrap">Характер груза:</span>
                <div className="inline-flex flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs gap-1">
                  <button
                    onClick={() => { setCargoNature('standard'); handleTriggerSearch(); }}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      cargoNature === 'standard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📦 Не хрупкий
                  </button>
                  <button
                    onClick={() => { setCargoNature('fragile'); handleTriggerSearch(); }}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      cargoNature === 'fragile' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ⚠️ Хрупкий (+обрешетка)
                  </button>
                  <button
                    onClick={() => { setCargoNature('battery'); handleTriggerSearch(); }}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      cargoNature === 'battery' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🔋 С батареями
                  </button>
                </div>
              </div>

            </div>

            {/* Density & Search CTA Button Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex-1 min-w-0">
                <div className={`px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm ${densityLabel.color} leading-relaxed break-words`}>
                  Плотность: {density}&nbsp;кг/м³ — {densityLabel.text}
                </div>
              </div>

              <button
                onClick={handleTriggerSearch}
                className="w-full sm:w-auto shrink-0 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm sm:text-base shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 whitespace-nowrap"
              >
                <Search className="w-5 h-5 shrink-0" />
                <span>Найти тарифы на сегодня ⚡</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          AVIASALES-STYLE SMOOTH LOADING PROGRESS BAR
          ========================================================================= */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl border border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold flex items-center gap-2 text-orange-400">
                <Zap className="w-4 h-4 animate-bounce" />
                <span>Поиск рейсов и тарифов: {originCity.name} → {destinationCity.name}</span>
              </span>
              <span className="font-mono font-bold text-slate-300">{loadingProgress}%</span>
            </div>

            {/* Animated Progress Track */}
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 truncate">{loadingStepText}</p>
          </div>
        </div>
      )}

      {/* =========================================================================
          SEARCH RESULTS & TARIFF TICKETS (AVIASALES STYLE)
          ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-6">
        
        {/* Results Bar (Count, Sortings, Route Pill) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Результаты поиска</div>
            <h2 className="text-base sm:text-lg font-black text-slate-950 flex items-center gap-2">
              <span>{originCity.name} 🇨🇳</span>
              <span className="text-orange-600">→</span>
              <span>{destinationCity.name} 🇷🇺</span>
              <span className="text-xs font-normal text-slate-500">({weightKg} кг / {volumeM3} м³)</span>
            </h2>
          </div>

          {/* Sorting buttons */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className="text-slate-400 mr-1 hidden sm:inline">Сортировка:</span>
            {[
              { id: 'cheap', label: '💰 Сначала дешевые' },
              { id: 'fast', label: '⚡ Самые быстрые' },
              { id: 'popular', label: '🔥 Популярные' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id as any)}
                className={`px-3 py-1.5 rounded-xl cursor-pointer transition-colors ${
                  sortBy === s.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shimmer state while loading */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse space-y-4">
                <div className="h-5 bg-slate-200 rounded-md w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-20 bg-slate-100 rounded-2xl" />
                  <div className="h-20 bg-slate-100 rounded-2xl" />
                  <div className="h-20 bg-slate-100 rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Actual Tariff Ticket Cards */
          <div className="space-y-4">
            {filteredTariffs.map(tariff => {
              const isFastest = tariff.transportType === 'air';
              const isCheapest = tariff.transportType === 'sea';
              const isPopular = tariff.id === 'express-auto-fast';

              return (
                <div
                  key={tariff.id}
                  className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-0.5 ${
                    isPopular
                      ? 'border-orange-400 ring-2 ring-orange-400/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Badge Banner */}
                  <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] uppercase tracking-wider ${
                        tariff.tagColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                        tariff.tagColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                        tariff.tagColor === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                        tariff.tagColor === 'purple' ? 'bg-purple-100 text-purple-800' :
                        tariff.tagColor === 'cyan' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tariff.tag}
                      </span>
                      <span className="font-semibold text-slate-600">{tariff.carrierBadge}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {tariff.departureSchedule}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Body: 3-column Grid (Route Timeline, Highlights & Breakdown, Price & Book) */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: Route Timeline & Transit (4 cols) */}
                    <div className="lg:col-span-4 space-y-4">
                      
                      {/* Transport Badge */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                          {tariff.transportType === 'auto' && <Truck className="w-6 h-6 text-orange-400" />}
                          {tariff.transportType === 'air' && <Plane className="w-6 h-6 text-sky-400" />}
                          {tariff.transportType === 'rail' && <Train className="w-6 h-6 text-purple-400" />}
                          {tariff.transportType === 'sea' && <Ship className="w-6 h-6 text-amber-400" />}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-950 text-base sm:text-lg">
                            {tariff.name}
                          </h3>
                          <span className="text-xs font-bold text-orange-600">
                            Срок: {tariff.transitMinDays}–{tariff.transitMaxDays} дней в пути
                          </span>
                        </div>
                      </div>

                      {/* Visual Timeline Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>{originCity.name} ({originCity.code})</span>
                          <span className="text-[11px] font-normal text-slate-500">через {tariff.transitBorder}</span>
                          <span>{destinationCity.name} ({destinationCity.code})</span>
                        </div>

                        {/* Dot-line track */}
                        <div className="relative flex items-center justify-between">
                          <div className="w-3 h-3 rounded-full bg-slate-900 shrink-0 z-10" />
                          <div className="flex-1 h-0.5 bg-slate-300 mx-1 border-t border-dashed border-slate-400" />
                          <div className="w-3 h-3 rounded-full bg-orange-600 shrink-0 z-10" />
                        </div>
                      </div>

                      {/* Source attribution tag */}
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{tariff.benchmarkSource}</span>
                      </div>

                    </div>

                    {/* Middle: Features & Unit Breakdown (4 cols) */}
                    <div className="lg:col-span-4 space-y-3 lg:border-l lg:border-r border-slate-100 lg:px-4">
                      
                      {/* Rates per unit breakdown */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80 text-center">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">За 1 кг</span>
                          <span className="text-sm font-black text-slate-900">${tariff.effectiveKgRate} / кг</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">За 1 м³</span>
                          <span className="text-sm font-black text-slate-900">${tariff.effectiveM3Rate} / м³</span>
                        </div>
                      </div>

                      {/* Container rate hints if FCL options available */}
                      <div className="space-y-1">
                        {tariff.container20ftRate > 0 && (
                          <div className="text-[11px] text-slate-700 bg-slate-100/80 px-2.5 py-1.5 rounded-xl border border-slate-200 flex items-center justify-between">
                            <span className="font-semibold">Контейнер 20’GP:</span>
                            <span className="font-black text-slate-900">${tariff.container20ftRate.toLocaleString()}</span>
                          </div>
                        )}
                        {tariff.container40ftRate > 0 && (
                          <div className="text-[11px] text-slate-700 bg-orange-50/70 px-2.5 py-1.5 rounded-xl border border-orange-200/60 flex items-center justify-between">
                            <span className="font-semibold">
                              {tariff.transportType === 'auto' ? 'Еврофура FTL (86 м³):' : "Контейнер 40'HQ COC:"}
                            </span>
                            <span className="font-black text-orange-800">${tariff.container40ftRate.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Highlights checklist */}
                      <ul className="space-y-1 text-xs text-slate-600">
                        {tariff.highlights.slice(0, 2).map((h: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      {cargoNature === 'fragile' && (
                        <div className="text-[11px] font-bold text-amber-700 bg-amber-50 p-1.5 rounded-lg flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>Включена усиленная обрешетка (+${tariff.packagingExtraUsd})</span>
                        </div>
                      )}
                    </div>

                    {/* Right: Total Price & Booking CTA (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end space-y-3">
                      
                      <div className="text-left lg:text-right space-y-0.5">
                        <span className="text-xs text-slate-500 font-medium block">
                          Итого за партию ({weightKg} кг):
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                          ${tariff.calculatedTotalUsd.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-slate-600">
                          ≈ {tariff.calculatedTotalRub.toLocaleString()} ₽
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleOpenBooking(tariff)}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                      >
                        <span>Выбрать тариф</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <span className="text-[11px] text-slate-400 text-center lg:text-right w-full block">
                        Без скрытых комиссий • Страховка включена
                      </span>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =========================================================================
            MARKET BENCHMARK DATA REPORT SECTION (2026 DATA SYNC)
            ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                <FileCheck className="w-3.5 h-3.5 text-orange-600" />
                Официальный срез рынка грузоперевозок 2026
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                Рыночные индикаторы и структура ставок Китай → Россия
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
              Источники: ChinaLogist, РЖД-Партнер, FESCO, RTSB-РУС, HUB Shipping
            </span>
          </div>

          {/* Benchmark Table Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] border-b border-slate-200">
                  <th className="py-3 px-3">Направление / Схема</th>
                  <th className="py-3 px-3">Тип оборудования</th>
                  <th className="py-3 px-3">Рыночная ставка (USD)</th>
                  <th className="py-3 px-3">Срок транзита</th>
                  <th className="py-3 px-3">База и операторы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold">Море → Дальний Восток → ж/д Москва</td>
                  <td className="py-3 px-3 text-slate-600">20’GP / 40’HQ (COC)</td>
                  <td className="py-3 px-3 font-black text-slate-950">
                    <span className="text-orange-700">$5 100</span> (20’) / <span className="text-orange-700">$8 000–$8 300</span> (40’)
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">40–50 дней</td>
                  <td className="py-3 px-3 text-xs text-slate-500">FOB; FESCO, ВМТП, ВСК (вкл. ~$2 200 COC)</td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold">Прямой ЖД поезд (CR Express)</td>
                  <td className="py-3 px-3 text-slate-600">40’HQ Контейнер</td>
                  <td className="py-3 px-3 font-black text-slate-950">
                    <span className="text-purple-700">$9 000–$9 400</span> (40’HQ)
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">25–35 дней</td>
                  <td className="py-3 px-3 text-xs text-slate-500">FOB; Сиань, Сучжоу, Иу → Ворсино/Белый Раст</td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold">Автотранспорт еврофура FTL</td>
                  <td className="py-3 px-3 text-slate-600">Тент 86–92 м³ (до 20 т)</td>
                  <td className="py-3 px-3 font-black text-slate-950">
                    <span className="text-emerald-700">$14 500–$14 800</span> (FTL)
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">18–28 дней</td>
                  <td className="py-3 px-3 text-xs text-slate-500">Забайкальск / Хоргос → Москва, СПб</td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold">Авиадоставка Карго</td>
                  <td className="py-3 px-3 text-slate-600">Сборная партия</td>
                  <td className="py-3 px-3 font-black text-slate-950">
                    <span className="text-blue-700">$3.60–$4.30/кг</span> (&gt;70 кг) / <span className="text-blue-700">$5.50–$7.80</span> (&lt;70 кг)
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">3–5 дней</td>
                  <td className="py-3 px-3 text-xs text-slate-500">CAN, SZX, SHA → SVO, DME Карго</td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold">Сборный груз ЖД (LCL)</td>
                  <td className="py-3 px-3 text-slate-600">От 0.5 м³ / короба</td>
                  <td className="py-3 px-3 font-black text-slate-950">
                    <span className="text-slate-900">$155–$165 / м³</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">25–35 дней</td>
                  <td className="py-3 px-3 text-xs text-slate-500">RTSB-РУС; Сиань/Сучжоу → Ворсино, Колядичи</td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold">Сборный груз Море (LCL)</td>
                  <td className="py-3 px-3 text-slate-600">От 0.1 м³</td>
                  <td className="py-3 px-3 font-black text-slate-950">
                    <span className="text-slate-900">$85–$95 / м³</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">40–50 дней</td>
                  <td className="py-3 px-3 text-xs text-slate-500">Шанхай, Нинбо, Гуанчжоу → Москва/СПб</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 4 Practical Key Context Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Boxes className="w-4 h-4 text-orange-600" />
                <span>Оборудование COC (~$2 200)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                В сквозные ставки 40’HQ уже включена стоимость предоставления и репозиционирования контейнера перевозчика в Китай.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                <span>Ожидание на границе</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Перегрузка через Хоргос занимает 5–7 дней, через Забайкальск очередь может достигать 10–14 дней в пиковые сезоны.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Таможенные сборы РФ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                С 01.01.2026 шкала сборов за таможенное оформление составляет от 1 231 ₽ (до 200 тыс. ₽) до 73 860 ₽ (свыше 10 млн ₽).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>База сравнения RFQ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Наши онлайн-тарифы показывают сквозную ставку до склада/терминала РФ без скрытых доплат за выдачу документов и хранение.
              </p>
            </div>

          </div>
        </div>

        {/* Informational Guidance Box */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Нужна официальная «белая» схема с ДТ и УПД с НДС 20%?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Express Today оформляет прямой внешнеторговый контракт, сертификаты ЕАЭС, маркировку «Честный Знак» и растаможку на ваше юрлицо.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Свяжитесь с ведущим таможенным брокером для подготовки контракта ВЭД
            </span>
            <button
              onClick={() => onOpenLeadModal?.('Заявка на Белую схему ВЭД из поисковика тарифов')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              Запросить ВЭД-аудит под ключ →
            </button>
          </div>
        </div>

      </main>

      {/* =========================================================================
          BOOKING MODAL (REQUEST NAME & PHONE)
          ========================================================================= */}
      {bookingModalOpen && selectedTariff && (
        <div
          className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150 cursor-pointer"
          onClick={() => setBookingModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto cursor-default space-y-6"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              /* Success confirmation ticket */
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Бронь зафиксирована: #{bookingOrderNumber}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                    Тариф успешно забронирован!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                    Спасибо, <strong>{bookingClientName}</strong>! Логист Express Today свяжется с вами по номеру <strong>{bookingClientPhone}</strong> в течение 10 минут.
                  </p>
                </div>

                {/* Summary ticket */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Тариф:</span>
                    <span className="font-bold text-slate-900">{selectedTariff.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Маршрут:</span>
                    <span className="font-bold text-slate-900">{originCity.name} → {destinationCity.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Параметры:</span>
                    <span className="font-bold text-slate-900">{weightKg} кг / {volumeM3} м³</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm">
                    <span className="font-bold text-slate-700">Ориентир ставки:</span>
                    <span className="font-black text-orange-600">${selectedTariff.calculatedTotalUsd} (≈ {selectedTariff.calculatedTotalRub.toLocaleString()} ₽)</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={siteConfig.social.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Написать в WhatsApp для ускорения</span>
                  </a>
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                  >
                    Вернуться к поиску тарифов
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form: Prompts for Name and Phone */
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" />
                    Бронирование онлайн-тарифа
                  </div>
                  <h3 className="text-xl font-black text-slate-950">
                    {selectedTariff.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {originCity.name} → {destinationCity.name} • {weightKg} кг / {volumeM3} м³ • Срок: {selectedTariff.transitMinDays}–{selectedTariff.transitMaxDays} дн.
                  </p>
                </div>

                {/* Price summary badge */}
                <div className="p-3.5 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Расчетная стоимость:</span>
                  <span className="text-base font-black text-orange-700">
                    ${selectedTariff.calculatedTotalUsd} (≈ {selectedTariff.calculatedTotalRub.toLocaleString()} ₽)
                  </span>
                </div>

                {/* Client Name Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Ваше Имя *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Например: Александр"
                    value={bookingClientName}
                    onChange={e => setBookingClientName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-orange-500 text-sm font-medium text-slate-900"
                  />
                </div>

                {/* Client Phone Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Номер телефона (WhatsApp / Telegram) *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (999) 000-00-00"
                    value={bookingClientPhone}
                    onChange={e => setBookingClientPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-orange-500 text-sm font-medium text-slate-900"
                  />
                </div>

                {/* Comment / Link */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>Ссылка на товар или комментарий (необязательно)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ссылка на 1688 / Taobao или описание груза"
                    value={bookingComment}
                    onChange={e => setBookingComment(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-orange-500 text-sm font-medium text-slate-900"
                  />
                </div>

                <div className="text-[11px] text-slate-500 leading-relaxed">
                  Нажимая кнопку, вы подтверждаете бронирование тарифа и соглашаетесь с условиями обработки персональных данных.
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Забронировать тариф и зафиксировать цену</span>
                </button>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

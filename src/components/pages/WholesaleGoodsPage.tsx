import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Boxes,
  Building2,
  Calculator,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileCheck2,
  FileText,
  Globe2,
  Handshake,
  LayoutDashboard,
  Phone,
  Plane,
  Scale,
  Search,
  ShieldCheck,
  Ship,
  ShoppingBag,
  Store,
  Train,
  Truck,
  UserPlus,
  Users,
  Warehouse,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';
import { IndividualDeliveryCalculation } from '../home/IndividualDeliveryCalculation';
import { withTrackingParams } from '../../utils/urlParams';
import { trackEvent } from '../../utils/analytics';

interface WholesaleGoodsPageProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const CABINET_REGISTRATION_URL = 'https://my.express-today.ru/registration';
const FORM_ID = 'tovary-optom-lead-form';
const DEFAULT_REQUEST = 'Заявка: Товары из Китая оптом';

/* ───────────────────────── Сегменты ───────────────────────── */

interface Segment {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  who: string;
  pains: string[];
  offer: string[];
  cta: string;
  requestType: string;
  link?: { label: string; route: string };
}

const SEGMENTS: Segment[] = [
  {
    id: 'sellers',
    icon: ShoppingBag,
    title: 'Селлеры маркетплейсов',
    who: 'Wildberries, Ozon, Яндекс Маркет',
    pains: [
      'Нужна тестовая партия, а фабрика ставит высокий минимум',
      'Товар требует маркировки «Честный ЗНАК» и документов',
      'Партию надо довезти сразу на склад маркетплейса',
    ],
    offer: [
      'Подбираем фабрику с подходящим минимальным заказом, консолидируем несколько SKU в одну поставку',
      'Оформляем декларацию соответствия или отказное письмо, заказываем и наносим коды ЧЗ',
      'Доставляем до склада WB/Ozon или на фулфилмент с готовыми УПД и документами',
    ],
    cta: 'Рассчитать партию для маркетплейса',
    requestType: 'Заявка: Опт — селлер маркетплейса',
    link: { label: 'Доставка для маркетплейсов', route: '/dostavka-tovarov-iz-kitaia-dlia-marketpleisov' },
  },
  {
    id: 'retail',
    icon: Store,
    title: 'Розница и интернет-магазины',
    who: 'магазины, сети, шоурумы, D2C-бренды',
    pains: [
      'Ассортимент собирается у 5–10 поставщиков, у каждого свои условия',
      'Страшно получить брак или не то, что на фото',
      'Нужны закрывающие документы для бухгалтерии',
    ],
    offer: [
      'Собираем заказ у нескольких фабрик и объединяем на складе в Китае в одну партию',
      'Проверяем товар до отправки: пересчёт, сверка с образцом, фотоотчёт в личном кабинете',
      'Передаём товар по договору поставки с УПД и НДС 20% — как от российского поставщика',
    ],
    cta: 'Собрать ассортиментную партию',
    requestType: 'Заявка: Опт — розница и интернет-магазин',
    link: { label: 'Консолидация в Китае', route: '/konsolidaciya-tovara-v-kitaye' },
  },
  {
    id: 'wholesale',
    icon: Building2,
    title: 'Оптовики и дистрибьюторы',
    who: 'регулярные поставки от паллеты до контейнера',
    pains: [
      'Нужен прозрачный расчёт до себестоимости единицы, а не «ставка за кг»',
      'Важно работать по контракту, с ДТ и входящим НДС',
      'Объёмы растут — нужны контейнеры и стабильный график',
    ],
    offer: [
      'Считаем поставку целиком: инвойс, логистика, пошлина, НДС, документы, себестоимость за штуку',
      'Две схемы на выбор: договор поставки через наше юрлицо или ТЭУ с ввозом на ваш контракт',
      'Авто, ЖД и морские контейнеры 20/40 футов, сборные и полные партии',
    ],
    cta: 'Запросить расчёт регулярных поставок',
    requestType: 'Заявка: Опт — дистрибьютор / регулярные поставки',
    link: { label: 'Белая доставка с документами', route: '/belaya-dostavka' },
  },
  {
    id: 'corporate',
    icon: Factory,
    title: 'Производства и корпоративные закупки',
    who: 'оборудование, комплектующие, сырьё, закупка для филиалов и объединённых заказов',
    pains: [
      'Нестандартный товар: нужен код ТН ВЭД, сертификация и контроль перед отгрузкой',
      'Несколько получателей или подразделений — хочется один договор и одну поставку',
      'Закупка идёт по бюджету, нужна предсказуемая смета',
    ],
    offer: [
      'Подбираем код ТН ВЭД, оформляем разрешительные документы (ДС, сертификаты, СГР)',
      'Групповые и корпоративные заказы ведём единым контрактом с разбивкой по получателям',
      'Фиксируем смету в коммерческом предложении до старта и отчитываемся по каждой статье',
    ],
    cta: 'Обсудить корпоративную закупку',
    requestType: 'Заявка: Опт — производство / корпоративная закупка',
    link: { label: 'Поиск производства в Китае', route: '/poisk-proizvodstva-tovarov-v-kitae-optom' },
  },
];

/* ───────────────────────── Категории ───────────────────────── */

type DocTag = 'ДС' | 'Сертификат' | 'СГР' | 'Отказное' | 'ЧЗ' | 'Нотификация';

const TAG_STYLES: Record<DocTag, string> = {
  'ДС': 'bg-sky-50 text-sky-700 border-sky-200',
  'Сертификат': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'СГР': 'bg-rose-50 text-rose-700 border-rose-200',
  'Отказное': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'ЧЗ': 'bg-amber-50 text-amber-700 border-amber-200',
  'Нотификация': 'bg-violet-50 text-violet-700 border-violet-200',
};

interface Category {
  title: string;
  examples: string;
  why: string;
  docs: DocTag[];
  note: string;
}

const CATEGORIES: Category[] = [
  {
    title: 'Электроника и аксессуары',
    examples: 'чехлы, кабели, зарядки, наушники, гаджеты для дома',
    why: 'Самая высокая оборачиваемость на маркетплейсах, низкая цена входа у фабрик Шэньчжэня и Иу.',
    docs: ['ДС', 'Нотификация'],
    note: 'Для устройств с Wi-Fi/Bluetooth нужна нотификация ФСБ — проверяем до закупки.',
  },
  {
    title: 'Одежда, обувь, текстиль',
    examples: 'базовая одежда, спортивная форма, обувь, домашний текстиль',
    why: 'Широкий выбор фабрик в Гуанчжоу и Чжэцзяне, возможность брендирования и пошива под ваш лейбл.',
    docs: ['ЧЗ', 'ДС', 'Сертификат'],
    note: 'Обязательная маркировка «Честный ЗНАК»: коды заказываем и наносим на фабрике или на складе.',
  },
  {
    title: 'Товары для дома и кухни',
    examples: 'посуда, органайзеры, освещение, мелкая бытовая техника',
    why: 'Стабильный спрос круглый год, высокая маржа при закупке напрямую у производителя.',
    docs: ['ДС', 'Отказное'],
    note: 'Контактирующая с пищей посуда требует ДС; декор и органайзеры чаще идут по отказному письму.',
  },
  {
    title: 'Зоотовары',
    examples: 'лежанки, амуниция, игрушки, миски, когтеточки',
    why: 'Ниша с растущим спросом и небольшим числом сильных игроков.',
    docs: ['Отказное', 'ДС'],
    note: 'Аксессуары — по отказному письму; корма и ветпрепараты требуют отдельных разрешений.',
  },
  {
    title: 'Спорт и туризм',
    examples: 'наколенники, экипировка, тренажёры, палатки, рюкзаки',
    why: 'Лёгкий товар с хорошим соотношением цены и объёма — выгодно идёт авто и ЖД.',
    docs: ['Отказное', 'ДС'],
    note: 'Пример расчёта по спортивному инвентарю — в блоке коммерческих предложений ниже.',
  },
  {
    title: 'Автотовары и запчасти',
    examples: 'аксессуары в салон, автохимия, расходники, детали кузова',
    why: 'Крупный оптовый сегмент с регулярными повторными закупками.',
    docs: ['ДС', 'Сертификат'],
    note: 'Часть позиций попадает под ТР ТС 018 — подбираем код ТН ВЭД и форму подтверждения заранее.',
  },
  {
    title: 'Детские товары и игрушки',
    examples: 'игрушки, развивающие наборы, коляски, детская мебель',
    why: 'Высокая наценка в рознице, но строгие требования к документам.',
    docs: ['Сертификат', 'ЧЗ'],
    note: 'Игрушки сертифицируются по ТР ТС 008, часть детских товаров маркируется в ЧЗ.',
  },
  {
    title: 'Косметика и бытовая химия',
    examples: 'уход, аксессуары для красоты, средства для дома',
    why: 'Маржинальная категория при правильно оформленных документах.',
    docs: ['СГР', 'ДС', 'ЧЗ'],
    note: 'Косметика идёт по ДС или СГР (ТР ТС 009), парфюмерия — с маркировкой ЧЗ.',
  },
  {
    title: 'Оборудование и инструмент',
    examples: 'станки, упаковочные линии, электроинструмент, комплектующие',
    why: 'Прямая закупка у завода экономит до 30–50 % по сравнению с российскими дилерами.',
    docs: ['Сертификат', 'ДС'],
    note: 'ТР ТС 010/004/020: проверяем требования по коду до оплаты, при необходимости — инспекция на заводе.',
  },
];

/* ───────────────────────── Этапы ───────────────────────── */

const STEPS = [
  {
    icon: Search,
    title: 'Заявка и подбор поставщика',
    text: 'Уточняем товар, объём и бюджет. Находим фабрику или торговую компанию, проверяем юрлицо, историю и отзывы.',
    time: '1–3 дня',
  },
  {
    icon: ClipboardCheck,
    title: 'Образец и коммерческое предложение',
    text: 'При необходимости заказываем образец. Считаем поставку целиком: товар, логистика, пошлина, НДС, документы.',
    time: '2–7 дней',
  },
  {
    icon: Handshake,
    title: 'Договор и закупка',
    text: 'Подписываем договор поставки или ТЭУ, оплачиваем фабрике по инвойсу, контролируем производство.',
    time: '7–30 дней',
  },
  {
    icon: Warehouse,
    title: 'Приёмка на складе в Китае',
    text: 'Принимаем партию, пересчитываем, сверяем с образцом, фотоотчёт в ЛК. Консолидируем заказы от разных фабрик.',
    time: '2–4 дня',
  },
  {
    icon: Truck,
    title: 'Доставка и таможня',
    text: 'Авиа, авто, ЖД или море под объём и сроки. Подаём декларацию, платим пошлину и НДС, получаем выпуск.',
    time: '9–60 дней',
  },
  {
    icon: FileCheck2,
    title: 'Выдача и документы',
    text: 'Доставляем до склада, маркетплейса или ПВЗ в 65 городах. Передаём ДТ, УПД, сертификаты и инвойс.',
    time: '1–5 дней',
  },
];

/* ───────────────────────── Схемы ───────────────────────── */

const SCHEME_ROWS: Array<{ label: string; supply: string; teu: string }> = [
  {
    label: 'Кто импортёр',
    supply: 'ООО «Экспресс-тудей» — ввозим товар на себя как декларант',
    teu: 'Ваше юрлицо — вы декларант, мы экспедитор и организатор перевозки',
  },
  {
    label: 'Что вы получаете',
    supply: 'Счёт-фактура / УПД с НДС 20 %, товар как от российского поставщика',
    teu: 'Контракт, инвойс, ДТ на ваше имя, акт и счёт за экспедирование',
  },
  {
    label: 'ВЭД и валютный контроль',
    supply: 'Полностью на нашей стороне',
    teu: 'На вашей стороне, сопровождаем и консультируем',
  },
  {
    label: 'Сборные партии',
    supply: 'Да — консолидируем несколько фабрик в одну поставку',
    teu: 'Да — сборный груз от нескольких поставщиков в рамках вашего контракта',
  },
  {
    label: 'Кому подходит',
    supply: 'Селлерам, рознице, компаниям без отдела ВЭД',
    teu: 'Импортёрам с контрактом, дистрибьюторам, производствам',
  },
];

/* ───────────────────────── Инструменты ───────────────────────── */

const TOOLS = [
  {
    icon: Search,
    title: 'Поиск по 1688 из кабинета',
    text: 'Ищите товары и фабрики прямо в ЛК, добавляйте позиции в заказ и отправляйте на расчёт.',
  },
  {
    icon: Camera,
    title: 'Статусы и фотоотчёты',
    text: 'Каждый этап поставки отображается в кабинете: приёмка, проверка, отгрузка, таможня, выдача.',
  },
  {
    icon: FileText,
    title: 'Документы по поставке',
    text: 'ДТ, УПД, инвойсы, пакинг-листы и сертификаты хранятся в карточке заказа.',
  },
  {
    icon: Calculator,
    title: 'Тарифы и ТН ВЭД онлайн',
    text: 'Предварительная ставка доставки и подбор кода ТН ВЭД с расчётом пошлины — без менеджера.',
  },
];

/* ───────────────────────── Почему мы ───────────────────────── */

const USP = [
  {
    icon: ShieldCheck,
    title: 'Собственный отдел ВЭД',
    text: 'Контракт, валютный платёж, декларация, пошлины и НДС — внутри компании, без субподрядчиков.',
  },
  {
    icon: Warehouse,
    title: 'Склад и команда в Китае',
    text: 'Приёмка, пересчёт, проверка качества и консолидация в Гуанчжоу, переговоры с фабриками на китайском.',
  },
  {
    icon: Scale,
    title: 'Расчёт до себестоимости единицы',
    text: 'Коммерческое предложение по статьям: инвойс, логистика, таможня, документы, итог за штуку.',
  },
  {
    icon: BadgeCheck,
    title: 'Разрешительные документы',
    text: 'Декларации и сертификаты соответствия, СГР, отказные письма, коды «Честный ЗНАК».',
  },
  {
    icon: Globe2,
    title: 'Четыре канала доставки',
    text: 'Авиа от 9 дней, авто от 13, ЖД и морские контейнеры — подбираем под объём и бюджет.',
  },
  {
    icon: Users,
    title: 'Офисы в 5 городах, выдача в 65',
    text: 'Москва, Санкт-Петербург, Краснодар, Новосибирск, Хабаровск; пункты выдачи по всей России.',
  },
];

/* ───────────────────────── FAQ ───────────────────────── */

const FAQ = [
  {
    q: 'Где закупать товары оптом в Китае?',
    a: 'Основные площадки — 1688.com для опта внутри Китая и Alibaba для экспортных партий. Для крупных и нестандартных заказов выходим напрямую на фабрики: ищем производителя, проверяем юрлицо, запрашиваем образцы и договариваемся об условиях на китайском.',
  },
  {
    q: 'Какой минимальный заказ?',
    a: 'Зависит от фабрики: обычно от нескольких десятков штук на позицию или от 1 м³ на поставку. Если минимум фабрики велик, подбираем торговую компанию с гибкими объёмами или объединяем ваш заказ с другими позициями в одну консолидированную партию.',
  },
  {
    q: 'Как проверить поставщика?',
    a: 'Проверяем регистрацию и уставный капитал компании, срок работы, рейтинг и отзывы на площадке, наличие экспортной лицензии. Перед крупной партией заказываем образец и сверяем его с основной поставкой на складе.',
  },
  {
    q: 'Как оплачивается товар в Китае?',
    a: 'Вы оплачиваете в рублях по договору, мы переводим фабрике в юанях. Курс и комиссия за валютный перевод фиксируются в коммерческом предложении отдельной строкой.',
  },
  {
    q: 'Получу ли я входящий НДС?',
    a: 'Да. По договору поставки мы ввозим товар на себя и передаём вам по УПД с НДС 20 %, который принимается к вычету. По ТЭУ вы сами декларант и платите НДС при ввозе на таможне — он также идёт к вычету.',
  },
  {
    q: 'Что с маркировкой «Честный ЗНАК»?',
    a: 'Для одежды, обуви, парфюмерии, части детских товаров и других категорий маркировка обязательна. Заказываем коды в системе, передаём на фабрику или наносим на складе до отправки — товар приходит в Россию уже промаркированным.',
  },
  {
    q: 'Что если придёт брак или недостача?',
    a: 'Приёмка на складе в Китае включает пересчёт и выборочную проверку с фотоотчётом в личном кабинете. Расхождения фиксируем до отправки и решаем с фабрикой: замена, допоставка или возврат средств.',
  },
  {
    q: 'Сколько идёт оптовая партия?',
    a: 'Авиа — 9–15 дней, ускоренное авто — 13–20, обычное авто — 20–30, ЖД — 30–60 дней плюс таможенное оформление. В примерах КП ниже указаны реальные сроки под каждую поставку.',
  },
  {
    q: 'Можно ли объединить заказ нескольких компаний или филиалов?',
    a: 'Да. Групповые и корпоративные закупки ведём одним контрактом: общая поставка и таможенное оформление, а внутри — разбивка по получателям с отдельными документами и отгрузкой на нужные адреса.',
  },
];

/* ───────────────────────── Компонент ───────────────────────── */

export const WholesaleGoodsPage: React.FC<WholesaleGoodsPageProps> = ({ onNavigate, onOpenLeadModal }) => {
  const scrollToForm = () => {
    const el = document.getElementById(FORM_ID);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const go = (route: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate(route);
  };

  const trackCabinet = (source: string) => {
    trackEvent('cabinet_registration_click', { source: `tovary-optom:${source}` });
  };

  const registrationUrl = withTrackingParams(CABINET_REGISTRATION_URL);

  return (
    <div className="space-y-12 pb-4">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(100deg, rgba(2,6,23,0.9) 8%, rgba(2,6,23,0.76) 45%, rgba(2,6,23,0.42) 100%), url(/warehouse/wh02.webp)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-semibold uppercase tracking-wider text-xs sm:text-sm backdrop-blur-sm bg-orange-500/15 border-orange-400/40 text-orange-300">
            <Boxes className="w-4 h-4 text-orange-400" />
            <span>Оптовые закупки · ВЭД под ключ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl">
            Товары из Китая оптом
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            Закупка у фабрик и на 1688 / Alibaba, проверка и консолидация в Китае, белый ввоз с ДТ и УПД с НДС 20 %,
            разрешительные документы и доставка до вашего склада или маркетплейса. Для селлеров, розницы, дистрибьюторов
            и корпоративных заказчиков.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={scrollToForm}
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-900/40 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer text-sm"
            >
              Оставить заявку
            </button>
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCabinet('hero')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all cursor-pointer text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Регистрация в личном кабинете
            </a>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl pt-2">
            {[
              { icon: Factory, value: 'Фабрики · 1688 · Alibaba', label: 'прямые производители и площадки' },
              { icon: FileCheck2, value: 'ДТ + УПД с НДС 20 %', label: 'белый ввоз с документами' },
              { icon: Plane, value: 'Авиа · авто · ЖД · море', label: 'канал под объём и сроки' },
              { icon: LayoutDashboard, value: 'Личный кабинет', label: 'статусы, фотоотчёты, документы' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 flex items-start gap-3">
                <s.icon className="w-5 h-5 shrink-0 text-orange-400" />
                <div>
                  <div className="text-white font-black text-sm sm:text-base leading-tight">{s.value}</div>
                  <div className="text-slate-300 text-[11px] sm:text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* ================= СЕГМЕНТЫ ================= */}
        <section className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl p-2.5 shrink-0 bg-orange-100">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Кому подходит оптовая закупка с Express Today</h2>
              <p className="text-sm text-slate-500 mt-1">Найдите свою задачу — под каждую у нас готовый сценарий работы</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SEGMENTS.map((s) => (
              <article key={s.id} className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 flex flex-col gap-4 hover:border-orange-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl p-2.5 bg-orange-50 shrink-0">
                    <s.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">{s.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{s.who}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">Типичная задача</div>
                    <ul className="space-y-1.5">
                      {s.pains.map((p) => (
                        <li key={p} className="text-xs text-slate-600 leading-snug flex gap-2">
                          <span className="text-slate-400 shrink-0">—</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-orange-50/60 border border-orange-100 p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-orange-700 mb-2">Что делаем мы</div>
                    <ul className="space-y-1.5">
                      {s.offer.map((o) => (
                        <li key={o} className="text-xs text-slate-700 leading-snug flex gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenLeadModal(s.requestType)}
                    className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer min-h-11"
                  >
                    {s.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {s.link && (
                    <a href={s.link.route} onClick={go(s.link.route)} className="text-sm font-semibold text-orange-600 hover:underline">
                      {s.link.label}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ================= КАТЕГОРИИ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Какие товары выгодно закупать в Китае оптом</h2>
            <p className="text-sm text-slate-500">
              Категории с устойчивым спросом в России и то, какие документы потребуются для легального ввоза и продажи
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <div key={c.title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-3 hover:border-orange-300 transition-colors">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{c.examples}</p>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.why}</p>
                <div className="flex flex-wrap gap-1.5">
                  {c.docs.map((d) => (
                    <span key={d} className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${TAG_STYLES[d]}`}>{d}</span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">{c.note}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-start gap-2.5 flex-1">
              <FileCheck2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong className="text-slate-900">ДС</strong> — декларация соответствия, <strong className="text-slate-900">СГР</strong> — свидетельство о госрегистрации,{' '}
                <strong className="text-slate-900">ЧЗ</strong> — маркировка «Честный ЗНАК». Какая форма нужна именно вашему товару — определяем по коду ТН ВЭД
                на старте, до оплаты фабрике.
              </p>
            </div>
            <a href="/dokumenty-dlya-vvoza" onClick={go('/dokumenty-dlya-vvoza')} className="text-sm font-bold text-orange-600 hover:underline whitespace-nowrap">
              Документы для ввоза →
            </a>
          </div>
        </section>

        {/* ================= ЭТАПЫ ================= */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Как проходит оптовая закупка под ключ</h2>
            <p className="text-sm text-slate-500">Шесть этапов — от заявки до документов на вашем столе</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="rounded-xl p-2.5 bg-orange-50">
                    <s.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-600">{s.time}</span>
                </div>
                <div className="text-[11px] font-bold text-slate-400">Этап {i + 1}</div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">{s.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Plane className="w-4 h-4 text-sky-500" /> авиа 9–15 дней</span>
            <span className="inline-flex items-center gap-1.5"><Truck className="w-4 h-4 text-orange-500" /> авто 13–30 дней</span>
            <span className="inline-flex items-center gap-1.5"><Train className="w-4 h-4 text-emerald-500" /> ЖД 30–60 дней</span>
            <span className="inline-flex items-center gap-1.5"><Ship className="w-4 h-4 text-blue-500" /> море и контейнеры 20/40 ft</span>
            <a href="/dostavka" onClick={go('/dostavka')} className="font-semibold text-orange-600 hover:underline">Подробнее о каналах доставки →</a>
          </div>
        </section>

        {/* ================= СХЕМЫ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl p-2.5 shrink-0 bg-orange-100">
              <Handshake className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Две схемы работы — выбираете по задаче</h2>
              <p className="text-sm text-slate-500 mt-1">Обе схемы — официальный ввоз с таможенной декларацией. Разница в том, кто выступает импортёром</p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
            <table className="w-full min-w-[640px] text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 pb-3 pr-4 w-[26%]"> </th>
                  <th className="text-left pb-3 pr-4 w-[37%]">
                    <div className="rounded-2xl bg-slate-950 text-white p-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-300">Схема 1</div>
                      <div className="text-base font-black mt-1">Договор поставки</div>
                      <div className="text-xs text-slate-300 mt-1">Закупаете через наше юрлицо</div>
                    </div>
                  </th>
                  <th className="text-left pb-3 w-[37%]">
                    <div className="rounded-2xl bg-orange-50 border border-orange-200 p-4">
                      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-700">Схема 2</div>
                      <div className="text-base font-black mt-1 text-slate-900">ТЭУ — на ваше юрлицо</div>
                      <div className="text-xs text-slate-600 mt-1">Транспортно-экспедиционные услуги, в т. ч. сборные партии</div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {SCHEME_ROWS.map((r) => (
                  <tr key={r.label} className="align-top">
                    <td className="py-3 pr-4 border-t border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wide">{r.label}</td>
                    <td className="py-3 pr-4 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">{r.supply}</td>
                    <td className="py-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">{r.teu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href="/stat-importerom" onClick={go('/stat-importerom')} className="font-semibold text-orange-600 hover:underline">Стать импортёром на своё юрлицо →</a>
            <a href="/belaya-dostavka" onClick={go('/belaya-dostavka')} className="font-semibold text-orange-600 hover:underline">Белая доставка с документами →</a>
          </div>
        </section>

        {/* ================= ПРИМЕРЫ КП ================= */}
        <IndividualDeliveryCalculation onOpenLeadModal={onOpenLeadModal} />

        {/* ================= ЛИЧНЫЙ КАБИНЕТ ================= */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-300">
                <LayoutDashboard className="w-4 h-4" />
                Личный кабинет
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Вся поставка — в одном окне</h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Зарегистрируйтесь, чтобы искать товары на 1688, отправлять позиции на расчёт и следить за каждой партией
                без переписки в мессенджерах.
              </p>
            </div>
            <a
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCabinet('cabinet-block')}
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-950 hover:bg-orange-50 font-bold px-5 py-3 rounded-xl text-sm transition-colors cursor-pointer min-h-12 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              Зарегистрироваться в ЛК
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TOOLS.map((t) => (
              <div key={t.title} className="rounded-2xl bg-white/[0.07] border border-white/10 p-4 space-y-2">
                <t.icon className="w-5 h-5 text-orange-300" />
                <h3 className="font-bold text-sm">{t.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{t.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a href="/online-tariffs" onClick={go('/online-tariffs')} className="font-semibold text-orange-300 hover:underline">Найти тариф онлайн →</a>
            <a href="/tnved" className="font-semibold text-orange-300 hover:underline">Подобрать код ТН ВЭД →</a>
          </div>
        </section>

        {/* ================= ПОЧЕМУ МЫ ================= */}
        <section className="space-y-5">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Почему оптовики выбирают Express Today</h2>
            <p className="text-sm text-slate-500">Системная логистика с собственным отделом ВЭД, а не посредник «по ставке за килограмм»</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USP.map((u) => (
              <div key={u.title} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2.5 hover:border-orange-300 hover:shadow-md transition-all">
                <div className="rounded-xl p-2.5 w-fit bg-orange-50">
                  <u.icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{u.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{u.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Частые вопросы об оптовых закупках в Китае</h2>
          {FAQ.map((f) => (
            <details key={f.q} className="group bg-slate-50 border border-slate-100 rounded-2xl p-4 open:bg-white transition-colors open:border-orange-200">
              <summary className="cursor-pointer list-none font-bold text-slate-900 text-sm flex items-center justify-between gap-3">
                <span>{f.q}</span>
                <span className="text-lg leading-none group-open:rotate-45 transition-transform text-orange-600">+</span>
              </summary>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">{f.a}</p>
            </details>
          ))}
        </section>

        {/* ================= ФОРМА ================= */}
        <section id={FORM_ID} className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Рассчитайте оптовую поставку из Китая</h2>
              <p className="text-sm text-slate-500">
                Напишите, что и в каком объёме планируете закупать — подготовим коммерческое предложение по статьям до себестоимости единицы.
              </p>
            </div>
            <LeadForm initialRequestType={DEFAULT_REQUEST} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-4">
              <h3 className="font-bold text-lg">Предпочитаете кабинет?</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Зарегистрируйтесь и отправьте позиции на расчёт прямо из личного кабинета — менеджер ответит там же.
              </p>
              <a
                href={registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCabinet('form-aside')}
                className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-orange-50 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer min-h-11"
              >
                <UserPlus className="w-4 h-4" />
                Регистрация в ЛК
              </a>
              <div className="h-px bg-white/10" />
              <div className="space-y-2.5">
                <a href="tel:+78005559425" className="flex items-center gap-2.5 text-sm font-bold hover:text-orange-300 transition-colors">
                  <Phone className="w-4 h-4 text-orange-400" /> 8 (800) 555-94-25
                </a>
                <a href="https://wa.me/79282568263" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-orange-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px]">WA</span> WhatsApp
                </a>
                <a href="https://t.me/ExpressTodayHelp_bot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm font-bold hover:text-orange-300 transition-colors">
                  <span className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[9px]">TG</span> Telegram
                </a>
              </div>
            </div>
            <div className="border rounded-3xl p-5 space-y-2 bg-orange-50">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                Работаем официально
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ООО «Экспресс-тудей» · собственный отдел ВЭД · склад и команда в Гуанчжоу · полный пакет документов по каждой
                поставке: ДТ (ГТД), УПД, инвойс, пакинг-лист, разрешительные документы.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SEO-ТЕКСТ ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Оптовые закупки в Китае: с чего начать</h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Оптовые закупки в Китае выгодны за счёт низких цен производителей: электроника, одежда, товары для дома, зоотовары
            и многое другое стоят в КНР в разы дешевле. Главные площадки — 1688.com и Alibaba, где размещаются сами фабрики.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Express Today помогает найти проверенного поставщика, закупить партию, проверить качество и привезти её в Россию с полным
            пакетом документов. Подходит селлерам маркетплейсов, рознице, оптовикам и корпоративным заказчикам.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-2">Где заказывать товары оптом из Китая</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Для небольших и средних партий удобнее всего{' '}
            <a href="/vikup-1688-alibaba" onClick={go('/vikup-1688-alibaba')} className="font-semibold text-orange-600 hover:underline">закупка на 1688 и Alibaba</a>:
            там представлены тысячи фабрик с прозрачными ценами и минимальными объёмами. Для крупных и регулярных поставок выгоднее
            выходить на производителя напрямую — так вы получаете заводскую цену, возможность брендирования и контроль над
            качеством. Как отличить фабрику от перекупщика и проверить компанию, мы разобрали на странице об{' '}
            <a href="/optovye-postavshhiki-iz-kitaja" onClick={go('/optovye-postavshhiki-iz-kitaja')} className="font-semibold text-orange-600 hover:underline">оптовых поставщиках из Китая</a>.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Перед крупной закупкой закажите образец: он покажет реальное качество и поможет избежать расхождений с фото на площадке.
            Мы организуем доставку образца и основной партии одним потоком, а проверку фиксируем фотоотчётом.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-2">Из чего складывается стоимость оптовой поставки</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Цена товара на площадке — лишь часть итоговой себестоимости. К ней добавляются комиссия за валютный перевод, международная
            логистика, таможенная пошлина и НДС по коду ТН ВЭД, таможенный сбор и услуги оформления, разрешительные документы
            (декларация соответствия, сертификат, СГР или отказное письмо), маркировка «Честный ЗНАК», экологический сбор и доставка по
            России. В примерах коммерческих предложений выше видно, как накладные расходы увеличивают стоимость единицы товара на 80–140 %
            — поэтому считать поставку нужно целиком, а не по ставке за килограмм.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-2">Как организовать оптовую поставку из Китая</h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Оптовые партии консолидируем на складе в Гуанчжоу и отправляем одним потоком, чтобы снизить стоимость доставки. Канал
            выбираем под объём и сроки: авиа для срочных и лёгких партий, авто для большинства оптовых грузов, ЖД и морские контейнеры
            для крупных объёмов — подробнее на странице{' '}
            <a href="/dostavka-opt" onClick={go('/dostavka-opt')} className="font-semibold text-orange-600 hover:underline">оптовой доставки из Китая</a>.
            Ввоз оформляем официально: по договору поставки товар ввозится на наше юрлицо и передаётся вам по УПД с НДС, по договору
            ТЭУ — на ваш контракт с нашим экспедированием и сопровождением. В обоих случаях вы получаете{' '}
            <a href="/belaya-dostavka" onClick={go('/belaya-dostavka')} className="font-semibold text-orange-600 hover:underline">белую поставку</a>{' '}
            с декларацией и полным пакетом документов.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Оставьте заявку в форме выше или{' '}
            <a href="/online-tariffs" onClick={go('/online-tariffs')} className="font-semibold text-orange-600 hover:underline">найдите тариф онлайн</a>{' '}
            — расчёт и рекомендация по схеме будут готовы в течение рабочего дня.
          </p>
        </section>

        {/* ================= НАЗАД ================= */}
        <a
          href="/"
          onClick={go('/')}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition-colors cursor-pointer hover:text-orange-600"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </a>
      </div>
    </div>
  );
};

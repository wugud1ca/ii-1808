import React, { useState, useEffect, useRef } from 'react';
import { withTrackingParams } from '../../utils/urlParams';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ArrowLeft, 
  Sparkles, 
  Package, 
  Calendar, 
  Scale, 
  Box, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  ExternalLink,
  PhoneCall,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Bell,
  X,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { trackEvent } from '../../utils/analytics';

interface CargoCase {
  id: string;
  photo: string;
  name: string;
  category: string;
  waybill: string;
  platform: '1688' | 'Alibaba' | 'Фабрика КНР';
  arrivalDate: string;
  weight: string;
  volume: string;
  places: string;
  terminal: string;
  status: string;
  isNew?: boolean;
  isLoading?: boolean;
}
// ---- Даты прихода: динамические, от текущего момента ----

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function fmtDateTime(d: Date): string {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// Изначально видимые грузы: по 2 шт в день, от сегодняшнего дня (NOW) назад по 1 дню
function buildInitialArrivalDates(): string[] {
  const now = new Date();
  const dates: string[] = [];
  const pairs = 5; // 10 грузов = 5 пар дней
  const dayHours: Array<[number, number]> = [
    [10, 15], [9, 17], [11, 14], [8, 13], [10, 16],
  ];
  for (let pair = 0; pair < pairs; pair++) {
    for (let j = 0; j < 2; j++) {
      const d = new Date(now);
      d.setDate(d.getDate() - pair);
      if (pair === 0) {
        // сегодня: время строго в прошлом относительно NOW()
        d.setHours(d.getHours() - (j === 0 ? 3 : 1));
        d.setMinutes((37 + j * 23) % 60);
      } else {
        const [h1, h2] = dayHours[(pair - 1) % dayHours.length];
        d.setHours(j === 0 ? h1 : h2);
        d.setMinutes((pair * 11 + j * 29) % 60);
      }
      dates.push(fmtDateTime(d));
    }
  }
  return dates;
}

const INITIAL_DATES = buildInitialArrivalDates();

// Смещения «назад» для новых появляющихся грузов: раскидываем по часам
// от времени просмотра клиентом (в момент появления груза на странице)
const EXTRA_ARRIVAL_OFFSETS_MS: number[] = [
  25 * 60_000,   // 25 мин
  95 * 60_000,   // 1.5 часа
  210 * 60_000,  // 3.5 часа
  45 * 60_000,   // 45 мин
  160 * 60_000,  // 2ч 40мин
  300 * 60_000,  // 5 часов
  70 * 60_000,   // 1ч 10мин
  190 * 60_000,  // 3ч 10мин
];


const INITIAL_CARGO_CASES: CargoCase[] = [
  {
    id: 'cargo-1',
    photo: '/cargo/c07.webp',
    name: 'Промышленные сервоприводы и блоки автоматики',
    category: 'Оборудование / Станки',
    waybill: 'ET-RU-94821-MOW',
    platform: '1688',
    arrivalDate: INITIAL_DATES[0],
    weight: '1 840 кг',
    volume: '5.2 м³',
    places: '12 паллет',
    terminal: 'Москва (СВХ Ворсино)',
    status: 'Принят на складе выдачи РФ'
  },
  {
    id: 'cargo-2',
    photo: '/cargo/c03.webp',
    name: 'Беспроводные акустические системы и гарнитуры',
    category: 'Электроника',
    waybill: 'ET-RU-94750-SPB',
    platform: 'Alibaba',
    arrivalDate: INITIAL_DATES[1],
    weight: '620 кг',
    volume: '3.8 м³',
    places: '48 коробов',
    terminal: 'Санкт-Петербург (Шушары)',
    status: 'Выдан клиенту'
  },
  {
    id: 'cargo-3',
    photo: '/cargo/c02.webp',
    name: 'Дизайнерские LED-люстры и трековые светильники',
    category: 'Освещение и интерьер',
    waybill: 'ET-RU-94612-EKB',
    platform: '1688',
    arrivalDate: INITIAL_DATES[2],
    weight: '950 кг',
    volume: '7.4 м³',
    places: '36 мест (обрешетка)',
    terminal: 'Екатеринбург',
    status: 'Принят на терминале'
  },
  {
    id: 'cargo-4',
    photo: '/cargo/c01.webp',
    name: 'Премиальный трикотаж и спортивный текстиль оптом',
    category: 'Одежда и ткани',
    waybill: 'ET-RU-94590-MOW',
    platform: 'Фабрика КНР',
    arrivalDate: INITIAL_DATES[3],
    weight: '2 400 кг',
    volume: '11.5 м³',
    places: '80 мешков в пломбах',
    terminal: 'Москва (Южные Ворота)',
    status: 'Выдан клиенту'
  },
  {
    id: 'cargo-5',
    photo: '/cargo/c15.webp',
    name: 'Комплектующие для ПК и майнинг-охлаждение',
    category: 'IT-оборудование',
    waybill: 'ET-RU-94420-NSK',
    platform: '1688',
    arrivalDate: INITIAL_DATES[4],
    weight: '480 кг',
    volume: '2.1 м³',
    places: '24 коробки',
    terminal: 'Новосибирск',
    status: 'Принят на складе выдачи'
  },
  {
    id: 'cargo-6',
    photo: '/cargo/c14.webp',
    name: 'Спортивная обувь и кроссовки для маркетплейсов',
    category: 'Обувь опт',
    waybill: 'ET-RU-94380-MOW',
    platform: '1688',
    arrivalDate: INITIAL_DATES[5],
    weight: '1 120 кг',
    volume: '6.9 м³',
    places: '56 коробов',
    terminal: 'Москва (ТЯК Москва)',
    status: 'Выдан клиенту'
  },
  {
    id: 'cargo-7',
    photo: '/cargo/c05.webp',
    name: 'Автомобильные датчики, фары и зеркала в сборе',
    category: 'Автозапчасти',
    waybill: 'ET-RU-94210-KRD',
    platform: 'Alibaba',
    arrivalDate: INITIAL_DATES[6],
    weight: '890 кг',
    volume: '4.6 м³',
    places: '30 мест (деревянный каркас)',
    terminal: 'Краснодар',
    status: 'Принят на складе выдачи'
  },
  {
    id: 'cargo-8',
    photo: '/cargo/c13.webp',
    name: 'Стоматологические расходные материалы и боксы',
    category: 'Медицинские изделия',
    waybill: 'ET-RU-94105-MOW',
    platform: 'Фабрика КНР',
    arrivalDate: INITIAL_DATES[7],
    weight: '310 кг',
    volume: '1.4 м³',
    places: '16 коробок',
    terminal: 'Москва (Белый Раст)',
    status: 'Выдан клиенту'
  },
  {
    id: 'cargo-9',
    photo: '/cargo/c09.webp',
    name: 'Станки лазерной гравировки и резки с ЧПУ',
    category: 'Станки и спецтехника',
    waybill: 'ET-RU-93990-NN',
    platform: 'Alibaba',
    arrivalDate: INITIAL_DATES[8],
    weight: '3 200 кг',
    volume: '14.0 м³',
    places: '4 ящика (морской стандарт)',
    terminal: 'Нижний Новгород',
    status: 'Выдан клиенту'
  },
  {
    id: 'cargo-10',
    photo: '/cargo/c10.webp',
    name: 'Оптические объективы, экшн-камеры и штативы',
    category: 'Фото и видеотехника',
    waybill: 'ET-RU-93850-MOW',
    platform: '1688',
    arrivalDate: INITIAL_DATES[9],
    weight: '430 кг',
    volume: '2.0 м³',
    places: '22 короба',
    terminal: 'Москва (СВХ Селятино)',
    status: 'Выдан клиенту'
  }
];

// 5 additional incoming cases that will be dynamically inserted in real time
const EXTRA_INCOMING_CASES: Omit<CargoCase, 'arrivalDate'>[] = [
  {
    id: 'cargo-extra-1',
    photo: '/cargo/c04.webp',
    name: 'Электроинструмент и аккумуляторы высокой емкости',
    category: 'Инструмент / Строительство',
    waybill: 'ET-RU-94910-MOW',
    platform: '1688',
    weight: '1 350 кг',
    volume: '4.8 м³',
    places: '40 коробов в паллетах',
    terminal: 'Москва (Ворсино)',
    status: '⚡ Только что поступил в РФ',
    isNew: true
  },
  {
    id: 'cargo-extra-2',
    photo: '/cargo/c12.webp',
    name: 'Смарт-часы, фитнес-трекеры и беспроводные зарядки',
    category: 'Гаджеты и аксессуары',
    waybill: 'ET-RU-94925-SPB',
    platform: 'Alibaba',
    weight: '290 кг',
    volume: '1.2 м³',
    places: '15 коробов',
    terminal: 'Санкт-Петербург (Шушары)',
    status: '⚡ Только что поступил в РФ',
    isNew: true
  },
  {
    id: 'cargo-extra-3',
    photo: '/cargo/c08.webp',
    name: 'Мебельная фурнитура и системы направляющих Soft-Close',
    category: 'Мебель и фурнитура',
    waybill: 'ET-RU-94940-KZN',
    platform: 'Фабрика КНР',
    weight: '2 850 кг',
    volume: '8.4 м³',
    places: '14 паллет',
    terminal: 'Казань (Свияжск)',
    status: '⚡ Только что поступил в РФ',
    isNew: true
  },
  {
    id: 'cargo-extra-4',
    photo: '/cargo/c11.webp',
    name: 'Трендовые наручные хронографы и подарочные боксы',
    category: 'Аксессуары и подарки',
    waybill: 'ET-RU-94962-MOW',
    platform: '1688',
    weight: '410 кг',
    volume: '1.9 м³',
    places: '28 коробок',
    terminal: 'Москва (Южные Ворота)',
    status: '⚡ Только что поступил в РФ',
    isNew: true
  },
  {
    id: 'cargo-extra-5',
    photo: '/cargo/c06.webp',
    name: 'Солнцезащитные поляризационные очки оптом',
    category: 'Оптика и аксессуары',
    waybill: 'ET-RU-94980-EKB',
    platform: '1688',
    weight: '530 кг',
    volume: '2.5 м³',
    places: '34 короба',
    terminal: 'Екатеринбург',
    status: '⚡ Только что поступил в РФ',
    isNew: true
  }
];

interface WholesaleBuyoutPageProps {
  onOpenLeadModal: (requestType?: string) => void;
  onNavigate: (route: string) => void;
}

export const WholesaleBuyoutPage: React.FC<WholesaleBuyoutPageProps> = ({
  onOpenLeadModal,
  onNavigate
}) => {
  const [cargoList, setCargoList] = useState<CargoCase[]>(INITIAL_CARGO_CASES);
  const [addedCount, setAddedCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [livePulse, setLivePulse] = useState<boolean>(true);
  const [toastCargo, setToastCargo] = useState<CargoCase | null>(null);
  const [highlightedCargoId, setHighlightedCargoId] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);

  // Check if the top of the feed is currently visible on screen
  const isFeedTopInView = () => {
    if (!feedRef.current) return false;
    const rect = feedRef.current.getBoundingClientRect();
    // Consider in view if top is within viewport height range
    return rect.top >= -50 && rect.top <= (window.innerHeight * 0.7);
  };

  // Periodic addition of new cargo items (seamless on-the-fly in-place morphing from skeleton to real content)
  useEffect(() => {
    if (addedCount >= EXTRA_INCOMING_CASES.length) return;

    // First card arrives quickly in 5 seconds (5000ms), subsequent items arrive every 11 seconds
    const delay = addedCount === 0 ? 5000 : 11000;

    // Step 1: Prepend new item directly into cargoList with isLoading = true (clean layout push-down animation)
    const intervalTimer = setTimeout(() => {
      const nextItem = EXTRA_INCOMING_CASES[addedCount];
      if (nextItem) {
        // Дата прихода — «по часам» от времени просмотра клиентом:
        // в момент появления груза ставим текущее время минус сдвиг
        const offsetMs = EXTRA_ARRIVAL_OFFSETS_MS[addedCount % EXTRA_ARRIVAL_OFFSETS_MS.length];
        const loadingItem: CargoCase = {
          ...nextItem,
          arrivalDate: fmtDateTime(new Date(Date.now() - offsetMs)),
          isLoading: true
        };

        // Insert placeholder card directly into the list
        setCargoList(prev => [loadingItem, ...prev]);

        // Step 2: After 1.3s of skeleton loading, morph the same card in-place to loaded state without unmounting or pauses
        setTimeout(() => {
          setCargoList(prev =>
            prev.map(item =>
              item.id === loadingItem.id
                ? { ...item, isLoading: false }
                : item
            )
          );
          setAddedCount(prev => prev + 1);
          setLivePulse(true);
          setTimeout(() => setLivePulse(false), 2500);

          // If user is not viewing the top of the list, trigger bottom-left push toast
          if (!isFeedTopInView()) {
            setToastCargo(loadingItem);
          }
        }, 1300);
      }
    }, delay);

    return () => clearTimeout(intervalTimer);
  }, [addedCount]);

  // Auto-dismiss push toast after 8 seconds
  useEffect(() => {
    if (!toastCargo) return;
    const hideTimer = setTimeout(() => {
      setToastCargo(null);
    }, 8000);
    return () => clearTimeout(hideTimer);
  }, [toastCargo]);

  const handleGoToCargo = (id: string) => {
    setToastCargo(null);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedCargoId(id);
      setTimeout(() => {
        setHighlightedCargoId(null);
      }, 3500);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search goes to the client cabinet's public 1688 search in a new tab
    const query = encodeURIComponent(searchQuery.trim());
    const searchUrl = withTrackingParams(`https://my.express-today.ru/1688/search?q=${query}`);
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 overflow-x-hidden">
      
      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('/')}
              className="hover:text-orange-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Главная</span>
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Выкуп с оптовых площадок (1688, Alibaba, Фабрики)</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Прямой доступ к оптовым счетам КНР</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 relative overflow-hidden">
        {/* Background glow & subtle grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Platforms Tag Pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>1688.com</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ALIBABA.com</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Прямые фабрики КНР</span>
            </div>
          </div>

          {/* Main H1 Title (Exact from Prompt) */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Выкуп товара с Оптовых площадок и фабрик Китая любого уровня сложности и цикла сделки
          </h1>

          {/* Subtitle (Exact from Prompt) */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Поможем найти и выкупить товар, или получить выкупленный вами товар на складе и досмотреть его
          </p>

          {/* Search Bar Container */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-2xl border border-slate-200">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Найти товары на 1688, Alibaba или фабриках КНР..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-semibold rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:bg-white transition-all"
                  />
                </div>
                
                {/* Search Button: Activated */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-98 text-white font-bold text-sm sm:text-base cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-600/25 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Найти</span>
                </button>
              </form>

              {/* Quick hints under search */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-700">Часто выкупают:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Станки и ЧПУ</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Электроника оптом</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Текстиль</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Автозапчасти</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenLeadModal('Заявка на поиск и выкуп оптовой партии в Китае')}
                  className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer transition-colors"
                >
                  Отправить ссылку на расчет →
                </button>
              </div>
            </div>
          </div>

          {/* Value props badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-left max-w-4xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-orange-400 font-black text-sm">0% комиссия</div>
              <div className="text-xs text-slate-300">При доставке «под ключ»</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-emerald-400 font-black text-sm">Оплата в юанях</div>
              <div className="text-xs text-slate-300">Прямой перевод поставщику</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-blue-400 font-black text-sm">Фото/видеоотчет</div>
              <div className="text-xs text-slate-300">Проверка на складе КНР</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-amber-400 font-black text-sm">Белая & Сборная</div>
              <div className="text-xs text-slate-300">ГТД, УПД, маркировка ЧЗ</div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content: Live List of Goods Arrived in Russia */}
      <section ref={feedRef} className="max-w-7xl mx-auto px-4 -mt-6 relative z-20 space-y-6">
        
        {/* Live List Header Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black tracking-wider uppercase text-emerald-700">
                Live-лента поступлений Express Today
              </span>
              {addedCount > 0 && (
                <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-orange-200">
                  +{addedCount} новых приходов
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Грузы, пришедшие в Россию
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Реальные оптовые партии клиентов Express Today с 1688, Alibaba и прямых фабрик КНР
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenLeadModal('Заявка на оптовый выкуп с 1688 / Alibaba');
                trackEvent('lead_start', { source: 'wholesale_live_feed' });
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Package className="w-4 h-4" />
              <span>Заказать выкуп партии</span>
            </button>
          </div>
        </div>

        {/* Cargo Cards Grid / Feed with Motion Animation */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {cargoList.map((cargo) => (
              <motion.div
                key={cargo.id}
                id={cargo.id}
                layout
                initial={cargo.isNew ? { opacity: 0, y: -24, scale: 0.98 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`cargo-card-container bg-white rounded-2xl border transition-all duration-500 overflow-hidden shadow-xs hover:shadow-md scroll-mt-24 ${
                  highlightedCargoId === cargo.id
                    ? 'ring-4 ring-orange-500 shadow-2xl border-orange-500 bg-orange-50/20 scale-[1.01]'
                    : cargo.isLoading
                      ? 'border-orange-300 ring-2 ring-orange-400/20 shadow-md'
                      : cargo.isNew 
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30 bg-emerald-50/20' 
                        : 'border-slate-200/90 hover:border-orange-300'
                }`}
              >
                {cargo.isLoading ? (
                  /* Loading State rendered inside the exact same container - seamless morphing with zero delay or unmount */
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6 animate-pulse">
                    {/* Photo skeleton */}
                    <div className="w-full sm:w-48 lg:w-52 h-44 sm:h-36 rounded-xl bg-slate-200/80 shrink-0 relative overflow-hidden flex flex-col items-center justify-center gap-2 border border-slate-200">
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Загрузка фото...
                      </span>
                    </div>
                    
                    {/* Middle lines skeleton */}
                    <div className="flex-1 space-y-3 w-full min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-5 w-20 bg-orange-100 rounded-md shrink-0"></div>
                        <div className="h-5 w-32 bg-blue-100/70 rounded-md shrink-0"></div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0"></span>
                          <span className="whitespace-nowrap">Регистрация ТТН в реестре терминала...</span>
                        </div>
                      </div>

                      <div className="h-5 w-3/4 bg-slate-200 rounded-lg"></div>

                      {/* 4 Cells Skeleton with CSS Container Query Grid & min-w-0 */}
                      <div className="cargo-metrics-grid pt-1">
                        <div className="bg-slate-100/80 p-2 sm:p-2.5 rounded-xl border border-slate-200/60 min-w-0 h-full flex flex-col justify-between gap-1.5">
                          <div className="h-2.5 w-10 bg-slate-200 rounded"></div>
                          <div className="h-3.5 w-16 bg-slate-300 rounded"></div>
                        </div>
                        <div className="bg-slate-100/80 p-2 sm:p-2.5 rounded-xl border border-slate-200/60 min-w-0 h-full flex flex-col justify-between gap-1.5">
                          <div className="h-2.5 w-12 bg-slate-200 rounded"></div>
                          <div className="h-3.5 w-14 bg-slate-300 rounded"></div>
                        </div>
                        <div className="bg-slate-100/80 p-2 sm:p-2.5 rounded-xl border border-slate-200/60 min-w-0 h-full flex flex-col justify-between gap-1.5">
                          <div className="h-2.5 w-10 bg-slate-200 rounded"></div>
                          <div className="h-3.5 w-20 bg-slate-300 rounded"></div>
                        </div>
                        <div className="bg-slate-100/80 p-2 sm:p-2.5 rounded-xl border border-slate-200/60 min-w-0 h-full flex flex-col justify-between gap-1.5">
                          <div className="h-2.5 w-16 bg-slate-200 rounded"></div>
                          <div className="h-3.5 w-20 bg-slate-300 rounded"></div>
                        </div>
                      </div>

                      <div className="h-3.5 w-48 bg-slate-200/70 rounded"></div>
                    </div>

                    {/* Button skeleton */}
                    <div className="w-full lg:w-36 h-10 bg-slate-200 rounded-xl shrink-0"></div>
                  </div>
                ) : (
                  /* Loaded Card Content */
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
                    
                    {/* Left: Photo with Tag */}
                    <div className="relative w-full sm:w-48 lg:w-52 h-44 sm:h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      <img
                        src={cargo.photo}
                        alt={cargo.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider shrink-0 shadow-xs">
                        {cargo.platform}
                      </div>
                      {cargo.isNew && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] font-bold text-white animate-pulse shadow-xs shrink-0">
                          Только что в РФ
                        </div>
                      )}
                    </div>

                    {/* Middle: Details & Name */}
                    <div className="flex-1 space-y-2.5 min-w-0 w-full">
                      {/* Pills: wrap cleanly without splitting mid-pill */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 whitespace-nowrap shrink-0">
                          {cargo.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 whitespace-nowrap shrink-0">
                          Накладная: {cargo.waybill}
                        </span>
                        <span className="text-xs text-emerald-700 font-semibold inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 whitespace-nowrap shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cargo.status}</span>
                        </span>
                      </div>

                      {/* Title: 2 lines clamp, break-words */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 break-words">
                        {cargo.name}
                      </h3>

                      {/* Key Metrics Mini-Table: Container Query aware layout (2x2 under 520px, 4-cols >= 520px) */}
                      <div className="cargo-metrics-grid pt-1 text-xs" lang="ru">
                        {/* Cell 1: Weight */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Scale className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Вес:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val">
                            <span className="whitespace-nowrap inline-block">{cargo.weight}</span>
                          </div>
                        </div>

                        {/* Cell 2: Volume */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Box className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Объем:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val">
                            <span className="whitespace-nowrap inline-block">{cargo.volume}</span>
                          </div>
                        </div>

                        {/* Cell 3: Places (tokens wrap whole words, never split 'паллет' or 'коробов') */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Мест:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val flex flex-wrap gap-x-1 gap-y-0.5">
                            {cargo.places.split(' ').map((token, tIdx) => (
                              <span key={tIdx} className="whitespace-nowrap inline-block">{token}</span>
                            ))}
                          </div>
                        </div>

                        {/* Cell 4: Arrival Date in RF (date & time protected against tearing) */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Приход в РФ:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val flex flex-wrap gap-x-1.5 gap-y-0.5">
                            {cargo.arrivalDate.split(' ').map((part, pIdx) => (
                              <span key={pIdx} className="whitespace-nowrap inline-block">{part}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Destination Terminal */}
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5 min-w-0">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="break-words">
                          Терминал назначения: <strong className="text-slate-700 font-semibold">{cargo.terminal}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right: Quick Action CTA (relocated cleanly below params on tablet & mobile, on right only on lg desktop) */}
                    <div className="w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex lg:flex-col items-center justify-end">
                      <button
                        onClick={() => onOpenLeadModal(`Расчет подобной партии: ${cargo.name} (${cargo.weight}, ${cargo.volume})`)}
                        className="w-full lg:w-auto px-5 py-3 lg:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs active:scale-98"
                      >
                        <span>Рассчитать похожее</span>
                        <ArrowRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      </button>
                    </div>

                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom Order CTA Card */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Нужно найти поставщика или выкупить оптовую партию?
            </h3>
            <p className="text-sm text-orange-100 max-w-xl">
              Пришлите ссылку на товар с 1688 или Alibaba, либо техническое задание. Менеджер свяжется с фабрикой за 2 часа и подготовит полный расчет поставки.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onOpenLeadModal('Заявка на оптовый выкуп с 1688 / Alibaba')}
              className="px-8 py-4 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-98 text-center"
            >
              Отправить заявку менеджеру
            </button>
          </div>
        </div>

      </section>

      {/* Floating Bottom-Left Push Popup (Unobtrusive Toast) */}
      <AnimatePresence>
        {toastCargo && (
          <motion.aside
            initial={{ opacity: 0, y: 40, x: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed bottom-6 left-4 sm:left-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-[380px] bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 ring-1 ring-white/10"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              {/* Image */}
              <img
                src={toastCargo.photo}
                alt={toastCargo.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700/80 shadow-xs"
              />
              
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="truncate">ТТН выдана № {toastCargo.waybill}</span>
                </div>
                
                <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                  {toastCargo.name}
                </p>
                
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>{toastCargo.weight}</span>
                  <span>•</span>
                  <span className="truncate">{toastCargo.terminal}</span>
                </div>
                
                {/* Direct Anchor Link Button */}
                <button
                  onClick={() => handleGoToCargo(toastCargo.id)}
                  className="mt-2 text-xs font-extrabold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30"
                >
                  <span>Показать в списке выдачи</span>
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setToastCargo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Закрыть уведомление"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

    </div>
  );
};

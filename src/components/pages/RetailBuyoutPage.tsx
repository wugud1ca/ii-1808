import React, { useState, useEffect, useRef } from 'react';
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
  ShoppingBag,
  BadgeCheck,
  Tag,
  X,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { trackEvent } from '../../utils/analytics';

interface RetailOrderCase {
  id: string;
  photo: string;
  name: string;
  category: string;
  trackingNo: string;
  platform: 'Poizon (Dewu)' | 'Tmall' | 'Taobao' | 'JD.com';
  arrivalDateAtWh: string;
  weight: string;
  volume: string;
  places: string;
  warehouseCity: 'Гуанчжоу (Guangzhou)' | 'Иу (Yiwu)';
  status: string;
  verificationBadge?: string;
  isNew?: boolean;
  isLoading?: boolean;
}

const INITIAL_RETAIL_CASES: RetailOrderCase[] = [
  {
    id: 'retail-1',
    photo: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&auto=format&fit=crop&q=80',
    name: 'Nike Air Jordan 1 Retro High OG (Лимитированная серия)',
    category: 'Обувь / Streetwear',
    trackingNo: 'SF-CN-9912048',
    platform: 'Poizon (Dewu)',
    arrivalDateAtWh: '17.08.2026 13:40',
    weight: '2.1 кг',
    volume: '0.02 м³',
    places: '1 коробка',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: 'Пломба Poizon проверена, взвешен',
    verificationBadge: 'Оригинал 100%'
  },
  {
    id: 'retail-2',
    photo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80',
    name: 'Умные часы Apple Watch Ultra 2 (Официальный дилер)',
    category: 'Электроника',
    trackingNo: 'ZT-CN-8841029',
    platform: 'Tmall',
    arrivalDateAtWh: '17.08.2026 12:15',
    weight: '0.85 кг',
    volume: '0.01 м³',
    places: '1 посылка',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: 'Серийный номер сверен, упакован',
    verificationBadge: 'Флагманский магазин'
  },
  {
    id: 'retail-3',
    photo: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&auto=format&fit=crop&q=80',
    name: 'Кожаная сумка премиум-класса с персонализацией',
    category: 'Аксессуары и сумки',
    trackingNo: 'YT-CN-7729104',
    platform: 'Taobao',
    arrivalDateAtWh: '17.08.2026 11:30',
    weight: '1.4 кг',
    volume: '0.03 м³',
    places: '1 коробка',
    warehouseCity: 'Иу (Yiwu)',
    status: 'Фотоотчет загружен в ЛК клиента',
    verificationBadge: 'Золотой продавец'
  },
  {
    id: 'retail-4',
    photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&auto=format&fit=crop&q=80',
    name: 'Студийные полноразмерные наушники Sony WH-1000XM5',
    category: 'Аудиотехника',
    trackingNo: 'SF-CN-6618290',
    platform: 'Tmall',
    arrivalDateAtWh: '17.08.2026 10:45',
    weight: '1.1 кг',
    volume: '0.02 м³',
    places: '1 коробка',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: 'Взвешен, готов к упаковке в паллет',
    verificationBadge: 'Гарантия бренда'
  },
  {
    id: 'retail-5',
    photo: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&auto=format&fit=crop&q=80',
    name: 'Кроссовки New Balance 990v6 Made in USA',
    category: 'Обувь',
    trackingNo: 'SF-CN-5519283',
    platform: 'Poizon (Dewu)',
    arrivalDateAtWh: '16.08.2026 17:20',
    weight: '1.9 кг',
    volume: '0.02 м³',
    places: '1 коробка',
    warehouseCity: 'Иу (Yiwu)',
    status: 'Сертификат Poizon и NFC-чип проверены',
    verificationBadge: 'Poizon Verified'
  },
  {
    id: 'retail-6',
    photo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
    name: 'Компактный стабилизатор и экшн-камера DJI Osmo Pocket 3',
    category: 'Гаджеты / Видео',
    trackingNo: 'ZT-CN-4418290',
    platform: 'Tmall',
    arrivalDateAtWh: '16.08.2026 15:10',
    weight: '1.6 кг',
    volume: '0.02 м³',
    places: '2 коробки',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: 'Заводская пломба цела, упакован в пупырчатую пленку',
    verificationBadge: 'Оригинал DJI'
  },
  {
    id: 'retail-7',
    photo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&auto=format&fit=crop&q=80',
    name: 'Дизайнерские солнцезащитные очки Gentle Monster',
    category: 'Оптика / Мода',
    trackingNo: 'YT-CN-3319028',
    platform: 'Poizon (Dewu)',
    arrivalDateAtWh: '16.08.2026 14:00',
    weight: '0.6 кг',
    volume: '0.01 м³',
    places: '1 коробка',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: 'Полный комплект: футляр, карточка, салфетка',
    verificationBadge: 'Аутентичность 100%'
  },
  {
    id: 'retail-8',
    photo: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&auto=format&fit=crop&q=80',
    name: 'Коллекционные фигурки и арт-игрушки Pop Mart Mega Space',
    category: 'Хобби / Коллекции',
    trackingNo: 'SF-CN-2219804',
    platform: 'Taobao',
    arrivalDateAtWh: '16.08.2026 11:45',
    weight: '3.4 кг',
    volume: '0.05 м³',
    places: '2 коробки',
    warehouseCity: 'Иу (Yiwu)',
    status: 'Усиленная упаковка с уголками',
    verificationBadge: 'Limited Edition'
  },
  {
    id: 'retail-9',
    photo: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=80',
    name: 'Утепленный оверсайз пуховик Arc\'teryx водонепроницаемый',
    category: 'Одежда Outdoor',
    trackingNo: 'SF-CN-1192840',
    platform: 'Poizon (Dewu)',
    arrivalDateAtWh: '15.08.2026 16:30',
    weight: '2.3 кг',
    volume: '0.04 м³',
    places: '1 пакет в коробке',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: 'Замеры плеч/рукавов переданы клиенту',
    verificationBadge: 'Gore-Tex Проверен'
  },
  {
    id: 'retail-10',
    photo: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80',
    name: 'Механическая кастомная клавиатура с RGB и свитчами Gateron',
    category: 'Гейминг / IT',
    trackingNo: 'ZT-CN-0091823',
    platform: 'Taobao',
    arrivalDateAtWh: '15.08.2026 13:10',
    weight: '1.8 кг',
    volume: '0.02 м³',
    places: '1 коробка',
    warehouseCity: 'Иу (Yiwu)',
    status: 'Проверена комплектность и кабель',
    verificationBadge: 'Custom Build'
  }
];

// 5 additional incoming retail orders that will be dynamically inserted in real time
const EXTRA_INCOMING_RETAIL_CASES: RetailOrderCase[] = [
  {
    id: 'retail-extra-1',
    photo: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80',
    name: 'Кроссовки Adidas Yeezy Boost 350 V2 Onyx',
    category: 'Обувь / Streetwear',
    trackingNo: 'SF-CN-9988102',
    platform: 'Poizon (Dewu)',
    arrivalDateAtWh: '17.08.2026 14:15',
    weight: '1.75 кг',
    volume: '0.02 м³',
    places: '1 коробка',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: '🟢 Только что принят на складе КНР',
    verificationBadge: 'Пломба Poizon',
    isNew: true
  },
  {
    id: 'retail-extra-2',
    photo: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
    name: 'Набор шелковых пижам и постельного белья Mulberry Silk',
    category: 'Текстиль / Дом',
    trackingNo: 'ZT-CN-9977201',
    platform: 'Tmall',
    arrivalDateAtWh: '17.08.2026 14:18',
    weight: '2.4 кг',
    volume: '0.03 м³',
    places: '1 коробка',
    warehouseCity: 'Иу (Yiwu)',
    status: '🟢 Только что принят на складе КНР',
    verificationBadge: '100% Шелк',
    isNew: true
  },
  {
    id: 'retail-extra-3',
    photo: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&auto=format&fit=crop&q=80',
    name: 'Смарт-браслеты Xiaomi Smart Band 9 и ремешки',
    category: 'Гаджеты',
    trackingNo: 'SF-CN-9966304',
    platform: 'Taobao',
    arrivalDateAtWh: '17.08.2026 14:22',
    weight: '0.95 кг',
    volume: '0.01 м³',
    places: '1 коробка',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: '🟢 Только что принят на складе КНР',
    verificationBadge: 'Оригинал Xiaomi',
    isNew: true
  },
  {
    id: 'retail-extra-4',
    photo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&auto=format&fit=crop&q=80',
    name: 'Набор уходовой косметики и сывороток премиум-бренда',
    category: 'Красота / Уход',
    trackingNo: 'YT-CN-9955410',
    platform: 'Tmall',
    arrivalDateAtWh: '17.08.2026 14:26',
    weight: '1.3 кг',
    volume: '0.02 м³',
    places: '1 бокс',
    warehouseCity: 'Гуанчжоу (Guangzhou)',
    status: '🟢 Только что принят на складе КНР',
    verificationBadge: 'Официальный бутик',
    isNew: true
  },
  {
    id: 'retail-extra-5',
    photo: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&auto=format&fit=crop&q=80',
    name: 'Кожаный кошелек и ремень ручной работы',
    category: 'Аксессуары',
    trackingNo: 'SF-CN-9944520',
    platform: 'Poizon (Dewu)',
    arrivalDateAtWh: '17.08.2026 14:30',
    weight: '0.7 кг',
    volume: '0.01 м³',
    places: '1 коробка',
    warehouseCity: 'Иу (Yiwu)',
    status: '🟢 Только что принят на складе КНР',
    verificationBadge: 'Аутентичность 100%',
    isNew: true
  }
];

interface RetailBuyoutPageProps {
  onOpenLeadModal: (requestType?: string) => void;
  onNavigate: (route: string) => void;
}

export const RetailBuyoutPage: React.FC<RetailBuyoutPageProps> = ({
  onOpenLeadModal,
  onNavigate
}) => {
  const [orderList, setOrderList] = useState<RetailOrderCase[]>(INITIAL_RETAIL_CASES);
  const [addedCount, setAddedCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastOrder, setToastOrder] = useState<RetailOrderCase | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);

  // Check if the top of the feed is currently visible on screen
  const isFeedTopInView = () => {
    if (!feedRef.current) return false;
    const rect = feedRef.current.getBoundingClientRect();
    return rect.top >= -50 && rect.top <= (window.innerHeight * 0.7);
  };

  // Periodic addition of new retail orders (seamless in-place morphing from skeleton to real content)
  useEffect(() => {
    if (addedCount >= EXTRA_INCOMING_RETAIL_CASES.length) return;

    // First card arrives quickly in 5 seconds (5000ms), subsequent items arrive every 11 seconds
    const delay = addedCount === 0 ? 5000 : 11000;

    // Step 1: Prepend new item directly into orderList with isLoading = true (clean push-down animation)
    const intervalTimer = setTimeout(() => {
      const nextItem = EXTRA_INCOMING_RETAIL_CASES[addedCount];
      if (nextItem) {
        const loadingItem: RetailOrderCase = {
          ...nextItem,
          isLoading: true
        };

        // Insert placeholder card directly into the list
        setOrderList(prev => [loadingItem, ...prev]);

        // Step 2: After 1.3s of skeleton loading, morph the same card in-place to loaded state without unmounting or pauses
        setTimeout(() => {
          setOrderList(prev =>
            prev.map(item =>
              item.id === loadingItem.id
                ? { ...item, isLoading: false }
                : item
            )
          );
          setAddedCount(prev => prev + 1);

          // If user is not viewing the top of the list, trigger bottom-left push toast
          if (!isFeedTopInView()) {
            setToastOrder(nextItem);
          }
        }, 1300);
      }
    }, delay);

    return () => clearTimeout(intervalTimer);
  }, [addedCount]);

  // Auto-dismiss push toast after 8 seconds
  useEffect(() => {
    if (!toastOrder) return;
    const hideTimer = setTimeout(() => {
      setToastOrder(null);
    }, 8000);
    return () => clearTimeout(hideTimer);
  }, [toastOrder]);

  const handleGoToOrder = (id: string) => {
    setToastOrder(null);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedOrderId(id);
      setTimeout(() => {
        setHighlightedOrderId(null);
      }, 3500);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenLeadModal(`Выкуп с розничных площадок (Poizon/Tmall/Taobao): ${searchQuery || 'заказ'}`);
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
            <span className="text-slate-900 font-bold">Выкуп с розничных площадок (POIZON, TMALL, TAOBAO)</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Собственные склады в Гуанчжоу и Иу</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-10 pb-16 px-4 relative overflow-hidden">
        {/* Background glow & subtle grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Platforms Tag Pills */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>POIZON (Dewu)</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>TMALL.com</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>TAOBAO.com</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>JD.com & Магазины</span>
            </div>
          </div>

          {/* Main H1 Title (Exact from Prompt) */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Выкуп товара с Розничных площадок или магазинов Китая
          </h1>

          {/* Subtitle (Exact from Prompt) */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Поможем найти и выкупить товар в любом магазине или площадке Китая, или получить выкупленный вами заказ на складе и досмотреть его
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
                    placeholder="Найти товары на Poizon, Taobao, Tmall, JD..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-semibold rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
                
                {/* Search Button: Activated */}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm sm:text-base cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Найти</span>
                </button>
              </form>

              {/* Quick hints under search */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-slate-700">Популярно:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Кроссовки Poizon</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Одежда Tmall</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Гаджеты и часы</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">Сумки Taobao</span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenLeadModal('Заявка на выкуп с Poizon / Taobao / Tmall')}
                  className="text-emerald-600 hover:text-emerald-700 font-bold cursor-pointer transition-colors"
                >
                  Отправить ссылку на выкуп →
                </button>
              </div>
            </div>
          </div>

          {/* Value props badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-left max-w-4xl mx-auto">
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-emerald-400 font-black text-sm">Проверка Poizon</div>
              <div className="text-xs text-slate-300">Пломбы, сертификаты, чипы</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-orange-400 font-black text-sm">Консолидация 0 ₽</div>
              <div className="text-xs text-slate-300">Объединяем заказы в одну коробку</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-blue-400 font-black text-sm">Фотоконтроль</div>
              <div className="text-xs text-slate-300">Фото швов, бирок и размеров</div>
            </div>
            <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/80">
              <div className="text-purple-400 font-black text-sm">Авиа 2–5 дней</div>
              <div className="text-xs text-slate-300">Быстрая доставка в руки</div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content: Live List of Orders Arrived at China Warehouse */}
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
                Складской учет Express Today в реальном времени
              </span>
              {addedCount > 0 && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
                  +{addedCount} новых поступлений
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Заказы, поступившие на склад в Китае
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Фиксация трек-номеров, фотоконтроль, взвешивание и подготовка к отправке в РФ
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenLeadModal('Заявка на выкуп розничного заказа (Poizon/Tmall/Taobao)');
                trackEvent('lead_start', { source: 'retail_live_feed' });
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Выкупить товар / заказ</span>
            </button>
          </div>
        </div>

        {/* Orders Feed with Motion Animation */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {orderList.map((order) => (
              <motion.div
                key={order.id}
                id={order.id}
                layout
                initial={order.isNew ? { opacity: 0, y: -24, scale: 0.98 } : false}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`cargo-card-container bg-white rounded-2xl border transition-all duration-500 overflow-hidden shadow-xs hover:shadow-md scroll-mt-24 ${
                  highlightedOrderId === order.id
                    ? 'ring-4 ring-emerald-500 shadow-2xl border-emerald-500 bg-emerald-50/20 scale-[1.01]'
                    : order.isLoading
                      ? 'border-emerald-300 ring-2 ring-emerald-400/20 shadow-md'
                      : order.isNew 
                        ? 'border-emerald-400 ring-2 ring-emerald-400/30 bg-emerald-50/20' 
                        : 'border-slate-200/90 hover:border-emerald-300'
                }`}
              >
                {order.isLoading ? (
                  /* Loading State rendered inside the exact same container - seamless morphing with zero delay or unmount */
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6 animate-pulse">
                    {/* Photo skeleton */}
                    <div className="w-full sm:w-48 lg:w-52 h-44 sm:h-36 rounded-xl bg-slate-200/80 shrink-0 relative overflow-hidden flex flex-col items-center justify-center gap-2 border border-slate-200">
                      <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Фотофиксация посылки...
                      </span>
                    </div>
                    
                    {/* Middle lines skeleton */}
                    <div className="flex-1 space-y-3 w-full min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="h-5 w-20 bg-slate-200 rounded-md shrink-0"></div>
                        <div className="h-5 w-32 bg-emerald-100/70 rounded-md shrink-0"></div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                          <span className="whitespace-nowrap">Приемка посылки и сканирование штрихкода на складе...</span>
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
                        src={order.photo}
                        alt={order.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white uppercase tracking-wider shrink-0 shadow-xs">
                        {order.platform}
                      </div>
                      {order.isNew && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600 text-[10px] font-bold text-white animate-pulse shadow-xs shrink-0">
                          Только что принят
                        </div>
                      )}
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 space-y-2.5 min-w-0 w-full">
                      {/* Pills: wrap cleanly without splitting mid-pill */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 whitespace-nowrap shrink-0">
                          {order.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 whitespace-nowrap shrink-0">
                          Трек / Накладная: {order.trackingNo}
                        </span>
                        {order.verificationBadge && (
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                            <BadgeCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{order.verificationBadge}</span>
                          </span>
                        )}
                      </div>

                      {/* Title: 2 lines clamp, break-words */}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 break-words">
                        {order.name}
                      </h3>

                      {/* Key Metrics: Container Query aware layout (2x2 under 520px, 4-cols >= 520px) */}
                      <div className="cargo-metrics-grid pt-1 text-xs" lang="ru">
                        {/* Cell 1: Weight */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Scale className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Вес:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val">
                            <span className="whitespace-nowrap inline-block">{order.weight}</span>
                          </div>
                        </div>

                        {/* Cell 2: Volume */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Box className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Объем:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val">
                            <span className="whitespace-nowrap inline-block">{order.volume}</span>
                          </div>
                        </div>

                        {/* Cell 3: Places (tokens wrap whole words, never split 'паллет' or 'коробов') */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Layers className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Мест:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val flex flex-wrap gap-x-1 gap-y-0.5">
                            {order.places.split(' ').map((token, tIdx) => (
                              <span key={tIdx} className="whitespace-nowrap inline-block">{token}</span>
                            ))}
                          </div>
                        </div>

                        {/* Cell 4: Arrival Date at China Warehouse (date & time protected against tearing) */}
                        <div className="bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100 min-w-0 h-full flex flex-col justify-between">
                          <div className="text-slate-400 flex items-center gap-1 mb-1 min-w-0">
                            <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span className="whitespace-nowrap text-[11px] sm:text-xs font-medium">Приход на склад:</span>
                          </div>
                          <div className="font-extrabold text-slate-900 text-xs sm:text-sm leading-tight cargo-metric-val flex flex-wrap gap-x-1.5 gap-y-0.5">
                            {order.arrivalDateAtWh.split(' ').map((part, pIdx) => (
                              <span key={pIdx} className="whitespace-nowrap inline-block">{part}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Warehouse & Status Row */}
                      <div className="text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2 pt-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="break-words">
                            Склад приемки: <strong className="text-slate-700 font-semibold">{order.warehouseCity}</strong>
                          </span>
                        </div>
                        <div className="text-emerald-700 font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{order.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action (relocated cleanly below params on tablet & mobile, on right only on lg desktop) */}
                    <div className="w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex lg:flex-col items-center justify-end">
                      <button
                        onClick={() => onOpenLeadModal(`Выкуп аналогичного товара: ${order.name} (${order.platform})`)}
                        className="w-full lg:w-auto px-5 py-3 lg:py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs active:scale-98"
                      >
                        <span>Выкупить такой же</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </button>
                    </div>

                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Хотите выкупить вещи, электронику или обувь с Poizon / Taobao?
            </h3>
            <p className="text-sm text-emerald-100 max-w-xl">
              Пришлите ссылку на товар или артикул. Мы выкупим заказ по официальному курсу, проверим на складе в Гуанчжоу или Иу, сфотографируем и доставим прямо до вашей двери.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onOpenLeadModal('Заявка на выкуп с Poizon / Taobao / Tmall')}
              className="px-8 py-4 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-98 text-center"
            >
              Оставить заявку на выкуп
            </button>
          </div>
        </div>

      </section>

      {/* Floating Bottom-Left Push Popup (Unobtrusive Toast) */}
      <AnimatePresence>
        {toastOrder && (
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
                src={toastOrder.photo}
                alt={toastOrder.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700/80 shadow-xs"
              />
              
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="truncate">ТТН / Заказ принят № {toastOrder.trackingNo}</span>
                </div>
                
                <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
                  {toastOrder.name}
                </p>
                
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>{toastOrder.weight}</span>
                  <span>•</span>
                  <span className="truncate">{toastOrder.warehouseCity}</span>
                </div>
                
                {/* Direct Anchor Link Button */}
                <button
                  onClick={() => handleGoToOrder(toastOrder.id)}
                  className="mt-2 text-xs font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30"
                >
                  <span>Показать заказ на складе</span>
                  <ArrowDownRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Close Button */}
              <button
                onClick={() => setToastOrder(null)}
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

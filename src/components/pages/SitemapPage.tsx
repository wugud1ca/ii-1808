import React from 'react';
import {
  ShoppingCart, Store, Globe2, ScrollText, Layers, MapPin, ArrowLeft,
} from 'lucide-react';

interface SitemapPageProps {
  onNavigate: (route: string) => void;
}

interface SitemapLink {
  href: string;
  title: string;
  desc: string;
}

interface SitemapGroup {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  links: SitemapLink[];
}

const GROUPS: SitemapGroup[] = [
  {
    icon: Layers,
    title: 'Доставка из Китая',
    links: [
      { href: '/dostavka', title: 'Все каналы доставки', desc: 'Обзор способов доставки, статусы каналов и график сроков' },
      { href: '/dostavka-avia-iz-kitaja', title: 'Авиадоставка', desc: '9–15 дней, оплачиваемый вес 1:6000, рейсы из Гуанчжоу и Шэньчжэня' },
      { href: '/dostavka-avto-iz-kitaja', title: 'Автодоставка', desc: '13–25 дней, сборные LTL и фуры FTL через Забайкальск и Хоргос' },
      { href: '/dostavka-morem-iz-kitaja', title: 'Морская доставка', desc: 'Контейнеры FCL/LCL от 18 дней, порты Владивосток, Находка, СПб' },
      { href: '/dostavka-poezdom-iz-kitaja', title: 'ЖД доставка', desc: '16–30 дней, контейнерные поезда через Забайкальск и Достык' },
      { href: '/express-dostavka-iz-kitaia', title: 'Экспресс-доставка', desc: 'Максимально быстрые сроки для срочных партий' },
      { href: '/kargo-dostavka-iz-kitaia', title: 'Карго (сборные грузы)', desc: 'Сборные отправки малыми партиями по сниженным тарифам' },
      { href: '/belaya-dostavka', title: 'Официальная «белая» доставка', desc: 'ВЭД под ключ: ДТ (ГТД), УПД с НДС 20%' },
      { href: '/dostavka-kontejnera-iz-kitaja', title: 'Контейнеры 20ft / 40ft', desc: 'Полные контейнеры и доставка крупногабаритного оборудования' },
      { href: '/raschet-stoimosti-dostavki-gruza-iz-kitaja', title: 'Калькулятор стоимости', desc: 'Расчёт ориентировочной стоимости перевозки онлайн' },
      { href: '/online-tariffs', title: 'Онлайн-тарифы', desc: 'Действующие ставки по каналам доставки' },
    ],
  },
  {
    icon: ShoppingCart,
    title: 'Выкуп и закупки в Китае',
    links: [
      { href: '/vikup-tovara-iz-kitaya', title: 'Выкуп товаров', desc: 'Полный цикл: от заказа на фабрике до получения в РФ' },
      { href: '/vikup-1688-alibaba', title: 'Оптовый выкуп (1688, Alibaba)', desc: 'Оптовые партии, закупки за 24 часа' },
      { href: '/vikup-poizon-tmall-taobao', title: 'Розничный выкуп (POIZON, Tmall, Taobao)', desc: 'Розничные заказы с проверкой подлинности' },
      { href: '/1688', title: 'Закупки на 1688 / POIZON', desc: 'Каталог площадок и гайд по закупкам' },
      { href: '/poisk-proizvodstva-tovarov-v-kitae-optom', title: 'Поиск поставщиков и фабрик', desc: 'Подбор производителей и переговоры с фабриками' },
      { href: '/konsolidaciya-tovara-v-kitaye', title: 'Консолидация и склад в КНР', desc: 'Склад в Гуанчжоу 2000 м², объединение заказов в одну отправку' },
    ],
  },
  {
    icon: Store,
    title: 'Для бизнеса',
    links: [
      { href: '/dostavka-tovarov-iz-kitaia-dlia-marketpleisov', title: 'Доставка для маркетплейсов', desc: 'Поставки для Wildberries, Ozon, Яндекс.Маркет' },
      { href: '/fulfilment-dlya-marketpleisov', title: 'Фулфилмент и маркировка ЧЗ', desc: 'Подготовка товаров, маркировка «Честный знак»' },
      { href: '/stat-importerom', title: 'Стать импортёром', desc: 'Импорт на ваше юридическое лицо, ВЭД-сопровождение' },
      { href: '/dokumenty-dlya-vvoza', title: 'Документы для ввоза', desc: 'Сертификация, декларации, «Честный знак»' },
      { href: '/world', title: 'Закупки в других странах', desc: 'Турция и другие направления: выкуп и доставка' },
      { href: '/turkey', title: 'Доставка из Турции', desc: 'Выкуп и перевозка турецких товаров' },
    ],
  },
  {
    icon: Globe2,
    title: 'Сервисы и инструменты',
    links: [
      { href: '/tnved', title: 'Подбор кода ТН ВЭД', desc: 'Калькулятор таможенных платежей и подбор кода' },
      { href: '/faq', title: 'Вопросы и ответы', desc: 'Частые вопросы о выкупе и доставке из Китая' },
      { href: '/kontakti', title: 'Контакты', desc: 'Телефоны, мессенджеры и офисы Express Today' },
    ],
  },
  {
    icon: ScrollText,
    title: 'Документы',
    links: [
      { href: '/publichnaya-oferta', title: 'Публичная оферта', desc: 'Условия оказания услуг' },
      { href: '/soglashenie-o-konfidencialnosti-i-polzovatelskoe-soglashenie', title: 'Политика конфиденциальности', desc: 'Обработка персональных данных' },
      { href: '/partnerskoye-referalnoye-soglasheniye-oferta', title: 'Партнёрское соглашение', desc: 'Условия реферальной программы' },
      { href: '/oferta-dostavka', title: 'Оферта на доставку', desc: 'Условия услуг перевозки' },
    ],
  },
];

export const SitemapPage: React.FC<SitemapPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 space-y-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-wider">
          <MapPin className="w-4 h-4" />
          <span>Навигация по сайту</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">Карта сайта</h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-2xl">
          Все страницы Express Today сгруппированы по темам: каналы доставки из Китая, выкуп и закупки,
          услуги для бизнеса, инструменты и документы.
        </p>
      </div>

      {GROUPS.map((g, gi) => {
        const Icon = g.icon;
        return (
          <section key={gi} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 rounded-xl p-2.5 shrink-0">
                <Icon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{g.title}</h2>
                <p className="text-xs text-slate-400">{g.links.length} страниц</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.links.map((l, li) => (
                <a
                  key={li}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); onNavigate(l.href); }}
                  className="group bg-slate-50 hover:bg-orange-50 border border-slate-100 hover:border-orange-300 rounded-2xl p-4 space-y-1 transition-all cursor-pointer"
                >
                  <div className="font-bold text-slate-900 text-sm group-hover:text-orange-700 transition-colors">{l.title}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{l.desc}</div>
                </a>
              ))}
            </div>
          </section>
        );
      })}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </a>
        <p className="text-[11px] text-slate-400">Не нашли нужную страницу? Напишите нам — менеджер подскажет.</p>
      </div>
    </div>
  );
};

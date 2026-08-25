import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Wallet, 
  Truck, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { siteConfig } from '../../siteConfig';

interface CabinetVideoShowcaseProps {
  onOpenLeadModal?: (requestType?: string) => void;
}

interface VideoProcess {
  id: number;
  title: string;
  shortTitle: string;
  videoSrc: string;
  icon: React.ElementType;
  description: string;
  points: string[];
}

export const CabinetVideoShowcase: React.FC<CabinetVideoShowcaseProps> = ({ onOpenLeadModal }) => {
  const [activeId, setActiveId] = useState<number>(0);

  const processes: VideoProcess[] = [
    {
      id: 0,
      title: 'Консолидация и получение',
      shortTitle: '1. Консолидация',
      videoSrc: '/consolidation.mp4',
      icon: Layers,
      description: 'Объединение товаров от разных поставщиков Китая в одну посылку, выбор жесткой упаковки и формирование накладной.',
      points: [
        'Сбор заказов от разных фабрик в единый груз',
        'Выбор упаковки: мешок, скотч, обрешетка',
        'Автоматический расчет веса и создание накладной'
      ]
    },
    {
      id: 1,
      title: 'Оформление заказа с 1688 / Таобао',
      shortTitle: '2. Выкуп с 1688',
      videoSrc: '/order.mp4',
      icon: ShoppingBag,
      description: 'Поиск товаров по каталогу 1688 прямо в кабинете, выбор параметров (цвет, размер, количество) и мгновенный выкуп.',
      points: [
        'Каталог 1688 с автоконвертацией цен в рубли',
        'Удобный выбор модификаций и партий',
        'Передача заказа байерам в Китае за 24 часа'
      ]
    },
    {
      id: 2,
      title: 'Пополнение баланса (СБП / Счет)',
      shortTitle: '3. Пополнение счёта',
      videoSrc: '/balance.mp4',
      icon: Wallet,
      description: 'Мгновенное пополнение юаневого или долларового счёта физлицами и юрлицами с прозрачной конвертацией по курсу дня.',
      points: [
        'Пополнение через СБП, карты или расчётный счёт',
        'Фиксация курса без скрытых комиссий',
        'Закрывающие документы для юрлиц и ИП'
      ]
    },
    {
      id: 3,
      title: 'Стадии движения и трекинг выкупа',
      shortTitle: '4. Трекинг заказа',
      videoSrc: '/status.mp4',
      icon: Truck,
      description: 'Прозрачный контроль каждого этапа: от выкупа у продавца до взвешивания на складе в Гуанчжоу и отправки в Россию.',
      points: [
        'Статусы: Оплачен → Выкуплен → Прибыл на склад → Отправлен',
        'Фотоотчёт и точные замеры габаритов на складе',
        'Прямой трек-номер для отслеживания пути по РФ'
      ]
    }
  ];

  const activeProcess = processes[activeId];
  const ActiveIcon = activeProcess.icon;

  return (
    <section className="py-8 my-6 bg-slate-50 rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>Личный кабинет</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Контроль всех этапов поставки в Личном Кабинете
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Наглядная демонстрация основных действий и отслеживания внутри личного кабинета Express Today.
          </p>
        </div>

        {/* 4 Process Switcher Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {processes.map((proc) => {
            const isActive = activeId === proc.id;
            const Icon = proc.icon;
            return (
              <button
                key={proc.id}
                onClick={() => setActiveId(proc.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm font-bold'
                    : 'bg-white hover:bg-slate-100/80 text-slate-700 border-slate-200 shadow-2xs'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-orange-600'}`} />
                <span className="text-xs sm:text-sm truncate">{proc.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Video & Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Video Player (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-200 aspect-video flex items-center justify-center shadow-inner">
                <video
                  key={activeProcess.videoSrc}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain"
                >
                  <source src={activeProcess.videoSrc} type="video/mp4" />
                  <source src="/4ren.mp4" type="video/mp4" />
                  <p className="p-4 text-white text-xs">Ваш браузер не поддерживает видео.</p>
                </video>
              </div>
            </div>

            {/* Description & Bullet points (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                <ActiveIcon className="w-4 h-4" />
                <span>{activeProcess.title}</span>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {activeProcess.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {activeProcess.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <a
                  href={siteConfig.clientCabinet.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Зарегистрироваться в кабинете</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

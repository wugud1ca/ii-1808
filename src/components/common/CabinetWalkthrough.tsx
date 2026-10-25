import React, { useState } from 'react';
import { withTrackingParams } from '../../utils/urlParams';
import { 
  UserCheck, 
  PackageCheck, 
  Camera, 
  CreditCard, 
  Box, 
  Truck, 
  Layers, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { siteConfig } from '../../siteConfig';
import { CabinetOrderMock } from '../../types';

export const CabinetWalkthrough: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'photos' | 'finance' | 'packing'>('orders');

  const mockOrder: CabinetOrderMock = {
    id: 'ET-2026-8891',
    title: 'Партия текстиля & куртки мужские (1688)',
    supplier: 'Foshan Xingke Clothing Co., Ltd.',
    status: 'warehouse_inspection',
    statusLabel: 'Проверено на складе Гуанчжоу (фото готовы)',
    itemsCount: 420,
    weightKg: 215,
    volumeM3: 1.15,
    photoCount: 9,
    totalCostRmb: 28400,
    estimatedDelivery: '14.08.2026',
    trackingNumber: 'ETD-889122',
    photos: [
      '/cabinet/w01.webp',
      '/cabinet/w02.webp',
      '/cabinet/w03.webp',
      '/cabinet/w04.webp',
      '/cabinet/w05.webp',
      '/cabinet/w06.webp',
      '/cabinet/w07.webp',
      '/cabinet/w08.webp',
      '/cabinet/w09.webp',
    ]
  };

  return (
    <section className="py-12 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 text-slate-900 rounded-3xl p-6 sm:p-10 border border-orange-200/80 shadow-xl my-10 overflow-hidden relative">
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-orange-200 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-700 text-sm font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Единая экосистема клиента</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Контролируйте заказ в личном кабинете
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-2xl">
              Прозрачные этапы выкупа, онлайн-фотоотчет со склада, точный вес, объем, финансовый баланс и управление доставкой 24/7.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={withTrackingParams(siteConfig.clientCabinet.loginUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-md shadow-orange-600/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Войти в ЛК</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={withTrackingParams(siteConfig.clientCabinet.registrationUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-orange-50 text-slate-800 font-bold text-sm px-4 py-3 rounded-xl border border-slate-300 transition-all cursor-pointer shadow-xs"
            >
              Зарегистрироваться
            </a>
          </div>
        </div>

        {/* Dashboard Tabs Preview */}
        <div className="bg-white rounded-2xl border border-orange-200 p-4 sm:p-6 shadow-md space-y-6">
          
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'orders' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Статусы и трекинг</span>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'photos' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Фотоотчет склада ({mockOrder.photoCount})</span>
            </button>

            <button
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'finance' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Баланс & Финансы</span>
            </button>

            <button
              onClick={() => setActiveTab('packing')}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'packing' ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>Упаковка & ТК в РФ</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'orders' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-sm text-orange-600 font-mono font-bold">{mockOrder.id}</div>
                  <h4 className="text-base font-bold text-slate-900">{mockOrder.title}</h4>
                  <div className="text-sm text-slate-600 mt-0.5">Поставщик: {mockOrder.supplier}</div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {mockOrder.statusLabel}
                  </span>
                </div>
              </div>

              {/* Steps timeline in LK */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm space-y-1">
                  <div className="text-slate-500">Выкуп у фабрики:</div>
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Выкуплен (24ч)
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm space-y-1">
                  <div className="text-slate-500">Приемка на складе:</div>
                  <div className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Прибыло на склад
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm space-y-1">
                  <div className="text-slate-500">Вес и Объем:</div>
                  <div className="font-bold text-slate-900">
                    {mockOrder.weightKg} кг / {mockOrder.volumeM3} м³
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm space-y-1">
                  <div className="text-slate-500">Ориентир прибытия:</div>
                  <div className="font-bold text-orange-600">{mockOrder.estimatedDelivery}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="text-sm text-slate-700">
                Каждая коробка вскрывается и проверяется на складском столе под камерами высокого разрешения:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {mockOrder.photos.map((src, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                    <img 
                      src={src} 
                      alt={`Инспекция фото ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent p-2.5 flex items-end justify-between text-xs text-white font-bold">
                      <span>Фото #{idx + 1}</span>
                      <span className="text-emerald-400 font-mono">Проверено ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-150 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-slate-600 font-medium">Текущий баланс счета:</div>
                <div className="text-2xl font-extrabold text-emerald-700">142 500 ₽</div>
                <div className="text-xs text-slate-500">Оплата по безналу / Пополнение в ЛК</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-slate-600 font-medium">Ожидают оплаты:</div>
                <div className="text-2xl font-extrabold text-amber-600">0 ₽</div>
                <div className="text-xs text-slate-500">Задолженностей по отправкам нет</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="text-slate-600 font-medium">Отчетность и акты:</div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5 pt-1">
                  <FileSpreadsheet className="w-5 h-5 text-orange-600" />
                  <span>Скачать УПД / ТОРГ-12 в 1 клик</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packing' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-150 text-sm">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Выбор типа упаковки:</div>
                <ul className="space-y-1.5 text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Деревянная обрешетка + уголки жесткости</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Влагозащитный мешок + скотч</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Вакуумное сжатие объема для текстиля</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Доставка по РФ:</div>
                <p className="text-slate-600">
                  Укажите адрес или выберите удобную транспортную компанию (СДЭК, Деловые Линии, ЖелДорЭкспедиция) или доставку до склада маркетплейса.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

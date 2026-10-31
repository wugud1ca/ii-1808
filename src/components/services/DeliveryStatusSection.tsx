import React from 'react';
import { Ship, Anchor, TrendingUp, Clock3, PackageCheck, Award, Route } from 'lucide-react';
import { DeliveryChart } from '../common/DeliveryChart';

interface DeliveryStatusSectionProps {
  onOpenLeadModal: (requestType?: string) => void;
}

export const DeliveryStatusSection: React.FC<DeliveryStatusSectionProps> = ({ onOpenLeadModal }) => (
  <div className="space-y-8">
    {/* Блок 1: официальные каналы доставки стабильны */}
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
      <div className="flex items-start gap-3">
        <div className="bg-emerald-100 rounded-xl p-2.5 shrink-0">
          <Ship className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Официальная доставка работает стабильно</h2>
          <p className="text-sm text-slate-500 mt-1">Авиа · Авто ускоренное · Авто обычное · Ж/Д · Море</p>
        </div>
      </div>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
        Все каналы официальной доставки работают в штатном режиме: грузы поступают клиентам{' '}
        <strong className="text-slate-900">без задержек, точно по выбранным тарифам</strong> и в согласованные сроки.
        Отправки идут ежедневно — от момента выкупа на фабрике в Китае до передачи получателю в России.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Clock3, title: 'Точно в срок', text: 'Сроки соответствуют выбранному тарифу и маршруту' },
          { icon: Route, title: 'Все направления', text: 'Авиа, авто, ж/д и море — без остановок' },
          { icon: PackageCheck, title: 'Статус онлайн', text: 'Каждый этап пути виден в личном кабинете' },
          { icon: Award, title: 'Персональный менеджер', text: 'Сопровождает партию до получения' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <item.icon className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900">{item.title}</div>
              <div className="text-[11px] text-slate-600 leading-snug mt-0.5">{item.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <Anchor className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Порт Новороссийск — временно недоступен</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
          Грузы, отправленные в направлении Новороссийска, перегружаются в пути и перенаправляются в Санкт-Петербург.
          Партии поступают получателям без потерь; если срок по такому отправлению сдвигается — мы заранее уведомляем
          каждого клиента о новом графике. Остальные направления работают без изменений.
        </p>
      </div>
    </section>

    {/* Блок 2: карго-доставка стабильна + график */}
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
      <div className="flex items-start gap-3">
        <div className="bg-orange-100 rounded-xl p-2.5 shrink-0">
          <TrendingUp className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Карго-доставка: кризис конца 2025 года позади</h2>
          <p className="text-sm text-slate-500 mt-1">Сроки вернулись к докризисному уровню</p>
        </div>
      </div>

      <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
        Карго-грузы идут стабильно. Влияние кризиса конца 2025 года полностью нивелировано:{' '}
        <strong className="text-slate-900">100% отправлений доставлены</strong> — включая проблемные партии сентября 2025.
        Средний срок карго-доставки вернулся к докризисному уровню и составляет{' '}
        <strong className="text-slate-900">21 день</strong>, максимальный срок сейчас — 54 дня вместо пиковых 303 дней
        в августе 2025.
      </p>

      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-900">Как грузы поступают в Россию</h3>
        <p className="text-xs text-slate-500">
          Максимальный, средний и минимальный срок доставки в днях за период февраль 2025 — август 2026.
          Листайте график по горизонтали, наведите или коснитесь графика, чтобы увидеть точные значения.
        </p>
        <DeliveryChart />
      </div>
    </section>

    {/* Блок 3: работаем давно и стабильно */}
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-lg shadow-orange-600/20">
      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Работаем давно — стабильно смотрим в будущее</h2>
          <p className="text-sm sm:text-base text-orange-50 leading-relaxed max-w-3xl">
            Express Today возит грузы из Китая для собственных нужд с 2005 года, а сервис для клиентов работает с 2015 года.
            Мы пережили не один кризис логистики — и каждый раз сохраняли грузы, сроки и доверие клиентов.
            Сейчас мы продолжаем развиваться: расширяем маршрутную сеть, наращиваем склад в Гуанчжоу (2000 м²)
            и совершенствуем личный кабинет.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: 'с 2015', label: 'работаем для клиентов' },
            { value: '10 000+', label: 'клиентов доверяют нам' },
            { value: '1 500+', label: 'заказов ежемесячно' },
            { value: '100 тонн', label: 'привозим каждый месяц' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
              <div className="text-xl sm:text-2xl font-black">{item.value}</div>
              <div className="text-[11px] sm:text-xs text-orange-100 mt-1 leading-snug">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onOpenLeadModal('Запрос по услуге: Международная доставка из Китая')}
            className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-sm"
          >
            Рассчитать доставку
          </button>
          <span className="text-xs text-orange-100">
            Ответим в течение рабочего дня и подберём оптимальный маршрут
          </span>
        </div>
      </div>

      <Ship className="absolute -right-8 -bottom-10 w-48 h-48 text-white/10 rotate-12" />
    </section>
  </div>
);

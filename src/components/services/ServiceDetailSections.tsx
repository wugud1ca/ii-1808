import React, { useState } from 'react';
import {
  UserCheck,
  Globe,
  Building,
  CheckCircle2,
  ShieldCheck,
  FileText,
  CreditCard,
  PackageCheck,
  Boxes,
  Truck,
  BarChart3,
  Layers,
  Cpu,
  Factory,
  FileSpreadsheet,
  ShoppingBag,
  Sparkles,
  Container,
  Lock,
  RefreshCw,
  FileCheck2,
  Receipt,
  Image as ImageIcon,
  DollarSign,
  ShieldAlert,
  Wrench,
  Cog,
  ChevronRight,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface SectionProps {
  onOpenLeadModal: (requestType?: string) => void;
}

/* =========================================================================
   1. ПОИСК ТОВАРА ИЛИ ФАБРИКИ (Supplier Search)
   ========================================================================= */
export const SupplierSearchSection: React.FC<SectionProps> = ({ onOpenLeadModal }) => {
  return (
    <div className="space-y-8">
      {/* Intro Header Card */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-blue-800/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Персональное сопровождение и поиск в КНР</h2>
            <p className="text-xs sm:text-sm text-blue-200">
              Ваш персональный ВЭД-менеджер в РФ и собственный штат китайских байеров в Гуанчжоу
            </p>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          Поиск надежного производителя в Китае — это не просто просмотр интернет-каталогов, а глубокий процесс переговорной работы, оценки юридической чистоты и проверки реальных производственных мощностей. За каждым нашим клиентом закрепляется <strong>персональный профессиональный ВЭД-менеджер</strong>, а в Гуанчжоу к вашей задаче сразу подключается <strong>наш собственный штат китайских байеров — носителей языка</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-300 text-sm">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Персональный ВЭД-менеджер (РФ)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Формулирует грамотное техническое задание (ТЗ), переводит спецификации, просчитывает предварительную себестоимость с доставкой и контролирует каждый шаг.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-300 text-sm">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Штат китайских байеров (Гуанчжоу)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Носители языка с опытом B2B-переговоров. Звонят на фабрики, выбивают цены без наценок посредников, договариваются об эксклюзиве и спец-условиях.
            </p>
          </div>
        </div>
      </div>

      {/* Real Process Algorithm */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Factory className="w-5 h-5 text-blue-600" />
          <span>Как поиск фабрики и товара происходит в реальности:</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Формирование ТЗ и критериев поиска</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ваш личный менеджер помогает четко сформировать запрос: требуемые материалы, размеры, комплектацию, сертификационные требования, целевую стоимость EXW/FOB и желаемые объемы партии (MOQ).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Поиск по закрытым базам и пром-кластерам КНР</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Задействуем не только публичные сайты, но и закрытые китайские реестры производителей, контакты с промышленных выставок (Кантонская ярмарка) и профильные кластеры (Гуанчжоу, Фошань, Нинбо, Иу, Шэньчжэнь).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Прямые переговоры штатных байеров с фабриками</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Наши китайские специалисты в Гуанчжоу связываются с руководством фабрик на китайском языке. Выбивают максимально низкую цену, обсуждают брендирование (OEM/ODM) и минимальные партии.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              4
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Аудит юридического лица и лицензий КНР</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Проверяем учредительные документы (营业执照), уставный капитал, наличие экспортеров-посредников, историю судебных разбирательств и реальность производственных цехов.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
              5
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">Заказ, инспекция и экспресс-доставка образцов</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Заказываем тестовые образцы, принимаем на нашем складе в Гуанчжоу, проводим детальную фото/видеофиксацию, замеры и отправляем экспресс-авиа вам в РФ для утверждения перед запуском основной партии.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => onOpenLeadModal('Поиск товара и фабрики в Китае')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all cursor-pointer text-sm"
          >
            <UserCheck className="w-5 h-5" />
            <span>Назначить личного менеджера для поиска</span>
          </button>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   2. ВЫКУП С 1688, TAOBAO, POIZON (Buyout Platforms & Client Cabinet)
   ========================================================================= */
export const BuyoutPlatformSection: React.FC<SectionProps> = ({ onOpenLeadModal }) => {
  const [activeTab, setActiveTab] = useState<'catalog1688' | 'orderInvoice' | 'incoming' | 'tracking' | 'warehousePhotos'>('catalog1688');

  return (
    <div className="space-y-8">
      {/* Main Banner */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-red-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider text-white">
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
          Интеграция 1688 в Личный Кабинет
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Выкуп с 1688, Taobao, POIZON и любого поставщика КНР
        </h2>
        <p className="text-sm sm:text-base text-orange-100 leading-relaxed">
          Оптовая китайская платформа <strong>1688.com</strong> (которая создана исключительно для внутреннего рынка Китая) встроена непосредственно в Личный Кабинет клиента Express Today с полным переводом на русский язык. Вы можете легко находить товары самостоятельно или поручить эту задачу вашему менеджеру.
        </p>
      </div>

      {/* Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            1688
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Каталог 1688 на русском</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Поиск товаров по фото или названию прямо в вашем ЛК. Прямые цены фабрик без наценок.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
            <Receipt className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Выкуп по Инвойсу или ссылке</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Принимаем любые ссылки с Taobao, POIZON, Xianyu или готовые счета (Invoice) от китайских фабрик.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <PackageCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Сервис «Входящая посылка»</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Если вы выкупаете сами — наш склад в КНР примет груз, проверит его и перенаправит по вашему заданию.
          </p>
        </div>
      </div>

      {/* Full Process Lifecycle in LK */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-600" />
          <span>Сквозное отслеживание и финансовый учет в Личном Кабинете:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">Шаг 1. Создание и Пополнение</span>
            <h4 className="font-bold text-slate-900 text-sm">Создание заказа & Пополнение ЛК</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Вы добавляете товары в корзину или создаете «Входящую посылку». Пополняете баланс в ЛК удобным способом по фиксированному курсу.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">Шаг 2. Выкуп за 24 часа</span>
            <h4 className="font-bold text-slate-900 text-sm">Оперативный выкуп байером</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Наш байер переводит юани продавцу, связывается с фабрикой и отслеживает внутренний трек-номер доставки до нашего склада.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">Шаг 3. Приемка и Досмотр</span>
            <h4 className="font-bold text-slate-900 text-sm">Приемка, Досмотр и Фотоотчет</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Приемка на складе в Гуанчжоу. Вскрытие, пересчет, проверка брака. Фото/видеоотчет подгружается прямо в карточку выкупа в ЛК.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
            <span className="text-xs font-black text-orange-600 uppercase tracking-wider">Шаг 4. Консолидация & Отправка</span>
            <h4 className="font-bold text-slate-900 text-sm">Консолидация и Отправка в РФ</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Объединяем посылки от разных фабрик в одну прочную упаковку. Оформляем единый трек-номер и отправляем согласованной логистикой.
            </p>
          </div>
        </div>

        {/* Financial Archive Notice */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Прозрачная финансовая отчетность за весь период</span>
            </div>
            <p className="text-xs text-slate-300">
              Все транзакции, выкупы, взвешивания, акты инспекций и чеки архивируются в вашем ЛК. Вы можете за 1 клик сформировать детальный финансовый отчет за любой отрезок времени.
            </p>
          </div>
          <button
            onClick={() => onOpenLeadModal('Регистрация и консультация по ЛК')}
            className="shrink-0 bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Открыть ЛК
          </button>
        </div>
      </div>

      {/* Interactive LK Process Screenshots Block / Mockup */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white space-y-6 border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              Интерфейс Личного Кабинета Express Today
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">Процессы выкупа и контроля в ЛК</h3>
          </div>

          {/* Process Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('catalog1688')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'catalog1688'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1688 в ЛК
            </button>
            <button
              onClick={() => setActiveTab('orderInvoice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orderInvoice'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Выкуп / Инвойс
            </button>
            <button
              onClick={() => setActiveTab('incoming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'incoming'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Входящая посылка
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Трекинг & Отчет
            </button>
            <button
              onClick={() => setActiveTab('warehousePhotos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'warehousePhotos'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Фотоотчет со склада
            </button>
          </div>
        </div>

        {/* Tab Content Mockups (Placeholders for real screenshots) */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 sm:p-6 space-y-4">
          {activeTab === 'catalog1688' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="font-bold text-orange-400">Модуль: «Каталог 1688 в ЛК с переводом»</span>
                <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-[11px]">Интеграция по API</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="bg-orange-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">1688.com</span>
                    <span>Поиск: «Беспроводные наушники ANC с шумоподавлением»</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold">Найдено 428 фабрик</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <img
                      src="/lk1688/lk1688-01.webp"
                      alt="Наушники TWS Pro4 — карточка товара в каталоге 1688"
                      loading="lazy"
                      className="w-full h-36 object-cover rounded-lg border border-slate-800"
                    />
                    <div className="text-xs font-bold text-white truncate">Наушники TWS Pro4</div>
                    <div className="text-xs text-amber-400 font-bold">¥ 38.50 (~480 ₽)</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <img
                      src="/lk1688/lk1688-03.webp"
                      alt="Смарт-часы ZONGXIN — карточка товара в каталоге 1688"
                      loading="lazy"
                      className="w-full h-36 object-cover rounded-lg border border-slate-800"
                    />
                    <div className="text-xs font-bold text-white truncate">Смарт-часы ZONGXIN</div>
                    <div className="text-xs text-amber-400 font-bold">¥ 65.00 (~810 ₽)</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <img
                      src="/lk1688/lk1688-02.webp"
                      alt="Портативный пауэрбанк 20000mAh — карточка товара в каталоге 1688"
                      loading="lazy"
                      className="w-full h-36 object-cover rounded-lg border border-slate-800"
                    />
                    <div className="text-xs font-bold text-white truncate">Портативный Пауэрбанк 20000mAh</div>
                    <div className="text-xs text-amber-400 font-bold">¥ 42.00 (~525 ₽)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orderInvoice' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="font-bold text-blue-400">Модуль: «Оформление выкупа по Инвойсу или Ссылке»</span>
                <span className="bg-blue-900/40 text-blue-300 border border-blue-700/50 px-2.5 py-0.5 rounded-full text-[11px]">Выкуп за 24ч</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400">Номер заказа в ЛК:</span>
                    <p className="font-bold text-white">#EXP-88492-CN</p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400">Статус выкупа:</span>
                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Оплачен продавцу (Гуанчжоу)
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-center py-4">
                  <div className="flex justify-center">
                    <img
                      src="/lk-screens/invoice-01.webp"
                      alt="Скриншот карточки выкупа и инвойса в личном кабинете Express Today"
                      loading="lazy"
                      className="w-full max-w-md rounded-xl border border-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'incoming' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="font-bold text-emerald-400">Модуль: «Оформление Входящей Посылки»</span>
                <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full text-[11px]">Склад Гуанчжоу</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3 text-xs">
                <p className="text-slate-300">
                  Вы выкупили товар самостоятельно? Укажите трек-номер по Китаю, и наш склад примет, замерит, проверит и консолидирует груз по вашему регламенту.
                </p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-center py-4">
                  <div className="flex justify-center">
                    <img
                      src="/lk-screens/incoming-01.webp"
                      alt="Скриншот формы «Входящая посылка» в личном кабинете Express Today"
                      loading="lazy"
                      className="w-full max-w-md rounded-xl border border-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="font-bold text-amber-400">Модуль: «Трекинг, Архив и Финансовые Отчеты»</span>
                <span className="bg-amber-900/40 text-amber-300 border border-amber-700/50 px-2.5 py-0.5 rounded-full text-[11px]">Выгрузка XLS/PDF</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-300">Сводка за периоды: 01.01.2025 — 09.08.2026</span>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-lg text-xs">
                    Скачать финансовый отчет (.XLSX)
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-center py-4">
                  <div className="flex justify-center">
                    <img
                      src="/lk-screens/tracking-01.webp"
                      alt="Скриншот раздела «Мои заказы»: трекинг, архив и финансовые отчеты в личном кабинете Express Today"
                      loading="lazy"
                      className="w-full max-w-md rounded-xl border border-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'warehousePhotos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span className="font-bold text-emerald-400">Модуль: «Фотоотчет приемки на складе Гуанчжоу»</span>
                <span className="bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full text-[11px]">Фото готовы в ЛК</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <figure className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                  <img
                    src="/warehouse/wh01.webp"
                    alt="Аккумуляторы 18650 — фотоотчет приемки на складе"
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-lg border border-slate-800"
                  />
                  <figcaption className="text-xs text-slate-300 text-center">Аккумуляторы 18650</figcaption>
                </figure>
                <figure className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                  <img
                    src="/warehouse/wh02.webp"
                    alt="Спортивные смарт-часы — фотоотчет приемки на складе"
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-lg border border-slate-800"
                  />
                  <figcaption className="text-xs text-slate-300 text-center">Спортивные смарт-часы</figcaption>
                </figure>
                <figure className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2">
                  <img
                    src="/warehouse/wh03.webp"
                    alt="Наушники AirPods в коробке — фотоотчет приемки на складе"
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-lg border border-slate-800"
                  />
                  <figcaption className="text-xs text-slate-300 text-center">Наушники AirPods</figcaption>
                </figure>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Так выглядит фотоотчет в личном кабинете: приемка, вскрытие, пересчет и проверка товара фиксируются на фото и подгружаются прямо в карточку выкупа.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   3. ПРОВЕРИТЬ И ОБЪЕДИНИТЬ ТОВАРЫ (Inspection & Consolidation)
   ========================================================================= */
export const ConsolidationInspectionSection: React.FC<SectionProps> = ({ onOpenLeadModal }) => {
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Собственный склад в Гуанчжоу (2000 м²)
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Проверка качества, фотоотчет и консолидация грузов
        </h2>
        <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
          Исключите риск получения брака или пересорта! На нашем складе в Гуанчжоу каждая поступившая коробка вскрывается, пересчитывается и детально инспектируется. Подробный фото- и видеоотчет моментально отображается в карточке выкупа или посылки в вашем Личном Кабинете.
        </p>
      </div>

      {/* Inspection Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Подробный фото- и видеоотчет в ЛК</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Фотографируем общий вид партии, маркировки, замеры габаритов, бирки, упаковку и конкретные изделия на предмет дефектов. Все файлы сразу видны в вашей карточке в ЛК.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Boxes className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Консолидация от 10+ фабрик в 1 отправку</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Бесплатно храним товары на складе, пока собираются все позиции от разрозненных поставщиков. Объединяем их в единую прочную упаковку (обрешетка, углы, фанера) для экономной доставки.
          </p>
        </div>
      </div>

      {/* Full Process Tracking in LK */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <span>Прозрачный цикл контроля и учета в Личном Кабинете:</span>
        </h3>

        <div className="space-y-3 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
            <div>
              <strong>Создание заказа и пополнение ЛК:</strong> Вы оформляете заявку или регистрируете входящую посылку, пополняя баланс в ЛК.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
            <div>
              <strong>Выкуп и Досмотр на складе:</strong> Товар выкупается, поступает в Гуанчжоу, проходити полный досмотр со сплошным или выборочным фотоотчетом.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
            <div>
              <strong>Консолидация и Упаковка:</strong> Все товары объединяются, упаковываются в усиленные короба с влагозащитой и обрешеткой, присваивается трек-номер.
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">4</span>
            <div>
              <strong>Отправка, Финансы и Архив:</strong> Все действия, акты приемки и финансовые расходы фиксируются и архивируются. В любой момент можно выгрузить сводный финансовый отчет.
            </div>
          </div>
        </div>

        {/* Placeholder Block for Screenshots */}
        <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-indigo-400 text-sm flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Отображение фотоотчета и инспекции в ЛК
            </span>
            <span className="text-xs text-slate-400">Склад Гуанчжоу</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <img
                src="/lk-screens/inspection-01.webp"
                alt="Скриншот карточки инспекции с фотофиксацией в личном кабинете"
                loading="lazy"
                className="w-full rounded-lg border border-slate-800"
              />
              <p className="text-center text-xs text-slate-400">Карточка инспекции с фотофиксацией в ЛК</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <img
                src="/lk-screens/consolidation-01.webp"
                alt="Скриншот объединения коробов и весогабаритного акта в личном кабинете"
                loading="lazy"
                className="w-full rounded-lg border border-slate-800"
              />
              <p className="text-center text-xs text-slate-400">Объединение коробов и весогабаритный акт в ЛК</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   4. ОФИЦИАЛЬНАЯ «БЕЛАЯ» ПОСТАВКА (Пошаговое руководство по белой схеме ВЭД)
   ========================================================================= */
export const WhiteDeliveryAlgorithmSection: React.FC<SectionProps> = ({ onOpenLeadModal }) => {
  const stepsData = [
    {
      step: 1,
      title: 'Глубокий анализ товара: Фундамент сделки',
      subtitle: 'Методологический анализ характеристик и связь с экономикой поставки',
      badge: 'Анализ ТН ВЭД & Риски',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            В профессиональном ВЭД любая закупка начинается не с инвойса, а с методологического анализа. Каждая физическая характеристика товара напрямую влияет на таможенную пошлину, НДС и перечень разрешительных документов.
          </p>

          {/* Table: Связь характеристик товара и экономики поставки */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Связь характеристик товара и экономики поставки</span>
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Данные о товаре</th>
                    <th className="p-3.5">Влияние на сделку и таможенные платежи</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Состав материала (%)</td>
                    <td className="p-3.5 text-slate-700">Определение точного 10-значного кода ТН ВЭД и ставки ввозной пошлины (от 0% до 15%+).</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Возрастная категория</td>
                    <td className="p-3.5 text-slate-700">Разграничение между «детским» ассортиментом (высокий риск, жесткий ТР ТС 007/2011, строгий фито/санконтроль) и «взрослым».</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Электроника (BT / Wi-Fi)</td>
                    <td className="p-3.5 text-slate-700">Необходимость оформления Нотификации ФСБ и подтверждения характеристик шифрования/криптографии.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Наличие элементов питания</td>
                    <td className="p-3.5 text-slate-700">Ограничения по авиаперевозкам (класс опасного груза UN3480/UN3481, паспорт безопасности MSDS) и спецмаркировка.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Габариты и тип упаковки</td>
                    <td className="p-3.5 text-slate-700">Расчет плотности, логистического плеча и выбор между LCL (сборный груз) и FCL (целый контейнер 20/40ft).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Правило менеджера Callout */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 space-y-1.5 shadow-xs">
            <div className="flex items-center gap-2 font-black text-amber-950 text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <span>«Правило менеджера Express Today»:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
              Использование общих наименований (например, «лампа» или «чехол») — это кратчайший путь к административному правонарушению (ст. 16.2 КоАП РФ «Недостоверное декларирование»). Код ТН ВЭД определяется исходя из <strong>фактических физических характеристик на дату декларирования</strong>, а не по названию в прайс-листе поставщика. Ошибка даже в одной цифре кода может привести к задержке всей партии, аресту и доначислению многомиллионных платежей.
            </p>
          </div>
        </div>
      )
    },
    {
      step: 2,
      title: 'Юридическая схема работы: Распределение ролей',
      subtitle: 'Выбор модели определяет ответственность перед ФТС и риски на границе',
      badge: 'Договор поставки vs ТЭО',
      icon: <Building className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Выбор юридической модели взаимодействия определяет, кто выступает декларантом перед государством, кто проходит валютный контроль и кто берет на себя коммерческие риски при таможенном оформлении.
          </p>

          {/* Both models side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-300 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-emerald-950">Модель 1: Поставка «под ключ» (Договор купли-продажи РФ)</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900">Рекомендуем</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Модель, при которой <strong>Express Today выступает официальным импортером</strong>. Вы покупаете не абстрактную «услугу перевозки», а готовый коммерческий результат на территории РФ с оплатой в рублях с НДС.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-1">
                  <strong className="text-emerald-900 block font-bold">Таможенные риски:</strong>
                  <span className="text-slate-600">Все риски отказа в выпуске товара таможней и КТС остаются на нашей компании.</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-1">
                  <strong className="text-emerald-900 block font-bold">Закрывающие документы:</strong>
                  <span className="text-slate-600">УПД со статусом «1» (с НДС 20%), номер ГТД в графе 11, сертификаты и паспорт качества.</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-300 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-blue-950">Модель 2: Транспортная экспедиция (Договор ТЭО)</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900">Импортер — заказчик</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Импортером выступает <strong>ваша компания (ООО или ИП)</strong>. Express Today обеспечивает международную логистику, сопровождение сертификации и таможенного брокера.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                  <strong className="text-blue-900 block font-bold">Валютный контроль:</strong>
                  <span className="text-slate-600">Ваша организация ведет паспорт сделки и несет ответственность перед банком и ФТС.</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100 space-y-1">
                  <strong className="text-blue-900 block font-bold">Преимущество для бренда:</strong>
                  <span className="text-slate-600">Формирование собственной чистой импортной истории в реестрах ФТС России.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 3,
      title: 'Переговоры и роль Фапьяо: Легальный экспорт из КНР',
      subtitle: 'Государственный налоговый документ КНР как основа легального вывоза',
      badge: 'Фапьяо (发票) & Торговый Дом',
      icon: <Receipt className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Для легального вывоза товара из Китая необходимо документальное подтверждение внутренней закупки. Ключевым документом является <strong>Фапьяо (发票)</strong> — официальный налоговый инвойс государственного образца КНР. В нашей схеме <strong>Торговый дом Express Today в Китае</strong> выкупает товар у фабрики, получает Фапьяо и становится официальным экспортером.
          </p>

          {/* Инсайт эксперта */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white space-y-2 border border-emerald-800/60 shadow-md">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Инсайт эксперта ВЭД:</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed italic">
              «Наличие двух цен от китайского поставщика (с Фапьяо и без него) отражает реальный статус его экспортной лицензии и прозрачность налогового учета. Официальная закупка с Фапьяо — это ваш единственный билет на легальный экспорт из КНР; без него доказательство контрактной стоимости товара для российской таможни становится практически невозможным».
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">1. Выкуп Торговым домом</span>
              <p className="text-slate-600">Перечисление средств с корпоративного счета Торгового дома на фабрику.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">2. Получение Фапьяо</span>
              <p className="text-slate-600">Фабрика регистрирует продажу в налоговой службе КНР и выписывает счет-фактуру.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">3. Экспортная декларация</span>
              <p className="text-slate-600">Беспрепятственное таможенное оформление экспорта в портах и на терминалах Китая.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 4,
      title: 'Ввоз образцов и сертификация: Испытания перед стартом',
      subtitle: 'Легитимные разрешительные документы через аккредитованные лаборатории',
      badge: '5 образцов для ЕАЭС',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Сертификация в «белой» схеме — это строго регламентированный государственный процесс, полностью исключающий использование фиктивных протоколов и «серых» сертификатов. Для проведения реальных лабораторных испытаний по стандартам ЕАЭС требуется предоставить <strong>5 идентичных единиц товара</strong> (одного артикула, состава материала и цвета).
          </p>

          {/* Table: Способы ввоза образцов */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Сравнение способов легального ввоза образцов для испытаний</span>
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Способ ввоза</th>
                    <th className="p-3.5">Назначение</th>
                    <th className="p-3.5">Стратегический приоритет</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Авиадоставка (экспресс)</span>
                    </td>
                    <td className="p-3.5 text-slate-700">Срочный запуск новой товарной линейки или сезонного товара.</td>
                    <td className="p-3.5 font-bold text-emerald-700">Максимальная скорость выхода на рынок (7–10 дней).</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Автодоставка (сборный груз)</span>
                    </td>
                    <td className="p-3.5 text-slate-700">Плановое расширение товарного ассортимента.</td>
                    <td className="p-3.5 font-bold text-blue-700">Экономия бюджета при 100% сохранении легальности.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 вида разрешительных документов */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="font-bold text-emerald-950 text-sm">Сертификат соответствия</span>
              <p className="text-slate-600 leading-relaxed">
                Для технически сложных или «чувствительных» категорий: детские товары (ТР ТС 007/2011), игрушки (ТР ТС 008/2011), бытовая электротехника.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-950 text-sm">Декларация о соответствии (ДС)</span>
              <p className="text-slate-600 leading-relaxed">
                Для товаров с умеренным риском безопасности: взрослая одежда (2-3 слой), обувь, мебель, хозтовары, посуда.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-950 text-sm">СГР (Свидетельство госрегистрации)</span>
              <p className="text-slate-600 leading-relaxed">
                Для продукции, подлежащей санитарно-эпидемиологическому надзору: косметика, бытовая химия, средства гигиены.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 5,
      title: 'Оплата товара и НДС при импорте: Финансовая чистота',
      subtitle: 'Прозрачный денежный поток и учет налоговых изменений 2025–2026 гг.',
      badge: 'НДС 20% & Реформа УСН 60 млн',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Денежный поток в легальной «белой» схеме движется строго по безналичному расчету: от вашего расчетного счета в РФ импортеру, далее через Торговый дом на официальный корпоративный счет завода в Китае.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Ввозной НДС (20%) на таможне</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Обязательный платеж, который уплачивается на Единый таможенный счет ФТС до фактического выпуска товара. Рассчитывается от таможенной стоимости груза с учетом пошлины.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs sm:text-sm">
                <Receipt className="w-4 h-4 text-blue-600" />
                <span>НДС при реализации в РФ</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Налог, возникающий при дальнейшей продаже продукции оптом, в розницу или через маркетплейсы (WB, Ozon, Я.Маркет).
              </p>
            </div>
          </div>

          {/* Внимание к правилам 2025-2026 гг */}
          <div className="p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-slate-900 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-black text-amber-950 text-xs sm:text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Внимание к правилам налоговой реформы 2025–2026 гг.:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
              Для компаний и ИП на УСН обязанность исчисления НДС наступает при достижении порога годового дохода в <strong>60 миллионов рублей</strong>. В зависимости от выбранной налоговой стратегии (льготные спецставки 5%, 7% без права на вычет либо стандартная ставка 20% с полным правом на вычет), ввозной НДС может либо <strong>включаться в себестоимость товара</strong>, либо <strong>приниматься к вычету</strong> для оптимизации налоговой нагрузки.
            </p>
          </div>
        </div>
      )
    },
    {
      step: 6,
      title: 'Складская логистика и маркировка: Проверка перед границей',
      subtitle: 'Хабы в Фошане и Иу: весогабаритный контроль, КИЗ и адресные ярлыки',
      badge: 'Фошань / Иу & Честный Знак',
      icon: <Boxes className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Товар поступает на собственные консолидационные склады Express Today в <strong>Фошане</strong> или <strong>Иу</strong>. Здесь происходит материальная и физическая проверка сделки до пересечения границы.
          </p>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <PackageCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Вскрытие коробов и весогабаритный контроль:</strong>
                <span className="text-slate-600">Сверка фактического веса брутто/нетто и объема с данными инвойса и упаковочного листа (Packing List).</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Маркировка «Честный знак» (Data Matrix):</strong>
                <span className="text-slate-600">Нанесение кодов КИЗ на каждую единицу товара и групповые короба. Обязательное государственное требование системы прослеживаемости.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <Layers className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">Маркировка грузовых мест (нумерация коробов):</strong>
                <span className="text-slate-600">Каждому коробу присваивается уникальный номер (например, «3 из 15»). Это позволяет осуществлять удаленное поштучное управление грузом и полностью исключает пересорт на границе.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 7,
      title: 'Международная доставка: Выбор маршрута',
      subtitle: 'Баланс оборачиваемости капитала, маржинальности и типа упаковки',
      badge: 'Море / Авто / ЖД',
      icon: <Truck className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Тип транспорта подбирается исходя из математического баланса оборачиваемости оборотного капитала, весогабаритных характеристик и целевой маржинальности продукции.
          </p>

          {/* Table: Сопоставление видов доставки */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Вид транспорта</th>
                  <th className="p-3.5">Ключевые характеристики</th>
                  <th className="p-3.5">Оптимальный формат груза</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">Морская доставка (Море)</td>
                  <td className="p-3.5 text-slate-700">Максимальная экономия на себестоимости единицы, длинный срок (35–50 дней).</td>
                  <td className="p-3.5 font-bold text-emerald-700">FCL (целый контейнер 20ft / 40ft HQ)</td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">Автодоставка (Фура)</td>
                  <td className="p-3.5 text-slate-700">Оптимальная гибкость маршрутов, средние сроки (18–25 дней), высокая надежность.</td>
                  <td className="p-3.5 font-bold text-emerald-700">LCL (сборный груз от 100 кг) и FCL</td>
                </tr>
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">Прямой Ж/Д поезд</td>
                  <td className="p-3.5 text-slate-700">Стабильность расписания, независимость от погодных условий на границе.</td>
                  <td className="p-3.5 font-bold text-emerald-700">Для крупных регулярных партий и оборудования</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      step: 8,
      title: 'Таможенная очистка и работа с КТС: Прохождение контроля',
      subtitle: 'Подача ДТ, система управления рисками (СУР) и финансовый залог',
      badge: 'КТС & Возврат обеспечения',
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            На таможенном посту подается <strong>Декларация на товары (ДТ)</strong>. Таможенный орган проверяет соответствие заявленных сведений реальности через государственную <strong>Систему управления рисками (СУР)</strong>.
          </p>

          {/* Инсайт для клиента: Работа с КТС */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300/80 space-y-3">
            <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Инсайт для клиента: Как устроена работа с КТС (Корректировка таможенной стоимости)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Если таможня считает контрактную стоимость товара ниже среднего индекса по профилю риска, она назначает дополнительную проверку стоимости. В этом случае возникает <strong>Обеспечение уплаты таможенных платежей</strong> — «временный залог», который блокируется на счете ФТС. Это <strong>не штраф</strong>, а установленная законом мера контроля.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1">
                <strong className="text-amber-950 block font-bold">Срок регламентной проверки:</strong>
                <span className="text-slate-700">От 60–90 до 130 дней по законодательству ЕАЭС.</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1">
                <strong className="text-amber-950 block font-bold">Стоимость и возврат:</strong>
                <span className="text-slate-700">Подготовка экспертного пакета доказательств для КТС стоит <strong>30 000 руб.</strong> (фиксированная часть). После успешного подтверждения стоимости залог возвращается в полном объеме на ваш баланс.</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      step: 9,
      title: 'Получение товара и закрывающие документы',
      subtitle: 'Приемка, подписание УПД и регламент фиксации расхождений',
      badge: 'УПД, ДТ & Чек-лист 5/5',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            После выпуска товара вы получаете очищенный груз на складе в Москве или с доставкой в ваш город и <strong>Универсальный передаточный документ (УПД)</strong>. Подписание УПД — это юридический акт признания внешнеторговой сделки исполненной в полном объеме.
          </p>

          {/* Table: Действия при выявлении расхождений */}
          <div className="space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Действия при выявлении расхождений при приемке</span>
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Тип недостатка</th>
                    <th className="p-3.5">Описание</th>
                    <th className="p-3.5">Регламентный срок фиксации</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Явные недостатки</td>
                    <td className="p-3.5 text-slate-700">Повреждение транспортной упаковки, нарушение пломб, недостача грузовых мест.</td>
                    <td className="p-3.5 font-bold text-red-600">Немедленно в момент приемки с составлением акта ТОРГ-2.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">Скрытые недостатки</td>
                    <td className="p-3.5 text-slate-700">Внутренний производственный брак фабрики, дефекты пайки или сборки.</td>
                    <td className="p-3.5 font-bold text-slate-800">В сроки, строго указанные в договоре поставки.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10">
      {/* Manifesto Hero Card */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 border border-emerald-800/60 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Экспертное руководство Express Today
          </div>
          
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Путь к легальному импорту: Пошаговое руководство по «белой» схеме ВЭД из Китая
          </h2>
          
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-4xl leading-relaxed">
            Переход на «белую» схему импорта — это не просто вопрос соблюдения закона, это <strong>стратегическое решение</strong>, превращающее внешнеэкономическую деятельность из источника рисков в фундамент для масштабирования бизнеса. Работа в легальном поле открывает двери к сотрудничеству с крупнейшими ритейлерами, защищает ваши банковские активы от блокировок по 115-ФЗ и обеспечивает абсолютную юридическую чистоту каждой единицы товара.
          </p>

          {/* 3 Synchronized Flows */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-300 font-bold text-xs uppercase tracking-wider block">1. Товарный поток</span>
              <p className="text-xs text-slate-200">От цеха фабрики КНР через хабы в Фошане/Иу до склада в РФ с маркировкой мест.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-300 font-bold text-xs uppercase tracking-wider block">2. Денежный поток</span>
              <p className="text-xs text-slate-200">Безналичный расчет в рублях/юанях через Торговый дом с получением налогового Фапьяо.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-emerald-300 font-bold text-xs uppercase tracking-wider block">3. Документарный поток</span>
              <p className="text-xs text-slate-200">Синхронизация ДТ (ГТД), честных сертификатов ЕАЭС, Честного Знака и УПД с НДС 20%.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Line-by-Line 9 Steps Container */}
      <div className="space-y-6">
        <div className="space-y-1 border-b border-slate-200 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Методология ВЭД</span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-950">9 шагов легальной поставки от идеи до склада</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Последовательный маршрут синхронизации товарных, финансовых и документарных потоков
          </p>
        </div>

        {/* Quick Nav Anchor Bar */}
        <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 px-2">Быстрый переход:</span>
          {stepsData.map((s) => (
            <a
              key={s.step}
              href={`#white-step-${s.step}`}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-600 hover:text-white text-slate-700 font-semibold border border-slate-200/80 transition-colors shadow-2xs"
            >
              Шаг {s.step}
            </a>
          ))}
        </div>

        {/* Vertical List of all 9 steps in consecutive order */}
        <div className="space-y-6">
          {stepsData.map((s) => (
            <div 
              key={s.step} 
              id={`white-step-${s.step}`}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 space-y-5 shadow-xs hover:border-emerald-300 transition-colors relative overflow-hidden"
            >
              {/* Header of Step */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-base sm:text-lg shrink-0 shadow-sm">
                    {s.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Шаг {s.step} • {s.badge}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-xl font-black text-slate-900 mt-0.5">
                      {s.title}
                    </h4>
                  </div>
                </div>
                <div className="text-xs text-slate-500 italic pl-14 sm:pl-0 sm:text-right">
                  {s.subtitle}
                </div>
              </div>

              {/* Step Content */}
              <div className="pt-1">
                {s.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Pillar Success Checklist Card */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-emerald-700/50 shadow-xl">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Стандарт качества Express Today</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Чек-лист успешной «белой» поставки:</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            5 фундаментальных критериев полной юридической безопасности и прозрачности
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">1</span>
              <span>Техническая полнота</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-7">
              Глубокое описание товара исключает двоякую трактовку кода ТН ВЭД таможенными инспекторами.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">2</span>
              <span>Валидность разрешительной документации</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-7">
              Сертификаты и ДС оформлены в аккредитованных лабораториях на базе 5 реально ввезенных образцов.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">3</span>
              <span>Собственные складские хабы (Фошань / Иу)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-7">
              Консолидация, весогабаритный аудит и маркировка «Честный знак» / номеров мест («3 из 15») прошли до границы.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">4</span>
              <span>Налоговый комплаенс 2025–2026</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-7">
              Ввозной НДС 20% учтен с учетом лимита выручки УСН в 60 млн руб. (включение в себестоимость или к вычету).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/10 space-y-1.5 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">5</span>
              <span>Абсолютная документарная чистота</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed pl-7">
              На руках у вашей бухгалтерии полный неразрывный архив: Декларация на товары (ДТ/ГТД), УПД с выделенным НДС и легитимные протоколы испытаний.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center border-t border-white/10 space-y-3">
          <p className="text-xs sm:text-sm text-emerald-200 max-w-xl mx-auto font-medium">
            «Белая» схема — это единственный путь к созданию капитализируемого и безопасного бизнеса, готового к любым проверкам и масштабированию.
          </p>
          <button
            onClick={() => onOpenLeadModal('Заявка на расчет белой схемы ВЭД (пошаговое руководство)')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all cursor-pointer text-sm active:scale-98"
          >
            <ShieldCheck className="w-5 h-5 text-slate-950" />
            <span>Рассчитать легальную поставку с ВЭД-экспертом</span>
          </button>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   5. ПОДГОТОВИТЬ ТОВАР ДЛЯ МАРКЕТПЛЕЙСА (Marketplace Fulfillment)
   ========================================================================= */
export const MarketplaceFulfillmentSection: React.FC<SectionProps> = ({ onOpenLeadModal }) => {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-violet-800/60">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/40 text-violet-200 text-xs font-bold uppercase tracking-wider">
          <ShoppingBag className="w-4 h-4 text-pink-400" />
          Фулфилмент в Москве (FBS / FBO)
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Подготовка и отправка товаров на маркетплейсы WB, Ozon, Я.Маркет
        </h2>
        <p className="text-sm sm:text-base text-violet-100 leading-relaxed">
          Полный цикл обработки партии из Китая: от встречной приемки контейнера в Москве до наклеивания штрихкодов, маркировки «Честный Знак», упаковки по стандартам маркетплейсов и отгрузки на склады маркетплейсов.
        </p>
      </div>

      {/* Fulfillment Process Steps */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Boxes className="w-5 h-5 text-violet-600" />
          <span>Как работает наш Фулфилмент:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
              <span>Приемка и Складской учет</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Встречаем груз из Китая на нашем складе в Москве. Пересчитываем фактическое количество, проверяем артикулы и заносим в складскую базу.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
              <span>Маркировка штрихкодами и Честный Знак</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Печатаем и наносим уникальные ШК селлера (Wildberries, Ozon, Я.Маркет), а также кодовые стикеры DataMatrix «Честный Знак» (КИЗ) на каждую единицу товара.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
              <span>Упаковка по регламентам площадок</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Упаковываем в термоусадочную пленку, пузырчатые рукава (ВПП), зип-пакеты, картонные коробки. Комплектуем наборы (бандлы) и вкладываем подарки/инструкции.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">4</span>
              <span>Сборка моно/микс коробов и Паллетирование</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Формируем моно- или микс-короба по требованиям WB/Ozon, наклеиваем ярлыки коробов и паллет, обматываем стретч-пленкой.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 sm:col-span-2 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-lg bg-violet-600 text-white text-xs font-bold flex items-center justify-center shrink-0">5</span>
              <span>Доставка на склады маркетплейсов по схемам FBS и FBO</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ежедневно отправляем собственные грузовые машины на сортировочные и распределительные центры Wildberries (Коледино, Электросталь, Подольск, Тула и др.), Ozon и Яндекс.Маркет строго в выбранные слоты.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   6. КОНТЕЙНЕР ИЛИ ОБОРУДОВАНИЕ (Containers & Industrial Equipment)
   ========================================================================= */
export const ContainersAndEquipmentSection: React.FC<SectionProps> = ({ onOpenLeadModal }) => {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-blue-900/60">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 text-xs font-bold uppercase tracking-wider">
          <Container className="w-4 h-4 text-cyan-300" />
          20ft / 40ft Контейнеры & Пром-оборудование
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Доставка контейнеров, станков, линий и спецтехники из Китая
        </h2>
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          Организуем контейнерную логистику (FCL) и перевозку крупногабаритного промышленного оборудования, автоматических линий, станков с ЧПУ и готовых производств из КНР в любую точку России.
        </p>
      </div>

      {/* Container Types */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Container className="w-5 h-5 text-blue-600" />
          <span>Какими контейнерами отправляется тот или иной груз:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-950 text-base">20ft Dry Van (20 футов)</span>
              <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-lg">~33 м³ / до 26 т</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Для каких грузов:</strong> Тяжелые, компактные и плотные грузы. Металлопрокат, метизы, крепеж, тяжелые отдельные узлы станков, сырье, химические компоненты, плитка и камень.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-950 text-base">40ft HC (High Cube)</span>
              <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2.5 py-1 rounded-lg">~76 м³ / до 28 т</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Для каких грузов:</strong> Объемные, легкие и среднегабаритные товары. Мебель, бытовая техника, электроника, одежда, пластиковые изделия, упакованные потребительские товары.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-950 text-base">Open Top / Flat Rack</span>
              <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg">Негабарит</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Для каких грузов:</strong> Негабаритные станки, высокие производственные линии, спецтехника и конструктивные элементы, требующие верхней или боковой погрузки краном.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-950 text-base">Рефрижераторы (Reefer)</span>
              <span className="bg-cyan-100 text-cyan-900 text-xs font-bold px-2.5 py-1 rounded-lg">Терморежим</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Для каких грузов:</strong> Скоропортящиеся товары, медикаменты, косметика, химические клеи и компоненты, чувствительные к температуре.
            </p>
          </div>
        </div>
      </div>

      {/* Industrial Equipment List */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>Примеры оборудования, часто ввозимого из Китая в Россию:</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Обеспечиваем подбор кода ТН ВЭД, оформление Технических Регламентов (ТР ТС 010/2011, 004/2011, 020/2011), таможенную очистку и доставку до цеха заказчика:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
              <Cog className="w-4 h-4 text-cyan-400" />
              <span>Станки с ЧПУ и металлообработка</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Фрезерные и токарные обрабатывающие центры, оптоволоконные лазерные раскройщики металла, листогибочные прессы, плазморезы.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
              <Factory className="w-4 h-4 text-cyan-400" />
              <span>ТПА & Экструзионные линии</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Термопластавтоматы (ТПА) для литья пластиковых изделий, контейнеров, фитингов, грануляторы и экструдеры для полимерных труб.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-cyan-400" />
              <span>Фасовочно-упаковочные линии</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Автоматические дозаторы, стик-пак машины, горизонт/вертикал упаковочные комплексы для пищевой, хим и косметической отраслей.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Линии стройматериалов</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Оборудование для профнастила, сэндвич-панелей, газобетонных блоков, сухих строительных смесей, кирпича и тротуарной плитки.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Пищевое пром-оборудование</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Варочные котлы, автоклавы, линии розлива напитков и соков, сушильные шкафы, промышленные тестомесы и пекарские печи.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" />
              <span>Автосервисное и СТО</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Подъемники двухстоечные/ножничные, стенды сход-развала 3D, шиномонтажное и диагностическое оборудование.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 sm:col-span-2 lg:col-span-3">
            <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Медицинское, косметологическое и высокотехнологичное оборудование</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Диодные лазерные аппараты для эпиляции и SMAS-лифтинга, аппараты УЗИ, МРТ, стоматологические установки, аналитические лабораторные комплексы и электронные планарные линии.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={() => onOpenLeadModal('Расчет доставки контейнера или оборудования')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all cursor-pointer text-sm"
          >
            <Container className="w-5 h-5" />
            <span>Запросить расчет контейнера или оборудования</span>
          </button>
        </div>
      </div>
    </div>
  );
};

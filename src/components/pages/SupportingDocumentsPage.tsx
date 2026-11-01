import React from 'react';
import {
  ArrowLeft, ShieldCheck, Phone, FileText, FileCheck2, ReceiptText,
  BadgeCheck, Truck, ClipboardList, ScrollText, Stamp, CheckCircle2,
} from 'lucide-react';
import { LeadForm } from '../common/LeadForm';

interface SupportingDocumentsPageProps {
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

const REQUEST = 'Заявка: Документы сопровождающие поставку грузов';

// Документы по договору поставки (выкуп через наше юрлицо в РФ, ввоз на себя, передача по счёт-фактуре)
const SUPPLY_DOCS = [
  { icon: ReceiptText, title: 'Счёт-фактура', text: 'Закрывающий документ по сделке: подтверждает поставку и даёт право на вычет НДС в бухгалтерии.' },
  { icon: FileCheck2, title: 'Номер ДТ', text: 'Регистрационный номер декларации на товары — подтверждает таможенную очистку и легальность ввоза.' },
  { icon: BadgeCheck, title: 'Сертификаты и декларации', text: 'Разрешительные документы на продукцию (ТР ТС): сертификаты соответствия и декларации о соответствии.' },
  { icon: Stamp, title: 'Коды маркировки «Честный знак»', text: 'Коды DataMatrix для маркировки товара — обязательное условие легальной продажи подконтрольных категорий.' },
];

// Документы по договору ТЭУ (вы импортёр, Express Today — экспедитор)
const FORWARDING_DOCS = [
  { icon: Truck, title: 'Транспортная накладная', text: 'Перевозочный документ по каналу: CMR (авто), коносамент B/L (море), авианакладная AWB (авиа), СМГС (ЖД).' },
  { icon: ClipboardList, title: 'Экспедиторская расписка', text: 'Подтверждает, что экспедитор принял груз к перевозке и несёт за него ответственность.' },
  { icon: FileCheck2, title: 'ДТ (ГТД) на вашу компанию', text: 'Декларация на товары оформляется на ваше юрлицо — вы выступаете декларантом и получаете вычет НДС.' },
  { icon: ReceiptText, title: 'Акт оказанных услуг и счёт-фактура', text: 'Документы на услуги экспедирования — для учёта расходов и подтверждения сделки.' },
  { icon: FileText, title: 'Отчёт экспедитора', text: 'Сводный отчёт об исполнении поручения с приложением всех транспортных и таможенных документов.' },
  { icon: BadgeCheck, title: 'Сертификаты и декларации на вашу компанию', text: 'Разрешительные документы оформляются в Росаккредитации непосредственно на имя вашего юрлица.' },
];

// Расширенный список «Что входит в услугу»
const SERVICE_FEATURES = [
  'Подготовка полного пакета документов под ключ',
  'Счёт-фактура и УПД с НДС для бухгалтерии',
  'Таможенное оформление с ДТ (ГТД)',
  'Сертификаты и декларации соответствия (ТР ТС)',
  'Маркировка «Честный Знак» полного цикла',
  'Транспортные накладные: CMR, B/L, AWB, СМГС',
  'Экспедиторская расписка и акт оказанных услуг',
  'Отчёт экспедитора по каждой поставке',
  'Консультация по бухгалтерии, НДС и учёту',
  'Сопровождение при проверках контролирующих органов',
];

export const SupportingDocumentsPage: React.FC<SupportingDocumentsPageProps> = ({ onNavigate, onOpenLeadModal }) => {
  const scrollToForm = () => {
    const el = document.getElementById('supporting-docs-form');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Назад */}
      <a
        href="/"
        onClick={(e) => { e.preventDefault(); onNavigate('/'); }}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Вернуться на главную</span>
      </a>

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 text-slate-900 rounded-3xl p-6 sm:p-12 border border-orange-200/80 shadow-md space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-700 text-sm font-semibold uppercase tracking-wider">
          <span>Документы Express Today</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Документы, сопровождающие поставку грузов
        </h1>

        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Разбираем, какие документы вы получаете на руки при получении груза из Китая — по договору
          поставки и по договору транспортной экспедиции (ТЭУ). Полный пакет для легальной продажи,
          бухгалтерии и вычета НДС.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={scrollToForm}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-orange-600/25 transition-all cursor-pointer text-sm"
          >
            Получить консультацию
          </button>
        </div>
      </div>

      {/* ================= ДОКУМЕНТЫ НА РУКИ ================= */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Какие документы вы получаете на руки
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
            Состав пакета зависит от схемы работы. По договору поставки вы выкупаете товар через наше российское
            юрлицо — мы ввозим его на себя и передаём вам по счёт-фактуре. По договору ТЭУ — ввозим груз на ваше
            юрлицо, а мы выступаем экспедитором.
          </p>
        </div>

        {/* По договору поставки */}
        <div className="bg-white rounded-3xl border border-orange-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 rounded-xl p-2.5">
              <ReceiptText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">По договору поставки</h3>
          </div>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Вы выкупаете товар через наше российское юрлицо: мы ввозим его на себя, проходим таможню и передаём
            вам по счёт-фактуре. Вы получаете документы, подтверждающие, что товар легально ввезён и перешёл
            в вашу собственность:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUPPLY_DOCS.map((d, i) => (
              <div key={i} className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
                <d.icon className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{d.title}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{d.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* По договору ТЭУ */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-xl p-2.5">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-black text-slate-900">По договору ТЭУ (транспортная экспедиция)</h3>
          </div>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Вы — импортёр и грузовладелец, Express Today — экспедитор. Груз ввозится на ваше юрлицо,
            поэтому вы получаете транспортные, экспедиторские и таможенные документы на свою компанию:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORWARDING_DOCS.map((d, i) => (
              <div key={i} className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <d.icon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm">{d.title}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{d.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ЧТО ВХОДИТ В УСЛУГУ (расширено) ================= */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <h2 className="text-xl font-bold text-slate-900">Что входит в услугу:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SERVICE_FEATURES.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= МАРКИРОВКА ЧЕСТНЫЙ ЗНАК + СЕРТИФИКАЦИЯ ================= */}
      <section className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-800">
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span>Маркировка «Честный Знак» полного цикла и надежная Сертификация</span>
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Обеспечиваем 100% легальность ввоза продукции на территорию РФ с соблюдением всех требований
            национальной системы маркировки и технических регламентов ТР ТС.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-3">
            <h4 className="font-bold text-emerald-950 text-sm uppercase tracking-wider">Этапы Честного Знака «полного цикла»:</h4>
            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded shrink-0">1</span>
                <span><strong>Заказ кодов DataMatrix:</strong> Формирование заявки и генерация кодов в ГИС МТ (Честный Знак).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded shrink-0">2</span>
                <span><strong>Передача поставщику:</strong> Подготовка макетов стикеров, передача файлов и инструкций фабрике в Китае.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded shrink-0">3</span>
                <span><strong>Контроль размещения:</strong> Авторский контроль стикеровки и считываемости штрихкодов на складе в КНР.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded shrink-0">4</span>
                <span><strong>Учет в Таможне & Ввод в оборот:</strong> Указание кодов в 31 графе ГТД (ДТ) и ввод в оборот при прибытии в РФ.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2">
            <h4 className="font-bold text-emerald-950 text-sm">Сертификация в проверенных лабораториях</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Проводим любые испытания (ТР ТС, сертификаты, ДС, отказные письма) исключительно через надежные
              аккредитованные лаборатории-партнеры, с которыми работаем годами. Это исключает риск аннулирования
              документов регулятором или задержек на таможне.
            </p>
          </div>
        </div>
      </section>

      {/* ================= ФОРМА ================= */}
      <section id="supporting-docs-form" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Получите полный пакет документов</h2>
            <p className="text-sm text-slate-500">
              Оставьте заявку — расскажем, какой пакет документов нужен под вашу схему поставки, и подготовим его.
            </p>
          </div>
          <LeadForm initialRequestType={REQUEST} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white space-y-4">
            <h3 className="font-bold text-lg">Срочный вопрос?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Напишите в мессенджер — дежурный менеджер подскажет по документам и схеме поставки.
            </p>
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
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-5 space-y-2">
            <div className="flex items-center gap-2 font-bold text-orange-900 text-sm">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              Работаем официально
            </div>
            <p className="text-xs text-orange-900/80 leading-relaxed">
              ООО «Экспресс-тудей» · белая схема ВЭД · документы по каждой поставке: ДТ (ГТД), счёт-фактура, УПД с НДС, сертификаты.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SEO-ТЕКСТ ================= */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 text-slate-700">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Документы, сопровождающие поставку грузов из Китая: полный разбор
        </h2>

        <p className="text-sm sm:text-base leading-relaxed">
          Когда груз из Китая приходит на ваш склад, самое важное — это не только сам товар, но и документы,
          которые его сопровождают. Именно они подтверждают, что продукция ввезена легально, что по ней уплачены
          все таможенные платежи и что её можно спокойно продавать, ставить на баланс и учитывать в бухгалтерии.
          Без правильного пакета документов даже безупречный с точки зрения качества товар превращается в источник
          рисков: от претензий налоговой до блокировок карточек на маркетплейсах и конфискации при проверке.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          Состав пакета документов напрямую зависит от того, по какой схеме вы работаете с логистическим оператором.
          Есть два принципиально разных сценария: договор поставки и договор транспортной экспедиции, сокращённо ТЭУ.
          В первом случае вы выкупаете товар через наше российское юридическое лицо: мы ввозим товар на себя,
          выступаем импортёром и проходим таможенную очистку, а затем передаём его вам по счёт-фактуре.
          Во втором — вы сами являетесь импортёром, груз ввозится на ваше юридическое лицо, а оператор лишь организует
          перевозку и оформление. Путать эти два пакета нельзя: от них зависят и бухгалтерский учёт, и право на вычет НДС.
        </p>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Документы по договору поставки</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          По договору поставки вы выкупаете товар через наше российское юридическое лицо: Express Today ввозит товар
          на себя — выступает импортёром и декларантом, проходит таможенную очистку — и передаёт его вам по счёт-фактуре.
          В этом случае вы получаете четыре ключевых документа. Первый — счёт-фактура: это закрывающий документ,
          который подтверждает факт сделки, фиксирует стоимость и выделенный НДС и даёт вашей бухгалтерии право принять
          налог к вычету. Второй — регистрационный номер декларации на товары, или номер ДТ. Он подтверждает, что товар
          ввезён через официальную таможню, что по нему уплачены пошлина и НДС и что он выпущен в свободное обращение.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          Третий документ — сертификаты и декларации соответствия. Это разрешительные документы, подтверждающие, что
          продукция отвечает требованиям технических регламентов Таможенного союза. Они обязательны для большинства
          категорий товаров: от одежды и обуви до электроники и детских товаров. Четвёртый — коды маркировки «Честный
          знак». Если ваш товар входит в перечень подконтрольных категорий, то без кодов DataMatrix его нельзя легально
          продавать: маркетплейсы и розница требуют их при приёмке, а их отсутствие грозит штрафами.
        </p>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Документы по договору ТЭУ</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          Договор транспортной экспедиции устроен иначе. Здесь вы — грузовладелец и импортёр, а Express Today — экспедитор,
          который организует перевозку от вашего имени. Соответственно, вы получаете более широкий пакет документов, и все
          они оформляются на ваше юридическое лицо. Основа пакета — транспортная накладная, вид которой зависит от канала
          доставки: CMR для автоперевозок, коносамент B/L для морских, авианакладная AWB для авиа и накладная СМГС для
          железнодорожных. Она подтверждает сам факт перевозки и служит товаросопроводительным документом.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          Далее — экспедиторская расписка, которая подтверждает, что экспедитор принял груз к перевозке и несёт за него
          ответственность. Ключевой документ — декларация на товары, оформленная на вашу компанию: в этом случае вы сами
          выступаете декларантом и получаете полное право на вычет ввозного НДС. К ней добавляются акт оказанных услуг и
          счёт-фактура на услуги экспедирования — они закрывают расчёты с экспедитором. Итоговый документ — отчёт
          экспедитора, сводный документ об исполнении поручения, к которому прикладываются все транспортные, таможенные
          и разрешительные документы по поставке. Сертификаты и декларации соответствия в этой схеме также оформляются
          непосредственно на имя вашего юрлица.
        </p>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Почему полнота пакета критична</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          Неполный или неверно оформленный пакет документов — одна из самых частых причин проблем у импортёров. Налоговая
          может отказать в вычете НДС, если нет корректной счёт-фактуры и ДТ. Маркетплейсы блокируют карточки, если на
          товаре нет обязательной маркировки. Контролирующие органы вправе изъять продукцию, если на неё нет сертификатов
          или деклараций соответствия. Поэтому документы — это не формальность, а юридическая основа вашего бизнеса.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          Express Today готовит пакет документов под ключ, исходя из выбранной схемы. Мы заранее уточняем, какие
          разрешительные документы нужны под конкретный товар, оформляем их до отправки и передаём вам вместе с грузом
          или отдельным пакетом. Вы получаете не разрозненные бумаги, а согласованный комплект, который корректно
          «сходится» между собой: счёт-фактура — с ДТ, ДТ — с сертификатами, сертификаты — с маркировкой.
        </p>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Маркировка «Честный знак» и сертификация</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          Отдельное место в пакете занимают маркировка и сертификация. «Честный знак» — национальная система цифровой
          маркировки, которая охватывает всё больше товарных категорий. Коды DataMatrix наносятся на товар ещё в Китае,
          проходят учёт на таможне и вводятся в оборот уже в России. Мы ведём процесс полного цикла: заказываем коды в
          системе, передаём файлы и инструкции фабрике, контролируем оклейку на складе и отражаем коды в декларации.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          Сертификацию и декларирование мы проводим только в аккредитованных лабораториях, с которыми работаем годами.
          Это защищает от аннулирования документов регулятором и от задержек на таможне. В результате вы получаете товар,
          который можно без ограничений продавать в рознице, на маркетплейсах и передавать дистрибьюторам — с полным
          пакетом документов, подтверждающих его легальность.
        </p>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Поставка или ТЭУ: как выбрать схему</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          Выбор между договором поставки и договором ТЭУ зависит от того, кто выступает импортёром и как выстроен ваш
          учёт. Договор поставки проще для новичков и селлеров: вы выкупаете товар через наше российское юрлицо — мы ввозим
 его на себя и проходим таможню, а вы получаете уже растаможенный товар по счёт-фактуре с номером ДТ
 и не участвуете в таможенных процедурах. Минус — вы не накапливаете собственную
          импортную историю. Договор ТЭУ подходит компаниям, которые хотят ввозить товар на своё юрлицо, самостоятельно
          распоряжаться НДС и строить репутацию участника ВЭД. Он требует чуть больше вовлечённости в документооборот,
          но даёт полный контроль над поставкой и документами.
        </p>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Частые ошибки при работе с документами</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          Самая частая ошибка — хранить документы вперемешку и терять связку между счёт-фактурой, ДТ и сертификатами.
          Вторая — принимать груз без сверки номера ДТ с фактическим товаром. Третья — игнорировать маркировку: если
          категория подконтрольна, коды нужны ещё до ввоза. Мы формируем пакет так, чтобы все документы соответствовали
          друг другу, и передаём его единым комплектом — вам не приходится собирать бумаги по частям.
        </p>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">Когда вы получаете документы</h3>
        <p className="text-sm sm:text-base leading-relaxed">
          Пакет передаётся вместе с грузом или сразу после таможенного выпуска — в бумажном или электронном виде.
          Счёт-фактуру и акты можно получить по ЭДО, что ускоряет закрытие периода. Если документы нужны срочно,
          например для приёмки на маркетплейс, сообщите заранее — подготовим их ещё до прибытия груза.
        </p>
        <p className="text-sm sm:text-base leading-relaxed">
          Итог прост: правильные документы — это спокойствие владельца бизнеса. Они защищают от претензий налоговой,
          обеспечивают бесперебойную продажу на маркетплейсах и подтверждают легальность каждой единицы товара.
          Оставьте заявку — мы определим, какой пакет документов нужен под вашу схему, и подготовим его к моменту
          прибытия груза. Это сэкономит вам время и избавит от рисков.
        </p>
      </section>
    </div>
  );
};

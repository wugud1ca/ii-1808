import React from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { coreServices } from '../../siteConfig';
import { LeadForm } from '../common/LeadForm';
import { CargoGallery } from '../common/CargoGallery';
import {
  SupplierSearchSection,
  BuyoutPlatformSection,
  ConsolidationInspectionSection,
  WhiteDeliveryAlgorithmSection,
  MarketplaceFulfillmentSection,
  ContainersAndEquipmentSection,
} from '../services/ServiceDetailSections';

interface ServicePageProps {
  slug: string;
  onNavigate: (route: string) => void;
  onOpenLeadModal: (requestType?: string) => void;
}

export const ServicePage: React.FC<ServicePageProps> = ({ slug, onNavigate, onOpenLeadModal }) => {
  const service = coreServices.find(s => s.slug === slug) || coreServices[0];

  // Slug matching helpers
  const isPoisk = slug.includes('poisk');
  const isVikup = slug.includes('vikup') || slug.includes('vykup') || slug === '1688';
  const isKonsolidaciya = slug.includes('konsolidaciya') || slug.includes('proverka');
  const isBelaya = slug.includes('belaya') && !slug.includes('stat-importerom');
  const isMarketplace = slug.includes('marketpleis') || slug.includes('fulfilment');
  const isKontejner = slug.includes('kontejner') || slug.includes('oborudovanie');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      
      {/* Back button */}
      <button
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Вернуться на главную</span>
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 text-slate-900 rounded-3xl p-6 sm:p-12 border border-orange-200/80 shadow-md space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-700 text-sm font-semibold uppercase tracking-wider">
          <span>Услуга Express Today</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">{service.title}</h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">{service.fullDesc}</p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onOpenLeadModal(`Запрос по услуге: ${service.title}`)}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-md shadow-orange-600/25 transition-all cursor-pointer text-sm"
          >
            Рассчитать заявку
          </button>
        </div>
      </div>

      {/* Key Features & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Что входит в услугу:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm font-medium text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Фото-галерея грузов для страницы карго-доставки */}
          {slug === 'kargo-dostavka-iz-kitaia' && <CargoGallery />}

          {/* Render dedicated full detailed sections according to the requested service */}
          {isPoisk && <SupplierSearchSection onOpenLeadModal={onOpenLeadModal} />}
          {isVikup && <BuyoutPlatformSection onOpenLeadModal={onOpenLeadModal} />}
          {isKonsolidaciya && <ConsolidationInspectionSection onOpenLeadModal={onOpenLeadModal} />}
          {isBelaya && <WhiteDeliveryAlgorithmSection onOpenLeadModal={onOpenLeadModal} />}
          {isMarketplace && <MarketplaceFulfillmentSection onOpenLeadModal={onOpenLeadModal} />}
          {isKontejner && <ContainersAndEquipmentSection onOpenLeadModal={onOpenLeadModal} />}

          {/* Additional special service pages */}
          {slug === 'stat-importerom' && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-800">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-blue-600" />
                  <span>Финансовая логистика Россия — Китай на Юридическое лицо заказчика</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Организуем полностью легальную ВЭД-сделку, где покупателем товара выступает ваша компания (ООО или ИП). Вы напрямую проводите валютные расчеты с китайским производителем, а мы обеспечиваем логистику, оформление разрешительных документов и таможенное декларирование.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-2">
                  <h4 className="font-bold text-blue-950 text-sm">Прямой ВЭД-контракт & Валюта</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Подготовка внешнеторгового контракта, открытие валютных счетов и паспорта сделки. Безопасные прямые расчеты с фабрикой в юанях.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-2">
                  <h4 className="font-bold text-blue-950 text-sm">Сертификаты и ДС на вашу компанию</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Все Декларации и Сертификаты Соответствия оформляются в Росаккредитации непосредственно на имя вашего Юр. лица.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-2">
                  <h4 className="font-bold text-blue-950 text-sm">Таможня с ГТД & Вычет НДС</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Декларирование товаров под вашей ЭЦП. Вы получаете ГТД (ДТ) и списание 100% расходов на себестоимость с вычетом НДС.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-2">
                  <h4 className="font-bold text-blue-950 text-sm">Импортная история компании</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Накапливаете положительный статус участника ВЭД в Федеральной таможенной службе, что упрощает будущие поставки.
                  </p>
                </div>
              </div>
            </div>
          )}

          {slug === 'dokumenty-dlya-vvoza' && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-800">
              <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span>Маркировка «Честный Знак» полного цикла и надежная Сертификация</span>
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Обеспечиваем 100% легальность ввоза продукции на территорию РФ с соблюдением всех требований национальной системы маркировки и технических регламентов ТР ТС.
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
                    Проводим любые испытания (ТР ТС, сертификаты, ДС, отказные письма) исключительно через надежные аккредитованные лаборатории-партнеры, с которыми работаем годами. Это исключает риск аннулирования документов регулятором или задержек на таможне.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Lead Form */}
        <div>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900">Оставить запрос</h3>
            <LeadForm initialRequestType={`Заявка: ${service.title}`} compact />
          </div>
        </div>

      </div>

    </div>
  );
};

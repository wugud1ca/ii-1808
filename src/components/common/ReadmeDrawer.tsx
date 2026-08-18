import React from 'react';
import { X, Code2, Copy, Check, FileText } from 'lucide-react';
import { siteConfig } from '../../siteConfig';

interface ReadmeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeDrawer: React.FC<ReadmeDrawerProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const readmeContent = `# ИНСТРУКЦИЯ И ТОЧКИ ИНТЕГРАЦИИ РЕДИЗАЙНА EXPRESS TODAY

Проект разработан как масштабируемое многостраничное React + TypeScript приложение.
Все бизнес-параметры, ссылки, контакты и конфигурации вынесены в единый файл \`src/siteConfig.ts\`.

## Ключевые точки замены перед деплоем в продакшн:

1. **Фирменный логотип**:
   - Компонент: \`src/components/common/Logo.tsx\`
   - Замените векторный JSX на оригинальный SVG из брендбука Express Today.

2. **Социальные сети и мессенджеры**:
   - Файл: \`src/siteConfig.ts\` -> объект \`social\`
   - Замените заполнители:
     - \`telegram\`: 'https://t.me/your_official_telegram'
     - \`whatsapp\`: 'https://wa.me/79990000000'
     - \`max\`: 'https://max.ru/your_channel'
     - \`vk\`: 'https://vk.com/express_today'
     - \`rutube\`: 'https://rutube.ru/channel/...'

3. **CRM / Webhook Endpoint заявок**:
   - Файл: \`src/siteConfig.ts\` -> \`api.leadEndpoint\`
   - Укажите URL вашего сервера или webhook Bitrix24 / AmoCRM (по умолчанию отправляет JSON-пакет с UTM-метками и requestType).

4. **API Калькулятора доставки**:
   - Файл: \`src/siteConfig.ts\` -> \`api.calculatorEndpoint\`
   - Подключите эндпоинт онлайн-расчета курсов валют и динамических матриц тарифов.

5. **API Сервиса трекинга накладных**:
   - Файл: \`src/siteConfig.ts\` -> \`api.trackingEndpoint\`
   - Компонент: \`src/components/common/TrackingWidget.tsx\`
   - В текущей версии реализован честный демо-режим с уведомлением для пользователя.

6. **Идентификаторы систем аналитики**:
   - Файл: \`src/siteConfig.ts\` -> объект \`analytics\`
   - \`yandexMetrikaId\`: '12345678'
   - \`ga4Id\`: 'G-XXXXXXXXXX'

7. **Актуализация тарифов и сроков**:
   - Перепроверьте массивы \`coreServices\`, \`deliveryMethods\` и \`faqList\` перед публикацией.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-orange-200 p-6 sm:p-8 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto cursor-default"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Файл README для разработчиков</h2>
            <p className="text-sm text-slate-600">Точки конфигурации и подключения API</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-sm text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap">
          {readmeContent}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">Конфигурация вынесена в siteConfig.ts</span>
          <button
            onClick={handleCopy}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-600/25"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Скопировано!' : 'Скопировать текст'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

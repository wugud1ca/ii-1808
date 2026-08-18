import React from 'react';
import { siteConfig } from '../../siteConfig';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', light = false }) => {
  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Visual icon badge representing Express Today logistics */}
      <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-600 via-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/20 group shrink-0">
        <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-orange-500 border-2 border-white rounded-full"></div>
      </div>
      
      <div className="flex flex-col">
        <span className={`text-base xs:text-lg sm:text-xl font-extrabold leading-none tracking-tight whitespace-nowrap ${light ? 'text-white' : 'text-slate-900'}`}>
          EXPRESS<span className="text-orange-600">TODAY</span>
        </span>
        <span className={`text-[9px] sm:text-[10px] font-medium tracking-wider uppercase leading-tight mt-0.5 whitespace-nowrap hidden sm:block ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          Логистика & Выкуп
        </span>
      </div>

      {/* Developer note comment placeholder inside JSX */}
      {/* REPLACE_WITH_OFFICIAL_LOGO_SVG: Substitute this component's JSX with official vector SVG if provided */}
    </div>
  );
};

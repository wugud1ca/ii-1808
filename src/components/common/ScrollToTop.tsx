import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down more than 350px (past first screen)
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Наверх"
      className="min-[1200px]:hidden fixed bottom-6 right-6 z-[900] bg-slate-900/90 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-xs px-4 py-3 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-xs flex items-center gap-2 transition-all duration-200 animate-in fade-in zoom-in-90 cursor-pointer active:scale-95 group"
    >
      <ArrowUp className="w-4 h-4 text-orange-400 group-hover:text-white transition-colors" />
      <span>Наверх</span>
    </button>
  );
};

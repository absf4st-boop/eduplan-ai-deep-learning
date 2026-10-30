import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const waUrl = 'https://wa.me/6285725080078?text=Halo%20Mas%20Husein%20Apriyanto,%20saya%20butuh%20bantuan%20seputar%20aplikasi%20EDU%20PLAN%20AI%20-%20DEEP%20LEARNING';

  return (
    <aside aria-label="Bantuan Langsung WhatsApp" className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip on hover */}
      <div className="hidden sm:flex flex-col items-end mr-3 bg-slate-900/90 text-white px-3 py-1.5 rounded-xl shadow-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <span className="text-xs font-semibold text-amber-300">Butuh Bantuan Guru?</span>
        <span className="text-[11px] text-slate-300">Chat WhatsApp: 085725080078</span>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi Bantuan WhatsApp di 085725080078"
        className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
        </span>
        <MessageCircle className="w-7 h-7" />
      </a>
    </aside>
  );
};

import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, ArrowUp } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 sm:bottom-8 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 rounded-full bg-luxury-walnut/90 hover:bg-luxury-walnut text-luxury-gold border border-luxury-gold/30 shadow-md flex items-center justify-center transition-all duration-300 hover:-translate-y-1 focus:outline-none"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Floating Call Button (Circular Icon) */}
      <a
        href={`tel:${COMPANY_INFO.phoneRaw}`}
        aria-label="Call Zameer Interiors"
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-luxury-walnut hover:bg-luxury-gold text-luxury-gold hover:text-luxury-walnut border border-luxury-gold/60 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none ring-2 ring-luxury-gold/20"
      >
        <Phone className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />

        {/* Hover Tooltip (Desktop) */}
        <span className="absolute right-14 px-3 py-1.5 rounded-lg bg-luxury-walnut text-xs font-medium text-[#FDFBF7] border border-luxury-gold/30 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden md:block">
          Call Now ({COMPANY_INFO.phone})
        </span>
      </a>

      {/* Floating WhatsApp Button */}
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with Zameer Interiors"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none ring-4 ring-emerald-500/20"
      >
        {/* Pulsing ring animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
        
        {/* WhatsApp Icon */}
        <MessageSquare className="w-7 h-7 relative z-10" />

        {/* Hover Tooltip (Desktop) */}
        <span className="absolute right-16 px-3 py-1.5 rounded-lg bg-luxury-walnut text-xs font-medium text-[#FDFBF7] border border-luxury-gold/30 shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden md:block">
          Chat on WhatsApp • Quick Quote
        </span>
      </a>
    </div>
  );
}

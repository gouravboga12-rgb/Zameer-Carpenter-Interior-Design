import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';

export default function MobileActionBar() {
  const { settings } = useAdminData();

  const callNumber = settings?.floatingPhone || settings?.phoneRaw || '+918464930376';
  const waNumber = settings?.floatingWhatsapp || settings?.whatsappRaw || '918464930376';

  const defaultWaUrl = `https://wa.me/${waNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(
    'Hello Zameer Interiors,\n\nI am looking for interior design & bespoke carpentry services in Hyderabad. I would like to schedule a site consultation and discuss my project requirements.\n\nThank you!'
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-luxury-walnut/95 backdrop-blur-lg border-t border-luxury-gold/30 p-2.5 px-4 sm:hidden safe-bottom-space shadow-2xl">
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {/* Call Now Action */}
        <a
          href={`tel:${callNumber}`}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 text-[#FDFBF7] font-semibold text-sm border border-white/20 active:scale-[0.98] transition-transform"
          aria-label="Call Now"
        >
          <Phone className="w-4 h-4 text-luxury-gold" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp Quote Action */}
        <a
          href={defaultWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md active:scale-[0.98] transition-transform"
          aria-label="WhatsApp Quote"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

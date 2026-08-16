import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';

export default function GoogleMapEmbed() {
  const { latitude, longitude, googleMapsLink, directionsLink, originalFormat } = COMPANY_INFO.coordinates;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-luxury-gold/30 shadow-luxury bg-luxury-card">
      {/* Map Header Bar */}
      <div className="p-4 bg-luxury-walnut text-[#FDFBF7] flex flex-wrap items-center justify-between gap-3 border-b border-luxury-gold/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold tracking-wide font-heading">Studio & Workshop Location</h4>
            <p className="text-xs text-gray-300">Tolichowki, Shaikpet, Hyderabad ({originalFormat})</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <a
            href={directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-luxury-gold text-luxury-walnut font-medium hover:bg-yellow-500 transition-colors shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
          </a>
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FDFBF7] transition-colors border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Maps</span>
          </a>
        </div>
      </div>

      {/* Embedded Google Map Iframe */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-luxury-surface">
        <iframe
          title="Zameer Carpenter Interior Design Location Map"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`}
        />
        
        {/* Floating Quick Pin Card */}
        <div className="absolute bottom-3 left-3 bg-luxury-walnut/90 backdrop-blur-md text-[#FDFBF7] p-3 rounded-xl border border-luxury-gold/30 shadow-lg max-w-[280px] hidden sm:block">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-luxury-gold mt-1 animate-ping"></span>
            <div>
              <p className="text-xs font-bold font-heading text-luxury-gold">Zameer Carpenter Interior Design</p>
              <p className="text-[11px] text-gray-300 mt-0.5 leading-tight">
                Tolichowki / Shaikpet Main Road, Hyderabad, Telangana 500008
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

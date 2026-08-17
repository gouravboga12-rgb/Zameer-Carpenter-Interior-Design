import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare, Mail, MapPin, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';
import { SERVICES_DATA } from '../../data/servicesData';
import { useAdminData } from '../../context/AdminDataContext';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';
import { HEADER_NAV_LINKS } from './Header';

export default function Footer() {
  const { settings } = useAdminData();
  const currentYear = new Date().getFullYear();

  const phone = settings?.phone || COMPANY_INFO.phone;
  const phoneRaw = settings?.phoneRaw || COMPANY_INFO.phoneRaw;
  const whatsapp = settings?.whatsapp || COMPANY_INFO.whatsapp;
  const address = settings?.address || COMPANY_INFO.address.full;

  return (
    <footer className="bg-luxury-walnut text-gray-300 pt-16 pb-24 sm:pb-16 border-t border-luxury-gold/30 relative overflow-hidden">
      {/* Decorative Gold Sheen at Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Pedigree (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt={COMPANY_INFO.name}
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.4)]"
              />
            </Link>
            
            <p className="text-sm leading-relaxed text-gray-300 max-w-md">
              Hyderabad’s premier bespoke interior architecture and master woodworking studio. Bringing over 30 years of generational craftsmanship, photorealistic 3D visualization, and seamless turnkey execution to Tolichowki, Shaikpet, and across Greater Hyderabad.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>30+ Years Master Woodcraft</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs">
                <span>Direct Workshop Pricing</span>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Pages (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-[#FDFBF7] tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-luxury-gold"></span>
              Pages
            </h3>
            <ul className="space-y-2.5 text-sm">
              {HEADER_NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-luxury-gold transition-colors flex items-center gap-1.5 group font-medium"
                  >
                    <span className="text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Core Services (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-[#FDFBF7] tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-luxury-gold"></span>
              Core Services
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {SERVICES_DATA.map((service) => (
                <li key={service.id}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                    <span>{service.shortTitle}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Studio Info (3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-heading text-lg font-semibold text-[#FDFBF7] tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-luxury-gold"></span>
              Studio & Contact
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <a
                href={`tel:${phoneRaw}`}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-white/5 hover:bg-luxury-gold/10 border border-white/10 text-gray-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                <span className="font-semibold text-luxury-gold">{phone}</span>
              </a>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp: {whatsapp}</span>
              </a>

              <div className="flex items-start gap-2.5 p-2 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">{address}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {currentYear} {COMPANY_INFO.name}. All rights reserved.</p>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center">
            <span>Tolichowki • Shaikpet • Hyderabad</span>
            <span>•</span>
            <span>
              Developed by{' '}
              <a
                href="https://www.codtechitsolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-luxury-gold hover:text-yellow-400 font-semibold transition-colors underline decoration-luxury-gold/40 underline-offset-4"
              >
                CODTECH IT SOLUTION
              </a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

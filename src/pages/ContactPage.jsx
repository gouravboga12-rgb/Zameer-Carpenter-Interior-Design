import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import GoogleMapEmbed from '../components/ui/GoogleMapEmbed';
import ConsultationForm from '../components/home/ConsultationForm';
import { COMPANY_INFO } from '../data/companyInfo';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function ContactPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-16 bg-luxury-bg">
      
      {/* Main Contact Grid (Map + Form) */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Consultation Booking Form (Top on Mobile) */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <ConsultationForm />
          </div>

          {/* Direct Info & Google Map (Below Form on Mobile) */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="luxury-card rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 group border border-luxury-gold/30 hover:border-luxury-gold"
              >
                <div className="w-10 h-10 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-luxury-gold group-hover:text-luxury-walnut transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-muted block">
                    Direct Phone
                  </span>
                  <span className="font-sans font-bold tracking-tight text-sm sm:text-base text-luxury-walnut group-hover:text-luxury-gold-dark">
                    {COMPANY_INFO.phone}
                  </span>
                </div>
              </a>

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-card rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 group border border-emerald-500/30 hover:border-emerald-500"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-muted block">
                    WhatsApp Chat
                  </span>
                  <span className="font-sans font-bold tracking-tight text-sm sm:text-base text-emerald-700">
                    {COMPANY_INFO.whatsapp}
                  </span>
                </div>
              </a>
            </div>

            {/* Studio Address & Schedule */}
            <div className="bg-luxury-card rounded-2xl p-5 border border-luxury-gold/30 shadow-luxury space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                    Studio & Workshop Address
                  </h4>
                  <p className="text-xs sm:text-sm text-luxury-muted mt-0.5 font-medium leading-relaxed">
                    {COMPANY_INFO.address.full}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-luxury-border">
                <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                    Visiting & Consultation Hours
                  </h4>
                  <p className="text-xs text-luxury-muted mt-0.5 font-medium">
                    {COMPANY_INFO.businessHours} (Monday – Sunday)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-luxury-border">
                <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                    Email Inquiry
                  </h4>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-xs text-luxury-muted hover:text-luxury-gold font-medium truncate block"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Google Map Embed */}
            <GoogleMapEmbed />

          </div>

        </div>
      </section>

      {/* 3. What to Expect from a Site Visit */}
      <section className="py-16 bg-luxury-surface/50 border-t border-luxury-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Site Visit Experience"
            title="What to Expect from Your Free Site Visit"
            subtitle="Transparent, pressure-free evaluation tailored to your architectural vision."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="luxury-card rounded-2xl p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center font-bold font-heading">
                1
              </div>
              <h3 className="font-heading text-lg font-bold text-luxury-walnut">Laser Site Measurement</h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Millimeter-exact measurement of floor spaces, ceiling heights, electrical ducts, and plumbing points.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center font-bold font-heading">
                2
              </div>
              <h3 className="font-heading text-lg font-bold text-luxury-walnut">Material & Finish Samples</h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Touch and evaluate genuine IS:710 Marine Plywood swatches, acrylic colors, and German hardware motions.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-6 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center font-bold font-heading">
                3
              </div>
              <h3 className="font-heading text-lg font-bold text-luxury-walnut">Indicative BOQ & 3D Plan</h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Receive a transparent itemized quotation and 2D/3D space layout recommendations with no hidden fees.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

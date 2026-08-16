import React from 'react';
import { Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import GoogleMapEmbed from '../ui/GoogleMapEmbed';
import ConsultationForm from './ConsultationForm';
import { COMPANY_INFO } from '../../data/companyInfo';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-luxury-surface/60 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Contact & Site Visit"
          title="Let's Create Something Exceptional"
          subtitle="Speak directly with our interior designers and master carpenters. We offer free on-site measurements across Tolichowki, Shaikpet, and Hyderabad."
        />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Cards + Interactive Map (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Phone Card */}
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

              {/* WhatsApp Card */}
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

            {/* Address & Hours Info Box */}
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
                    Working Hours
                  </h4>
                  <p className="text-xs text-luxury-muted mt-0.5 font-medium">
                    {COMPANY_INFO.businessHours} (All 7 Days)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-luxury-border">
                <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                    Email
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

            {/* Interactive Google Map */}
            <GoogleMapEmbed />

          </div>

          {/* Right Column: Consultation Booking Form (7 Cols) */}
          <div className="lg:col-span-7">
            <ConsultationForm />
          </div>

        </div>

      </div>
    </section>
  );
}

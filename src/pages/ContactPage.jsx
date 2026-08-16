import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, Mail, MapPin, Clock, ShieldCheck, Sparkles, ChevronDown, ChevronUp, Compass, Ruler, HelpCircle } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import GoogleMapEmbed from '../components/ui/GoogleMapEmbed';
import ConsultationForm from '../components/home/ConsultationForm';
import { COMPANY_INFO } from '../data/companyInfo';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

const FAQS = [
  {
    q: "Is the site measurement visit in Tolichowki / Shaikpet / Hyderabad free?",
    a: "Yes! We offer a 100% complimentary initial site visit across Tolichowki, Shaikpet, Jubilee Hills, Banjara Hills, Gachibowli, Madhapur, and all Greater Hyderabad neighborhoods to take laser measurements and discuss your requirements."
  },
  {
    q: "Do you provide 3D photorealistic visualization before carpentry starts?",
    a: "Absolutely. We provide complete 2D layout drawings and photorealistic 3D renders of your modular kitchen, living room, and wardrobes so you can visualize the exact colors, finishes, and lighting before workshop manufacturing begins."
  },
  {
    q: "What materials and hardware brands do you use?",
    a: "We strictly use certified IS:710 Marine-Grade Boiling-Water-Proof (BWP) plywood for all wet zones (kitchens & vanities), premium calibrated core for wardrobes, and authentic German hardware fittings from Blum, Hettich, Hafele, and Ebco."
  },
  {
    q: "How does your pricing compare with other interior design companies?",
    a: "Because we manufacture directly in our local Hyderabad carpentry workshop without third-party contracting or costly commercial showroom overheads, our clients typically save 25% to 35% on turnkey execution while getting superior quality materials."
  },
  {
    q: "What is your typical project execution timeline?",
    a: "A 2BHK/3BHK modular kitchen and wardrobe package typically takes 25-35 working days from 3D approval to final handover. Complete turnkey villa interiors take 45-60 days with guaranteed on-time delivery milestones."
  }
];

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="pt-24 sm:pt-28 pb-16 bg-luxury-bg">
      
      {/* Main Contact Grid: Consultation Form ON TOP followed by Contact Info */}
      <section className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. TOP: Book Free Site Consultation Form */}
        <div className="max-w-4xl mx-auto">
          <ConsultationForm />
        </div>

        {/* 2. FOLLOWED BY: Contact Info Details & Google Map */}
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
              Direct Contact & Studio
            </span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-luxury-walnut">
              Connect Directly with Our Workshop & Design Leads
            </h3>
          </div>

          {/* Quick Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="luxury-card rounded-2xl p-5 flex items-center gap-4 group border border-luxury-gold/30 hover:border-luxury-gold shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-luxury-gold group-hover:text-luxury-walnut transition-all">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-luxury-muted block">
                  Direct Phone
                </span>
                <span className="font-sans font-bold tracking-tight text-base sm:text-lg text-luxury-walnut group-hover:text-luxury-gold-dark">
                  {COMPANY_INFO.phone}
                </span>
              </div>
            </a>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-card rounded-2xl p-5 flex items-center gap-4 group border border-emerald-500/30 hover:border-emerald-500 shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-luxury-muted block">
                  WhatsApp Chat
                </span>
                <span className="font-sans font-bold tracking-tight text-base sm:text-lg text-emerald-700">
                  {COMPANY_INFO.whatsapp}
                </span>
              </div>
            </a>

            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="luxury-card rounded-2xl p-5 flex items-center gap-4 group border border-luxury-gold/30 hover:border-luxury-gold shadow-md sm:col-span-2 lg:col-span-1"
            >
              <div className="w-12 h-12 rounded-xl bg-luxury-gold/20 text-luxury-gold flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-luxury-muted block">
                  Email Inquiry
                </span>
                <span className="font-medium text-sm text-luxury-walnut group-hover:text-luxury-gold-dark truncate block">
                  {COMPANY_INFO.email}
                </span>
              </div>
            </a>
          </div>

          {/* Studio Address & Schedule */}
          <div className="bg-luxury-card rounded-2xl p-6 border border-luxury-gold/30 shadow-luxury grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                  Studio & Workshop Address
                </h4>
                <p className="text-xs sm:text-sm text-luxury-muted mt-1 font-medium leading-relaxed">
                  {COMPANY_INFO.address.full}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-luxury-border md:pl-6">
              <div className="w-10 h-10 rounded-xl bg-luxury-gold/20 flex items-center justify-center text-luxury-gold shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel">
                  Visiting & Consultation Hours
                </h4>
                <p className="text-xs sm:text-sm text-luxury-muted mt-1 font-medium leading-relaxed">
                  {COMPANY_INFO.businessHours} (Monday – Sunday)
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <GoogleMapEmbed />

        </div>

      </section>

      {/* 3. What to Expect from a Site Visit */}
      <section className="py-16 bg-luxury-surface/50 border-y border-luxury-border">
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

      {/* 4. Frequently Asked Questions (FAQ) Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Got Questions?"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our interior execution, warranties, and carpentry process in Hyderabad."
        />

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="luxury-card rounded-2xl overflow-hidden border border-luxury-border shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-base sm:text-lg text-luxury-walnut hover:text-luxury-gold-dark transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-luxury-gold shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-luxury-gold shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-luxury-muted shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 pt-1 text-xs sm:text-sm text-luxury-muted leading-relaxed border-t border-luxury-border/60"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

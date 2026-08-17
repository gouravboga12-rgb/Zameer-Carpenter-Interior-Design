import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, CookingPot, Hammer, DoorOpen, Tv, Building2, 
  CheckCircle2, ArrowRight, MessageSquare, Sparkles, Phone
} from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { SERVICES_DATA } from '../../data/servicesData';
import { getServiceInquiryWhatsAppUrl } from '../../utils/whatsapp';

const SERVICE_ICONS = {
  Home,
  CookingPot,
  Hammer,
  DoorOpen,
  Tv,
  Building2
};

export default function ServicesSection() {
  const [activeTabId, setActiveTabId] = useState(SERVICES_DATA[0].id);

  const activeService = SERVICES_DATA.find((s) => s.id === activeTabId) || SERVICES_DATA[0];
  const ActiveIcon = SERVICE_ICONS[activeService.iconName] || Home;

  return (
    <section id="services" className="py-20 sm:py-28 bg-luxury-bg relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Core Services"
          title="Our Expertise"
          subtitle="From handcrafted furniture to complete turnkey interiors, every detail is designed and executed with precision."
        />

        {/* Interactive Service Tab Buttons (6 Services) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mb-10">
          {SERVICES_DATA.map((service) => {
            const Icon = SERVICE_ICONS[service.iconName] || Home;
            const isActive = service.id === activeTabId;

            return (
              <button
                key={service.id}
                onClick={() => setActiveTabId(service.id)}
                className={`p-3.5 sm:p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 transition-all duration-300 relative border ${
                  isActive
                    ? 'bg-luxury-walnut text-[#FDFBF7] border-luxury-gold shadow-lg shadow-luxury-gold/10 scale-105 z-10'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-walnut hover:border-luxury-gold/40 border-luxury-border shadow-sm'
                }`}
              >
                {/* Active Indicator Top Dot */}
                {isActive && (
                  <span className="absolute -top-1.5 w-3 h-3 rounded-full bg-luxury-gold ring-4 ring-luxury-bg" />
                )}

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-luxury-gold text-luxury-walnut' : 'bg-luxury-surface text-luxury-charcoal'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <span className="text-xs font-bold leading-snug tracking-tight font-heading">
                  {service.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Service Detailed View with Smooth Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="luxury-card rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/30"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Column: Image with Luxury Badge (5 Cols) */}
              <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[380px] lg:min-h-full">
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-transparent to-black/20" />
                
                {/* Floating Highlight Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-walnut/90 backdrop-blur-md border border-luxury-gold/50 text-luxury-gold text-xs font-bold shadow-md">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeService.highlight}</span>
                  </span>
                </div>

                {/* Bottom Image Tag */}
                <div className="absolute bottom-4 left-4 right-4 text-[#FDFBF7]">
                  <p className="text-xs font-light text-gray-300">Hyderabad Turnkey Studio & Workshop</p>
                  <p className="text-sm font-bold font-heading text-luxury-gold">{activeService.shortTitle} Specialists</p>
                </div>
              </div>

              {/* Right Column: Detailed Info, Subservices & Actions (7 Cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                
                <div>
                  {/* Title & Tagline */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                        Service Vertical 0{activeService.numericId}
                      </span>
                      <h3 className="font-heading text-2xl sm:text-3xl font-bold text-luxury-walnut mt-1">
                        {activeService.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-luxury-muted leading-relaxed mb-6">
                    {activeService.description}
                  </p>

                  {/* Subservices Grid */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                      Scope & Capabilities Included:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeService.subservices.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-luxury-surface/80 border border-luxury-border text-xs text-luxury-charcoal"
                        >
                          <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                          <span className="font-medium">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-luxury-border/80 flex items-center justify-center sm:justify-start gap-4">
                  <Link
                    to={`/services/${activeService.id}/inquiry`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-luxury-walnut hover:bg-luxury-charcoal text-[#FDFBF7] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02]"
                  >
                    <span>Book {activeService.shortTitle} / Get Quote</span>
                    <ArrowRight className="w-4 h-4 text-luxury-gold" />
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

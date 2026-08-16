import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, CookingPot, Hammer, DoorOpen, Tv, Building2, 
  CheckCircle2, ArrowRight, MessageSquare, Sparkles, ShieldCheck, Layers, ChevronDown, ChevronUp, Phone
} from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import { SERVICES_DATA } from '../data/servicesData';
import { getServiceInquiryWhatsAppUrl, getGeneralWhatsAppUrl } from '../utils/whatsapp';

import { useAdminData } from '../context/AdminDataContext';

const SERVICE_ICONS = {
  Home,
  CookingPot,
  Hammer,
  DoorOpen,
  Tv,
  Building2
};

export default function ServicesPage() {
  const { services } = useAdminData();
  const servicesList = services && services.length > 0 ? services : SERVICES_DATA;
  const [selectedServiceId, setSelectedServiceId] = useState(servicesList[0]?.id || 'complete-home-interiors');
  const [expandedScopes, setExpandedScopes] = useState({});

  const activeService = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];

  const toggleScope = (serviceId) => {
    setExpandedScopes((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  return (
    <div className="pt-24 sm:pt-28 pb-16 bg-luxury-bg">
      
      {/* 2. Interactive Service Detail Browser */}
      <section className="py-8 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Interactive Catalog"
          title="Explore Our Service Verticals"
          subtitle="Inspect technical capabilities, material standards, and execution scope for all our interior verticals across Hyderabad."
        />

        {/* 6 Tab Buttons (Desktop & Tablet Grid Only) */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {servicesList.map((service) => {
            const Icon = SERVICE_ICONS[service.iconName] || Home;
            const isActive = service.id === selectedServiceId;

            return (
              <button
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 transition-all duration-300 relative border ${
                  isActive
                    ? 'bg-luxury-walnut text-[#FDFBF7] border-luxury-gold shadow-lg shadow-luxury-gold/10 scale-105 z-10'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-walnut hover:border-luxury-gold/40 border-luxury-border shadow-sm'
                }`}
              >
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

        {/* DESKTOP VIEW: Active Service Single Panel */}
        <div className="hidden sm:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="luxury-card rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/30"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Image Section */}
                <div className="lg:col-span-5 relative min-h-[420px] lg:min-h-full">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-transparent to-black/20" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-walnut/90 backdrop-blur-md border border-luxury-gold/50 text-luxury-gold text-xs font-bold shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{activeService.highlight}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-[#FDFBF7]">
                    <p className="text-xs font-light text-gray-300">Tolichowki / Shaikpet Precision Workshop</p>
                    <p className="text-sm font-bold font-heading text-luxury-gold">{activeService.title}</p>
                  </div>
                </div>

                {/* Details & Subservices Section */}
                <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                      Service Vertical 0{activeService.numericId}
                    </span>

                    <h3 className="font-heading text-3xl font-bold text-luxury-walnut mt-1">
                      {activeService.title}
                    </h3>
                    
                    <p className="text-sm text-luxury-muted leading-relaxed mt-2 mb-6">
                      {activeService.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                        Detailed Execution Scope:
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
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

                  {/* Primary Action Button */}
                  <div className="pt-4 border-t border-luxury-border flex items-center justify-start">
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-luxury-walnut hover:bg-luxury-charcoal text-[#FDFBF7] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02]"
                    >
                      <span>Book Site Consultation</span>
                      <ArrowRight className="w-4 h-4 text-luxury-gold" />
                    </Link>
                  </div>

                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* MOBILE VIEW: Render All 6 Services Vertically with View More Toggle */}
        <div className="flex flex-col gap-8 sm:hidden">
          {servicesList.map((service, index) => {
            const isExpanded = !!expandedScopes[service.id];
            const visibleScopeItems = isExpanded
              ? service.subservices
              : service.subservices.slice(0, 2);

            return (
              <div
                key={service.id}
                id={service.id}
                className="luxury-card rounded-3xl overflow-hidden shadow-xl border border-luxury-gold/30 flex flex-col"
              >
                {/* Mobile Image Box */}
                <div className="relative aspect-[16/10] overflow-hidden bg-luxury-walnut">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-transparent to-black/20" />
                  
                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-walnut/90 backdrop-blur-md border border-luxury-gold/50 text-luxury-gold text-xs font-bold shadow-md">
                      <Sparkles className="w-3 h-3" />
                      <span>{service.highlight}</span>
                    </span>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-[#FDFBF7]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold font-cinzel block">
                      Service 0{index + 1}
                    </span>
                    <h3 className="text-base font-bold font-heading text-white">{service.title}</h3>
                  </div>
                </div>

                {/* Mobile Card Details */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    {service.description}
                  </p>

                  {/* Subservices Checklist with View More Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                        Execution Scope:
                      </h4>
                      
                      {service.subservices.length > 2 && (
                        <button
                          onClick={() => toggleScope(service.id)}
                          className="text-[11px] font-bold text-luxury-gold-dark hover:text-luxury-walnut flex items-center gap-1 bg-luxury-surface px-2.5 py-1 rounded-lg border border-luxury-border transition-colors"
                        >
                          <span>{isExpanded ? 'Show Less' : 'View More'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {visibleScopeItems.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-luxury-surface/90 border border-luxury-border text-xs text-luxury-charcoal"
                        >
                          <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                          <span className="font-medium">{sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Additional View More Trigger Bar below list */}
                    {!isExpanded && service.subservices.length > 2 && (
                      <button
                        onClick={() => toggleScope(service.id)}
                        className="w-full mt-2 py-2 rounded-xl bg-luxury-surface/70 border border-luxury-border text-[11px] font-bold text-luxury-walnut flex items-center justify-center gap-1 hover:bg-luxury-surface transition-colors"
                      >
                        <span>View More ({service.subservices.length - 2} more items)</span>
                        <ChevronDown className="w-3.5 h-3.5 text-luxury-gold" />
                      </button>
                    )}
                  </div>

                  {/* Mobile Action Button */}
                  <div className="pt-2 border-t border-luxury-border">
                    <Link
                      to="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-luxury-walnut hover:bg-luxury-charcoal text-[#FDFBF7] font-bold text-xs uppercase tracking-wider shadow-md active:scale-98"
                    >
                      <span>Book {service.shortTitle}</span>
                      <ArrowRight className="w-4 h-4 text-luxury-gold" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* 3. Material & Quality Standards Comparison Table */}
      <section className="py-16 bg-luxury-surface/50 border-y border-luxury-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Material Benchmarks"
            title="Our Uncompromising Material Standards"
            subtitle="We exclusively utilize authentic, certified raw materials to guarantee structural longevity and water resistance."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="luxury-card rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                Plywood & Carcass
              </span>
              <h3 className="font-heading text-lg font-bold text-luxury-walnut">IS:710 Marine BWP Plywood</h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Boiling-water-proof (BWP) 100% calibrated marine ply for kitchens, vanities, and wardrobe bases. Resists moisture, warping, and termite infestation.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                Hardware & Motions
              </span>
              <h3 className="font-heading text-lg font-bold text-luxury-walnut">Blum, Hettich & Hafele</h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                Certified German soft-close hinges, heavy-duty tandem box drawers (up to 45kg load), motorized lift-ups, and top-hung sliding dampers.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                Surfaces & Finishes
              </span>
              <h3 className="font-heading text-lg font-bold text-luxury-walnut">Veneer, PU & Acrylic</h3>
              <p className="text-xs text-luxury-muted leading-relaxed">
                European anti-scratch acrylics, high-gloss PU lacquers, and authentic natural wood veneers polished to silky matte or mirror perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

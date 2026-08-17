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
import { getServiceIcon } from '../utils/serviceIcons';

export default function ServicesPage() {
  const { services } = useAdminData();
  const servicesList = services && services.length > 0 ? services : SERVICES_DATA;
  const [selectedServiceId, setSelectedServiceId] = useState(servicesList[0]?.id || 'complete-home-interiors');
  const [expandedScopes, setExpandedScopes] = useState({});

  const activeService = servicesList.find((s) => s.id === selectedServiceId) || servicesList[0];

  const handleSelectService = (id) => {
    setSelectedServiceId(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const el = document.getElementById(`mobile-service-${id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const toggleScope = (serviceId) => {
    setExpandedScopes((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  return (
    <div className="pt-24 sm:pt-28 pb-16 bg-luxury-bg text-luxury-charcoal">
      
      {/* 1. Page Header & Hero Intro */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/15 border border-luxury-gold/30 text-luxury-gold-dark text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Interior Architecture & Bespoke Woodcraft</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-luxury-walnut">
          Our Specialized <span className="text-gold-gradient">Service Verticals</span>
        </h1>

        <p className="text-sm sm:text-base text-luxury-muted max-w-3xl mx-auto leading-relaxed">
          From full-home 3D turnkey interiors to bespoke handcrafted carpentry, explore our specialized service verticals across Hyderabad.
        </p>
      </section>

      {/* 2. Interactive Service Selection Tabs */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-10 sm:mb-12">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5 sm:gap-3 p-1.5 sm:p-2.5 bg-luxury-surface/80 rounded-2xl sm:rounded-3xl border border-luxury-border">
          {servicesList.map((service) => {
            const Icon = getServiceIcon(service.iconName);
            const isActive = service.id === selectedServiceId;

            return (
              <button
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 sm:gap-2.5 transition-all duration-300 relative border cursor-pointer ${
                  isActive
                    ? 'bg-luxury-walnut text-[#FDFBF7] border-luxury-gold shadow-md scale-102 z-10'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-walnut hover:border-luxury-gold/40 border-luxury-border shadow-2xs'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-luxury-gold ring-2 ring-luxury-bg" />
                )}

                <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                  isActive ? 'bg-luxury-gold text-luxury-walnut' : 'bg-luxury-surface text-luxury-charcoal'
                }`}>
                  <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                </div>

                <span className="text-[10px] sm:text-xs font-bold leading-tight tracking-tight font-heading line-clamp-2">
                  {service.shortTitle}
                </span>
              </button>
            );
          })}
        </div>

        {/* DESKTOP VIEW: Active Service Single Panel */}
        <div id="service-details" className="w-full hidden sm:block">
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
                    <p className="text-xs font-light text-gray-300">Hyderabad Precision Studio & Site Execution</p>
                    <p className="text-sm font-bold font-heading text-luxury-gold">{activeService.title}</p>
                  </div>
                </div>

                {/* Details & Subservices Section */}
                <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                      Service Vertical {String(activeService.numericId || '').padStart(2, '0')}
                    </span>

                    <h3 className="font-heading text-3xl font-bold text-luxury-walnut mt-1">
                      {activeService.title}
                    </h3>
                    
                    <p className="text-sm text-luxury-muted leading-relaxed mt-2 mb-6">
                      {activeService.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-3 flex items-center gap-2 font-cinzel">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                        Detailed Execution Scope:
                      </h4>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(activeService.subservices || []).map((sub, idx) => (
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
                  <div className="pt-4 border-t border-luxury-border flex items-center justify-start gap-4">
                    <Link
                      to={`/services/${activeService.id}/inquiry`}
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl bg-luxury-walnut hover:bg-luxury-charcoal text-[#FDFBF7] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02]"
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

        {/* MOBILE VIEW: Render All Services One After Other with Independent View More Scope Toggles */}
        <div className="flex flex-col gap-6 sm:hidden">
          {servicesList.map((service, index) => {
            const isExpanded = !!expandedScopes[service.id];
            const subservices = service.subservices || [];
            const hasExtra = subservices.length > 2;
            const visibleItems = isExpanded ? subservices : subservices.slice(0, 2);

            return (
              <div
                key={service.id}
                id={`mobile-service-${service.id}`}
                className={`luxury-card rounded-3xl overflow-hidden shadow-xl border transition-all duration-300 ${
                  service.id === selectedServiceId ? 'border-luxury-gold ring-2 ring-luxury-gold/30' : 'border-luxury-gold/30'
                }`}
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
                  
                  {/* Top Highlight Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-walnut/90 backdrop-blur-md border border-luxury-gold/50 text-luxury-gold text-xs font-bold shadow-md">
                      <Sparkles className="w-3 h-3" />
                      <span>{service.highlight}</span>
                    </span>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-[#FDFBF7]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold font-cinzel block">
                      Service Vertical {String(service.numericId || index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-bold font-heading text-white">{service.title}</h3>
                  </div>
                </div>

                {/* Mobile Card Content */}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    {service.description}
                  </p>

                  {/* Execution Scope with Independent Toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5 font-cinzel">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                        Detailed Execution Scope:
                      </h4>

                      {hasExtra && (
                        <button
                          type="button"
                          onClick={() => toggleScope(service.id)}
                          className="text-[11px] font-bold text-luxury-gold-dark hover:text-luxury-walnut flex items-center gap-1 bg-luxury-surface px-2.5 py-1 rounded-lg border border-luxury-border transition-colors cursor-pointer"
                        >
                          <span>{isExpanded ? 'Show Less' : 'View More'}</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {visibleItems.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 p-2.5 rounded-xl bg-luxury-surface/90 border border-luxury-border text-xs text-luxury-charcoal"
                        >
                          <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                          <span className="font-medium">{sub}</span>
                        </div>
                      ))}
                    </div>

                    {/* Secondary Bottom Expand Trigger Bar if collapsed */}
                    {!isExpanded && hasExtra && (
                      <button
                        type="button"
                        onClick={() => toggleScope(service.id)}
                        className="w-full mt-2 py-2 rounded-xl bg-luxury-surface/70 hover:bg-luxury-surface border border-luxury-border text-[11px] font-bold text-luxury-walnut flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>View More ({subservices.length - 2} more items)</span>
                        <ChevronDown className="w-3.5 h-3.5 text-luxury-gold" />
                      </button>
                    )}
                  </div>

                  {/* Direct Inquiry CTA */}
                  <div className="pt-2 border-t border-luxury-border">
                    <Link
                      to={`/services/${service.id}/inquiry`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-luxury-walnut hover:bg-luxury-charcoal text-[#FDFBF7] font-bold text-xs uppercase tracking-wider shadow-md active:scale-98 transition-transform"
                    >
                      <span>Book {service.shortTitle} / Get Quote</span>
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

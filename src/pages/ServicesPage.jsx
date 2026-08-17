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
        const el = document.getElementById('service-details');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-2 bg-luxury-surface/80 rounded-3xl border border-luxury-border">
          {servicesList.map((service) => {
            const Icon = getServiceIcon(service.iconName);
            const isActive = service.id === selectedServiceId;

            return (
              <button
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className={`p-4 rounded-2xl flex flex-col items-center text-center gap-2.5 transition-all duration-300 relative border cursor-pointer ${
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

        {/* Responsive Active Service Single Panel (Mobile & Desktop) */}
        <div id="service-details" className="w-full">
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
                <div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[420px] lg:min-h-full">
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
                <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                      Service Vertical {String(activeService.numericId || '').padStart(2, '0')}
                    </span>

                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-luxury-walnut mt-1">
                      {activeService.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed mt-2 mb-6">
                      {activeService.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                        Detailed Execution Scope:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  <div className="pt-4 border-t border-luxury-border flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3">
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

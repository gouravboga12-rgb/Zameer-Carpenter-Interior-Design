import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, MessageSquare, Check, Sparkles, Info, ShieldAlert, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { PROPERTY_TYPES, SCOPES, FINISH_TIERS, calculateEstimate } from '../../data/pricingConfig';
import { formatCurrencyINR } from '../../utils/formatters';
import { getEstimatorWhatsAppUrl } from '../../utils/whatsapp';

export default function CostEstimator() {
  const [selectedPropertyId, setSelectedPropertyId] = useState('2BHK');
  const [selectedScopeId, setSelectedScopeId] = useState('full_interior');
  const [selectedTierId, setSelectedTierId] = useState('premium');

  // Dynamic estimate calculation
  const estimate = useMemo(() => {
    return calculateEstimate(selectedPropertyId, selectedScopeId, selectedTierId);
  }, [selectedPropertyId, selectedScopeId, selectedTierId]);

  const whatsappUrl = useMemo(() => {
    return getEstimatorWhatsAppUrl(estimate);
  }, [estimate]);

  return (
    <section id="cost-estimator" className="py-20 sm:py-28 bg-luxury-surface/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Interactive Cost Calculator"
          title="Get a Quick Project Estimate"
          subtitle="Select your property, scope and finish level to receive an indicative project estimate tailored for Hyderabad homes & workspaces."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Form Controls (7 Cols) */}
          <div className="lg:col-span-7 bg-luxury-card rounded-3xl p-6 sm:p-8 border border-luxury-gold/30 shadow-luxury space-y-8">
            
            {/* 1. Property Type Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                  1. Select Property Type
                </label>
                <span className="text-xs text-luxury-muted font-medium">
                  {estimate.property.approxArea}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                {PROPERTY_TYPES.map((prop) => {
                  const isSelected = prop.id === selectedPropertyId;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => setSelectedPropertyId(prop.id)}
                      className={`py-3 px-3 rounded-xl text-center transition-all duration-200 border ${
                        isSelected
                          ? 'bg-luxury-walnut text-luxury-gold border-luxury-gold shadow-md font-bold'
                          : 'bg-luxury-surface/70 text-luxury-charcoal hover:border-luxury-gold/50 border-luxury-border'
                      }`}
                    >
                      <span className="block text-sm sm:text-base font-heading font-bold">{prop.label}</span>
                      <span className={`block text-[10px] sm:text-[11px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-luxury-muted'}`}>
                        {prop.approxArea.split('-')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Project Scope Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                  2. Select Project Scope
                </label>
              </div>
              <div className="space-y-2">
                {SCOPES.map((scope) => {
                  const isSelected = scope.id === selectedScopeId;
                  return (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setSelectedScopeId(scope.id)}
                      className={`w-full p-3.5 rounded-xl text-left transition-all duration-200 border flex items-center justify-between ${
                        isSelected
                          ? 'bg-luxury-walnut text-[#FDFBF7] border-luxury-gold shadow-md'
                          : 'bg-luxury-surface/70 text-luxury-charcoal hover:border-luxury-gold/50 border-luxury-border'
                      }`}
                    >
                      <div className="pr-2">
                        <span className={`block font-heading text-sm font-bold ${isSelected ? 'text-luxury-gold' : 'text-luxury-walnut'}`}>
                          {scope.label}
                        </span>
                        <span className={`block text-xs mt-0.5 leading-snug ${isSelected ? 'text-gray-300' : 'text-luxury-muted'}`}>
                          {scope.tagline}
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-luxury-gold bg-luxury-gold text-luxury-walnut' : 'border-gray-300'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Finish & Material Tier Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal font-cinzel flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></span>
                  3. Select Finish & Material Quality Tier
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {FINISH_TIERS.map((tier) => {
                  const isSelected = tier.id === selectedTierId;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      className={`p-4 rounded-xl text-left transition-all duration-200 border relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-luxury-walnut text-[#FDFBF7] border-luxury-gold shadow-md ring-1 ring-luxury-gold'
                          : 'bg-luxury-surface/70 text-luxury-charcoal hover:border-luxury-gold/50 border-luxury-border'
                      }`}
                    >
                      <div>
                        {tier.isPopular && (
                          <span className="absolute -top-2 right-3 text-[10px] font-bold uppercase px-2 py-0.5 bg-luxury-gold text-luxury-walnut rounded-full shadow-sm">
                            Popular
                          </span>
                        )}
                        <span className={`block font-heading text-base font-bold ${isSelected ? 'text-luxury-gold' : 'text-luxury-walnut'}`}>
                          {tier.label}
                        </span>
                        <span className={`block text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-luxury-gold-warm' : 'text-luxury-gold-dark'}`}>
                          {tier.badge}
                        </span>
                        <p className={`text-[11px] mt-2 leading-relaxed ${isSelected ? 'text-gray-300' : 'text-luxury-muted'}`}>
                          {tier.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Output Card & WhatsApp Lead CTA (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-5">
            
            {/* Calculation Result Box */}
            <motion.div
              layout
              className="bg-luxury-walnut text-[#FDFBF7] rounded-3xl p-6 sm:p-8 border-2 border-luxury-gold/50 shadow-2xl relative overflow-hidden"
            >
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-luxury-gold/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                      <Calculator className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-luxury-gold">
                      Indicative Project Cost
                    </span>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300">
                    Hyderabad Rates
                  </span>
                </div>

                {/* Main Estimated Price Range */}
                <div className="text-center py-4 bg-black/25 rounded-2xl border border-luxury-gold/20 mb-6">
                  <span className="text-xs text-gray-400 font-light block mb-1">
                    Estimated Cost Range
                  </span>
                  <div className="font-heading text-3xl sm:text-4xl font-bold text-gold-gradient tracking-tight">
                    {formatCurrencyINR(estimate.min)} - {formatCurrencyINR(estimate.max)}
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    (Materials + Master Carpentry + Turnkey Handover)
                  </span>
                </div>

                {/* Selected Breakdown Summary */}
                <div className="space-y-2.5 text-xs text-gray-300 mb-6">
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-gray-400">Property:</span>
                    <span className="font-bold text-[#FDFBF7]">{estimate.property.label} ({estimate.property.approxArea})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-gray-400">Scope:</span>
                    <span className="font-bold text-luxury-gold">{estimate.scope.label}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/10">
                    <span className="text-gray-400">Finish Tier:</span>
                    <span className="font-bold text-[#FDFBF7]">{estimate.tier.label} ({estimate.tier.badge})</span>
                  </div>
                </div>

                {/* Key Inclusions Preview */}
                <div className="mb-6 bg-white/5 p-3.5 rounded-xl border border-white/10 text-xs">
                  <span className="font-bold text-luxury-gold block mb-2 font-heading">
                    Key Inclusions in this Scope:
                  </span>
                  <ul className="space-y-1.5">
                    {estimate.scope.deliverables.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-gray-300">
                        <Check className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Primary CTA: Send Estimate to WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Send Estimate to WhatsApp</span>
                </a>

                {/* Indicative Disclaimer */}
                <div className="mt-4 flex items-start gap-2 text-[11px] text-gray-400 leading-normal">
                  <Info className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-gray-300">Note:</strong> This is an indicative price range. Final pricing depends on exact site laser measurements, customized hardware selections, and on-site requirements.
                  </p>
                </div>

              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}

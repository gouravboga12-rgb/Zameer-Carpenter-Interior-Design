import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, LayoutTemplate, Boxes, Layers, Hammer, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { PROCESS_STEPS } from '../../data/processData';

const STEP_ICONS = {
  Ruler,
  LayoutTemplate,
  Boxes,
  Layers,
  Hammer,
  CheckCircle2
};

export default function ProcessTimeline() {
  return (
    <section id="process" className="py-20 sm:py-28 bg-luxury-walnut text-[#FDFBF7] relative overflow-hidden">
      {/* Background Subtle Radial Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading with Dark Theme */}
        <SectionHeading
          badge="Execution Roadmap"
          title="From Vision to Reality"
          subtitle="Our structured 6-step turnkey workflow guarantees architectural precision, total cost transparency, and on-time handover."
          dark={true}
        />

        {/* 6 Steps Responsive Grid / Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = STEP_ICONS[step.icon] || Hammer;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-luxury-charcoal/90 rounded-2xl p-6 sm:p-7 border border-luxury-gold/25 hover:border-luxury-gold shadow-xl flex flex-col justify-between relative group hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Gold Glow Aura on Hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 rounded-full blur-xl group-hover:bg-luxury-gold/15 transition-all pointer-events-none" />

                <div>
                  {/* Top Bar: Number + Icon + Timeline Duration */}
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <span className="font-heading font-black text-2xl text-luxury-gold tracking-wider">
                        {step.stepNumber}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-luxury-gold/15 border border-luxury-gold/30 flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-luxury-walnut transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-gray-300 border border-white/10">
                      {step.duration}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-heading text-xl font-bold text-[#FDFBF7] group-hover:text-luxury-gold transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-luxury-gold-warm mt-0.5 mb-3">
                    {step.subtitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Deliverable & Location Tag */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-start gap-1.5 text-xs text-luxury-gold">
                    <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="font-medium text-gray-200">Output: {step.deliverable}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <MapPin className="w-3 h-3 text-luxury-gold" />
                    <span>{step.locationNote}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

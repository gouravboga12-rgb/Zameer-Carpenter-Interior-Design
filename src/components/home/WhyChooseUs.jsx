import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Compass, BadgePercent, ShieldCheck, Workflow, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const PILLARS = [
  {
    icon: Award,
    title: "Master Carpentry Experience",
    highlight: "15+ Years of Craftsmanship",
    desc: "Over 15 years of master woodworking lineage in Hyderabad. Our seasoned carpenters bring fine handcrafted joinery, structural longevity, and bespoke elegance to every project.",
    tag: "Master Expertise"
  },
  {
    icon: Compass,
    title: "Precision Customization",
    highlight: "Millimeter-Level Execution",
    desc: "No prefabricated compromises. Every cabinet, modular kitchen corner, wardrobe loft, and fluted panel is laser-measured and customized to match your exact floor plan.",
    tag: "100% Tailored Fit"
  },
  {
    icon: BadgePercent,
    title: "Direct Workshop Pricing",
    highlight: "Zero Middlemen Markups",
    desc: "By manufacturing directly at our local Hyderabad carpentry workshop, we pass significant savings to you without inflating margins through subcontractors or showrooms.",
    tag: "Factory Direct"
  },
  {
    icon: ShieldCheck,
    title: "Premium Materials & Hardware",
    highlight: "IS:710 Marine Plywood & German Hardware",
    desc: "We exclusively utilize boiling-water-proof (BWP) marine plywood, genuine teakwood, and certified German hardware fittings from Hettich, Hafele, Blum, and Ebco.",
    tag: "Certified Durability"
  },
  {
    icon: Workflow,
    title: "End-to-End Turnkey Execution",
    highlight: "Design → 3D → Carpentry → Handover",
    desc: "A frictionless journey under one roof: Site Measurement → 2D Floor Plans → 3D Photorealistic Renders → Material Selection → Workshop Carpentry → On-Time Handover.",
    tag: "Single-Point Control"
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-20 sm:py-28 bg-luxury-bg relative overflow-hidden">
      {/* Background Architectural Accent Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent" />
        <div className="absolute right-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <SectionHeading
          badge="Why Zameer Interiors"
          title="Crafted With Experience. Designed With Precision."
          subtitle="We combine traditional master woodworking mastery with cutting-edge 3D interior architecture to deliver enduring luxury across Hyderabad."
        />

        {/* 5 Pillars Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isWide = idx === 4; // 5th item spans full width on lg screens or balances layout

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`luxury-card rounded-2xl p-7 flex flex-col justify-between relative group overflow-hidden ${
                  isWide ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Top Corner Subtle Gold Glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-luxury-gold/10 blur-xl group-hover:bg-luxury-gold/20 transition-all" />

                <div>
                  {/* Top Bar: Icon + Tag */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-luxury-gold group-hover:text-luxury-walnut transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-luxury-gold-light/60 text-luxury-charcoal border border-luxury-gold/40">
                      {pillar.tag}
                    </span>
                  </div>

                  {/* Title & Highlight */}
                  <h3 className="font-heading text-xl font-bold text-luxury-walnut group-hover:text-luxury-gold-dark transition-colors">
                    {pillar.title}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-luxury-gold-dark mt-1 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                    <span>{pillar.highlight}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-luxury-muted leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                {/* Bottom Decorative Gold Line Accent */}
                <div className="mt-6 pt-4 border-t border-luxury-border/60 flex items-center justify-between text-xs text-luxury-charcoal font-medium">
                  <span className="text-luxury-muted font-cinzel tracking-wider">Pillar 0{idx + 1}</span>
                  <span className="text-luxury-gold opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    Tolichowki • Hyderabad
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

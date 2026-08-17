import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Compass, BadgePercent, ShieldCheck, Workflow, CheckCircle2, ArrowRight, Sparkles, MapPin, Hammer, Users, Factory } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import ProcessTimeline from '../components/home/ProcessTimeline';
import TestimonialsMarquee from '../components/common/TestimonialsMarquee';
import { COMPANY_INFO } from '../data/companyInfo';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function AboutUsPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-16 bg-luxury-bg">
      
      {/* 1. About Hero Banner */}
      <section className="relative py-16 sm:py-24 bg-luxury-walnut text-[#FDFBF7] overflow-hidden border-b border-luxury-gold/30">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=85"
            alt="Zameer Carpenter Interior Design Workshop & Heritage"
            className="w-full h-full object-cover object-center filter brightness-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-walnut via-luxury-walnut/80 to-luxury-walnut/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luxury-gold/20 border border-luxury-gold/40 text-luxury-gold text-xs sm:text-sm font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>15+ Years of Master Woodworking Lineage</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Master Woodcraft Meets <br />
            <span className="text-gold-gradient">Modern Interior Architecture</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Founded in Tolichowki, Hyderabad, Zameer Carpenter Interior Design bridges the gap between traditional handcrafted carpentry precision and cutting-edge 3D photorealistic turnkey execution.
          </p>
        </div>
      </section>

      {/* 2. Heritage Story & The Workshop Advantage */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Mosaic */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/30">
              <img
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85"
                alt="Master carpentry craft"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-luxury-walnut/90 backdrop-blur-md border border-luxury-gold/40 text-[#FDFBF7]">
                <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold block mb-1">
                  Tolichowki / Shaikpet Workshop
                </span>
                <p className="text-xs text-gray-300">
                  Direct manufacturing with zero middleman commissions — highest quality IS:710 Marine Plywood & German hardware fittings.
                </p>
              </div>
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -top-6 -right-6 hidden sm:flex flex-col items-center justify-center w-32 h-32 rounded-3xl bg-luxury-gold text-luxury-walnut shadow-gold-glow border-2 border-luxury-walnut">
              <span className="font-heading text-3xl font-black">15+</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
                Years of Heritage
              </span>
            </div>
          </div>

          {/* Right Column: Story & Principles */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold-dark font-cinzel">
                Our Heritage & Philosophy
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-luxury-walnut mt-2 leading-tight">
                Crafting Spaces with Passion, Precision & Integrity
              </h2>
            </div>

            <p className="text-sm sm:text-base text-luxury-muted leading-relaxed">
              At <strong className="text-luxury-walnut">Zameer Carpenter Interior Design</strong>, we believe that true luxury interiors are born in the details of the wood. Unlike conventional design agencies that outsource carpentry to transient subcontractors, we are master craftsmen who own our local Hyderabad workshop.
            </p>

            <p className="text-sm sm:text-base text-luxury-muted leading-relaxed">
              Every curve of our fluted panels, every laser-straight alignment on our modular kitchens, and every whisper-quiet glide of our wardrobe sliding systems is designed, manufactured, and quality-tested by experienced artisans under direct supervision.
            </p>

            {/* Quick Core Strengths List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-luxury-surface border border-luxury-border">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-luxury-charcoal">Direct Workshop Pricing</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-luxury-surface border border-luxury-border">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-luxury-charcoal">IS:710 Marine BWP Plywood</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-luxury-surface border border-luxury-border">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-luxury-charcoal">Hettich & Hafele German Hardware</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-luxury-surface border border-luxury-border">
                <CheckCircle2 className="w-4 h-4 text-luxury-gold shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-luxury-charcoal">Photorealistic 3D Renders</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 py-3.5 px-6 rounded-full bg-luxury-walnut hover:bg-luxury-charcoal text-[#FDFBF7] font-semibold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                <span>Book Site Measurement Visit</span>
                <ArrowRight className="w-4 h-4 text-luxury-gold" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. The 5 Core Pillars */}
      <section className="py-20 bg-luxury-surface/50 border-y border-luxury-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="The 5 Pillars"
            title="Why Hyderabad Homeowners Choose Zameer Interiors"
            subtitle="Our unyielding commitment to material authenticity, millimeter precision, and honest pricing."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="luxury-card rounded-2xl p-7 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-luxury-walnut">15+ Years Master Woodcraft</h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                Generational carpentry mastery ensuring solid joinery, durable carcasses, and rich architectural finishes that withstand decades of usage.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-7 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center">
                <BadgePercent className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-luxury-walnut">Direct Workshop Rates</h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                Save 25-35% compared to commercial design brokers. We manufacture directly in our Tolichowki workshop without unnecessary middleman inflation.
              </p>
            </div>

            <div className="luxury-card rounded-2xl p-7 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-luxury-walnut text-luxury-gold flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-luxury-walnut">Genuine Certified Materials</h3>
              <p className="text-xs sm:text-sm text-luxury-muted leading-relaxed">
                100% boiling-water-proof (BWP) marine plywood, genuine teak wood, and branded fittings from Blum, Hettich, Hafele, and Ebco.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Execution Roadmap Section */}
      <ProcessTimeline />

      {/* 5. Real Customer Testimonials Marquee */}
      <TestimonialsMarquee />

      {/* 6. Direct CTA Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-luxury-walnut">
          Discuss Your Project with Master Craftsmen
        </h2>
        <p className="text-sm sm:text-base text-luxury-muted max-w-2xl mx-auto leading-relaxed">
          We provide free on-site consultations across Tolichowki, Shaikpet, Jubilee Hills, Gachibowli, Banjara Hills, and all of Hyderabad.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-luxury-gold hover:bg-yellow-500 text-luxury-walnut font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all"
          >
            <span>Request Site Visit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <span>WhatsApp Us Direct</span>
          </a>
        </div>
      </section>

    </div>
  );
}

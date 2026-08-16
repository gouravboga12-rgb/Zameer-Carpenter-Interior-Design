import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Eye, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FeatureBadges from '../components/home/FeatureBadges';
import BeforeAfterSection from '../components/home/BeforeAfterSection';
import ServicesSection from '../components/home/ServicesSection';
import ProcessTimeline from '../components/home/ProcessTimeline';
import PortfolioSection from '../components/home/PortfolioSection';
import TestimonialsMarquee from '../components/common/TestimonialsMarquee';
import ContactSection from '../components/home/ContactSection';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Feature Value Proposition Badges */}
      <FeatureBadges />

      {/* 3. Interactive Transformation Before & After Slider */}
      <BeforeAfterSection />

      {/* 5. Core Services Vertical Tabs */}
      <ServicesSection />

      {/* 6. Execution Roadmap & Process Timeline */}
      <ProcessTimeline />

      {/* 7. Portfolio Gallery & Real Video Walkthroughs (5 Preview Items + View All Button) */}
      <PortfolioSection isHomePage={true} />

      {/* 8. Real Customer Testimonials Marquee */}
      <TestimonialsMarquee />

      {/* 9. Direct Consultation Booking & Google Maps */}
      <ContactSection />

      {/* Bottom Conversion Banner */}
      <section className="py-16 bg-luxury-walnut text-[#FDFBF7] relative overflow-hidden border-t border-luxury-gold/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold font-cinzel">
            Tolichowki • Shaikpet • Hyderabad
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Ready to Begin Your Dream Space Transformation?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Schedule a free site measurement and 3D design consultation with our master woodcraft and interior team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-luxury-gold hover:bg-yellow-500 text-luxury-walnut font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

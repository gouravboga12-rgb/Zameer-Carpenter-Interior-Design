import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, MessageSquare, MapPin } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import BeforeAfterSection from '../components/home/BeforeAfterSection';
import PortfolioSection from '../components/home/PortfolioSection';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export default function RecentProjectsPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-16 bg-luxury-bg">
      
      {/* 1. Interactive Before & After Transformations */}
      <BeforeAfterSection showAll={true} />

      {/* 3. Filterable Portfolio Gallery & Lightbox Modal */}
      <PortfolioSection />

      {/* 4. Project Consultation Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="font-heading text-3xl sm:text-4xl font-bold text-luxury-walnut">
          Inspired by Recent Projects?
        </h2>
        <p className="text-sm sm:text-base text-luxury-muted max-w-2xl mx-auto leading-relaxed">
          Let’s discuss your floor plan and develop photorealistic 3D renders tailored to your exact tastes and budget.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-luxury-gold hover:bg-yellow-500 text-luxury-walnut font-bold text-xs uppercase tracking-wider shadow-gold-glow transition-all"
          >
            <span>Book Free 3D Design Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={getGeneralWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      </section>

    </div>
  );
}

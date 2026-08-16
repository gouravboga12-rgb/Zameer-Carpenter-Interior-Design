import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';

export default function HeroSection() {
  const scrollToNext = (e) => {
    e.preventDefault();
    const el = document.getElementById('why-us') || document.getElementById('features');
    if (el) {
      const offsetTop = el.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero" className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between items-center pt-32 sm:pt-36 pb-12 bg-luxury-walnut overflow-hidden">
      
      {/* Background Architectural Imagery - Bright, High Clarity and High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=95"
          alt="Bespoke Woodwork and Luxury Interiors Hyderabad"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.03] scale-100"
        />
        {/* Soft, light translucent vignette to maximize background visibility while keeping text crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.45)_100%)]" />
      </div>

      {/* Main Centered Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col items-center justify-center my-auto">
        
        {/* Main Architectural Headline with High Contrast Drop Shadow */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#FDFBF7] tracking-tight leading-[1.15] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
        >
          We Design & Craft Your{' '}
          <span className="text-[#E5C368] italic font-serif drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Dream Spaces
          </span>
        </motion.h1>

        {/* Subheadline matching Reference Style with Sharp Contrast */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-[#F9F6F0] max-w-3xl font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
        >
          Creating customized spaces that balance traditional craftsmanship with modern functionality. Bespoke carpentry, 3D visualization, and complete turnkey execution in Hyderabad.
        </motion.p>

        {/* Two Centered Action Buttons (VIEW PROJECTS + BOOK CONSULTATION) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* 1. VIEW PROJECTS Button */}
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded bg-gradient-to-r from-[#D4AF37] via-[#E2C366] to-[#C5A880] text-luxury-walnut font-bold text-xs sm:text-sm uppercase tracking-[0.16em] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:brightness-105 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>VIEW PROJECTS</span>
          </Link>

          {/* 2. BOOK CONSULTATION Button */}
          <Link
            to="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded bg-black/70 hover:bg-luxury-walnut text-luxury-gold border border-luxury-gold/80 hover:border-luxury-gold font-bold text-xs sm:text-sm uppercase tracking-[0.16em] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>BOOK CONSULTATION</span>
          </Link>
        </motion.div>

      </div>

      {/* Bottom: Elegant "SCROLL DOWN" Indicator with Vertical Line matching Reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative z-10 flex flex-col items-center justify-center mt-auto drop-shadow-md"
      >
        <a
          href="#why-us"
          onClick={scrollToNext}
          className="group flex flex-col items-center text-center cursor-pointer focus:outline-none"
          aria-label="Scroll down to content"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-gold group-hover:text-white transition-colors mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            SCROLL DOWN
          </span>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-luxury-gold via-luxury-gold/80 to-transparent group-hover:h-10 transition-all duration-300 animate-pulse shadow-sm" />
        </a>
      </motion.div>

    </section>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BeforeAfterSlider from './BeforeAfterSlider';
import { TRANSFORMATION_DATA } from '../../data/transformationData';

export default function BeforeAfterSection({ showAll = false }) {
  const displayItems = showAll ? TRANSFORMATION_DATA : TRANSFORMATION_DATA.slice(0, 4);

  return (
    <section id="before-after" className="py-20 sm:py-28 bg-[#FDFBF7] relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header matching Reference */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#C5A880] font-cinzel block mb-2">
            TRANSFORMATIONS
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-luxury-walnut tracking-tight">
            Before & After Showcase
          </h2>
          <p className="mt-3 text-sm sm:text-base text-luxury-muted font-normal max-w-2xl mx-auto">
            Drag the golden divider to see the structural conversion from bare rooms to customized designer living.
          </p>
        </div>

        {/* Grid of Interactive Before & After Sliders (2x2 on Home, 3x2 on Recent Projects Page) */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${showAll ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 lg:gap-8 max-w-7xl mx-auto`}>
          {displayItems.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              <BeforeAfterSlider
                project={project}
                initialPos={idx % 2 === 0 ? 80 : 82}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom Centered CTA Button */}
        {!showAll && (
          <div className="mt-12 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded bg-luxury-walnut hover:bg-black text-[#D4AF37] border border-[#D4AF37] text-xs font-bold uppercase tracking-[0.18em] shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>VIEW MORE TRANSFORMATIONS</span>
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}

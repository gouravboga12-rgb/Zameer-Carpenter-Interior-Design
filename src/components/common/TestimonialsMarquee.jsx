import React from 'react';
import { Star, Sparkles } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData';

export default function TestimonialsMarquee() {
  // Duplicate array for seamless infinite marquee loop
  const duplicatedTestimonials = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];

  return (
    <section className="py-20 sm:py-24 bg-luxury-surface/60 border-y border-luxury-border/80 overflow-hidden relative">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* Header matching Reference */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center mb-12 relative z-10">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-luxury-walnut tracking-tight">
          Be our next happy customer
        </h2>
        <p className="mt-3 text-sm sm:text-base text-luxury-muted font-normal">
          with satisfied budgets and beautiful homes
        </p>
      </div>

      {/* Horizontal Auto-Scrolling Marquee Container */}
      <div className="relative w-full overflow-hidden group">
        
        {/* Left and Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-luxury-surface via-luxury-surface/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-luxury-surface via-luxury-surface/80 to-transparent z-10 pointer-events-none" />

        {/* Continuous Animated Track (Pause on Hover) */}
        <div className="flex w-max space-x-6 animate-marquee group-hover:[animation-play-state:paused] py-4 px-6">
          {duplicatedTestimonials.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[310px] sm:w-[360px] bg-luxury-card rounded-2xl p-6 sm:p-7 shadow-luxury hover:shadow-luxury-hover border border-luxury-border/80 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 select-none shrink-0"
            >
              {/* Star Rating */}
              <div>
                <div className="flex items-center gap-1 text-[#D4AF37] mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Quote Text */}
                <p className="text-xs sm:text-sm text-luxury-charcoal font-serif italic leading-relaxed line-clamp-4">
                  "{item.review}"
                </p>
              </div>

              {/* Customer Avatar & Metadata */}
              <div className="flex items-center gap-3.5 pt-5 mt-4 border-t border-luxury-border/60">
                <div className="w-10 h-10 rounded-full bg-[#EFE8DC] text-luxury-walnut font-bold text-sm flex items-center justify-center border border-luxury-gold/40 shadow-sm shrink-0">
                  {item.initial}
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-luxury-walnut leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-luxury-muted mt-0.5 font-medium">
                    {item.project}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Inline Keyframes for Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 38s linear infinite;
        }
      `}</style>
    </section>
  );
}

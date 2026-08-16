import React from 'react';

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  dark = false,
  className = ""
}) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3.5 border ${
          dark 
            ? 'bg-luxury-gold/10 border-luxury-gold/30 text-luxury-gold'
            : 'bg-luxury-gold-light/60 border-luxury-gold/40 text-luxury-charcoal'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse"></span>
          <span>{badge}</span>
        </div>
      )}

      <h2 className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight ${
        dark ? 'text-[#FDFBF7]' : 'text-luxury-walnut'
      }`}>
        {title}
      </h2>

      {/* Decorative Gold Divider */}
      <div className={`flex items-center gap-3 my-4 ${centered ? 'justify-center' : 'justify-start'}`}>
        <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-luxury-gold to-luxury-gold"></span>
        <span className="w-2 h-2 rotate-45 border border-luxury-gold bg-luxury-gold/40"></span>
        <span className="h-[1px] w-12 bg-gradient-to-l from-transparent via-luxury-gold to-luxury-gold"></span>
      </div>

      {subtitle && (
        <p className={`text-base sm:text-lg leading-relaxed ${
          dark ? 'text-gray-300' : 'text-luxury-muted'
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

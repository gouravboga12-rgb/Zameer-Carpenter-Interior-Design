import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check if splash has already been shown in this session
    const hasSeenSplash = sessionStorage.getItem('zameer_splash_shown');
    if (hasSeenSplash) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('zameer_splash_shown', 'true');
      if (onComplete) onComplete();
    }, 1700);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('zameer_splash_shown', 'true');
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-luxury-walnut cursor-pointer overflow-hidden select-none"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.18)_0%,rgba(30,27,24,0)_70%)] pointer-events-none" />
          
          {/* Background Subtle Wood Grain Texture Lines */}
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#D4AF37_1px,transparent_1px),linear-gradient(to_bottom,#D4AF37_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Centered Luxury Logo & Text */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center text-center px-6 max-w-lg"
          >
            {/* Logo Image */}
            <div className="relative mb-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="w-48 sm:w-64 md:w-80 filter drop-shadow-[0_10px_25px_rgba(212,175,55,0.35)]"
              >
                <img
                  src="/logo.png"
                  alt="Zameer Carpenter Interior Design"
                  className="w-full h-auto object-contain"
                />
              </motion.div>
            </div>

            {/* Subtitle & Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="space-y-2"
            >
              <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-luxury-gold">
                Master Woodcraft & Luxury Interiors
              </p>
              <p className="text-xs text-gray-400 font-light">
                Tolichowki • Shaikpet • Hyderabad
              </p>
            </motion.div>

            {/* Elegant Loading Bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "140px", opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent mt-8"
            />

            <span className="text-[10px] tracking-widest text-gray-500 uppercase mt-4">
              Tap anywhere to enter
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

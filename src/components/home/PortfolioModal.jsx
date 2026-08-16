import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ChevronLeft, ChevronRight, Film } from 'lucide-react';

export default function PortfolioModal({ project, isOpen, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext, hasPrev, hasNext]);

  // Handle video autoplay with muted default
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [project]);

  if (!project) return null;

  const isVideo = project.type === 'video' || !!project.videoUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pt-16 sm:pt-20 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-luxury-walnut/90 backdrop-blur-md cursor-pointer"
          />

          {/* Floating High-Visibility Close Button (Top Right) */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="fixed top-4 right-4 sm:top-6 sm:right-8 z-[60] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-luxury-gold hover:bg-yellow-400 text-luxury-walnut font-extrabold text-xs uppercase tracking-wider shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-luxury-walnut cursor-pointer"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-4xl bg-luxury-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/40 max-h-[88vh] flex flex-col my-auto"
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 bg-luxury-walnut text-[#FDFBF7] flex items-center justify-between border-b border-luxury-gold/20 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {isVideo ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold uppercase tracking-wider shrink-0">
                    <Film className="w-3 h-3" />
                    <span>Video Walkthrough</span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-luxury-gold shrink-0" />
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold font-cinzel truncate">
                  {project.category}
                </span>
              </div>

              {/* Header Close Button */}
              <button
                onClick={onClose}
                aria-label="Close media modal"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-luxury-gold text-luxury-walnut hover:bg-yellow-400 font-bold text-xs transition-all shadow-sm shrink-0 ml-2 cursor-pointer"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-3 sm:p-5 space-y-3.5">
              
              {/* Media Display Area (Fully Visible on Desktop & Mobile) */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-black flex items-center justify-center min-h-[200px] max-h-[55vh] sm:max-h-[62vh] w-full">
                {isVideo ? (
                  <video
                    ref={videoRef}
                    src={project.videoUrl}
                    poster={project.poster}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto max-h-[55vh] sm:max-h-[62vh] object-contain mx-auto bg-black"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto max-h-[55vh] sm:max-h-[62vh] object-contain mx-auto bg-black"
                  />
                )}

                {/* Prev Navigation Button */}
                {hasPrev && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPrev();
                    }}
                    aria-label="Previous project"
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-luxury-gold hover:text-luxury-walnut text-white backdrop-blur-md transition-colors border border-white/20 z-20 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Next Navigation Button */}
                {hasNext && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNext();
                    }}
                    aria-label="Next project"
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-luxury-gold hover:text-luxury-walnut text-white backdrop-blur-md transition-colors border border-white/20 z-20 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Single-Line Clean Title & One-Line Description */}
              <div className="space-y-1.5 pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                  <h3 className="font-heading text-base sm:text-xl font-bold text-luxury-walnut truncate">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-luxury-muted shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0" />
                    <span>{project.location}</span>
                  </div>
                </div>

                {/* Clean 1-Line Description */}
                <p className="text-xs sm:text-sm text-luxury-muted line-clamp-1 leading-relaxed">
                  {project.description}
                </p>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

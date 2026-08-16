import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Layers, Sparkles, MessageSquare, ChevronLeft, ChevronRight, Play, Film } from 'lucide-react';
import { getPortfolioInquiryWhatsAppUrl } from '../../utils/whatsapp';

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

  // Pause video on project switch or close
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [project]);

  if (!project) return null;

  const isVideo = project.type === 'video' || !!project.videoUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-luxury-walnut/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-4xl bg-luxury-card rounded-3xl overflow-hidden shadow-2xl border border-luxury-gold/40 max-h-[92vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-luxury-walnut text-[#FDFBF7] flex items-center justify-between border-b border-luxury-gold/20">
              <div className="flex items-center gap-2.5">
                {isVideo ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold uppercase tracking-wider">
                    <Film className="w-3 h-3" />
                    <span>Video Walkthrough</span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-luxury-gold"></span>
                )}
                <span className="text-xs font-bold uppercase tracking-widest text-luxury-gold font-cinzel">
                  {project.category}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close media modal"
                className="p-2 rounded-full bg-white/10 hover:bg-luxury-gold hover:text-luxury-walnut transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* Media Display Area (Video or Image) */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-video max-h-[480px] bg-black flex items-center justify-center">
                {isVideo ? (
                  <video
                    ref={videoRef}
                    src={project.videoUrl}
                    poster={project.poster}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain bg-black"
                  />
                ) : (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-contain bg-black"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-luxury-gold hover:text-luxury-walnut text-white backdrop-blur-md transition-colors border border-white/20 z-20"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-luxury-gold hover:text-luxury-walnut text-white backdrop-blur-md transition-colors border border-white/20 z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Project Specification Details */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-heading text-2xl font-bold text-luxury-walnut">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-luxury-muted">
                    <MapPin className="w-4 h-4 text-luxury-gold shrink-0" />
                    <span>{project.location}</span>
                  </div>
                </div>

                <p className="text-sm text-luxury-muted leading-relaxed">
                  {project.description}
                </p>

                {/* Materials & Scope Pill Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-luxury-surface/80 border border-luxury-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5 mb-1">
                      <Layers className="w-3.5 h-3.5 text-luxury-gold" />
                      Materials & Hardware Specs
                    </span>
                    <p className="text-xs text-luxury-charcoal font-medium">
                      {project.materials}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-luxury-surface/80 border border-luxury-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-luxury-charcoal flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                      Turnkey Execution Scope
                    </span>
                    <p className="text-xs text-luxury-charcoal font-medium">
                      {project.scope}
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

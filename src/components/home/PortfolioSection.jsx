import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, MapPin, Sparkles, MessageSquare, Layers, Play, Film, CheckCircle2, ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import PortfolioModal from './PortfolioModal';
import { PORTFOLIO_CATEGORIES, PORTFOLIO_PROJECTS, REAL_PROJECT_VIDEOS } from '../../data/portfolioData';

export default function PortfolioSection({ isHomePage = false }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Combined projects and videos
  const allMediaItems = useMemo(() => {
    return [...PORTFOLIO_PROJECTS, ...REAL_PROJECT_VIDEOS];
  }, []);

  // Filter items smoothly
  const filteredItems = useMemo(() => {
    let items = allMediaItems;
    if (selectedCategory === 'Video Walkthroughs') {
      items = REAL_PROJECT_VIDEOS;
    } else if (selectedCategory !== 'All') {
      items = allMediaItems.filter((p) => p.category === selectedCategory);
    }
    
    // On Home Page, limit preview to 5 items
    return isHomePage ? items.slice(0, 5) : items;
  }, [selectedCategory, allMediaItems, isHomePage]);

  // Modal navigation indices
  const currentModalIndex = useMemo(() => {
    if (!activeModalProject) return -1;
    return filteredItems.findIndex((p) => p.id === activeModalProject.id);
  }, [activeModalProject, filteredItems]);

  const handlePrevItem = () => {
    if (currentModalIndex > 0) {
      setActiveModalProject(filteredItems[currentModalIndex - 1]);
    }
  };

  const handleNextItem = () => {
    if (currentModalIndex < filteredItems.length - 1) {
      setActiveModalProject(filteredItems[currentModalIndex + 1]);
    }
  };

  return (
    <section id="portfolio" className="py-20 sm:py-28 bg-luxury-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="100% Real Site Execution"
          title="Recent Projects & Transformations"
          subtitle="Explore authentic photography and video walkthroughs of completed turnkey interiors, bespoke modular kitchens, custom wardrobes, and master woodworking across Hyderabad."
        />

        {/* Filter Categories Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const isActive = cat === selectedCategory;
            const isVideoTab = cat === 'Video Walkthroughs';

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-luxury-walnut text-luxury-gold shadow-md border border-luxury-gold scale-105'
                    : 'bg-luxury-card text-luxury-muted hover:text-luxury-walnut hover:border-luxury-gold/50 border border-luxury-border shadow-sm'
                }`}
              >
                {isVideoTab && <Film className="w-3.5 h-3.5 text-red-500" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item, idx) => {
              const isVideo = item.type === 'video' || !!item.videoUrl;
              const displayImage = isVideo ? item.poster : item.image;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  onClick={() => setActiveModalProject(item)}
                  className="luxury-card rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer group shadow-luxury hover:shadow-luxury-hover border border-luxury-border/80 flex flex-col justify-between"
                >
                  {/* Media Thumbnail Box */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-luxury-walnut">
                    <img
                      src={displayImage}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-walnut/90 via-luxury-walnut/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Category / Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {isVideo ? (
                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-600/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Video Tour ({item.duration})</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-luxury-walnut/85 backdrop-blur-md text-luxury-gold border border-luxury-gold/40 shadow-sm">
                          {item.category}
                        </span>
                      )}
                    </div>

                    {/* Video Play Icon or Photo Zoom Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isVideo ? (
                        <div className="w-14 h-14 rounded-full bg-luxury-gold/90 text-luxury-walnut flex items-center justify-center shadow-gold-glow group-hover:scale-110 group-hover:bg-luxury-gold transition-all">
                          <Play className="w-6 h-6 fill-current translate-x-0.5" />
                        </div>
                      ) : (
                        <span className="w-11 h-11 rounded-full bg-luxury-walnut/80 text-luxury-gold border border-luxury-gold/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                          <Eye className="w-5 h-5" />
                        </span>
                      )}
                    </div>

                    {/* Bottom Location Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[#FDFBF7]">
                      <span className="text-xs flex items-center gap-1 font-light text-gray-200">
                        <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                        {item.location}
                      </span>
                      <span className="text-[11px] text-luxury-gold font-semibold uppercase tracking-wider">
                        {isVideo ? 'Play Video ›' : 'View Details ›'}
                      </span>
                    </div>
                  </div>

                  {/* Info Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-heading text-lg sm:text-xl font-bold text-luxury-walnut group-hover:text-luxury-gold-dark transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-luxury-muted mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Materials & Scope Pill */}
                    <div className="pt-3 border-t border-luxury-border/60 flex items-center justify-between text-[11px] text-luxury-charcoal font-medium">
                      <span className="truncate pr-2">{item.scope}</span>
                      <span className="text-luxury-gold-dark font-semibold shrink-0">Specs ›</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View All Projects Button (for Home Page preview mode) */}
        {isHomePage && (
          <div className="mt-12 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-luxury-walnut hover:bg-black text-luxury-gold border border-luxury-gold/50 text-xs font-bold uppercase tracking-wider shadow-gold-glow transition-all duration-300 hover:scale-[1.03]"
            >
              <span>View All Recent Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Lightbox / Video Player Modal */}
        <PortfolioModal
          project={activeModalProject}
          isOpen={!!activeModalProject}
          onClose={() => setActiveModalProject(null)}
          onPrev={handlePrevItem}
          onNext={handleNextItem}
          hasPrev={currentModalIndex > 0}
          hasNext={currentModalIndex < filteredItems.length - 1}
        />

      </div>
    </section>
  );
}

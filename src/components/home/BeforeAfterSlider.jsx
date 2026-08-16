import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfterSlider({ project, initialPos = 50 }) {
  const [sliderPosition, setSliderPosition] = useState(initialPos); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    let percentage = (x / width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="w-full select-none flex flex-col justify-between">
      {/* Interactive Slider Box */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-luxury hover:shadow-luxury-hover border border-luxury-border cursor-ew-resize bg-luxury-walnut focus:outline-none focus:ring-2 focus:ring-luxury-gold group"
      >
        {/* AFTER IMAGE (Background - Full Layer) */}
        <img
          src={project.afterImage}
          alt={`After: ${project.title}`}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* AFTER BADGE (Bottom Right matching Reference) */}
        <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
          <div className="px-2.5 py-1 rounded bg-[#D4AF37] text-luxury-walnut shadow-md text-[10px] sm:text-xs font-bold uppercase tracking-wider font-cinzel">
            AFTER
          </div>
        </div>

        {/* BEFORE IMAGE (Clipped Overlay Layer) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={project.beforeImage}
            alt={`Before: ${project.title}`}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%'
            }}
          />
        </div>

        {/* BEFORE BADGE (Bottom Left matching Reference) */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
          <div className="px-2.5 py-1 rounded bg-black/85 text-white shadow-md text-[10px] sm:text-xs font-bold uppercase tracking-wider font-cinzel">
            BEFORE
          </div>
        </div>

        {/* GOLDEN VERTICAL DIVIDER LINE */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="relative h-full w-[2px] bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.8)] -translate-x-1/2">
            
            {/* CIRCULAR DRAGGABLE GOLD HANDLE */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#C5A880] text-luxury-walnut border-2 border-luxury-walnut flex items-center justify-center shadow-lg transition-transform duration-150 ${
                isDragging ? 'scale-115 bg-luxury-gold' : 'group-hover:scale-110'
              }`}
            >
              <span className="text-[10px] font-black tracking-tighter">||</span>
            </div>

          </div>
        </div>

      </div>

      {/* Title & Scope Footnote */}
      <div className="pt-2.5 px-1 flex items-center justify-between text-xs">
        <span className="font-heading font-bold text-luxury-walnut truncate">
          {project.title}
        </span>
        <span className="text-[11px] text-luxury-muted shrink-0 ml-2">
          {project.location}
        </span>
      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CREATIVE_WORKS, CREATIVE_CATEGORIES, type CreativeCategory, type CreativeWork } from '@/data/creativeContent';
import { CreativeVisualFrame } from './CreativeVisualFrame';
import { CreativeViewer } from './CreativeViewer';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';

export const KineticFilmstripArchive: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CreativeCategory>('ALL');
  const [selectedWork, setSelectedWork] = useState<CreativeWork | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const filteredWorks = activeCategory === 'ALL'
    ? CREATIVE_WORKS
    : CREATIVE_WORKS.filter((w) => w.category === activeCategory);

  const scrollTrack = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const offset = direction === 'left' ? -380 : 380;
    trackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full space-y-6 select-none">
      {/* Lightbox / Study Modal Viewer */}
      <CreativeViewer work={selectedWork} onClose={() => setSelectedWork(null)} />

      {/* Filter Tabs & Scroll Controls Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40 font-mono text-[11px] uppercase tracking-wider">
        {/* Category Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {CREATIVE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded border transition-all cursor-pointer text-[10px] tracking-widest ${
                  isActive
                    ? 'border-accent text-accent bg-accent/10 font-semibold'
                    : 'border-border/60 text-foreground-muted hover:border-border hover:text-foreground'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Track Navigation Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-foreground-muted mr-2 hidden md:inline-block">
            {filteredWorks.length} STUDIES READY // DRAG OR NAVIGATE
          </span>
          <InteractiveCursorTarget cursorType="interactive">
            <button
              type="button"
              onClick={() => scrollTrack('left')}
              className="w-8 h-8 rounded border border-border/80 hover:border-accent flex items-center justify-center text-foreground hover:text-accent transition-colors cursor-pointer"
              aria-label="Scroll left"
            >
              ←
            </button>
          </InteractiveCursorTarget>
          <InteractiveCursorTarget cursorType="interactive">
            <button
              type="button"
              onClick={() => scrollTrack('right')}
              className="w-8 h-8 rounded border border-border/80 hover:border-accent flex items-center justify-center text-foreground hover:text-accent transition-colors cursor-pointer"
              aria-label="Scroll right"
            >
              →
            </button>
          </InteractiveCursorTarget>
        </div>
      </div>

      {/* Moving Horizontal Filmstrip Track */}
      <div
        ref={trackRef}
        className="flex items-stretch gap-6 overflow-x-auto scrollbar-none py-4 px-1 cursor-grab active:cursor-grabbing scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {filteredWorks.map((work, index) => {
            const isHovered = hoveredId === work.id;
            return (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-[300px] sm:w-[380px] lg:w-[420px] flex-shrink-0"
                onMouseEnter={() => setHoveredId(work.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <InteractiveCursorTarget cursorType="view" cursorLabel="VIEW">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedWork(work)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedWork(work);
                      }
                    }}
                    className={`h-full border bg-[#080A10]/90 backdrop-blur-md p-4 sm:p-6 space-y-4 transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                      isHovered
                        ? 'border-accent shadow-[0_10px_35px_rgba(0,240,255,0.08)] -translate-y-1'
                        : 'border-border/70 hover:border-border-strong'
                    }`}
                  >
                    {/* Visual Media Frame */}
                    <div className="relative overflow-hidden rounded border border-border/40">
                      <CreativeVisualFrame work={work} isHovered={isHovered} showDetails={false} />
                    </div>

                    {/* Metadata Header */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-foreground-muted pt-2 border-t border-border/30">
                        <span className="text-accent font-semibold">
                          0{index + 1} // {work.category}
                        </span>
                        <span>{work.year}</span>
                      </div>

                      <h3 className="font-editorial text-lg sm:text-xl font-bold uppercase text-foreground group-hover:text-accent transition-colors leading-tight">
                        {work.title}
                      </h3>

                      <p className="text-foreground-secondary text-xs leading-relaxed line-clamp-2">
                        {work.shortDescription}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-border/20 flex items-center justify-between font-mono text-[10px] text-accent tracking-wider uppercase">
                      <span>INSPECT STUDY</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </InteractiveCursorTarget>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Track Footnote & Direct Lab Link */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>REAL MEDIA ARCHIVE READY</span>
          <span className="text-border">/</span>
          <span>AUTONOMOUS FIELD EXPLORATION</span>
        </div>

        <Link
          to="/creative"
          className="text-accent hover:text-foreground transition-colors inline-flex items-center gap-2"
        >
          <span>OPEN FULL-SCREEN CREATIVE ARCHIVE</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
};

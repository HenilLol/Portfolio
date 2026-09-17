import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { CreativeVisualFrame } from './CreativeVisualFrame';
import { CreativeViewer } from './CreativeViewer';
import { CREATIVE_CATEGORIES, CREATIVE_WORKS } from '@/data/creativeContent';
import { getCreativeWorks } from '@/services/creative';
import type { CreativeCategory, CreativeWork } from '@/types/models';

export const CreativeArchive: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CreativeCategory>('ALL');
  const [selectedWork, setSelectedWork] = useState<CreativeWork | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [worksList, setWorksList] = useState<CreativeWork[]>(CREATIVE_WORKS);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    getCreativeWorks({ publishedOnly: true }).then((data) => {
      if (data && data.length > 0) {
        setWorksList(data);
      }
    });
  }, []);

  // Filter items based on active category
  const filteredWorks = useMemo(() => {
    if (activeCategory === 'ALL') return worksList;
    return worksList.filter((work) => work.category === activeCategory);
  }, [activeCategory, worksList]);

  // Compute category count counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: worksList.length };
    worksList.forEach((w) => {
      if (w.category) {
        counts[w.category] = (counts[w.category] || 0) + 1;
      }
    });
    return counts;
  }, [worksList]);

  return (
    <section id="visual-archive" className="py-16 sm:py-24 border-b border-border/80">
      {/* Lightbox / Study Viewer */}
      <CreativeViewer work={selectedWork} onClose={() => setSelectedWork(null)} />

      {/* Section Header & Interactive Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/60">
        <div>
          <div className="font-mono text-xs text-accent tracking-widest uppercase mb-2">
            FIELD ARCHIVE // 07.01
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
            Visual Studies & Experiment Index
          </h2>
        </div>

        {/* Filter Navigation Bar */}
        <div
          role="tablist"
          aria-label="Filter Creative Works"
          className="flex flex-wrap items-center gap-2 font-mono text-xs"
        >
          {CREATIVE_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-3 py-1.5 border transition-all duration-200 uppercase tracking-widest text-[11px] ${
                  isActive
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-border/60 text-foreground-muted hover:text-foreground hover:border-border'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 text-[9px] opacity-60">[{String(count).padStart(2, '0')}]</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Asymmetric Editorial Geometry Grid */}
      <div className="mt-12">
        <AnimatePresence mode="wait">
          {filteredWorks.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 border border-dashed border-border/60 text-center space-y-4"
            >
              <div className="font-mono text-xs text-accent tracking-widest uppercase">
                ARCHIVE STANDBY // 07
              </div>
              <h3 className="font-editorial text-xl text-foreground uppercase tracking-wider">
                No Public Works Indexed in This Category Yet.
              </h3>
              <p className="font-mono text-xs text-foreground-muted uppercase tracking-widest">
                The capture pipeline is ready. Work will be ingested following active observation.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              initial={reducedMotion ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12"
            >
              {filteredWorks.map((work, index) => {
                const isHovered = hoveredId === work.id;
                const isSiblingHovered = hoveredId !== null && !isHovered;
                const isFeatured = work.featured && activeCategory === 'ALL' && index === 0;
                const isVideo = work.category === 'VIDEO' || work.media?.type === 'video';

                // Assign varied column spans to create an authentic asymmetric editorial composition
                // First featured item: 12 cols; subsequent items alternating 7 cols / 5 cols / 6 cols / 6 cols
                let colSpan = 'md:col-span-6 lg:col-span-6';
                if (isFeatured) {
                  colSpan = 'md:col-span-12 lg:col-span-12';
                } else if (index % 3 === 1) {
                  colSpan = 'md:col-span-7 lg:col-span-7';
                } else if (index % 3 === 2) {
                  colSpan = 'md:col-span-5 lg:col-span-5';
                }

                return (
                  <motion.div
                    key={work.id}
                    layout={!reducedMotion}
                    className={`${colSpan} flex flex-col transition-opacity duration-300 ${
                      isSiblingHovered ? 'opacity-40' : 'opacity-100'
                    }`}
                    onMouseEnter={() => setHoveredId(work.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <InteractiveCursorTarget
                      cursorType="interactive"
                      cursorLabel={isVideo ? 'PLAY' : 'VIEW'}
                      className="w-full flex-1 flex flex-col text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedWork(work)}
                        className="w-full text-left flex-1 flex flex-col bg-background-surface border border-border/80 hover:border-accent/60 transition-colors p-5 sm:p-6"
                      >
                        {/* Visual Canvas Frame */}
                        <div className="w-full overflow-hidden mb-6">
                          <CreativeVisualFrame work={work} isHovered={isHovered} />
                        </div>

                        {/* Metadata & Title */}
                        <div className="flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
                              <span className="text-accent">{work.category}</span>
                              <span className="text-foreground-muted">{work.year}</span>
                            </div>

                            <h3 className="font-editorial text-lg sm:text-xl font-semibold uppercase tracking-tight text-foreground group-hover:text-accent transition-colors">
                              {work.title}
                            </h3>

                            <p className="text-foreground-secondary text-xs sm:text-sm font-normal leading-relaxed line-clamp-2">
                              {work.shortDescription || work.description}
                            </p>
                          </div>

                          {/* Action Footer & Tools */}
                          <div className="pt-4 border-t border-border/40 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase">
                            <div className="flex items-center gap-2 text-foreground-muted">
                              <span>TOOLS:</span>
                              <span className="text-foreground-secondary truncate max-w-[160px] sm:max-w-[220px]">
                                {work.tools?.slice(0, 2).join(' • ')}
                              </span>
                            </div>

                            <span className="text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              <span>INSPECT</span>
                              <span>→</span>
                            </span>
                          </div>
                        </div>
                      </button>
                    </InteractiveCursorTarget>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CreativeVisualFrame } from './CreativeVisualFrame';
import type { CreativeWork } from '@/types/models';

interface CreativeViewerProps {
  work: CreativeWork | null;
  onClose: () => void;
}

export const CreativeViewer: React.FC<CreativeViewerProps> = ({ work, onClose }) => {
  const reducedMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Store active element when opening to restore focus on close
  useEffect(() => {
    if (work) {
      triggerElementRef.current = document.activeElement as HTMLElement;
    }
  }, [work]);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      triggerElementRef.current?.focus();
    }, 50);
  }, [onClose]);

  // Handle ESC key and focus trapping
  useEffect(() => {
    if (!work) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll while viewer is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [work, handleClose]);

  if (!work) return null;

  const isVideo = work.category === 'VIDEO' || work.media?.type === 'video';

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-background/95 backdrop-blur-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="viewer-work-title"
      >
        <motion.div
          ref={modalRef}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-background-surface border border-border/80 shadow-2xl overflow-hidden"
        >
          {/* Top Bar: Telemetry & Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-background/80 font-mono text-xs uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-foreground font-medium">STUDY INSPECTOR</span>
              <span className="text-border">/</span>
              <span className="text-foreground-muted">FRAME // {String(work.order).padStart(3, '0')}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block text-[10px] text-foreground-muted">
                [ESC] TO EXIT
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                aria-label="Close Study Viewer"
                className="font-mono text-[10px] tracking-widest uppercase px-3 py-1"
              >
                ✕ CLOSE
              </Button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
            {/* Visual Canvas / Media Player Container */}
            <div className="w-full bg-[#070709] border border-border/60 overflow-hidden relative">
              {isVideo && work.media?.videoUrl ? (
                <div className="w-full aspect-[16/9] relative flex items-center justify-center">
                  <video
                    src={work.media.videoUrl}
                    poster={work.media.poster}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <CreativeVisualFrame work={work} isHovered={true} showDetails={false} />
              )}
            </div>

            {/* Spec Header & Status Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
              <div className="space-y-1">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
                  <span>{work.category}</span>
                  <span className="text-border">•</span>
                  <span className="text-foreground-muted">{work.year || 'ACTIVE'}</span>
                </div>
                <h2 id="viewer-work-title" className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
                  {work.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="accent">{work.status || 'STUDY'}</Badge>
                {work.slotNote && (
                  <Badge variant="outline" className="hidden md:inline-flex">
                    {work.slotNote}
                  </Badge>
                )}
              </div>
            </div>

            {/* Narrative & Study Specifications Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Study Rationale & Narrative */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h3 className="font-mono text-[11px] text-foreground-muted uppercase tracking-widest mb-2">
                    Study Overview & Rationale
                  </h3>
                  <p className="text-foreground-secondary text-base leading-relaxed font-normal">
                    {work.description}
                  </p>
                </div>

                {work.tags && work.tags.length > 0 && (
                  <div>
                    <h3 className="font-mono text-[11px] text-foreground-muted uppercase tracking-widest mb-2">
                      Observation Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {work.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-background-elevated border border-border/40 font-mono text-[10px] text-foreground uppercase tracking-widest"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Technical Parameters Matrix */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-5 bg-background-elevated/40 border border-border/60 space-y-3 font-mono text-xs">
                  <div className="font-mono text-[10px] text-accent tracking-widest uppercase pb-2 border-b border-border/40">
                    Capture / Spec Telemetry
                  </div>

                  {work.metadata?.map((row) => (
                    <div key={row.label} className="flex justify-between py-1 border-b border-border/20 text-[11px]">
                      <span className="text-foreground-muted uppercase">{row.label}</span>
                      <span className="text-foreground font-medium uppercase">{row.value}</span>
                    </div>
                  ))}

                  {work.tools && work.tools.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] text-foreground-muted uppercase block mb-1">
                        Utilized Software
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {work.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-1.5 py-0.5 bg-background border border-border/60 text-[9px] text-foreground uppercase"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

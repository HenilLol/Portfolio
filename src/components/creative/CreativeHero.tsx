import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { CREATIVE_LAB_IDENTITY } from '@/data/creativeContent';

export const CreativeHero: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useLenisScroll();

  const handleScrollToArchive = () => {
    scrollTo('#visual-archive', { offset: -64, duration: 1.2 });
  };

  return (
    <section className="relative pt-12 sm:pt-24 pb-12 sm:pb-24 border-b border-border/80">
      {/* Editorial Header Coordinate Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/60 text-xs font-mono tracking-widest text-foreground-muted uppercase">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-foreground font-medium">{CREATIVE_LAB_IDENTITY.tagline}</span>
          <span className="text-border">/</span>
          <span className="text-foreground-secondary">{CREATIVE_LAB_IDENTITY.mode}</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] sm:text-xs">
          <span className="hidden sm:inline-block">LOC // {CREATIVE_LAB_IDENTITY.location}</span>
          <span className="text-border hidden sm:inline-block">/</span>
          <span className="text-accent">EXPERIMENT ARCHIVE</span>
        </div>
      </div>

      {/* Main Hero Spatial Content */}
      <div className="mt-10 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
        {/* Left Column: Oversized Typography */}
        <div className="lg:col-span-8 space-y-6">
          <TechnicalLabel indicator indicatorColor="accent" className="mb-2">
            RESEARCH LOG // SPEC 07
          </TechnicalLabel>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <DisplayText as="h1" size="2xl" className="leading-[0.88] tracking-tight">
              CREATIVE
              <br />
              <span className="text-foreground-muted font-normal">LAB</span>
            </DisplayText>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono tracking-widest text-foreground-secondary uppercase">
            <span className="text-foreground">IMAGE</span>
            <span className="text-border">•</span>
            <span className="text-foreground">MOTION</span>
            <span className="text-border">•</span>
            <span className="text-foreground">LIGHT</span>
            <span className="text-border">•</span>
            <span className="text-foreground">FRAME</span>
            <span className="text-border">•</span>
            <span className="text-foreground">FORM</span>
          </div>

          <p className="text-foreground-secondary text-base sm:text-lg max-w-2xl font-normal leading-relaxed pt-2">
            {CREATIVE_LAB_IDENTITY.manifestoHeadline}
          </p>
        </div>

        {/* Right Column: Telemetry & Primary Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-4 sm:p-6 bg-background-surface border border-border/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-accent">ARCHIVE STATUS</span>
              <span className="text-foreground-muted">ARCHIVE // INDEXED</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-foreground-muted uppercase">DISCIPLINES</span>
                <span className="text-foreground">VIDEO • PHOTO • CODE</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/20">
                <span className="text-foreground-muted uppercase">ASSET RULE</span>
                <span className="text-accent">ZERO FABRICATION</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-foreground-muted uppercase">TOTAL SLOTS</span>
                <span className="text-foreground">06 STUDIES INDEXED</span>
              </div>
            </div>

            <div className="pt-2">
              <InteractiveCursorTarget cursorType="interactive" className="w-full">
                <Button
                  variant="magnetic"
                  className="w-full justify-center text-xs tracking-widest min-h-[44px]"
                  onClick={handleScrollToArchive}
                >
                  ENTER ARCHIVE ↓
                </Button>
              </InteractiveCursorTarget>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

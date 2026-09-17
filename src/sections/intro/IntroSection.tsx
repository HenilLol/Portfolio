import React from 'react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { HERO_CONTENT } from '@/data/heroContent';

export const IntroSection: React.FC = () => {
  return (
    <section id="intro" className="py-8 border-b border-border" data-section="intro">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <TechnicalLabel indicator indicatorColor="accent">
            ARCHITECTURAL INDEX // 01
          </TechnicalLabel>
          <span className="text-foreground-muted hidden sm:inline-block">/</span>
          <span className="text-foreground-secondary uppercase tracking-widest text-[11px]">
            {HERO_CONTENT.identity.displayName}
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] tracking-widest text-foreground-muted uppercase">
          <span>IDENTITY SEQUENCE VERIFIED</span>
          <span className="text-accent">[ACTIVE]</span>
        </div>
      </div>
    </section>
  );
};

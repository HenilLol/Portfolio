import React from 'react';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';

export const HeneoxyThesis: React.FC = () => {
  return (
    <section id="thesis" className="py-16 sm:py-24 border-t border-border/40 space-y-12">
      <div className="space-y-4 max-w-3xl">
        <TechnicalLabel indicator indicatorColor="accent">
          THE CENTRAL THESIS // COMPUTING ENVIRONMENT
        </TechnicalLabel>
        <DisplayText
          as="h2"
          size="lg"
          className="text-foreground uppercase font-bold tracking-tight leading-[1.15]"
        >
          {HENEOXY_CONTENT.thesis.headline}
        </DisplayText>
      </div>

      <p className="text-foreground text-base sm:text-xl font-light leading-relaxed max-w-3xl">
        {HENEOXY_CONTENT.thesis.statement}
      </p>

      {/* Two-Column Editorial Narrative */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pt-8 border-t border-border/30">
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
            01 // COGNITIVE FRICTION IN CURRENT TOOLCHAINS
          </span>
          <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
            {HENEOXY_CONTENT.thesis.narrative.foundations}
          </p>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
            02 // THE UNIFIED SPATIAL WORKSPACE
          </span>
          <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
            {HENEOXY_CONTENT.thesis.narrative.direction}
          </p>
        </div>
      </div>
    </section>
  );
};

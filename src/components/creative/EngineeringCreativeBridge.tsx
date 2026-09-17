import React from 'react';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { ENGINEERING_CREATIVE_CONTENT } from '@/data/creativeContent';

export const EngineeringCreativeBridge: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 border-b border-border/80">
      <div className="space-y-12">
        {/* Section Index & Lead */}
        <div>
          <TechnicalLabel indicator indicatorColor="accent" className="mb-3">
            RECIPROCAL DISCIPLINES // ENGINEERING × CRAFT
          </TechnicalLabel>
          <div className="font-mono text-xs text-accent tracking-widest uppercase mb-4">
            {ENGINEERING_CREATIVE_CONTENT.equation}
          </div>
          <DisplayText as="h2" size="xl" className="max-w-3xl mb-6">
            {ENGINEERING_CREATIVE_CONTENT.headline}
          </DisplayText>
          <p className="text-foreground-secondary text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
            {ENGINEERING_CREATIVE_CONTENT.lead}
          </p>
        </div>

        {/* Two-Column Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pt-4">
          <div className="space-y-4 text-foreground-secondary text-sm sm:text-base leading-relaxed">
            <p>{ENGINEERING_CREATIVE_CONTENT.paragraphs[0]}</p>
          </div>
          <div className="space-y-4 text-foreground-secondary text-sm sm:text-base leading-relaxed">
            <p>{ENGINEERING_CREATIVE_CONTENT.paragraphs[1]}</p>
          </div>
        </div>

        {/* 3 Core Architectural Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          {ENGINEERING_CREATIVE_CONTENT.pillars.map((pillar, idx) => (
            <Card
              key={pillar.title}
              className="p-6 bg-background-surface border-border/80 hover:border-accent/40 transition-colors"
            >
              <div className="font-mono text-[10px] text-accent tracking-widest uppercase mb-2">
                PRINCIPLE // 0{idx + 1}
              </div>
              <h3 className="font-editorial text-sm sm:text-base font-semibold text-foreground uppercase tracking-wide mb-2">
                {pillar.title}
              </h3>
              <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed font-normal">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { CREATIVE_PROCESS_STEPS } from '@/data/creativeContent';

export const CreativeProcess: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 border-b border-border/80">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <TechnicalLabel indicator indicatorColor="accent" className="mb-3">
              METHODOLOGY // CREATIVE LOOP
            </TechnicalLabel>
            <DisplayText as="h2" size="xl">
              The Working Principle
            </DisplayText>
          </div>
          <p className="text-foreground-secondary text-xs sm:text-sm font-mono uppercase tracking-widest max-w-sm">
            A continuous loop from spatial observation to restrained computational refinement.
          </p>
        </div>

        {/* 6-Step Visual Process Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CREATIVE_PROCESS_STEPS.map((step) => (
            <Card
              key={step.index}
              className="p-6 bg-background-surface border-border/80 space-y-4 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border/40 font-mono text-xs uppercase tracking-widest">
                <span className="text-accent">PHASE // {step.index}</span>
                <span className="text-foreground-muted">{step.subtitle}</span>
              </div>

              <div>
                <h3 className="font-editorial text-lg font-bold uppercase tracking-tight text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/20 text-[10px] font-mono uppercase tracking-widest text-foreground-muted">
                <span className="text-foreground-secondary">FOCUS:</span> {step.focus}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

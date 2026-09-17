import React from 'react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';

export const HeneoxySystemFlow: React.FC = () => {
  const { title, subtitle, steps } = HENEOXY_CONTENT.systemFlow;

  return (
    <section id="system-flow" className="py-16 sm:py-24 border-t border-border/40 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <TechnicalLabel indicator indicatorColor="accent">
            EXECUTION LIFECYCLE // PROTOCOL
          </TechnicalLabel>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-foreground-secondary text-xs sm:text-sm max-w-xl">
            {subtitle}
          </p>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
          HUMAN-IN-THE-LOOP SAFETY PIPELINE
        </span>
      </div>

      {/* Sequential Execution Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {steps.map((item, idx) => (
          <Card
            key={item.step}
            className="p-5 border-border/70 bg-background-surface/40 flex flex-col justify-between space-y-4 relative group hover:border-accent/40 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/30 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
                <span>STEP // {item.step}</span>
                <span className="text-accent">{item.status}</span>
              </div>

              <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">
                {item.actor}
              </span>

              <h4 className="font-editorial text-sm font-bold uppercase tracking-wide text-foreground">
                {item.action}
              </h4>

              <p className="font-sans text-xs text-foreground-secondary leading-relaxed">
                {item.detail}
              </p>
            </div>

            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-accent/60 font-mono text-xs z-10">
                →
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

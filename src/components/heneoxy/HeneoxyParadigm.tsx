import React from 'react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';

export const HeneoxyParadigm: React.FC = () => {
  const { currentModel, heneoxyModel } = HENEOXY_CONTENT.paradigmShift;

  return (
    <section id="paradigm" className="py-12 sm:py-24 border-t border-border/40 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <TechnicalLabel indicator indicatorColor="accent">
            PARADIGM SHIFT // SYSTEM DIRECTION
          </TechnicalLabel>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
            From Application Silos to Cohesive Environment
          </h3>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
          CONCEPTUAL ARCHITECTURAL DIRECTION
        </span>
      </div>

      {/* Comparison Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Current Computing (Application Silos) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 sm:p-6 border-red-500/30 bg-background-surface/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
              <span className="font-mono text-xs uppercase tracking-wider text-red-400 font-semibold">
                {currentModel.title}
              </span>
              <span className="font-mono text-[9px] text-red-400/80 border border-red-500/40 px-1.5 py-0.5 uppercase">
                STATUS QUO
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-foreground-muted text-center">
              <div className="p-3 border border-border bg-background">APP A (BROWSER)</div>
              <div className="p-3 border border-border bg-background">APP B (TERMINAL)</div>
              <div className="p-3 border border-border bg-background">APP C (CHATBOT)</div>
              <div className="p-3 border border-border bg-background">APP D (EDITOR)</div>
            </div>

            <ul className="space-y-2 text-xs text-foreground-secondary pt-2">
              {currentModel.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-400 font-mono">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] text-foreground-muted italic pt-2 border-t border-border/20">
              {currentModel.summary}
            </p>
          </Card>
        </div>

        {/* Center Transition Vector */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0 text-center font-mono text-[10px] text-accent space-y-2">
          <span className="hidden lg:inline text-xs">TRANSITION</span>
          <div className="w-12 h-[1px] bg-accent/60 hidden lg:block" />
          <span className="text-lg rotate-90 lg:rotate-0 inline-block">→</span>
          <span className="text-foreground-muted text-[9px]">RETHINKING THE INTERFACE</span>
        </div>

        {/* Right: HENEOXY Paradigm (Unified Workspace) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-4 sm:p-6 border-accent/40 bg-background-surface/60 space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
              <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                {heneoxyModel.title}
              </span>
              <span className="font-mono text-[9px] text-accent border border-accent/60 bg-accent/10 px-1.5 py-0.5 uppercase">
                HENEOXY MODEL
              </span>
            </div>

            {/* Visual Vector Stack */}
            <div className="space-y-1.5 font-mono text-xs text-center">
              <div className="p-2 border border-accent/40 bg-accent/5 text-accent font-bold">
                OPERATOR INTENT
              </div>
              <div className="text-[10px] text-accent/60">↓</div>
              <div className="p-2 border border-border bg-background text-foreground">
                AMBIENT ORCHESTRATOR
              </div>
              <div className="text-[10px] text-accent/60">↓</div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-foreground-secondary">
                <div className="p-1.5 border border-border bg-background">TOOLS</div>
                <div className="p-1.5 border border-border bg-background">KNOWLEDGE</div>
                <div className="p-1.5 border border-border bg-background">CONTEXT</div>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-foreground-secondary pt-2">
              {heneoxyModel.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent font-mono">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] text-foreground-secondary italic pt-2 border-t border-border/20">
              {heneoxyModel.summary}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

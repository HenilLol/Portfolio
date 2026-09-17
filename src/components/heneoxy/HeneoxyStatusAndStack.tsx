import React from 'react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';

export const HeneoxyStatusAndStack: React.FC = () => {
  const { implementationStatus, technologyStack } = HENEOXY_CONTENT;

  return (
    <div className="space-y-16 sm:space-y-24 border-t border-border/40 pt-16 sm:pt-24">
      {/* 1. Implementation Truth Matrix */}
      <section id="implementation-status" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <TechnicalLabel indicator indicatorColor="accent">
              DEVELOPMENT REALITY // VERIFIED STATE
            </TechnicalLabel>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
              Current Implementation State
            </h3>
            <p className="text-foreground-secondary text-xs sm:text-sm">
              Strict separation between completed foundations, ongoing engineering, and theoretical research.
            </p>
          </div>
          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
            NON-FABRICATED STATUS LOG
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Implemented */}
          <Card className="p-6 border-accent/40 bg-background-surface/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/30 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-accent font-bold">01 // IMPLEMENTED</span>
              <Badge variant="accent" className="text-[8px] uppercase">VERIFIED</Badge>
            </div>
            <ul className="space-y-2.5 text-xs text-foreground-secondary">
              {implementationStatus.implemented.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent font-mono text-xs">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* In Development */}
          <Card className="p-6 border-blue-500/40 bg-background-surface/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/30 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-blue-400 font-bold">02 // IN DEVELOPMENT</span>
              <Badge variant="default" className="text-[8px] uppercase">ACTIVE</Badge>
            </div>
            <ul className="space-y-2.5 text-xs text-foreground-secondary">
              {implementationStatus.inDevelopment.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 font-mono text-xs">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Research */}
          <Card className="p-6 border-purple-500/40 bg-background-surface/50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/30 font-mono text-[10px] uppercase tracking-wider">
              <span className="text-purple-400 font-bold">03 // RESEARCH HORIZON</span>
              <Badge variant="outline" className="text-[8px] uppercase">EXPLORATION</Badge>
            </div>
            <ul className="space-y-2.5 text-xs text-foreground-secondary">
              {implementationStatus.research.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono text-xs">◇</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* 2. Structured Technology Matrix */}
      <section id="technology-stack" className="space-y-8 pt-8 border-t border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <TechnicalLabel indicator indicatorColor="accent">
              SYSTEM DEPENDENCIES // ARCHITECTURE TIERS
            </TechnicalLabel>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
              Technology Stack by Tier
            </h3>
          </div>
          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
            FOUR RUNTIME TIERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologyStack.map((tier) => (
            <Card key={tier.category} className="p-6 border-border/70 bg-background-surface/40 space-y-4">
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest block pb-2 border-b border-border/30 font-semibold">
                {tier.category}
              </span>

              <div className="space-y-3">
                {tier.items.map((tech) => (
                  <div key={tech.name} className="space-y-1">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-foreground font-semibold">{tech.name}</span>
                      <span className="text-[9px] text-foreground-muted">{tech.status}</span>
                    </div>
                    <p className="text-[11px] text-foreground-secondary font-sans leading-tight">
                      {tech.role}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';

export const HeneoxyKnowledgeAndSecurity: React.FC = () => {
  const { knowledgeResearch, securityPrinciples } = HENEOXY_CONTENT;

  return (
    <div className="space-y-16 sm:space-y-24 border-t border-border/40 pt-16 sm:pt-24">
      {/* 1. Knowledge & Retrieval Architecture (Research Direction) */}
      <section id="knowledge" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <TechnicalLabel indicator indicatorColor="accent">
              LOCAL RETRIEVAL // CONTEXT WINDOWS
            </TechnicalLabel>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
              {knowledgeResearch.title}
            </h3>
            <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed">
              {knowledgeResearch.description}
            </p>
          </div>
          <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
            {knowledgeResearch.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {knowledgeResearch.stages.map((stg) => (
            <Card key={stg.stage} className="p-5 border-border/70 bg-background-surface/40 space-y-3">
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest block">
                {stg.stage}
              </span>
              <h4 className="font-editorial text-sm font-bold uppercase text-foreground">
                {stg.name}
              </h4>
              <p className="font-sans text-xs text-foreground-secondary leading-relaxed">
                {stg.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Security Principles & Design Direction */}
      <section id="security" className="space-y-8 pt-8 border-t border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <TechnicalLabel indicator indicatorColor="accent">
              SYSTEM INTEGRITY // TRUST BOUNDARIES
            </TechnicalLabel>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
              {securityPrinciples.title}
            </h3>
            <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed">
              {securityPrinciples.disclaimer}
            </p>
          </div>
          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
            ACTIVE CONTRACTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityPrinciples.principles.map((pr) => (
            <Card key={pr.id} className="p-6 border-border/70 bg-background-surface/40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/20">
                <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                  {pr.id.toUpperCase()}
                </span>
                <span className="font-mono text-[9px] text-emerald-400/90 border border-emerald-500/30 px-1.5 py-0.2 uppercase">
                  ENFORCED PRINCIPLE
                </span>
              </div>

              <h4 className="font-editorial text-base font-bold uppercase text-foreground">
                {pr.name}
              </h4>

              <p className="font-mono text-xs text-accent/90">
                {pr.rule}
              </p>

              <p className="font-sans text-xs text-foreground-secondary leading-relaxed pt-1">
                {pr.description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

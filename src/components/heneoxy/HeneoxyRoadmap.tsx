import React from 'react';
import { Link } from 'react-router-dom';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';

export const HeneoxyRoadmap: React.FC = () => {
  const { roadmap, hermesBenchmark } = HENEOXY_CONTENT;

  return (
    <div className="space-y-16 sm:space-y-24 border-t border-border/40 pt-16 sm:pt-24">
      {/* 1. Phased Research Roadmap */}
      <section id="roadmap" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <TechnicalLabel indicator indicatorColor="accent">
              ENGINEERING HORIZONS // SEQUENTIAL PHASES
            </TechnicalLabel>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground">
              Evolution Roadmap
            </h3>
            <p className="text-foreground-secondary text-xs sm:text-sm">
              Long-horizon research trajectory without arbitrary commercial deadlines.
            </p>
          </div>
          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
            PHASED TRAJECTORY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roadmap.map((ph) => (
            <Card key={ph.phase} className="p-4 sm:p-6 border-border/70 bg-background-surface/40 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border/20">
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest">
                  {ph.phase}
                </span>
                <Badge
                  variant={
                    ph.status === 'ACTIVE'
                      ? 'accent'
                      : ph.status === 'NEXT'
                      ? 'default'
                      : 'outline'
                  }
                  className="text-[8px] uppercase"
                >
                  {ph.status}
                </Badge>
              </div>

              <h4 className="font-editorial text-base font-bold uppercase text-foreground">
                {ph.title}
              </h4>

              <ul className="space-y-1.5 text-xs text-foreground-secondary">
                {ph.focus.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-accent font-mono text-[10px]">›</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* 2. Long-Term Reference Benchmark (Hermes Agent) */}
      <section id="benchmark" className="p-5 sm:p-10 border border-border/80 bg-background-surface/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border/30">
          <div className="space-y-1.5">
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest font-semibold block">
              ● {hermesBenchmark.title}
            </span>
            <h4 className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
              {hermesBenchmark.subtitle}
            </h4>
          </div>
          <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
            REFERENCE ARCHITECTURE
          </Badge>
        </div>

        <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed max-w-3xl">
          {hermesBenchmark.disclaimer}
        </p>

        <div className="space-y-2 pt-2">
          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block">
            CORE ARCHITECTURAL STUDY DOMAINS
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hermesBenchmark.referencePoints.map((pt, i) => (
              <div key={i} className="p-3 border border-border bg-background text-xs font-mono text-foreground flex items-center gap-2">
                <span className="text-accent">0{i + 1}</span>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Return to Project Universe Console CTA */}
      <section id="return-universe" className="pt-8 pb-12 text-center space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-xs text-foreground-muted uppercase tracking-widest block">
            END OF SYSTEM BLUEPRINT // SPEC-01
          </span>
          <h3 className="font-editorial text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-foreground">
            HENEOXY // IN DEVELOPMENT
          </h3>
        </div>

        <div>
          <Link
            to="/#projects"
            className="inline-flex items-center justify-center gap-3 px-6 py-3.5 border border-accent bg-accent/10 hover:bg-accent hover:text-background text-accent font-mono text-xs uppercase tracking-widest transition-all duration-300 group w-full sm:w-auto min-h-[44px]"
          >
            <span>RETURN TO PROJECT UNIVERSE</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Badge } from '@/components/ui/Badge';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';
import { useLenisScroll } from '@/hooks/useLenisScroll';

export const HeneoxyHero: React.FC = () => {
  const { scrollTo } = useLenisScroll();

  return (
    <section id="heneoxy-hero" className="space-y-8 sm:space-y-12">
      {/* Top Header Rail */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 font-mono text-xs uppercase tracking-widest">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-accent hover:text-foreground transition-colors min-h-[44px] sm:min-h-0"
        >
          <span>← RETURN TO PROJECT UNIVERSE</span>
        </Link>

        <div className="flex items-center gap-4 text-foreground-muted text-[10px]">
          <span>SPEC // FLAGSHIP-01</span>
          <span className="text-border">/</span>
          <span className="text-accent">{HENEOXY_CONTENT.identity.buildMode}</span>
        </div>
      </div>

      {/* Main Console Title Block */}
      <div className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <TechnicalLabel indicator indicatorColor="accent">
            FLAGSHIP EXPLORATION // 01
          </TechnicalLabel>
          <Badge variant="accent" className="text-[9px] uppercase tracking-wider">
            {HENEOXY_CONTENT.identity.status}
          </Badge>
          <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest border border-border/60 px-2 py-0.5">
            {HENEOXY_CONTENT.identity.telemetryMode}
          </span>
        </div>

        <DisplayText
          as="h1"
          size="2xl"
          className="text-foreground font-extrabold uppercase tracking-tightest leading-none text-4xl sm:text-7xl lg:text-9xl"
        >
          {HENEOXY_CONTENT.identity.name}
        </DisplayText>

        <p className="font-mono text-sm sm:text-lg text-accent uppercase tracking-widest font-medium">
          {HENEOXY_CONTENT.identity.moniker}
        </p>

        <p className="text-foreground-secondary text-base sm:text-xl font-light leading-relaxed max-w-2xl">
          {HENEOXY_CONTENT.identity.tagline}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
          <button
            type="button"
            onClick={() => scrollTo('#thesis', { offset: -80, duration: 1.2 })}
            className="px-6 py-3.5 border border-accent bg-accent/10 hover:bg-accent hover:text-background text-accent font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            EXPLORE SYSTEM ↓
          </button>
          <button
            type="button"
            onClick={() => scrollTo('#architecture', { offset: -80, duration: 1.2 })}
            className="px-6 py-3.5 border border-border bg-background-surface/60 hover:border-accent/60 text-foreground font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer min-h-[44px] flex items-center justify-center"
          >
            VIEW ARCHITECTURE ↓
          </button>
        </div>
      </div>

      {/* Hero Telemetry HUD Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-6 border border-border/70 bg-background-surface/50 font-mono text-[10px] uppercase tracking-wider">
        <div>
          <span className="text-foreground-muted block mb-1">SYSTEM STATE</span>
          <span className="text-accent font-semibold">IN DEVELOPMENT</span>
        </div>
        <div>
          <span className="text-foreground-muted block mb-1">CORE PARADIGM</span>
          <span className="text-foreground font-semibold">AMBIENT ORCHESTRATION</span>
        </div>
        <div>
          <span className="text-foreground-muted block mb-1">REFERENCE BENCHMARK</span>
          <span className="text-foreground font-semibold">HERMES AGENT (REFERENCE)</span>
        </div>
        <div>
          <span className="text-foreground-muted block mb-1">EXECUTION SANDBOX</span>
          <span className="text-blue-400 font-semibold">DETERMINISTIC / REVIEWED</span>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/ui/layout/Section';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { CREATIVE_WORKS } from '@/data/creativeContent';
import { CreativeVisualFrame } from '@/components/creative/CreativeVisualFrame';

export const CreativeSection: React.FC = () => {
  const [hoveredWorkId, setHoveredWorkId] = useState<string | null>(null);
  const featuredWorks = CREATIVE_WORKS.slice(0, 3);

  return (
    <Section id="creative" index="06" label="Creative Lab // Visual Field Archive">
      <div className="space-y-12">
        {/* Section Lead & Telemetry */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-border/80">
          <div className="space-y-4 max-w-2xl">
            <TechnicalLabel indicator indicatorColor="accent">
              VISUAL SYSTEM // 07 • EXPERIMENTAL ARCHIVE
            </TechnicalLabel>
            <DisplayText as="h2" size="xl">
              A Field Log of Frames, Motion, Light & Experiments.
            </DisplayText>
            <p className="text-foreground-secondary text-base leading-relaxed font-normal">
              Applying systems engineering discipline to visual expression. An evolving field log exploring video timeline cadence, kinetic letterform choreography, monolithic architectural photography, and GPU fragment shaders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <InteractiveCursorTarget cursorType="explore" cursorLabel="EXPLORE">
              <Link to="/creative" className="w-full sm:w-auto">
                <Button variant="magnetic" className="w-full sm:w-auto tracking-widest text-xs uppercase px-8 py-3.5 bg-foreground text-background hover:bg-accent hover:text-background shadow-lg">
                  ENTER CREATIVE LAB →
                </Button>
              </Link>
            </InteractiveCursorTarget>
          </div>
        </div>

        {/* Interactive Visual Archive Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredWorks.map((work) => {
            const isHovered = hoveredWorkId === work.id;
            return (
              <InteractiveCursorTarget
                key={work.id}
                cursorType="view"
                cursorLabel="VIEW"
                className="block"
              >
                <Link
                  to="/creative"
                  onMouseEnter={() => setHoveredWorkId(work.id)}
                  onMouseLeave={() => setHoveredWorkId(null)}
                  className="block group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <div className="border border-border/80 bg-background-surface/50 p-4 space-y-4 transition-colors duration-300 group-hover:border-accent/60">
                    {/* Visual Canvas Frame */}
                    <CreativeVisualFrame work={work} isHovered={isHovered} showDetails={false} />

                    {/* Metadata Header */}
                    <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-foreground-muted pt-2 border-t border-border/30">
                      <span className="text-accent">{work.category}</span>
                      <span>{work.year}</span>
                    </div>

                    <h3 className="font-editorial text-lg font-bold uppercase text-foreground group-hover:text-accent transition-colors leading-tight">
                      {work.title}
                    </h3>

                    <p className="text-foreground-secondary text-xs leading-relaxed font-normal line-clamp-2">
                      {work.shortDescription}
                    </p>

                    <div className="flex items-center justify-between font-mono text-[10px] text-accent tracking-wider uppercase pt-2">
                      <span>INSPECT STUDY</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </InteractiveCursorTarget>
            );
          })}
        </div>

        {/* Teaser Footer Bar */}
        <div className="p-4 bg-background-surface/70 border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-foreground-muted">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-foreground">EXPERIMENT ARCHIVE</span>
            <span className="text-border">/</span>
            <span>6 STUDIES INDEXED</span>
          </div>

          <Link
            to="/creative"
            className="text-accent hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <span>VIEW ALL 6 VISUAL STUDIES</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
};

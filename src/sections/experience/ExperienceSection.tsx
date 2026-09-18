import React from 'react';
import { Section } from '@/components/ui/layout/Section';
import { Container } from '@/components/ui/layout/Container';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { SpatialJourneyMap } from '@/components/journey/SpatialJourneyMap';

export const ExperienceSection: React.FC = () => {
  return (
    <Section
      id="experience"
      index="07"
      label="Journey & Evolution // 2024 → 2026"
      contained={false}
      className="py-14 sm:py-28 lg:py-36 border-b border-border/60"
    >
      <Container size="wide" className="space-y-10 sm:space-y-14">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-3 max-w-2xl">
            <TechnicalLabel indicator indicatorColor="accent">
              DEVELOPMENT TIMELINE // SCENE-08
            </TechnicalLabel>
            <DisplayText as="h2" size="lg" className="text-foreground uppercase font-bold tracking-tight">
              Journey & Evolution
            </DisplayText>
            <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
              Chronological milestones from computational engineering foundations to intelligent agentic systems, WebGL rendering pipelines, and domain telemetry.
            </p>
          </div>

          <div className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest space-y-1 text-left lg:text-right">
            <div>STATUS // ACTIVE PRACTICE</div>
            <div className="text-accent">B.TECH COMPUTER ENGINEERING</div>
          </div>
        </div>

        {/* Interactive Spatial Journey Map */}
        <SpatialJourneyMap />
      </Container>
    </Section>
  );
};

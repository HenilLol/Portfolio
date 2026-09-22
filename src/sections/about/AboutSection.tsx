import React from 'react';
import { Section } from '@/components/ui/layout/Section';
import { Container } from '@/components/ui/layout/Container';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { ABOUT_CONTENT } from '@/data/aboutContent';
import { SpatialDimensionConstellation } from '@/components/about/SpatialDimensionConstellation';

export const AboutSection: React.FC = () => {
  return (
    <Section
      id="about"
      contained={false}
      className="pt-8 sm:pt-12 lg:pt-16 pb-14 sm:pb-28 lg:pb-36 border-b border-border/60"
    >
      <Container size="wide" className="space-y-12 sm:space-y-24">
        {/* Section 02 Headline per Master Spec: WHO IS HENIL? */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] tracking-widest text-accent font-semibold">{ABOUT_CONTENT.sectionIndex}</span>
              <span className="text-foreground-muted font-mono text-[10px]">/</span>
              <TechnicalLabel indicator indicatorColor="accent">
                IDENTITY BLUEPRINT // SCENE-02
              </TechnicalLabel>
            </div>
            <div className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase space-y-1">
              <div>DISCIPLINE: {ABOUT_CONTENT.telemetry.discipline}</div>
              <div>OPERATING: {ABOUT_CONTENT.telemetry.mindset}</div>
              <div className="text-accent">{ABOUT_CONTENT.telemetry.status}</div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <DisplayText
              as="h2"
              size="xl"
              className="leading-none text-foreground font-extrabold uppercase tracking-tightest"
            >
              WHO IS HENIL?
            </DisplayText>
            <p className="text-foreground text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {ABOUT_CONTENT.leadStatement.headline}
            </p>
            <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              {ABOUT_CONTENT.leadStatement.subheadline}
            </p>
          </div>
        </div>

        {/* Interactive Spatial Identity Matrix — Four Core Cardinal Dimensions */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/40 pb-4">
            <div>
              <TechnicalLabel indicator indicatorColor="accent" className="mb-1">
                SPATIAL TAXONOMY // CORE DIMENSIONS
              </TechnicalLabel>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                Engineering, AI, Systems & Creative Practice
              </h3>
            </div>
            <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
              SELECT DIMENSION TO INTERROGATE ARCHITECTURE
            </span>
          </div>

          <SpatialDimensionConstellation />
        </div>

        {/* Two-Column Editorial Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pt-10 border-t border-border/40">
          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
              01 // {ABOUT_CONTENT.narrative.column1.title}
            </span>
            <div className="space-y-4 text-sm sm:text-base text-foreground-secondary leading-relaxed">
              {ABOUT_CONTENT.narrative.column1.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
              02 // {ABOUT_CONTENT.narrative.column2.title}
            </span>
            <div className="space-y-4 text-sm sm:text-base text-foreground-secondary leading-relaxed">
              {ABOUT_CONTENT.narrative.column2.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Current Exploration Horizon Bar */}
        <div className="p-4 sm:p-8 border border-border/70 bg-background-surface/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent font-semibold block">
              ● {ABOUT_CONTENT.currentExploration.label}
            </span>
            <p className="font-sans text-xs text-foreground-secondary leading-relaxed">
              {ABOUT_CONTENT.currentExploration.summary}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {ABOUT_CONTENT.currentExploration.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1 bg-background border border-border text-[11px] font-mono text-foreground tracking-wider uppercase hover:border-accent/60 transition-colors"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

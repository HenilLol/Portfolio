import React from 'react';
import { Section } from '@/components/ui/layout/Section';
import { Container } from '@/components/ui/layout/Container';
import { Grid } from '@/components/ui/layout/Grid';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ABOUT_CONTENT } from '@/data/aboutContent';

export const AboutSection: React.FC = () => {
  return (
    <Section
      id="about"
      index={ABOUT_CONTENT.sectionIndex}
      label={ABOUT_CONTENT.sectionLabel}
      contained={false}
      className="py-20 sm:py-28 lg:py-36 border-b border-border/60"
    >
      <Container size="wide" className="space-y-16 sm:space-y-24">
        {/* Editorial Lead Statement Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-4">
            <TechnicalLabel indicator indicatorColor="accent">
              IDENTITY PROFILE // SPEC-01
            </TechnicalLabel>
            <div className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase space-y-1">
              <div>DISCIPLINE: {ABOUT_CONTENT.telemetry.discipline}</div>
              <div>OPERATING: {ABOUT_CONTENT.telemetry.mindset}</div>
              <div className="text-accent">{ABOUT_CONTENT.telemetry.status}</div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <DisplayText
              as="h2"
              size="lg"
              className="leading-[1.15] text-foreground font-bold uppercase tracking-tight"
            >
              {ABOUT_CONTENT.leadStatement.headline}
            </DisplayText>
            <p className="text-foreground-secondary text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              {ABOUT_CONTENT.leadStatement.subheadline}
            </p>
          </div>
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

        {/* Technical Identity Dimensions — Answers: "What kind of builder is this?" */}
        <div className="space-y-6 pt-12 border-t border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <TechnicalLabel indicator indicatorColor="accent" className="mb-2">
                BUILDER TAXONOMY // SIX DIMENSIONS
              </TechnicalLabel>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground">
                Technical Identity & Exploration Areas
              </h3>
            </div>
            <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
              ACTIVE DIMENSIONS // NOT INVENTED CLAIMS
            </span>
          </div>

          <Grid columns={12} gap="md">
            {ABOUT_CONTENT.dimensions.map((dim) => (
              <div
                key={dim.id}
                className="col-span-12 sm:col-span-6 lg:col-span-4"
              >
                <Card className="h-full p-6 border-border/70 bg-background-surface/50 hover:border-accent/50 transition-colors duration-300 flex flex-col justify-between space-y-6 group">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-border/30">
                      <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase">
                        SPEC // {dim.specIndex}
                      </span>
                      <Badge
                        variant={
                          dim.status === 'CORE PRACTICE'
                            ? 'accent'
                            : dim.status === 'ACTIVE EXPLORATION'
                            ? 'default'
                            : 'outline'
                        }
                        className="text-[9px] uppercase tracking-wider"
                      >
                        {dim.status}
                      </Badge>
                    </div>

                    <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                      {dim.category}
                    </h4>
                    <p className="font-sans text-xs text-foreground-secondary leading-relaxed">
                      {dim.focus}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/20 font-mono text-[10px] text-foreground-muted flex items-baseline gap-2">
                    <span className="text-accent uppercase">IN STUDY:</span>
                    <span className="text-foreground-secondary">{dim.currentLearning}</span>
                  </div>
                </Card>
              </div>
            ))}
          </Grid>
        </div>

        {/* Current Exploration Horizon Bar */}
        <div className="p-6 sm:p-8 border border-border/70 bg-background-surface/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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

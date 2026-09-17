import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/ui/layout/Section';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';

export const CreativeSection: React.FC = () => {
  return (
    <Section id="creative" index="05" label="Creative Lab // Field Log">
      <div className="space-y-12">
        {/* Section Lead & Telemetry */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-border/80">
          <div className="space-y-4 max-w-2xl">
            <TechnicalLabel indicator indicatorColor="accent">
              VISUAL SYSTEM // 07 • EXPERIMENTAL ARCHIVE
            </TechnicalLabel>
            <DisplayText as="h2" size="xl">
              A Visual Archive of Frames, Motion, Light & Experiments.
            </DisplayText>
            <p className="text-foreground-secondary text-base leading-relaxed font-normal">
              Applying systems engineering discipline to visual expression. An evolving field log exploring video timeline cadence, kinetic letterform choreography, monolithic architectural photography, and GPU fragment shaders.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link to="/creative">
              <InteractiveCursorTarget cursorType="interactive">
                <Button variant="magnetic" className="w-full sm:w-auto tracking-widest text-xs uppercase px-6 py-3">
                  ENTER CREATIVE LAB →
                </Button>
              </InteractiveCursorTarget>
            </Link>
          </div>
        </div>

        {/* Editorial Teaser Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-background-surface border-border/80 space-y-3 hover:border-accent/40 transition-colors">
            <div className="font-mono text-[10px] text-accent tracking-widest uppercase">
              DISCIPLINE // 01
            </div>
            <h3 className="font-editorial text-base font-semibold uppercase text-foreground">
              Video Editing & Cadence
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-normal">
              Non-linear cut rhythms, audio transient alignment, and narrative pacing studies.
            </p>
          </Card>

          <Card className="p-6 bg-background-surface border-border/80 space-y-3 hover:border-accent/40 transition-colors">
            <div className="font-mono text-[10px] text-accent tracking-widest uppercase">
              DISCIPLINE // 02
            </div>
            <h3 className="font-editorial text-base font-semibold uppercase text-foreground">
              Kinetic Motion Design
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-normal">
              Procedural typography choreography, harmonic spring tension, and bezier curves.
            </p>
          </Card>

          <Card className="p-6 bg-background-surface border-border/80 space-y-3 hover:border-accent/40 transition-colors">
            <div className="font-mono text-[10px] text-accent tracking-widest uppercase">
              DISCIPLINE // 03
            </div>
            <h3 className="font-editorial text-base font-semibold uppercase text-foreground">
              Architectural Photography
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-normal">
              Orthogonal framing, structural monolithic shadows, and high-contrast light.
            </p>
          </Card>

          <Card className="p-6 bg-background-surface border-border/80 space-y-3 hover:border-accent/40 transition-colors">
            <div className="font-mono text-[10px] text-accent tracking-widest uppercase">
              DISCIPLINE // 04
            </div>
            <h3 className="font-editorial text-base font-semibold uppercase text-foreground">
              Astrophotography Pipeline
            </h3>
            <p className="text-foreground-secondary text-xs leading-relaxed font-normal">
              Deep-sky calibration framework, dark/flat noise subtraction, and photon stacking.
            </p>
          </Card>
        </div>

        {/* Teaser Footer Bar */}
        <div className="p-4 bg-background-surface border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs uppercase tracking-widest text-foreground-muted">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-foreground">DEDICATED ARCHIVE</span>
            <span className="text-border">/</span>
            <span>6 STUDIES INDEXED</span>
          </div>

          <Link
            to="/creative"
            className="text-accent hover:text-foreground transition-colors flex items-center gap-2"
          >
            <span>VIEW COMPLETE ARCHIVE & FILTER MATRIX</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
};

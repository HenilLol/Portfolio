import React from 'react';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { ASTRO_FRAMEWORK_DATA } from '@/data/creativeContent';

export const AstroTreatment: React.FC = () => {
  return (
    <section className="py-14 sm:py-24 border-b border-border/80">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <TechnicalLabel indicator indicatorColor="accent" className="mb-3">
              DEEP SKY // COMPUTATIONAL OBSERVATION
            </TechnicalLabel>
            <DisplayText as="h2" size="xl" className="max-w-2xl">
              Astrophotography Pipeline
            </DisplayText>
          </div>

          <div className="font-mono text-xs text-accent uppercase tracking-widest px-3 py-1.5 bg-accent/5 border border-accent/40 inline-flex items-center gap-2 self-start md:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{ASTRO_FRAMEWORK_DATA.status}</span>
          </div>
        </div>

        {/* Narrative Context */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-foreground-secondary text-base sm:text-lg leading-relaxed font-normal">
              {ASTRO_FRAMEWORK_DATA.lead}
            </p>
            <div className="p-4 bg-background-surface border border-border/60 font-mono text-xs text-foreground-muted uppercase tracking-wider">
              {ASTRO_FRAMEWORK_DATA.truthNote}
            </div>
          </div>

          <div className="lg:col-span-4 p-4 sm:p-6 bg-background-surface border border-border/80 space-y-3 font-mono text-xs">
            <div className="text-[10px] text-accent tracking-widest uppercase pb-2 border-b border-border/40">
              Calibration Protocol
            </div>
            <div className="flex justify-between py-1 border-b border-border/20 text-[11px]">
              <span className="text-foreground-muted uppercase">DARKS</span>
              <span className="text-foreground">Thermal Sensor Noise</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/20 text-[11px]">
              <span className="text-foreground-muted uppercase">FLATS</span>
              <span className="text-foreground">Optical Dust & Vignette</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/20 text-[11px]">
              <span className="text-foreground-muted uppercase">BIAS</span>
              <span className="text-foreground">Sensor Readout Offset</span>
            </div>
            <div className="flex justify-between py-1 text-[11px]">
              <span className="text-foreground-muted uppercase">STACKING</span>
              <span className="text-accent">Kappa-Sigma Rejection</span>
            </div>
          </div>
        </div>

        {/* Pipeline Stage Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {ASTRO_FRAMEWORK_DATA.pipelineStages.map((stage) => (
            <Card
              key={stage.step}
              className="p-4 sm:p-6 bg-background-surface border-border/80 space-y-3 relative overflow-hidden group hover:border-accent/50 transition-colors"
            >
              <div className="font-mono text-[10px] text-accent tracking-widest uppercase">
                {stage.step}
              </div>
              <h3 className="font-editorial text-sm font-semibold uppercase tracking-wide text-foreground">
                {stage.name}
              </h3>
              <p className="text-foreground-secondary text-xs leading-relaxed font-normal">
                {stage.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

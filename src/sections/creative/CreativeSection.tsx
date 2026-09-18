import React from 'react';
import { Link } from 'react-router-dom';
import { Section } from '@/components/ui/layout/Section';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { KineticFilmstripArchive } from '@/components/creative/KineticFilmstripArchive';

export const CreativeSection: React.FC = () => {
  return (
    <Section id="creative" index="06" label="Creative Lab // Visual Field Archive">
      <div className="space-y-10 sm:space-y-12">
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

        {/* Kinetic Horizontal Gallery Filmstrip */}
        <KineticFilmstripArchive />
      </div>
    </Section>
  );
};

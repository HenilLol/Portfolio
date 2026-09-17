import React from 'react';
import { LazySceneCanvas } from '@/components/3d/LazySceneCanvas';
import { TestGeometry } from '@/components/3d/TestGeometry';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="py-16 sm:py-24 border-b border-border" data-section="hero">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <TechnicalLabel indicator indicatorColor="accent">
            ARCHITECTURAL SPECIFICATION // 01
          </TechnicalLabel>

          <DisplayText as="h1" size="xl">
            Henil Patel
          </DisplayText>

          <p className="text-foreground-secondary text-base sm:text-lg leading-relaxed max-w-xl font-normal">
            Creative developer and frontend architect crafting cinematic digital products, editorial typography, and high-performance WebGL systems.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button variant="magnetic">
              Explore Blueprints
            </Button>
            <Button variant="ghost">
              System Specs →
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 h-[320px] sm:h-[380px] w-full border border-border bg-background-surface relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-accent tracking-widest uppercase">
            WebGL Stage // Lazy Evaluated
          </div>
          <LazySceneCanvas>
            <TestGeometry />
          </LazySceneCanvas>
        </div>
      </div>
    </section>
  );
};

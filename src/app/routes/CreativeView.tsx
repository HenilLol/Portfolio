import React, { useEffect } from 'react';
import { Header } from '@/components/navigation/Header';
import { PageTransition } from '@/components/transitions/PageTransition';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { GrainLayer } from '@/components/ui/atmosphere/GrainLayer';
import { GridOverlay } from '@/components/ui/layout/GridOverlay';
import { EnvironmentSystem } from '@/components/experience/EnvironmentSystem';
import { Container } from '@/components/ui/layout/Container';
import { CreativeHero } from '@/components/creative/CreativeHero';
import { EngineeringCreativeBridge } from '@/components/creative/EngineeringCreativeBridge';
import { CreativeArchive } from '@/components/creative/CreativeArchive';
import { AstroTreatment } from '@/components/creative/AstroTreatment';
import { CreativeProcess } from '@/components/creative/CreativeProcess';
import { CreativeToolsMatrix } from '@/components/creative/CreativeToolsMatrix';
import { CreativeReturnNav } from '@/components/creative/CreativeReturnNav';

export const CreativeView: React.FC = () => {
  useEffect(() => {
    document.title = 'HENIL PATEL // CREATIVE LAB';
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Atmospheric & Structural Layers */}
      <GrainLayer />
      <GridOverlay />
      <EnvironmentSystem currentSection="creative" />
      <CustomCursor />
      <Header />

      <PageTransition>
        <Container size="wide" className="space-y-4">
          {/* Hero Section */}
          <CreativeHero />

          {/* Core Philosophy: Engineering × Creative */}
          <EngineeringCreativeBridge />

          {/* Visual Archive with Filtering & Asymmetric Layout */}
          <CreativeArchive />

          {/* Astrophotography Pipeline & Calibration Specification */}
          <AstroTreatment />

          {/* Creative Working Loop */}
          <CreativeProcess />

          {/* Software & Instrumentation Matrix */}
          <CreativeToolsMatrix />

          {/* Return Navigation */}
          <CreativeReturnNav />
        </Container>
      </PageTransition>
    </div>
  );
};

import React, { useRef } from 'react';
import { Header } from '@/components/navigation/Header';
import { PageTransition } from '@/components/transitions/PageTransition';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { GrainLayer } from '@/components/ui/atmosphere/GrainLayer';
import { GridOverlay } from '@/components/ui/layout/GridOverlay';
import { Container } from '@/components/ui/layout/Container';
import { Section } from '@/components/ui/layout/Section';
import { Grid } from '@/components/ui/layout/Grid';
import { Divider } from '@/components/ui/layout/Divider';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { MetadataRow } from '@/components/ui/typography/MetadataRow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { HeroSection } from '@/sections/hero/HeroSection';
import { IntroSection } from '@/sections/intro/IntroSection';
import { AboutSection } from '@/sections/about/AboutSection';
import { SkillsSection } from '@/sections/skills/SkillsSection';
import { ProjectsSection } from '@/sections/projects/ProjectsSection';
import { CreativeSection } from '@/sections/creative/CreativeSection';
import { ExperienceSection } from '@/sections/experience/ExperienceSection';
import { ContactSection } from '@/sections/contact/ContactSection';
import { EndingSection } from '@/sections/ending/EndingSection';
import { useViewport } from '@/hooks/useViewport';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLenisScroll } from '@/hooks/useLenisScroll';

export const PortfolioHome: React.FC = () => {
  const diagnosticRef = useRef<HTMLDivElement>(null);
  const viewport = useViewport();
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useLenisScroll();

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <GrainLayer />
      <GridOverlay />
      <CustomCursor />
      <Header />

      <PageTransition>
        {/* Editorial Hero Area */}
        <Container size="wide" className="pt-8">
          <HeroSection />
        </Container>

        {/* Phase 1 Visual Engine & Design System System Telemetry */}
        <Section id="visual-engine" index="02" label="Visual Operating System">
          <div className="space-y-12">
            <div>
              <TechnicalLabel indicator indicatorColor="accent" className="mb-3">
                FOUNDATION SPECIFICATION // PHASE 1
              </TechnicalLabel>
              <DisplayText as="h2" size="lg" className="mb-4">
                Design System & Visual Engine
              </DisplayText>
              <p className="text-foreground-secondary text-base max-w-2xl font-normal leading-relaxed">
                Restrained, editorial, and minimal aesthetic architecture. The visual operating system pairs structured 12-column geometry with decoupled cursor states, magnetic interaction physics, and fluid typography.
              </p>
            </div>

            {/* Design Tokens & Telemetry Grid */}
            <Grid columns={12} gap="md">
              <div className="lg:col-span-8 space-y-6">
                <Card ref={diagnosticRef} className="border-border bg-background-surface">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                      Design Token Matrix
                    </span>
                    <Badge variant="accent">Phase 1 Verified</Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                    <div>
                      <span className="font-mono text-[10px] text-foreground-muted uppercase block">Background</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 bg-background border border-border inline-block" />
                        <span className="font-mono text-xs text-foreground font-medium">#070709</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-foreground-muted uppercase block">Surface</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 bg-background-surface border border-border inline-block" />
                        <span className="font-mono text-xs text-foreground font-medium">#0B0B0E</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-foreground-muted uppercase block">Primary Text</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 bg-foreground inline-block" />
                        <span className="font-mono text-xs text-foreground font-medium">#F4F4F6</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-foreground-muted uppercase block">Secondary Text</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 bg-foreground-secondary inline-block" />
                        <span className="font-mono text-xs text-foreground font-medium">#8F9098</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-foreground-muted uppercase block">Border Rule</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 border border-border bg-transparent inline-block" />
                        <span className="font-mono text-xs text-foreground font-medium">0.08 White</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-foreground-muted uppercase block">Controlled Accent</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 bg-accent shadow-[0_0_8px_rgba(0,240,255,0.6)] inline-block" />
                        <span className="font-mono text-xs text-accent font-medium">#00F0FF</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Interactive Cursor Target Demonstration */}
                <div className="border border-border p-6 bg-background-surface space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-widest text-foreground">
                      Cursor Interaction States
                    </span>
                    <span className="font-mono text-[10px] text-foreground-muted uppercase hidden sm:inline-block">
                      Hover zones below
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <InteractiveCursorTarget
                      cursorType="interactive"
                      className="border border-border/80 p-5 bg-background-elevated/40 hover:border-accent/40 transition-colors text-center cursor-none select-none"
                    >
                      <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-1">
                        Interactive
                      </span>
                      <span className="font-editorial text-sm font-semibold text-foreground uppercase">
                        Expanded Ring
                      </span>
                    </InteractiveCursorTarget>

                    <InteractiveCursorTarget
                      cursorType="project"
                      cursorLabel="INSPECT"
                      className="border border-border/80 p-5 bg-background-elevated/40 hover:border-accent/40 transition-colors text-center cursor-none select-none"
                    >
                      <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-1">
                        Project Badge
                      </span>
                      <span className="font-editorial text-sm font-semibold text-foreground uppercase">
                        Explore State
                      </span>
                    </InteractiveCursorTarget>

                    <InteractiveCursorTarget
                      cursorType="drag"
                      className="border border-border/80 p-5 bg-background-elevated/40 hover:border-accent/40 transition-colors text-center cursor-none select-none"
                    >
                      <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-1">
                        Drag Pill
                      </span>
                      <span className="font-editorial text-sm font-semibold text-foreground uppercase">
                        Slider Mode
                      </span>
                    </InteractiveCursorTarget>
                  </div>
                </div>
              </div>

              {/* Technical Metadata Column */}
              <div className="lg:col-span-4 space-y-6">
                <div className="border border-border p-6 bg-background-surface space-y-2">
                  <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-4">
                    System Parameters
                  </span>
                  <MetadataRow label="Display Type" value="Space Grotesk" />
                  <MetadataRow label="Body Typography" value="Inter Sans" />
                  <MetadataRow label="Technical Font" value="JetBrains Mono" />
                  <MetadataRow label="Viewport Mode" value={`${viewport.isMobile ? 'Mobile' : viewport.isTablet ? 'Tablet' : 'Desktop'}`} />
                  <MetadataRow label="Reduced Motion" value={reducedMotion ? 'Enabled' : 'Disabled'} />
                  <MetadataRow label="Three.js Strategy" value="Lazy Evaluated" dot />
                </div>

                {/* Magnetic Button Primitives */}
                <div className="border border-border p-6 bg-background-surface space-y-4">
                  <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase block">
                    Button Physics System
                  </span>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="magnetic" className="w-full sm:w-auto">
                      Magnetic Action
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => scrollTo('#projects')}
                    >
                      Scroll to Works ↓
                    </Button>
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </Section>

        {/* Reusable Architectural Sections */}
        <Container size="wide" className="space-y-8">
          <IntroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <CreativeSection />
          <ExperienceSection />
          <ContactSection />
          <Divider label="FIN" />
          <EndingSection />
        </Container>
      </PageTransition>
    </div>
  );
};

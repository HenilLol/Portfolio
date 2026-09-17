import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { PageTransition } from '@/components/transitions/PageTransition';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { GrainLayer } from '@/components/ui/atmosphere/GrainLayer';
import { GridOverlay } from '@/components/ui/layout/GridOverlay';
import { EnvironmentSystem } from '@/components/experience/EnvironmentSystem';
import { getProjectBySlug } from '@/services/projects';
import { getAdjacentProjects } from '@/data/projects';
import type { Project } from '@/types/models';
import { ProjectVisualField } from '@/components/projects/ProjectVisualField';
import { AeroIndexWorldVisualizer } from '@/components/projects/worlds/AeroIndexWorldVisualizer';
import { CoalIntelWorldVisualizer } from '@/components/projects/worlds/CoalIntelWorldVisualizer';
import { BlueprintWorldVisualizer } from '@/components/projects/worlds/BlueprintWorldVisualizer';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/layout/Container';
import { HeneoxyExperience } from '@/components/heneoxy/HeneoxyExperience';

export const ProjectView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      getProjectBySlug(slug)
        .then(setProject)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} // HENIL PATEL`;
    } else if (slug) {
      document.title = `${slug.toUpperCase()} // HENIL PATEL`;
    }
    return () => {
      document.title = 'Henil Patel // Creative Technologist & Machine Learning Engineer';
    };
  }, [project, slug]);

  // If viewing the flagship HENEOXY project, render the dedicated cinematic experience
  if (slug === 'heneoxy') {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <GrainLayer />
        <GridOverlay />
        <EnvironmentSystem currentSection="heneoxy" />
        <CustomCursor />
        <Header />
        <PageTransition>
          <HeneoxyExperience />
        </PageTransition>
      </div>
    );
  }

  // Compute adjacent projects for navigation rail
  const adjacent = slug ? getAdjacentProjects(slug) : null;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <GrainLayer />
      <GridOverlay />
      <EnvironmentSystem currentSection={slug} />
      <CustomCursor />
      <Header />

      <PageTransition>
        <Container size="wide" className="py-12 sm:py-16 lg:py-20 space-y-16 sm:space-y-24">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-border/40 font-mono text-xs uppercase tracking-widest">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-accent hover:text-foreground transition-colors"
            >
              <span>← RETURN TO PROJECT UNIVERSE</span>
            </Link>

            {project && (
              <span className="text-foreground-muted hidden sm:inline-block">
                SPEC // {project.specIndex || '00'} • {project.year || 'ACTIVE'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-32 text-center font-mono text-xs text-foreground-muted tracking-widest uppercase animate-pulse">
              CALIBRATING SYSTEM BLUEPRINT...
            </div>
          ) : project ? (
            <div className="space-y-16 sm:space-y-24">
              {/* Project Hero Header */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <TechnicalLabel indicator indicatorColor="accent">
                    {project.categoryLabel || project.category.toUpperCase()}
                  </TechnicalLabel>
                  <Badge variant={project.featured ? 'accent' : 'outline'} className="text-[9px] uppercase tracking-wider">
                    {project.status || 'ACTIVE'}
                  </Badge>
                  {project.role && (
                    <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest border border-border/50 px-2 py-0.5">
                      {project.role}
                    </span>
                  )}
                </div>

                <DisplayText as="h1" size="xl" className="text-foreground font-extrabold uppercase tracking-tightest leading-none">
                  {project.title}
                </DisplayText>

                <p className="text-foreground-secondary text-base sm:text-xl font-light leading-relaxed max-w-3xl">
                  {project.tagline || project.shortDescription}
                </p>
              </div>

              {/* Dedicated World Visualizer / Media Hero */}
              <div className="w-full shadow-2xl border border-border/80 overflow-hidden">
                {slug === 'aeroindex' ? (
                  <AeroIndexWorldVisualizer />
                ) : slug === 'coalintel' ? (
                  <CoalIntelWorldVisualizer />
                ) : slug === 'sample-project' ? (
                  <BlueprintWorldVisualizer />
                ) : (
                  <ProjectVisualField
                    project={project}
                    aspectRatio="aspect-[16/9] sm:aspect-[21/9]"
                    className="w-full"
                  />
                )}
              </div>

              {/* Two-Column Overview & Architecture */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-10 border-t border-border/40">
                {/* Left Column: Context & Overview */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
                    01 // OVERVIEW & PURPOSE
                  </span>
                  <p className="font-sans text-sm sm:text-base text-foreground leading-relaxed">
                    {project.description}
                  </p>
                  {project.caseStudy?.overview && (
                    <p className="font-sans text-sm text-foreground-secondary leading-relaxed">
                      {project.caseStudy.overview}
                    </p>
                  )}
                  {project.caseStudy?.problem && (
                    <div className="p-5 border border-border/60 bg-background-surface/40 space-y-2">
                      <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-wider block">
                        CHALLENGE MATRIX
                      </span>
                      <p className="text-xs text-foreground-secondary leading-relaxed">
                        {project.caseStudy.problem}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Technical Architecture */}
                <div className="lg:col-span-6 space-y-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
                    02 // ARCHITECTURE SPECIFICATION
                  </span>

                  {project.caseStudy?.approach ? (
                    <p className="font-sans text-sm text-foreground-secondary leading-relaxed">
                      {project.caseStudy.approach}
                    </p>
                  ) : (
                    <p className="font-sans text-sm text-foreground-secondary leading-relaxed">
                      Engineered with a performance-first mindset. Employs decoupled state management, strict TypeScript contracts, and calibrated animation budgets.
                    </p>
                  )}

                  {/* Architecture Box */}
                  {project.caseStudy?.architecture && (
                    <Card className="p-6 border-border/80 bg-background-surface/60 space-y-3">
                      <span className="font-mono text-[10px] text-accent tracking-widest uppercase block">
                        {project.caseStudy.architecture.title}
                      </span>
                      <p className="text-xs text-foreground-secondary leading-relaxed">
                        {project.caseStudy.architecture.description}
                      </p>
                    </Card>
                  )}

                  {/* Technologies Matrix */}
                  <div className="space-y-3 pt-4 border-t border-border/30">
                    <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block">
                      TECHNOLOGY IMPLEMENTATION
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-background border border-border text-xs font-mono text-foreground uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-foreground-muted uppercase tracking-wider"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Case Study Decisions & Outcomes */}
              {project.caseStudy?.challenges && project.caseStudy.challenges.length > 0 && (
                <div className="pt-10 border-t border-border/40 space-y-6">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
                    03 // ENGINEERING DECISIONS & CONSTRAINTS
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {project.caseStudy.challenges.map((challenge, i) => (
                      <Card key={i} className="p-6 border-border/60 bg-background-surface/30 space-y-2">
                        <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block">
                          CONSTRAINT // 0{i + 1}
                        </span>
                        <p className="text-xs text-foreground-secondary leading-relaxed">
                          {challenge}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Project-to-Project Navigation Rail */}
              {adjacent && (
                <div className="pt-12 border-t border-border/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Previous Project */}
                    <Link
                      to={`/project/${adjacent.prev.slug}`}
                      className="group p-4 sm:p-6 border border-border/70 bg-background-surface/30 hover:border-accent/50 transition-colors space-y-2 select-none"
                    >
                      <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block group-hover:text-accent transition-colors">
                        ← PREVIOUS BLUEPRINT
                      </span>
                      <h4 className="font-editorial text-base sm:text-lg font-bold uppercase text-foreground">
                        {adjacent.prev.title}
                      </h4>
                      <p className="font-mono text-xs text-foreground-muted truncate">
                        {adjacent.prev.categoryLabel || adjacent.prev.category}
                      </p>
                    </Link>

                    {/* Next Project */}
                    <Link
                      to={`/project/${adjacent.next.slug}`}
                      className="group p-4 sm:p-6 border border-border/70 bg-background-surface/30 hover:border-accent/50 transition-colors space-y-2 text-left sm:text-right select-none"
                    >
                      <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block group-hover:text-accent transition-colors">
                        NEXT BLUEPRINT →
                      </span>
                      <h4 className="font-editorial text-base sm:text-lg font-bold uppercase text-foreground">
                        {adjacent.next.title}
                      </h4>
                      <p className="font-mono text-xs text-foreground-muted truncate">
                        {adjacent.next.categoryLabel || adjacent.next.category}
                      </p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Technical Not-Found State */
            <div className="py-24 text-center space-y-6 max-w-xl mx-auto px-4">
              <div className="space-y-2">
                <span className="font-mono text-xs text-accent tracking-widest uppercase block">
                  SYSTEM TELEMETRY // 404
                </span>
                <h2 className="font-editorial text-2xl sm:text-4xl font-bold uppercase tracking-tight text-foreground">
                  Project World Not Found
                </h2>
                <p className="font-mono text-xs text-foreground-secondary leading-relaxed pt-2">
                  The requested architectural identifier <code className="text-accent bg-background-surface px-2 py-0.5 border border-border break-all">/project/{slug}</code> does not exist in the project universe.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  to="/#projects"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 border border-accent bg-accent/10 hover:bg-accent hover:text-background text-accent font-mono text-xs uppercase tracking-widest transition-all w-full sm:w-auto"
                >
                  <span>RETURN TO PROJECT UNIVERSE</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          )}
        </Container>
      </PageTransition>
    </div>
  );
};

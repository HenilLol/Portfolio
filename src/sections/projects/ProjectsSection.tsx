import React, { useState, useMemo, useEffect } from 'react';
import { Section } from '@/components/ui/layout/Section';
import { Container } from '@/components/ui/layout/Container';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { ProjectWorld } from '@/components/projects/ProjectWorld';
import { ProjectNavigator } from '@/components/projects/ProjectNavigator';
import { CANONICAL_PROJECTS } from '@/data/projects';
import { getProjects } from '@/services/projects';
import { useScrollspy } from '@/hooks/useScrollspy';
import type { Project } from '@/types/models';

type FilterCategory = 'ALL' | 'ai-systems' | 'systems-data' | 'creative-development';

export const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState<FilterCategory>('ALL');
  const [projectsList, setProjectsList] = useState<Project[]>(CANONICAL_PROJECTS);

  useEffect(() => {
    getProjects({ publishedOnly: true }).then((data) => {
      if (data && data.length > 0) {
        setProjectsList(data);
      }
    });
  }, []);

  // Compute project world section IDs for scrollspy
  const projectWorldIds = useMemo(
    () => projectsList.map((p) => `project-world-${p.slug}`),
    [projectsList]
  );

  const activeProjectSection = useScrollspy(projectWorldIds, {
    rootMargin: '-20% 0px -40% 0px',
  });

  const activeSlug = activeProjectSection.replace('project-world-', '');

  const featuredProject = useMemo(() => {
    return projectsList.find((p) => p.featured) || projectsList[0] || CANONICAL_PROJECTS[0];
  }, [projectsList]);

  // Filter projects if filter is active
  const filteredProjects = useMemo(() => {
    if (filter === 'ALL') return projectsList;
    return projectsList.filter((p) => p.category === filter);
  }, [filter, projectsList]);

  // Separate featured project from supporting projects
  const supportingProjects = useMemo(
    () => filteredProjects.filter((p) => p.id !== featuredProject.id),
    [filteredProjects, featuredProject.id]
  );

  const isFeaturedVisible =
    filter === 'ALL' || featuredProject.category === filter;

  return (
    <Section
      id="projects"
      index="05"
      label="Project Universe & Engineering"
      contained={false}
      className="py-20 sm:py-28 lg:py-36 border-b border-border/60"
    >
      <Container size="wide" className="space-y-12 sm:space-y-16">
        {/* Header & Category Filtering */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-3 max-w-2xl">
            <TechnicalLabel indicator indicatorColor="accent">
              SELECTED WORKS // FOUR PARADIGMS
            </TechnicalLabel>
            <DisplayText as="h2" size="lg" className="text-foreground uppercase font-bold tracking-tight">
              Project Universe
            </DisplayText>
            <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
              Engineered worlds bridging autonomous agent intelligence, high-throughput spatial telemetry, and cinematic digital design.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider select-none">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                filter === 'ALL'
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-foreground-secondary hover:border-accent/40'
              }`}
            >
              ALL SYSTEMS ({projectsList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('ai-systems')}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                filter === 'ai-systems'
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-foreground-secondary hover:border-accent/40'
              }`}
            >
              AI & AGENTIC
            </button>
            <button
              type="button"
              onClick={() => setFilter('systems-data')}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                filter === 'systems-data'
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-foreground-secondary hover:border-accent/40'
              }`}
            >
              DATA & TELEMETRY
            </button>
            <button
              type="button"
              onClick={() => setFilter('creative-development')}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                filter === 'creative-development'
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-foreground-secondary hover:border-accent/40'
              }`}
            >
              CREATIVE TECH
            </button>
          </div>
        </div>

        {/* Project Navigator Rail */}
        <ProjectNavigator
          projects={filteredProjects}
          activeSlug={activeSlug}
        />

        {/* Project Worlds Sequence */}
        <div className="space-y-12 sm:space-y-16">
          {/* Flagship Project World (if visible in current filter) */}
          {isFeaturedVisible && (
            <ProjectWorld
              project={featuredProject}
              isFeatured={true}
              className="w-full"
            />
          )}

          {/* Supporting Project Worlds */}
          <div className="space-y-8 sm:space-y-12">
            {supportingProjects.map((project) => (
              <ProjectWorld
                key={project.id}
                project={project}
                isFeatured={false}
                className="w-full"
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

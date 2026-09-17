import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '@/types/models';
import { ProjectVisualField } from './ProjectVisualField';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Badge } from '@/components/ui/Badge';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { cn } from '@/lib/utils';

export interface ProjectWorldProps {
  project: Project;
  isFeatured?: boolean;
  className?: string;
}

export const ProjectWorld: React.FC<ProjectWorldProps> = ({
  project,
  isFeatured = false,
  className = '',
}) => {
  if (isFeatured) {
    // Flagship Project World (e.g. HENEOXY)
    return (
      <article
        id={`project-world-${project.slug}`}
        data-project-slug={project.slug}
        className={cn(
          'relative p-6 sm:p-10 lg:p-14 border border-border/80 bg-background-surface/40 hover:border-accent/50 transition-colors duration-500 space-y-8 group',
          className
        )}
      >
        {/* Top Header Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          <div className="flex items-center gap-3">
            <TechnicalLabel indicator indicatorColor="accent">
              FLAGSHIP SYSTEM // {project.specIndex || '01'}
            </TechnicalLabel>
            <span className="text-border">/</span>
            <span className="text-foreground-secondary">{project.categoryLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="accent" className="text-[9px] uppercase tracking-wider">
              {project.status || 'IN DEVELOPMENT'}
            </Badge>
            <span className="text-foreground-muted">YEAR // {project.year || 'ACTIVE'}</span>
          </div>
        </div>

        {/* Core Flagship Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block mb-2">
                PROJECT IDENTITY
              </span>
              <DisplayText as="h3" size="xl" className="text-foreground font-extrabold uppercase tracking-tightest leading-none">
                {project.title}
              </DisplayText>
            </div>

            <p className="text-foreground text-base sm:text-lg font-light leading-relaxed max-w-xl">
              {project.tagline || project.shortDescription}
            </p>

            <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed max-w-xl">
              {project.description}
            </p>

            {/* Technology Signals */}
            <div className="space-y-2 pt-2">
              <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block">
                CORE STACK & SIGNALS
              </span>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 text-[11px] font-mono border border-border bg-background text-foreground-secondary tracking-wider uppercase"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Link
                to={`/project/${project.slug}`}
                className="inline-flex items-center gap-3 px-5 py-3 border border-accent bg-accent/10 hover:bg-accent hover:text-background text-accent font-mono text-xs uppercase tracking-widest transition-all duration-300 group/cta"
              >
                <span>ENTER SYSTEM BLUEPRINT</span>
                <span className="group-hover/cta:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Large Procedural Visual Field */}
          <div className="lg:col-span-6">
            <InteractiveCursorTarget
              cursorType="project"
              cursorLabel="INSPECT"
              className="block"
            >
              <Link to={`/project/${project.slug}`} className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent">
                <ProjectVisualField
                  project={project}
                  aspectRatio="aspect-[4/3] sm:aspect-[16/10]"
                  className="shadow-2xl group-hover:border-accent/60 transition-colors duration-500"
                />
              </Link>
            </InteractiveCursorTarget>
          </div>
        </div>
      </article>
    );
  }

  // Standard Supporting Project World (e.g. AEROINDEX, COALINTEL, BLUEPRINT)
  return (
    <article
      id={`project-world-${project.slug}`}
      data-project-slug={project.slug}
      className={cn(
        'relative p-6 sm:p-8 border border-border/70 bg-background-surface/30 hover:border-border-strong hover:bg-background-surface/50 transition-all duration-500 group',
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
        {/* Left: Metadata & Brief */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/30 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
            <span>SPEC // {project.specIndex || '00'}</span>
            <Badge variant="outline" className="text-[8px] uppercase">
              {project.status || 'PROTOTYPE'}
            </Badge>
          </div>

          <div>
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest block mb-1">
              {project.categoryLabel || project.category.toUpperCase()}
            </span>
            <DisplayText as="h3" size="md" className="text-foreground uppercase font-bold tracking-tight">
              {project.title}
            </DisplayText>
          </div>

          <p className="text-foreground-secondary text-xs sm:text-sm leading-relaxed">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono border border-border/60 bg-background text-foreground-muted uppercase"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to={`/project/${project.slug}`}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent hover:text-foreground transition-colors group/link"
            >
              <span>INSPECT BLUEPRINT</span>
              <span className="group-hover/link:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Right: Interactive Procedural Visual Canvas */}
        <div className="lg:col-span-7">
          <InteractiveCursorTarget
            cursorType="project"
            cursorLabel="INSPECT"
            className="block"
          >
            <Link to={`/project/${project.slug}`} className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent">
              <ProjectVisualField
                project={project}
                aspectRatio="aspect-[16/9]"
                className="group-hover:border-accent/40 transition-colors duration-300"
              />
            </Link>
          </InteractiveCursorTarget>
        </div>
      </div>
    </article>
  );
};

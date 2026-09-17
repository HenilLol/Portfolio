import React from 'react';
import type { Project } from '@/types/models';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { useCursor } from '@/components/cursor/CursorContext';
import { cn } from '@/lib/utils';

export interface ProjectNavigatorProps {
  projects: Project[];
  activeSlug?: string;
  className?: string;
}

export const ProjectNavigator: React.FC<ProjectNavigatorProps> = ({
  projects,
  activeSlug,
  className = '',
}) => {
  const { scrollTo } = useLenisScroll();
  const { setCursor, resetCursor } = useCursor();

  const handleScrollToProject = (slug: string) => {
    scrollTo(`#project-world-${slug}`, { offset: -80, duration: 1.2 });
  };

  return (
    <nav
      aria-label="Project Universe Rail"
      className={cn(
        'w-full pb-4 border-b border-border/40 overflow-x-auto no-scrollbar select-none',
        className
      )}
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-max">
        <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest mr-2 hidden md:inline-block">
          NAV RAIL //
        </span>

        {projects.map((project) => {
          const isActive = activeSlug === project.slug;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => handleScrollToProject(project.slug)}
              onMouseEnter={() => setCursor('interactive')}
              onMouseLeave={resetCursor}
              className={cn(
                'group flex items-center gap-2 px-3 py-2 min-h-[40px] font-mono text-[11px] uppercase tracking-wider transition-all duration-200 border cursor-pointer',
                isActive
                  ? 'border-accent text-accent bg-accent/10 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'border-border/60 text-foreground-secondary hover:border-accent/40 hover:text-foreground bg-background-surface/40'
              )}
            >
              <span className="text-foreground-muted group-hover:text-accent transition-colors">
                {project.specIndex || '00'}
              </span>
              <span className="font-bold">{project.title}</span>
              <span className="text-[9px] text-foreground-muted hidden lg:inline">
                / {project.categoryLabel?.split(' ')[0] || project.category}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

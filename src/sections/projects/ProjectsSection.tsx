import React from 'react';
import { Link } from 'react-router-dom';
import { SAMPLE_PROJECTS } from '@/data/fixtures';

export const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-8 border-b border-border-subtle" data-section="projects">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-foreground-muted tracking-widest uppercase">05 / Projects Stream</span>
        <span className="font-mono text-[10px] text-accent tracking-widest uppercase">[Routing Active]</span>
      </div>
      <div className="border border-border-subtle p-4 bg-background-surface flex items-center justify-between">
        <div>
          <h3 className="font-editorial text-lg text-foreground uppercase">{SAMPLE_PROJECTS[0].title}</h3>
          <p className="text-xs text-foreground-secondary">{SAMPLE_PROJECTS[0].shortDescription}</p>
        </div>
        <Link
          to={`/project/${SAMPLE_PROJECTS[0].slug}`}
          className="text-xs font-mono text-accent hover:underline uppercase tracking-widest"
        >
          Inspect Project →
        </Link>
      </div>
    </section>
  );
};

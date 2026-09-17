import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { getProjects } from '@/services/projects';
import type { Project } from '@/types/models';
import { Badge } from '@/components/ui/Badge';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Projects Management" />

      <div className="border border-border-subtle bg-background-surface overflow-hidden">
        <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
          <span className="font-mono text-xs text-foreground-secondary uppercase tracking-wider">
            All Projects ({projects.length})
          </span>
          <span className="font-mono text-[10px] text-foreground-muted uppercase">
            [Read-Only Architectural Interface]
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-foreground-muted">Loading projects...</div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {projects.map((project) => (
              <div key={project.id} className="p-4 sm:px-6 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-editorial text-sm font-semibold text-foreground uppercase">
                    {project.title}
                  </h4>
                  <p className="font-mono text-xs text-foreground-muted mt-0.5">
                    /{project.slug} • {project.category}
                  </p>
                </div>
                <Badge variant={project.published ? 'accent' : 'outline'}>
                  {project.published ? 'Published' : 'Draft'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

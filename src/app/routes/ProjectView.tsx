import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { PageTransition } from '@/components/transitions/PageTransition';
import { getProjectBySlug } from '@/services/projects';
import type { Project } from '@/types/models';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export const ProjectView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getProjectBySlug(slug)
        .then(setProject)
        .finally(() => setLoading(false));
    }
  }, [slug]);

  return (
    <div className="min-h-screen bg-background text-foreground bg-grain">
      <Header />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-mono text-accent hover:underline uppercase tracking-widest mb-8"
          >
            ← Return to Portfolio Overview
          </Link>

          {loading ? (
            <div className="py-20 text-center font-mono text-xs text-foreground-muted">
              Loading project blueprint...
            </div>
          ) : project ? (
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="accent">{project.category}</Badge>
                  <span className="font-mono text-xs text-foreground-muted">
                    Slug: /{project.slug}
                  </span>
                </div>
                <h1 className="font-editorial text-4xl sm:text-5xl font-bold uppercase tracking-tight text-foreground">
                  {project.title}
                </h1>
                <p className="text-foreground-secondary text-base mt-4 max-w-2xl leading-relaxed">
                  {project.shortDescription}
                </p>
              </div>

              <Card className="p-6">
                <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider block mb-2">
                  Technical Architecture
                </span>
                <p className="text-sm text-foreground leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-background-elevated border border-border-subtle text-xs font-mono text-foreground-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <h2 className="font-editorial text-2xl uppercase font-bold mb-2">Project Not Found</h2>
              <p className="font-mono text-xs text-foreground-muted mb-6">
                No project matches identifier: {slug}
              </p>
              <Link to="/" className="text-xs font-mono text-accent hover:underline uppercase tracking-widest">
                Return to Overview
              </Link>
            </Card>
          )}
        </div>
      </PageTransition>
    </div>
  );
};

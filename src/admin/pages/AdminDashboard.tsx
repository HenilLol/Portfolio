import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getProjects } from '@/services/projects';
import { getSkills } from '@/services/skills';
import { getExperiences } from '@/services/experience';

export const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, experiences: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [p, s, e] = await Promise.all([
          getProjects(),
          getSkills(),
          getExperiences(),
        ]);
        setCounts({
          projects: p.length,
          skills: s.length,
          experiences: e.length,
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <AdminHeader title="Executive Overview" />

      {/* Supabase Status Banner */}
      <div className="border border-border-subtle p-4 bg-background-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted block mb-1">
            Data Infrastructure Status
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="font-mono text-xs text-foreground">
              {isSupabaseConfigured ? 'Supabase Connected & Synchronized' : 'Development Fixture Mode (No API keys in environment)'}
            </span>
          </div>
        </div>
        <Badge variant={isSupabaseConfigured ? 'success' : 'outline'}>
          {isSupabaseConfigured ? 'Production Linked' : 'Offline Archetype'}
        </Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider block mb-2">
            Cataloged Projects
          </span>
          <div className="font-editorial text-3xl font-bold text-foreground">
            {loading ? '...' : counts.projects}
          </div>
        </Card>

        <Card>
          <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider block mb-2">
            Registered Skills
          </span>
          <div className="font-editorial text-3xl font-bold text-foreground">
            {loading ? '...' : counts.skills}
          </div>
        </Card>

        <Card>
          <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider block mb-2">
            Experience Milestones
          </span>
          <div className="font-editorial text-3xl font-bold text-foreground">
            {loading ? '...' : counts.experiences}
          </div>
        </Card>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Sparkles,
  Briefcase,
  Palette,
  Award,
  Plus,
  CheckCircle2,
  Database,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { AdminHeader } from '../components/AdminHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getProjects } from '@/services/projects';
import { getSkills } from '@/services/skills';
import { getExperiences } from '@/services/experience';
import { getCreativeWorks } from '@/services/creative';
import { getAchievements } from '@/services/achievements';
import type { Project, Skill, Experience, CreativeWork, Achievement } from '@/types/models';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    projects: Project[];
    skills: Skill[];
    experiences: Experience[];
    creative: CreativeWork[];
    achievements: Achievement[];
  }>({
    projects: [],
    skills: [],
    experiences: [],
    creative: [],
    achievements: [],
  });

  useEffect(() => {
    async function loadAllContent() {
      try {
        const [projects, skills, experiences, creative, achievements] = await Promise.all([
          getProjects({ publishedOnly: false }),
          getSkills({ publishedOnly: false }),
          getExperiences({ publishedOnly: false }),
          getCreativeWorks({ publishedOnly: false }),
          getAchievements({ publishedOnly: false }),
        ]);

        setData({
          projects,
          skills,
          experiences,
          creative,
          achievements,
        });
      } finally {
        setLoading(false);
      }
    }
    loadAllContent();
  }, []);

  const publishedProjects = data.projects.filter((p) => p.published).length;
  const draftProjects = data.projects.length - publishedProjects;

  const publishedCreative = data.creative.filter((c) => c.published !== false).length;
  const draftCreative = data.creative.length - publishedCreative;

  return (
    <div className="space-y-8">
      <AdminHeader
        title="Executive Control Panel"
        subtitle="System metrics, real-time inventory, and administrative workflows."
      />

      {/* Infrastructure & Security Telemetry */}
      <div className="border border-border-subtle p-5 bg-background-surface space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle/60">
          <div className="flex items-center gap-2.5">
            <Database size={16} className="text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold">
              PostgreSQL / CMS Infrastructure Telemetry
            </span>
          </div>
          <Badge variant={isSupabaseConfigured ? 'accent' : 'outline'}>
            {isSupabaseConfigured ? 'CONNECTED // PRODUCTION' : 'OFFLINE // CANONICAL FIXTURES'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-foreground-muted uppercase text-[10px] block">Database Engine</span>
            <div className="text-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {isSupabaseConfigured ? 'Supabase Managed PostgreSQL' : 'Local Fixture Fallback Engine'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-foreground-muted uppercase text-[10px] block">Security Model</span>
            <div className="text-foreground flex items-center gap-1.5">
              <Lock size={12} className="text-emerald-400" />
              Row Level Security (RLS) Active
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-foreground-muted uppercase text-[10px] block">Authorization Mode</span>
            <div className="text-foreground flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-emerald-400" />
              public.is_admin() Verification
            </div>
          </div>
        </div>
      </div>

      {/* Content Inventory Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Projects Card */}
        <Card className="p-5 border border-border-subtle bg-background-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground-secondary flex items-center gap-2">
                <FolderKanban size={14} className="text-accent" />
                Projects
              </span>
              <Badge variant="outline">{data.projects.length} Total</Badge>
            </div>
            <div className="font-editorial text-3xl font-bold text-foreground">
              {loading ? '...' : data.projects.length}
            </div>
            <div className="flex items-center gap-4 mt-2 text-[11px] font-mono">
              <span className="text-emerald-400">{publishedProjects} Published</span>
              <span className="text-foreground-muted">{draftProjects} Drafts</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/admin/projects"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 uppercase"
            >
              Manage Projects <ArrowRight size={12} />
            </Link>
          </div>
        </Card>

        {/* Creative Works Card */}
        <Card className="p-5 border border-border-subtle bg-background-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground-secondary flex items-center gap-2">
                <Palette size={14} className="text-accent" />
                Creative Work
              </span>
              <Badge variant="outline">{data.creative.length} Total</Badge>
            </div>
            <div className="font-editorial text-3xl font-bold text-foreground">
              {loading ? '...' : data.creative.length}
            </div>
            <div className="flex items-center gap-4 mt-2 text-[11px] font-mono">
              <span className="text-emerald-400">{publishedCreative} Published</span>
              <span className="text-foreground-muted">{draftCreative} Drafts</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/admin/creative"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 uppercase"
            >
              Manage Creative <ArrowRight size={12} />
            </Link>
          </div>
        </Card>

        {/* Skills Card */}
        <Card className="p-5 border border-border-subtle bg-background-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground-secondary flex items-center gap-2">
                <Sparkles size={14} className="text-accent" />
                Technical Skills
              </span>
              <Badge variant="outline">{data.skills.length} Registered</Badge>
            </div>
            <div className="font-editorial text-3xl font-bold text-foreground">
              {loading ? '...' : data.skills.length}
            </div>
            <div className="text-[11px] font-mono text-foreground-muted mt-2">
              Across 5 Technology Clusters
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/admin/skills"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 uppercase"
            >
              Manage Skills <ArrowRight size={12} />
            </Link>
          </div>
        </Card>

        {/* Experience Milestones */}
        <Card className="p-5 border border-border-subtle bg-background-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground-secondary flex items-center gap-2">
                <Briefcase size={14} className="text-accent" />
                Experience Entries
              </span>
              <Badge variant="outline">{data.experiences.length} Positions</Badge>
            </div>
            <div className="font-editorial text-3xl font-bold text-foreground">
              {loading ? '...' : data.experiences.length}
            </div>
            <div className="text-[11px] font-mono text-foreground-muted mt-2">
              Professional history milestones
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/admin/experience"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 uppercase"
            >
              Manage Experience <ArrowRight size={12} />
            </Link>
          </div>
        </Card>

        {/* Achievements Card */}
        <Card className="p-5 border border-border-subtle bg-background-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground-secondary flex items-center gap-2">
                <Award size={14} className="text-accent" />
                Achievements
              </span>
              <Badge variant="outline">{data.achievements.length} Verified</Badge>
            </div>
            <div className="font-editorial text-3xl font-bold text-foreground">
              {loading ? '...' : data.achievements.length}
            </div>
            <div className="text-[11px] font-mono text-foreground-muted mt-2">
              System architecture milestones
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border-subtle flex items-center justify-between">
            <Link
              to="/admin/achievements"
              className="text-xs font-mono text-accent hover:underline flex items-center gap-1 uppercase"
            >
              Manage Achievements <ArrowRight size={12} />
            </Link>
          </div>
        </Card>
      </div>

      {/* Fast Administrative Actions */}
      <div className="border border-border-subtle bg-background-surface p-6 space-y-4">
        <h3 className="font-editorial text-base font-bold uppercase tracking-tight text-foreground">
          Administrative Direct Actions
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/admin/projects">
            <Button size="sm" className="gap-1.5">
              <Plus size={14} /> New Project
            </Button>
          </Link>
          <Link to="/admin/creative">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus size={14} /> New Creative Work
            </Button>
          </Link>
          <Link to="/admin/skills">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus size={14} /> Add Skill
            </Button>
          </Link>
          <Link to="/admin/experience">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Plus size={14} /> Add Experience
            </Button>
          </Link>
          <Link to="/admin/settings">
            <Button size="sm" variant="ghost" className="gap-1.5">
              Configure Settings →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

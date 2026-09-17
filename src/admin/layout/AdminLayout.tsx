import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Briefcase, 
  Sparkles, 
  Palette, 
  Award, 
  SlidersHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/experience', label: 'Experience', icon: Briefcase },
  { path: '/admin/skills', label: 'Skills', icon: Sparkles },
  { path: '/admin/creative', label: 'Creative R&D', icon: Palette },
  { path: '/admin/achievements', label: 'Achievements', icon: Award },
  { path: '/admin/settings', label: 'Site Settings', icon: SlidersHorizontal },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-border-subtle bg-background-surface flex flex-col shrink-0">
        <div className="h-16 px-6 flex items-center border-b border-border-subtle">
          <span className="font-editorial text-sm font-bold tracking-wider text-foreground">
            HENIL PATEL <span className="text-accent">/</span> CMS
          </span>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider transition-colors uppercase',
                    isActive
                      ? 'bg-accent-muted text-accent font-medium border-l-2 border-accent'
                      : 'text-foreground-secondary hover:text-foreground hover:bg-white/[0.02]'
                  )
                }
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

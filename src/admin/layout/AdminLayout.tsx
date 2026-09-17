import React, { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  Sparkles,
  Palette,
  Award,
  SlidersHorizontal,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/experience', label: 'Experience', icon: Briefcase },
  { path: '/admin/skills', label: 'Skills', icon: Sparkles },
  { path: '/admin/creative', label: 'Creative Work', icon: Palette },
  { path: '/admin/achievements', label: 'Achievements', icon: Award },
  { path: '/admin/settings', label: 'Site Settings', icon: SlidersHorizontal },
];

export const AdminLayout: React.FC = () => {
  const { user, isConfigured, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden h-14 px-4 border-b border-border-subtle bg-background-surface flex items-center justify-between sticky top-0 z-40">
        <span className="font-editorial text-xs font-bold tracking-wider text-foreground">
          HENIL PATEL <span className="text-accent">/</span> CMS
        </span>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-foreground-secondary hover:text-foreground focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close Navigation' : 'Open Navigation'}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'w-full md:w-64 border-r border-border-subtle bg-background-surface flex flex-col shrink-0',
          'fixed inset-0 top-14 md:static md:top-auto z-30 md:z-auto',
          mobileMenuOpen ? 'flex' : 'hidden md:flex'
        )}
      >
        <div className="hidden md:flex h-16 px-6 items-center border-b border-border-subtle justify-between">
          <span className="font-editorial text-sm font-bold tracking-wider text-foreground">
            HENIL PATEL <span className="text-accent">/</span> CMS
          </span>
          <span className="font-mono text-[9px] px-1.5 py-0.5 border border-accent/30 text-accent uppercase">
            v9.0
          </span>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 text-xs font-mono tracking-wider transition-colors uppercase rounded-none',
                    isActive
                      ? 'bg-accent/10 text-accent font-medium border-l-2 border-accent'
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

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border-subtle space-y-3 bg-background-elevated/40">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full shrink-0',
                isConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              )}
            />
            <div className="text-[10px] font-mono text-foreground-muted truncate">
              {isConfigured ? 'Supabase Synchronized' : 'Offline / Fixtures'}
            </div>
          </div>

          <div className="text-[10px] font-mono text-foreground-secondary truncate flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-accent shrink-0" />
            <span className="truncate">{user?.email || 'Administrator'}</span>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-border-subtle/60 text-xs font-mono">
            <Link
              to="/"
              className="text-foreground-muted hover:text-foreground flex items-center gap-1.5 uppercase text-[10px] tracking-wider"
            >
              <ExternalLink size={12} />
              Public Site
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="text-foreground-muted hover:text-red-400 flex items-center gap-1 uppercase text-[10px] tracking-wider cursor-pointer"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

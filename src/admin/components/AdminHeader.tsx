import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const AdminHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => {
  const { user, signOut, isConfigured } = useAuth();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border-subtle gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-editorial text-2xl font-bold uppercase tracking-tight text-foreground">
            {title}
          </h1>
          <span className="font-mono text-[10px] px-2 py-0.5 border border-accent/40 text-accent uppercase">
            Admin CMS
          </span>
        </div>
        <p className="text-xs font-mono text-foreground-muted mt-1">
          {subtitle ||
            (user?.email
              ? `Authenticated as ${user.email}`
              : isConfigured
              ? 'Owner Session Active'
              : 'Offline / Fixture Mode')}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {action}
        <Link to="/">
          <Button variant="ghost" size="sm">
            View Public Site ↗
          </Button>
        </Link>
        {user && (
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

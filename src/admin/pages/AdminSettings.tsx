import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { getSiteSettings } from '@/services/settings';
import type { SiteSettings } from '@/types/models';
import { Card } from '@/components/ui/Card';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Site Settings" />

      {settings && (
        <Card className="space-y-4">
          <div>
            <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider block mb-1">
              Site Title
            </span>
            <div className="font-mono text-sm text-foreground">{settings.siteTitle}</div>
          </div>
          <div>
            <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider block mb-1">
              Tagline
            </span>
            <div className="font-mono text-sm text-foreground">{settings.siteTagline}</div>
          </div>
          <div>
            <span className="font-mono text-xs text-foreground-muted uppercase tracking-wider block mb-1">
              Availability
            </span>
            <div className="font-mono text-xs text-accent uppercase">{settings.availability}</div>
          </div>
        </Card>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { getCreativeWorks } from '@/services/creative';
import type { CreativeWork } from '@/types/models';

export const AdminCreative: React.FC = () => {
  const [works, setWorks] = useState<CreativeWork[]>([]);

  useEffect(() => {
    getCreativeWorks().then(setWorks);
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Creative R&D Management" />
      <div className="border border-border-subtle bg-background-surface divide-y divide-border-subtle">
        {works.map((work) => (
          <div key={work.id} className="p-4 sm:p-6">
            <h4 className="font-editorial text-sm font-semibold text-foreground uppercase">{work.title}</h4>
            <p className="font-mono text-xs text-foreground-muted">{work.medium} • {work.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

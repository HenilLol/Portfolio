import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { getExperiences } from '@/services/experience';
import type { Experience } from '@/types/models';

export const AdminExperience: React.FC = () => {
  const [items, setItems] = useState<Experience[]>([]);

  useEffect(() => {
    getExperiences().then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Experience Management" />
      <div className="border border-border-subtle bg-background-surface divide-y divide-border-subtle">
        {items.map((exp) => (
          <div key={exp.id} className="p-4 sm:p-6">
            <h4 className="font-editorial text-sm font-semibold text-foreground uppercase">{exp.role}</h4>
            <p className="font-mono text-xs text-foreground-muted">{exp.company} • {exp.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

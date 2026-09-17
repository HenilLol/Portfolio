import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { getAchievements } from '@/services/achievements';
import type { Achievement } from '@/types/models';

export const AdminAchievements: React.FC = () => {
  const [items, setItems] = useState<Achievement[]>([]);

  useEffect(() => {
    getAchievements().then(setItems);
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Achievements Management" />
      <div className="border border-border-subtle bg-background-surface divide-y divide-border-subtle">
        {items.map((item) => (
          <div key={item.id} className="p-4 sm:p-6 flex items-center justify-between">
            <div>
              <h4 className="font-editorial text-sm font-semibold text-foreground uppercase">{item.title}</h4>
              <p className="font-mono text-xs text-foreground-muted">{item.issuer} • {item.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

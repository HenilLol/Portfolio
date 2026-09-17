import React, { useEffect, useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { getSkills } from '@/services/skills';
import type { Skill } from '@/types/models';

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader title="Skills Management" />
      <div className="border border-border-subtle bg-background-surface divide-y divide-border-subtle">
        {skills.map((skill) => (
          <div key={skill.id} className="p-4 sm:p-6 flex items-center justify-between">
            <span className="font-mono text-sm text-foreground">{skill.name}</span>
            <span className="font-mono text-xs text-foreground-muted">{skill.proficiency}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

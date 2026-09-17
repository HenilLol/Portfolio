import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-widest uppercase border';

  const variants = {
    default: 'bg-background-elevated text-foreground-secondary border-border-subtle',
    accent: 'bg-accent-muted text-accent border-accent/30',
    outline: 'bg-transparent text-foreground-secondary border-border',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
};

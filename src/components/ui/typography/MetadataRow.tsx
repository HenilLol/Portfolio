import React from 'react';
import { cn } from '@/lib/utils';

export interface MetadataRowProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  dot?: boolean;
}

export const MetadataRow: React.FC<MetadataRowProps> = ({
  label,
  value,
  dot = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-baseline justify-between py-2 border-b border-border/60 font-mono text-xs',
        className
      )}
      {...props}
    >
      <span className="text-foreground-muted uppercase tracking-widest text-[11px] flex items-center gap-2">
        {dot && <span className="w-1 h-1 rounded-full bg-accent inline-block" />}
        {label}
      </span>
      <span className="text-foreground font-medium text-right">
        {value}
      </span>
    </div>
  );
};

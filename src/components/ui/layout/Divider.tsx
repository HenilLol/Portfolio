import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  dashed?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  label,
  dashed = false,
  className,
  ...props
}) => {
  if (label) {
    return (
      <div
        className={cn('relative flex items-center my-8 w-full', className)}
        {...props}
      >
        <div className={cn('flex-grow border-t border-border', dashed && 'border-dashed')} />
        <span className="shrink-0 px-4 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
          {label}
        </span>
        <div className={cn('flex-grow border-t border-border', dashed && 'border-dashed')} />
      </div>
    );
  }

  return (
    <hr
      className={cn(
        'w-full border-0 border-t border-border my-6',
        dashed && 'border-dashed',
        className
      )}
      {...props}
    />
  );
};

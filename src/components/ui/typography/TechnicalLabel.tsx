import React from 'react';
import { cn } from '@/lib/utils';

export interface TechnicalLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  indicator?: boolean;
  indicatorColor?: 'accent' | 'success' | 'muted';
  size?: 'xs' | 'sm';
}

export const TechnicalLabel: React.FC<TechnicalLabelProps> = ({
  children,
  indicator = false,
  indicatorColor = 'accent',
  size = 'xs',
  className,
  ...props
}) => {
  const dotColorClasses = {
    accent: 'bg-accent shadow-[0_0_8px_rgba(0,240,255,0.6)]',
    success: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    muted: 'bg-foreground-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono uppercase tracking-widest text-foreground-secondary',
        size === 'xs' ? 'text-[10px]' : 'text-xs',
        className
      )}
      {...props}
    >
      {indicator && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full inline-block shrink-0', dotColorClasses[indicatorColor])}
        />
      )}
      {children}
    </span>
  );
};

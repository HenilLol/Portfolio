import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  elevated = false,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border border-border-subtle p-6 transition-colors',
        elevated ? 'bg-background-elevated' : 'bg-background-surface',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

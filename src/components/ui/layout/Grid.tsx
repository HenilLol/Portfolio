import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 12 | 6 | 4 | 3 | 2;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Grid: React.FC<GridProps> = ({
  children,
  columns = 12,
  gap = 'md',
  className,
  ...props
}) => {
  const colClasses = {
    12: 'grid-cols-1 md:grid-cols-6 lg:grid-cols-12',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    3: 'grid-cols-1 md:grid-cols-3',
    2: 'grid-cols-1 md:grid-cols-2',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6 lg:gap-8',
    lg: 'gap-8 lg:gap-12',
    xl: 'gap-12 lg:gap-16',
  };

  return (
    <div
      className={cn(
        'grid',
        colClasses[columns],
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

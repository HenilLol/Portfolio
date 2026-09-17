import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  className,
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-4xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-6 sm:px-8 lg:px-12',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

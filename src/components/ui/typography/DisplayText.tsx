import React from 'react';
import { cn } from '@/lib/utils';

export interface DisplayTextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span';
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm';
  children: React.ReactNode;
}

export const DisplayText: React.FC<DisplayTextProps> = ({
  as: Component = 'h2',
  size = 'lg',
  className,
  children,
  ...props
}) => {
  const sizeClasses = {
    '2xl': 'text-display-2xl',
    'xl': 'text-display-xl',
    'lg': 'text-display-lg',
    'md': 'text-display-md',
    'sm': 'text-display-sm',
  };

  return (
    <Component
      className={cn(
        'font-editorial font-bold uppercase text-foreground tracking-tightest leading-none',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

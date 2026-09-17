import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';
import { useCursor } from '@/components/cursor/CursorContext';
import { Magnetic } from '@/components/motion/Magnetic';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'magnetic';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const { setCursor, resetCursor } = useCursor();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCursor('interactive');
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    resetCursor();
    onMouseLeave?.(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-mono uppercase tracking-widest text-xs transition-colors rounded-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

  const variants = {
    primary: 'bg-foreground text-background hover:bg-accent hover:text-background font-medium',
    secondary: 'bg-background-elevated text-foreground hover:bg-background-surface border border-border',
    ghost: 'bg-transparent text-foreground-secondary hover:text-foreground hover:bg-white/[0.04]',
    outline: 'bg-transparent border border-border text-foreground hover:border-accent hover:text-accent',
    magnetic: 'bg-transparent border border-border text-foreground hover:border-accent hover:text-accent font-medium px-6 py-3',
  };

  const sizes = {
    sm: 'h-8 px-3 text-[10px]',
    md: 'h-10 px-5 text-xs',
    lg: 'h-12 px-7 text-sm',
  };

  const buttonElement = (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(baseStyles, variants[variant], variant !== 'magnetic' && sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );

  if (variant === 'magnetic') {
    return <Magnetic strength={0.25}>{buttonElement}</Magnetic>;
  }

  return buttonElement;
};

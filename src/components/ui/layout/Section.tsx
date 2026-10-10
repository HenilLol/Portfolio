import React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id?: string;
  index?: string;
  label?: string;
  contained?: boolean;
  withDividers?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  id,
  index,
  label,
  contained = true,
  withDividers = true,
  className,
  ...props
}) => {
  const content = (
    <>
      {(index || label) && (
        <div className="group/index flex items-center justify-between pb-5 mb-12 sm:mb-16 border-b border-border/40 font-mono text-[11px] tracking-widest uppercase text-foreground-secondary transition-colors duration-300 hover:border-accent/50">
          <div className="flex items-center gap-3">
            {index && <span className="text-accent font-semibold">{index}</span>}
            {index && label && <span className="text-foreground-muted">/</span>}
            {label && <span className="text-foreground">{label}</span>}
          </div>
          <span className="text-foreground-muted hidden sm:inline-block transition-colors duration-300 group-hover/index:text-accent">SYS // {id || 'NODE'}</span>
        </div>
      )}
      {children}
    </>
  );

  return (
    <section
      id={id}
      data-section={id}
      className={cn(
        'py-16 sm:py-24 lg:py-32 relative',
        withDividers && 'border-b border-border',
        className
      )}
      {...props}
    >
      {contained ? <Container>{content}</Container> : content}
    </section>
  );
};

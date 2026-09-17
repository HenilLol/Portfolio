import React from 'react';
import type { Project } from '@/types/models';
import { cn } from '@/lib/utils';

export interface ProjectVisualFieldProps {
  project: Project;
  className?: string;
  aspectRatio?: string;
}

export const ProjectVisualField: React.FC<ProjectVisualFieldProps> = ({
  project,
  className = '',
  aspectRatio = 'aspect-[16/9]',
}) => {
  const signature = project.proceduralSignature || {
    pattern: 'matrix' as const,
    gridDensity: 12,
    coordinates: 'INDIA · IST',
    primaryColor: '#00F0FF',
  };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border border-border/70 bg-background-surface/80 select-none group',
        aspectRatio,
        className
      )}
    >
      {/* Corner Technical Crosshairs */}
      <span aria-hidden="true" className="absolute top-2 left-2 font-mono text-[9px] text-foreground-muted/60 leading-none">
        +
      </span>
      <span aria-hidden="true" className="absolute top-2 right-2 font-mono text-[9px] text-foreground-muted/60 leading-none">
        +
      </span>
      <span aria-hidden="true" className="absolute bottom-2 left-2 font-mono text-[9px] text-foreground-muted/60 leading-none">
        +
      </span>
      <span aria-hidden="true" className="absolute bottom-2 right-2 font-mono text-[9px] text-foreground-muted/60 leading-none">
        +
      </span>

      {/* Procedural Pattern SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`grid-${project.id}`}
            width={signature.gridDensity * 4}
            height={signature.gridDensity * 4}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${signature.gridDensity * 4} 0 L 0 0 0 ${signature.gridDensity * 4}`}
              fill="none"
              stroke="rgba(244, 244, 246, 0.08)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Base Grid */}
        <rect width="100%" height="100%" fill={`url(#grid-${project.id})`} />

        {/* Pattern-Specific Geometric Visuals */}
        {signature.pattern === 'matrix' && (
          <g>
            <circle cx="25%" cy="35%" r="3" fill="#00F0FF" opacity="0.6" />
            <circle cx="75%" cy="65%" r="3" fill="#00F0FF" opacity="0.6" />
            <circle cx="50%" cy="50%" r="4" fill="#00F0FF" opacity="0.8" />
            <line x1="25%" y1="35%" x2="50%" y2="50%" stroke="#00F0FF" strokeWidth="1" opacity="0.3" />
            <line x1="50%" y1="50%" x2="75%" y2="65%" stroke="#00F0FF" strokeWidth="1" opacity="0.3" />
          </g>
        )}

        {signature.pattern === 'signal' && (
          <g>
            <path
              d="M 10 50 Q 150 10, 300 50 T 600 50 T 900 50"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path
              d="M 10 60 Q 150 20, 300 60 T 600 60 T 900 60"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.3"
            />
          </g>
        )}

        {signature.pattern === 'orbital' && (
          <g transform="translate(200, 150)">
            <circle cx="0" cy="0" r="80" fill="none" stroke="#A855F7" strokeWidth="1" opacity="0.25" />
            <circle cx="0" cy="0" r="130" fill="none" stroke="#A855F7" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
            <line x1="-150" y1="0" x2="150" y2="0" stroke="rgba(244,244,246,0.1)" strokeWidth="1" />
            <line x1="0" y1="-150" x2="0" y2="150" stroke="rgba(244,244,246,0.1)" strokeWidth="1" />
          </g>
        )}

        {signature.pattern === 'vector' && (
          <g>
            <line x1="10%" y1="80%" x2="90%" y2="20%" stroke="#F59E0B" strokeWidth="1" opacity="0.35" />
            <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#F59E0B" strokeWidth="1" strokeDasharray="5,5" opacity="0.25" />
            <rect x="40%" y="35%" width="20%" height="30%" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.4" />
          </g>
        )}
      </svg>

      {/* Ambient Radial Gradient Accent */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 60% 40%, ${signature.primaryColor || '#00F0FF'} 0%, transparent 65%)`,
        }}
      />

      {/* Typographic Watermark */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
      >
        <span className="font-editorial text-5xl sm:text-7xl lg:text-9xl font-extrabold uppercase tracking-tightest text-foreground/[0.04] group-hover:text-foreground/[0.07] transition-colors duration-500 select-none">
          {project.shortTitle || project.title}
        </span>
      </div>

      {/* Top Header Telemetry */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-foreground-muted/80">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>SPEC // {project.specIndex || '01'}</span>
        </div>
        <span>{project.categoryLabel || project.category.toUpperCase()}</span>
      </div>

      {/* Bottom Footer Telemetry */}
      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-foreground-muted/70">
        <span>LOC // {signature.coordinates}</span>
        <span>PAT // {signature.pattern.toUpperCase()}</span>
      </div>
    </div>
  );
};

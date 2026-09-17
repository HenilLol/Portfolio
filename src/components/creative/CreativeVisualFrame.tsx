import React from 'react';
import type { CreativeWork } from '@/types/models';

interface CreativeVisualFrameProps {
  work: CreativeWork;
  isHovered?: boolean;
  className?: string;
  showDetails?: boolean;
}

export const CreativeVisualFrame: React.FC<CreativeVisualFrameProps> = ({
  work,
  isHovered = false,
  className = '',
  showDetails = true,
}) => {
  const { proceduralSignature, media, thumbnail, title, aspectRatio = '16/9', status = 'STUDY' } = work;
  const signatureType = proceduralSignature?.type || 'grid';
  const accent = proceduralSignature?.accentColor || '#00F0FF';
  const density = proceduralSignature?.density || 16;
  const coords = proceduralSignature?.coordinates || 'COORD 00:00';

  // Map aspect ratio string to Tailwind aspect class or CSS style
  const aspectClass =
    aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1/1'
      ? 'aspect-square'
      : aspectRatio === '21/9'
      ? 'aspect-[21/9]'
      : 'aspect-[16/9]';

  // If real image/video asset is provided, render it
  if (media?.src || thumbnail) {
    const src = media?.src || thumbnail;
    return (
      <div className={`relative w-full overflow-hidden bg-background-surface border border-border/60 ${aspectClass} ${className}`}>
        <img
          src={src}
          alt={title}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-background/20 pointer-events-none" />
      </div>
    );
  }

  // Authentic procedural SVG technical canvas for pending study slots
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#070709] border border-border/80 select-none group/canvas ${aspectClass} ${className}`}
    >
      {/* Precision Background Geometry */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id={`pattern-grid-${work.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.75" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#pattern-grid-${work.id})`} />

        {/* Diagonal Calibration Line */}
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />

        {/* Center Reticle Crosshairs */}
        <g transform="translate(50%, 50%)" className="origin-center">
          <circle r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" />
          <circle
            r="18"
            fill="none"
            stroke={isHovered ? accent : 'rgba(255,255,255,0.15)'}
            strokeWidth="0.75"
            strokeDasharray="3 3"
            className="transition-colors duration-300"
          />
          <line x1="-48" y1="0" x2="48" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
          <line x1="0" y1="-48" x2="0" y2="48" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
        </g>

        {/* Discipline-Specific Procedural Graphics */}
        {signatureType === 'waveform' && (
          <g transform="translate(10%, 65%)">
            {Array.from({ length: density }).map((_, i) => {
              const height = 8 + Math.sin(i * 0.45) * 22 + ((i * 7) % 19);
              return (
                <rect
                  key={i}
                  x={i * 18}
                  y={-height / 2}
                  width="4"
                  height={height}
                  fill={isHovered ? accent : 'rgba(255,255,255,0.18)'}
                  opacity={0.3 + (i % 3) * 0.25}
                  className="transition-all duration-300"
                />
              );
            })}
          </g>
        )}

        {signatureType === 'filmstrip' && (
          <g>
            {/* Top Sprocket Holes */}
            {Array.from({ length: 14 }).map((_, i) => (
              <rect
                key={`top-${i}`}
                x={`${(i / 14) * 100 + 1}%`}
                y="8"
                width="10"
                height="6"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.75"
              />
            ))}
            {/* Bottom Sprocket Holes */}
            {Array.from({ length: 14 }).map((_, i) => (
              <rect
                key={`bot-${i}`}
                x={`${(i / 14) * 100 + 1}%`}
                y="calc(100% - 14px)"
                width="10"
                height="6"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.75"
              />
            ))}
            {/* Bezier Interpolation Curve */}
            <path
              d="M 40 180 C 120 180, 180 60, 260 60"
              fill="none"
              stroke={isHovered ? accent : 'rgba(255,255,255,0.2)'}
              strokeWidth="1.5"
              strokeDasharray="4 4"
              className="transition-colors duration-300"
            />
          </g>
        )}

        {signatureType === 'aperture' && (
          <g transform="translate(50%, 50%)">
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="60"
                y2="0"
                stroke={isHovered ? accent : 'rgba(255,255,255,0.2)'}
                strokeWidth="0.75"
                transform={`rotate(${i * 45}) translate(20, 0)`}
                className="transition-colors duration-300"
              />
            ))}
            <circle r="72" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6 6" />
          </g>
        )}

        {signatureType === 'celestial' && (
          <g>
            {/* Right Ascension & Declination Curvature */}
            <ellipse cx="50%" cy="50%" rx="42%" ry="26%" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.75" strokeDasharray="2 4" />
            <ellipse cx="50%" cy="50%" rx="28%" ry="16%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.75" />
            {/* Star Magnitude Calibration Points */}
            <circle cx="28%" cy="32%" r="1.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="72%" cy="40%" r="2" fill={accent} opacity="0.8" />
            <circle cx="64%" cy="68%" r="1" fill="#FFFFFF" opacity="0.6" />
            <circle cx="38%" cy="74%" r="1.5" fill="#FFFFFF" opacity="0.7" />
            <circle cx="50%" cy="50%" r="2.5" fill={accent} opacity="0.9" />
          </g>
        )}

        {signatureType === 'grid' && (
          <g>
            {/* 12-Column Subgrid Boundary Lines */}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={i}
                x1={`${(i / 6) * 100}%`}
                y1="0"
                x2={`${(i / 6) * 100}%`}
                y2="100%"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.75"
              />
            ))}
          </g>
        )}
      </svg>

      {/* Optical Corner Crop Marks */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/20 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/20 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/20 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20 pointer-events-none" />

      {/* Ambient Top Telemetry Badge */}
      {showDetails && (
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-foreground-muted pointer-events-none">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
              style={{ backgroundColor: isHovered ? accent : 'rgba(255,255,255,0.3)' }}
            />
            <span className="uppercase text-foreground-secondary">
              FRAME // {String(work.order).padStart(3, '0')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-background-elevated/80 border border-border/60 text-[8px] uppercase text-accent font-medium">
              {status}
            </span>
            <span className="hidden sm:inline-block text-[8px] text-foreground-muted uppercase">
              {aspectRatio}
            </span>
          </div>
        </div>
      )}

      {/* Center Study Indicator */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none transition-transform duration-500">
        <span className="font-mono text-[9px] tracking-widest text-foreground-muted uppercase mb-1">
          {work.slotNote || 'VISUAL ARCHIVE SLOT'}
        </span>
        <span className="font-editorial text-xs sm:text-sm font-semibold tracking-wider text-foreground uppercase max-w-xs">
          {title}
        </span>
      </div>

      {/* Ambient Bottom Telemetry */}
      {showDetails && (
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[9px] font-mono tracking-widest text-foreground-muted pointer-events-none">
          <span className="text-[8px] uppercase">{coords}</span>
          <span className="text-[8px] uppercase text-foreground-muted">
            ASSET PENDING // ZERO FABRICATION
          </span>
        </div>
      )}
    </div>
  );
};

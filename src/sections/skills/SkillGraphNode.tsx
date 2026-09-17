import React from 'react';
import { useCursor } from '@/components/cursor/CursorContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { TechNode } from '@/data/skillsContent';
import { cn } from '@/lib/utils';

export interface SkillGraphNodeProps {
  node: TechNode;
  isActive: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  onHover: (node: TechNode | null) => void;
  onClick: (node: TechNode) => void;
  className?: string;
  style?: React.CSSProperties;
}

const statusBadgeStyles: Record<TechNode['status'], { text: string; bg: string; border: string }> = {
  USING: { text: 'text-accent', bg: 'bg-accent/10', border: 'border-accent/40' },
  LEARNING: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  EXPLORING: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  FAMILIAR: { text: 'text-foreground-secondary', bg: 'bg-foreground/5', border: 'border-border/40' },
};

export const SkillGraphNode: React.FC<SkillGraphNodeProps> = ({
  node,
  isActive,
  isConnected,
  isDimmed,
  onHover,
  onClick,
  className,
  style,
}) => {
  const { setCursor, resetCursor } = useCursor();
  const reducedMotion = useReducedMotion();

  const handleMouseEnter = () => {
    onHover(node);
    setCursor('interactive');
  };

  const handleMouseLeave = () => {
    onHover(null);
    resetCursor();
  };

  const badgeStyle = statusBadgeStyles[node.status];

  return (
    <button
      type="button"
      id={`skill-node-${node.id}`}
      onClick={() => onClick(node)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => onHover(node)}
      onBlur={() => onHover(null)}
      aria-label={`${node.name} (${node.status})`}
      style={style}
      className={cn(
        'group text-left p-3 min-w-[140px] max-w-[170px] select-none cursor-pointer',
        'border bg-background-surface/90 backdrop-blur-md transition-all',
        reducedMotion ? 'duration-0' : 'duration-300',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
        isActive
          ? 'border-accent shadow-[0_0_14px_rgba(0,240,255,0.25)] z-30 scale-105'
          : isConnected
          ? 'border-accent/60 bg-background-elevated/70 z-20'
          : isDimmed
          ? 'border-border/30 opacity-30 z-10'
          : 'border-border/70 hover:border-border-strong hover:bg-background-elevated z-10',
        className
      )}
    >
      <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-border/30">
        <span className="font-mono text-[9px] uppercase tracking-widest text-foreground-muted truncate">
          {node.categoryLabel}
        </span>
        <span
          className={cn(
            'font-mono text-[8px] tracking-wider uppercase px-1 py-0.2 border',
            badgeStyle.text,
            badgeStyle.bg,
            badgeStyle.border
          )}
        >
          {node.status}
        </span>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span
          className={cn(
            'font-editorial text-sm font-semibold tracking-wide uppercase transition-colors',
            isActive ? 'text-accent' : isConnected ? 'text-foreground' : 'text-foreground/90'
          )}
        >
          {node.name}
        </span>

        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        )}
      </div>
    </button>
  );
};

import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Magnetic } from '@/components/motion/Magnetic';
import { useCursor } from '@/components/cursor/CursorContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { EASING } from '@/animations/presets/motionTokens';

export interface MenuTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  id?: string;
}

export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ isOpen, onClick, className, id = 'menu-trigger-button' }, ref) => {
    const { setCursor, resetCursor } = useCursor();
    const reducedMotion = useReducedMotion();

    return (
      <Magnetic strength={0.25} radius={70}>
        <button
          ref={ref}
          id={id}
          type="button"
          onClick={onClick}
          onMouseEnter={() => setCursor('interactive')}
          onMouseLeave={resetCursor}
          aria-expanded={isOpen}
          aria-controls="site-navigation-overlay"
          aria-haspopup="dialog"
          aria-label={isOpen ? 'Close navigation matrix' : 'Open navigation matrix'}
          className={cn(
            'group relative flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] min-w-[44px] font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer select-none',
            'border border-border/80 hover:border-accent/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent bg-background-surface/60 backdrop-blur-sm',
            isOpen
              ? 'text-accent border-accent/80 shadow-[0_0_12px_rgba(0,240,255,0.15)]'
              : 'text-foreground hover:text-accent',
            className
          )}
        >
          {/* Animated text rollover */}
          <span className="relative overflow-hidden inline-block h-4 leading-4">
            <motion.span
              animate={{ y: isOpen ? -16 : 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.3,
                ease: EASING.editorial,
              }}
              className="block font-medium"
            >
              MENU
            </motion.span>
            <motion.span
              animate={{ y: isOpen ? -16 : 0 }}
              transition={{
                duration: reducedMotion ? 0 : 0.3,
                ease: EASING.editorial,
              }}
              className="block font-medium text-accent"
            >
              CLOSE
            </motion.span>
          </span>

          {/* Minimalist geometric morphing icon */}
          <div className="w-4 h-3.5 flex flex-col justify-between items-end relative">
            {/* Top line: translates down and rotates to form top half of X */}
            <motion.span
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 6 : 0,
                width: isOpen ? '16px' : '16px',
                backgroundColor: isOpen ? '#00F0FF' : 'currentColor',
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.28,
                ease: EASING.editorial,
              }}
              className="h-[1.5px] origin-center block rounded-full"
            />

            {/* Middle line: scales out / retracts with staggered timing */}
            <motion.span
              animate={{
                scaleX: isOpen ? 0 : 1,
                opacity: isOpen ? 0 : 1,
                width: '10px',
                backgroundColor: isOpen ? '#00F0FF' : 'currentColor',
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.2,
                ease: EASING.editorial,
              }}
              className="h-[1.5px] origin-right block group-hover:w-4 transition-all duration-200 rounded-full"
            />

            {/* Bottom line: translates up and rotates to form bottom half of X */}
            <motion.span
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -6 : 0,
                width: isOpen ? '16px' : '16px',
                backgroundColor: isOpen ? '#00F0FF' : 'currentColor',
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.28,
                ease: EASING.editorial,
              }}
              className="h-[1.5px] origin-center block rounded-full"
            />
          </div>
        </button>
      </Magnetic>
    );
  }
);

MenuTrigger.displayName = 'MenuTrigger';

import React from 'react';
import { motion } from 'motion/react';
import { Magnetic } from '@/components/motion/Magnetic';
import { useCursor } from '@/components/cursor/CursorContext';
import { cn } from '@/lib/utils';

export interface MenuTriggerProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const MenuTrigger: React.FC<MenuTriggerProps> = ({
  isOpen,
  onClick,
  className,
}) => {
  const { setCursor, resetCursor } = useCursor();

  return (
    <Magnetic strength={0.25} radius={60}>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setCursor('interactive')}
        onMouseLeave={resetCursor}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        className={cn(
          'group flex items-center gap-3 px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent border border-transparent hover:border-border',
          isOpen ? 'text-accent' : 'text-foreground hover:text-accent',
          className
        )}
      >
        <span className="relative overflow-hidden inline-block h-4 leading-4">
          <motion.span
            animate={{ y: isOpen ? -16 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            MENU
          </motion.span>
          <motion.span
            animate={{ y: isOpen ? -16 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="block text-accent"
          >
            CLOSE
          </motion.span>
        </span>

        {/* Minimalist animated toggle icon */}
        <div className="w-4 h-3 flex flex-col justify-between items-end">
          <motion.span
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 5.5 : 0,
              width: isOpen ? '16px' : '16px',
            }}
            transition={{ duration: 0.25 }}
            className="h-[1.5px] bg-current origin-center block"
          />
          <motion.span
            animate={{
              opacity: isOpen ? 0 : 1,
              width: '10px',
            }}
            transition={{ duration: 0.2 }}
            className="h-[1.5px] bg-current block group-hover:w-4 transition-all"
          />
          <motion.span
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -5.5 : 0,
              width: isOpen ? '16px' : '16px',
            }}
            transition={{ duration: 0.25 }}
            className="h-[1.5px] bg-current origin-center block"
          />
        </div>
      </button>
    </Magnetic>
  );
};

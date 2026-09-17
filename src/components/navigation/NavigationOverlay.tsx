import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCursor } from '@/components/cursor/CursorContext';
import { EASING } from '@/animations/presets/motionTokens';

export interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { index: '01', label: 'Overview', path: '/' },
  { index: '02', label: 'Selected Project', path: '/project/sample-project' },
  { index: '03', label: 'System CMS', path: '/admin' },
];

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const { setCursor, resetCursor } = useCursor();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const overlayVariants = {
    closed: {
      clipPath: reducedMotion ? 'none' : 'inset(0% 0% 100% 0%)',
      opacity: reducedMotion ? 0 : 1,
      transition: { duration: 0.4, ease: EASING.editorial },
    },
    open: {
      clipPath: reducedMotion ? 'none' : 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: { duration: 0.6, ease: EASING.editorial },
    },
  };

  const linkVariants = {
    closed: { y: 20, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.15 + i * 0.08,
        duration: 0.5,
        ease: EASING.editorial,
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
          className="fixed inset-0 z-40 bg-background/98 backdrop-blur-md flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b border-border"
        >
          {/* Top header spacer */}
          <div className="flex items-center justify-between pt-4">
            <span className="font-mono text-[10px] tracking-widest text-accent uppercase">
              INDEX // NAVIGATION MATRIX
            </span>
            <span className="font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
              ESC TO CLOSE
            </span>
          </div>

          {/* Nav list */}
          <nav className="my-auto max-w-4xl w-full mx-auto">
            <ul className="space-y-6 sm:space-y-8">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.li
                    key={link.path}
                    custom={i}
                    variants={linkVariants}
                    className="border-b border-border-subtle pb-4 sm:pb-6"
                  >
                    <Link
                      to={link.path}
                      onClick={onClose}
                      onMouseEnter={() => setCursor('interactive')}
                      onMouseLeave={resetCursor}
                      className="group flex items-baseline justify-between w-full"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-8">
                        <span className="font-mono text-xs sm:text-sm text-foreground-muted group-hover:text-accent transition-colors">
                          {link.index}
                        </span>
                        <span className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground group-hover:text-accent transition-colors">
                          {link.label}
                        </span>
                      </div>
                      {isActive && (
                        <span className="font-mono text-[10px] tracking-widest text-accent uppercase border border-accent/40 px-2 py-0.5">
                          CURRENT
                        </span>
                      )}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom metadata */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border-subtle font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
            <span>HENIL PATEL — ARCHITECTURAL PORTFOLIO</span>
            <div className="flex items-center gap-6">
              <span>LAT // 23.0225° N</span>
              <span>LON // 72.5714° E</span>
              <span className="text-accent">PHASE 1</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

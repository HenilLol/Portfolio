import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useCursor } from '@/components/cursor/CursorContext';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { NAVIGATION_ITEMS, NAV_TELEMETRY, type NavItem } from '@/data/navigation';
import { EASING } from '@/animations/presets/motionTokens';
import { Container } from '@/components/ui/layout/Container';

export interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection?: string;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export const NavigationOverlay: React.FC<NavigationOverlayProps> = ({
  isOpen,
  onClose,
  activeSection = 'hero',
  triggerRef,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const { setCursor, resetCursor } = useCursor();
  const { controller, scrollTo } = useLenisScroll();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Return focus to trigger button when closing
  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else {
        document.getElementById('menu-trigger-button')?.focus();
      }
    }, 50);
  }, [onClose, triggerRef]);

  // Keyboard accessibility: ESC to close, and Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const focusableElements = overlay.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Initial focus on first interactive nav item after brief mount
    const timer = setTimeout(() => {
      const firstInteractive = overlayRef.current?.querySelector<HTMLElement>('button, a');
      firstInteractive?.focus();
    }, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, handleClose]);

  // Lock scroll & pause Lenis while overlay is open to avoid jumps
  useEffect(() => {
    if (isOpen) {
      controller?.lenis?.stop();
      document.body.style.overflow = 'hidden';
    } else {
      controller?.lenis?.start();
      document.body.style.overflow = '';
    }

    return () => {
      controller?.lenis?.start();
      document.body.style.overflow = '';
    };
  }, [isOpen, controller]);

  // Navigation action handler
  const handleNavClick = (item: NavItem) => {
    handleClose();

    if (item.type === 'section') {
      const targetHash = item.target; // e.g. '#projects'
      if (location.pathname === '/') {
        // Already on home: smooth scroll to section with header offset
        setTimeout(() => {
          scrollTo(targetHash, { offset: -64, duration: 1.2 });
        }, 150);
      } else {
        // On another route: navigate to home with hash
        navigate(`/${targetHash}`);
      }
    } else {
      // Route navigation
      navigate(item.target);
    }
  };

  // Determine if item is active
  const isItemActive = (item: NavItem) => {
    if (item.type === 'route') {
      return location.pathname === item.target;
    }
    if (location.pathname === '/') {
      const cleanSectionId = item.target.replace('#', '');
      return activeSection === cleanSectionId;
    }
    return false;
  };

  const overlayVariants = {
    closed: {
      clipPath: reducedMotion ? 'none' : 'inset(0% 0% 100% 0%)',
      opacity: reducedMotion ? 0 : 1,
      transition: {
        duration: reducedMotion ? 0.15 : 0.45,
        ease: EASING.editorial,
      },
    },
    open: {
      clipPath: reducedMotion ? 'none' : 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0.15 : 0.6,
        ease: EASING.editorial,
      },
    },
  };

  const itemVariants = {
    closed: {
      y: reducedMotion ? 0 : 28,
      opacity: 0,
    },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: reducedMotion ? 0 : 0.18 + i * 0.07,
        duration: reducedMotion ? 0.15 : 0.5,
        ease: EASING.editorial,
      },
    }),
  };

  const telemetryVariants = {
    closed: { opacity: 0, y: 10 },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: reducedMotion ? 0 : 0.45,
        duration: 0.4,
        ease: EASING.editorial,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          id="site-navigation-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Matrix"
          initial="closed"
          animate="open"
          exit="closed"
          variants={overlayVariants}
          className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col justify-between pt-20 pb-8 sm:pb-12 px-6 sm:px-12 border-b border-border/80 select-none overflow-y-auto"
        >
          {/* Subtle architectural background coordinate lines */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none grid grid-cols-12 max-w-7xl mx-auto px-6 sm:px-12 opacity-15"
          >
            <div className="col-span-1 border-r border-border" />
            <div className="col-span-10 border-r border-border" />
            <div className="col-span-1" />
          </div>

          {/* Top Telemetry Header */}
          <Container size="wide" className="w-full relative z-10">
            <motion.div
              variants={telemetryVariants}
              className="flex items-center justify-between pb-6 border-b border-border/40 font-mono text-[10px] tracking-widest uppercase text-foreground-muted"
            >
              <div className="flex items-center gap-2 text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>INDEX // {NAV_TELEMETRY.systemVersion}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline">
                  COORDS // {NAV_TELEMETRY.coordinates.lat} {NAV_TELEMETRY.coordinates.lon}
                </span>
                <span className="text-foreground-secondary border border-border/60 px-2 py-0.5">
                  {NAV_TELEMETRY.closeKeyHint}
                </span>
              </div>
            </motion.div>
          </Container>

          {/* Core Navigation Items List */}
          <Container size="wide" className="w-full my-auto py-8 relative z-10">
            <nav aria-label="Primary Navigation" className="max-w-4xl">
              <ul className="space-y-4 sm:space-y-6">
                {NAVIGATION_ITEMS.map((item, index) => {
                  const active = isItemActive(item);

                  return (
                    <motion.li
                      key={item.id}
                      custom={index}
                      variants={itemVariants}
                      className="border-b border-border/30 pb-4 sm:pb-5 group"
                    >
                      <button
                        type="button"
                        onClick={() => handleNavClick(item)}
                        onMouseEnter={() => setCursor('interactive')}
                        onMouseLeave={resetCursor}
                        className="w-full text-left flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent group-hover:translate-x-1.5 transition-transform duration-300"
                      >
                        {/* Index & Title */}
                        <div className="flex items-baseline gap-4 sm:gap-8">
                          <span className="font-mono text-xs sm:text-sm text-foreground-muted group-hover:text-accent transition-colors">
                            {item.index}
                          </span>
                          <span
                            className={`font-editorial text-2xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight transition-colors duration-200 ${
                              active
                                ? 'text-accent'
                                : 'text-foreground group-hover:text-foreground-secondary'
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>

                        {/* Telemetry Tag & Description */}
                        <div className="flex items-center gap-4 sm:gap-6 pl-8 sm:pl-0">
                          <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-wider text-foreground-muted">
                            {item.description}
                          </span>

                          {active ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-accent uppercase border border-accent/60 bg-accent/10 px-2 py-0.5">
                              <span className="w-1 h-1 rounded-full bg-accent" />
                              IN VIEW
                            </span>
                          ) : (
                            <span className="font-mono text-[10px] tracking-widest text-foreground-muted/60 group-hover:text-accent uppercase transition-colors">
                              {item.metadata} →
                            </span>
                          )}
                        </div>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </Container>

          {/* Bottom Telemetry Footer */}
          <Container size="wide" className="w-full relative z-10">
            <motion.div
              variants={telemetryVariants}
              className="pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-foreground-muted"
            >
              <div className="flex items-center gap-3">
                <span className="text-foreground">HENIL PATEL</span>
                <span className="text-border">/</span>
                <span>CREATIVE TECHNOLOGIST & ARCHITECT</span>
              </div>
              <div className="flex items-center gap-4">
                <span>STATUS: {NAV_TELEMETRY.status}</span>
                <span className="text-accent hidden sm:inline">●</span>
                <span className="hidden sm:inline">RESTRICTED TO REAL ROUTES</span>
              </div>
            </motion.div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

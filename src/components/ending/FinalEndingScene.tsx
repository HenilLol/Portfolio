import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { Button } from '@/components/ui/Button';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { ENDING_CONTENT } from '@/data/contactContent';
import { soundEngine } from '@/lib/sound';

interface FinalEndingSceneProps {
  onRestartExperience?: () => void;
}

export const FinalEndingScene: React.FC<FinalEndingSceneProps> = ({ onRestartExperience }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10% 0px -10% 0px' });
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useLenisScroll();
  const [isCollapsing, setIsCollapsing] = React.useState(false);

  const handleReturnToTop = () => {
    scrollTo('#hero', { offset: 0, duration: 1.4 });
  };

  const handleExploreWork = () => {
    scrollTo('#projects', { offset: -64, duration: 1.2 });
  };

  const handleRestart = () => {
    soundEngine.playReboot();

    if (reducedMotion) {
      if (onRestartExperience) onRestartExperience();
      else {
        sessionStorage.removeItem('hp_intro_completed');
        window.scrollTo(0, 0);
        window.location.reload();
      }
      return;
    }

    // Initiate visual collapse loop
    setIsCollapsing(true);
    setTimeout(() => {
      if (onRestartExperience) {
        onRestartExperience();
      } else {
        sessionStorage.removeItem('hp_intro_completed');
        window.scrollTo(0, 0);
        scrollTo(0, { immediate: true });
        window.location.reload();
      }
      setTimeout(() => setIsCollapsing(false), 500);
    }, 1100);
  };

  return (
    <footer
      id="ending"
      ref={containerRef}
      className={`relative w-full pt-20 sm:pt-32 pb-12 sm:pb-16 border-t border-border/80 bg-[#050507] text-foreground overflow-hidden select-none transition-all duration-1000 ${
        isCollapsing ? 'opacity-0 scale-95 filter blur-sm pointer-events-none' : 'opacity-100 scale-100'
      }`}
      data-section="ending"
      role="contentinfo"
      aria-label="Portfolio Ending Sequence"
    >
      {/* Background Precision Grid */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="ending-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ending-grid)" />
      </svg>

      {/* Horizontal Scanning Signal Line */}
      <motion.div
        initial={reducedMotion ? false : { scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent origin-center pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Top Session Telemetry Bar — Non-operational presentational metaphor */}
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] sm:text-xs tracking-widest text-foreground-muted uppercase pb-6 border-b border-border/40">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-foreground font-medium">{ENDING_CONTENT.signalHeader}</span>
            <span className="text-border">/</span>
            <span className="text-accent">{ENDING_CONTENT.completionBadge}</span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-foreground-secondary">{ENDING_CONTENT.sessionState}</span>
            <span className="text-border hidden sm:inline-block">/</span>
            <span className="hidden sm:inline-block">{ENDING_CONTENT.timezone}</span>
          </div>
        </div>

        {/* Central Monumental Identity Typography */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-xs sm:text-sm text-accent tracking-widest uppercase block mb-3">
              {ENDING_CONTENT.discipline}
            </span>

            <DisplayText
              as="h2"
              size="2xl"
              className="font-bold tracking-tightest leading-[0.88] uppercase text-foreground"
            >
              {ENDING_CONTENT.name}
            </DisplayText>
          </motion.div>

          <motion.p
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-foreground-secondary text-sm sm:text-base font-normal max-w-xl mx-auto leading-relaxed"
          >
            {ENDING_CONTENT.tagline}
          </motion.p>
        </div>

        {/* Cinematic Final Actions */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4"
        >
          {/* Primary Action: Return to Top */}
          <InteractiveCursorTarget cursorType="interactive" cursorLabel="TOP" className="w-full sm:w-auto">
            <Button
              variant="magnetic"
              onClick={handleReturnToTop}
              className="w-full sm:w-auto tracking-widest text-xs uppercase px-8 py-3.5 justify-center min-h-[44px]"
            >
              {ENDING_CONTENT.actions.returnTop}
            </Button>
          </InteractiveCursorTarget>

          {/* Secondary Action: Restart Experience */}
          <InteractiveCursorTarget cursorType="interactive" cursorLabel="RESTART" className="w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleRestart}
              className="w-full sm:w-auto tracking-widest text-xs uppercase px-8 py-3.5 justify-center min-h-[44px]"
            >
              {ENDING_CONTENT.actions.restart}
            </Button>
          </InteractiveCursorTarget>

          {/* Tertiary Action: Explore Work */}
          <InteractiveCursorTarget cursorType="interactive" cursorLabel="WORKS" className="w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleExploreWork}
              className="w-full sm:w-auto tracking-widest text-xs uppercase px-8 py-3.5 justify-center text-foreground-muted hover:text-foreground min-h-[44px]"
            >
              {ENDING_CONTENT.actions.exploreWork}
            </Button>
          </InteractiveCursorTarget>
        </motion.div>

        {/* Minimal Technical Footer Row — Dynamic Current Year, No Exact Coordinates */}
        <div className="pt-12 sm:pt-16 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-foreground-muted text-center sm:text-left">
          <div>
            <span>{ENDING_CONTENT.copyright}</span>
            <span className="mx-2 text-border">•</span>
            <span className="text-foreground-secondary">{ENDING_CONTENT.location}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
            <a
              href="https://github.com/HenilLol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors py-1 min-h-[36px] flex items-center"
            >
              GITHUB
            </a>
            <Link to="/project/heneoxy" className="hover:text-accent transition-colors py-1 min-h-[36px] flex items-center">
              HENEOXY
            </Link>
            <Link to="/creative" className="hover:text-accent transition-colors py-1 min-h-[36px] flex items-center">
              CREATIVE LAB
            </Link>
            <Link to="/admin" className="text-border hover:text-foreground-muted transition-colors py-1 min-h-[36px] flex items-center">
              SYSTEM CONSOLE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HENEOXY_CONTENT } from '@/data/heneoxyContent';
import { EASING } from '@/animations/presets/motionTokens';

export interface HeneoxyBootProps {
  onComplete: () => void;
}

export const HeneoxyBoot: React.FC<HeneoxyBootProps> = ({ onComplete }) => {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number>(0);

  useEffect(() => {
    // If reduced motion is active or boot has already run in current session, skip immediately
    const hasBooted = sessionStorage.getItem('hp_heneoxy_boot_completed');
    if (reducedMotion || hasBooted === 'true') {
      setVisible(false);
      onComplete();
      return;
    }

    // Step through the boot sequence lines
    const totalSteps = HENEOXY_CONTENT.bootSequence.length;
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      setCompletedSteps(current);

      if (current >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          sessionStorage.setItem('hp_heneoxy_boot_completed', 'true');
          setVisible(false);
          onComplete();
        }, 350);
      }
    }, 180);

    const handleSkip = () => {
      clearInterval(interval);
      sessionStorage.setItem('hp_heneoxy_boot_completed', 'true');
      setVisible(false);
      onComplete();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Escape', ' ', 'Enter'].includes(e.key)) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reducedMotion, onComplete]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="status"
        aria-label="HENEOXY System Initialization"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: EASING.editorial } }}
        className="fixed inset-0 z-50 bg-background text-foreground flex flex-col justify-between p-4 sm:p-12 lg:p-16 select-none cursor-pointer"
        onClick={() => {
          sessionStorage.setItem('hp_heneoxy_boot_completed', 'true');
          setVisible(false);
          onComplete();
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
          <div className="flex items-center gap-2 text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>HENEOXY // SYSTEM BOOT</span>
          </div>
          <span>[TAP ANYWHERE OR PRESS ESC TO SKIP]</span>
        </div>

        {/* Central Boot Sequence */}
        <div className="max-w-2xl mx-auto w-full my-auto space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-xs text-accent tracking-widest uppercase block">
              SYSTEM INITIALIZATION PROTOCOL
            </span>
            <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-foreground">
              HENEOXY
            </h1>
            <p className="font-mono text-[11px] text-foreground-secondary uppercase tracking-widest">
              AI-POWERED PERSONAL COMPUTING ENVIRONMENT
            </p>
          </div>

          <div className="p-4 sm:p-6 border border-border/80 bg-background-surface/80 space-y-2.5 font-mono text-xs">
            {HENEOXY_CONTENT.bootSequence.map((seq, idx) => {
              const isVisible = idx <= completedSteps;
              const isLatest = idx === completedSteps;

              return (
                <div
                  key={seq.subsystem}
                  className={`flex items-center justify-between transition-opacity duration-150 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-foreground-muted text-[10px]">0{idx + 1}</span>
                    <span className="text-foreground font-semibold tracking-wider">
                      {seq.subsystem}
                    </span>
                    <span className="text-border hidden sm:inline">................</span>
                    <span className="text-foreground-secondary text-[11px] hidden sm:inline">
                      {seq.label}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${
                      seq.status === 'READY'
                        ? 'border-accent/60 text-accent bg-accent/10'
                        : seq.status === 'PRINCIPLE'
                        ? 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                        : 'border-border text-foreground-muted bg-background'
                    }`}
                  >
                    {isLatest && idx < HENEOXY_CONTENT.bootSequence.length - 1 ? (
                      <span className="animate-pulse">LOADING</span>
                    ) : (
                      seq.status
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status */}
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
          <span>MODE // RESEARCH + ENGINEERING</span>
          <span className="text-accent">FLAGSHIP BLUEPRINT</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

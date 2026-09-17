import React from 'react';

export const EndingSection: React.FC = () => {
  return (
    <footer id="ending" className="py-12 border-t border-border-subtle" data-section="ending">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-foreground-muted">
        <span>HENIL PATEL — 2024</span>
        <span className="text-[10px] tracking-widest text-accent uppercase">
          Engineered with React / Vite / GSAP / Lenis / Three.js
        </span>
      </div>
    </footer>
  );
};

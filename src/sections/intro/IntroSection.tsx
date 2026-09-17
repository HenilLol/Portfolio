import React from 'react';

export const IntroSection: React.FC = () => {
  return (
    <section id="intro" className="py-8 border-b border-border-subtle" data-section="intro">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-foreground-muted tracking-widest uppercase">01 / Intro Sequence</span>
        <span className="font-mono text-[10px] text-accent tracking-widest uppercase">[Phase 0 Architecture Ready]</span>
      </div>
    </section>
  );
};

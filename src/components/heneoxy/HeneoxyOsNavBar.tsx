import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLenisScroll } from '@/hooks/useLenisScroll';

interface SubsystemTab {
  id: string;
  label: string;
  targetId: string;
  code: string;
}

const SUBSYSTEMS: SubsystemTab[] = [
  { id: 'system', label: 'SYSTEM', targetId: '#architecture', code: '01' },
  { id: 'agents', label: 'AGENTS', targetId: '#system-flow', code: '02' },
  { id: 'memory', label: 'MEMORY', targetId: '#knowledge-research', code: '03' },
  { id: 'context', label: 'CONTEXT', targetId: '#paradigm', code: '04' },
  { id: 'tools', label: 'TOOLS', targetId: '#technology-stack', code: '05' },
  { id: 'security', label: 'SECURITY', targetId: '#knowledge-research', code: '06' },
  { id: 'roadmap', label: 'ROADMAP', targetId: '#benchmark', code: '07' },
];

export const HeneoxyOsNavBar: React.FC = () => {
  const { scrollTo } = useLenisScroll();
  const [activeTab, setActiveTab] = useState<string>('system');

  const handleNavigate = (subsystem: SubsystemTab) => {
    setActiveTab(subsystem.id);
    scrollTo(subsystem.targetId, { offset: -90, duration: 1.2 });
  };

  return (
    <header
      className="sticky top-0 z-40 w-full bg-[#05070B]/95 backdrop-blur-md border-b border-accent/30 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-wider select-none shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
      role="banner"
      aria-label="HENEOXY OS Navigation"
    >
      {/* Left: OS Moniker & Status Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-accent/40 bg-accent/10 text-accent font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>HENEOXY OS</span>
          <span className="opacity-60 text-[9px]">v0.9</span>
        </div>
        <span className="text-border hidden md:inline">|</span>
        <span className="text-foreground-muted hidden md:inline uppercase text-[9px]">
          LOCAL AGENTIC ENVIRONMENT
        </span>
      </div>

      {/* Center: Subsystem Navigation Tabs */}
      <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none" aria-label="Subsystem Selector">
        {SUBSYSTEMS.map((sub) => {
          const isActive = activeTab === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => handleNavigate(sub)}
              className={`px-2.5 py-1 rounded transition-all cursor-pointer uppercase text-[9px] sm:text-[10px] whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-accent text-background font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-white/5'
              }`}
            >
              <span className="opacity-50 text-[8px]">{sub.code}</span>
              <span>{sub.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Exit OS and Telemetry */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 text-foreground-muted text-[9px]">
          <span className="text-accent">●</span>
          <span>RPC SANDBOX ACTIVE</span>
        </div>
        <Link
          to="/#projects"
          className="px-2.5 py-1 border border-border/80 hover:border-accent text-foreground-secondary hover:text-accent transition-colors uppercase text-[9px] sm:text-[10px] flex items-center gap-1 cursor-pointer"
        >
          <span>✕</span>
          <span>EXIT OS</span>
        </Link>
      </div>
    </header>
  );
};

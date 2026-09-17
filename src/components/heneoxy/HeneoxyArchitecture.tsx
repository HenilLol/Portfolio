import React, { useState } from 'react';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCursor } from '@/components/cursor/CursorContext';
import {
  HENEOXY_CONTENT,
  type ArchitectureLayer,
  type SubsystemStatus,
} from '@/data/heneoxyContent';

export const HeneoxyArchitecture: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<ArchitectureLayer>(
    HENEOXY_CONTENT.architectureLayers[0]
  );
  const { setCursor, resetCursor } = useCursor();

  const layers = HENEOXY_CONTENT.architectureLayers;

  const statusVariants: Record<SubsystemStatus, { border: string; text: string; bg: string }> = {
    READY: { border: 'border-accent', text: 'text-accent', bg: 'bg-accent/10' },
    IMPLEMENTED: { border: 'border-accent', text: 'text-accent', bg: 'bg-accent/10' },
    'IN DEVELOPMENT': { border: 'border-blue-400', text: 'text-blue-400', bg: 'bg-blue-500/10' },
    RESEARCH: { border: 'border-purple-400', text: 'text-purple-400', bg: 'bg-purple-500/10' },
    EXPLORING: { border: 'border-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
    PRINCIPLE: { border: 'border-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  };

  return (
    <section id="architecture" className="py-16 sm:py-24 border-t border-border/40 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <TechnicalLabel indicator indicatorColor="accent">
            SYSTEM BLUEPRINT // FIVE-LAYER ARCHITECTURE
          </TechnicalLabel>
          <h3 className="font-editorial text-2xl sm:text-4xl font-bold uppercase tracking-tight text-foreground">
            Proposed Architecture Layers
          </h3>
        </div>
        <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest">
          INTERACTIVE ARCHITECTURAL INSPECTOR
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 5 Interactive Architecture Layers Stack */}
        <div className="lg:col-span-7 space-y-3">
          {layers.map((layer) => {
            const isActive = activeLayer.id === layer.id;
            const isConnected =
              activeLayer.connections.includes(layer.id) ||
              layer.connections.includes(activeLayer.id);
            const isDimmed = !isActive && !isConnected;
            const badge = statusVariants[layer.status];

            return (
              <button
                key={layer.id}
                type="button"
                id={`layer-${layer.id}`}
                onClick={() => setActiveLayer(layer)}
                onMouseEnter={() => {
                  setActiveLayer(layer);
                  setCursor('interactive');
                }}
                onMouseLeave={resetCursor}
                className={`w-full text-left p-4 sm:p-6 border transition-all duration-300 cursor-pointer block select-none ${
                  isActive
                    ? 'border-accent bg-background-surface/90 shadow-[0_0_16px_rgba(0,240,255,0.15)] z-20 scale-[1.01]'
                    : isConnected
                    ? 'border-accent/50 bg-background-surface/50 opacity-90'
                    : isDimmed
                    ? 'border-border/30 bg-background-surface/20 opacity-40'
                    : 'border-border/70 bg-background-surface/40 hover:border-accent/40'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-border/20 font-mono text-[10px] uppercase tracking-widest text-foreground-muted">
                  <span>LAYER // {layer.index}</span>
                  <span
                    className={`px-1.5 py-0.5 border text-[9px] ${badge.border} ${badge.text} ${badge.bg}`}
                  >
                    {layer.status}
                  </span>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h4 className="font-editorial text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground">
                    {layer.name}
                  </h4>
                  <span className="font-mono text-xs text-foreground-secondary uppercase">
                    {layer.category}
                  </span>
                </div>

                <p className="font-sans text-xs text-foreground-secondary pt-2 line-clamp-2">
                  {layer.role}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right: Architecture Inspector HUD */}
        <div className="lg:col-span-5 sticky top-24">
          <Card className="p-4 sm:p-8 border-border/80 bg-background-surface/80 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/40 font-mono text-[10px] uppercase tracking-widest">
              <span className="text-accent">INSPECTING // LAYER-{activeLayer.index}</span>
              <Badge
                variant={
                  activeLayer.status === 'READY' || activeLayer.status === 'IMPLEMENTED'
                    ? 'accent'
                    : activeLayer.status === 'IN DEVELOPMENT'
                    ? 'default'
                    : 'outline'
                }
                className="text-[9px] uppercase"
              >
                {activeLayer.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block">
                {activeLayer.category}
              </span>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold uppercase text-foreground">
                {activeLayer.name}
              </h4>
            </div>

            <div className="space-y-2">
              <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block">
                ARCHITECTURAL ROLE
              </span>
              <p className="font-sans text-xs sm:text-sm text-foreground-secondary leading-relaxed">
                {activeLayer.description}
              </p>
            </div>

            {/* Core Capabilities */}
            <div className="space-y-2 pt-4 border-t border-border/30">
              <span className="font-mono text-[10px] text-foreground-muted uppercase tracking-widest block">
                CAPABILITIES & BOUNDARIES
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeLayer.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2.5 py-1 text-[11px] font-mono border border-border bg-background text-foreground tracking-wider uppercase"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Active Connections */}
            <div className="space-y-2 pt-4 border-t border-border/30 font-mono text-[10px] text-foreground-muted uppercase tracking-wider">
              <span>CONNECTED LAYERS:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {activeLayer.connections.map((connId) => {
                  const target = layers.find((l) => l.id === connId);
                  if (!target) return null;
                  return (
                    <button
                      key={connId}
                      type="button"
                      onClick={() => setActiveLayer(target)}
                      className="px-3 py-1.5 border border-border bg-background hover:border-accent hover:text-accent transition-colors text-foreground-secondary cursor-pointer min-h-[36px] flex items-center"
                    >
                      {target.name} →
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

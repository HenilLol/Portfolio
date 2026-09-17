import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { InteractiveCursorTarget } from '@/components/cursor/InteractiveCursorTarget';
import { CONTACT_CONTENT, type ContactChannel } from '@/data/contactContent';

export const ContactConnectionMatrix: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="font-mono text-xs text-accent tracking-widest uppercase flex items-center justify-between pb-3 border-b border-border/60">
        <span>COMMUNICATION CHANNELS</span>
        <span className="text-foreground-muted">TRANSMISSION // SPEC 08</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {CONTACT_CONTENT.channels.map((channel: ContactChannel) => {
          const isPending = channel.isPending;

          const content = (
            <Card
              className={`p-4 sm:p-6 bg-background-surface border-border/80 transition-all duration-300 relative group overflow-hidden ${
                isPending
                  ? 'opacity-70 cursor-not-allowed select-none'
                  : 'hover:border-accent/60 hover:bg-background-elevated/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-foreground-muted uppercase">
                  <span className="text-accent">// {channel.specIndex}</span>
                  <span>{channel.label}</span>
                </div>

                <Badge
                  variant={channel.badge === 'PRIMARY' || channel.badge === 'VERIFIED' ? 'accent' : 'outline'}
                  className="text-[9px] uppercase tracking-widest font-mono"
                >
                  {channel.badge}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="font-editorial text-base sm:text-lg font-semibold uppercase text-foreground tracking-tight group-hover:text-accent transition-colors break-words">
                  {channel.value}
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest shrink-0">
                  {isPending && (
                    <span className="text-foreground-muted text-[10px]">
                      [NOT CONFIGURED]
                    </span>
                  )}

                  <span className="text-foreground-secondary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{channel.actionText}</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Card>
          );

          if (isPending) {
            return (
              <div key={channel.id} title="Channel pending configuration">
                {content}
              </div>
            );
          }

          return (
            <InteractiveCursorTarget
              key={channel.id}
              cursorType="interactive"
              cursorLabel="VISIT"
            >
              <a
                href={channel.href}
                target={channel.isExternal ? '_blank' : undefined}
                rel={channel.isExternal ? 'noopener noreferrer' : undefined}
                className="block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
              >
                {content}
              </a>
            </InteractiveCursorTarget>
          );
        })}
      </div>

      {/* Telemetry Footer with No Exact Coordinates */}
      <div className="p-4 bg-background-surface border border-border/60 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] sm:text-xs tracking-widest uppercase text-foreground-muted">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>{CONTACT_CONTENT.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{CONTACT_CONTENT.timezone}</span>
        </div>
      </div>
    </div>
  );
};

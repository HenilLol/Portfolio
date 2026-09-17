import React from 'react';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { Badge } from '@/components/ui/Badge';
import { CREATIVE_TOOLS } from '@/data/creativeContent';

export const CreativeToolsMatrix: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 border-b border-border/80">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <TechnicalLabel indicator indicatorColor="accent" className="mb-3">
              INSTRUMENTATION // SOFTWARE MATRIX
            </TechnicalLabel>
            <DisplayText as="h2" size="xl">
              Creative Software & Tooling
            </DisplayText>
          </div>
          <p className="text-foreground-secondary text-xs sm:text-sm font-mono uppercase tracking-widest max-w-sm">
            Disciplined evaluation of creative tools. Zero fabricated skill percentages or progress bars.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="border border-border/80 bg-background-surface divide-y divide-border/60">
          {CREATIVE_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-background-elevated/40 transition-colors"
            >
              <div className="flex items-start md:items-center gap-4">
                <span className="font-mono text-xs text-accent tracking-widest uppercase w-12">
                  // {tool.specIndex}
                </span>
                <div>
                  <h3 className="font-editorial text-base sm:text-lg font-semibold uppercase text-foreground tracking-wide">
                    {tool.name}
                  </h3>
                  <p className="font-mono text-xs text-foreground-muted uppercase tracking-wider">
                    {tool.discipline}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 ml-16 md:ml-0">
                <p className="text-foreground-secondary text-xs sm:text-sm font-normal max-w-md">
                  {tool.role}
                </p>
                <div className="self-start md:self-auto">
                  <Badge
                    variant={tool.status === 'CORE PRACTICE' ? 'accent' : 'outline'}
                    className="text-[10px] uppercase font-mono tracking-widest"
                  >
                    {tool.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  type TechNode,
  SKILL_CLUSTERS,
  TECH_NODES,
} from '@/data/skillsContent';

export interface SkillGraphInspectorProps {
  activeNode: TechNode | null;
  onSelectNode: (node: TechNode) => void;
  className?: string;
}

export const SkillGraphInspector: React.FC<SkillGraphInspectorProps> = ({
  activeNode,
  onSelectNode,
  className = '',
}) => {
  // Find connected nodes
  const connectedNodes = activeNode
    ? TECH_NODES.filter((n) => activeNode.connections.includes(n.id))
    : [];

  return (
    <Card className={`p-6 border-border/80 bg-background-surface/80 backdrop-blur-md flex flex-col justify-between ${className}`}>
      {activeNode ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 pb-4 border-b border-border/40">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                INSPECTING // NODE-{activeNode.id.toUpperCase()}
              </span>
              <Badge
                variant={
                  activeNode.status === 'USING'
                    ? 'accent'
                    : activeNode.status === 'LEARNING'
                    ? 'default'
                    : 'outline'
                }
                className="text-[9px] uppercase tracking-wider"
              >
                {activeNode.status}
              </Badge>
            </div>

            <h4 className="font-editorial text-2xl font-bold uppercase tracking-tight text-foreground">
              {activeNode.name}
            </h4>
            <span className="font-mono text-xs text-foreground-muted block">
              CLUSTER: {SKILL_CLUSTERS[activeNode.cluster].name}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase block">
              ROLE & APPLICATION
            </span>
            <p className="font-sans text-xs sm:text-sm text-foreground-secondary leading-relaxed">
              {activeNode.description}
            </p>
          </div>

          {/* Connected Technologies */}
          <div className="space-y-3 pt-4 border-t border-border/40">
            <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase block">
              RELATIONAL CONNECTIONS ({connectedNodes.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {connectedNodes.map((conn) => (
                <button
                  key={conn.id}
                  type="button"
                  onClick={() => onSelectNode(conn)}
                  className="px-2.5 py-1 text-[11px] font-mono border border-border bg-background hover:border-accent hover:text-accent transition-colors uppercase tracking-wider cursor-pointer"
                >
                  {conn.name} →
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2 pb-4 border-b border-border/40">
            <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
              STATUS // TELEMETRY MAP READY
            </span>
            <h4 className="font-editorial text-xl font-bold uppercase tracking-tight text-foreground">
              Interactive Systems Graph
            </h4>
            <p className="font-sans text-xs text-foreground-secondary leading-relaxed">
              Hover or select any node in the map to inspect its implementation role, learning state, and relational connections.
            </p>
          </div>

          {/* Clusters Guide */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-foreground-muted tracking-widest uppercase block">
              SYSTEM CLUSTERS
            </span>
            <div className="space-y-2">
              {Object.values(SKILL_CLUSTERS).map((cluster) => (
                <div key={cluster.id} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: cluster.color }}
                    />
                    <span className="text-foreground font-medium">{cluster.name}</span>
                  </div>
                  <span className="text-foreground-muted text-[10px] hidden sm:inline-block">
                    {cluster.tagline}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Honest Metric Legend */}
          <div className="pt-4 border-t border-border/40 font-mono text-[10px] text-foreground-muted space-y-1">
            <div className="flex justify-between">
              <span>● USING: Actively in production</span>
              <span className="text-accent">6 TOOLS</span>
            </div>
            <div className="flex justify-between">
              <span>● LEARNING: Expanding capability</span>
              <span className="text-blue-400">3 TOOLS</span>
            </div>
            <div className="flex justify-between">
              <span>● EXPLORING: Evaluating & studying</span>
              <span className="text-purple-400">4 TOOLS</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

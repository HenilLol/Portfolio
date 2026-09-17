import React, { useState, useMemo } from 'react';
import { Section } from '@/components/ui/layout/Section';
import { Container } from '@/components/ui/layout/Container';
import { TechnicalLabel } from '@/components/ui/typography/TechnicalLabel';
import { DisplayText } from '@/components/ui/typography/DisplayText';
import { SkillGraphNode } from './SkillGraphNode';
import { SkillGraphInspector } from './SkillGraphInspector';
import {
  TECH_NODES,
  SKILL_CLUSTERS,
  type TechNode,
  type SkillCluster,
} from '@/data/skillsContent';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const SkillsSection: React.FC = () => {
  const [activeNode, setActiveNode] = useState<TechNode | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<SkillCluster | 'ALL'>('ALL');
  const reducedMotion = useReducedMotion();

  // Filter nodes if cluster selected
  const filteredNodes = useMemo(() => {
    if (selectedCluster === 'ALL') return TECH_NODES;
    return TECH_NODES.filter((n) => n.cluster === selectedCluster);
  }, [selectedCluster]);

  // Compute unique edges for SVG lines
  const uniqueEdges = useMemo(() => {
    const edgeMap = new Map<string, { from: TechNode; to: TechNode }>();

    TECH_NODES.forEach((fromNode) => {
      fromNode.connections.forEach((targetId) => {
        const toNode = TECH_NODES.find((n) => n.id === targetId);
        if (toNode) {
          const key = [fromNode.id, toNode.id].sort().join('--');
          if (!edgeMap.has(key)) {
            edgeMap.set(key, { from: fromNode, to: toNode });
          }
        }
      });
    });

    return Array.from(edgeMap.values());
  }, []);

  return (
    <Section
      id="skills"
      index="04"
      label="Technology Map & Systems"
      contained={false}
      className="py-20 sm:py-28 lg:py-36 border-b border-border/60"
    >
      <Container size="wide" className="space-y-12">
        {/* Header & Philosophy */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-3 max-w-2xl">
            <TechnicalLabel indicator indicatorColor="accent">
              LIVING TECHNICAL TOPOLOGY // NON-STATIC ARCHITECTURE
            </TechnicalLabel>
            <DisplayText as="h2" size="lg" className="text-foreground uppercase font-bold tracking-tight">
              Technology Map & Tools
            </DisplayText>
            <p className="text-foreground-secondary text-sm sm:text-base leading-relaxed">
              A relational blueprint of tools and runtimes. Rather than arbitrary percentage ratings, technologies are structured by application cluster and honest learning states.
            </p>
          </div>

          {/* Cluster Filter Buttons */}
          <div className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setSelectedCluster('ALL')}
              className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                selectedCluster === 'ALL'
                  ? 'border-accent text-accent bg-accent/10'
                  : 'border-border text-foreground-secondary hover:border-accent/40'
              }`}
            >
              ALL CLUSTERS
            </button>
            {Object.values(SKILL_CLUSTERS).map((cluster) => (
              <button
                key={cluster.id}
                type="button"
                onClick={() => setSelectedCluster(cluster.id)}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  selectedCluster === cluster.id
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border text-foreground-secondary hover:border-accent/40'
                }`}
              >
                {cluster.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop View: Spatial Graph Layout (>=1024px) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
          {/* SVG + DOM Spatial Canvas */}
          <div className="col-span-8 relative h-[620px] border border-border/70 bg-background-surface/40 p-6 overflow-hidden select-none">
            {/* Background Grid Guide Lines */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none grid grid-cols-4 grid-rows-4 opacity-10"
            >
              <div className="border-r border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-r border-b border-border" />
              <div className="border-b border-border" />
            </div>

            {/* Directional Cluster Labels */}
            <div aria-hidden="true" className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-accent/60">
              ▲ AI / INTELLIGENCE
            </div>
            <div aria-hidden="true" className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-foreground-muted">
              ▼ SYSTEMS & PIPELINES
            </div>
            <div aria-hidden="true" className="absolute top-1/2 left-4 -translate-y-1/2 -rotate-90 font-mono text-[9px] uppercase tracking-widest text-foreground-muted origin-center">
              ◄ WEB PLATFORM
            </div>
            <div aria-hidden="true" className="absolute top-1/2 right-4 -translate-y-1/2 rotate-90 font-mono text-[9px] uppercase tracking-widest text-foreground-muted origin-center">
              CREATIVE TECH ►
            </div>

            {/* SVG Relational Connection Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {uniqueEdges.map(({ from, to }) => {
                const isEdgeActive =
                  activeNode &&
                  (activeNode.id === from.id || activeNode.id === to.id);

                const isEdgeConnected =
                  !activeNode ||
                  (activeNode.connections.includes(from.id) &&
                    activeNode.connections.includes(to.id));

                return (
                  <line
                    key={`${from.id}--${to.id}`}
                    x1={`${from.coords.x}%`}
                    y1={`${from.coords.y}%`}
                    x2={`${to.coords.x}%`}
                    y2={`${to.coords.y}%`}
                    stroke={
                      isEdgeActive
                        ? '#00F0FF'
                        : isEdgeConnected
                        ? 'rgba(244, 244, 246, 0.2)'
                        : 'rgba(244, 244, 246, 0.06)'
                    }
                    strokeWidth={isEdgeActive ? 1.5 : 1}
                    strokeDasharray={isEdgeActive ? undefined : '3,3'}
                    className={reducedMotion ? '' : 'transition-all duration-300'}
                  />
                );
              })}
            </svg>

            {/* DOM Positioned Technology Nodes */}
            {TECH_NODES.map((node) => {
              const isActive = activeNode?.id === node.id;
              const isConnected =
                activeNode !== null && activeNode.connections.includes(node.id);
              const isDimmed =
                activeNode !== null && !isActive && !isConnected;

              // If cluster filter is active and this node is not in cluster, dim it
              const isClusterExcluded =
                selectedCluster !== 'ALL' && node.cluster !== selectedCluster;

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: `${node.coords.x}%`,
                    top: `${node.coords.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <SkillGraphNode
                    node={node}
                    isActive={isActive}
                    isConnected={isConnected}
                    isDimmed={isDimmed || isClusterExcluded}
                    onHover={setActiveNode}
                    onClick={setActiveNode}
                  />
                </div>
              );
            })}
          </div>

          {/* Desktop HUD Inspector Pane */}
          <div className="col-span-4 sticky top-24">
            <SkillGraphInspector
              activeNode={activeNode}
              onSelectNode={setActiveNode}
            />
          </div>
        </div>

        {/* Mobile & Tablet Responsive View (<1024px) */}
        <div className="lg:hidden space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNodes.map((node) => {
              const isActive = activeNode?.id === node.id;
              const isConnected =
                activeNode !== null && activeNode.connections.includes(node.id);
              const isDimmed =
                activeNode !== null && !isActive && !isConnected;

              return (
                <SkillGraphNode
                  key={node.id}
                  node={node}
                  isActive={isActive}
                  isConnected={isConnected}
                  isDimmed={isDimmed}
                  onHover={setActiveNode}
                  onClick={(n) => {
                    setActiveNode((prev) => (prev?.id === n.id ? null : n));
                  }}
                  className="w-full max-w-none"
                />
              );
            })}
          </div>

          {/* Mobile Inspection Card */}
          <SkillGraphInspector
            activeNode={activeNode}
            onSelectNode={setActiveNode}
            className="w-full"
          />
        </div>
      </Container>
    </Section>
  );
};

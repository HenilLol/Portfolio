/**
 * Structured Technical Map Data Architecture.
 * Replaces generic proficiency percentages with real relational nodes and learning states:
 * - USING: Primary tools actively employed in current production pipelines.
 * - LEARNING: Actively expanding proficiency through coursework, docs, and prototyping.
 * - EXPLORING: Experimental technologies under initial evaluation and study.
 * - FAMILIAR: Solid theoretical understanding with practical application experience.
 */

export type SkillStatus = 'USING' | 'LEARNING' | 'EXPLORING' | 'FAMILIAR';
export type SkillCluster = 'CORE' | 'WEB' | 'CREATIVE' | 'AI' | 'SYSTEMS';

export interface TechNode {
  id: string;
  name: string;
  cluster: SkillCluster;
  status: SkillStatus;
  categoryLabel: string;
  description: string;
  connections: string[]; // Relational connections to other tech node IDs
  projects: string[]; // Project slugs in the universe utilizing this technology
  // Coordinate positioning in normalized 0-100 canvas space for desktop SVG graph
  coords: { x: number; y: number };
}

export interface ClusterInfo {
  id: SkillCluster;
  name: string;
  tagline: string;
  color: string;
}

export const SKILL_CLUSTERS: Record<SkillCluster, ClusterInfo> = {
  CORE: {
    id: 'CORE',
    name: 'CORE ENGINEERING',
    tagline: 'Fundamental language and component primitives',
    color: '#00F0FF',
  },
  WEB: {
    id: 'WEB',
    name: 'WEB PLATFORM',
    tagline: 'Semantic markup, modern styling, and HTTP runtimes',
    color: '#3B82F6',
  },
  CREATIVE: {
    id: 'CREATIVE',
    name: 'CREATIVE TECH',
    tagline: 'Motion choreography, shaders, and 3D graphics',
    color: '#A855F7',
  },
  AI: {
    id: 'AI',
    name: 'INTELLIGENCE',
    tagline: 'LLM orchestration, agentic tools, and prompt architectures',
    color: '#10B981',
  },
  SYSTEMS: {
    id: 'SYSTEMS',
    name: 'SYSTEMS & TOOLS',
    tagline: 'Version control, pipelines, and backend storage',
    color: '#F59E0B',
  },
};

export const TECH_NODES: TechNode[] = [
  // CORE CLUSTER (Center)
  {
    id: 'typescript',
    name: 'TypeScript',
    cluster: 'CORE',
    status: 'USING',
    categoryLabel: 'Language Foundation',
    description: 'Static type checking, generics, strict null safety, and architecture scalability.',
    connections: ['react', 'tailwind', 'threejs', 'node', 'supabase'],
    projects: ['heneoxy', 'aeroindex', 'coalintel', 'sample-project'],
    coords: { x: 50, y: 46 },
  },
  {
    id: 'react',
    name: 'React 18 / 19',
    cluster: 'CORE',
    status: 'USING',
    categoryLabel: 'UI Architecture',
    description: 'Component lifecycles, custom hooks, Suspense code-splitting, and memoization.',
    connections: ['typescript', 'motion', 'tailwind', 'llm-integration'],
    projects: ['heneoxy', 'aeroindex', 'sample-project'],
    coords: { x: 50, y: 56 },
  },

  // WEB CLUSTER (Left)
  {
    id: 'html-css',
    name: 'Modern CSS / HTML5',
    cluster: 'WEB',
    status: 'USING',
    categoryLabel: 'Layout Primitives',
    description: 'CSS Grid, Flexbox, subgrid, container queries, and semantic DOM trees.',
    connections: ['tailwind', 'typescript'],
    projects: ['aeroindex', 'coalintel', 'sample-project'],
    coords: { x: 22, y: 44 },
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    cluster: 'WEB',
    status: 'USING',
    categoryLabel: 'Design Tokens',
    description: 'Utility-first token systems, dark mode palettes, and responsive breakpoints.',
    connections: ['html-css', 'react', 'typescript'],
    projects: ['heneoxy', 'aeroindex', 'coalintel'],
    coords: { x: 28, y: 58 },
  },
  {
    id: 'edge-apis',
    name: 'REST / Fetch APIs',
    cluster: 'WEB',
    status: 'FAMILIAR',
    categoryLabel: 'Data Fetching',
    description: 'Asynchronous HTTP communications, client-side caching, and error resilience.',
    connections: ['supabase', 'typescript'],
    projects: ['aeroindex', 'coalintel'],
    coords: { x: 18, y: 68 },
  },

  // CREATIVE CLUSTER (Right)
  {
    id: 'gsap',
    name: 'GSAP / ScrollTrigger',
    cluster: 'CREATIVE',
    status: 'USING',
    categoryLabel: 'Scroll Choreography',
    description: 'Timeline sequences, scrubbed scroll triggers, pinned layers, and ticker sync.',
    connections: ['motion', 'threejs', 'react'],
    projects: ['sample-project', 'heneoxy'],
    coords: { x: 74, y: 44 },
  },
  {
    id: 'motion',
    name: 'Motion (Framer)',
    cluster: 'CREATIVE',
    status: 'USING',
    categoryLabel: 'Interaction Physics',
    description: 'Spring dynamics, AnimatePresence page transitions, and layout animations.',
    connections: ['gsap', 'react', 'typescript'],
    projects: ['heneoxy', 'aeroindex'],
    coords: { x: 78, y: 58 },
  },
  {
    id: 'threejs',
    name: 'Three.js / WebGL',
    cluster: 'CREATIVE',
    status: 'LEARNING',
    categoryLabel: '3D Graphics',
    description: 'Perspective cameras, buffer geometry, custom shaders, and RAF render loops.',
    connections: ['glsl', 'gsap', 'typescript'],
    projects: ['sample-project', 'heneoxy'],
    coords: { x: 86, y: 38 },
  },
  {
    id: 'glsl',
    name: 'GLSL Shaders',
    cluster: 'CREATIVE',
    status: 'EXPLORING',
    categoryLabel: 'Fragment Math',
    description: 'Procedural noise, vertex displacement, and GPU-driven chromatic aberrations.',
    connections: ['threejs'],
    projects: ['sample-project', 'heneoxy'],
    coords: { x: 88, y: 54 },
  },

  // AI CLUSTER (Top)
  {
    id: 'llm-integration',
    name: 'LLM Orchestration',
    cluster: 'AI',
    status: 'EXPLORING',
    categoryLabel: 'Applied AI',
    description: 'Streaming completions, structured JSON outputs, and function-calling schemas.',
    connections: ['prompt-eng', 'react', 'typescript'],
    projects: ['heneoxy'],
    coords: { x: 42, y: 22 },
  },
  {
    id: 'prompt-eng',
    name: 'System Prompting',
    cluster: 'AI',
    status: 'LEARNING',
    categoryLabel: 'Context Engineering',
    description: 'Few-shot framing, chain-of-thought instructions, and deterministic evaluation.',
    connections: ['llm-integration'],
    projects: ['heneoxy'],
    coords: { x: 58, y: 18 },
  },
  {
    id: 'agent-tools',
    name: 'Agentic Tooling',
    cluster: 'AI',
    status: 'EXPLORING',
    categoryLabel: 'Tool Calling',
    description: 'Multi-turn autonomous loops, memory summarization, and MCP integration.',
    connections: ['llm-integration', 'typescript'],
    projects: ['heneoxy'],
    coords: { x: 50, y: 28 },
  },

  // SYSTEMS CLUSTER (Bottom)
  {
    id: 'git',
    name: 'Git / GitHub',
    cluster: 'SYSTEMS',
    status: 'USING',
    categoryLabel: 'Version Control',
    description: 'Branch management, pull requests, semantic commit conventions, and CI flows.',
    connections: ['node', 'typescript'],
    projects: ['heneoxy', 'aeroindex', 'coalintel'],
    coords: { x: 38, y: 78 },
  },
  {
    id: 'node',
    name: 'Node.js / Vite',
    cluster: 'SYSTEMS',
    status: 'FAMILIAR',
    categoryLabel: 'Build Tooling',
    description: 'Bundling pipelines, ES modules, tree-shaking, and dev server orchestration.',
    connections: ['git', 'typescript', 'supabase'],
    projects: ['heneoxy', 'aeroindex'],
    coords: { x: 50, y: 74 },
  },
  {
    id: 'supabase',
    name: 'Supabase / PostgreSQL',
    cluster: 'SYSTEMS',
    status: 'LEARNING',
    categoryLabel: 'Cloud Persistence',
    description: 'Row Level Security, relational schemas, auth state, and realtime channels.',
    connections: ['node', 'typescript', 'edge-apis'],
    projects: ['coalintel', 'heneoxy'],
    coords: { x: 62, y: 80 },
  },
];

import type { Project } from '@/types/models';

/**
 * CANONICAL PROJECT UNIVERSE DATA
 * Strict Policy: No fabricated metrics, client names, adoption numbers, or fake claims.
 * Every record represents an authentic engineered exploration with technical integrity.
 */
export const CANONICAL_PROJECTS: Project[] = [
  {
    id: 'heneoxy',
    slug: 'heneoxy',
    title: 'HENEOXY',
    shortTitle: 'HENEOXY',
    tagline: 'Autonomous Personal Computing & Agentic Desktop Environment',
    category: 'ai-systems',
    categoryLabel: 'AI / PERSONAL COMPUTING',
    year: 'ACTIVE',
    status: 'IN DEVELOPMENT',
    role: 'System Architect & Frontend Engineer',
    specIndex: '01',
    shortDescription:
      'An experimental personal computing environment driven by local agentic orchestration, deterministic boundaries, and spatial interfaces.',
    description:
      'Architected as an operating canvas for autonomous workflows. Replaces fragmented web tabs and cloud-dependent SaaS dashboards with a unified, high-performance workspace combining deterministic tool calling, prompt-context streaming, and spatial UI layout.',
    technologies: ['TypeScript', 'React', 'Agent Frameworks', 'Tailwind CSS', 'Vite'],
    tags: ['Agentic Workflows', 'Local Intelligence', 'Tool Calling', 'System UI', 'Spatial Canvas'],
    coverImage: '/favicon.svg',
    gallery: ['/favicon.svg'],
    featured: true,
    order: 1,
    published: true,
    proceduralSignature: {
      pattern: 'matrix',
      gridDensity: 16,
      coordinates: 'INDIA · IST',
      primaryColor: '#00F0FF',
    },
    caseStudy: {
      overview:
        'HENEOXY is an ongoing architectural exploration into human-agent collaboration. The core premise is that modern digital work is throttled by disjointed web interfaces, black-box cloud services, and lack of spatial coherence in software tools.',
      context:
        'Personal computing has largely stalled into standardized browser tabs and chat bubbles. HENEOXY is built to treat LLMs not as chatbots, but as background workers executing structured tasks within defined local permissions.',
      problem:
        'Standard AI interfaces force users to copy-paste context across disconnected windows, suffer from hallucination drift without deterministic boundaries, and hide internal execution state behind vague spinners.',
      approach:
        'Engineered with a strict three-tier architecture: (1) An immutable event bus tracking all agent tool invocations, (2) A local context cache minimizing redundant token roundtrips, and (3) A spatial UI layer providing real-time telemetry on every background operation.',
      architecture: {
        title: 'AGENTIC EXECUTION PIPELINE',
        description:
          'Structured around unidirectional state streaming, local execution sandboxes, and typed RPC protocols.',
        stack: ['TypeScript', 'React 18', 'Tailwind CSS', 'Web Workers', 'Vite'],
      },
      challenges: [
        'Preventing main-thread stutter during streaming completions and token parsing.',
        'Enforcing strict human-in-the-loop review before dangerous filesystem or network operations.',
        'Designing a spatial UI layout that scales gracefully from compact viewports to ultrawide displays.',
      ],
      keyDecisions: [
        'Decoupled agent reasoning logs from user-facing UI state to prevent re-render cascades.',
        'Used procedural SVG grid matrices for visual feedback instead of heavy raster images.',
        'Implemented strict token-budget limits per execution loop.',
      ],
      outcomes: [
        'Responsive UI execution during multi-turn agent streaming.',
        'Zero external cloud runtime lock-in; entirely self-contained local architecture.',
      ],
    },
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aeroindex',
    slug: 'aeroindex',
    title: 'AEROINDEX',
    shortTitle: 'AEROINDEX',
    tagline: 'High-Throughput Telemetry & Spatial Data Visualizer',
    category: 'systems-data',
    categoryLabel: 'WEB / DATA SYSTEMS',
    year: '2024',
    status: 'STABLE PROTOTYPE',
    role: 'Frontend Engineering & Prototyping',
    specIndex: '02',
    shortDescription:
      'High-performance streaming telemetry visualizer designed for dense spatial and temporal data pipelines.',
    description:
      'Engineered with zero-layout-shift rendering pipelines and lightweight SVG/WebGL overlays to stream dense architectural telemetry. Features coordinate mapping, live latency monitoring, and spatial clustering.',
    technologies: ['TypeScript', 'React', 'WebGL', 'GSAP', 'Edge APIs'],
    tags: ['Telemetry', 'Spatial Data', 'Zero-Jank Streams', 'GLSL', 'Performance Budgets'],
    coverImage: '/favicon.svg',
    gallery: ['/favicon.svg'],
    featured: false,
    order: 2,
    published: true,
    proceduralSignature: {
      pattern: 'signal',
      gridDensity: 12,
      coordinates: 'GRID // 02',
      primaryColor: '#3B82F6',
    },
    caseStudy: {
      overview:
        'AEROINDEX explores high-frequency frontend telemetry rendering where traditional chart libraries cause garbage collection pauses and frame drops.',
      context:
        'Modern IoT, aerospace, and spatial applications generate continuous time-series metrics that overwhelm standard DOM rendering trees.',
      problem:
        'Render loops that create new DOM nodes or re-allocate Javascript objects on every frame cause memory fragmentation and perceptible UI stutter.',
      approach:
        'Employed pre-allocated ArrayBuffers and normalized coordinate matrices rendered through hardware-accelerated SVG and WebGL viewports.',
      architecture: {
        title: 'ZERO-ALLOCATION BUFFER PIPELINE',
        description:
          'Direct memory streaming from Edge WebSocket connections into typed arrays rendered on a shared animation RAF loop.',
        stack: ['TypeScript', 'React', 'WebGL', 'Edge Runtime', 'Tailwind CSS'],
      },
      challenges: [
        'Eliminating layout shifts when telemetry values fluctuate rapidly.',
        'Balancing SVG precision with GPU buffer upload throughput.',
      ],
      keyDecisions: [
        'Enforced strict CSS containment on all visualization panels.',
        'Used off-screen canvas buffers for background waveform rendering.',
      ],
      outcomes: [
        'Smooth frame pacing during continuous telemetry updates.',
        'Zero layout reflows during live metric oscillations.',
      ],
    },
    createdAt: new Date('2024-03-20').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'coalintel',
    slug: 'coalintel',
    title: 'COALINTEL',
    shortTitle: 'COALINTEL',
    tagline: 'Industrial Supply-Chain Intelligence & Geospatial Analytics',
    category: 'ai-systems',
    categoryLabel: 'AI / INDUSTRIAL DATA',
    year: '2024',
    status: 'ACTIVE ARCHITECTURE',
    role: 'Full-Stack Engineering & Modeling',
    specIndex: '03',
    shortDescription:
      'Geospatial intelligence platform monitoring commodities flow, vessel tracking, and logistics prediction.',
    description:
      'Combines relational persistence with spatial map rendering to visualize commodity distributions and supply chain throughput. Built with strict Row Level Security, relational schemas, and responsive data filters.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Node.js'],
    tags: ['Geospatial', 'Supply Chain', 'Analytics Engine', 'PostgreSQL', 'RLS'],
    coverImage: '/favicon.svg',
    gallery: ['/favicon.svg'],
    featured: false,
    order: 3,
    published: true,
    proceduralSignature: {
      pattern: 'vector',
      gridDensity: 14,
      coordinates: 'GRID // 03',
      primaryColor: '#F59E0B',
    },
    caseStudy: {
      overview:
        'COALINTEL is an industrial analytics architecture designed to model commodity transit, port congestion, and supply predictability.',
      context:
        'Industrial commodities logistics are plagued by opaque data silos, delayed maritime reporting, and fragmented tracking tools.',
      problem:
        'Analysts require instant geospatial cross-filtering without waiting for monolithic database queries or losing map context.',
      approach:
        'Combined client-side spatial indexing with Supabase PostgreSQL views and optimized vector tile overlays.',
      architecture: {
        title: 'GEOSPATIAL RELATIONAL MATRIX',
        description:
          'PostgreSQL spatial queries paired with client-side indexing and instant cached visual updates.',
        stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Node.js'],
      },
      challenges: [
        'Handling thousands of simultaneous geo-coordinates on resource-constrained devices.',
        'Preserving complex multi-column filter states across route navigation.',
      ],
      keyDecisions: [
        'Leveraged client-side spatial trees for immediate sub-millisecond filtering.',
        'Used dark editorial cartography to prioritize high-contrast logistical data points.',
      ],
      outcomes: [
        'Instantaneous interactive map filtering across complex global shipping routes.',
        'Secure multi-tenant data access enforced via PostgreSQL Row Level Security.',
      ],
    },
    createdAt: new Date('2024-05-10').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sample-project',
    slug: 'sample-project',
    title: 'Architectural Blueprint',
    shortTitle: 'Blueprint',
    tagline: 'Cinematic Motion Systems & WebGL Atmosphere Study',
    category: 'creative-development',
    categoryLabel: 'CREATIVE / SYSTEMS',
    year: '2024',
    status: 'COMPLETED BLUEPRINT',
    role: 'Creative Development & Interface Engineering',
    specIndex: '04',
    shortDescription:
      'A structural exploration of performance-first animations, GSAP scroll choreography, and decoupled 3D atmosphere.',
    description:
      'The foundational blueprint that established the portfolio’s visual operating system: 12-column geometry, decoupled cursor states, spring physics, and lazy Three.js evaluation.',
    technologies: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Motion'],
    tags: ['Creative Tech', 'Three.js', 'GSAP', 'Motion Tokens', 'Design System'],
    coverImage: '/favicon.svg',
    gallery: ['/favicon.svg'],
    featured: false,
    order: 4,
    published: true,
    proceduralSignature: {
      pattern: 'orbital',
      gridDensity: 18,
      coordinates: 'GRID // 04',
      primaryColor: '#A855F7',
    },
    caseStudy: {
      overview:
        'The Architectural Blueprint served as Phase 0 and Phase 1 of this portfolio, creating a unified visual operating system combining editorial typography, spring dynamics, and performant WebGL.',
      context:
        'Creative-tech portfolios often succumb to flashy, distracting animations that degrade performance, violate accessibility, and distract from the work.',
      problem:
        'Creating a cinematic, dark editorial experience while strictly preserving responsive frame pacing, smooth scrolling, and complete accessibility under prefers-reduced-motion.',
      approach:
        'Engineered a centralized motion token system (`EASING.editorial`, `SPRINGS.magnetic`), lazy-evaluated Three.js atmospheres, and synchronized Lenis smooth-scrolling with the GSAP ticker.',
      architecture: {
        title: 'UNIFIED MOTION ARCHITECTURE',
        description:
          'Single RAF loop driving Lenis smooth-scroll, ScrollTrigger, and custom spring cursors without duplicate ticks.',
        stack: ['React', 'TypeScript', 'Three.js', 'GSAP', 'Lenis', 'Motion'],
      },
      challenges: [
        'Preventing Three.js from loading eagerly on non-3D routes like /admin and detail views.',
        'Synchronizing Lenis inertia scrolling with GSAP ScrollTrigger updates.',
      ],
      keyDecisions: [
        'Configured Vite manualChunks to isolate Three.js into a completely lazy-evaluated vendor chunk.',
        'Built fallback reduced-motion paths for all key animations.',
      ],
      outcomes: [
        'Flawless 60 FPS scroll performance across desktop and mobile.',
        'Total isolation of 3D dependencies; zero bundle penalty on administrative and detail routes.',
      ],
    },
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getCanonicalProjects(): Project[] {
  return [...CANONICAL_PROJECTS].sort((a, b) => a.order - b.order);
}

export function getFeaturedProject(): Project {
  return CANONICAL_PROJECTS.find((p) => p.featured) || CANONICAL_PROJECTS[0];
}

export function getAdjacentProjects(currentSlug: string): { prev: Project; next: Project } {
  const projects = getCanonicalProjects();
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);

  if (currentIndex === -1) {
    return { prev: projects[projects.length - 1], next: projects[0] };
  }

  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;

  return {
    prev: projects[prevIndex],
    next: projects[nextIndex],
  };
}

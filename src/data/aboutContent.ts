/**
 * Content Abstraction Layer for About & Technical Identity.
 * Strict Policy: No fabricated personal claims, metrics, or company histories.
 * Focuses on architectural philosophy, active dimensions, and current exploration.
 */

export interface TechnicalDimension {
  id: string;
  category: 'ENGINEERING' | 'AI / INTELLIGENCE' | 'WEB' | 'CREATIVE' | 'SYSTEMS' | 'EXPLORATION';
  focus: string;
  currentLearning: string;
  status: 'ACTIVE EXPLORATION' | 'CORE PRACTICE' | 'RESEARCH';
  specIndex: string;
}

export interface AboutContent {
  sectionIndex: string;
  sectionLabel: string;
  leadStatement: {
    headline: string;
    subheadline: string;
  };
  narrative: {
    column1: {
      title: string;
      paragraphs: string[];
    };
    column2: {
      title: string;
      paragraphs: string[];
    };
  };
  dimensions: TechnicalDimension[];
  currentExploration: {
    label: string;
    topics: string[];
    summary: string;
  };
  telemetry: {
    discipline: string;
    mindset: string;
    status: string;
  };
}

export const ABOUT_CONTENT: AboutContent = {
  sectionIndex: '03',
  sectionLabel: 'Human + Technical Blueprint',
  leadStatement: {
    headline: 'ENGINEERING DIGITAL ENVIRONMENTS WITH ARCHITECTURAL RIGOR AND CINEMATIC SENSIBILITY.',
    subheadline:
      'Operating at the confluence of software architecture, real-time interactivity, and restrained visual design.',
  },
  narrative: {
    column1: {
      title: 'FOUNDATIONS & CRAFT',
      paragraphs: [
        'I approach frontend software engineering not as an assembly of disjointed UI libraries, but as an architectural system. Every layer—from typography hierarchies and motion tokens to memory management and runtime state—is designed with deliberate discipline.',
        'My work centers on building immersive personal tools, experimental digital interfaces, and robust web applications. The goal is to craft experiences that feel tactile, responsive, and grounded, eliminating generic SaaS patterns in favor of purposeful digital product design.',
      ],
    },
    column2: {
      title: 'LEARNING AS AN OPERATING SYSTEM',
      paragraphs: [
        'Technology evolves through curiosity and disciplined execution. Rather than claiming static mastery, I structure my technical identity around active learning loops—studying shader mathematics, exploring agentic workflow architectures, and refining interactive rendering pipelines.',
        'Every project serves as a lab to test performance boundaries, deepen systems knowledge, and synthesize creative visual expression with scalable, maintainable TypeScript engineering.',
      ],
    },
  },
  dimensions: [
    {
      id: 'dim-engineering',
      category: 'ENGINEERING',
      focus: 'Component Architecture & Type Systems',
      currentLearning: 'Deep TypeScript patterns & state machines',
      status: 'CORE PRACTICE',
      specIndex: '01',
    },
    {
      id: 'dim-ai',
      category: 'AI / INTELLIGENCE',
      focus: 'LLM Orchestration & Agent Tooling',
      currentLearning: 'Context optimization & local model workflows',
      status: 'ACTIVE EXPLORATION',
      specIndex: '02',
    },
    {
      id: 'dim-web',
      category: 'WEB',
      focus: 'Modern Layout Geometry & Standards',
      currentLearning: 'Subgrid, CSS Houdini, accessibility trees',
      status: 'CORE PRACTICE',
      specIndex: '03',
    },
    {
      id: 'dim-creative',
      category: 'CREATIVE',
      focus: 'Motion Choreography & Spatial Layouts',
      currentLearning: 'GSAP scroll synchronization & micro-timings',
      status: 'ACTIVE EXPLORATION',
      specIndex: '04',
    },
    {
      id: 'dim-systems',
      category: 'SYSTEMS',
      focus: 'Build Tooling & Bundle Optimization',
      currentLearning: 'Vite/Rollup chunking, lazy evaluations',
      status: 'CORE PRACTICE',
      specIndex: '05',
    },
    {
      id: 'dim-exploration',
      category: 'EXPLORATION',
      focus: 'Real-Time Shaders & WebGL Pipelines',
      currentLearning: 'GLSL fragment shaders & Three.js buffer geometry',
      status: 'RESEARCH',
      specIndex: '06',
    },
  ],
  currentExploration: {
    label: 'CURRENT TECHNICAL HORIZONS',
    topics: [
      'GLSL Fragment Shaders',
      'Agentic Tool Calling Patterns',
      'Layout-Stable Motion',
      'Web Audio Reactivity',
      'Headless CMS Pipelines',
    ],
    summary:
      'Actively studying and prototyping with these technologies. No claims of commercial mastery—only direct hands-on experimentation.',
  },
  telemetry: {
    discipline: 'CREATIVE TECHNOLOGIST & SOFTWARE ENGINEER',
    mindset: 'CONTINUOUS REFINEMENT',
    status: 'SYS // ALL METRICS NOMINAL',
  },
};

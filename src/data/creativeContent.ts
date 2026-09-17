/**
 * Creative Content Abstraction Layer — Phase 7: Creative Lab
 *
 * Strict Policy:
 * Zero fabricated personal work, awards, clients, dates, or proficiency scores.
 * All entries are structured as authentic visual studies, research directions,
 * and archive slots labeled clearly as STUDY, EXPERIMENT, ARCHIVE, or PLACEHOLDER.
 */

import type { CreativeCategory, CreativeWork } from '@/types/models';
export type { CreativeCategory, CreativeWorkStatus, CreativeWork } from '@/types/models';

export interface CreativeLabIdentity {
  sectionNumber: string;
  title: string;
  tagline: string;
  medium: string;
  mode: string;
  coordinates: string;
  manifestoHeadline: string;
  manifestoSub: string;
}

export interface CreativeProcessStep {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
}

export interface CreativeToolItem {
  id: string;
  name: string;
  discipline: string;
  role: string;
  status: 'CORE PRACTICE' | 'STUDY / PRACTICE' | 'EXPLORING';
  specIndex: string;
}

export const CREATIVE_LAB_IDENTITY: CreativeLabIdentity = {
  sectionNumber: '07',
  title: 'CREATIVE LAB',
  tagline: 'VISUAL SYSTEM // 07',
  medium: 'IMAGE / MOTION / LIGHT / FRAME / FORM',
  mode: 'EXPERIMENTAL ARCHIVE',
  coordinates: '23.0225° N, 72.5714° E',
  manifestoHeadline:
    'A FIELD LOG OF VISUAL EXPERIMENTS, MOTION STUDIES, IMAGES & LIGHT THAT LIVE BETWEEN DESIGN AND TECHNOLOGY.',
  manifestoSub:
    'Applying systems engineering discipline to visual expression—refining temporal rhythm, spatial composition, and optical restraint.',
};

export const CREATIVE_CATEGORIES: { id: CreativeCategory; label: string }[] = [
  { id: 'ALL', label: 'ALL ARCHIVES' },
  { id: 'VIDEO', label: 'VIDEO' },
  { id: 'MOTION', label: 'MOTION' },
  { id: 'GRAPHICS', label: 'GRAPHICS' },
  { id: 'PHOTOGRAPHY', label: 'PHOTO' },
  { id: 'ASTROPHOTOGRAPHY', label: 'ASTRO' },
  { id: 'EXPERIMENTS', label: 'EXPERIMENTS' },
];

export const CREATIVE_WORKS: CreativeWork[] = [
  {
    id: 'creative-01',
    slug: 'timeline-cadence-study',
    title: 'Timeline Cadence & Cut Rhythm',
    category: 'VIDEO',
    year: '2024',
    status: 'STUDY',
    slotNote: 'STUDY // TIMELINE CADENCE & CUT PACING',
    shortDescription: 'Investigation of non-linear cut rhythms, audio-visual beat alignment, and montage density.',
    description:
      'A structured timeline study testing temporal pacing, transitional velocity, and syncopated cutting against audio transients. Exploring how frame duration shapes cognitive focus and narrative tension in short-form visual media.',
    tools: ['DaVinci Resolve', 'Premiere Pro'],
    tags: ['Video Editing', 'Cadence', 'Montage', 'Audio Sync'],
    featured: true,
    order: 1,
    aspectRatio: '16/9',
    proceduralSignature: {
      type: 'waveform',
      accentColor: '#00F0FF',
      density: 18,
      coordinates: 'TC 00:42:18',
    },
    metadata: [
      { label: 'DISCIPLINE', value: 'Video Editing' },
      { label: 'TIMECODE', value: '00:42:18' },
      { label: 'SAMPLE RATE', value: '48.0 kHz' },
      { label: 'FRAME CADENCE', value: '24 fps' },
      { label: 'ASSET STATUS', value: 'STUDY // ARCHIVE SLOT' },
    ],
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'creative-02',
    slug: 'kinetic-typography-choreography',
    title: 'Kinetic Typography Choreography',
    category: 'MOTION',
    year: '2024',
    status: 'EXPERIMENT',
    slotNote: 'EXPERIMENT // CHOREOGRAPHY & FRAME EASING',
    shortDescription: 'Variable font morphing, spring-driven kinetic choreography, and typographic hierarchy in motion.',
    description:
      'Exploration of procedural text motion, letterform displacement, and cubic-bezier interpolation curves. Focuses on communicative typography that reacts to spatial triggers without visual clutter or unmotivated easing.',
    tools: ['After Effects', 'Motion', 'Figma'],
    tags: ['Kinetic Type', 'Motion Design', 'Typography', 'Springs'],
    featured: true,
    order: 2,
    aspectRatio: '16/9',
    proceduralSignature: {
      type: 'filmstrip',
      accentColor: '#3B82F6',
      density: 12,
      coordinates: 'FR 00:24:00',
    },
    metadata: [
      { label: 'DISCIPLINE', value: 'Motion Design' },
      { label: 'CHOREOGRAPHY', value: 'Custom Bezier' },
      { label: 'TYPE MATRIX', value: 'Space Grotesk' },
      { label: 'TENSION', value: 'Damped Harmonic' },
      { label: 'ASSET STATUS', value: 'EXPERIMENT // IN PROGRESS' },
    ],
    createdAt: '2024-04-10T00:00:00Z',
  },
  {
    id: 'creative-03',
    slug: 'editorial-asymmetric-systems',
    title: 'Asymmetric Graphic Architecture',
    category: 'GRAPHICS',
    year: '2024',
    status: 'STUDY',
    slotNote: 'STUDY // ASYMMETRIC GRID ARCHITECTURE',
    shortDescription: 'Digital poster explorations, technical crop marks, Swiss modernist layout rules, and optical weighting.',
    description:
      'A series of graphic layout studies applying print-inspired Swiss modernist hierarchy and structured grid systems to digital frames. Investigates tension between dense technical metadata and expansive negative space.',
    tools: ['Figma', 'Photoshop'],
    tags: ['Graphic Design', 'Poster', 'Grid Architecture', 'Swiss Style'],
    featured: false,
    order: 3,
    aspectRatio: '4/3',
    proceduralSignature: {
      type: 'grid',
      accentColor: '#A855F7',
      density: 20,
      coordinates: 'GRID 12-COL',
    },
    metadata: [
      { label: 'DISCIPLINE', value: 'Graphic Design' },
      { label: 'COMPOSITION', value: '12-Column Subgrid' },
      { label: 'CONTRAST RATIO', value: 'High Architectural' },
      { label: 'FORMAT', value: 'Digital Frame' },
      { label: 'ASSET STATUS', value: 'STUDY // ARCHIVE SLOT' },
    ],
    createdAt: '2024-05-15T00:00:00Z',
  },
  {
    id: 'creative-04',
    slug: 'architectural-monolith-framing',
    title: 'Architectural Monolith Framing',
    category: 'PHOTOGRAPHY',
    year: '2024',
    status: 'ARCHIVE',
    slotNote: 'ARCHIVE SLOT // ASSET PENDING',
    shortDescription: 'Spatial compositions, structural shadows, and directional sunlight across concrete monolithic geometries.',
    description:
      'Explorations in architectural framing and geometric isolation. Capturing concrete forms, acute perspective convergence, and the interplay of high-contrast midday shadows against minimalist urban surfaces.',
    tools: ['Lightroom'],
    tags: ['Photography', 'Architecture', 'Monochrome', 'Light & Shadow'],
    featured: false,
    order: 4,
    aspectRatio: '1/1',
    proceduralSignature: {
      type: 'aperture',
      accentColor: '#10B981',
      density: 14,
      coordinates: 'EXP 1/500s',
    },
    metadata: [
      { label: 'DISCIPLINE', value: 'Photography' },
      { label: 'FORMAT', value: 'Digital RAW / Monochrome' },
      { label: 'PERSPECTIVE', value: 'Orthogonal / Acute' },
      { label: 'LOCATION/DATE', value: 'Populated Upon Ingestion' },
      { label: 'ASSET STATUS', value: 'ARCHIVE SLOT // PENDING' },
    ],
    createdAt: '2024-06-20T00:00:00Z',
  },
  {
    id: 'creative-05',
    slug: 'deep-sky-celestial-calibration',
    title: 'Deep-Sky Calibration Framework',
    category: 'ASTROPHOTOGRAPHY',
    year: 'RESEARCH',
    status: 'PLACEHOLDER',
    slotNote: 'ARCHIVE PENDING // TELEMETRY PENDING',
    shortDescription: 'Calibration framework for deep-sky imaging, light-pollution suppression, and sub-exposure stacking.',
    description:
      'A designated research and capture slot for long-exposure celestial observations. The processing pipeline encompasses raw sensor calibration (dark, flat, and bias frame subtraction), star registration, and signal-to-noise ratio optimization for deep-sky nebulae and stellar clusters.',
    tools: ['Lightroom', 'PixInsight Pipeline (Study)'],
    tags: ['Astrophotography', 'Deep Sky', 'Sensor Calibration', 'Photon Stacking'],
    featured: true,
    order: 5,
    aspectRatio: '16/9',
    proceduralSignature: {
      type: 'celestial',
      accentColor: '#00F0FF',
      density: 24,
      coordinates: 'RA 05h35m DEC -05°23\'',
    },
    metadata: [
      { label: 'DISCIPLINE', value: 'Astrophotography' },
      { label: 'TARGET PIPELINE', value: 'Deep Sky / Nebula' },
      { label: 'CALIBRATION', value: 'Darks / Flats / Bias' },
      { label: 'EQUIPMENT/OPTICS', value: 'Awaiting Observation Data' },
      { label: 'ASSET STATUS', value: 'ARCHIVE PENDING // ZERO FABRICATION' },
    ],
    createdAt: '2024-07-01T00:00:00Z',
  },
  {
    id: 'creative-06',
    slug: 'glsl-chromatic-displacement',
    title: 'Shader Distortion & Glitch Canvas',
    category: 'EXPERIMENTS',
    year: '2024',
    status: 'EXPERIMENT',
    slotNote: 'ACTIVE EXPERIMENT // FRAGMENT SHADER',
    shortDescription: 'Real-time fragment shader math, chromatic RGB split, procedural scanline rasterization, and coordinate warping.',
    description:
      'A creative technology experiment executing real-time fragment math on the GPU. Explores uv coordinate distortion via sine harmonics, chromatic channel separation, and CRT shadow-mask simulation.',
    tools: ['GLSL', 'WebGL', 'Three.js'],
    tags: ['Creative Tech', 'GLSL', 'Shaders', 'GPU Math'],
    featured: false,
    order: 6,
    aspectRatio: '21/9',
    proceduralSignature: {
      type: 'waveform',
      accentColor: '#F59E0B',
      density: 18,
      coordinates: 'GLSL UV(x,y)',
    },
    metadata: [
      { label: 'DISCIPLINE', value: 'Creative Technology' },
      { label: 'RUNTIME', value: 'WebGL Fragment Stage' },
      { label: 'GPU UNIFORMS', value: 'u_time, u_resolution' },
      { label: 'MATH MODEL', value: 'Trigonometric Wave' },
      { label: 'ASSET STATUS', value: 'ACTIVE EXPERIMENT' },
    ],
    createdAt: '2024-08-12T00:00:00Z',
  },
];

export const CREATIVE_PROCESS_STEPS: CreativeProcessStep[] = [
  {
    index: '01',
    title: 'OBSERVE',
    subtitle: 'Signal & Spatial Geometry',
    description:
      'Studying how ambient light, architecture, letterforms, and physical motions convey emotion and structural tension before capturing.',
    focus: 'Spatial geometry, illumination angles, focal balance',
  },
  {
    index: '02',
    title: 'FRAME',
    subtitle: 'Boundaries & Optical Weight',
    description:
      'Determining aspect ratios, cropping geometry, and compositional guides. Isolating signal from visual noise.',
    focus: 'Aspect ratio, rule of thirds, negative space',
  },
  {
    index: '03',
    title: 'EDIT',
    subtitle: 'Temporal Rhythm & Velocity',
    description:
      'Assembling visual sequences with conscious cadence. Testing cut durations against audio transients and perceptual retention.',
    focus: 'Cut cadence, timeline density, pacing curves',
  },
  {
    index: '04',
    title: 'COMPOSE',
    subtitle: 'Hierarchy & Tonal Structure',
    description:
      'Layering typography, textural overlays, and color palettes into a unified architectural presentation.',
    focus: 'Typography, grid alignment, tonal values',
  },
  {
    index: '05',
    title: 'ANIMATE',
    subtitle: 'Physics & Kinetic Easing',
    description:
      'Applying natural harmonic springs and custom cubic-bezier curves so movement feels grounded rather than decorative.',
    focus: 'Spring dynamics, easing curves, spatial momentum',
  },
  {
    index: '06',
    title: 'REFINE',
    subtitle: 'Restraint & Quality Grading',
    description:
      'Stripping away gratuitous ornamentation. Verifying contrast, legibility, and technical integrity under scrutiny.',
    focus: 'Color grading, pixel precision, final restraint',
  },
];

export const ENGINEERING_CREATIVE_CONTENT = {
  equation: 'CODE + MOTION + IMAGE + SYSTEM = EXPERIENCE',
  headline: 'ENGINEERING DISCIPLINE APPLIED TO VISUAL EXPRESSION',
  lead:
    'Software engineering and visual craft are not opposing disciplines—they are reciprocal manifestations of structured problem-solving. Both demand spatial precision, performance discipline, and emotional resonance.',
  paragraphs: [
    'A timeline in DaVinci Resolve or After Effects functions with the same structural logic as an asynchronous state machine: keyframes represent state mutations, transition curves are mathematical interpolation models, and audio synchrony mirrors event-driven concurrency.',
    'By approaching visual design through an engineering lens, creative work avoids arbitrary aesthetics. Layouts respect modular token scales, typography obeys typographic hierarchy, and motion serves communicative purpose rather than unmotivated flair.',
  ],
  pillars: [
    {
      title: 'SYSTEMS THINKING',
      description: 'Designing reusable visual tokens, structured grids, and cohesive color mathematics.',
    },
    {
      title: 'COMPUTATIONAL RHYTHM',
      description: 'Treating video cut cadence and motion easing as calibrated temporal algorithms.',
    },
    {
      title: 'AESTHETIC RESTRAINT',
      description: 'Prioritizing clarity, legibility, and architectural calm over decorative excess.',
    },
  ],
};

export const CREATIVE_TOOLS: CreativeToolItem[] = [
  {
    id: 'davinci',
    name: 'DaVinci Resolve',
    discipline: 'Video Editing & Color Grading',
    role: 'Timeline rhythm, cut pacing, and tonal color balance',
    status: 'STUDY / PRACTICE',
    specIndex: '01',
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    discipline: 'Graphic & Asset Manipulation',
    role: 'Digital compositing, texture synthesis, and raster precision',
    status: 'STUDY / PRACTICE',
    specIndex: '02',
  },
  {
    id: 'figma',
    name: 'Figma',
    discipline: 'Interface & Design Systems',
    role: 'Layout geometry, typographic hierarchy, and vector architecture',
    status: 'CORE PRACTICE',
    specIndex: '03',
  },
  {
    id: 'after-effects',
    name: 'Adobe After Effects',
    discipline: 'Motion Choreography',
    role: 'Kinetic typography, bezier interpolation, and micro-animations',
    status: 'EXPLORING',
    specIndex: '04',
  },
  {
    id: 'lightroom',
    name: 'Adobe Lightroom',
    discipline: 'Photography Calibration',
    role: 'Raw exposure correction, tone curves, and chromatic balance',
    status: 'EXPLORING',
    specIndex: '05',
  },
  {
    id: 'blender',
    name: 'Blender',
    discipline: 'Spatial 3D Forms',
    role: 'Spatial scene blocking, geometric lighting, and camera perspectives',
    status: 'EXPLORING',
    specIndex: '06',
  },
];

export const ASTRO_FRAMEWORK_DATA = {
  sectionTitle: 'ASTROPHOTOGRAPHY // CAPTURE & PROCESSING ARCHITECTURE',
  status: 'RESEARCH & OBSERVATION PIPELINE',
  lead:
    'Astrophotography represents the ultimate synthesis of physics, optics, and computational post-processing. Because deep-sky photons travel thousands of light years only to strike a sensor in tiny quantities, successful capture requires rigorous calibration.',
  pipelineStages: [
    {
      step: 'STAGE 01',
      name: 'SIGNAL COLLECTION',
      desc: 'Long-exposure tracking via equatorial mounts to counteract Earth rotation and maximize photon capture without star trailing.',
    },
    {
      step: 'STAGE 02',
      name: 'CALIBRATION FRAMES',
      desc: 'Subtracting thermal sensor noise (Dark frames), optical vignetting/dust shadows (Flat frames), and sensor readout noise (Bias frames).',
    },
    {
      step: 'STAGE 03',
      name: 'SUB-EXPOSURE STACKING',
      desc: 'Statistical star alignment and kappa-sigma clipping algorithms to isolate signal from cosmic ray hits and satellite trails.',
    },
    {
      step: 'STAGE 04',
      name: 'NON-LINEAR STRETCHING',
      desc: 'Preserving star cores while mathematically elevating faint nebulosity through histogram transformation and color calibration.',
    },
  ],
  truthNote:
    'ARCHIVE POLICY: Real celestial captures, equipment parameters, exposure logs, and coordinates will be published only as observation sessions are completed.',
};

import type { Project, Skill, Experience, CreativeWork, Achievement, SiteSettings } from '@/types/models';

/**
 * ARCHITECTURAL TEST FIXTURES
 * NOTE: These are strictly structural placeholders for Phase 0 verification.
 * No false personal claims or metrics are represented here.
 */

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  id: 'default-settings',
  siteTitle: 'Henil Patel',
  siteTagline: 'Engineering & Creative Development',
  bioShort: 'Frontend engineer & creative technologist crafting bespoke digital experiences and interactive systems.',
  contactEmail: 'EMAIL_ADDRESS_PENDING',
  statusMessage: 'Available for selected software and creative engineering projects',
  availability: 'available',
  socialLinks: [
    { id: '1', platform: 'github', label: 'GitHub', url: 'https://github.com/HenilLol', order: 1 },
    { id: '2', platform: 'linkedin', label: 'LinkedIn', url: 'SOCIAL_LINK_PENDING', order: 2 },
    { id: '3', platform: 'email', label: 'Email', url: 'EMAIL_ADDRESS_PENDING', order: 3 },
  ],
  updatedAt: new Date().toISOString(),
};

import { CANONICAL_PROJECTS } from './projects';

export const SAMPLE_PROJECTS: Project[] = CANONICAL_PROJECTS;

export const SAMPLE_SKILLS: Skill[] = [
  {
    id: '1',
    name: 'React / TypeScript',
    category: 'frontend',
    cluster: 'CORE',
    status: 'USING',
    description: 'Component architecture, scalable type systems, and custom hooks.',
    proficiency: 95,
    order: 1,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Three.js / WebGL',
    category: 'creative-coding',
    cluster: 'CREATIVE',
    status: 'LEARNING',
    description: 'Perspective cameras, buffer geometry, and procedural shader passes.',
    proficiency: 85,
    order: 2,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'GSAP / Motion',
    category: 'creative-coding',
    cluster: 'CREATIVE',
    status: 'USING',
    description: 'ScrollTrigger choreography, timeline sequencing, and physics.',
    proficiency: 90,
    order: 3,
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

export const SAMPLE_EXPERIENCE: Experience[] = [
  {
    id: '1',
    role: 'Creative Developer & Interface Engineer',
    company: 'Independent Practice',
    location: 'Remote',
    startDate: '2023-01-01',
    current: true,
    description: 'Engineering bespoke interactive products, digital identities, and responsive WebGL applications.',
    highlights: ['Scalable frontend architecture', 'Interactive 3D integration'],
    technologies: ['React', 'Three.js', 'TypeScript'],
    order: 1,
    createdAt: new Date().toISOString(),
  },
];

import { CREATIVE_WORKS } from './creativeContent';

export const SAMPLE_CREATIVE_WORKS: CreativeWork[] = CREATIVE_WORKS;

export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  {
    id: '1',
    title: 'Digital Experience Foundation',
    issuer: 'System Architecture',
    year: 2024,
    description: 'Engineered modular web architecture and interaction design foundations.',
    order: 1,
    createdAt: new Date().toISOString(),
  },
];

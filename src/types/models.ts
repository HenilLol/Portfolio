/**
 * Core Data Models for Henil Patel Portfolio
 * Designed for full Supabase/PostgreSQL compatibility
 */

export type Project = {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  tagline?: string;
  categoryLabel?: string;
  year?: string;
  status?: 'ACTIVE ARCHITECTURE' | 'STABLE PROTOTYPE' | 'IN DEVELOPMENT' | 'COMPLETED BLUEPRINT';
  role?: string;
  specIndex?: string;
  shortDescription: string;
  description: string;
  category: 'web-engineering' | 'creative-development' | 'systems' | 'experimental' | 'ai-systems' | 'systems-data';
  technologies: string[];
  tags?: string[];
  coverImage: string;
  gallery: string[];
  videos?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
  proceduralSignature?: {
    pattern: 'matrix' | 'signal' | 'orbital' | 'vector';
    gridDensity: number;
    coordinates: string;
    primaryColor?: string;
  };
  caseStudy?: {
    overview?: string;
    context?: string;
    problem?: string;
    approach?: string;
    architecture?: {
      title: string;
      description: string;
      stack: string[];
    };
    challenges?: string[];
    solution?: string;
    outcomes?: string[];
    keyDecisions?: string[];
  };
  createdAt: string;
  updatedAt: string;
};

export type Skill = {
  id: string;
  name: string;
  category: 'frontend' | 'creative-coding' | 'backend' | 'tooling' | 'architecture';
  status?: 'USING' | 'LEARNING' | 'EXPLORING' | 'FAMILIAR';
  cluster?: 'CORE' | 'WEB' | 'CREATIVE' | 'AI' | 'SYSTEMS';
  description?: string;
  connections?: string[];
  proficiency?: number; // 0 to 100 (optional legacy support)
  order: number;
  featured: boolean;
  iconName?: string;
  createdAt: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string; // empty/undefined means current
  current: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
  order: number;
  createdAt: string;
};

export type CreativeCategory =
  | 'ALL'
  | 'VIDEO'
  | 'MOTION'
  | 'GRAPHICS'
  | 'PHOTOGRAPHY'
  | 'ASTROPHOTOGRAPHY'
  | 'EXPERIMENTS';

export type CreativeWorkStatus =
  | 'ARCHIVE'
  | 'EXPERIMENT'
  | 'ONGOING'
  | 'STUDY'
  | 'PLACEHOLDER';

export type CreativeWork = {
  id: string;
  slug: string;
  title: string;
  category?: Exclude<CreativeCategory, 'ALL'>;
  year?: string;
  status?: CreativeWorkStatus;
  medium?: 'webgl' | 'shader' | 'generative' | 'audio-reactive' | 'interaction' | string;
  description: string;
  shortDescription?: string;
  thumbnailUrl?: string;
  thumbnail?: string;
  interactiveUrl?: string;
  media?: {
    type: 'image' | 'video' | 'procedural';
    src?: string;
    videoUrl?: string;
    poster?: string;
    duration?: string;
  };
  featured: boolean;
  order: number;
  tools?: string[];
  tags?: string[];
  metadata?: { label: string; value: string }[];
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16' | '21/9';
  slotNote?: string;
  proceduralSignature?: {
    type: 'grid' | 'waveform' | 'aperture' | 'celestial' | 'filmstrip';
    accentColor?: string;
    density?: number;
    coordinates?: string;
  };
  createdAt: string;
};

export type Achievement = {
  id: string;
  title: string;
  issuer: string;
  year: number;
  description: string;
  credentialUrl?: string;
  order: number;
  createdAt: string;
};

export type SocialLink = {
  id: string;
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'other';
  label: string;
  url: string;
  iconName?: string;
  order: number;
};

export type SiteSettings = {
  id: string;
  siteTitle: string;
  siteTagline: string;
  bioShort: string;
  contactEmail: string;
  statusMessage: string;
  availability: 'available' | 'limited' | 'unavailable';
  socialLinks: SocialLink[];
  updatedAt: string;
};

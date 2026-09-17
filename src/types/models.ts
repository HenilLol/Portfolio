/**
 * Core Data Models for Henil Patel Portfolio
 * Designed for full Supabase/PostgreSQL compatibility
 */

export type Project = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: 'web-engineering' | 'creative-development' | 'systems' | 'experimental';
  technologies: string[];
  coverImage: string;
  gallery: string[];
  videos?: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
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

export type CreativeWork = {
  id: string;
  slug: string;
  title: string;
  medium: 'webgl' | 'shader' | 'generative' | 'audio-reactive' | 'interaction';
  description: string;
  thumbnailUrl: string;
  interactiveUrl?: string;
  featured: boolean;
  order: number;
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

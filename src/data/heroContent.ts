/**
 * HERO & INTRO CONTENT CONFIGURATION
 * Separates all copy and narrative structures from animation logic.
 * Placeholders are explicitly marked. No false credentials or metrics.
 */

export interface HeroContent {
  identity: {
    displayName: string;
    moniker: string;
    status: string;
    coordinates: {
      location: string;
      timezone: string;
      region: string;
    };
  };
  narrative: {
    eyebrow: string;
    headlinePrimary: string;
    headlineSecondary: string;
    positioningStatement: string;
  };
  actions: {
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  metadata: Array<{
    label: string;
    value: string;
  }>;
}

export const HERO_CONTENT: HeroContent = {
  identity: {
    displayName: 'Henil Patel',
    moniker: 'HP // CREATIVE TECH',
    status: 'SYSTEM OPERATIONAL',
    coordinates: {
      location: 'INDIA',
      timezone: 'IST · UTC+05:30',
      region: 'IN // GLOBAL',
    },
  },
  narrative: {
    eyebrow: 'ENGINEERING & CREATIVE TECHNOLOGIES',
    headlinePrimary: 'DIGITAL EXPERIENCES',
    headlineSecondary: 'AT THE THRESHOLD OF CRAFT & CODE',
    positioningStatement:
      'Designing and engineering bespoke digital products, immersive WebGL environments, and modular system interfaces.',
  },
  actions: {
    primaryCta: {
      label: 'Explore Work',
      href: '#projects',
    },
    secondaryCta: {
      label: 'Get in Touch',
      href: '#contact',
    },
  },
  metadata: [
    { label: 'REGION', value: 'IN // GLOBAL' },
    { label: 'STACK', value: 'TypeScript · React · WebGL' },
    { label: 'DISCIPLINE', value: 'Software Engineering & Creative Tech' },
  ],
};

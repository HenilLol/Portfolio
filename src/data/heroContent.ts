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
      lat: string;
      lon: string;
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
    moniker: 'HP // ARCHITECT',
    status: 'SYSTEM OPERATIONAL',
    coordinates: {
      lat: '23.0225° N',
      lon: '72.5714° E',
      region: 'IN // GLOBAL',
    },
  },
  narrative: {
    eyebrow: 'ENGINEERING & CREATIVE TECHNOLOGIES',
    headlinePrimary: 'DIGITAL EXPERIENCES',
    headlineSecondary: 'AT THE THRESHOLD OF CRAFT & CODE',
    positioningStatement:
      'Designing and engineering bespoke digital products, immersive WebGL environments, and high-performance interactive architectures.',
  },
  actions: {
    primaryCta: {
      label: 'Explore Work',
      href: '#projects',
    },
    secondaryCta: {
      label: 'System Blueprint',
      href: '#visual-engine',
    },
  },
  metadata: [
    { label: 'DISCIPLINE', value: 'Creative Development & Architecture' },
    { label: 'SPECIALIZATION', value: 'Interactive WebGL / Realtime Systems' },
    { label: 'STATUS', value: 'Available for Selected Commissions' },
  ],
};

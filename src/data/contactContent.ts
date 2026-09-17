/**
 * Contact & Ending Content Abstraction Layer — Phase 8
 *
 * Strict Policy:
 * Zero fabricated personal facts, client claims, or fake testimonials.
 * Verified GitHub handle @HenilLol is linked directly from repository context.
 * Email and other channels use transparent placeholders that can be updated in one location.
 */

export interface ContactChannel {
  id: string;
  specIndex: string;
  label: string;
  value: string;
  href: string;
  type: 'email' | 'github' | 'linkedin' | 'status';
  badge?: string;
  isExternal?: boolean;
  isPending?: boolean;
  actionText?: string;
}

export interface ContactContent {
  sectionIndex: string;
  sectionLabel: string;
  eyebrow: string;
  headline: string;
  lead: string;
  email: string;
  emailDisplay: string;
  emailLabel: string;
  status: string;
  responseLatency: string;
  coordinates: string;
  location: string;
  timezone: string;
  channels: ContactChannel[];
}

export interface EndingContent {
  signalHeader: string;
  name: string;
  discipline: string;
  completionBadge: string;
  sessionState: string;
  coordinates: string;
  copyright: string;
  tagline: string;
  actions: {
    returnTop: string;
    restart: string;
    exploreWork: string;
  };
}

export const CONTACT_CONTENT: ContactContent = {
  sectionIndex: '07',
  sectionLabel: 'Transmission // Contact',
  eyebrow: 'TRANSMISSION PROTOCOL // SEC-08',
  headline: "LET'S BUILD SOMETHING WORTH EXPERIENCING.",
  lead:
    'Open for architectural software engineering discussions, creative technology collaborations, and intelligent system designs. Operating with disciplined technical execution and cinematic visual sensibility.',
  email: 'contact@example.com',
  emailDisplay: 'contact@example.com',
  emailLabel: 'DIRECT TRANSMISSION',
  status: 'ACTIVE RESEARCH & SELECTED INQUIRIES',
  responseLatency: 'TYPICAL RESPONSE: 24–48 HOURS',
  coordinates: '23.0225° N, 72.5714° E',
  location: 'AHMEDABAD, GUJARAT, INDIA',
  timezone: 'UTC+05:30 [IST]',
  channels: [
    {
      id: 'channel-email',
      specIndex: '01',
      label: 'DIRECT INBOX',
      value: 'contact@example.com',
      href: 'mailto:contact@example.com',
      type: 'email',
      badge: 'PRIMARY',
      actionText: 'TRANSMIT MESSAGE',
    },
    {
      id: 'channel-github',
      specIndex: '02',
      label: 'GITHUB SOURCE',
      value: '@HenilLol',
      href: 'https://github.com/HenilLol',
      type: 'github',
      badge: 'VERIFIED',
      isExternal: true,
      actionText: 'VIEW REPOSITORIES',
    },
    {
      id: 'channel-linkedin',
      specIndex: '03',
      label: 'PROFESSIONAL GRAPH',
      value: 'LINKEDIN PROFILE',
      href: '#',
      type: 'linkedin',
      badge: 'PENDING',
      isPending: true,
      actionText: 'AWAITING PROFILE URL',
    },
    {
      id: 'channel-status',
      specIndex: '04',
      label: 'SYSTEM STATE',
      value: 'BUILDING HENEOXY & CREATIVE LAB',
      href: '/project/heneoxy',
      type: 'status',
      badge: 'ACTIVE FOCUS',
      actionText: 'EXPLORE FLAGSHIP',
    },
  ],
};

export const ENDING_CONTENT: EndingContent = {
  signalHeader: 'SYSTEM // SESSION COMPLETE',
  name: 'HENIL PATEL',
  discipline: 'ENGINEERING × CREATIVE TECHNOLOGY',
  completionBadge: 'ALL SYSTEMS NOMINAL',
  sessionState: 'DIGITAL EXPERIENCE // COMPLETE',
  coordinates: '23.0225° N, 72.5714° E',
  copyright: `© ${new Date().getFullYear()} HENIL PATEL`,
  tagline: 'DESIGNED & ARCHITECTED AS A HIGH-PERFORMANCE DIGITAL ENVIRONMENT.',
  actions: {
    returnTop: 'RETURN TO TOP ↑',
    restart: 'RESTART EXPERIENCE ↺',
    exploreWork: 'EXPLORE SELECTED WORKS →',
  },
};

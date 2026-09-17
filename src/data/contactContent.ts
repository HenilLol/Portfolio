/**
 * Contact & Ending Content Abstraction Layer — Phase 8
 *
 * Strict Policy:
 * Zero fabricated personal facts, client claims, or fake testimonials.
 * Verified GitHub handle @HenilLol is linked directly from repository context.
 * Email and other channels use transparent non-functional placeholders until configured.
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
  location: string;
  timezone: string;
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
    'Exploring software architecture, intelligent system workflows, and creative technology. Applying systems engineering discipline to interactive digital environments.',
  email: 'EMAIL_ADDRESS_PENDING',
  emailDisplay: 'EMAIL_ADDRESS_PENDING',
  emailLabel: 'DIRECT TRANSMISSION',
  status: 'CURRENT FOCUS // HENEOXY & CREATIVE TECHNOLOGY',
  location: 'LOCATION // INDIA',
  timezone: 'TIMEZONE // IST · UTC+05:30',
  channels: [
    {
      id: 'channel-email',
      specIndex: '01',
      label: 'DIRECT INBOX',
      value: 'EMAIL_ADDRESS_PENDING',
      href: '#',
      type: 'email',
      badge: 'PENDING',
      isPending: true,
      actionText: 'EMAIL CHANNEL PENDING',
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
      value: 'SOCIAL_LINK_PENDING',
      href: '#',
      type: 'linkedin',
      badge: 'PENDING',
      isPending: true,
      actionText: 'AWAITING CONFIGURATION',
    },
    {
      id: 'channel-status',
      specIndex: '04',
      label: 'SYSTEM STATE',
      value: 'HENEOXY & CREATIVE LAB',
      href: '/project/heneoxy',
      type: 'status',
      badge: 'ACTIVE FOCUS',
      actionText: 'EXPLORE FLAGSHIP',
    },
  ],
};

export const ENDING_CONTENT: EndingContent = {
  signalHeader: 'SYSTEM METAPHOR // COMPLETE',
  name: 'HENIL PATEL',
  discipline: 'ENGINEERING × CREATIVE TECHNOLOGY',
  completionBadge: 'VISUAL SEQUENCE // COMPLETE',
  sessionState: 'SYSTEM // OPERATIONAL',
  location: 'LOCATION // INDIA',
  timezone: 'TIMEZONE // IST · UTC+05:30',
  copyright: `HENIL PATEL © ${new Date().getFullYear()}`,
  tagline: 'DESIGNED & ARCHITECTED AS A DIGITAL ENVIRONMENT.',
  actions: {
    returnTop: 'RETURN TO TOP ↑',
    restart: 'RESTART EXPERIENCE ↺',
    exploreWork: 'EXPLORE SELECTED WORKS →',
  },
};

export interface NavItem {
  id: string;
  index: string;
  label: string;
  type: 'section' | 'route';
  target: string;
  description: string;
  metadata: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  {
    id: 'overview',
    index: '01',
    label: 'Overview',
    type: 'section',
    target: '#hero',
    description: 'System identity & hero telemetry',
    metadata: 'SEC // 01',
  },
  {
    id: 'about',
    index: '02',
    label: 'About // Identity',
    type: 'section',
    target: '#about',
    description: 'Human + technical blueprint & philosophy',
    metadata: 'SEC // 02',
  },
  {
    id: 'skills',
    index: '03',
    label: 'Technology Map',
    type: 'section',
    target: '#skills',
    description: 'Living systems graph & relational tools',
    metadata: 'SEC // 03',
  },
  {
    id: 'projects',
    index: '04',
    label: 'Selected Projects',
    type: 'section',
    target: '#projects',
    description: 'Featured architectural explorations',
    metadata: 'SEC // 04',
  },
  {
    id: 'creative',
    index: '05',
    label: 'Creative Lab',
    type: 'route',
    target: '/creative',
    description: 'Visual experiment archive & motion studies',
    metadata: 'ARCHIVE // 07',
  },
  {
    id: 'heneoxy-route',
    index: '06',
    label: 'Flagship // HENEOXY',
    type: 'route',
    target: '/project/heneoxy',
    description: 'Autonomous agentic computing environment',
    metadata: 'FLAGSHIP // RT-01',
  },
  {
    id: 'experience',
    index: '07',
    label: 'Practice // Timeline',
    type: 'section',
    target: '#experience',
    description: 'Engineering practice & technical trajectory',
    metadata: 'SEC // 07',
  },
  {
    id: 'contact',
    index: '08',
    label: 'Transmission // Contact',
    type: 'section',
    target: '#contact',
    description: 'Direct communication channels & availability',
    metadata: 'SEC // 08',
  },
];

export const NAV_TELEMETRY = {
  systemVersion: 'SYSTEM SPEC // v1.0',
  location: 'INDIA // IST · UTC+05:30',
  status: 'ALL SYSTEMS NOMINAL',
  closeKeyHint: '[ESC] RETURN',
};

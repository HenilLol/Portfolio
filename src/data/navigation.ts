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
    id: 'system',
    index: '05',
    label: 'System Blueprint',
    type: 'section',
    target: '#visual-engine',
    description: 'Visual operating system & token matrix',
    metadata: 'SEC // 05',
  },
  {
    id: 'sample-project',
    index: '06',
    label: 'Sample Blueprint',
    type: 'route',
    target: '/project/sample-project',
    description: 'Detailed project architecture route',
    metadata: 'ROUTE // RT-01',
  },
];

export const NAV_TELEMETRY = {
  systemVersion: 'PHASE 4 // TECHNICAL IDENTITY',
  coordinates: {
    lat: '23.0225° N',
    lon: '72.5714° E',
  },
  status: 'ALL SYSTEMS NOMINAL',
  closeKeyHint: '[ESC] RETURN',
};

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
    id: 'projects',
    index: '02',
    label: 'Selected Projects',
    type: 'section',
    target: '#projects',
    description: 'Featured architectural explorations',
    metadata: 'SEC // 02',
  },
  {
    id: 'system',
    index: '03',
    label: 'System Blueprint',
    type: 'section',
    target: '#visual-engine',
    description: 'Visual operating system & token matrix',
    metadata: 'SEC // 03',
  },
  {
    id: 'sample-project',
    index: '04',
    label: 'Sample Blueprint',
    type: 'route',
    target: '/project/sample-project',
    description: 'Detailed project architecture route',
    metadata: 'ROUTE // RT-01',
  },
];

export const NAV_TELEMETRY = {
  systemVersion: 'PHASE 3 // NAVIGATION',
  coordinates: {
    lat: '23.0225° N',
    lon: '72.5714° E',
  },
  status: 'ALL SYSTEMS NOMINAL',
  closeKeyHint: '[ESC] RETURN',
};

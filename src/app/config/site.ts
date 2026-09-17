export const SITE_CONFIG = {
  name: 'Henil Patel',
  title: 'Henil Patel — Digital Experience & Engineering',
  description: 'Lead frontend architect & creative technologist building immersive digital products.',
  url: import.meta.env.VITE_SITE_URL || 'http://localhost:3000',
  accentColor: '#00F0FF',
  routes: {
    home: '/',
    admin: '/admin',
    project: (slug: string) => `/project/${slug}`,
  },
};

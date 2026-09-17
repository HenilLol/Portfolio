import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Code-split routes so /admin never downloads or initializes Three.js or portfolio animations
const PortfolioHome = lazy(() =>
  import('./PortfolioHome').then((m) => ({ default: m.PortfolioHome }))
);
const ProjectView = lazy(() =>
  import('./ProjectView').then((m) => ({ default: m.ProjectView }))
);
const NotFound = lazy(() =>
  import('./NotFound').then((m) => ({ default: m.NotFound }))
);

const ProtectedRoute = lazy(() =>
  import('./ProtectedRoute').then((m) => ({ default: m.ProtectedRoute }))
);
const AdminLayout = lazy(() =>
  import('@/admin/layout/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboard = lazy(() =>
  import('@/admin/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const AdminProjects = lazy(() =>
  import('@/admin/pages/AdminProjects').then((m) => ({ default: m.AdminProjects }))
);
const AdminExperience = lazy(() =>
  import('@/admin/pages/AdminExperience').then((m) => ({ default: m.AdminExperience }))
);
const AdminSkills = lazy(() =>
  import('@/admin/pages/AdminSkills').then((m) => ({ default: m.AdminSkills }))
);
const AdminCreative = lazy(() =>
  import('@/admin/pages/AdminCreative').then((m) => ({ default: m.AdminCreative }))
);
const AdminAchievements = lazy(() =>
  import('@/admin/pages/AdminAchievements').then((m) => ({ default: m.AdminAchievements }))
);
const AdminSettings = lazy(() =>
  import('@/admin/pages/AdminSettings').then((m) => ({ default: m.AdminSettings }))
);
const AdminLogin = lazy(() =>
  import('@/admin/pages/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);

const RouteFallback: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <span className="font-mono text-xs uppercase tracking-widest text-foreground-muted animate-pulse">
      CALIBRATING ENVIRONMENT...
    </span>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PortfolioHome />} />
        <Route path="/project/:slug" element={<ProjectView />} />

        {/* Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="creative" element={<AdminCreative />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

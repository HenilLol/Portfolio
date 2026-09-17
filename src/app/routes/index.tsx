import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PortfolioHome } from './PortfolioHome';
import { ProjectView } from './ProjectView';
import { NotFound } from './NotFound';

import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '@/admin/layout/AdminLayout';
import { AdminDashboard } from '@/admin/pages/AdminDashboard';
import { AdminProjects } from '@/admin/pages/AdminProjects';
import { AdminExperience } from '@/admin/pages/AdminExperience';
import { AdminSkills } from '@/admin/pages/AdminSkills';
import { AdminCreative } from '@/admin/pages/AdminCreative';
import { AdminAchievements } from '@/admin/pages/AdminAchievements';
import { AdminSettings } from '@/admin/pages/AdminSettings';
import { AdminLogin } from '@/admin/pages/AdminLogin';

export const AppRoutes: React.FC = () => {
  return (
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
  );
};

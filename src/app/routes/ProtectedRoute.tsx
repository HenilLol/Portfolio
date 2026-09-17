import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading, isConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-mono text-xs text-foreground-muted tracking-widest uppercase animate-pulse">
          Validating Security Tokens...
        </div>
      </div>
    );
  }

  // When live Supabase credentials are configured, require genuine authentication
  if (isConfigured && !session) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isAdmin, loading, isConfigured, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-mono text-xs text-foreground-muted tracking-widest uppercase animate-pulse">
          VALIDATING SECURITY TOKENS & ROLES...
        </div>
      </div>
    );
  }

  // When live Supabase credentials are configured, require genuine authentication
  if (isConfigured) {
    if (!session) {
      return <Navigate to="/admin/login" replace />;
    }

    // Authenticated but not in admin_users table
    if (!isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full border border-red-500/30 bg-background-surface p-8 text-center space-y-6">
            <div className="font-mono text-[10px] tracking-widest text-red-400 uppercase">
              SECURITY PROTOCOL // ACCESS FORBIDDEN
            </div>
            <h2 className="font-editorial text-2xl font-bold uppercase tracking-tight text-foreground">
              403 Unauthorized
            </h2>
            <p className="text-xs font-mono text-foreground-secondary leading-relaxed">
              Your account ({session.user.email}) is authenticated, but not registered in the administrative authorization table.
            </p>
            <div className="pt-4 flex flex-col gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate('/admin/login');
                }}
              >
                Sign Out & Re-authenticate
              </Button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs font-mono text-foreground-muted hover:text-foreground tracking-wider uppercase cursor-pointer"
              >
                Return to Public Site
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

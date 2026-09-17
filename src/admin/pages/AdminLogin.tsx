import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment to authenticate.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md p-8 border border-border-subtle bg-background-surface">
        <div className="mb-6">
          <span className="font-mono text-[10px] tracking-widest text-accent uppercase block mb-1">
            Restricted Access
          </span>
          <h1 className="font-editorial text-2xl font-bold uppercase tracking-tight text-foreground">
            System Authentication
          </h1>
          <p className="text-xs font-mono text-foreground-muted mt-1">
            Owner credentials required for administrative console.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-3 border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-mono leading-relaxed">
            [Dev Notice] Supabase environment variables are unconfigured. To enable real authentication, fill in <code className="text-foreground">.env</code> based on <code className="text-foreground">.env.example</code>.
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-10 px-3 bg-background-elevated border border-border-subtle text-foreground text-sm font-mono focus:border-accent focus:outline-none"
              placeholder="owner@example.com"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-foreground-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-10 px-3 bg-background-elevated border border-border-subtle text-foreground text-sm font-mono focus:border-accent focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" disabled={submitting} className="w-full mt-2">
            {submitting ? 'Authenticating...' : 'Authenticate'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border-subtle text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-mono text-foreground-muted hover:text-foreground tracking-wider uppercase cursor-pointer"
          >
            ← Return to Public Portfolio
          </button>
        </div>
      </Card>
    </div>
  );
};

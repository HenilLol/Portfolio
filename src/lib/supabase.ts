import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-key')
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.info(
    '%c[Supabase]%c Credentials not detected in environment. Running in offline/fixture mode.',
    'color: #00F0FF; font-weight: bold;',
    'color: inherit;'
  );
}

// Create client with fallback placeholder for safe development when env vars are not yet set
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { SiteSettings } from '@/types/models';
import { INITIAL_SITE_SETTINGS } from '@/data/fixtures';

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) {
    return INITIAL_SITE_SETTINGS;
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching site settings:', error.message);
    return INITIAL_SITE_SETTINGS;
  }

  return data as SiteSettings;
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...updates, updatedAt: new Date().toISOString() })
    .eq('id', 'default-settings')
    .select()
    .single();

  if (error) throw error;
  return data as SiteSettings;
}

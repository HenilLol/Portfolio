import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Experience } from '@/types/models';
import { SAMPLE_EXPERIENCE } from '@/data/fixtures';

export async function getExperiences(): Promise<Experience[]> {
  if (!isSupabaseConfigured) {
    return SAMPLE_EXPERIENCE;
  }

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching experiences:', error.message);
    return SAMPLE_EXPERIENCE;
  }

  return data as Experience[];
}

export async function createExperience(experience: Omit<Experience, 'id' | 'createdAt'>): Promise<Experience> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('experiences')
    .insert([experience])
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function deleteExperience(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

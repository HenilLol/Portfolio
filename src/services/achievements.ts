import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Achievement } from '@/types/models';
import { SAMPLE_ACHIEVEMENTS } from '@/data/fixtures';

export async function getAchievements(): Promise<Achievement[]> {
  if (!isSupabaseConfigured) {
    return SAMPLE_ACHIEVEMENTS;
  }

  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching achievements:', error.message);
    return SAMPLE_ACHIEVEMENTS;
  }

  return data as Achievement[];
}

export async function createAchievement(achievement: Omit<Achievement, 'id' | 'createdAt'>): Promise<Achievement> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('achievements')
    .insert([achievement])
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('achievements')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
}

export async function deleteAchievement(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

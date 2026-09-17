import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Skill } from '@/types/models';
import { SAMPLE_SKILLS } from '@/data/fixtures';

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured) {
    return SAMPLE_SKILLS;
  }

  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching skills:', error.message);
    return SAMPLE_SKILLS;
  }

  return data as Skill[];
}

export async function createSkill(skill: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations are disabled.');
  }

  const { data, error } = await supabase
    .from('skills')
    .insert([skill])
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations are disabled.');
  }

  const { data, error } = await supabase
    .from('skills')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function deleteSkill(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations are disabled.');
  }

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

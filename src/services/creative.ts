import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CreativeWork } from '@/types/models';
import { SAMPLE_CREATIVE_WORKS } from '@/data/fixtures';

export async function getCreativeWorks(): Promise<CreativeWork[]> {
  if (!isSupabaseConfigured) {
    return SAMPLE_CREATIVE_WORKS;
  }

  const { data, error } = await supabase
    .from('creative_works')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching creative works:', error.message);
    return SAMPLE_CREATIVE_WORKS;
  }

  return data as CreativeWork[];
}

export async function createCreativeWork(work: Omit<CreativeWork, 'id' | 'createdAt'>): Promise<CreativeWork> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('creative_works')
    .insert([work])
    .select()
    .single();

  if (error) throw error;
  return data as CreativeWork;
}

export async function updateCreativeWork(id: string, updates: Partial<CreativeWork>): Promise<CreativeWork> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { data, error } = await supabase
    .from('creative_works')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as CreativeWork;
}

export async function deleteCreativeWork(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.');

  const { error } = await supabase
    .from('creative_works')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

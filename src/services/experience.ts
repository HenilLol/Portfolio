import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Experience } from '@/types/models';
import { SAMPLE_EXPERIENCE } from '@/data/fixtures';

export interface GetExperienceOptions {
  publishedOnly?: boolean;
}

export async function getExperiences(options?: GetExperienceOptions): Promise<Experience[]> {
  const publishedOnly = options?.publishedOnly ?? false;

  if (!isSupabaseConfigured) {
    const list = [...SAMPLE_EXPERIENCE].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((e) => e.published !== false) : list;
  }

  let query = supabase
    .from('experiences')
    .select('*')
    .order('order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    if (error) {
      console.warn('[CMS] Database experiences query error, falling back to fixtures:', error.message);
    }
    const list = [...SAMPLE_EXPERIENCE].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((e) => e.published !== false) : list;
  }

  return data as Experience[];
}

export async function createExperience(experience: Omit<Experience, 'id' | 'createdAt'>): Promise<Experience> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { data, error } = await supabase
    .from('experiences')
    .insert([
      {
        ...experience,
        created_at: new Date().toISOString(),
      } as any,
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function updateExperience(id: string, updates: Partial<Experience>): Promise<Experience> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { data, error } = await supabase
    .from('experiences')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
}

export async function toggleExperiencePublished(id: string, published: boolean): Promise<Experience> {
  return updateExperience(id, { published });
}

export async function deleteExperience(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { error } = await supabase
    .from('experiences')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function reorderExperiences(orderedItems: { id: string; order: number }[]): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  for (const item of orderedItems) {
    const { error } = await supabase
      .from('experiences')
      .update({ order: item.order } as any)
      .eq('id', item.id);

    if (error) throw error;
  }

  return true;
}

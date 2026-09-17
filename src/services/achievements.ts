import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Achievement } from '@/types/models';
import { SAMPLE_ACHIEVEMENTS } from '@/data/fixtures';

export interface GetAchievementsOptions {
  publishedOnly?: boolean;
}

export async function getAchievements(options?: GetAchievementsOptions): Promise<Achievement[]> {
  const publishedOnly = options?.publishedOnly ?? false;

  if (!isSupabaseConfigured) {
    const list = [...SAMPLE_ACHIEVEMENTS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((a) => a.published !== false) : list;
  }

  let query = supabase
    .from('achievements')
    .select('*')
    .order('order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    if (error) {
      console.warn('[CMS] Database achievements query error, falling back to fixtures:', error.message);
    }
    const list = [...SAMPLE_ACHIEVEMENTS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((a) => a.published !== false) : list;
  }

  return data as Achievement[];
}

export async function createAchievement(achievement: Omit<Achievement, 'id' | 'createdAt'>): Promise<Achievement> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { data, error } = await supabase
    .from('achievements')
    .insert([
      {
        ...achievement,
        created_at: new Date().toISOString(),
      } as any,
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
}

export async function updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { data, error } = await supabase
    .from('achievements')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Achievement;
}

export async function toggleAchievementPublished(id: string, published: boolean): Promise<Achievement> {
  return updateAchievement(id, { published });
}

export async function deleteAchievement(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function reorderAchievements(orderedItems: { id: string; order: number }[]): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  for (const item of orderedItems) {
    const { error } = await supabase
      .from('achievements')
      .update({ order: item.order } as any)
      .eq('id', item.id);

    if (error) throw error;
  }

  return true;
}

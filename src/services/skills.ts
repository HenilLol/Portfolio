import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Skill } from '@/types/models';
import { SAMPLE_SKILLS } from '@/data/fixtures';

export interface GetSkillsOptions {
  publishedOnly?: boolean;
}

export async function getSkills(options?: GetSkillsOptions): Promise<Skill[]> {
  const publishedOnly = options?.publishedOnly ?? false;

  if (!isSupabaseConfigured) {
    const list = [...SAMPLE_SKILLS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((s) => s.published !== false) : list;
  }

  let query = supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    if (error) {
      console.warn('[CMS] Database skills query error, falling back to fixtures:', error.message);
    }
    const list = [...SAMPLE_SKILLS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((s) => s.published !== false) : list;
  }

  return data as Skill[];
}

export async function createSkill(skill: Omit<Skill, 'id' | 'createdAt'>): Promise<Skill> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');
  }

  const { data, error } = await supabase
    .from('skills')
    .insert([
      {
        ...skill,
        created_at: new Date().toISOString(),
      } as any,
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');
  }

  const { data, error } = await supabase
    .from('skills')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Skill;
}

export async function toggleSkillPublished(id: string, published: boolean): Promise<Skill> {
  return updateSkill(id, { published });
}

export async function deleteSkill(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');
  }

  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function reorderSkills(orderedItems: { id: string; order: number }[]): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  for (const item of orderedItems) {
    const { error } = await supabase
      .from('skills')
      .update({ order: item.order } as any)
      .eq('id', item.id);

    if (error) throw error;
  }

  return true;
}

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { CreativeWork } from '@/types/models';
import { CREATIVE_WORKS } from '@/data/creativeContent';

export interface GetCreativeOptions {
  publishedOnly?: boolean;
}

export async function getCreativeWorks(options?: GetCreativeOptions): Promise<CreativeWork[]> {
  const publishedOnly = options?.publishedOnly ?? false;

  if (!isSupabaseConfigured) {
    const list = [...CREATIVE_WORKS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((w) => w.published !== false) : list;
  }

  let query = supabase
    .from('creative_works')
    .select('*')
    .order('order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    if (error) {
      console.warn('[CMS] Database creative works query error, falling back to fixtures:', error.message);
    }
    const list = [...CREATIVE_WORKS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((w) => w.published !== false) : list;
  }

  return data as CreativeWork[];
}

export async function getCreativeWorkBySlug(slug: string): Promise<CreativeWork | null> {
  if (!isSupabaseConfigured) {
    return CREATIVE_WORKS.find((w) => w.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from('creative_works')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) {
    return CREATIVE_WORKS.find((w) => w.slug === slug) || null;
  }

  return data as CreativeWork;
}

export async function createCreativeWork(work: Omit<CreativeWork, 'id' | 'createdAt'>): Promise<CreativeWork> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { data, error } = await supabase
    .from('creative_works')
    .insert([
      {
        ...work,
        created_at: new Date().toISOString(),
      } as any,
    ])
    .select()
    .single();

  if (error) throw error;
  return data as CreativeWork;
}

export async function updateCreativeWork(id: string, updates: Partial<CreativeWork>): Promise<CreativeWork> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { data, error } = await supabase
    .from('creative_works')
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as CreativeWork;
}

export async function toggleCreativePublished(id: string, published: boolean): Promise<CreativeWork> {
  return updateCreativeWork(id, { published });
}

export async function deleteCreativeWork(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');

  const { error } = await supabase
    .from('creative_works')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function reorderCreativeWorks(orderedItems: { id: string; order: number }[]): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  for (const item of orderedItems) {
    const { error } = await supabase
      .from('creative_works')
      .update({ order: item.order } as any)
      .eq('id', item.id);

    if (error) throw error;
  }

  return true;
}

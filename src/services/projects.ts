import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Project } from '@/types/models';
import { CANONICAL_PROJECTS } from '@/data/projects';

export interface GetProjectsOptions {
  publishedOnly?: boolean;
}

export async function getProjects(options?: GetProjectsOptions): Promise<Project[]> {
  const publishedOnly = options?.publishedOnly ?? false;

  if (!isSupabaseConfigured) {
    const list = [...CANONICAL_PROJECTS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((p) => p.published) : list;
  }

  let query = supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true });

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    if (error) {
      console.warn('[CMS] Database projects query error, falling back to fixtures:', error.message);
    }
    const list = [...CANONICAL_PROJECTS].sort((a, b) => a.order - b.order);
    return publishedOnly ? list.filter((p) => p.published) : list;
  }

  return data as Project[];
}

export async function getProjectBySlug(slug: string, options?: GetProjectsOptions): Promise<Project | null> {
  const publishedOnly = options?.publishedOnly ?? false;

  if (!isSupabaseConfigured) {
    const found = CANONICAL_PROJECTS.find((p) => p.slug === slug);
    if (!found) return null;
    if (publishedOnly && !found.published) return null;
    return found;
  }

  let query = supabase
    .from('projects')
    .select('*')
    .eq('slug', slug);

  if (publishedOnly) {
    query = query.eq('published', true);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    const found = CANONICAL_PROJECTS.find((p) => p.slug === slug);
    if (!found) return null;
    if (publishedOnly && !found.published) return null;
    return found;
  }

  return data as Project;
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any,
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');
  }

  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function toggleProjectPublished(id: string, published: boolean): Promise<Project> {
  return updateProject(id, { published });
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations require active cloud credentials.');
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

export async function reorderProjects(orderedItems: { id: string; order: number }[]): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  for (const item of orderedItems) {
    const { error } = await supabase
      .from('projects')
      .update({ order: item.order } as any)
      .eq('id', item.id);

    if (error) throw error;
  }

  return true;
}

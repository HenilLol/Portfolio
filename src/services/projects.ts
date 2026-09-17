import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Project } from '@/types/models';
import { SAMPLE_PROJECTS } from '@/data/fixtures';

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) {
    return SAMPLE_PROJECTS;
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching projects from Supabase:', error.message);
    return SAMPLE_PROJECTS;
  }

  return data as Project[];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    const found = SAMPLE_PROJECTS.find((p) => p.slug === slug);
    return found || null;
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching project "${slug}":`, error.message);
    return null;
  }

  return data as Project;
}

export async function createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations are disabled.');
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations are disabled.');
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Project;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Live mutations are disabled.');
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }

  return true;
}

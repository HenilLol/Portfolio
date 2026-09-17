/**
 * Supabase Database Typings
 * Represents Postgres table definitions matching the models.
 */

import type { Project, Skill, Experience, CreativeWork, Achievement, SiteSettings } from './models';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & {
          id?: string;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: Partial<Project>;
        Relationships: Relationship[];
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, 'id' | 'createdAt'> & {
          id?: string;
          createdAt?: string;
        };
        Update: Partial<Skill>;
        Relationships: Relationship[];
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, 'id' | 'createdAt'> & {
          id?: string;
          createdAt?: string;
        };
        Update: Partial<Experience>;
        Relationships: Relationship[];
      };
      creative_works: {
        Row: CreativeWork;
        Insert: Omit<CreativeWork, 'id' | 'createdAt'> & {
          id?: string;
          createdAt?: string;
        };
        Update: Partial<CreativeWork>;
        Relationships: Relationship[];
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'id' | 'createdAt'> & {
          id?: string;
          createdAt?: string;
        };
        Update: Partial<Achievement>;
        Relationships: Relationship[];
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Omit<SiteSettings, 'id' | 'updatedAt'> & {
          id?: string;
          updatedAt?: string;
        };
        Update: Partial<SiteSettings>;
        Relationships: Relationship[];
      };
      admin_users: {
        Row: {
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
      media_assets: {
        Row: {
          id: string;
          name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          public_url: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          file_path: string;
          file_size: number;
          mime_type: string;
          public_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          file_path?: string;
          file_size?: number;
          mime_type?: string;
          public_url?: string;
          created_at?: string;
        };
        Relationships: Relationship[];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

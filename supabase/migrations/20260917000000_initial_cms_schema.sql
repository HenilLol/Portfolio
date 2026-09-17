-- ============================================================================
-- Phase 9: Secure CMS & Admin Control System Database Migration
-- Architecture: Supabase / PostgreSQL with Row Level Security (RLS)
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ADMIN AUTHORIZATION SYSTEM
-- ----------------------------------------------------------------------------
-- Dedicated admin table referencing auth.users.
-- Ensures that administrative privileges are NEVER determined by client booleans.
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Secure PostgreSQL function to check if the current requester is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only existing admins can read or manage admin_users
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage admin_users"
  ON public.admin_users
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_title TEXT,
  tagline TEXT,
  category_label TEXT,
  year TEXT,
  status TEXT CHECK (status IN ('ACTIVE ARCHITECTURE', 'STABLE PROTOTYPE', 'IN DEVELOPMENT', 'COMPLETED BLUEPRINT', 'ARCHIVED')),
  role TEXT,
  spec_index TEXT,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('web-engineering', 'creative-development', 'systems', 'experimental', 'ai-systems', 'systems-data')),
  technologies TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  tags TEXT[] DEFAULT '{}'::TEXT[],
  cover_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  videos TEXT[] DEFAULT '{}'::TEXT[],
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT false NOT NULL,
  procedural_signature JSONB,
  case_study JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can only view published projects
CREATE POLICY "Public can view published projects"
  ON public.projects
  FOR SELECT
  USING (published = true OR public.is_admin());

-- Only authorized admins can insert, update, or delete projects
CREATE POLICY "Admins can insert projects"
  ON public.projects
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update projects"
  ON public.projects
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. SKILLS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('frontend', 'creative-coding', 'backend', 'tooling', 'architecture')),
  status TEXT CHECK (status IN ('USING', 'LEARNING', 'EXPLORING', 'FAMILIAR')),
  cluster TEXT CHECK (cluster IN ('CORE', 'WEB', 'CREATIVE', 'AI', 'SYSTEMS')),
  description TEXT,
  connections TEXT[] DEFAULT '{}'::TEXT[],
  proficiency INTEGER CHECK (proficiency >= 0 AND proficiency <= 100),
  sort_order INTEGER DEFAULT 0 NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  icon_name TEXT,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published skills"
  ON public.skills
  FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage skills"
  ON public.skills
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 4. EXPERIENCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false NOT NULL,
  description TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  technologies TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published experiences"
  ON public.experiences
  FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage experiences"
  ON public.experiences
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 5. CREATIVE WORKS TABLE (Phase 7 Creative Lab)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.creative_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT CHECK (category IN ('VIDEO', 'MOTION', 'GRAPHICS', 'PHOTOGRAPHY', 'ASTROPHOTOGRAPHY', 'EXPERIMENTS')),
  year TEXT,
  status TEXT CHECK (status IN ('ARCHIVE', 'EXPERIMENT', 'ONGOING', 'STUDY', 'PLACEHOLDER')),
  medium TEXT,
  description TEXT NOT NULL,
  short_description TEXT,
  thumbnail_url TEXT,
  interactive_url TEXT,
  media JSONB,
  featured BOOLEAN DEFAULT false NOT NULL,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  tools TEXT[] DEFAULT '{}'::TEXT[],
  tags TEXT[] DEFAULT '{}'::TEXT[],
  metadata JSONB,
  aspect_ratio TEXT CHECK (aspect_ratio IN ('16/9', '4/3', '1/1', '9/16', '21/9')),
  slot_note TEXT,
  procedural_signature JSONB,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.creative_works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published creative works"
  ON public.creative_works
  FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage creative works"
  ON public.creative_works
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 6. ACHIEVEMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  year INTEGER NOT NULL,
  description TEXT NOT NULL,
  credential_url TEXT,
  sort_order INTEGER DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published achievements"
  ON public.achievements
  FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage achievements"
  ON public.achievements
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. SITE SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default-settings',
  site_title TEXT NOT NULL,
  site_tagline TEXT NOT NULL,
  bio_short TEXT NOT NULL,
  contact_email TEXT NOT NULL DEFAULT 'EMAIL_ADDRESS_PENDING',
  status_message TEXT NOT NULL,
  availability TEXT CHECK (availability IN ('available', 'limited', 'unavailable')) DEFAULT 'available',
  social_links JSONB DEFAULT '[]'::JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8. MEDIA ASSETS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view media assets"
  ON public.media_assets
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage media assets"
  ON public.media_assets
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 9. STORAGE BUCKET & POLICIES
-- ----------------------------------------------------------------------------
-- Insert bucket if storage schema exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view assets
CREATE POLICY "Public can view portfolio media"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'portfolio-media');

-- Storage RLS: Only admins can upload/update/delete assets
CREATE POLICY "Admins can upload portfolio media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admins can update portfolio media"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'portfolio-media' AND public.is_admin());

CREATE POLICY "Admins can delete portfolio media"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'portfolio-media' AND public.is_admin());

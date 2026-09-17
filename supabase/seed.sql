-- ============================================================================
-- Phase 9: Idempotent Seed Script for Henil Patel Creative-Tech Portfolio
-- Strict Policy: Uses ONLY verified fixture content present in the repository.
-- Safe execution: ON CONFLICT DO NOTHING preserves existing data.
-- ============================================================================

-- 1. SITE SETTINGS
INSERT INTO public.site_settings (
  id,
  site_title,
  site_tagline,
  bio_short,
  contact_email,
  status_message,
  availability,
  social_links,
  updated_at
) VALUES (
  'default-settings',
  'Henil Patel',
  'Engineering & Creative Development',
  'Lead frontend architect & creative technologist building immersive digital products.',
  'EMAIL_ADDRESS_PENDING',
  'Available for selected architectural projects',
  'available',
  '[
    {"id": "1", "platform": "github", "label": "GitHub", "url": "https://github.com/HenilLol", "order": 1},
    {"id": "2", "platform": "linkedin", "label": "LinkedIn", "url": "SOCIAL_LINK_PENDING", "order": 2},
    {"id": "3", "platform": "email", "label": "Email", "url": "EMAIL_ADDRESS_PENDING", "order": 3}
  ]'::JSONB,
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- 2. PROJECTS (Canonical Project Universe)
INSERT INTO public.projects (
  slug,
  title,
  short_title,
  tagline,
  category,
  category_label,
  year,
  status,
  role,
  spec_index,
  short_description,
  description,
  technologies,
  tags,
  cover_image,
  gallery,
  featured,
  sort_order,
  published,
  procedural_signature,
  case_study
) VALUES
(
  'heneoxy',
  'HENEOXY',
  'HENEOXY',
  'Autonomous Personal Computing & Agentic Desktop Environment',
  'ai-systems',
  'AI / PERSONAL COMPUTING',
  'ACTIVE',
  'IN DEVELOPMENT',
  'System Architect & Frontend Engineer',
  '01',
  'An experimental personal computing environment driven by local agentic orchestration, deterministic boundaries, and spatial interfaces.',
  'Architected as an operating canvas for autonomous workflows. Replaces fragmented web tabs and cloud-dependent SaaS dashboards with a unified, high-performance workspace combining deterministic tool calling, prompt-context streaming, and spatial UI layout.',
  ARRAY['TypeScript', 'React', 'Agent Frameworks', 'Tailwind CSS', 'Vite'],
  ARRAY['Agentic Workflows', 'Local Intelligence', 'Tool Calling', 'System UI', 'Spatial Canvas'],
  '/favicon.svg',
  ARRAY['/favicon.svg'],
  true,
  1,
  true,
  '{"pattern": "matrix", "gridDensity": 16, "coordinates": "23.02°N 72.57°E", "primaryColor": "#00F0FF"}'::JSONB,
  '{
    "overview": "HENEOXY is an ongoing architectural exploration into human-agent collaboration. The core premise is that modern digital work is throttled by disjointed web interfaces, black-box cloud services, and lack of spatial coherence in software tools.",
    "context": "Personal computing has largely stalled into standardized browser tabs and chat bubbles. HENEOXY is built to treat LLMs not as chatbots, but as background workers executing structured tasks within defined local permissions.",
    "problem": "Standard AI interfaces force users to copy-paste context across disconnected windows, suffer from hallucination drift without deterministic boundaries, and hide internal execution state behind vague spinners.",
    "approach": "Engineered with a strict three-tier architecture: (1) An immutable event bus tracking all agent tool invocations, (2) A local context cache minimizing redundant token roundtrips, and (3) A spatial UI layer providing real-time telemetry on every background operation.",
    "architecture": {
      "title": "AGENTIC EXECUTION PIPELINE",
      "description": "Structured around unidirectional state streaming, local execution sandboxes, and typed RPC protocols.",
      "stack": ["TypeScript", "React 18", "Tailwind CSS", "Web Workers", "Vite"]
    },
    "challenges": [
      "Preventing main-thread stutter during streaming completions and token parsing.",
      "Enforcing strict human-in-the-loop review before dangerous filesystem or network operations.",
      "Designing a spatial UI layout that scales gracefully from compact viewports to ultrawide displays."
    ],
    "keyDecisions": [
      "Decoupled agent reasoning logs from user-facing UI state to prevent re-render cascades.",
      "Used procedural SVG grid matrices for visual feedback instead of heavy raster images."
    ]
  }'::JSONB
),
(
  'aeroindex',
  'AEROINDEX',
  'AEROINDEX',
  'Sub-Kilometer Atmospheric Modeling & Real-Time Air Quality Intelligence',
  'systems-data',
  'SYSTEMS / DATA TELEMETRY',
  'STABLE',
  'COMPLETED BLUEPRINT',
  'Data Visualization Engineer & Architecture Lead',
  '02',
  'High-density spatial telemetry visualizer translating multi-sensor microclimate data streams into predictive environmental risk surfaces.',
  'A specialized environmental analytics console that aggregates raw sensor feeds and satellite observations to deliver hyper-localized microclimate forecasts with millisecond client-side render latencies.',
  ARRAY['TypeScript', 'WebGL', 'Mapbox GL', 'Node.js', 'GeoJSON'],
  ARRAY['Atmospheric Modeling', 'WebGL Shaders', 'Spatial Telemetry', 'Streaming Data'],
  '/favicon.svg',
  ARRAY['/favicon.svg'],
  false,
  2,
  true,
  '{"pattern": "signal", "gridDensity": 24, "coordinates": "28.61°N 77.20°E", "primaryColor": "#00FF88"}'::JSONB,
  '{
    "overview": "AEROINDEX bridges the gap between raw scientific atmospheric data and intuitive visual exploration.",
    "context": "Urban microclimates fluctuate drastically across individual city blocks, rendering macro-level city weather stations insufficient for localized safety interventions.",
    "problem": "Rendering millions of interpolated sensor readings in real-time caused severe frame drops in standard SVG-based dashboards.",
    "approach": "Implemented a custom WebGL texture shader layer that performs bi-linear spatial interpolation on GPU memory directly.",
    "architecture": {
      "title": "SPATIAL TELEMETRY GPU PIPELINE",
      "description": "Client-side WebGL fragment shader consuming compact binary geo-arrays.",
      "stack": ["TypeScript", "WebGL", "Float32Arrays", "Web Workers"]
    }
  }'::JSONB
),
(
  'coalintel',
  'COALINTEL',
  'COALINTEL',
  'Energy Grid Logistics Intelligence & Supply Chain Risk Optimization',
  'systems-data',
  'SYSTEMS / LOGISTICS OPTIMIZATION',
  'ARCHIVED',
  'STABLE PROTOTYPE',
  'Full-Stack Systems Engineer',
  '03',
  'Graph-based logistics optimization suite for industrial energy supply pipelines, tracking bottlenecks across multi-modal transit networks.',
  'A comprehensive control panel for bulk commodity transit monitoring. Features constraint-satisfaction route solvers, real-time railyard congestion scoring, and predictive delivery window estimation under severe operational disruptions.',
  ARRAY['TypeScript', 'React', 'D3.js', 'PostgreSQL', 'Tailwind CSS'],
  ARRAY['Graph Optimization', 'Supply Chain', 'Logistics Intelligence', 'Deterministic Solvers'],
  '/favicon.svg',
  ARRAY['/favicon.svg'],
  false,
  3,
  true,
  '{"pattern": "orbital", "gridDensity": 20, "coordinates": "21.17°N 72.83°E", "primaryColor": "#FFB800"}'::JSONB,
  '{
    "overview": "COALINTEL modeled multi-modal transportation corridors to detect single-point-of-failure vulnerabilities in energy supply networks.",
    "problem": "Unplanned rail corridor maintenance caused unpredictable downstream inventory shortages with no automated rerouting guidance.",
    "approach": "Built a deterministic graph engine modeling railyard switches, barge terminals, and stockpile capacities as state machines."
  }'::JSONB
)
ON CONFLICT (slug) DO NOTHING;

-- 3. SKILLS
INSERT INTO public.skills (name, category, cluster, status, description, proficiency, sort_order, featured, published)
VALUES
  ('React / TypeScript', 'frontend', 'CORE', 'USING', 'Component architecture, scalable type systems, and custom hooks.', 95, 1, true, true),
  ('Three.js / WebGL', 'creative-coding', 'CREATIVE', 'LEARNING', 'Perspective cameras, buffer geometry, and procedural shader passes.', 85, 2, true, true),
  ('GSAP / Motion', 'creative-coding', 'CREATIVE', 'USING', 'ScrollTrigger choreography, timeline sequencing, and physics.', 90, 3, true, true),
  ('Node.js / Systems', 'backend', 'SYSTEMS', 'USING', 'Runtime services, streaming APIs, and local tool invocation.', 88, 4, false, true),
  ('Tailwind CSS', 'frontend', 'CORE', 'USING', 'Systematic token architecture and responsive design layouts.', 95, 5, false, true),
  ('AI Agent Tooling', 'architecture', 'AI', 'EXPLORING', 'Context streaming, prompt engineering, and deterministic schemas.', 85, 6, true, true)
ON CONFLICT DO NOTHING;

-- 4. EXPERIENCES
INSERT INTO public.experiences (role, company, location, start_date, current, description, highlights, technologies, sort_order, published)
VALUES (
  'Creative Developer & Architect',
  'Independent Practice',
  'Remote / India',
  '2023-01-01',
  true,
  'Engineering bespoke interactive products, digital identities, and high-performance WebGL applications.',
  ARRAY['Scalable frontend architecture', 'Interactive 3D integration', 'Deterministic agent workflows'],
  ARRAY['React', 'Three.js', 'TypeScript', 'Tailwind CSS'],
  1,
  true
) ON CONFLICT DO NOTHING;

-- 5. CREATIVE WORKS (Creative Lab Field Archive)
INSERT INTO public.creative_works (
  slug, title, category, year, status, medium, description, short_description, featured, sort_order, tools, tags, aspect_ratio, published
) VALUES
(
  'chromatic-dispersion',
  'Chromatic Wave Dispersion',
  'EXPERIMENTS',
  '2024',
  'EXPERIMENT',
  'WebGL / GLSL Shader Pass',
  'Real-time simulation of multi-wavelength chromatic aberration and lens curvature.',
  'GPU ray dispersion shader pass simulating optical prism phenomena.',
  true,
  1,
  ARRAY['GLSL', 'Three.js', 'WebGL'],
  ARRAY['Optics', 'Raymarching', 'Dispersion'],
  '16/9',
  true
),
(
  'kinetic-typography-grid',
  'Kinetic Monospace Matrix',
  'MOTION',
  '2024',
  'ONGOING',
  'Variable Font Physics & SVG Matrix',
  'Spring-damper physics applied to responsive monospace text vectors.',
  'Interactive variable typography engine responsive to velocity.',
  true,
  2,
  ARRAY['TypeScript', 'Motion', 'Canvas'],
  ARRAY['Typography', 'Spring Physics', 'Interactive'],
  '4/3',
  true
),
(
  'celestial-astrophotography',
  'Deep Sky Composite — Orion Nebula',
  'ASTROPHOTOGRAPHY',
  '2023',
  'ARCHIVE',
  'Direct Telescope Capture & Multi-Exposure Stacking',
  'High-dynamic range composite stacking 120 light frames to resolve ionization clouds.',
  'Optical composite revealing emission nebulosity and ionization fronts.',
  false,
  3,
  ARRAY['Siril', 'PixInsight', 'Raw Sensor Capture'],
  ARRAY['Astronomy', 'Astrophotography', 'Deep Sky'],
  '16/9',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- 6. ACHIEVEMENTS
INSERT INTO public.achievements (title, issuer, year, description, sort_order, published)
VALUES (
  'Digital Experience Foundation',
  'System Architecture',
  2024,
  'Completed Phase 0-8 modular creative engineering setup and verification.',
  1,
  true
) ON CONFLICT DO NOTHING;

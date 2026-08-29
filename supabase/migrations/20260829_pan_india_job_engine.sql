-- =====================================================================
-- ADITI SUPER APP — PAN-INDIA JOB AGGREGATION & MULTI-SOURCE ENGINE
-- Schema: job_sources, imported_jobs, and upgraded job_vacancies
-- =====================================================================

-- 1. Job Sources Registry Table
CREATE TABLE IF NOT EXISTS public.job_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'government', 'aggregator_api', 'company_career', 'state_portal', 'ats', 'direct'
  country TEXT DEFAULT 'India',
  state TEXT,
  base_url TEXT NOT NULL,
  api_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  requires_api_key BOOLEAN DEFAULT FALSE,
  api_key_env_var TEXT,
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_interval_minutes INTEGER DEFAULT 720,
  total_imported INTEGER DEFAULT 0,
  total_active INTEGER DEFAULT 0,
  status_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enhanced Job Vacancies Table (with Pan-India & Multi-Source Attribution)
CREATE TABLE IF NOT EXISTS public.job_vacancies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  job_type TEXT NOT NULL,
  work_mode TEXT DEFAULT 'onsite',
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  state TEXT DEFAULT 'India',
  pincode TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_remote BOOLEAN DEFAULT FALSE,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_period TEXT DEFAULT 'month',
  salary_formatted TEXT NOT NULL,
  experience_required TEXT NOT NULL,
  qualification_required TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  contact_avatar TEXT,
  openings_count INTEGER DEFAULT 1,
  is_urgent BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT TRUE,
  application_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  is_saved BOOLEAN DEFAULT FALSE,
  posted_by_user_id TEXT,
  
  -- Multi-Source & Pan-India Fields
  source_type TEXT DEFAULT 'direct', -- 'direct', 'government', 'aggregator_api', 'company_career', 'state_portal'
  primary_source TEXT,
  sources JSONB DEFAULT '[]'::jsonb,
  canonical_apply_url TEXT,
  apply_mode TEXT DEFAULT 'in_app', -- 'in_app', 'external_redirect', 'official_email'
  fingerprint TEXT,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_vacancies_fingerprint ON public.job_vacancies(fingerprint);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_state ON public.job_vacancies(state);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_city ON public.job_vacancies(city);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_category ON public.job_vacancies(category);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_source_type ON public.job_vacancies(source_type);

-- Enable RLS
ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_vacancies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on job_sources" ON public.job_sources FOR SELECT USING (true);
CREATE POLICY "Allow update on job_sources" ON public.job_sources FOR ALL USING (true);

CREATE POLICY "Allow public read on job_vacancies" ON public.job_vacancies FOR SELECT USING (true);
CREATE POLICY "Allow all operations on job_vacancies" ON public.job_vacancies FOR ALL USING (true);

-- Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_sources;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_vacancies;

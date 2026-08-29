-- =========================================================================
-- Migration: Pan-India Job Aggregation Scalability & Sync Run Infrastructure
-- Creates job_sync_runs, job_sync_configs, and high-performance database indexes
-- =========================================================================

-- 1. Job Sync Runs Log Table
CREATE TABLE IF NOT EXISTS public.job_sync_runs (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'running', -- 'running', 'completed', 'partial', 'failed'
  pages_scanned INTEGER NOT NULL DEFAULT 0,
  jobs_discovered INTEGER NOT NULL DEFAULT 0,
  jobs_inserted INTEGER NOT NULL DEFAULT 0,
  jobs_updated INTEGER NOT NULL DEFAULT 0,
  jobs_expired INTEGER NOT NULL DEFAULT 0,
  duplicates INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  duration_ms INTEGER DEFAULT 0,
  error_details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Job Sync Configuration Table
CREATE TABLE IF NOT EXISTS public.job_sync_configs (
  id TEXT PRIMARY KEY DEFAULT 'default',
  page_size INTEGER NOT NULL DEFAULT 20,
  max_pages_per_run INTEGER NOT NULL DEFAULT 10,
  max_jobs_per_run INTEGER NOT NULL DEFAULT 200,
  concurrency INTEGER NOT NULL DEFAULT 4,
  stale_after_hours INTEGER NOT NULL DEFAULT 48,
  expire_after_hours INTEGER NOT NULL DEFAULT 168,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Performance Indexes on job_vacancies for High-Yield Search & Deduplication
CREATE INDEX IF NOT EXISTS idx_job_vacancies_fingerprint ON public.job_vacancies(fingerprint);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_state_city ON public.job_vacancies(state, city);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_category ON public.job_vacancies(category);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_source_type ON public.job_vacancies(source_type);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_status ON public.job_vacancies(status);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_created_at ON public.job_vacancies(created_at DESC);

-- Enable RLS with public access policies for Aditi Super App marketplace
ALTER TABLE public.job_sync_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_sync_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view and create job_sync_runs" ON public.job_sync_runs;
CREATE POLICY "Public can view and create job_sync_runs"
  ON public.job_sync_runs FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view and manage job_sync_configs" ON public.job_sync_configs;
CREATE POLICY "Public can view and manage job_sync_configs"
  ON public.job_sync_configs FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

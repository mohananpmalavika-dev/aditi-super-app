-- ============================================================================
-- NewsOS Core Database Schema Migration
-- Multilingual • Story-Centric • Claim Verification • Live News • Audit Logging
-- ============================================================================

-- 1. NEWS SOURCES REGISTRY
CREATE TABLE IF NOT EXISTS news_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  state TEXT,
  district TEXT,
  language TEXT NOT NULL DEFAULT 'both',
  category TEXT,
  rss_url TEXT,
  api_endpoint TEXT,
  authentication_type TEXT DEFAULT 'none',
  reliability_score NUMERIC(5,2) DEFAULT 85.00,
  ownership_metadata TEXT,
  license_status TEXT DEFAULT 'official_gov',
  usage_policy JSONB NOT NULL DEFAULT '{"attributionRequired": true, "commercialUseAllowed": false, "imageUsageAllowed": true, "canonicalUrlRequired": true}',
  update_frequency_minutes INT DEFAULT 60,
  last_successful_fetch TIMESTAMPTZ,
  last_failure TIMESTAMPTZ,
  failure_count INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INGESTED SOURCE DOCUMENTS
CREATE TABLE IF NOT EXISTS news_source_documents (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES news_sources(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  source_url TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  title TEXT NOT NULL,
  raw_content TEXT NOT NULL,
  clean_content TEXT NOT NULL,
  summary TEXT,
  author TEXT,
  publication_time TIMESTAMPTZ NOT NULL,
  retrieved_at TIMESTAMPTZ DEFAULT NOW(),
  language TEXT NOT NULL DEFAULT 'en',
  media JSONB DEFAULT '[]'::jsonb,
  content_hash TEXT NOT NULL,
  category TEXT,
  district TEXT,
  state TEXT,
  status TEXT DEFAULT 'raw'
);

-- 3. STORIES (AUTHORITATIVE DOMAIN OBJECT)
CREATE TABLE IF NOT EXISTS news_stories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  primary_title TEXT NOT NULL,
  story_type TEXT NOT NULL DEFAULT 'routine',
  status TEXT NOT NULL DEFAULT 'DISCOVERED',
  importance TEXT NOT NULL DEFAULT 'normal',
  breaking_status BOOLEAN DEFAULT FALSE,
  risk_level TEXT NOT NULL DEFAULT 'low',
  risk_score INT DEFAULT 15,
  verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  confidence_score INT DEFAULT 80,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_updated_at TIMESTAMPTZ DEFAULT NOW(),
  event_start_time TIMESTAMPTZ,
  primary_location TEXT NOT NULL,
  state TEXT,
  district TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  categories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  entities TEXT[] DEFAULT '{}',
  source_document_ids TEXT[] DEFAULT '{}',
  sources_count INT DEFAULT 1,
  claims_count INT DEFAULT 0,
  verified_claims_count INT DEFAULT 0,
  timeline JSONB DEFAULT '[]'::jsonb,
  primary_image_url TEXT,
  image_caption TEXT,
  ai_generated_percentage INT DEFAULT 40,
  is_auto_publish_eligible BOOLEAN DEFAULT FALSE,
  reviewed_by TEXT,
  published_at TIMESTAMPTZ
);

-- 4. CLAIMS & EVIDENCE
CREATE TABLE IF NOT EXISTS news_claims (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL REFERENCES news_stories(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  importance TEXT NOT NULL DEFAULT 'medium',
  risk TEXT NOT NULL DEFAULT 'low',
  verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
  confidence NUMERIC(4,3) DEFAULT 0.850,
  source_support_count INT DEFAULT 1,
  source_conflict_count INT DEFAULT 0,
  first_observed_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_claim_evidence (
  id TEXT PRIMARY KEY,
  claim_id TEXT NOT NULL REFERENCES news_claims(id) ON DELETE CASCADE,
  source_document_id TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_authority_score INT DEFAULT 85,
  evidence_type TEXT NOT NULL DEFAULT 'SUPPORTS',
  quoted_fragment TEXT,
  explanation TEXT,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ARTICLES (MULTILINGUAL PROJECTIONS: EN & ML)
CREATE TABLE IF NOT EXISTS news_articles (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL REFERENCES news_stories(id) ON DELETE CASCADE,
  language TEXT NOT NULL, -- 'en' | 'ml'
  headline TEXT NOT NULL,
  subheadline TEXT,
  slug TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  key_points TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  district TEXT,
  state TEXT,
  tags TEXT[] DEFAULT '{}',
  authors TEXT[] DEFAULT '{"NewsOS Editorial AI"}',
  primary_image_url TEXT,
  image_caption TEXT,
  image_alt TEXT,
  ai_generated_percentage INT DEFAULT 40,
  reviewed_by TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  estimated_read_time_minutes INT DEFAULT 2,
  audio_duration_seconds INT,
  audio_voice_url TEXT
);

-- 6. ARTICLE VERSIONS, CORRECTIONS & RETRACTIONS
CREATE TABLE IF NOT EXISTS news_article_versions (
  id BIGSERIAL PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  version INT NOT NULL,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  key_points TEXT[] DEFAULT '{}',
  changed_by TEXT NOT NULL,
  change_reason TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_corrections (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  version INT NOT NULL,
  old_text TEXT NOT NULL,
  new_text TEXT NOT NULL,
  reason TEXT NOT NULL,
  initiated_by TEXT NOT NULL,
  approved_by TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 7. LIVE STORIES & REAL-TIME UPDATES
CREATE TABLE IF NOT EXISTS news_live_stories (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL REFERENCES news_stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_malayalam TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_update_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  category TEXT NOT NULL,
  district TEXT
);

CREATE TABLE IF NOT EXISTS news_live_updates (
  id TEXT PRIMARY KEY,
  live_story_id TEXT NOT NULL REFERENCES news_live_stories(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  headline TEXT NOT NULL,
  content TEXT NOT NULL,
  sources TEXT[] DEFAULT '{}',
  verification_status TEXT NOT NULL DEFAULT 'VERIFIED',
  author_type TEXT NOT NULL DEFAULT 'ai_assisted',
  author_name TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT FALSE
);

-- 8. FACT CHECKS
CREATE TABLE IF NOT EXISTS news_fact_checks (
  id TEXT PRIMARY KEY,
  story_id TEXT REFERENCES news_stories(id) ON DELETE SET NULL,
  claim TEXT NOT NULL,
  claimant TEXT NOT NULL,
  original_source_url TEXT,
  classification TEXT NOT NULL,
  rating_score INT DEFAULT 90,
  explanation TEXT NOT NULL,
  explanation_malayalam TEXT,
  evidence_points TEXT[] DEFAULT '{}',
  debunk_sources TEXT[] DEFAULT '{}',
  reviewer TEXT NOT NULL,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AI USAGE & COST TRACKING
CREATE TABLE IF NOT EXISTS news_ai_usage (
  id TEXT PRIMARY KEY,
  story_id TEXT,
  agent_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  operation TEXT NOT NULL,
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  estimated_cost_usd NUMERIC(8,6) DEFAULT 0.000000,
  latency_ms INT DEFAULT 0,
  success BOOLEAN DEFAULT TRUE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AUDIT LOGS
CREATE TABLE IF NOT EXISTS news_audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_news_stories_status ON news_stories(status);
CREATE INDEX IF NOT EXISTS idx_news_stories_category ON news_stories USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_news_stories_district ON news_stories(district);
CREATE INDEX IF NOT EXISTS idx_news_stories_breaking ON news_stories(breaking_status);
CREATE INDEX IF NOT EXISTS idx_news_articles_lang_status ON news_articles(language, status);
CREATE INDEX IF NOT EXISTS idx_news_articles_slug ON news_articles(slug);
CREATE INDEX IF NOT EXISTS idx_news_claims_story ON news_claims(story_id);
CREATE INDEX IF NOT EXISTS idx_news_live_updates_live_story ON news_live_updates(live_story_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_news_fact_checks_pub ON news_fact_checks(published_at DESC);

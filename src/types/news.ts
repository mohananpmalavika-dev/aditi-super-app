/**
 * NewsOS Data Models and Type Definitions
 * Authoritative Story-Centric Architecture with atomic Claims, Evidence, 
 * Multilingual Projections (English + Malayalam), Live Updates, Fact Checks,
 * Editorial Review, AI Cost Tracking, and Audit Logs.
 */

export type NewsLanguage = 'en' | 'ml';

export type StoryStatus = 
  | 'DISCOVERED'
  | 'CLUSTERING'
  | 'RESEARCHING'
  | 'VERIFYING'
  | 'DRAFTING'
  | 'AWAITING_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'LIVE'
  | 'UPDATED'
  | 'CORRECTED'
  | 'RETRACTED'
  | 'ARCHIVED';

export type StoryImportance = 'low' | 'normal' | 'high' | 'breaking' | 'critical';

export type RiskLevel = 'low' | 'medium' | 'high';

export type ClaimVerificationStatus = 
  | 'VERIFIED'
  | 'LIKELY_TRUE'
  | 'UNVERIFIED'
  | 'CONFLICTING'
  | 'FALSE'
  | 'OUTDATED';

export type EvidenceType = 'SUPPORTS' | 'CONTRADICTS' | 'PARTIAL' | 'UNRELATED' | 'UNCERTAIN';

export type NewsSourceType = 
  | 'GOVERNMENT'
  | 'NEWS_AGENCY'
  | 'RSS'
  | 'API'
  | 'WEBSITE'
  | 'PRESS_RELEASE'
  | 'SOCIAL'
  | 'USER_SUBMISSION'
  | 'MANUAL';

export type FactCheckRating = 
  | 'TRUE'
  | 'MOSTLY_TRUE'
  | 'MISLEADING'
  | 'UNVERIFIED'
  | 'MOSTLY_FALSE'
  | 'FALSE'
  | 'OUTDATED';

export type AutomationLevel = 
  | 'MANUAL'
  | 'AI_ASSISTED'
  | 'SEMI_AUTOMATIC'
  | 'AUTOMATIC_LOW_RISK';

export type NewsCategory = 
  | 'Top Stories'
  | 'Kerala'
  | 'India'
  | 'World'
  | 'Politics'
  | 'Business & Economy'
  | 'Technology & AI'
  | 'Sports'
  | 'Health & Science'
  | 'Entertainment'
  | 'Education & Jobs'
  | 'Environment & Weather'
  | 'Fact Check'
  | 'Opinion & Explainers'
  | 'District News';

export type KeralaDistrict = 
  | 'All Districts'
  | 'Thiruvananthapuram'
  | 'Kollam'
  | 'Pathanamthitta'
  | 'Alappuzha'
  | 'Kottayam'
  | 'Idukki'
  | 'Ernakulam'
  | 'Thrissur'
  | 'Palakkad'
  | 'Malappuram'
  | 'Kozhikode'
  | 'Wayanad'
  | 'Kannur'
  | 'Kasaragod';

// ==================== SOURCE MANAGEMENT ====================

export interface ContentUsagePolicy {
  attributionRequired: boolean;
  commercialUseAllowed: boolean;
  excerptLimitWords?: number;
  imageUsageAllowed: boolean;
  canonicalUrlRequired: boolean;
}

export interface NewsSource {
  id: string;
  name: string;
  type: NewsSourceType;
  url: string;
  country: string;
  state?: string;
  district?: string;
  language: NewsLanguage | 'both';
  category?: NewsCategory;
  rssUrl?: string;
  apiEndpoint?: string;
  authenticationType?: 'none' | 'api_key' | 'bearer' | 'oauth2';
  reliabilityScore: number; // 0 - 100
  ownershipMetadata?: string;
  licenseStatus: 'public_domain' | 'licensed' | 'fair_use_summary' | 'official_gov' | 'restricted';
  usagePolicy: ContentUsagePolicy;
  updateFrequencyMinutes: number;
  lastSuccessfulFetch?: string;
  lastFailure?: string;
  failureCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SourceDocumentMedia {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  caption?: string;
  author?: string;
  copyrightOwner?: string;
  license?: string;
}

export interface SourceDocument {
  id: string;
  sourceId: string;
  sourceName: string;
  sourceType: NewsSourceType;
  sourceUrl: string;
  canonicalUrl: string;
  title: string;
  rawContent: string;
  cleanContent: string;
  summary?: string;
  author?: string;
  publicationTime: string;
  retrievedAt: string;
  language: NewsLanguage;
  media: SourceDocumentMedia[];
  contentHash: string;
  category?: NewsCategory;
  district?: string;
  state?: string;
  status: 'raw' | 'clustered' | 'archived';
}

// ==================== CLAIMS & EVIDENCE ====================

export interface ClaimEvidence {
  id: string;
  claimId: string;
  sourceDocumentId: string;
  sourceName: string;
  sourceUrl: string;
  sourceAuthorityScore: number; // 0 - 100
  evidenceType: EvidenceType;
  quotedFragment: string;
  explanation: string;
  verifiedAt: string;
}

export interface ClaimConflict {
  id: string;
  claimId: string;
  conflictingSourceA: { sourceName: string; statement: string };
  conflictingSourceB: { sourceName: string; statement: string };
  unresolvedAspect: string;
  reportedAt: string;
  status: 'active' | 'reconciled';
}

export interface Claim {
  id: string;
  storyId: string;
  text: string;
  claimType: 'official_action' | 'casualty_figure' | 'statement' | 'event_occurrence' | 'scientific_fact' | 'allegation';
  importance: 'critical' | 'high' | 'medium' | 'supporting';
  risk: RiskLevel;
  verificationStatus: ClaimVerificationStatus;
  confidence: number; // 0 - 1
  sourceSupportCount: number;
  sourceConflictCount: number;
  evidence: ClaimEvidence[];
  conflicts?: ClaimConflict[];
  firstObservedAt: string;
  lastVerifiedAt: string;
}

// ==================== STORY (AUTHORITATIVE OBJECT) ====================

export interface StoryTimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  sourceName?: string;
}

export interface NewsStory {
  id: string;
  slug: string;
  primaryTitle: string;
  storyType: 'developing' | 'routine' | 'breaking' | 'investigative' | 'fact_check' | 'explainer';
  status: StoryStatus;
  importance: StoryImportance;
  breakingStatus: boolean;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  verificationStatus: ClaimVerificationStatus;
  confidenceScore: number; // 0 - 100
  firstSeenAt: string;
  lastUpdatedAt: string;
  eventStartTime?: string;
  primaryLocation: string;
  state?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  categories: NewsCategory[];
  tags: string[];
  entities: string[];
  sourceDocumentIds: string[];
  sourcesCount: number;
  claimsCount: number;
  verifiedClaimsCount: number;
  timeline: StoryTimelineEvent[];
  primaryImageUrl?: string;
  imageCaption?: string;
  aiGeneratedPercentage: number;
  isAutoPublishEligible: boolean;
  reviewedBy?: string;
  publishedAt?: string;
}

// ==================== ARTICLES (MULTILINGUAL PROJECTIONS) ====================

export interface ArticleVersion {
  version: number;
  headline: string;
  summary: string;
  body: string;
  keyPoints: string[];
  changedBy: string;
  changeReason: string;
  timestamp: string;
}

export interface ArticleCorrection {
  id: string;
  articleId: string;
  version: number;
  oldText: string;
  newText: string;
  reason: string;
  initiatedBy: string;
  approvedBy: string;
  timestamp: string;
}

export interface ArticleRetraction {
  id: string;
  articleId: string;
  reason: string;
  retractedBy: string;
  retractedAt: string;
}

export interface NewsArticle {
  id: string;
  storyId: string;
  language: NewsLanguage;
  headline: string;
  subheadline?: string;
  slug: string;
  summary: string;
  body: string;
  keyPoints: string[];
  category: NewsCategory;
  district?: string;
  state?: string;
  tags: string[];
  authors: string[];
  primaryImageUrl?: string;
  imageCaption?: string;
  imageAlt?: string;
  aiGeneratedPercentage: number;
  reviewedBy?: string;
  status: 'draft' | 'awaiting_review' | 'published' | 'corrected' | 'retracted';
  publishedAt?: string;
  updatedAt?: string;
  versions: ArticleVersion[];
  corrections: ArticleCorrection[];
  retraction?: ArticleRetraction;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  estimatedReadTimeMinutes: number;
  audioDurationSeconds?: number;
  audioVoiceUrl?: string;
}

// ==================== LIVE STORY ENGINE ====================

export interface LiveUpdate {
  id: string;
  liveStoryId: string;
  timestamp: string;
  headline: string;
  content: string;
  sources: string[];
  verificationStatus: ClaimVerificationStatus;
  authorType: 'ai_assisted' | 'human_editor' | 'official_bulletin';
  authorName: string;
  isUrgent?: boolean;
}

export interface LiveStory {
  id: string;
  storyId: string;
  title: string;
  titleMalayalam?: string;
  status: 'active' | 'paused' | 'concluded';
  startedAt: string;
  lastUpdateAt: string;
  endedAt?: string;
  category: NewsCategory;
  district?: string;
  updates: LiveUpdate[];
}

// ==================== FACT CHECK MODULE ====================

export interface FactCheck {
  id: string;
  storyId?: string;
  claim: string;
  claimant: string;
  originalSourceUrl?: string;
  classification: FactCheckRating;
  ratingScore: number; // 0 - 100
  explanation: string;
  explanationMalayalam?: string;
  evidencePoints: string[];
  debunkSources: string[];
  reviewer: string;
  publishedAt: string;
}

// ==================== EDITORIAL REVIEW & AI NEWSROOM ====================

export interface EditorialReviewTask {
  id: string;
  storyId: string;
  priority: 'p0_breaking' | 'p1_high_risk' | 'p2_routine';
  riskScore: number;
  riskReasons: string[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 're_research_requested';
  assignedTo?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface AIUsageRecord {
  id: string;
  storyId?: string;
  agentName: string;
  provider: 'Gemini' | 'OpenAI' | 'Anthropic' | 'Local';
  model: string;
  operation: 'extract_claims' | 'verify' | 'draft_en' | 'draft_ml' | 'headline' | 'seo' | 'qa_assistant';
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  success: boolean;
  timestamp: string;
}

export interface PromptTemplate {
  name: string;
  version: number;
  task: string;
  language: NewsLanguage | 'all';
  systemPrompt: string;
  userTemplate: string;
  model: string;
  temperature: number;
  active: boolean;
  updatedAt: string;
}

export interface NewsAuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: 
    | 'PUBLISH_ARTICLE'
    | 'AUTO_PUBLISH'
    | 'APPROVE_STORY'
    | 'REJECT_STORY'
    | 'CORRECT_ARTICLE'
    | 'RETRACT_ARTICLE'
    | 'CHANGE_SOURCE_TRUST'
    | 'KILL_SWITCH_TRIGGERED'
    | 'PROMPT_UPDATED'
    | 'FACT_CHECK_PUBLISHED';
  resourceType: 'story' | 'article' | 'source' | 'live_update' | 'system';
  resourceId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

// ==================== EDITORIAL CONTROLS & KILL SWITCHES ====================

export interface NewsroomKillSwitches {
  stopAllAutoPublish: boolean;
  stopAllAiAgents: boolean;
  stopPushNotifications: boolean;
  stopSocialPublishing: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface NewsroomMetrics {
  storiesDiscoveredToday: number;
  activeStoryClusters: number;
  claimsVerifiedToday: number;
  autoPublishedToday: number;
  editorialReviewQueueCount: number;
  highRiskAlertsCount: number;
  breakingStoriesCount: number;
  activeLiveStoriesCount: number;
  factChecksPublishedCount: number;
  aiCostTodayUsd: number;
  averageVerificationLatencySeconds: number;
}

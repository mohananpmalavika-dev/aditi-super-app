import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getRegisteredNewsSources, 
  toggleNewsSource, 
  updateSourceTrustScore 
} from '../services/news/newsSourceService';
import { 
  cleanRawArticleContent, 
  generateContentHash, 
  detectArticleLocation,
  getIngestedSourceDocuments,
  ingestNewDocument
} from '../services/news/newsIngestionService';
import { 
  calculateDocumentSimilarity, 
  getNewsStories, 
  clusterDocumentToStory 
} from '../services/news/newsClusteringService';
import { 
  getNewsClaims, 
  calculateEditorialRiskScore, 
  extractAndVerifyStoryClaims 
} from '../services/news/newsClaimVerificationService';
import { 
  localizeJournalisticMalayalam, 
  MALAYALAM_ENTITY_DICTIONARY,
  getAIUsageLogs,
  recordAIUsage
} from '../services/news/newsAIEngine';
import { 
  getNewsArticles, 
  filterArticles, 
  generateArticlesFromStory, 
  recordArticleCorrection, 
  retractArticle 
} from '../services/news/newsArticleService';
import { 
  getLiveStories, 
  addLiveUpdate 
} from '../services/news/newsLiveStoryService';
import { 
  getFactChecks, 
  createFactCheck 
} from '../services/news/newsFactCheckService';
import { 
  getNewsroomKillSwitches, 
  updateNewsroomKillSwitches, 
  getEditorialReviewTasks, 
  runDocumentOrchestrationPipeline,
  approveAndPublishStory,
  getNewsroomMetrics
} from '../services/news/newsWorkflowOrchestrator';
import { getNewsAuditLogs, recordNewsAuditLog } from '../services/news/newsAuditService';
import { askNewsAI } from '../services/news/newsAskAiService';
import { generateDailyNewsBulletin } from '../services/news/newsAudioService';
import { NewsSource, SourceDocument } from '../types/news';

describe('NewsOS: Production AI Newsroom & Digital News Platform Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Source Management & Trust Scoring', () => {
    it('initializes with official government, weather, and agency sources', () => {
      const sources = getRegisteredNewsSources();
      expect(sources.length).toBeGreaterThanOrEqual(5);
      expect(sources.some(s => s.id === 'src-kerala-prd')).toBe(true);
      expect(sources.some(s => s.id === 'src-imd-weather')).toBe(true);
      expect(sources.some(s => s.id === 'src-isro-official')).toBe(true);
    });

    it('toggles source active status and persists', () => {
      const updated = toggleNewsSource('src-kerala-prd', false);
      const prd = updated.find(s => s.id === 'src-kerala-prd');
      expect(prd?.active).toBe(false);
    });

    it('updates dynamic trust score within 0-100 bounds', () => {
      const updated = updateSourceTrustScore('src-imd-weather', 99, '100% weather forecast verification accuracy');
      const imd = updated.find(s => s.id === 'src-imd-weather');
      expect(imd?.reliabilityScore).toBe(99);
    });
  });

  describe('2. Ingestion Engine & Text Normalization', () => {
    it('cleans raw HTML and ads artifacts from incoming text', () => {
      const dirtyHtml = '<div><script>alert(1)</script><p>Kerala <b>Red Alert</b> announced.&nbsp;</p></div>';
      const clean = cleanRawArticleContent(dirtyHtml);
      expect(clean).toBe('Kerala Red Alert announced.');
    });

    it('generates consistent deterministic content hash', () => {
      const hash1 = generateContentHash('Title', 'Content', 'https://example.com/1');
      const hash2 = generateContentHash('Title', 'Content', 'https://example.com/1');
      expect(hash1).toBe(hash2);
    });

    it('detects Kerala districts and Indian states from text', () => {
      const loc1 = detectArticleLocation('High rainfall reported across Kozhikode and Wayanad ghats.');
      expect(loc1.district).toBe('Kozhikode');
      expect(loc1.state).toBe('Kerala');

      const loc2 = detectArticleLocation('Meeting held in New Delhi with finance officials.');
      expect(loc2.state).toBe('Delhi');
    });

    it('ingests new source document and deduplicates by content hash', () => {
      const source = getRegisteredNewsSources()[0];
      const doc1 = ingestNewDocument(source, 'Test Headline Ingestion', 'This is a test article body.', 'https://prd.kerala.gov.in/test-1');
      expect(doc1.id).toBeDefined();
      expect(doc1.contentHash).toBeDefined();

      const allDocs = getIngestedSourceDocuments();
      expect(allDocs.some(d => d.contentHash === doc1.contentHash)).toBe(true);
    });
  });

  describe('3. Story Clustering & Confidence Engine', () => {
    it('calculates document similarity using token Jaccard index', () => {
      const docA = {
        title: 'IMD Red Alert for Kozhikode Wayanad Kannur',
        cleanContent: 'Heavy monsoon rainfall expected in northern Kerala.'
      } as SourceDocument;

      const docB = {
        title: 'KSDMA Control Rooms Opened for Kozhikode Wayanad Red Alert',
        cleanContent: 'Disaster management teams deployed in northern Kerala for rainfall.'
      } as SourceDocument;

      const sim = calculateDocumentSimilarity(docA, docB);
      expect(sim).toBeGreaterThan(0.20);
    });

    it('clusters incoming document into existing Story when related', () => {
      const allDocs = getIngestedSourceDocuments();
      const existingStory = getNewsStories()[0];

      const newDoc: SourceDocument = {
        id: 'doc-supplement-1',
        sourceId: 'src-kerala-prd',
        sourceName: 'PRD Kerala',
        sourceType: 'GOVERNMENT',
        sourceUrl: 'https://prd.kerala.gov.in/supplement-1',
        canonicalUrl: 'https://prd.kerala.gov.in/supplement-1',
        title: 'Kozhikode Wayanad Monsoon Red Alert Update',
        rawContent: 'Heavy monsoon rainfall in Kozhikode and Wayanad.',
        cleanContent: 'Heavy monsoon rainfall in Kozhikode and Wayanad.',
        publicationTime: new Date().toISOString(),
        retrievedAt: new Date().toISOString(),
        language: 'en',
        media: [],
        contentHash: 'hash_supplement_1',
        status: 'raw'
      };

      const { story, isNewStory } = clusterDocumentToStory(newDoc);
      expect(story.id).toBe(existingStory.id);
      expect(isNewStory).toBe(false);
      expect(story.sourceDocumentIds).toContain('doc-supplement-1');
    });
  });

  describe('4. Claim Extraction, Evidence & Risk Assessment', () => {
    it('extracts atomic factual claims from story source documents', () => {
      const story = getNewsStories()[0];
      const claims = extractAndVerifyStoryClaims(story);
      expect(claims.length).toBeGreaterThan(0);
      expect(claims[0].evidence.length).toBeGreaterThan(0);
      expect(claims[0].verificationStatus).toBe('VERIFIED');
    });

    it('computes low editorial risk for verified government weather feeds', () => {
      const assessment = calculateEditorialRiskScore('IMD Red Alert', 'Heavy monsoon rainfall forecast', true);
      expect(assessment.riskLevel).toBe('low');
      expect(assessment.riskScore).toBeLessThan(30);
    });

    it('computes high editorial risk for unverified political scam allegations', () => {
      const assessment = calculateEditorialRiskScore('Election rigging and scam allegation', 'Massive corruption charge against politician', false);
      expect(assessment.riskLevel).toBe('high');
      expect(assessment.riskScore).toBeGreaterThanOrEqual(60);
    });
  });

  describe('5. Native Malayalam Journalism & Transliteration Engine', () => {
    it('translates official terms and district names using native Malayalam dictionary', () => {
      expect(MALAYALAM_ENTITY_DICTIONARY['Thiruvananthapuram']).toBe('തിരുവനന്തപുരം');
      expect(MALAYALAM_ENTITY_DICTIONARY['Kozhikode']).toBe('കോഴിക്കോട്');
      expect(MALAYALAM_ENTITY_DICTIONARY['Red Alert']).toBe('റെഡ് അലർട്ട്');
      expect(MALAYALAM_ENTITY_DICTIONARY['KSDMA']).toBe('സംസ്ഥാന ദുരന്ത നിവാരണ അതോറിറ്റി');
    });

    it('generates high-standard journalistic Malayalam headline, summary, and body', () => {
      const ml = localizeJournalisticMalayalam(
        'IMD Declares Red Alert for 4 Northern Kerala Districts',
        'Extremely heavy rainfall expected in northern Kerala.',
        'Environment & Weather'
      );

      expect(ml.headlineMl).toContain('റെഡ് അലർട്ട്');
      expect(ml.summaryMl).toContain('കേന്ദ്ര കാലാവസ്ഥാ വകുപ്പ്');
      expect(ml.keyPointsMl.length).toBeGreaterThan(0);
    });
  });

  describe('6. Bilingual Article Generation, Versioning & Corrections', () => {
    it('generates both English and Malayalam articles for a verified story', () => {
      const story = getNewsStories()[0];
      const { enArticle, mlArticle } = generateArticlesFromStory(story);

      expect(enArticle.language).toBe('en');
      expect(mlArticle.language).toBe('ml');
      expect(enArticle.storyId).toBe(story.id);
      expect(mlArticle.storyId).toBe(story.id);
      expect(mlArticle.headline).toContain('റെഡ് അലർട്ട്');
    });

    it('records reader-visible corrections with immutable version snapshots', () => {
      const articles = getNewsArticles();
      const target = articles[0];

      const corrected = recordArticleCorrection(
        target.id,
        'August 30',
        'August 30 and 31',
        'Updated to reflect extended two-day forecast',
        'Reporter Desk',
        'Senior Duty Editor'
      );

      expect(corrected).not.toBeNull();
      expect(corrected?.status).toBe('corrected');
      expect(corrected?.corrections.length).toBeGreaterThanOrEqual(1);
      expect(corrected?.versions.length).toBeGreaterThanOrEqual(1);
    });

    it('retracts erroneous articles with audit reason without silently deleting', () => {
      const articles = getNewsArticles();
      const target = articles[0];

      const retracted = retractArticle(target.id, 'Retracted due to invalid external bulletin', 'Editor-in-Chief');
      expect(retracted?.status).toBe('retracted');
      expect(retracted?.retraction?.reason).toContain('Retracted due to invalid external bulletin');
    });
  });

  describe('7. Live Story Engine & Fact Checking', () => {
    it('retrieves active live stories and pushes timestamped updates', () => {
      const live = getLiveStories()[0];
      expect(live).toBeDefined();
      expect(live.status).toBe('active');

      const updated = addLiveUpdate(live.id, {
        headline: 'Rainfall intensifies in Vythiri',
        content: 'Local disaster relief teams stationed at riverbanks.',
        sources: ['Vythiri Taluk Office']
      });

      expect(updated?.updates[0].headline).toBe('Rainfall intensifies in Vythiri');
    });

    it('creates and verifies fact checks with debunk evidence', () => {
      const fc = createFactCheck({
        claim: 'Fake government holiday circular',
        claimant: 'Viral WhatsApp forwards',
        classification: 'FALSE',
        ratingScore: 98,
        explanation: 'The order is forged and no statewide holiday has been declared.',
        evidencePoints: ['Department of General Education confirmed order is invalid.'],
        debunkSources: ['PRD Kerala Fact Check'],
        reviewer: 'Senior Fact Checker'
      });

      expect(fc.classification).toBe('FALSE');
      expect(getFactChecks().some(f => f.id === fc.id)).toBe(true);
    });
  });

  describe('8. Grounded Ask News AI Reader Assistant', () => {
    it('answers reader queries strictly using verified portal news with citations', async () => {
      const answer = await askNewsAI('What is the weather red alert in Kozhikode?', 'en');
      expect(answer.confidence).toBeGreaterThan(0.8);
      expect(answer.citedArticles.length).toBeGreaterThan(0);
      expect(answer.answer).toContain('Kozhikode');
    });

    it('answers reader queries in Malayalam with proper citations', async () => {
      const answer = await askNewsAI('കാലാവസ്ഥ റെഡ് അലർട്ട് എന്താണ്?', 'ml');
      expect(answer.confidence).toBeGreaterThan(0.8);
      expect(answer.citedArticles.length).toBeGreaterThan(0);
    });
  });

  describe('9. End-to-End Orchestrator, Kill Switches & Audit Trail', () => {
    it('auto-publishes low-risk official documents and logs audit event', () => {
      const source = getRegisteredNewsSources()[0];
      const doc = ingestNewDocument(
        source,
        'Kerala Health Monsoon Alert',
        'Statewide prevention measures activated for monsoon fevers.',
        'https://prd.kerala.gov.in/health-alert-2026'
      );

      const result = runDocumentOrchestrationPipeline(doc);
      expect(result.autoPublished).toBe(true);
      expect(result.story.status).toBe('PUBLISHED');

      const auditLogs = getNewsAuditLogs();
      expect(auditLogs.some(l => l.action === 'AUTO_PUBLISH')).toBe(true);
    });

    it('toggles emergency kill switches and persists state', () => {
      const updated = updateNewsroomKillSwitches({ stopAllAutoPublish: true });
      expect(updated.stopAllAutoPublish).toBe(true);

      const reloaded = getNewsroomKillSwitches();
      expect(reloaded.stopAllAutoPublish).toBe(true);
    });

    it('computes accurate live newsroom telemetry metrics', () => {
      const metrics = getNewsroomMetrics();
      expect(metrics.storiesDiscoveredToday).toBeGreaterThan(0);
      expect(metrics.activeStoryClusters).toBeGreaterThan(0);
      expect(metrics.claimsVerifiedToday).toBeGreaterThan(0);
    });
  });

  describe('10. Audio News & Daily 5-Minute Bulletin', () => {
    it('generates structured 5-minute news briefing scripts in English and Malayalam', () => {
      const articles = getNewsArticles();
      const bulletinEn = generateDailyNewsBulletin(articles, 'en');
      expect(bulletinEn.title).toContain('Briefing');
      expect(bulletinEn.bulletinScript).toContain('Hello and welcome');

      const bulletinMl = generateDailyNewsBulletin(articles, 'ml');
      expect(bulletinMl.title).toContain('വാർത്തകൾ');
      expect(bulletinMl.bulletinScript).toContain('നമസ്കാരം');
    });
  });
});

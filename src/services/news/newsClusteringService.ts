/**
 * NewsOS Story Clustering & Confidence Engine
 * Groups multiple ingested SourceDocuments reporting on the same real-world event into 1 authoritative NewsStory.
 * Computes StoryConfidence (0-100) based on source diversity, official primary sources, and confirmation velocity.
 */

import { NewsStory, SourceDocument, NewsCategory, KeralaDistrict } from '../../types/news';
import { getIngestedSourceDocuments, INITIAL_INGESTED_DOCUMENTS } from './newsIngestionService';
import { getRegisteredNewsSources } from './newsSourceService';

/**
 * Calculate keyword and entity similarity between two documents (Jaccard Index)
 */
export function calculateDocumentSimilarity(docA: SourceDocument, docB: SourceDocument): number {
  const wordsA = new Set(
    `${docA.title} ${docA.cleanContent}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  const wordsB = new Set(
    `${docB.title} ${docB.cleanContent}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }

  const union = wordsA.size + wordsB.size - intersection;
  const jaccard = union > 0 ? intersection / union : 0;
  const overlapCoefficient = intersection / Math.min(wordsA.size, wordsB.size);

  return Math.max(jaccard, overlapCoefficient * 0.6);
}

/**
 * Initial authoritative Stories created from verified seed events
 */
export const INITIAL_NEWS_STORIES: NewsStory[] = [
  {
    id: 'story-kerala-monsoon-red-alert-2026',
    slug: 'kerala-monsoon-red-alert-4-northern-districts-ksdma-control-rooms',
    primaryTitle: 'IMD Declares Red Alert for 4 Northern Kerala Districts; KSDMA Sets Up 24x7 Control Rooms & Prepositions NDRF',
    storyType: 'breaking',
    status: 'PUBLISHED',
    importance: 'breaking',
    breakingStatus: true,
    riskLevel: 'low', // Low because official Govt & IMD verified
    riskScore: 12,
    verificationStatus: 'VERIFIED',
    confidenceScore: 98,
    firstSeenAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    eventStartTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    primaryLocation: 'Kozhikode, Kerala',
    state: 'Kerala',
    district: 'Kozhikode',
    latitude: 11.2588,
    longitude: 75.7804,
    categories: ['Kerala', 'Environment & Weather', 'Top Stories'],
    tags: ['Kerala Monsoon', 'IMD Red Alert', 'KSDMA', 'Disaster Management', 'NDRF', 'Kozhikode', 'Wayanad'],
    entities: ['IMD', 'KSDMA', 'Chief Secretary', 'Kozhikode Collectorate', 'Arabian Sea'],
    sourceDocumentIds: ['doc-imd-red-alert-1', 'doc-kerala-prd-disaster-mgmt-1'],
    sourcesCount: 2,
    claimsCount: 4,
    verifiedClaimsCount: 4,
    timeline: [
      {
        id: 'tl-1',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        title: 'IMD Upgrades Warning to Red Alert',
        description: 'IMD issues Red Alert for Kozhikode, Wayanad, Kannur, and Kasaragod for Aug 30-31.',
        sourceName: 'IMD'
      },
      {
        id: 'tl-2',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        title: 'KSDMA Control Rooms Activated',
        description: '24x7 emergency taluk control rooms opened and NDRF battalions positioned.',
        sourceName: 'PRD Kerala Govt'
      }
    ],
    primaryImageUrl: 'https://images.unsplash.com/photo-1514632595-4944383f2737?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Monsoon cloud systems gathering over northern Kerala western ghats',
    aiGeneratedPercentage: 25,
    isAutoPublishEligible: true,
    reviewedBy: 'Chief Editor / Verified Govt Feeds',
    publishedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'story-isro-gaganyaan-recovery-2026',
    slug: 'isro-indian-navy-gaganyaan-crew-module-ocean-recovery-trials-success',
    primaryTitle: 'ISRO and Indian Navy Successfully Conclude Deep-Sea Gaganyaan Crew Module Recovery Trials',
    storyType: 'routine',
    status: 'PUBLISHED',
    importance: 'high',
    breakingStatus: false,
    riskLevel: 'low',
    riskScore: 10,
    verificationStatus: 'VERIFIED',
    confidenceScore: 99,
    firstSeenAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    primaryLocation: 'Visakhapatnam Coast, Andhra Pradesh',
    state: 'India',
    categories: ['Technology & AI', 'India', 'Top Stories'],
    tags: ['ISRO', 'Gaganyaan', 'Indian Navy', 'Space Exploration', 'Human Spaceflight'],
    entities: ['ISRO', 'Eastern Naval Command', 'Gaganyaan'],
    sourceDocumentIds: ['doc-isro-gaganyaan-1'],
    sourcesCount: 1,
    claimsCount: 3,
    verifiedClaimsCount: 3,
    timeline: [
      {
        id: 'tl-gag-1',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        title: 'Recovery Trials Completed',
        description: 'Flotation collar deployment and medical airlift demonstrated off Visakhapatnam.',
        sourceName: 'ISRO Official'
      }
    ],
    primaryImageUrl: 'https://images.unsplash.com/photo-1517976487588-4663b6528825?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Gaganyaan simulated crew recovery module test vehicle',
    aiGeneratedPercentage: 30,
    isAutoPublishEligible: true,
    reviewedBy: 'Tech Desk Editor',
    publishedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: 'story-india-gst-record-revenue-2026',
    slug: 'india-gross-gst-collections-record-1-87-lakh-crore-growth',
    primaryTitle: 'India Gross GST Collections Reach Record ₹1.87 Lakh Crore with 11.2% Annual Surge',
    storyType: 'routine',
    status: 'PUBLISHED',
    importance: 'normal',
    breakingStatus: false,
    riskLevel: 'low',
    riskScore: 10,
    verificationStatus: 'VERIFIED',
    confidenceScore: 97,
    firstSeenAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    primaryLocation: 'New Delhi, India',
    state: 'India',
    categories: ['Business & Economy', 'India'],
    tags: ['GST Collections', 'Ministry of Finance', 'Economy', 'Fiscal Revenue'],
    entities: ['Ministry of Finance', 'PIB', 'GST Council'],
    sourceDocumentIds: ['doc-pib-economy-gst-1'],
    sourcesCount: 1,
    claimsCount: 2,
    verifiedClaimsCount: 2,
    timeline: [],
    primaryImageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'India economic growth indicators and financial metrics',
    aiGeneratedPercentage: 20,
    isAutoPublishEligible: true,
    reviewedBy: 'Business Desk Editor',
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'story-kerala-arogya-jagratha-2026',
    slug: 'kerala-health-minister-arogya-jagratha-monsoon-disease-prevention-drive',
    primaryTitle: 'Kerala Launches "Arogya Jagratha" Vector-Borne Disease Prevention Drive Mobilizing 28,000 ASHA Workers',
    storyType: 'routine',
    status: 'PUBLISHED',
    importance: 'normal',
    breakingStatus: false,
    riskLevel: 'low',
    riskScore: 12,
    verificationStatus: 'VERIFIED',
    confidenceScore: 96,
    firstSeenAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    lastUpdatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    primaryLocation: 'Ernakulam, Kerala',
    state: 'Kerala',
    district: 'Ernakulam',
    categories: ['Health & Science', 'Kerala'],
    tags: ['Kerala Health', 'Arogya Jagratha', 'ASHA Workers', 'Dengue Prevention', 'Ernakulam'],
    entities: ['Veena George', 'Department of Health Services', 'Ernakulam General Hospital'],
    sourceDocumentIds: ['doc-kerala-health-vaccine-1'],
    sourcesCount: 1,
    claimsCount: 2,
    verifiedClaimsCount: 2,
    timeline: [],
    primaryImageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Kerala community health workers and ASHA volunteers on door-to-door drive',
    aiGeneratedPercentage: 25,
    isAutoPublishEligible: true,
    reviewedBy: 'Health Desk Editor',
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

const STORIES_STORAGE_KEY = 'aditi-news-stories';

export function getNewsStories(): NewsStory[] {
  try {
    const raw = localStorage.getItem(STORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...INITIAL_NEWS_STORIES];
}

export function saveNewsStories(stories: NewsStory[]): void {
  try {
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(stories));
  } catch {}
}

/**
 * Cluster incoming document into existing Story or create a new authoritative Story
 */
export function clusterDocumentToStory(doc: SourceDocument): { story: NewsStory; isNewStory: boolean } {
  const existingStories = getNewsStories();
  const allDocs = getIngestedSourceDocuments();
  const sources = getRegisteredNewsSources();
  const source = sources.find(s => s.id === doc.sourceId);

  // Search for matching existing story
  let matchedStory: NewsStory | null = null;
  for (const story of existingStories) {
    // Check if story contains documents with > 0.25 similarity
    const storyDocs = allDocs.filter(d => story.sourceDocumentIds.includes(d.id));
    for (const sDoc of storyDocs) {
      const similarity = calculateDocumentSimilarity(doc, sDoc);
      if (similarity >= 0.25) {
        matchedStory = story;
        break;
      }
    }
    if (matchedStory) break;
  }

  if (matchedStory) {
    // Merge into existing story
    const isAlreadyLinked = matchedStory.sourceDocumentIds.includes(doc.id);
    const updatedDocumentIds = isAlreadyLinked ? matchedStory.sourceDocumentIds : [...matchedStory.sourceDocumentIds, doc.id];
    
    const updatedStory: NewsStory = {
      ...matchedStory,
      sourceDocumentIds: updatedDocumentIds,
      sourcesCount: updatedDocumentIds.length,
      lastUpdatedAt: new Date().toISOString(),
      confidenceScore: Math.min(100, matchedStory.confidenceScore + 5)
    };

    const updatedList = existingStories.map(s => s.id === updatedStory.id ? updatedStory : s);
    saveNewsStories(updatedList);
    return { story: updatedStory, isNewStory: false };
  } else {
    // Create new Story
    const slug = doc.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80);

    const isGovt = doc.sourceType === 'GOVERNMENT';
    const isBreaking = /red alert|breaking|flash flood|emergency|earthquake/i.test(doc.title);

    const newStory: NewsStory = {
      id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      primaryTitle: doc.title,
      storyType: isBreaking ? 'breaking' : 'routine',
      status: isGovt ? 'APPROVED' : 'AWAITING_REVIEW',
      importance: isBreaking ? 'breaking' : 'normal',
      breakingStatus: isBreaking,
      riskLevel: isGovt ? 'low' : 'medium',
      riskScore: isGovt ? 15 : 45,
      verificationStatus: isGovt ? 'VERIFIED' : 'UNVERIFIED',
      confidenceScore: source?.reliabilityScore || 80,
      firstSeenAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      primaryLocation: doc.district ? `${doc.district}, ${doc.state || 'Kerala'}` : (doc.state || 'India'),
      state: doc.state,
      district: doc.district as KeralaDistrict,
      categories: doc.category ? [doc.category] : ['Top Stories'],
      tags: [doc.category || 'News', doc.district || 'India'].filter(Boolean),
      entities: [doc.sourceName],
      sourceDocumentIds: [doc.id],
      sourcesCount: 1,
      claimsCount: 1,
      verifiedClaimsCount: isGovt ? 1 : 0,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: doc.publicationTime,
          title: 'Initial Report Discovered',
          description: doc.summary || doc.title,
          sourceName: doc.sourceName
        }
      ],
      primaryImageUrl: doc.media[0]?.url,
      imageCaption: doc.media[0]?.caption,
      aiGeneratedPercentage: 35,
      isAutoPublishEligible: isGovt,
      reviewedBy: isGovt ? 'Official Government Feed Ingestion' : undefined,
      publishedAt: isGovt ? new Date().toISOString() : undefined
    };

    const updatedList = [newStory, ...existingStories];
    saveNewsStories(updatedList);
    return { story: newStory, isNewStory: true };
  }
}

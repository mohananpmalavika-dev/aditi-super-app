/**
 * NewsOS Live Story Engine
 * Powers real-time developing stories with timestamped rolling updates (e.g. weather emergencies, space launches).
 */

import { LiveStory, LiveUpdate } from '../../types/news';

export const INITIAL_LIVE_STORIES: LiveStory[] = [
  {
    id: 'live-kerala-monsoon-2026',
    storyId: 'story-kerala-monsoon-red-alert-2026',
    title: 'LIVE: Kerala Monsoon Surge — Red Alert in 4 Northern Districts & Disaster Management Updates',
    titleMalayalam: 'തത്സമയം: കേരള കാലവർഷം — 4 വടക്കൻ ജില്ലകളിൽ റെഡ് അലർട്ട്; കൺട്രോൾ റൂമുകൾ സജ്ജം',
    status: 'active',
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    lastUpdateAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    category: 'Environment & Weather',
    district: 'Kozhikode',
    updates: [
      {
        id: 'upd-1',
        liveStoryId: 'live-kerala-monsoon-2026',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        headline: 'NDRF Battalions Arrive in Wayanad and Kozhikode',
        content: 'Two battalions of the National Disaster Response Force have reached sensitive river basin areas in Kozhikode and Wayanad for standby emergency response.',
        sources: ['KSDMA Official Release'],
        verificationStatus: 'VERIFIED',
        authorType: 'official_bulletin',
        authorName: 'Disaster Management Desk',
        isUrgent: false
      },
      {
        id: 'upd-2',
        liveStoryId: 'live-kerala-monsoon-2026',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        headline: 'School Holiday Declared in 3 Hilly Taluks of Wayanad',
        content: 'District Collector Wayanad announces a precautionary holiday for all schools and Anganwadis in Vythiri, Mananthavady, and Sulthan Bathery taluks.',
        sources: ['District Collectorate Wayanad'],
        verificationStatus: 'VERIFIED',
        authorType: 'official_bulletin',
        authorName: 'Wayanad District Desk',
        isUrgent: true
      },
      {
        id: 'upd-3',
        liveStoryId: 'live-kerala-monsoon-2026',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        headline: 'IMD Upgrades Weather Warning to Red Alert for 4 Districts',
        content: 'Extremely heavy rainfall exceeding 204.4 mm forecast for Kozhikode, Wayanad, Kannur, and Kasaragod districts on Aug 30-31.',
        sources: ['IMD Regional Meteorological Centre'],
        verificationStatus: 'VERIFIED',
        authorType: 'ai_assisted',
        authorName: 'IMD Weather Feed',
        isUrgent: true
      }
    ]
  }
];

const LIVE_STORIES_KEY = 'aditi-news-live-stories';

export function getLiveStories(): LiveStory[] {
  try {
    const raw = localStorage.getItem(LIVE_STORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...INITIAL_LIVE_STORIES];
}

export function saveLiveStories(stories: LiveStory[]): void {
  try {
    localStorage.setItem(LIVE_STORIES_KEY, JSON.stringify(stories));
  } catch {}
}

export function addLiveUpdate(
  liveStoryId: string,
  update: {
    headline: string;
    content: string;
    sources: string[];
    authorName?: string;
    isUrgent?: boolean;
  }
): LiveStory | null {
  const stories = getLiveStories();
  const target = stories.find(s => s.id === liveStoryId);
  if (!target) return null;

  const newUpdate: LiveUpdate = {
    id: `upd-${Date.now()}`,
    liveStoryId,
    timestamp: new Date().toISOString(),
    headline: update.headline,
    content: update.content,
    sources: update.sources,
    verificationStatus: 'VERIFIED',
    authorType: 'human_editor',
    authorName: update.authorName || 'NewsOS Live Desk',
    isUrgent: update.isUrgent || false
  };

  const updatedStory: LiveStory = {
    ...target,
    lastUpdateAt: new Date().toISOString(),
    updates: [newUpdate, ...target.updates]
  };

  const updatedList = stories.map(s => s.id === liveStoryId ? updatedStory : s);
  saveLiveStories(updatedList);
  return updatedStory;
}

/**
 * NewsOS Audio News & Daily AI Bulletin Service
 * Powers "Listen to Article" Text-to-Speech playback in English & Malayalam,
 * speed adjustments (0.75x to 2x), and generates 5-minute Morning/Evening audio bulletins.
 */

import { NewsArticle, NewsLanguage } from '../../types/news';

export interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentArticleId: string | null;
  playbackRate: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  language: NewsLanguage;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function playArticleSpeech(
  article: NewsArticle,
  playbackRate: number = 1.0,
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const textToRead = `${article.headline}. ${article.summary}. ${article.body}`;
  const utterance = new SpeechSynthesisUtterance(textToRead);
  
  utterance.rate = Math.min(2.0, Math.max(0.75, playbackRate));
  utterance.pitch = 1.0;
  
  if (article.language === 'ml') {
    utterance.lang = 'ml-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  // Pick suitable voice if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(article.language === 'ml' ? 'ml' : 'en'));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    activeUtterance = null;
    if (onError) onError(e);
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopArticleSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function pauseArticleSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeArticleSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

/**
 * Generate 5-minute Daily Morning/Evening Briefing Script
 */
export function generateDailyNewsBulletin(articles: NewsArticle[], language: NewsLanguage = 'en'): {
  title: string;
  bulletinScript: string;
  durationMinutes: number;
} {
  const filtered = articles.filter(a => a.language === language).slice(0, 5);
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : (new Date().getHours() < 17 ? 'Afternoon' : 'Evening');
  
  if (language === 'ml') {
    const lines = filtered.map((a, i) => `${i + 1}. ${a.headline}`);
    const script = `നമസ്കാരം, ന്യൂസ്ഒഎസ് ${timeOfDay === 'Morning' ? 'പ്രഭാത' : 'സായാഹ്ന'} വാർത്താ ബുള്ളറ്റിനിലേക്ക് സ്വാഗതം. ഇന്നത്തെ പ്രധാന വാർത്തകൾ: \n\n${lines.join('\n\n')}\n\nവിശദമായ വാർത്തകൾക്കായി അദിതി ന്യൂസ് പോർട്ടൽ സന്ദർശിക്കുക. നന്ദി.`;
    return {
      title: `ന്യൂസ്ഒഎസ് ${timeOfDay === 'Morning' ? 'പ്രഭാത' : 'സായാഹ്ന'} വാർത്തകൾ`,
      bulletinScript: script,
      durationMinutes: 3
    };
  }

  const lines = filtered.map((a, i) => `${i + 1}. ${a.headline}`);
  const script = `Hello and welcome to the NewsOS ${timeOfDay} Briefing. Here are today's top stories: \n\n${lines.join('\n\n')}\n\nStay tuned to Aditi Super App for continuous live updates.`;
  return {
    title: `NewsOS 5-Minute ${timeOfDay} Briefing`,
    bulletinScript: script,
    durationMinutes: 3
  };
}

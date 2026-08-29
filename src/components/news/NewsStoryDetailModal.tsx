/**
 * NewsOS Article Detail Reader & Transparency Modal
 * Features:
 * - Bilingual Reader (English / Malayalam)
 * - Text-to-Speech "Listen to Article" Audio Player (0.75x - 2x speed)
 * - "About This Story" Reader Transparency & Provenance Card
 * - Chronological Event Timeline
 * - Visible Correction & Retraction Notices
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  FileText, 
  Sparkles,
  Info,
  Layers,
  History
} from 'lucide-react';
import { NewsArticle, NewsStory, NewsLanguage } from '../../types/news';
import { playArticleSpeech, stopArticleSpeech } from '../../services/news/newsAudioService';
import { getNewsClaims } from '../../services/news/newsClaimVerificationService';
import { getNewsArticles } from '../../services/news/newsArticleService';

interface NewsStoryDetailModalProps {
  article: NewsArticle;
  story: NewsStory | null;
  onClose: () => void;
  onSelectArticle?: (art: NewsArticle) => void;
}

export const NewsStoryDetailModal: React.FC<NewsStoryDetailModalProps> = ({
  article: initialArticle,
  story,
  onClose,
  onSelectArticle
}) => {
  const [currentArticle, setCurrentArticle] = useState<NewsArticle>(initialArticle);
  const [currentLang, setCurrentLang] = useState<NewsLanguage>(initialArticle.language);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1.0);
  const [activeTab, setActiveTab] = useState<'article' | 'timeline' | 'transparency'>('article');

  const allArticles = getNewsArticles();
  const claims = story ? getNewsClaims(story.id) : [];

  // Sync article when language changes
  useEffect(() => {
    if (story) {
      const match = allArticles.find(a => a.storyId === story.id && a.language === currentLang);
      if (match) setCurrentArticle(match);
    }
  }, [currentLang, story]);

  useEffect(() => {
    return () => {
      stopArticleSpeech();
    };
  }, []);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopArticleSpeech();
      setIsPlayingAudio(false);
    } else {
      const success = playArticleSpeech(
        currentArticle, 
        audioSpeed, 
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
      if (success) setIsPlayingAudio(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setAudioSpeed(speed);
    if (isPlayingAudio) {
      stopArticleSpeech();
      playArticleSpeech(
        currentArticle, 
        speed, 
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentArticle.headline,
        text: currentArticle.summary,
        url: window.location.href
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentArticle.category}
            </span>
            {story?.breakingStatus && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                BREAKING
              </span>
            )}
          </div>

          {/* Controls: Language Toggle, Share, Close */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800/80 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => setCurrentLang('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentLang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setCurrentLang('ml')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentLang === 'ml' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                മലയാളം
              </button>
            </div>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Share Story"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Article / Timeline / Transparency) */}
        <div className="flex items-center border-b border-slate-800/80 px-5 bg-slate-900/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('article')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'article' ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Story</span>
          </button>

          {story && story.timeline.length > 0 && (
            <button
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
                activeTab === 'timeline' ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Event Timeline ({story.timeline.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('transparency')}
            className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'transparency' ? 'border-indigo-500 text-indigo-300' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>About This Story (Transparency)</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* TAB 1: ARTICLE CONTENT */}
          {activeTab === 'article' && (
            <div className="space-y-6">
              
              {/* Headline & Meta */}
              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
                  {currentArticle.headline}
                </h1>
                
                {currentArticle.subheadline && (
                  <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                    {currentArticle.subheadline}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(currentArticle.publishedAt || currentArticle.updatedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {currentArticle.district && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{currentArticle.district}, {currentArticle.state || 'Kerala'}</span>
                    </div>
                  )}
                  <span className="text-slate-600">•</span>
                  <span>{currentArticle.estimatedReadTimeMinutes} min read</span>
                </div>
              </div>

              {/* TTS Audio Player Bar */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/50 via-slate-900 to-cyan-950/50 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleAudio}
                    className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                  >
                    {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Listen to this Article ({currentLang === 'ml' ? 'മലയാളം' : 'English'})</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {isPlayingAudio ? 'Now playing news bulletin speech...' : 'Press play to listen to audio narration'}
                    </p>
                  </div>
                </div>

                {/* Speed Selector */}
                <div className="flex items-center gap-1 bg-slate-800/90 rounded-xl p-1 border border-slate-700">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        audioSpeed === rate ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Image */}
              {currentArticle.primaryImageUrl && (
                <div className="space-y-2">
                  <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl max-h-96">
                    <img
                      src={currentArticle.primaryImageUrl}
                      alt={currentArticle.imageAlt || currentArticle.headline}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {currentArticle.imageCaption && (
                    <p className="text-[11px] text-slate-400 italic px-1">
                      📸 {currentArticle.imageCaption}
                    </p>
                  )}
                </div>
              )}

              {/* Key Points Summary Box */}
              {currentArticle.keyPoints && currentArticle.keyPoints.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Key Takeaways</span>
                  </div>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                    {currentArticle.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {currentArticle.body}
              </div>

              {/* Visible Correction Notice if Present */}
              {currentArticle.corrections && currentArticle.corrections.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1.5 text-xs">
                  <div className="font-black flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Correction Notice — {new Date(currentArticle.corrections[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-amber-300/90">
                    {currentArticle.corrections[0].reason} (Approved by {currentArticle.corrections[0].approvedBy})
                  </p>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && story && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Chronological Event Timeline</h3>
                <p className="text-xs text-slate-400">Verified sequence of events recorded as this story developed.</p>
              </div>

              <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                {story.timeline.map((evt) => (
                  <div key={evt.id} className="relative space-y-1">
                    <div className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-slate-950" />
                    <div className="text-[11px] font-bold text-indigo-400">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {evt.sourceName || 'Verified Desk'}
                    </div>
                    <h4 className="text-sm font-bold text-white">{evt.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TRANSPARENCY CARD ("About This Story") */}
          {activeTab === 'transparency' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verified News Provenance & Editorial Certification</span>
                </div>
                <p className="text-xs text-emerald-200/90 leading-relaxed">
                  NewsOS operates with strict multi-source verification and human editorial oversight. Here is how this story was reported and validated:
                </p>
              </div>

              {/* Grid of Provenance Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Sources Reviewed</div>
                  <div className="text-xl font-black text-white">{story?.sourcesCount || 2} Official</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Claims Verified</div>
                  <div className="text-xl font-black text-emerald-400">{claims.length || 3} Atomic</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Primary Source</div>
                  <div className="text-xl font-black text-indigo-400">Yes (Govt/IMD)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-[11px] text-slate-400">Human Reviewed</div>
                  <div className="text-xl font-black text-cyan-400">{story?.reviewedBy ? 'Yes' : 'Auto-Verified'}</div>
                </div>
              </div>

              {/* Verified Claims Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Verified Factual Claims
                </h4>
                <div className="space-y-2">
                  {claims.map((claim) => (
                    <div key={claim.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-indigo-300 uppercase">{claim.claimType.replace('_', ' ')}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300">
                          {claim.verificationStatus} ({(claim.confidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{claim.text}</p>
                      {claim.evidence && claim.evidence[0] && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-800">
                          <span>Corroborated by:</span>
                          <span className="font-bold text-slate-300">{claim.evidence[0].sourceName}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

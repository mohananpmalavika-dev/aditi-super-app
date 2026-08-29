/**
 * NewsOS AI Newsroom Editorial Control Center (Newsroom Dashboard)
 * Professional workspace for Managing Editors, Journalists, and Fact-Checkers.
 * Features:
 * - Live KPI Metrics
 * - Story Clusters & Multi-Source Document Inspector
 * - Editorial Review Queue & Claim Verification Desk
 * - Live Story Publisher
 * - Source Trust Management & Feeds
 * - AI Prompt & Cost Center
 * - Emergency Kill Switches
 * - Audit Logs Explorer
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  CheckSquare, 
  Radio, 
  Globe, 
  Cpu, 
  ShieldAlert, 
  History, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  Plus, 
  Search, 
  ArrowRight, 
  Sliders,
  DollarSign,
  Activity,
  FileCheck,
  Send,
  Eye,
  Settings
} from 'lucide-react';
import { 
  NewsStory, 
  NewsArticle, 
  NewsSource, 
  EditorialReviewTask, 
  NewsroomKillSwitches, 
  NewsroomMetrics,
  LiveStory,
  FactCheck
} from '../../types/news';
import { getNewsStories, saveNewsStories } from '../../services/news/newsClusteringService';
import { getNewsArticles, saveNewsArticles } from '../../services/news/newsArticleService';
import { getRegisteredNewsSources, toggleNewsSource, updateSourceTrustScore } from '../../services/news/newsSourceService';
import { 
  getEditorialReviewTasks, 
  approveAndPublishStory, 
  getNewsroomKillSwitches, 
  updateNewsroomKillSwitches, 
  getNewsroomMetrics 
} from '../../services/news/newsWorkflowOrchestrator';
import { getLiveStories, addLiveUpdate } from '../../services/news/newsLiveStoryService';
import { getFactChecks, createFactCheck } from '../../services/news/newsFactCheckService';
import { getAIUsageLogs, INITIAL_PROMPT_TEMPLATES } from '../../services/news/newsAIEngine';
import { getNewsAuditLogs } from '../../services/news/newsAuditService';
import { getNewsClaims } from '../../services/news/newsClaimVerificationService';

interface NewsroomDashboardProps {
  onSwitchToReaderMode: () => void;
  onSelectArticlePreview?: (art: NewsArticle) => void;
}

export const NewsroomDashboard: React.FC<NewsroomDashboardProps> = ({
  onSwitchToReaderMode,
  onSelectArticlePreview
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'clusters' | 'review' | 'live' | 'sources' | 'ai_cost' | 'kill_switches' | 'audit'>('metrics');
  const [stories, setStories] = useState<NewsStory[]>(getNewsStories());
  const [articles, setArticles] = useState<NewsArticle[]>(getNewsArticles());
  const [sources, setSources] = useState<NewsSource[]>(getRegisteredNewsSources());
  const [reviewTasks, setReviewTasks] = useState<EditorialReviewTask[]>(getEditorialReviewTasks());
  const [killSwitches, setKillSwitches] = useState<NewsroomKillSwitches>(getNewsroomKillSwitches());
  const [liveStories, setLiveStories] = useState<LiveStory[]>(getLiveStories());
  const [factChecks, setFactChecks] = useState<FactCheck[]>(getFactChecks());
  const [metrics, setMetrics] = useState<NewsroomMetrics>(getNewsroomMetrics());
  const [searchFilter, setSearchFilter] = useState('');

  // Selected review story for side-by-side inspection
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(stories[0]?.id || null);

  // Live Update Form State
  const [newLiveHeadline, setNewLiveHeadline] = useState('');
  const [newLiveContent, setNewLiveContent] = useState('');
  const [newLiveSources, setNewLiveSources] = useState('');

  const refreshAllData = () => {
    setStories(getNewsStories());
    setArticles(getNewsArticles());
    setSources(getRegisteredNewsSources());
    setReviewTasks(getEditorialReviewTasks());
    setKillSwitches(getNewsroomKillSwitches());
    setLiveStories(getLiveStories());
    setFactChecks(getFactChecks());
    setMetrics(getNewsroomMetrics());
  };

  const handleApproveStory = (storyId: string) => {
    approveAndPublishStory(storyId, 'Senior Editor (Newsroom UI)');
    refreshAllData();
  };

  const handleToggleKillSwitch = (key: keyof NewsroomKillSwitches) => {
    const updated = updateNewsroomKillSwitches({ [key]: !killSwitches[key] });
    setKillSwitches(updated);
  };

  const handleAddLiveUpdate = (liveStoryId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newLiveHeadline.trim() || !newLiveContent.trim()) return;

    addLiveUpdate(liveStoryId, {
      headline: newLiveHeadline.trim(),
      content: newLiveContent.trim(),
      sources: newLiveSources ? newLiveSources.split(',').map(s => s.trim()) : ['Newsroom Live Desk']
    });

    setNewLiveHeadline('');
    setNewLiveContent('');
    setNewLiveSources('');
    refreshAllData();
  };

  const selectedStory = stories.find(s => s.id === selectedStoryId) || stories[0];
  const selectedStoryArticles = selectedStory ? articles.filter(a => a.storyId === selectedStory.id) : [];
  const selectedStoryClaims = selectedStory ? getNewsClaims(selectedStory.id) : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Newsroom Control Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                NewsOS <span className="text-indigo-400">Editorial Newsroom</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">AI-Assisted • Human-Governed • Multilingual (EN + ML)</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={refreshAllData}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh All Feeds"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onSwitchToReaderMode}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-black shadow-lg shadow-indigo-500/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>Public Reader Portal →</span>
          </button>
        </div>
      </header>

      {/* Main Newsroom Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800/80 bg-slate-900/40 p-3 space-y-1">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-3 py-2">
            Newsroom Desk
          </div>

          {[
            { id: 'metrics', label: 'Dashboard KPI', icon: <LayoutDashboard className="w-4 h-4" />, count: null },
            { id: 'clusters', label: 'Story Clusters', icon: <Layers className="w-4 h-4" />, count: stories.length },
            { id: 'review', label: 'Editorial Review', icon: <CheckSquare className="w-4 h-4" />, count: reviewTasks.filter(t => t.status === 'pending').length },
            { id: 'live', label: 'Live Stories', icon: <Radio className="w-4 h-4" />, count: liveStories.filter(l => l.status === 'active').length },
            { id: 'sources', label: 'Sources & Trust', icon: <Globe className="w-4 h-4" />, count: sources.length },
            { id: 'ai_cost', label: 'AI Prompts & Cost', icon: <DollarSign className="w-4 h-4" />, count: null },
            { id: 'kill_switches', label: 'Emergency Kill Switches', icon: <ShieldAlert className="w-4 h-4 text-red-400" />, count: null },
            { id: 'audit', label: 'Audit Logs', icon: <History className="w-4 h-4" />, count: null },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== null && item.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === item.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* ==================== TAB 1: KPI DASHBOARD ==================== */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">Newsroom Performance & Automation Overview</h2>
                <p className="text-xs text-slate-400">Real-time telemetry on discovery, clustering, verification, and autonomous throughput.</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Stories Discovered Today</div>
                  <div className="text-2xl font-black text-white">{metrics.storiesDiscoveredToday}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">100% Ingested</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Active Story Clusters</div>
                  <div className="text-2xl font-black text-indigo-400">{metrics.activeStoryClusters}</div>
                  <div className="text-[10px] text-slate-400">Unified across sources</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Claims Verified</div>
                  <div className="text-2xl font-black text-emerald-400">{metrics.claimsVerifiedToday}</div>
                  <div className="text-[10px] text-emerald-400">Multi-source confirmed</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Auto-Published (Low Risk)</div>
                  <div className="text-2xl font-black text-cyan-400">{metrics.autoPublishedToday}</div>
                  <div className="text-[10px] text-cyan-400">Verified Govt & Weather</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Editorial Review Queue</div>
                  <div className="text-2xl font-black text-amber-400">{metrics.editorialReviewQueueCount}</div>
                  <div className="text-[10px] text-amber-400 font-bold">Awaiting Human Review</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Active Live Stories</div>
                  <div className="text-2xl font-black text-red-400">{metrics.activeLiveStoriesCount}</div>
                  <div className="text-[10px] text-red-400">Rolling updates active</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Fact-Checks Published</div>
                  <div className="text-2xl font-black text-purple-400">{metrics.factChecksPublishedCount}</div>
                  <div className="text-[10px] text-purple-400">Viral Rumors Debunked</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">AI Cost Today (USD)</div>
                  <div className="text-2xl font-black text-emerald-400">${metrics.aiCostTodayUsd}</div>
                  <div className="text-[10px] text-slate-400">Avg {metrics.averageVerificationLatencySeconds}s latency</div>
                </div>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Run Full Ingestion & Multi-Source Story Cluster Sync</span>
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Triggers autonomous harvesting across PRD Kerala, PIB India, IMD Weather, and News Agencies.
                  </p>
                </div>
                <button
                  onClick={refreshAllData}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Sync Feeds Now</span>
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: STORY CLUSTERS ==================== */}
          {activeTab === 'clusters' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-black text-white">Authoritative Story Clusters ({stories.length})</h2>
                  <p className="text-xs text-slate-400">Groups of multi-source documents representing single real-world events.</p>
                </div>
                <input
                  type="text"
                  placeholder="Filter stories..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {stories
                  .filter(s => !searchFilter || s.primaryTitle.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((story) => (
                    <div
                      key={story.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {story.categories[0] || 'Top Stories'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            story.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {story.status}
                          </span>
                          {story.breakingStatus && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                              ⚡ BREAKING
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Confidence: <strong className="text-white">{story.confidenceScore}%</strong></span>
                          <span>Risk: <strong className={story.riskScore < 30 ? 'text-emerald-400' : 'text-amber-400'}>{story.riskScore}/100</strong></span>
                        </div>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                        {story.primaryTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                        <div>Location: <span className="text-slate-200 font-bold">{story.primaryLocation}</span></div>
                        <div>Sources: <span className="text-slate-200 font-bold">{story.sourcesCount}</span></div>
                        <div>Verified Claims: <span className="text-emerald-400 font-bold">{story.verifiedClaimsCount}</span></div>
                        <div>First Seen: <span className="text-slate-300">{new Date(story.firstSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: EDITORIAL REVIEW DESK ==================== */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-black text-white">Editorial Review & Claim Verification Desk</h2>
                <p className="text-xs text-slate-400">Inspect atomic claims, risk flags, and bilingual AI drafts before human approval.</p>
              </div>

              {selectedStory && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  
                  {/* Left Column: Claims & Evidence */}
                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        <span>Factual Claims & Verification Evidence</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300">
                        {selectedStoryClaims.length} Claims
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedStoryClaims.map((claim) => (
                        <div key={claim.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-indigo-300 uppercase">{claim.claimType.replace('_', ' ')}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                              {claim.verificationStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-200">{claim.text}</p>
                          {claim.evidence && claim.evidence[0] && (
                            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                              <span>Source:</span>
                              <span className="font-bold text-slate-300">{claim.evidence[0].sourceName}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Risk Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                      <div className="font-bold text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Editorial Risk Assessment ({selectedStory.riskScore}/100 - {selectedStory.riskLevel.toUpperCase()})</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">
                        {selectedStory.riskScore < 30 ? 'Low risk official report eligible for auto-publishing.' : 'Requires editorial review before distribution.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Bilingual AI Drafts & Actions */}
                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400" />
                          <span>Generated Bilingual Projections (EN + ML)</span>
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-500/20 text-cyan-300">
                          {selectedStoryArticles.length} Drafts
                        </span>
                      </div>

                      {/* English Draft Preview */}
                      {selectedStoryArticles.find(a => a.language === 'en') && (
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                          <div className="text-[10px] font-bold text-indigo-400 uppercase">English Projection</div>
                          <h4 className="font-bold text-white text-xs">{selectedStoryArticles.find(a => a.language === 'en')?.headline}</h4>
                          <p className="text-slate-300 line-clamp-3 text-[11px]">{selectedStoryArticles.find(a => a.language === 'en')?.summary}</p>
                        </div>
                      )}

                      {/* Malayalam Draft Preview */}
                      {selectedStoryArticles.find(a => a.language === 'ml') && (
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                          <div className="text-[10px] font-bold text-indigo-400 uppercase">മലയാളം പ്രൊജക്ഷൻ (Native Transliteration)</div>
                          <h4 className="font-bold text-white text-xs">{selectedStoryArticles.find(a => a.language === 'ml')?.headline}</h4>
                          <p className="text-slate-300 line-clamp-3 text-[11px]">{selectedStoryArticles.find(a => a.language === 'ml')?.summary}</p>
                        </div>
                      )}
                    </div>

                    {/* Editorial Actions Buttons */}
                    <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => handleApproveStory(selectedStory.id)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Publish Story</span>
                      </button>

                      <button
                        onClick={() => alert('Re-research triggered for AI agents.')}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-colors"
                      >
                        Re-draft
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: LIVE DEVELOPING STORIES ==================== */}
          {activeTab === 'live' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-black text-white">Live Developing Story Control Desk</h2>
                <p className="text-xs text-slate-400">Push real-time timestamped updates to rolling live story tickers.</p>
              </div>

              {liveStories.map((live) => (
                <div key={live.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span>{live.title}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                      LIVE
                    </span>
                  </div>

                  {/* Add Update Form */}
                  <form onSubmit={(e) => handleAddLiveUpdate(live.id, e)} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-indigo-300">Push New Live Update</div>
                    <input
                      type="text"
                      placeholder="Update headline (e.g. NDRF teams reach Mananthavady)..."
                      value={newLiveHeadline}
                      onChange={(e) => setNewLiveHeadline(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <textarea
                      placeholder="Detailed update content..."
                      value={newLiveContent}
                      onChange={(e) => setNewLiveContent(e.target.value)}
                      rows={2}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        placeholder="Sources (e.g. Collector Office, IMD)..."
                        value={newLiveSources}
                        onChange={(e) => setNewLiveSources(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={!newLiveHeadline.trim() || !newLiveContent.trim()}
                        className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg shadow-red-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Push Update</span>
                      </button>
                    </div>
                  </form>

                  {/* List of Previous Updates */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-slate-400">Published Live Timeline ({live.updates.length})</div>
                    {live.updates.map((upd) => (
                      <div key={upd.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-white">{upd.headline}</span>
                          <span className="text-slate-400">{new Date(upd.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{upd.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== TAB 5: SOURCES & TRUST ==================== */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-black text-white">Registered News Sources & Trust Scores ({sources.length})</h2>
                <p className="text-xs text-slate-400">Official government feeds, news agencies, weather bureaus, and RSS feeds.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {sources.map((src) => (
                  <div key={src.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{src.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300">
                          {src.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">{src.url} • {src.country} {src.state ? `(${src.state})` : ''}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Trust Score</div>
                        <div className="text-sm font-black text-emerald-400">{src.reliabilityScore}/100</div>
                      </div>

                      <button
                        onClick={() => {
                          const updated = toggleNewsSource(src.id, !src.active);
                          setSources(updated);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          src.active ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {src.active ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 6: AI PROMPTS & COST ==================== */}
          {activeTab === 'ai_cost' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-black text-white">AI Agent Prompt Management & Cost Center</h2>
                <p className="text-xs text-slate-400">Versioned prompt templates and token cost telemetry per operation.</p>
              </div>

              {/* Prompts Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Active Versioned Prompts</h3>
                <div className="grid grid-cols-1 gap-3">
                  {INITIAL_PROMPT_TEMPLATES.map((tmpl, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{tmpl.name} (v{tmpl.version})</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                          {tmpl.model}
                        </span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        {tmpl.systemPrompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 7: KILL SWITCHES ==================== */}
          {activeTab === 'kill_switches' && (
            <div className="space-y-6">
              <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/30 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-black text-base">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Emergency SuperAdmin Kill Switches</span>
                </div>
                <p className="text-xs text-red-200/80 leading-relaxed">
                  These controls immediately halt autonomous pipelines and require manual confirmation. All activations are permanently recorded in audit logs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'stopAllAutoPublish', label: 'Stop All Auto-Publishing', desc: 'Forces every incoming low-risk story into human editorial review queue.' },
                  { key: 'stopAllAiAgents', label: 'Stop All AI Agents', desc: 'Disables autonomous research, writing, and translation workers.' },
                  { key: 'stopPushNotifications', label: 'Stop Push Notifications', desc: 'Halts all breaking news and emergency push notifications to readers.' },
                  { key: 'stopSocialPublishing', label: 'Stop Social Publishing', desc: 'Freezes all social media publishing channels and queues.' }
                ].map((sw) => {
                  const isActive = (killSwitches as any)[sw.key];
                  return (
                    <div key={sw.key} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{sw.label}</h4>
                        <p className="text-xs text-slate-400">{sw.desc}</p>
                      </div>

                      <button
                        onClick={() => handleToggleKillSwitch(sw.key as any)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                          isActive
                            ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {isActive ? '🛑 EMERGENCY STOP ACTIVE' : 'Normal Operation'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================== TAB 8: AUDIT LOGS ==================== */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-black text-white">Editorial Governance Audit Trail</h2>
                <p className="text-xs text-slate-400">Immutable records of all publishing decisions, corrections, retractions, and policy changes.</p>
              </div>

              <div className="space-y-2">
                {getNewsAuditLogs().map((log) => (
                  <div key={log.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-black text-indigo-400">{log.action}</span>
                      <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{log.details}</p>
                    <div className="text-[10px] text-slate-400">Actor: <span className="text-slate-300 font-bold">{log.actorName}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};

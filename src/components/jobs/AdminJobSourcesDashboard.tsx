import React, { useState } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Globe2, 
  Building2, 
  Landmark, 
  ExternalLink,
  SlidersHorizontal,
  Server,
  Zap
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobSource } from '../../types/superApp';

export const AdminJobSourcesDashboard: React.FC = () => {
  const { jobSources, toggleJobSource, syncJobSources, jobVacancies } = useSuperApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'government' | 'state_portal' | 'aggregator_api' | 'company_career'>('all');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    'System initialized with 9 Indian job source connectors.',
    'Deduplication engine active: Fingerprint format [company_title_city].',
    'Canonical URL prioritization: Direct Recruiter > Official Career > NCS > State > Aggregator.'
  ]);

  const handleSync = async (sourceId?: string, sourceName?: string) => {
    setIsSyncing(true);
    const label = sourceName || 'All India Sources';
    setSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] Triggered sync for ${label}...`, ...prev.slice(0, 15)]);
    
    try {
      const stats = await syncJobSources(sourceId);
      setSyncLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✅ Sync completed: Ingested ${stats.totalImported}, Merged ${stats.mergedDuplicates} duplicates. Active vacancies: ${stats.activeCount}.`,
        ...prev.slice(0, 15)
      ]);
    } catch (err: any) {
      setSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Sync failed: ${err?.message || 'Network error'}`, ...prev.slice(0, 15)]);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredSources = activeTab === 'all' 
    ? jobSources 
    : jobSources.filter(s => s.type === activeTab);

  const totalImportedAll = jobSources.reduce((acc, s) => acc + (s.totalImported || 0), 0);
  const activeSourcesCount = jobSources.filter(s => s.isActive).length;
  const aggregatedJobsCount = jobVacancies.filter(j => j.sourceType && j.sourceType !== 'direct').length;
  const directJobsCount = jobVacancies.filter(j => !j.sourceType || j.sourceType === 'direct').length;

  const getSourceTypeBadge = (type: string) => {
    switch (type) {
      case 'government':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Landmark className="w-3 h-3" /> Govt of India</span>;
      case 'state_portal':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Globe2 className="w-3 h-3" /> State Portal</span>;
      case 'company_career':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Building2 className="w-3 h-3" /> Corporate ATS</span>;
      case 'aggregator_api':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Layers className="w-3 h-3" /> Aggregator API</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20"><Server className="w-3 h-3" /> Direct Feed</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-2xl p-6 border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>Job Engine Control Plane</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Pan-India Job Data Sources</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Multi-source aggregation engine integrating India's National Career Service (NCS), State Employment Exchanges, Aggregator APIs (Jooble/Adzuna), and Top Corporate Career ATS Feeds with automated deduplication.
            </p>
          </div>

          <button
            onClick={() => handleSync()}
            disabled={isSyncing}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing Sources...' : 'Sync All Sources Now'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Total Active Sources</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{activeSourcesCount} / {jobSources.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">100% Connectors Online</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Aggregated Vacancies</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{aggregatedJobsCount}</div>
          <div className="text-[11px] text-cyan-400 mt-1 font-medium">NCS, State & Aggregators</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Direct Recruiter Jobs</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{directJobsCount}</div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">1-Click In-App Apply</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Total Lifetime Imported</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalImportedAll}</div>
          <div className="text-[11px] text-indigo-400 mt-1 font-medium">Deduplicated Pipeline</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Sources' },
          { id: 'government', label: 'Govt of India (NCS)' },
          { id: 'state_portal', label: 'State Exchanges' },
          { id: 'company_career', label: 'Corporate Careers' },
          { id: 'aggregator_api', label: 'Aggregator APIs' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className={`bg-slate-900/80 border rounded-2xl p-5 backdrop-blur-sm transition-all ${
              source.isActive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                {getSourceTypeBadge(source.type)}
                <h3 className="text-base font-bold text-white mt-2">{source.name}</h3>
                <a
                  href={source.baseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-indigo-400 flex items-center gap-1 mt-1 transition-colors"
                >
                  <span>{source.baseUrl.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <button
                onClick={() => toggleJobSource(source.id, !source.isActive)}
                className={`p-2 rounded-xl border transition-all ${
                  source.isActive 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                    : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                }`}
                title={source.isActive ? 'Disable Source' : 'Enable Source'}
              >
                {source.isActive ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-xs text-slate-400 mt-3 line-clamp-2">
              {source.statusMessage || `Active synchronization connector configured for ${source.country}.`}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Sync Cadence</span>
                <span className="font-semibold text-slate-300">Every {Math.round(source.syncIntervalMinutes / 60)} hrs</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Active Ingested</span>
                <span className="font-semibold text-white">{source.totalActive} listings</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => handleSync(source.id, source.name)}
                disabled={isSyncing || !source.isActive}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync This Source</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Sync Console / Logs */}
      <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span>Aggregation Ingestion & Deduplication Event Log</span>
        </div>
        <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto border border-slate-800/80">
          {syncLogs.map((log, index) => (
            <div key={index} className="leading-relaxed">
              <span className="text-indigo-400">&gt;</span> {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

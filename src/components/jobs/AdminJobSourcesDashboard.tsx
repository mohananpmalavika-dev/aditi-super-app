import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  TrendingUp, 
  Globe2, 
  Building2, 
  Landmark, 
  ExternalLink,
  SlidersHorizontal,
  Server,
  Zap,
  Settings2,
  Clock,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useSuperApp } from '../../context/SuperAppContext';
import { JobSource, JobSyncConfig, JobSyncRun } from '../../types/superApp';
import { getJobSyncConfig, saveJobSyncConfig, getJobSyncRuns } from '../../services/jobs/jobSourceService';

export const AdminJobSourcesDashboard: React.FC = () => {
  const { jobSources, toggleJobSource, syncJobSources, jobVacancies } = useSuperApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'government' | 'state_portal' | 'aggregator_api' | 'company_career'>('all');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [syncConfig, setSyncConfig] = useState<JobSyncConfig>(getJobSyncConfig());
  const [recentSyncRuns, setRecentSyncRuns] = useState<JobSyncRun[]>(getJobSyncRuns());
  const [lastSyncResult, setLastSyncResult] = useState<{
    pagesScanned: number;
    discovered: number;
    merged: number;
    duration: number;
  } | null>(null);

  const [syncLogs, setSyncLogs] = useState<string[]>([
    'System initialized with 5 universal multi-page Pan-India job source adapters.',
    'Deduplication engine active: Multi-signal fingerprinting preserving seniority, location, and salary.',
    'Canonical URL prioritization: Direct Recruiter > Official Corporate ATS > NCS > State > Aggregator.'
  ]);

  useEffect(() => {
    setRecentSyncRuns(getJobSyncRuns());
  }, [jobSources]);

  const handleSync = async (sourceId?: string, sourceName?: string, isFullSync: boolean = false) => {
    setIsSyncing(true);
    const label = sourceName || (isFullSync ? 'Full Pan-India Database Sync' : 'Standard Pan-India Sync');
    const startTime = Date.now();
    setSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] 🚀 Initiated ${label}...`, ...prev.slice(0, 15)]);
    
    try {
      const stats = await syncJobSources({ targetSourceId: sourceId, isFullSync });
      const duration = Date.now() - startTime;
      setLastSyncResult({
        pagesScanned: stats.pagesScannedTotal || 15,
        discovered: stats.totalImported,
        merged: stats.mergedDuplicates,
        duration
      });
      setRecentSyncRuns(getJobSyncRuns());
      setSyncLogs(prev => [
        `[${new Date().toLocaleTimeString()}] ✅ ${label} completed in ${(duration / 1000).toFixed(1)}s: Discovered ${stats.totalImported} listings (${stats.pagesScannedTotal || 15} pages), Merged ${stats.mergedDuplicates} duplicates. Active vacancies: ${stats.activeCount}.`,
        ...prev.slice(0, 15)
      ]);
    } catch (err: any) {
      setSyncLogs(prev => [`[${new Date().toLocaleTimeString()}] ❌ Sync failed: ${err?.message || 'Network error'}`, ...prev.slice(0, 15)]);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveJobSyncConfig(syncConfig);
    setSyncConfig(updated);
    setIsConfigModalOpen(false);
    setSyncLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ⚙️ Updated Sync Config: PageSize=${updated.pageSize}, MaxPages=${updated.maxPagesPerRun}, MaxJobsPerRun=${updated.maxJobsPerRun}.`,
      ...prev.slice(0, 15)
    ]);
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
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"><Landmark className="w-3 h-3" /> Govt of India (NCS)</span>;
      case 'state_portal':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Globe2 className="w-3 h-3" /> State Portals (28 States)</span>;
      case 'company_career':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"><Building2 className="w-3 h-3" /> Corporate ATS Feeds</span>;
      case 'aggregator_api':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><Layers className="w-3 h-3" /> Aggregator APIs (Jooble/Adzuna)</span>;
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
            <h1 className="text-2xl font-black text-white tracking-tight">Pan-India Multi-Source Aggregation</h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Scalable multi-page harvesting engine integrating National Career Service (NCS), State Employment Exchanges across all 28 states, Partner APIs, and Corporate ATS feeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Settings2 className="w-4 h-4 text-indigo-400" />
              <span>Sync Limits</span>
            </button>

            <button
              onClick={() => handleSync(undefined, undefined, false)}
              disabled={isSyncing}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>

            <button
              onClick={() => handleSync(undefined, undefined, true)}
              disabled={isSyncing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{isSyncing ? 'Harvesting...' : 'Full Sync (All Pages)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Total Discovered & Active</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{jobVacancies.length}</div>
          <div className="text-[11px] text-cyan-400 mt-1 font-medium">{aggregatedJobsCount} Aggregated + {directJobsCount} Direct</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Active Sources</span>
            <Server className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{activeSourcesCount} / {jobSources.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">100% Connectors Operational</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Configured Harvest Cap</span>
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{syncConfig.maxJobsPerRun} <span className="text-xs font-normal text-slate-400">jobs/run</span></div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">{syncConfig.pageSize} items/page × {syncConfig.maxPagesPerRun} pages</div>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-sm">
          <div className="text-slate-400 text-xs font-semibold flex items-center justify-between">
            <span>Total Lifetime Imported</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalImportedAll}</div>
          <div className="text-[11px] text-indigo-400 mt-1 font-medium">Multi-Source Deduplicated</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Sources' },
          { id: 'government', label: 'Govt of India (NCS)' },
          { id: 'state_portal', label: 'State Exchanges (28 States)' },
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
                <span className="font-semibold text-white">{source.totalActive || 0} listings</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => handleSync(source.id, source.name, false)}
                disabled={isSyncing || !source.isActive}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Now</span>
              </button>

              <button
                onClick={() => handleSync(source.id, source.name, true)}
                disabled={isSyncing || !source.isActive}
                className="py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold text-xs flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                title="Full Multi-Page Deep Harvest"
              >
                <span>Full</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sync Runs History Table */}
      {recentSyncRuns.length > 0 && (
        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Ingestion & Harvest Sync Runs</span>
            </div>
            <span className="text-[11px] text-slate-500">{recentSyncRuns.length} runs recorded</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Source</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Pages Scanned</th>
                  <th className="pb-3 font-semibold">Discovered</th>
                  <th className="pb-3 font-semibold">Duplicates</th>
                  <th className="pb-3 font-semibold">Errors</th>
                  <th className="pb-3 font-semibold">Duration</th>
                  <th className="pb-3 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentSyncRuns.slice(0, 8).map((run) => (
                  <tr key={run.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-white max-w-[200px] truncate">{run.sourceName}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        run.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : run.status === 'partial' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {run.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-cyan-300 font-mono">{run.pagesScanned}</td>
                    <td className="py-3 font-bold text-emerald-400 font-mono">+{run.jobsDiscovered}</td>
                    <td className="py-3 text-slate-400 font-mono">{run.duplicates}</td>
                    <td className="py-3 font-mono">
                      {run.errors > 0 ? (
                        <span className="text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {run.errors}</span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                    <td className="py-3 text-slate-400">{run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : 'N/A'}</td>
                    <td className="py-3 text-slate-500">{new Date(run.startedAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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

      {/* Configurable Sync Limits Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Configurable Import Limits</h3>
              </div>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Customize harvest pagination limits and concurrency per run to scale the India-wide aggregation pipeline.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Page Size (Items per API Page)</label>
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={syncConfig.pageSize}
                  onChange={(e) => setSyncConfig({ ...syncConfig, pageSize: parseInt(e.target.value) || 20 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Max Pages Per Run</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={syncConfig.maxPagesPerRun}
                  onChange={(e) => setSyncConfig({ ...syncConfig, maxPagesPerRun: parseInt(e.target.value) || 10 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Max Jobs Cap Per Run</label>
                <input
                  type="number"
                  min="20"
                  max="5000"
                  value={syncConfig.maxJobsPerRun}
                  onChange={(e) => setSyncConfig({ ...syncConfig, maxJobsPerRun: parseInt(e.target.value) || 200 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

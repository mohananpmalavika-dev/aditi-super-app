/**
 * Pan-India Job Synchronization Scheduler
 * Periodically evaluates source cadences (NCS every 6h, Aggregators every 12h, Corporate feeds every 24h)
 * and triggers background incremental synchronization.
 */

import { getRegisteredJobSources, updateSourceSyncStats } from './jobSourceService';
import { runJobAggregationSync, AggregationSyncResult } from './jobAggregatorService';

class JobSyncScheduler {
  private timerId: any = null;
  private isRunning: boolean = false;
  private listeners: ((result: AggregationSyncResult) => void)[] = [];

  public start(): void {
    if (this.timerId) return;

    // Check cadence every 10 minutes in long-running runtime
    this.timerId = setInterval(() => {
      this.checkAndRunDueSyncs();
    }, 10 * 60 * 1000);

    // Initial pass check on boot
    this.checkAndRunDueSyncs();
  }

  public stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public subscribe(callback: (result: AggregationSyncResult) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  public async checkAndRunDueSyncs(): Promise<void> {
    if (this.isRunning) return;

    const sources = getRegisteredJobSources();
    const now = Date.now();
    const sourcesToSync = sources.filter(s => {
      if (!s.isActive) return false;
      if (!s.lastSyncAt) return true;
      const last = new Date(s.lastSyncAt).getTime();
      const intervalMs = (s.syncIntervalMinutes || 360) * 60 * 1000;
      return (now - last) >= intervalMs;
    });

    if (sourcesToSync.length === 0) {
      return;
    }

    try {
      this.isRunning = true;
      for (const source of sourcesToSync) {
        const result = await runJobAggregationSync({ targetSourceId: source.id });
        this.listeners.forEach(cb => cb(result));
      }
    } catch (err) {
      console.warn('Scheduled job sync encounter:', err);
    } finally {
      this.isRunning = false;
    }
  }

  public async triggerManualSync(sourceId?: string, isFullSync?: boolean): Promise<AggregationSyncResult> {
    const result = await runJobAggregationSync({ targetSourceId: sourceId, isFullSync });
    this.listeners.forEach(cb => cb(result));
    return result;
  }
}

export const jobSyncScheduler = new JobSyncScheduler();

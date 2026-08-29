/**
 * NewsOS Audit Logging & Governance Service
 * Records every sensitive editorial action, publication, correction, retraction, and kill switch change.
 */

import { NewsAuditLog } from '../../types/news';

export const INITIAL_AUDIT_LOGS: NewsAuditLog[] = [
  {
    id: 'audit-1',
    actorId: 'system-agent',
    actorName: 'NewsOS Ingestion Engine',
    action: 'AUTO_PUBLISH',
    resourceType: 'story',
    resourceId: 'story-kerala-monsoon-red-alert-2026',
    details: 'Auto-published low-risk official IMD Red Alert bulletin with 98% verification score.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'audit-2',
    actorId: 'editor-senior-1',
    actorName: 'Senior Duty Editor',
    action: 'APPROVE_STORY',
    resourceType: 'story',
    resourceId: 'story-isro-gaganyaan-recovery-2026',
    details: 'Approved ISRO Gaganyaan recovery trials story for English and Malayalam channels.',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  }
];

const AUDIT_STORAGE_KEY = 'aditi-news-audit-logs';

export function getNewsAuditLogs(): NewsAuditLog[] {
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [...INITIAL_AUDIT_LOGS];
}

export function recordNewsAuditLog(
  actorId: string,
  actorName: string,
  action: NewsAuditLog['action'],
  resourceType: NewsAuditLog['resourceType'],
  resourceId: string,
  details: string
): NewsAuditLog {
  const log: NewsAuditLog = {
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    actorId,
    actorName,
    action,
    resourceType,
    resourceId,
    details,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = getNewsAuditLogs();
    const updated = [log, ...existing.slice(0, 300)];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch {}

  return log;
}

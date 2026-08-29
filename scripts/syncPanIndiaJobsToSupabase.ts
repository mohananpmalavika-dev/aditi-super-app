import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { runJobAggregationSync } from '../src/services/jobs/jobAggregatorService';
import { INITIAL_JOB_SOURCES } from '../src/services/jobs/jobSourceService';

// Read .env manually
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
      const [k, ...v] = line.split('=');
      if (k && v.length > 0) {
        const key = k.trim();
        const val = v.join('=').trim().replace(/^["']|["']$/g, '');
        if (key === 'VITE_SUPABASE_URL') SUPABASE_URL = val;
        if (key === 'VITE_SUPABASE_ANON_KEY') SUPABASE_ANON_KEY = val;
      }
    });
  }
} catch {}

async function seedPanIndiaJobs() {
  console.log('🔄 Running Pan-India Job Aggregation & Sync Pipeline...');
  
  const syncResult = await runJobAggregationSync();
  console.log(`✅ Ingested ${syncResult.totalImported} listings.`);
  console.log(`✅ Deduplicated and merged ${syncResult.mergedDuplicates} duplicate listings.`);
  console.log(`✅ Total active unified vacancies ready: ${syncResult.activeCount}`);

  syncResult.unifiedJobs.forEach((job, idx) => {
    console.log(`  ${idx + 1}. [${job.primarySource || job.sourceType}] ${job.title} @ ${job.company} (${job.location}) - ${job.salaryFormatted}`);
  });

  if (SUPABASE_URL && !SUPABASE_URL.includes('xyzcompany')) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log(`Connecting to Supabase at ${SUPABASE_URL}...`);
    try {
      const { error: sourceErr } = await supabase.from('job_sources').upsert(INITIAL_JOB_SOURCES);
      if (sourceErr) console.warn('job_sources upsert notice:', sourceErr.message);
      else console.log('✅ Synchronized 9 job sources in Supabase!');

      const { error: jobErr } = await supabase.from('job_vacancies').upsert(syncResult.unifiedJobs);
      if (jobErr) console.warn('job_vacancies upsert notice:', jobErr.message);
      else console.log('✅ Successfully upserted vacancies into Supabase job_vacancies table!');
    } catch (err: any) {
      console.warn('Supabase remote sync note:', err?.message);
    }
  }

  console.log('🎉 Sync complete.');
}

seedPanIndiaJobs();

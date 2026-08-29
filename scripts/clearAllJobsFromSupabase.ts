import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.log('No Supabase credentials found in .env; skipping remote DB clear.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAllJobs() {
  console.log('Purging all job vacancies from Supabase database...');
  
  const { error } = await supabase
    .from('job_vacancies')
    .delete()
    .neq('id', '');

  if (error) {
    console.error('Failed to clear job vacancies from Supabase:', error.message);
    process.exit(1);
  }

  console.log('✅ All jobs successfully deleted from Supabase Cloud Database!');
}

clearAllJobs();

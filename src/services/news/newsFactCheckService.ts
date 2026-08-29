/**
 * NewsOS Fact Checking & Viral Misinformation Debunking Module
 * Evaluates viral social media claims, fake government orders, and doctored media with verifiable evidence points.
 */

import { FactCheck, FactCheckRating } from '../../types/news';

export const INITIAL_FACT_CHECKS: FactCheck[] = [
  {
    id: 'fc-kerala-school-holiday-fake-pdf',
    claim: 'Viral PDF notification claiming a 3-day statewide total holiday declared for all educational institutions across Kerala.',
    claimant: 'Viral WhatsApp forwards and Telegram groups',
    originalSourceUrl: 'https://socialmedia.example/claim/kerala-holiday-rumor',
    classification: 'FALSE',
    ratingScore: 98,
    explanation: 'The viral PDF claiming a statewide 3-day educational holiday is fabricated. The General Education Department and District Collectors have clarified that holidays are decided strictly at the district/taluk level based on local weather conditions.',
    explanationMalayalam: 'സംസ്ഥാനത്തെ എല്ലാ വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾക്കും 3 ദിവസം അവധി പ്രഖ്യാപിച്ചു എന്ന പേരിൽ പ്രചരിക്കുന്ന വാട്സാപ്പ് സർക്കുലർ വ്യാജമാണ്. പ്രാദേശിക മഴക്കെടുതി വിലയിരുത്തി അതത് ജില്ലാ കളക്ടർമാർ മാത്രമാണ് അവധി പ്രഖ്യാപിക്കുക എന്ന് പൊതുവിദ്യാഭ്യാസ വകുപ്പ് അറിയിച്ചു.',
    evidencePoints: [
      'General Education Department verified no statewide general holiday order was issued.',
      'Document uses outdated 2024 government seal and forged signature.',
      'Only select hilly taluks in Wayanad & Kozhikode have localized holidays declared by collectors.'
    ],
    debunkSources: ['PRD Kerala Fact Check Cell', 'General Education Dept Directorate'],
    reviewer: 'NewsOS Senior Fact Check Unit',
    publishedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'fc-rbi-500-note-rumor',
    claim: 'Social media posts claiming ₹500 currency notes with star marks (*) are invalid and will be phased out.',
    claimant: 'Viral YouTube & Instagram reels',
    classification: 'FALSE',
    ratingScore: 99,
    explanation: 'The Reserve Bank of India (RBI) has issued a formal clarification that ₹500 notes bearing a star (*) mark in the number panel are completely legal tender and are standard replacement banknotes.',
    explanationMalayalam: 'നമ്പർ പാനലിൽ സ്റ്റാർ (*) അടയാളമുള്ള 500 രൂപ നോട്ടുകൾ അസാധുവാണെന്ന വാർത്തകൾ വ്യാജമാണ്. പ്രിന്റിംഗ് സമയത്ത് മാറ്റി നൽകുന്ന സാധാരണ നോട്ടുമാത്രമാണിതെന്നും ഇവ നിയമപരമായി സാധുവാണെന്നും റിസർവ് ബാങ്ക് വ്യക്തമാക്കിയിട്ടുണ്ട്.',
    evidencePoints: [
      'RBI Press Release No. 2023-2024/655 clarifies the star series issuance.',
      'Star symbol denotes replacement of defectively printed notes in a packet of 100.'
    ],
    debunkSources: ['RBI Official Press Desk', 'PIB Fact Check Central'],
    reviewer: 'Financial Fact Check Desk',
    publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

const FACT_CHECKS_KEY = 'aditi-news-fact-checks';

export function getFactChecks(): FactCheck[] {
  try {
    const raw = localStorage.getItem(FACT_CHECKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...INITIAL_FACT_CHECKS];
}

export function saveFactChecks(factChecks: FactCheck[]): void {
  try {
    localStorage.setItem(FACT_CHECKS_KEY, JSON.stringify(factChecks));
  } catch {}
}

export function createFactCheck(data: Omit<FactCheck, 'id' | 'publishedAt'>): FactCheck {
  const newFactCheck: FactCheck = {
    id: `fc-${Date.now()}`,
    ...data,
    publishedAt: new Date().toISOString()
  };

  const existing = getFactChecks();
  const updated = [newFactCheck, ...existing];
  saveFactChecks(updated);
  return newFactCheck;
}

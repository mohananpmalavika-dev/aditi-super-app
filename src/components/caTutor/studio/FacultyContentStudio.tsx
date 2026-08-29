import React, { useState } from 'react';
import { 
  Building, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  Layers, 
  FileText, 
  ShieldCheck,
  Search,
  Upload
} from 'lucide-react';
import { CurriculumVersionId, PaperId } from '../../../types/caTutor';
import { CA_FOUNDATION_CURRICULUM_VERSIONS } from '../../../services/caCurriculumService';
import { CA_TERMINOLOGY_GLOSSARY } from '../../../services/caTerminologyGlossary';
import confetti from 'canvas-confetti';

export const FacultyContentStudio: React.FC = () => {
  const [selectedVersion, setSelectedVersion] = useState<CurriculumVersionId>('CA_FOUNDATION_SEP_2026');
  const [aiTopicPrompt, setAiTopicPrompt] = useState('Preparation of Consignment Accounts');
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentCurriculum = CA_FOUNDATION_CURRICULUM_VERSIONS.find((v) => v.id === selectedVersion) || CA_FOUNDATION_CURRICULUM_VERSIONS[0];

  const handleGenerateAiLessonDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopicPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedDraft({
        topic: aiTopicPrompt,
        status: 'AI_DRAFT (Requires Faculty Review)',
        learningObjectives: [
          'Understand nature of Consignment vs Sale',
          'Calculate value of unsold stock and normal/abnormal loss',
          'Pass Journal Entries in Consignor & Consignee books'
        ],
        englishExplanation: 'Consignment is a business arrangement where the principal (consignor) sends goods to an agent (consignee) for sale without transferring ownership.',
        malayalamExplanation: 'ഉടമസ്ഥാവകാശം കൈമാറാതെ കമ്മീഷൻ വ്യവസ്ഥയിൽ സാധനങ്ങൾ വിൽക്കാനായി ഏജന്റിന് അയച്ചു നൽകുന്ന രീതിയാണ് കൺസൈൻമെന്റ്.',
        manglishExplanation: 'Ownership consignor-ൽ തന്നെ നിലനിൽക്കും. Consignee goods sell cheythu commission mathram edukkunnu.',
        suggestedQuiz: [
          { q: 'In whose books is Consignment A/c prepared?', a: 'Consignor Books' }
        ]
      });
      confetti({ particleCount: 30, spread: 55 });
    }, 700);
  };

  const filteredGlossary = CA_TERMINOLOGY_GLOSSARY.filter((t) =>
    t.englishTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.malayalamTerm.includes(searchTerm)
  );

  return (
    <div className="space-y-6 text-white font-sans animate-in fade-in">
      
      {/* Studio Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black">Faculty & Curriculum CMS Studio</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Admin Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Manage CA curriculum versions, review AI-assisted drafts & enforce ICAI glossary standards.
            </p>
          </div>
        </div>

        {/* Curriculum Version Switcher */}
        <div className="space-y-1 self-start md:self-auto">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Curriculum Version:</span>
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="CA_FOUNDATION_SEP_2026">CA Foundation — September 2026</option>
            <option value="CA_FOUNDATION_JAN_2027">CA Foundation — January 2027</option>
            <option value="CA_FOUNDATION_MAY_2027">CA Foundation — May 2027</option>
            <option value="CA_INTERMEDIATE_NOV_2026">CA Intermediate — Nov 2026</option>
            <option value="CA_FINAL_MAY_2027">CA Final — May 2027</option>
          </select>
        </div>
      </div>

      {/* Grid: AI Content Draft Generator (7 Cols) + Terminology Guard (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Draft Studio */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              AI-Assisted Lesson Draft Generator
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Enter a CA syllabus topic. AI generates a bilingual draft (English + Malayalam + Manglish) with learning objectives, which remains in <code className="text-amber-300">AI_DRAFT</code> until faculty approves.
          </p>

          <form onSubmit={handleGenerateAiLessonDraft} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={aiTopicPrompt}
                onChange={(e) => setAiTopicPrompt(e.target.value)}
                placeholder="e.g. Issue of Shares at Premium & Forfeiture"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
              />
              <button
                type="submit"
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex-shrink-0"
              >
                {isGenerating ? 'Drafting...' : 'Propose Draft'}
              </button>
            </div>
          </form>

          {generatedDraft && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 text-xs animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-extrabold text-white">{generatedDraft.topic}</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                  {generatedDraft.status}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase">English Explanation:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{generatedDraft.englishExplanation}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Malayalam Explanation:</span>
                <p className="text-amber-200/80 text-[11px] leading-relaxed">{generatedDraft.malayalamExplanation}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-purple-400 uppercase">Manglish (Mixed) Version:</span>
                <p className="text-purple-200 text-[11px] leading-relaxed">{generatedDraft.manglishExplanation}</p>
              </div>

              <button
                onClick={() => alert('Draft approved & queued for faculty publication!')}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                Approve & Publish to Curriculum Repository
              </button>
            </div>
          )}
        </div>

        {/* Right Column: ICAI Terminology Quality Guard */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm sm:text-base text-white">Terminology Guard</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">{CA_TERMINOLOGY_GLOSSARY.length} Terms</span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter glossary (e.g. Consideration, BRS)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {filteredGlossary.map((t) => (
              <div key={t.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{t.englishTerm}</span>
                  {t.doNotTranslate && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      Preserve English
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-400">{t.malayalamTerm}</p>
                <p className="text-[10px] text-slate-400 leading-snug">{t.definitionEn}</p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};

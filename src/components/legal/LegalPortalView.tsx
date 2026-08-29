import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Search, 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Tv, 
  Gavel, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Send,
  Building,
  User,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSuperApp } from '../../context/SuperAppContext';
import { 
  lookupFIRAndCaseStatus, 
  generateFIRDigitalDocument, 
  generateDefamationLegalNotice, 
  PRELOADED_FIR_RECORDS,
  KEY_LEGAL_ACTS_REFERENCE,
  KERALA_POLICE_DISTRICTS_DIRECTORY,
  getPoliceStationsByDistrict,
  getDistrictInfo,
  PoliceStationInfo
} from '../../services/legalIntelligenceService';
import { FIRRecord, MediaDiscrepancyReport } from '../../types/superApp';

export const LegalPortalView: React.FC = () => {
  const { sessionUser, showToast } = useSuperApp();
  const [lang, setLang] = useState<'ml' | 'en'>('ml');
  const [activeSubTab, setActiveSubTab] = useState<'docket' | 'timeline' | 'media' | 'defamation' | 'defence' | 'bareActs'>('docket');

  // Search & Cascade Auto-Fill States
  const [districtQuery, setDistrictQuery] = useState('Ernakulam');
  const [stationQuery, setStationQuery] = useState('Cyber Crime Police Station, Kochi City');
  const [firNumOnly, setFirNumOnly] = useState('248');
  const [firYear, setFirYear] = useState('2024');
  const [stationSearchFilter, setStationSearchFilter] = useState('');

  // Active FIR Record
  const [currentFIR, setCurrentFIR] = useState<FIRRecord>(() => 
    lookupFIRAndCaseStatus('248/2024', 'Cyber Crime Police Station, Kochi City', 'Ernakulam')
  );

  // Available Police Stations for Selected District
  const currentDistrictStations = useMemo(() => {
    return getPoliceStationsByDistrict(districtQuery);
  }, [districtQuery]);

  // Filtered Stations for search
  const filteredStations = useMemo(() => {
    if (!stationSearchFilter.trim()) return currentDistrictStations;
    const q = stationSearchFilter.toLowerCase();
    return currentDistrictStations.filter(
      (s) => s.name.toLowerCase().includes(q) || s.nameMalayalam.toLowerCase().includes(q) || s.stationCode.toLowerCase().includes(q)
    );
  }, [currentDistrictStations, stationSearchFilter]);

  // Selected Station Details
  const selectedStationObj = useMemo(() => {
    return (
      currentDistrictStations.find((s) => s.name === stationQuery || s.nameMalayalam === stationQuery) ||
      currentDistrictStations[0]
    );
  }, [currentDistrictStations, stationQuery]);

  // Handle District Change (Cascades & Auto-fills Police Station)
  const handleDistrictChange = (newDistrict: string) => {
    setDistrictQuery(newDistrict);
    const stations = getPoliceStationsByDistrict(newDistrict);
    if (stations.length > 0) {
      setStationQuery(stations[0].name);
    }
    setStationSearchFilter('');
    showToast(`🏛️ District switched to ${newDistrict}. Police stations updated!`);
  };

  // Full Formatted FIR Number
  const fullFIRQuery = `${firNumOnly || '101'}/${firYear}`;

  // Defamation Notice Form Customization
  const [selectedMediaId, setSelectedMediaId] = useState<string>('media-rep-1');
  const [clientName, setClientName] = useState('Ananthakrishnan V. Shenoy');
  const [advocateName, setAdvocateName] = useState('Adv. K. Harikrishnan, B.A., LL.B.');
  const [compensationAmount, setCompensationAmount] = useState('₹50,00,000/-');
  const [noticeDocType, setNoticeDocType] = useState<'legalNotice' | 'criminalComplaint' | 'nbdsa' | 'quashPetition'>('legalNotice');

  // UI Interactive States
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Active Media Item for Defamation
  const activeMediaReport = useMemo(() => {
    return (
      currentFIR.mediaReports.find((m) => m.id === selectedMediaId) ||
      currentFIR.mediaReports[0] || {
        id: 'default',
        channelOrOutlet: 'Regional Media News Channel',
        headline: 'Defamatory Broadcast',
        publishedDate: '2024-03-15',
        mediaType: 'TV Channel Broadcast' as const,
        distortedClaims: ['Sensationalized claims without verification'],
        actualLegalFacts: ['Facts as recorded in court records'],
        isDiscrepancy: true,
        libelSeverity: 'Severe / Actionable Defamation' as const,
        defamatoryQuotes: ['"Unverified scam allegations"'],
        impactOnAccused: 'Severe reputational damage.',
        suggestedAction: 'Issue statutory legal notice.'
      }
    );
  }, [currentFIR, selectedMediaId]);

  // Generated Legal Notice
  const generatedNotice = useMemo(() => {
    return generateDefamationLegalNotice(
      currentFIR,
      activeMediaReport,
      clientName || sessionUser?.name || 'Accused Person',
      advocateName,
      compensationAmount
    );
  }, [currentFIR, activeMediaReport, clientName, advocateName, compensationAmount, sessionUser]);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = firNumOnly.trim() ? `${firNumOnly.trim()}/${firYear}` : `101/${firYear}`;
    const result = lookupFIRAndCaseStatus(cleanNum, stationQuery, districtQuery);
    setCurrentFIR(result);
    if (result.mediaReports.length > 0) {
      setSelectedMediaId(result.mediaReports[0].id);
    }
    showToast(`⚖️ Auto-filled Docket: ${result.crimeNumber} (${result.policeStation})`);
    confetti({ particleCount: 30, spread: 60 });
  };

  // Load Preset Case & Auto-Fill Dropdowns
  const handleLoadPreset = (preset: FIRRecord) => {
    const parts = preset.firNumber.split('/');
    setFirNumOnly(parts[0] || preset.firNumber);
    setFirYear(parts[1] || '2024');
    setDistrictQuery(preset.district);
    setStationQuery(preset.policeStation);
    setCurrentFIR(preset);
    if (preset.mediaReports.length > 0) {
      setSelectedMediaId(preset.mediaReports[0].id);
    }
    showToast(`📂 Loaded Preset: ${preset.crimeNumber}`);
  };

  // Speech Narration (TTS)
  const handleToggleSpeech = (textToSpeak: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast('⚠️ Speech Synthesis not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToSpeak
      .replace(/[*#=_~`]/g, '')
      .replace(/[🚨⚡⚖️📜🏛️🛡️👑💎]/g, '')
      .slice(0, 1500);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Copy to Clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast(`📋 ${label} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  // Print Document
  const handlePrint = (content: string, title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('⚠️ Pop-up blocked. Please allow pop-ups to print.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 40px; color: #111; line-height: 1.5; font-size: 13px; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
            @media print { body { padding: 15px; } }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* ========================================================================= */}
      {/* 3D HERO HEADER & PORTAL COMMAND BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/80 border border-indigo-500/40 p-5 sm:p-7 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.25)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ml' ? 'നിയമ സഹായവും കോടതി കേസ് ട്രാക്കറും' : 'AI Legal Intelligence & Court Case Tracker'}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                CrPC §154 • Sec 482 Quashing • Defamation IPC §499
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{lang === 'ml' ? 'കോടതി കേസ്, FIR & അപകീർത്തി പ്രതിരോധ പോർട്ടൽ' : 'Court Docket, FIR & Media Defamation Defence'}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ml'
                ? 'എഫ്.ഐ.ആർ നമ്പർ നൽകി സമഗ്ര കേസ് നാൾവഴിയും കോടതി സ്റ്റാറ്റസും പരിശോധിക്കുക. മാധ്യമങ്ങളുടെ വ്യാജ വാർത്തകൾക്കെതിരെ അപകീർത്തി വക്കീൽ നോട്ടീസും, കേസ് റദ്ദാക്കാനുള്ള (Sec 482 Quashing) ഹൈക്കോടതി ഹർജികളും 1-ക്ലിക്കിൽ തയ്യാറാക്കുക.'
                : 'Lookup FIRs, trace full court case dockets from registration to closure, analyze sensational media distortions, draft 15-day Defamation Legal Notices, and access Section 482 HC Quashing blueprints.'}
            </p>
          </div>

          {/* Language Switcher & Controls */}
          <div className="flex items-center gap-2 self-start md:self-center flex-shrink-0">
            <div className="p-1 rounded-2xl bg-slate-950 border border-slate-800 flex items-center text-xs font-bold shadow-inner">
              <button
                onClick={() => setLang('ml')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  lang === 'ml' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                മലയാളം
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  lang === 'en' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CASCADING DISTRICT & POLICE STATION AUTO-FILL SELECTOR & SEARCH */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'പോലീസ് സ്റ്റേഷനും ജില്ലയും സ്വയം പൂരിപ്പിക്കൽ (Auto-Fill Dropdown)' : 'District & Police Station Cascading Auto-Fill'}</span>
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            ✓ 14 Kerala Districts • 100+ Official Police Stations
          </span>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          
          {/* 1. District Dropdown Selector */}
          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] font-bold text-slate-300 block">
              {lang === 'ml' ? '1. ജില്ല തിരഞ്ഞെടുക്കുക (District)' : '1. Select District *'}
            </label>
            <select
              value={districtQuery}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400 cursor-pointer shadow-inner"
            >
              {KERALA_POLICE_DISTRICTS_DIRECTORY.map((d) => (
                <option key={d.district} value={d.district} className="bg-slate-950 text-white py-1">
                  {d.district} - {d.districtMalayalam}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Police Station Cascading Dropdown */}
          <div className="sm:col-span-5 space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 block">
                {lang === 'ml' ? '2. പോലീസ് സ്റ്റേഷൻ (Police Station)' : '2. Police Station *'}
              </label>
              <span className="text-[10px] text-indigo-300 font-mono">
                {filteredStations.length} {lang === 'ml' ? 'സ്റ്റേഷനുകൾ' : 'Stations'}
              </span>
            </div>
            
            <div className="space-y-1.5">
              <select
                value={stationQuery}
                onChange={(e) => setStationQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer font-medium"
              >
                {filteredStations.map((st) => (
                  <option key={st.id} value={st.name} className="bg-slate-950 text-white py-1">
                    {st.name} {st.category === 'Cyber Crime' ? '⚡ (Cyber)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. FIR / Crime Number & Year */}
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-bold text-slate-300 block">
              {lang === 'ml' ? '3. ക്രൈം നമ്പർ' : '3. Crime No. & Year *'}
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={firNumOnly}
                onChange={(e) => setFirNumOnly(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="248"
                required
                className="w-1/2 px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-center font-bold"
              />
              <span className="text-slate-500 font-bold">/</span>
              <select
                value={firYear}
                onChange={(e) => setFirYear(e.target.value)}
                className="w-1/2 px-1.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400 font-mono text-center font-bold"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
          </div>

          {/* 4. Action Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 active:scale-95 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all"
            >
              <Scale className="w-4 h-4" />
              <span>{lang === 'ml' ? 'കേസ് വിവരങ്ങൾ കണ്ടെത്തുക' : 'Fetch Case'}</span>
            </button>
          </div>
        </form>

        {/* Live Auto-Fill Jurisdiction Preview Badge */}
        {selectedStationObj && (
          <div className="p-3 rounded-2xl bg-slate-950/90 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                {selectedStationObj.category}
              </span>
              <span className="font-bold text-white">
                {lang === 'ml' ? selectedStationObj.nameMalayalam : selectedStationObj.name}
              </span>
              <span className="text-[10px] font-mono text-slate-400">({selectedStationObj.stationCode})</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="text-slate-400 font-bold">🏛️ {lang === 'ml' ? 'കോടതി അധികാരപരിധി:' : 'Jurisdiction Court:'}</span>
              <span className="font-bold text-amber-300">
                {lang === 'ml' ? selectedStationObj.magistrateCourtMalayalam : selectedStationObj.magistrateCourt}
              </span>
            </div>
          </div>
        )}

        {/* 1-Click Sample Pre-load Case Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-800/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {lang === 'ml' ? 'മാതൃകാ കേസുകൾ (1-ക്ലിക്ക് ഓട്ടോ ഫിൽ):' : 'Sample Case Dockets (1-Click Auto-Fill):'}
          </span>
          {PRELOADED_FIR_RECORDS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleLoadPreset(preset)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                currentFIR.id === preset.id
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3 text-amber-400" />
              <span>FIR {preset.firNumber} ({preset.district})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5-TAB SUB-NAVIGATION SWITCHER */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold overflow-x-auto scrollbar-none shadow-lg">
        <button
          onClick={() => setActiveSubTab('docket')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
            activeSubTab === 'docket'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{lang === 'ml' ? '1. എഫ്.ഐ.ആർ & കോടതി സ്റ്റാറ്റസ്' : '1. FIR & Court Docket'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
            activeSubTab === 'timeline'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{lang === 'ml' ? '2. കേസ് നാൾവഴി (FIR to Closure)' : '2. Case History Timeline'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('media')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
            activeSubTab === 'media'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tv className="w-4 h-4" />
          <span>{lang === 'ml' ? '3. മീഡിയ വാർത്തകളും വാസ്തവവും' : '3. Media vs Legal Reality'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('defamation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
            activeSubTab === 'defamation'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{lang === 'ml' ? '4. അപകീർത്തി വക്കീൽ നോട്ടീസ്' : '4. Defamation Legal Notice'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('defence')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
            activeSubTab === 'defence'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'ml' ? '5. കേസ് റദ്ദാക്കൽ തന്ത്രങ്ങൾ (Sec 482)' : '5. AI Defence Blueprint'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bareActs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${
            activeSubTab === 'bareActs'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{lang === 'ml' ? '6. നിയമ സെക്ഷനുകൾ (IPC & BNS)' : '6. Penal Code Acts'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: FIR DIGITAL CARD & E-COURTS DOCKET */}
      {/* ========================================================================= */}
      {activeSubTab === 'docket' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top Quick Actions Bar for FIR */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-white">{currentFIR.crimeNumber}</h3>
                <p className="text-[10px] text-slate-400">{currentFIR.policeStation} • {currentFIR.dateOfRegistration}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleSpeech(generateFIRDigitalDocument(currentFIR))}
                className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isSpeaking
                    ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                    : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isSpeaking ? (lang === 'ml' ? 'നിർത്തുക' : 'Stop Audio') : (lang === 'ml' ? 'വായിച്ചു കേൾക്കുക' : 'Listen')}</span>
              </button>

              <button
                onClick={() => handleCopy(generateFIRDigitalDocument(currentFIR), 'FIR Document')}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : (lang === 'ml' ? 'കോപ്പി ചെയ്യുക' : 'Copy FIR')}</span>
              </button>

              <button
                onClick={() => handlePrint(generateFIRDigitalDocument(currentFIR), `FIR-${currentFIR.firNumber}`)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === 'ml' ? 'പ്രിന്റ് / PDF' : 'Print / Save PDF'}</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Official FIR Details + Live Court Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column: Official FIR Breakdown (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black text-sm">
                      FIR
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">
                        {lang === 'ml' ? 'പോലീസ് പ്രഥമ വിവര റിപ്പോർട്ട് (FIR)' : 'First Information Report (FIR)'}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">{currentFIR.crimeNumber} • {currentFIR.policeStation}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    ✓ Verified Legal Copy
                  </span>
                </div>

                {/* Statutory Sections Table */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    {lang === 'ml' ? 'ചുമത്തപ്പെട്ട വകുപ്പുകൾ & കുറ്റങ്ങൾ (IPC / IT ACT / BNS):' : 'Penal Acts & Sections Invoked:'}
                  </label>
                  <div className="space-y-2">
                    {currentFIR.actsAndSections.map((sec, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-1.5">
                          <span className="font-extrabold text-xs text-amber-300 font-mono">{sec.act} - {sec.section}</span>
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className={`px-2 py-0.5 rounded font-bold ${sec.bailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                              {sec.bailable ? 'Bailable (ജാമ്യം ലഭിക്കുന്നത്)' : 'Non-Bailable (ജാമ്യമില്ലാത്തത്)'}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                              Max: {sec.punishmentMaxYears}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-snug">
                          {lang === 'ml' && sec.descriptionMalayalam ? sec.descriptionMalayalam : sec.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accused & Complainant Roster */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{lang === 'ml' ? 'പരാതിക്കാരൻ / Informant' : 'Complainant'}</span>
                    <h5 className="font-bold text-xs text-white">{currentFIR.complainantName}</h5>
                    <p className="text-[10px] text-slate-400 truncate">{currentFIR.complainantAddress}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">{lang === 'ml' ? 'അന്വേഷണ ഉദ്യോഗസ്ഥൻ' : 'Investigating Officer'}</span>
                    <h5 className="font-bold text-xs text-white">{currentFIR.investigatingOfficer}</h5>
                    <p className="text-[10px] text-indigo-300 font-mono">{currentFIR.investigatingOfficerRank}</p>
                  </div>
                </div>

                {/* Accused List */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    {lang === 'ml' ? 'പ്രതിപ്പട്ടിക (Accused List):' : 'Accused Persons on Record:'}
                  </label>
                  <div className="space-y-2">
                    {currentFIR.accusedList.map((acc, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-500/40">
                            A{acc.rank}
                          </span>
                          <div>
                            <h5 className="font-bold text-xs text-white">{acc.name}</h5>
                            <p className="text-[10px] text-slate-400">{acc.role} {acc.age ? `• Age ${acc.age}` : ''}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          {acc.bailStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Forensic Summary */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5">
                  <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'ml' ? 'കേസ് സംഗ്രഹം & പ്രാഥമിക നിഗമനം:' : 'Case Summary & Legal Assessment:'}</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {lang === 'ml' ? currentFIR.firSummaryMalayalam : currentFIR.firSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Live Court Docket & Status (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Court Card */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-5 h-5 text-amber-400" />
                    <h4 className="font-extrabold text-sm text-white">
                      {lang === 'ml' ? 'കോടതി കേസ് സ്റ്റാറ്റസ് (e-Courts)' : 'Live Court Case Docket'}
                    </h4>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {currentFIR.courtDocket.caseStatus}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold">CNR NUMBER (NATIONAL COURT IDENTIFIER)</span>
                    <span className="text-xs font-mono font-black text-amber-300 select-all block">{currentFIR.courtDocket.cnrNumber}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold">{lang === 'ml' ? 'കോടതി & കേസ് നമ്പർ' : 'Court & Case No.'}</span>
                    <h5 className="font-bold text-white">{currentFIR.courtDocket.courtName}</h5>
                    <p className="text-[11px] text-indigo-300 font-mono font-bold">{currentFIR.courtDocket.caseNumber} ({currentFIR.courtDocket.caseType})</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">{lang === 'ml' ? 'അടുത്ത ഹിയറിംഗ്' : 'Next Hearing'}</span>
                      <span className="text-xs font-black text-emerald-400 font-mono block mt-0.5">{currentFIR.courtDocket.nextHearingDate}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-bold">{lang === 'ml' ? 'കോടതി ഹാൾ' : 'Court Hall'}</span>
                      <span className="text-xs font-bold text-slate-200 block mt-0.5">{currentFIR.courtDocket.courtRoomNumber}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold">{lang === 'ml' ? 'ഹിയറിംഗ് ഉദ്ദേശ്യം' : 'Purpose of Hearing'}</span>
                    <p className="text-xs text-slate-200 font-medium leading-tight">
                      {lang === 'ml' ? currentFIR.courtDocket.purposeOfHearingMalayalam : currentFIR.courtDocket.purposeOfHearing}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-bold">{lang === 'ml' ? 'ബഹു. ജഡ്ജ്' : 'Presiding Judge'}</span>
                    <span className="text-xs font-bold text-white block">{currentFIR.courtDocket.presidingJudge}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveSubTab('defamation')}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <Scale className="w-3.5 h-3.5 text-amber-300" />
                    <span>{lang === 'ml' ? 'അപകീർത്തി വക്കീൽ നോട്ടീസ് തയ്യാറാക്കുക ⚖️' : 'Draft Defamation Notice for this Case ⚖️'}</span>
                  </button>
                </div>
              </div>

              {/* Fast Jump Card to Quashing Blueprint */}
              <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-xs text-white">
                      {lang === 'ml' ? 'കേസ് റദ്ദാക്കൽ സാധ്യതകൾ' : 'High Court Quashing Eligibility'}
                    </h5>
                    <p className="text-[10px] text-slate-400">Section 482 CrPC / Bhajan Lal Precedent</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubTab('defence')}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1 flex-shrink-0"
                >
                  <span>{lang === 'ml' ? 'കാണുക' : 'View'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CASE HISTORY TIMELINE (FIR TO CLOSURE) */}
      {/* ========================================================================= */}
      {activeSubTab === 'timeline' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {lang === 'ml' ? 'സമഗ്ര കേസ് നാൾവഴി (FIR മുതൽ കേസ് ക്ലോഷർ വരെ)' : 'Comprehensive Case Timeline (FIR to Case Closure)'}
                </h3>
                <p className="text-xs text-slate-400">{currentFIR.crimeNumber} • {currentFIR.courtDocket.courtName}</p>
              </div>
            </div>

            <button
              onClick={() => handleCopy(currentFIR.timeline.map((t) => `${t.date}: ${t.title} - ${t.description}`).join('\n\n'), 'Timeline')}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{lang === 'ml' ? 'കോപ്പി ചെയ്യുക' : 'Copy Timeline'}</span>
            </button>
          </div>

          {/* Interactive Vertical Progress Stepper */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-indigo-500 before:to-slate-800">
            {currentFIR.timeline.map((stage, idx) => (
              <div key={idx} className="relative group">
                {/* Milestone Node Icon */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${
                    stage.isCompleted
                      ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : stage.status === 'Current Stage'
                      ? 'bg-indigo-600 border-indigo-300 text-white animate-pulse'
                      : 'bg-slate-950 border-slate-700 text-slate-500'
                  }`}
                >
                  {stage.isCompleted ? '✓' : stage.stageNumber}
                </div>

                {/* Milestone Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    stage.status === 'Current Stage'
                      ? 'bg-gradient-to-r from-indigo-950/80 to-slate-900 border-indigo-400 shadow-xl'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                        {stage.date}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-white">
                        {lang === 'ml' ? stage.titleMalayalam : stage.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {stage.courtOrAuthority}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                    {lang === 'ml' ? stage.descriptionMalayalam : stage.description}
                  </p>

                  {stage.courtOrderExcerpt && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] font-mono text-indigo-300">
                      <span className="font-bold text-slate-400 block text-[9px] uppercase">Court Order Excerpt / നിരീക്ഷണം:</span>
                      {stage.courtOrderExcerpt}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MEDIA NEWS VS LEGAL REALITY (DISCREPANCY ANALYZER) */}
      {/* ========================================================================= */}
      {activeSubTab === 'media' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <Tv className="w-5 h-5 text-rose-400" />
                <span>{lang === 'ml' ? 'മീഡിയ വാർത്തകളും വാസ്തവവും (Discrepancy Analyzer)' : 'Media Broadcasts vs Legal Truth Analyzer'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ml'
                  ? 'മാധ്യമങ്ങൾ സംപ്രേഷണം ചെയ്ത വാസ്തവവിരുദ്ധമായ വാർത്തകളും കോടതിയിലെ യഥാർത്ഥ രേഖകളും തമ്മിലുള്ള താരതമ്യം.'
                  : 'Side-by-side comparison of exaggerated media trials vs actual police findings and court records.'}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40">
              🚨 {currentFIR.mediaReports.length} {lang === 'ml' ? 'വ്യാജ വാർത്തകൾ കണ്ടെത്തി' : 'Discrepancies Flagged'}
            </span>
          </div>

          {/* Media Items List */}
          <div className="space-y-5">
            {currentFIR.mediaReports.map((item, idx) => (
              <div key={item.id} className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-2xl">
                
                {/* Media Channel & Headline Header */}
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">📺</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs sm:text-sm text-white">{item.channelOrOutlet}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{item.publishedDate}</span>
                      </div>
                      <p className="text-xs font-bold text-rose-400 mt-0.5">
                        {lang === 'ml' && item.headlineMalayalam ? item.headlineMalayalam : item.headline}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {item.libelSeverity}
                  </span>
                </div>

                {/* Side-by-Side Comparison: Media Distortion vs Actual Legal Fact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Distortions */}
                  <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{lang === 'ml' ? 'മാധ്യമങ്ങൾ നടത്തിയ വ്യാജ ആരോപണങ്ങൾ:' : 'False Claims Broadcasted by Media:'}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-rose-200/90">
                      {item.distortedClaims.map((claim, cIdx) => (
                        <li key={cIdx} className="flex items-start gap-1.5">
                          <span className="text-rose-400 font-bold">❌</span>
                          <span>{claim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Legal Reality */}
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      <span>{lang === 'ml' ? 'കോടതി രേഖകളിലെ യഥാർത്ഥ വസ്തുത:' : 'Actual Truth from Police & Court Records:'}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-200/90">
                      {item.actualLegalFacts.map((fact, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Defamatory Quotes Highlight */}
                {item.defamatoryQuotes.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {lang === 'ml' ? 'അപകീർത്തികരമായ ഉദ്ധരണികൾ (Actionable Defamatory Quotes):' : 'Key Actionable Libelous Statements:'}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.defamatoryQuotes.map((q, qIdx) => (
                        <span key={qIdx} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300">
                          {q}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Trigger Button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 flex-wrap gap-2">
                  <p className="text-[11px] text-slate-400 max-w-lg">
                    <strong className="text-slate-300">{lang === 'ml' ? 'നിയമപരമായ പോംവഴി:' : 'Suggested Legal Remedy:'}</strong> {item.suggestedAction}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedMediaId(item.id);
                      setActiveSubTab('defamation');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all flex-shrink-0"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{lang === 'ml' ? 'ഈ ചാനലിനെതിരെ നോട്ടീസ് തയ്യാറാക്കുക ⚖️' : 'Draft Notice Against this Outlet ⚖️'}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DEFAMATION LEGAL NOTICE GENERATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'defamation' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Customization Settings Bar */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ml' ? 'വക്കീൽ നോട്ടീസ് & അപകീർത്തി ഹർജി കോൺഫിഗറേഷൻ' : 'Legal Notice & Defamation Petition Customizer'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">
                  {lang === 'ml' ? 'എതിർകക്ഷി (മാധ്യമം / ചാനൽ)' : 'Target Media Outlet'}
                </label>
                <select
                  value={selectedMediaId}
                  onChange={(e) => setSelectedMediaId(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {currentFIR.mediaReports.map((m) => (
                    <option key={m.id} value={m.id}>{m.channelOrOutlet}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">
                  {lang === 'ml' ? 'കക്ഷിയുടെ പേര് (Accused / Client)' : 'Client / Accused Name'}
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Accused Name"
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">
                  {lang === 'ml' ? 'വക്കീലിന്റെ പേര് (Advocate)' : 'Advocate Name'}
                </label>
                <input
                  type="text"
                  value={advocateName}
                  onChange={(e) => setAdvocateName(e.target.value)}
                  placeholder="Advocate Name"
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">
                  {lang === 'ml' ? 'ആവശ്യപ്പെടുന്ന നഷ്ടപരിഹാരം' : 'Claimed Damages'}
                </label>
                <input
                  type="text"
                  value={compensationAmount}
                  onChange={(e) => setCompensationAmount(e.target.value)}
                  placeholder="₹50,00,000/-"
                  className="w-full p-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono font-bold"
                />
              </div>
            </div>

            {/* Document Type Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold overflow-x-auto">
              <button
                type="button"
                onClick={() => setNoticeDocType('legalNotice')}
                className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                  noticeDocType === 'legalNotice' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                📜 {lang === 'ml' ? '15-ദിവസ വക്കീൽ നോട്ടീസ്' : '15-Day Legal Notice'}
              </button>

              <button
                type="button"
                onClick={() => setNoticeDocType('criminalComplaint')}
                className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                  noticeDocType === 'criminalComplaint' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚖️ {lang === 'ml' ? 'Sec 200 CrPC ക്രിമിനൽ അപകീർത്തി ഹർജി' : 'Sec 200 CrPC Criminal Defamation'}
              </button>

              <button
                type="button"
                onClick={() => setNoticeDocType('nbdsa')}
                className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                  noticeDocType === 'nbdsa' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                📡 {lang === 'ml' ? 'NBDSA ചാനൽ ലൈസൻസ് പരാതി' : 'NBDSA Media Authority Complaint'}
              </button>

              <button
                type="button"
                onClick={() => setNoticeDocType('quashPetition')}
                className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 ${
                  noticeDocType === 'quashPetition' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                🛡️ {lang === 'ml' ? 'Sec 482 ഹൈക്കോടതി കേസ് റദ്ദാക്കൽ ഹർജി' : 'Sec 482 HC Quashing Petition'}
              </button>
            </div>
          </div>

          {/* Rendered Document Viewport */}
          {(() => {
            const activeDocContent = 
              noticeDocType === 'legalNotice'
                ? (lang === 'ml' ? generatedNotice.noticeTextMalayalam : generatedNotice.noticeTextEnglish)
                : noticeDocType === 'criminalComplaint'
                ? generatedNotice.criminalComplaintDraftEnglish
                : noticeDocType === 'nbdsa'
                ? generatedNotice.regulatoryComplaintNBDSA
                : generatedNotice.quashingPetitionSec482Draft;

            const activeDocTitle = 
              noticeDocType === 'legalNotice'
                ? `Defamation-Notice-${currentFIR.firNumber}`
                : noticeDocType === 'criminalComplaint'
                ? `Sec200-CrPC-Complaint-${currentFIR.firNumber}`
                : noticeDocType === 'nbdsa'
                ? `NBDSA-Complaint-${currentFIR.firNumber}`
                : `Sec482-CrPC-Quashing-${currentFIR.firNumber}`;

            return (
              <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
                
                {/* Document Header & Action Buttons */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{activeDocTitle}</h4>
                      <p className="text-[10px] text-slate-400">Target: {activeMediaReport.channelOrOutlet} • Under IPC §499/500 & BNS §356</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleSpeech(activeDocContent)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isSpeaking
                          ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isSpeaking ? (lang === 'ml' ? 'നിർത്തുക' : 'Stop') : (lang === 'ml' ? 'ശ്രവിക്കുക' : 'Listen')}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(activeDocContent, activeDocTitle)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : (lang === 'ml' ? 'കോപ്പി ചെയ്യുക' : 'Copy Notice')}</span>
                    </button>

                    <button
                      onClick={() => handlePrint(activeDocContent, activeDocTitle)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === 'ml' ? 'പ്രിന്റ് / PDF' : 'Print / Save PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Preformatted Legal Text Area */}
                <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <pre className="font-mono text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                    {activeDocContent}
                  </pre>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AI DEFENCE STRATEGY & "GET OUT OF CASE" BLUEPRINT */}
      {/* ========================================================================= */}
      {activeSubTab === 'defence' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Top Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{lang === 'ml' ? 'കേസിൽ നിന്നും രക്ഷപ്പെടാനുള്ള സമ്പൂർണ്ണ പ്രതിരോധ തന്ത്രങ്ങൾ' : 'Exhaustive Legal Defence & Quashing Blueprint'}</span>
            </div>
            <h3 className="font-black text-base sm:text-lg text-white">
              {lang === 'ml' ? 'സുപ്രീം കോടതി വിധികളുടെ പിൻബലത്തിൽ കേസ് റദ്ദാക്കൽ (Sec 482 CrPC Quashing)' : 'Supreme Court Precedents & Quashing Strategy'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ml'
                ? 'സിവിൽ തർക്കങ്ങളെ ക്രിമിനൽ കേസുകളാക്കി വ്യാജമായി കെട്ടിച്ചമയ്ക്കുന്നതിനെതിരെ ബഹുമാനപ്പെട്ട സുപ്രീം കോടതിയുടെയും ഹൈക്കോടതിയുടെയും വിധിന്യായങ്ങൾ അടിസ്ഥാനമാക്കിയുള്ള പ്രതിരോധ വഴികൾ.'
                : 'Judicial precedents and strategic steps to quash false, malicious, or civil-turned-criminal FIRs before the High Court under Section 482 of CrPC / Section 528 BNSS.'}
            </p>
          </div>

          {/* 4-Step Strategic Blueprint */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                <h4 className="font-bold text-sm text-white">
                  {lang === 'ml' ? 'മുൻകൂർ ജാമ്യം / 41A സംരക്ഷണം' : 'Step 1: Secure Pre-Arrest Protection'}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ml'
                  ? '7 വർഷത്തിൽ താഴെ ശിക്ഷയുള്ള വകുപ്പുകളിൽ പോലീസിന് പെട്ടെന്ന് അറസ്റ്റ് ചെയ്യാനാകില്ല (Arnesh Kumar v. State of Bihar). സെക്ഷൻ 41A നോട്ടീസ് വഴി അന്വേഷണവുമായി സഹകരിക്കുകയും ആവശ്യമെങ്കിൽ സെഷൻസ്/ഹൈക്കോടതിയിൽ മുൻകൂർ ജാമ്യം (Anticipatory Bail) നേടുകയും ചെയ്യുക.'
                  : 'For offences under 7 years, routine arrest is barred under Arnesh Kumar guidelines. Comply via Section 41A CrPC notice and file for Anticipatory Bail under Section 438 CrPC.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                <h4 className="font-bold text-sm text-white">
                  {lang === 'ml' ? 'ഹൈക്കോടതിയിൽ കേസ് റദ്ദാക്കൽ ഹർജി (Sec 482)' : 'Step 2: Section 482 CrPC Quashing'}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ml'
                  ? 'കരാർ ലംഘനം ക്രിമിനൽ വഞ്ചനയല്ല (Dalip Kaur Case). പ്രാഥമിക തെളിവുകൾ ഇല്ലെന്നും കേസ് ദുരുദ്ദേശപരമാണെന്നും (State of Haryana v. Bhajan Lal) കാണിച്ച് എഫ്.ഐ.ആർ പൂർണ്ണമായി റദ്ദാക്കാൻ ഹൈക്കോടതിയിൽ Crl.M.C. ഫയൽ ചെയ്യുക.'
                  : 'File a Criminal Miscellaneous Petition in the High Court under Section 482 CrPC invoking Bhajan Lal principles showing absence of criminal ingredients and purely civil nature of dispute.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
                <h4 className="font-bold text-sm text-white">
                  {lang === 'ml' ? 'ഡിസ്ചാർജ് ഹർജി (Sec 227 / 239 CrPC)' : 'Step 3: Discharge Application in Trial Court'}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ml'
                  ? 'പോലീസ് കുറ്റപത്രം നൽകിയാലും, വിചാരണ കൂടാതെ തന്നെ കേസിൽ നിന്നും ഒഴിവാക്കാൻ (Discharge) മജിസ്‌ട്രേറ്റ് കോടതിയിൽ ഹർജി നൽകാം. മതിയായ തെളിവുകളില്ലെങ്കിൽ കോടതി പ്രതിയെ കുറ്റവിമുക്തനാക്കും.'
                  : 'If chargesheet is filed, file a Discharge application before the Trial Magistrate under Section 239 CrPC without undergoing a protracted trial.'}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">4</span>
                <h4 className="font-bold text-sm text-white">
                  {lang === 'ml' ? 'ഡിജിറ്റൽ തെളിവ് സംരക്ഷണം (Sec 65B)' : 'Step 4: Digital Evidence Preservation'}
                </h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ml'
                  ? 'സന്ദേശങ്ങൾ, ഇമെയിലുകൾ, സിസിടിവി, ബാങ്ക് സ്റ്റേറ്റ്‌മെന്റുകൾ എന്നിവ സെക്ഷൻ 65B എവിഡൻസ് ആക്ട് സർട്ടിഫിക്കറ്റോടെ സൂക്ഷിക്കുക. മാധ്യമങ്ങളുടെ വീഡിയോ ക്ലിപ്പുകൾ യൂട്യൂബിൽ നിന്ന് നീക്കം ചെയ്യുന്നതിന് മുൻപ് ഡൗൺലോഡ് ചെയ്ത് സൂക്ഷിക്കുക.'
                  : 'Preserve WhatsApp exports, CCTV, GPS, and bank receipts with certified Section 65B Indian Evidence Act certificates. Archive defamatory broadcasts before deletion.'}
              </p>
            </div>
          </div>

          {/* Landmark Supreme Court Precedents Table */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ml' ? 'സുപ്രധാന സുപ്രീം കോടതി വിധിന്യായങ്ങൾ (Landmark Precedents):' : 'Key Supreme Court Precedents Supporting Accused:'}</span>
            </h4>

            <div className="space-y-3">
              {currentFIR.defencePrecedents.map((prec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs text-amber-300">{prec.title}</span>
                      <span className="text-[10px] font-mono text-indigo-300 font-bold">({prec.citation})</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {prec.court}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-slate-400">Ratio Decidendi: </strong>
                    {lang === 'ml' ? prec.ratioDecidendiMalayalam : prec.ratioDecidendi}
                  </p>

                  <div className="pt-1 text-[11px] text-emerald-400 font-medium">
                    <span>💡 <strong>{lang === 'ml' ? 'ഈ കേസിനുള്ള പ്രസക്തി:' : 'Relevance:'}</strong> {prec.applicabilityToCase}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PENAL CODE & BARE ACTS QUICK REFERENCE */}
      {/* ========================================================================= */}
      {activeSubTab === 'bareActs' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl animate-in fade-in">
          <div className="space-y-1">
            <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{lang === 'ml' ? 'പ്രധാന നിയമ വകുപ്പുകൾ (IPC & Bharatiya Nyaya Sanhita - BNS)' : 'Key Penal Code Sections & Statutory Reference'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ml'
                ? 'ഇന്ത്യൻ ശിക്ഷാ നിയമവും (IPC) പുതിയ ഭാരതീയ ന്യായ സംഹിതയും (BNS) തമ്മിലുള്ള താരതമ്യവും പ്രതിരോധ വകുപ്പുകളും.'
                : 'Direct comparison of legacy IPC sections with the new Bharatiya Nyaya Sanhita (BNS) provisions and defence remedies.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KEY_LEGAL_ACTS_REFERENCE.map((act, idx) => (
              <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-800">
                  <div>
                    <span className="font-black text-xs text-amber-300 font-mono">{act.ipcSection}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">New: {act.bnsSection}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${act.bailable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {act.bailable ? 'Bailable' : 'Non-Bailable'}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {act.cognizable ? 'Cognizable' : 'Non-Cognizable'}
                    </span>
                  </div>
                </div>

                <h5 className="font-bold text-xs text-white">
                  {lang === 'ml' ? act.offenceTitleMalayalam : act.offenceTitle}
                </h5>

                <p className="text-[11px] text-slate-300">
                  <strong className="text-slate-400">Max Punishment: </strong> {act.maxPunishment}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-emerald-300 leading-snug">
                  <strong className="text-slate-400 block text-[9px] uppercase font-bold">Key Defence Ground:</strong>
                  {act.keyLegalDefence}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Legal Aid & e-Courts Help Links */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-0.5">
              <h5 className="font-bold text-xs text-white">
                {lang === 'ml' ? 'സൗജന്യ നിയമ സഹായം (KELSA / NALSA Legal Aid)' : 'Free Legal Aid & Official e-Courts Portal'}
              </h5>
              <p className="text-[11px] text-slate-400">Toll-Free Helpline: 15100 • Kerala State Legal Services Authority</p>
            </div>
            <a
              href="https://services.ecourts.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>National e-Courts Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

    </div>
  );
};

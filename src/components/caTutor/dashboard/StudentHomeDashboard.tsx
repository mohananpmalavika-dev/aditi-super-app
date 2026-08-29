import React from 'react';
import { 
  Sparkles, 
  Clock, 
  Flame, 
  Target, 
  BookOpen, 
  Scale, 
  Calculator, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  RefreshCw,
  Award
} from 'lucide-react';
import { StudentProfile, DailyStudyPlan, ConceptMasteryRecord, PaperId } from '../../../types/caTutor';
import { calculateDaysRemaining, calculateExamReadiness } from '../../../services/caStudyPlanEngine';

interface StudentHomeDashboardProps {
  profile: StudentProfile;
  dailyPlan: DailyStudyPlan;
  masteryRecords: ConceptMasteryRecord[];
  onNavigateTab: (tab: string) => void;
  onStartLesson: (paperId: PaperId, chapterId?: string) => void;
  onTriggerReplan: () => void;
}

export const StudentHomeDashboard: React.FC<StudentHomeDashboardProps> = ({
  profile,
  dailyPlan,
  masteryRecords,
  onNavigateTab,
  onStartLesson,
  onTriggerReplan
}) => {
  const daysLeft = calculateDaysRemaining(profile.targetExamDate);
  const readiness = calculateExamReadiness(masteryRecords);
  const lang = profile.languagePreference;

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* 1. Top Intelligent Tutor Banner (74 Days Countdown & Target) */}
      <div className="relative overflow-hidden p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-blue-900/90 via-indigo-950/90 to-purple-950/90 border border-indigo-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 tracking-wider uppercase">
                {daysLeft} {lang === 'ml' ? 'ദിവസങ്ങൾ ബാക്കി' : 'Days to CA Foundation'}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {profile.curriculumVersionId}
              </span>
            </div>
            
            <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">
              {lang === 'ml' 
                ? `ശുഭദിനം ${profile.name}! ഇന്നത്തെ പഠന ലക്ഷ്യം: 3 മണിക്കൂർ 20 മിനിറ്റ്.`
                : `Good day ${profile.name}! Today's target: 3 hours 20 minutes.`}
            </h2>
            
            <p className="text-xs sm:text-sm text-indigo-200">
              {lang === 'ml'
                ? 'അക്കൗണ്ടിംഗ് ബാങ്ക് റികൺസിലിയേഷൻ സ്റ്റേറ്റ്‌മെന്റിലെ (BRS) വ്യത്യാസങ്ങൾ പഠിച്ച് ഇന്ന് ആരംഭിക്കാം.'
                : 'Start with Accounting — Bank Reconciliation Statement (BRS) to strengthen high-weightage scoring.'}
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0">
            <button
              onClick={() => onStartLesson('paper-1', 'p1-ch2')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>{lang === 'ml' ? 'പഠനം തുടരുക (Continue)' : 'Continue Learning'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('tutor')}
              className="px-4 py-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-indigo-500/40 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ml' ? 'AI ട്യൂട്ടറോട് ചോദിക്കുക' : 'Ask AI Tutor (Voice/Chat)'}</span>
            </button>
          </div>
        </div>

        {/* Quick Progress Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-indigo-500/20 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-indigo-300 font-bold uppercase block">{lang === 'ml' ? 'പഠന സ്ട്രീക്ക്' : 'Study Streak'}</span>
            <div className="flex items-center gap-1.5 font-black text-amber-400 text-sm">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>12 Days 🔥</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-indigo-300 font-bold uppercase block">{lang === 'ml' ? 'പരീക്ഷാ തയ്യാറെടുപ്പ്' : 'Exam Readiness'}</span>
            <div className="font-black text-emerald-400 text-sm">
              {readiness.overallScore} / 100
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-indigo-300 font-bold uppercase block">{lang === 'ml' ? 'പ്രതീക്ഷിക്കുന്ന മാർക്ക്' : 'Predicted Marks'}</span>
            <div className="font-black text-cyan-300 text-sm">
              {readiness.predictedMarksRange}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-indigo-300 font-bold uppercase block">{lang === 'ml' ? 'ഇന്നത്തെ റിവിഷൻ' : 'Due Revisions'}</span>
            <div className="font-black text-purple-300 text-sm">
              4 Concepts Due
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Hourly Study Schedule Spotlight */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              {lang === 'ml' ? 'ഇന്നത്തെ വ്യക്തിഗത പഠന ഷെഡ്യൂൾ' : "Today's Adaptive Study Plan"}
            </h3>
          </div>
          <button
            onClick={onTriggerReplan}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'ഷെഡ്യൂൾ പുതുക്കുക (Replan)' : 'Recalculate Plan'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dailyPlan.schedule.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {item.timeSlot}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.activityType === 'Learn' ? 'bg-blue-500/20 text-blue-300' :
                    item.activityType === 'Practice' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-purple-500/20 text-purple-300'
                  }`}>
                    {item.activityType}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-white">{item.chapterTitle}</h4>
                <p className="text-[11px] text-slate-400">{item.lessonTitle}</p>
              </div>

              <button
                onClick={() => onStartLesson(item.subjectId)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1 transition-all flex-shrink-0"
              >
                <span>Start</span>
                <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Four CA Foundation Papers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm sm:text-base text-white">
            {lang === 'ml' ? 'സി.എ ഫൗണ്ടേഷൻ വിഷയങ്ങൾ (4 Papers)' : 'CA Foundation Subjects'}
          </h3>
          <span className="text-xs text-slate-400 font-medium">400 Total Marks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Paper 1: Accounting */}
          <div 
            onClick={() => onStartLesson('paper-1')}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 cursor-pointer group transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-cyan-400">100 M</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Paper 1</span>
              <h4 className="font-extrabold text-sm text-white group-hover:text-cyan-300 transition-colors">
                Accounting
              </h4>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Mastery</span>
                <span className="text-cyan-400">76%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[76%] h-full bg-cyan-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Paper 2: Business Laws */}
          <div 
            onClick={() => onStartLesson('paper-2')}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer group transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Scale className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-amber-400">100 M</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Paper 2</span>
              <h4 className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors">
                Business Laws
              </h4>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Mastery</span>
                <span className="text-amber-400">68%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[68%] h-full bg-amber-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Paper 3: Quantitative Aptitude */}
          <div 
            onClick={() => onStartLesson('paper-3')}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 cursor-pointer group transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-emerald-400">100 M (Obj)</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Paper 3</span>
              <h4 className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Quantitative Aptitude
              </h4>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Mastery</span>
                <span className="text-emerald-400">72%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[72%] h-full bg-emerald-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Paper 4: Business Economics */}
          <div 
            onClick={() => onStartLesson('paper-4')}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer group transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-black text-purple-400">100 M (Obj)</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Paper 4</span>
              <h4 className="font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors">
                Business Economics
              </h4>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Mastery</span>
                <span className="text-purple-400">80%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="w-[80%] h-full bg-purple-400 rounded-full" />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { Lesson, LanguageMode, PaperId } from '../../../types/caTutor';

interface LessonViewerProps {
  lesson: Lesson;
  paperTitle: string;
  lang?: LanguageMode;
  onAskDoubtAtTimestamp: (lesson: Lesson, timestampSeconds: number) => void;
  onLessonCompleted: (lessonId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  paperTitle,
  lang = 'ml-en',
  onAskDoubtAtTimestamp,
  onLessonCompleted
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(320); // 5m 20s
  const [activeNotesTab, setActiveNotesTab] = useState<'manglish' | 'ml' | 'en'>('manglish');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [checkpointAnswered, setCheckpointAnswered] = useState<Record<string, number>>({});

  const duration = lesson.durationMinutes * 60;

  const currentCheckpoint = lesson.checkpoints.find(
    (cp) => Math.abs(cp.timestampSeconds - currentTime) < 20
  ) || lesson.checkpoints[0];

  return (
    <div className="space-y-6 text-white font-sans animate-in fade-in">
      
      {/* 1. Video Player Container */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl space-y-3">
        
        {/* Mock Video Canvas */}
        <div className="relative aspect-video bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-center">
          
          {/* Faculty Profile Badge */}
          <div className="absolute top-4 left-4 p-2 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-2.5 backdrop-blur-md">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs">
              CA
            </div>
            <div className="text-left">
              <p className="font-extrabold text-xs text-white">{lesson.facultyName}</p>
              <p className="text-[10px] text-slate-400">{lesson.facultyDesignation}</p>
            </div>
          </div>

          {/* Interactive "Ask About This" Button at Timestamp */}
          <button
            onClick={() => onAskDoubtAtTimestamp(lesson, currentTime)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'ml' ? 'ഇതിനെക്കുറിച്ച് സംശയം ചോദിക്കുക' : 'Ask About This Moment'}</span>
          </button>

          {/* Central Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 hover:scale-105 flex items-center justify-center text-slate-950 shadow-2xl shadow-amber-500/40 transition-all active:scale-95"
          >
            {isPlaying ? <Pause className="w-7 h-7 fill-slate-950" /> : <Play className="w-7 h-7 fill-slate-950 ml-1" />}
          </button>

          <div className="mt-4 space-y-1">
            <h3 className="font-extrabold text-base sm:text-lg text-white">{lesson.title}</h3>
            <p className="text-xs text-indigo-300">{lesson.titleMalayalam}</p>
          </div>

          {/* Video Timeline & Controls */}
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
              <span>{Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, '0')}</span>
              <span>/</span>
              <span>{lesson.durationMinutes}:00</span>
            </div>

            {/* Checkpoint Indicators */}
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full relative cursor-pointer">
              <div className="w-[35%] h-full bg-amber-400 rounded-full" />
              {lesson.checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  style={{ left: `${(cp.timestampSeconds / duration) * 100}%` }}
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950"
                  title="Interactive Checkpoint"
                />
              ))}
            </div>

            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>
        </div>

        {/* 2. In-Video Interactive Checkpoint Question */}
        {currentCheckpoint && (
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 m-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 uppercase">
                🎯 Interactive Video Checkpoint (05:20)
              </span>
              <span className="text-[10px] text-slate-400">Answer before continuing</span>
            </div>

            <p className="font-extrabold text-xs sm:text-sm text-white">
              {currentCheckpoint.question}
            </p>
            <p className="text-xs text-indigo-200">
              {currentCheckpoint.questionMalayalam}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {currentCheckpoint.options.map((opt, idx) => {
                const selected = checkpointAnswered[currentCheckpoint.id];
                const isCorrect = idx === currentCheckpoint.correctOptionIndex;
                const isSelected = selected === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCheckpointAnswered({ ...checkpointAnswered, [currentCheckpoint.id]: idx })}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selected !== undefined
                        ? isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : isSelected
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {checkpointAnswered[currentCheckpoint.id] !== undefined && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-snug space-y-1">
                <strong className="text-amber-400 block text-[10px] uppercase">Explanation:</strong>
                <p>{currentCheckpoint.explanation}</p>
                <p className="text-amber-200/80 text-[11px]">{currentCheckpoint.explanationMalayalam}</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. Comprehensive Multilingual Lesson Notes */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              {lang === 'ml' ? 'പാഠഭാഗ കുറിപ്പുകൾ (Lesson Notes)' : 'Faculty & AI Lesson Notes'}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'manglish', label: 'Manglish (Mixed)' },
              { id: 'ml', label: 'മലയാളം' },
              { id: 'en', label: 'English' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveNotesTab(t.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  activeNotesTab === t.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-line font-mono">
          {activeNotesTab === 'manglish' ? lesson.notesManglish : activeNotesTab === 'ml' ? lesson.notesMl : lesson.notesEn}
        </div>

        <button
          onClick={() => onLessonCompleted(lesson.id)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark Lesson as Completed & Update Mastery</span>
        </button>
      </div>

    </div>
  );
};

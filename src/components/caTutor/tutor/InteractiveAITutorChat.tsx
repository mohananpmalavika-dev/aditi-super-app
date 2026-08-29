import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Scale, 
  Calculator, 
  TrendingUp, 
  Camera, 
  Mic, 
  ChevronRight, 
  HelpCircle,
  Award,
  Layers
} from 'lucide-react';
import { 
  TutorMode, 
  LanguageMode, 
  TutorResponse, 
  StudentProfile, 
  PaperId, 
  WhiteboardAction 
} from '../../../types/caTutor';
import { orchestrateTutorResponse } from '../../../services/caTutorOrchestrator';
import { TutorWhiteboard } from '../whiteboard/TutorWhiteboard';
import { VoiceTutorBar } from './VoiceTutorBar';
import confetti from 'canvas-confetti';

interface InteractiveAITutorChatProps {
  profile: StudentProfile;
  initialQuery?: string;
  activeSubjectId?: PaperId;
  activeChapterTitle?: string;
  activeLessonTitle?: string;
  onOpenPracticeQuestion?: (qId: string) => void;
  onOpenCameraDoubt?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  textMalayalam?: string;
  textManglish?: string;
  spokenText?: string;
  tutorMode?: TutorMode;
  whiteboardActions?: WhiteboardAction[];
  suggestedFollowUps?: string[];
  suggestedPracticeQuestionIds?: string[];
  timestamp: string;
}

export const InteractiveAITutorChat: React.FC<InteractiveAITutorChatProps> = ({
  profile,
  initialQuery,
  activeSubjectId = 'paper-1',
  activeChapterTitle = 'Bank Reconciliation Statement',
  activeLessonTitle = 'Causes of Differences & BRS Preparation',
  onOpenPracticeQuestion,
  onOpenCameraDoubt
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [tutorMode, setTutorMode] = useState<TutorMode>('teachMe');
  const [languageMode, setLanguagePreference] = useState<LanguageMode>(profile.languagePreference || 'ml-en');
  const [activeWhiteboard, setActiveWhiteboard] = useState<WhiteboardAction[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial message
  useEffect(() => {
    const defaultResponse = orchestrateTutorResponse({
      query: initialQuery || 'Teach me Bank Reconciliation Statement',
      tutorMode,
      languageMode,
      currentSubjectId: activeSubjectId,
      currentChapterTitle: activeChapterTitle,
      currentLessonTitle: activeLessonTitle
    });

    const initMsg: ChatMessage = {
      id: `msg-tutor-init`,
      sender: 'tutor',
      text: defaultResponse.answerEn,
      textMalayalam: defaultResponse.answerMl,
      textManglish: defaultResponse.answerManglish,
      spokenText: defaultResponse.spokenAudioText,
      tutorMode: defaultResponse.tutorMode,
      whiteboardActions: defaultResponse.whiteboardActions,
      suggestedFollowUps: defaultResponse.suggestedFollowUps,
      suggestedPracticeQuestionIds: defaultResponse.suggestedPracticeQuestionIds,
      timestamp: 'Just now'
    };

    setMessages([initMsg]);
    if (defaultResponse.whiteboardActions && defaultResponse.whiteboardActions.length > 0) {
      setActiveWhiteboard(defaultResponse.whiteboardActions);
    }
  }, [initialQuery, activeSubjectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate Tutor Response
    setTimeout(() => {
      const resp = orchestrateTutorResponse({
        query: text,
        tutorMode,
        languageMode,
        currentSubjectId: activeSubjectId,
        currentChapterTitle: activeChapterTitle,
        currentLessonTitle: activeLessonTitle
      });

      const tutorMsg: ChatMessage = {
        id: `msg-tutor-${Date.now()}`,
        sender: 'tutor',
        text: resp.answerEn,
        textMalayalam: resp.answerMl,
        textManglish: resp.answerManglish,
        spokenText: resp.spokenAudioText,
        tutorMode: resp.tutorMode,
        whiteboardActions: resp.whiteboardActions,
        suggestedFollowUps: resp.suggestedFollowUps,
        suggestedPracticeQuestionIds: resp.suggestedPracticeQuestionIds,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, tutorMsg]);

      if (resp.whiteboardActions && resp.whiteboardActions.length > 0) {
        setActiveWhiteboard(resp.whiteboardActions);
      }

      // Auto speech synthesis if requested
      if (resp.spokenAudioText && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(resp.spokenAudioText);
        utter.rate = playbackSpeed;
        utter.onstart = () => setIsSpeaking(true);
        utter.onend = () => setIsSpeaking(false);
        utter.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utter);
      }
    }, 300);
  };

  const handleToggleListen = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = languageMode === 'ml' ? 'ml-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };

    recognition.start();
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-4 font-sans text-white">
      
      {/* 1. Mode Switcher & Language Controls */}
      <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
        
        {/* 10-Tutor Mode Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mr-1 flex-shrink-0">
            Tutor Mode:
          </span>
          {[
            { id: 'teachMe', name: 'Teach Me' },
            { id: 'explainSimply', name: 'Explain Simply' },
            { id: 'socratic', name: 'Socratic Guiding' },
            { id: 'examTutor', name: 'Exam Marks Focus' },
            { id: 'problemSolving', name: 'Problem Solver' },
            { id: 'quizTutor', name: 'Oral Quiz' },
            { id: 'revisionTutor', name: 'Rapid Revision' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setTutorMode(m.id as TutorMode)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                tutorMode === m.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {(['ml-en', 'ml', 'en'] as LanguageMode[]).map((l) => (
            <button
              key={l}
              onClick={() => setLanguagePreference(l)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold transition-all ${
                languageMode === l
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {l === 'ml-en' ? 'Manglish' : l === 'ml' ? 'മലയാളം' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Live Chat on Left, Whiteboard on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: Interactive Chat (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[560px] rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] p-4 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-2.5 shadow-md ${
                    msg.sender === 'student'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'tutor' && (
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px] text-amber-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>CA AI Tutor • {msg.tutorMode}</span>
                      </span>
                      <span className="text-slate-500">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Multilingual Text Render */}
                  <p className="whitespace-pre-line">
                    {msg.sender === 'tutor'
                      ? languageMode === 'ml' && msg.textMalayalam
                        ? msg.textMalayalam
                        : languageMode === 'ml-en' && msg.textManglish
                        ? msg.textManglish
                        : msg.text
                      : msg.text}
                  </p>

                  {/* Practice Question Badge Link */}
                  {msg.suggestedPracticeQuestionIds && msg.suggestedPracticeQuestionIds.length > 0 && onOpenPracticeQuestion && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => onOpenPracticeQuestion(msg.suggestedPracticeQuestionIds![0])}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <span>📝 Solve Exam Practice Question</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Follow-up suggestion pills */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2 pl-2">
                    {msg.suggestedFollowUps.map((fu, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(fu)}
                        className="px-2.5 py-1 rounded-xl bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-[11px] font-semibold transition-all"
                      >
                        💡 {fu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            {onOpenCameraDoubt && (
              <button
                type="button"
                onClick={onOpenCameraDoubt}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all flex-shrink-0"
                title="Photo / Screenshot Doubt Solver"
              >
                <Camera className="w-4 h-4 text-purple-400" />
              </button>
            )}

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything in English, Malayalam or Manglish..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />

            <button
              onClick={() => handleSendMessage()}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition-all flex-shrink-0 active:scale-95 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Right Column: Interactive Whiteboard (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Live Whiteboard</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Synchronized</span>
          </div>

          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 min-h-[500px] shadow-2xl">
            <TutorWhiteboard actions={activeWhiteboard} lang={languageMode} />
          </div>
        </div>

      </div>

      {/* 3. Sticky Voice Bar at bottom */}
      <VoiceTutorBar
        isListening={isListening}
        isSpeaking={isSpeaking}
        languageMode={languageMode}
        onToggleListen={handleToggleListen}
        onStopSpeaking={handleStopSpeaking}
        onQuickVoiceCommand={(cmd) => handleSendMessage(cmd)}
        onSpeedChange={(speed) => setPlaybackSpeed(speed)}
        playbackSpeed={playbackSpeed}
      />

    </div>
  );
};

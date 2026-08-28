import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Trash2, Send, FileText, Globe, Sparkles, Languages, ChevronDown } from 'lucide-react';
import { startVoiceRecognition, stopVoiceRecognition, SpeechLanguage, isSpeechRecognitionSupported } from '../../services/voiceToTextService';
import { INDIAN_LANGUAGES, translateIndianLanguageToEnglish, IndianLanguageMeta } from '../../services/indianLanguageTranslationService';

interface AudioRecorderProps {
  onSendAudio: (audioData: { duration: number; bars: number[] }) => void;
  onSendTranscribedText?: (text: string) => void;
  onCancel: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onSendAudio,
  onSendTranscribedText,
  onCancel
}) => {
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>([40, 60, 30, 80, 50, 90, 70, 45, 60, 85, 35, 95]);
  const [transcribedText, setTranscribedText] = useState('');
  const [translatedEnglishText, setTranslatedEnglishText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLang, setSelectedLang] = useState<IndianLanguageMeta>(INDIAN_LANGUAGES[0]); // Default: Malayalam
  const [showLangMenu, setShowLangMenu] = useState(false);
  const timerRef = useRef<any>(null);
  const stopRecognitionRef = useRef<(() => void) | null>(null);

  // Audio timer & waveform simulation
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
      setBars((prev) => [
        ...prev.slice(1),
        Math.floor(Math.random() * 70) + 25
      ]);
    }, 1000);

    // Auto-start live speech recognition in selected language
    if (isSpeechRecognitionSupported()) {
      setIsTranscribing(true);
      const stopper = startVoiceRecognition({
        lang: selectedLang.speechCode,
        continuous: true,
        interimResults: true,
        onResult: (text, isFinal) => {
          setTranscribedText(text);
          if (text.trim()) {
            // Live translate to English
            setIsTranslating(true);
            translateIndianLanguageToEnglish(text, selectedLang.code, 'en').then((res) => {
              setTranslatedEnglishText(res.translatedText);
              setIsTranslating(false);
            });
          }
        },
        onError: () => {
          setIsTranscribing(false);
        }
      });
      stopRecognitionRef.current = stopper;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopRecognitionRef.current?.();
      stopVoiceRecognition();
    };
  }, [selectedLang]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendVoiceMemo = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopRecognitionRef.current?.();
    onSendAudio({ duration: Math.max(duration, 1), bars });
  };

  const handleSendAsNativeText = () => {
    if (!transcribedText.trim()) return;
    if (timerRef.current) clearInterval(timerRef.current);
    stopRecognitionRef.current?.();
    if (onSendTranscribedText) {
      onSendTranscribedText(transcribedText.trim());
    } else {
      onSendAudio({ duration: Math.max(duration, 1), bars });
    }
  };

  const handleSendAsEnglishText = () => {
    const textToSend = translatedEnglishText.trim() || transcribedText.trim();
    if (!textToSend) return;
    if (timerRef.current) clearInterval(timerRef.current);
    stopRecognitionRef.current?.();
    if (onSendTranscribedText) {
      onSendTranscribedText(textToSend);
    } else {
      onSendAudio({ duration: Math.max(duration, 1), bars });
    }
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl animate-in fade-in space-y-2.5 relative">
      
      {/* Top Controls Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          {/* Recording Pulse */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-bold text-rose-400">
              {formatTime(duration)}
            </span>
          </div>

          {/* Dynamic Waveform Visualizer */}
          <div className="flex items-center gap-1 h-8 px-2 bg-slate-950/80 rounded-xl border border-slate-800">
            {bars.map((height, idx) => (
              <div
                key={idx}
                className="w-1 bg-gradient-to-t from-indigo-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>

          {/* Indian Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-indigo-500/30 text-xs font-bold text-indigo-300 hover:text-white hover:border-indigo-400 transition-all shadow-sm"
              title="Change Voice Input Language"
            >
              <span>{selectedLang.flag}</span>
              <span className="text-[11px]">{selectedLang.nameNative}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute bottom-10 left-0 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-40 w-48 max-h-56 overflow-y-auto space-y-1 animate-in fade-in">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Select Indian Language
                </div>
                {INDIAN_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setSelectedLang(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-bold text-left transition-all ${
                      selectedLang.code === lang.code
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nameNative}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">{lang.nameEnglish}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Cancel / Trash */}
          <button
            type="button"
            onClick={() => {
              stopRecognitionRef.current?.();
              onCancel();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
            title="Cancel Recording"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Send in English (Translate to English) */}
          {translatedEnglishText.trim() && (
            <button
              type="button"
              onClick={handleSendAsEnglishText}
              className="p-2 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
              title="Translate to English and Send Message"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-200" />
              <span>Send in English (ഇംഗ്ലീഷിൽ)</span>
            </button>
          )}

          {/* Send as Native Text */}
          {transcribedText.trim() && (
            <button
              type="button"
              onClick={handleSendAsNativeText}
              className="p-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-all"
              title="Send in Spoken Language"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-300" />
              <span className="hidden sm:inline">Original ({selectedLang.nameNative})</span>
            </button>
          )}

          {/* Send Raw Audio Memo */}
          <button
            type="button"
            onClick={handleSendVoiceMemo}
            className="p-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Audio</span>
          </button>
        </div>
      </div>

      {/* Live Indian Language Speech Recognition & Live English Translation Preview */}
      {isTranscribing && (
        <div className="p-3 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-2 text-xs">
          {/* Spoken Voice in Indian Language */}
          <div className="flex items-start gap-2">
            <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0 mt-0.5">
              <Mic className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                <span className="flex items-center gap-1 text-indigo-300">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Spoken Voice ({selectedLang.flag} {selectedLang.nameNative} തത്സമയം):</span>
                </span>
                <span className="text-[9px] text-slate-500">Live Voice to Text</span>
              </div>
              <p className="text-slate-200 font-medium text-xs leading-relaxed italic">
                {transcribedText || `Speak in ${selectedLang.nameEnglish}... (${selectedLang.nameNative} സംസാരിക്കൂ...)`}
              </p>
            </div>
          </div>

          {/* Live English Translation */}
          {transcribedText.trim() && (
            <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 flex-shrink-0 mt-0.5">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-0.5">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <span>🌐 Translated to English (ഇംഗ്ലീഷ് പരിഭാഷ):</span>
                  </span>
                  {isTranslating && <span className="text-[9px] text-amber-400 animate-pulse">Translating...</span>}
                </div>
                <p className="text-emerald-200 font-bold text-xs leading-relaxed">
                  {translatedEnglishText || 'Translating into English...'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

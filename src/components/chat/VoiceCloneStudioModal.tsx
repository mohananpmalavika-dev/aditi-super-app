import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Sliders, 
  Sparkles, 
  CheckCircle, 
  Volume2, 
  RotateCcw,
  Languages,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  Trash2,
  AlertCircle,
  FileCheck,
  Radio,
  SlidersHorizontal,
  Lock,
  Headphones,
  Activity,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserVoiceProfile, VoiceProfile } from '../../types/superApp';
import { 
  getActiveVoiceProfile, 
  saveActiveVoiceProfile, 
  deleteVoiceProfile, 
  validateEnrollmentAudioQuality,
  DEFAULT_ENROLLED_VOICE 
} from '../../services/voice/voiceProfileService';
import { playSyntheticVoice, voiceCacheManager } from '../../services/voice/voiceSynthesisEngine';

interface VoiceCloneStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserVoiceProfile) => void;
}

const SAMPLE_PROMPTS = [
  'Hello, this is my personal voice profile for Aditi Chat.',
  'I consent to creating an AI-generated version of my voice for message playback.',
  'ഞാൻ ഇന്ന് വൈകുന്നേരം വരാം. എനിക്ക് മലയാളവും ഇംഗ്ലീഷും സംസാരിക്കാൻ കഴിയും.',
  'Njan nale 10 manikku ethum. Ente voice clear aanu.'
];

const VOICE_PERSONAS = [
  { id: 'female-natural', name: 'Female Natural (അദിതി / മാളവിക)', gender: 'female' as const, pitch: 1.15, rate: 0.95, timbre: 'warm' as const },
  { id: 'female-crisp', name: 'Female Crisp (ക്രിസ്പ് & ക്ലിയർ)', gender: 'female' as const, pitch: 1.25, rate: 1.05, timbre: 'crisp' as const },
  { id: 'male-warm', name: 'Male Natural (ബസന്ത് / രാഹുൽ)', gender: 'male' as const, pitch: 0.85, rate: 0.95, timbre: 'warm' as const },
  { id: 'male-deep', name: 'Male Deep Resonance (ഡീപ് ശബ്ദം)', gender: 'male' as const, pitch: 0.70, rate: 0.90, timbre: 'deep' as const }
];

export const VoiceCloneStudioModal: React.FC<VoiceCloneStudioModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'consent' | 'record' | 'customize' | 'privacy'>('record');
  const [hasConsent, setHasConsent] = useState(true);
  const [profile, setProfile] = useState<VoiceProfile>(getActiveVoiceProfile() || DEFAULT_ENROLLED_VOICE);

  // Live Audio Recording & Frequency Detection
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(profile.sampleDurationSec || 0);
  const [qualityScore, setQualityScore] = useState(85);
  const [qualityFeedback, setQualityFeedback] = useState('Microphone ready to capture vocal profile');
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(profile.sampleAudioUrl || null);
  const [isPlayingRecordedSample, setIsPlayingRecordedSample] = useState(false);

  // Preview / Test State
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [testText, setTestText] = useState('ഹലോ! ഇത് അദിതി ആപ്പിലെ എന്റെ സ്വന്തം ശബ്ദമാണ്. Njan nale 10 manikku ethum.');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const sampleAudioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const stopPreviewRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      const active = getActiveVoiceProfile();
      if (active) {
        setProfile(active);
        setHasConsent(true);
        setRecordedAudioUrl(active.sampleAudioUrl || null);
        setActiveTab('record');
      } else {
        setProfile(DEFAULT_ENROLLED_VOICE);
        setHasConsent(false);
        setActiveTab('consent');
      }
      setIsPlayingPreview(false);
      setIsRecording(false);
    } else {
      cleanupRecordingResources();
      stopPreviewRef.current?.();
      sampleAudioPlayerRef.current?.pause();
      setIsPlayingPreview(false);
      setIsPlayingRecordedSample(false);
    }
  }, [isOpen]);

  const cleanupRecordingResources = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
  };

  // Real Microphone Capture with Frequency Pitch Detection
  const handleStartRealRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      audioStreamRef.current = stream;

      // Audio Context for Pitch / Frequency Analysis
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Pitch auto-correlation analysis loop
      const buffer = new Float32Array(analyser.fftSize);
      const analyzeFrequency = () => {
        analyser.getFloatTimeDomainData(buffer);
        let bestOffset = -1;
        let bestCorrelation = 0;
        let rms = 0;
        for (let i = 0; i < buffer.length; i++) {
          rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / buffer.length);

        if (rms > 0.02) {
          for (let offset = 20; offset < 500; offset++) {
            let correlation = 0;
            for (let i = 0; i < buffer.length - offset; i++) {
              correlation += buffer[i] * buffer[i + offset];
            }
            correlation = correlation / (buffer.length - offset);
            if (correlation > bestCorrelation) {
              bestCorrelation = correlation;
              bestOffset = offset;
            }
          }
          if (bestOffset > 0) {
            const freq = Math.round(audioCtx.sampleRate / bestOffset);
            if (freq >= 70 && freq <= 400) {
              setDetectedFrequency(freq);
            }
          }
        }
        animFrameRef.current = requestAnimationFrame(analyzeFrequency);
      };
      animFrameRef.current = requestAnimationFrame(analyzeFrequency);

      // Setup MediaRecorder
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setRecordedAudioUrl(base64Audio);
          setProfile((prev) => ({
            ...prev,
            sampleAudioUrl: base64Audio
          }));
        };
        reader.readAsDataURL(audioBlob);
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingDuration(0);
      setQualityFeedback('🎤 Live recording... Please read the prompt sentences clearly.');
    } catch (err: any) {
      console.warn('Microphone access denied or error:', err);
      setQualityFeedback('⚠️ Microphone access required. Please allow mic permissions.');
    }
  };

  // Stop recording and finalize voice profile metrics
  const handleStopRealRecording = () => {
    setIsRecording(false);
    cleanupRecordingResources();

    const quality = validateEnrollmentAudioQuality(recordingDuration);
    setQualityScore(quality.score);
    setQualityFeedback(quality.feedback);

    // Auto-tune pitch and timbre based on user's real detected vocal frequency
    if (detectedFrequency) {
      let gender: 'female' | 'male' = detectedFrequency > 165 ? 'female' : 'male';
      let pitchVal = gender === 'male' ? Math.max(0.70, (detectedFrequency / 140) * 0.85) : Math.min(1.30, (detectedFrequency / 210) * 1.15);
      let timbreVal: 'warm' | 'deep' | 'crisp' = detectedFrequency < 130 ? 'deep' : detectedFrequency > 230 ? 'crisp' : 'warm';

      setProfile((prev) => ({
        ...prev,
        voiceGender: gender,
        pitch: parseFloat(pitchVal.toFixed(2)),
        timbre: timbreVal,
        displayName: gender === 'female' ? 'Aditi Cloned Vocal Avatar (എന്റെ ശബ്ദം)' : 'My Vocal Avatar (എന്റെ ശബ്ദം)'
      }));
    }

    if (quality.isValid) {
      confetti({ particleCount: 60, spread: 70 });
    }
  };

  // Timer while recording
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleTogglePlayRecordedSample = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecordedSample) {
      sampleAudioPlayerRef.current?.pause();
      setIsPlayingRecordedSample(false);
      return;
    }

    const audio = new Audio(recordedAudioUrl);
    sampleAudioPlayerRef.current = audio;
    setIsPlayingRecordedSample(true);
    audio.onended = () => setIsPlayingRecordedSample(false);
    audio.onerror = () => setIsPlayingRecordedSample(false);
    audio.play().catch(() => setIsPlayingRecordedSample(false));
  };

  const handleSelectPersona = (p: typeof VOICE_PERSONAS[0]) => {
    setProfile((prev) => ({
      ...prev,
      voiceGender: p.gender,
      pitch: p.pitch,
      rate: p.rate,
      timbre: p.timbre,
      displayName: p.name
    }));
  };

  const handleTestPreview = () => {
    if (isPlayingPreview) {
      stopPreviewRef.current?.();
      setIsPlayingPreview(false);
      return;
    }

    setIsPlayingPreview(true);
    const stopper = playSyntheticVoice(
      `preview-${Date.now()}`,
      testText,
      profile,
      {
        onStart: () => setIsPlayingPreview(true),
        onEnd: () => setIsPlayingPreview(false),
        onError: () => setIsPlayingPreview(false)
      }
    );
    stopPreviewRef.current = stopper;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveActiveVoiceProfile({
      ...profile,
      sampleDurationSec: recordingDuration || 30,
      sampleAudioUrl: recordedAudioUrl || undefined,
      isEnabled: true
    });
    setProfile(updated);
    onProfileUpdated?.({
      id: updated.id,
      isEnrolled: true,
      voiceName: updated.displayName,
      pitch: updated.pitch,
      rate: updated.rate,
      timbre: updated.timbre,
      voiceGender: updated.voiceGender,
      language: updated.languageHints[0] as any || 'ml-IN',
      enrolledDate: updated.updatedAt,
      sampleAudioUrl: updated.sampleAudioUrl
    });
    confetti({ particleCount: 80, spread: 80 });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your synthetic voice profile? This will immediately revoke synthetic voice playback for your messages.')) {
      deleteVoiceProfile();
      setProfile(DEFAULT_ENROLLED_VOICE);
      setRecordedAudioUrl(null);
      setHasConsent(false);
      onProfileUpdated?.({
        id: 'deleted',
        isEnrolled: false,
        voiceName: 'Standard Voice',
        pitch: 1.0,
        rate: 1.0,
        timbre: 'warm',
        language: 'ml-IN'
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 my-auto max-h-[92dvh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Personal AI Voice Studio
              </h3>
              <p className="text-xs text-purple-300/80">
                സ്വന്തം AI ശബ്ദം ക്രമീകരിക്കുക (Personalized Vocal Avatar)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              cleanupRecordingResources();
              stopPreviewRef.current?.();
              sampleAudioPlayerRef.current?.pause();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('record')}
            className={`py-2 rounded-xl transition-colors ${
              activeTab === 'record' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Record Voice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customize')}
            className={`py-2 rounded-xl transition-colors ${
              activeTab === 'customize' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Personas & Tune
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('consent')}
            className={`py-2 rounded-xl transition-colors ${
              activeTab === 'consent' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Consent
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`py-2 rounded-xl transition-colors ${
              activeTab === 'privacy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            4. Privacy
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          
          {/* TAB 1: Live Vocal Recording & Sample Playback */}
          {activeTab === 'record' && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-white">1. Read this sample sentence aloud (മൈക്കിൽ പറയുക):</span>
                <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 text-xs text-indigo-100 font-medium leading-relaxed">
                  "ഹലോ, ഇത് അദിതി ചാറ്റിലെ എന്റെ സ്വന്തം ശബ്ദമാണ്. Njan nale 10 manikku ethum. Ente voice clear aanu."
                </div>
              </div>

              {/* Quality & Frequency Meter */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-purple-400" />
                    <span>Vocal Pitch & Frequency:</span>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {detectedFrequency ? `${detectedFrequency} Hz (${detectedFrequency > 165 ? 'Female/Higher' : 'Male/Deeper'})` : 'Auto-Detecting on Mic...'}
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      isRecording ? 'bg-gradient-to-r from-rose-500 via-purple-500 to-emerald-400 animate-pulse' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(100, (recordingDuration / 15) * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Duration: <strong className="text-purple-300">{recordingDuration}s</strong></span>
                  <span className="text-indigo-300">{qualityFeedback}</span>
                </div>
              </div>

              {/* Record Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRealRecording}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Live Mic Recording (റെക്കോർഡ് ചെയ്യുക)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRealRecording}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Recording ({recordingDuration}s)</span>
                  </button>
                )}

                {/* Play Real Recorded Voice Sample Button */}
                {recordedAudioUrl && (
                  <button
                    type="button"
                    onClick={handleTogglePlayRecordedSample}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    {isPlayingRecordedSample ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{isPlayingRecordedSample ? 'Pause Sample' : '▶ Play My Exact Real Voice (എന്റെ ശബ്ദം)'}</span>
                  </button>
                )}
              </div>

              {/* Recorded Audio Card if available */}
              {recordedAudioUrl && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Your Real Microphone Voice Sample (യഥാർത്ഥ ശബ്ദം)</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">Captured • {recordingDuration}s</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePlayRecordedSample}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    {isPlayingRecordedSample ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    <span>{isPlayingRecordedSample ? 'Pause Real Voice' : '▶ Listen to Your Exact Recorded Voice (നിങ്ങളുടെ യഥാർത്ഥ ശബ്ദം)'}</span>
                  </button>
                </div>
              )}

              {/* Information & Feature Clarity */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>ശബ്ദ സവിശേഷതകൾ (How it works):</span>
                </div>
                <p className="leading-relaxed">
                  • <strong>വോയ്‌സ് മെസ്സേജുകൾ (Voice Notes)</strong>: ചാറ്റിൽ മൈക്ക് വഴി അയക്കുന്ന വോയ്‌സ് നോട്ടുകളിൽ നിങ്ങളുടെ 100% യഥാർത്ഥ ശബ്ദം നേരിട്ട് കേൾക്കാം.
                  <br />
                  • <strong>ടെക്സ്റ്റ് വായിക്കാനുള്ള AI ശബ്ദം (Synthetic Avatar)</strong>: നിങ്ങൾ ടൈപ്പ് ചെയ്യുന്ന സാധാരണ ടെക്സ്റ്റുകൾ നിങ്ങളുടെ ശബ്ദ ശ്രുതിക്ക് (Pitch & Timbre) അനുയോജ്യമായി AI വായിക്കുന്നു.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Voice Personas, Pitch & Fine-Tuning */}
          {activeTab === 'customize' && (
            <div className="space-y-4">
              
              {/* Presets / Personas */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-xs font-extrabold text-white">Choose Voice Persona (ശബ്ദ മോഡൽ തിരഞ്ഞെടുക്കുക):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {VOICE_PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPersona(p)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        profile.voiceGender === p.gender && profile.timbre === p.timbre
                          ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between">
                        <span>{p.name}</span>
                        {profile.voiceGender === p.gender && profile.timbre === p.timbre && (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Pitch: {p.pitch}x • {p.timbre} timbre
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kerala Slang & Accent Style Selector */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">Kerala Slang & Accent (സംസാര ശൈലി):</span>
                  <span className="text-[10px] text-purple-300 font-mono">Authentic Accent</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'natural', label: '🌴 Natural (സ്വാഭാവികം)', desc: 'Standard fluent conversational tone' },
                    { id: 'malabar', label: '🌊 Malabar (മലബാർ)', desc: 'ന്റെ ചങ്ങായീ, എന്തൊക്കെണ്ട് വിശേഷം!' },
                    { id: 'kochi', label: '🏙️ Kochi / Youth (കൊച്ചി)', desc: 'മച്ചാനേ, സീനില്ല സെറ്റാണ്!' },
                    { id: 'travancore', label: '🏰 Travancore (തെക്കൻ)', desc: 'ഞാൻ വരാം കേട്ടോ, സുഖമല്ലേ?' },
                    { id: 'formal', label: '📻 Studio (സ്റ്റുഡിയോ)', desc: 'Clear articulate broadcast tone' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, slangStyle: s.id as any }))}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        (profile.slangStyle || 'natural') === s.id
                          ? 'bg-purple-600/30 border-purple-400 text-purple-200 shadow-md scale-[1.02]'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.label}</div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pitch & Rate Sliders */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
                    <span>Vocal Pitch (ശബ്ദ ശ്രുതി):</span>
                    <span className="font-mono text-indigo-400">{profile.pitch?.toFixed(2) || '1.00'}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.60"
                    max="1.40"
                    step="0.05"
                    value={profile.pitch || 1.0}
                    onChange={(e) => setProfile((p) => ({ ...p, pitch: parseFloat(e.target.value) }))}
                    className="w-full accent-indigo-500 bg-slate-900 rounded-lg h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>Deeper (Male)</span>
                    <span>Natural</span>
                    <span>Higher (Female)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
                    <span>Speech Rate (സംസാര വേഗത):</span>
                    <span className="font-mono text-indigo-400">{profile.rate?.toFixed(2) || '0.95'}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.30"
                    step="0.05"
                    value={profile.rate || 0.95}
                    onChange={(e) => setProfile((p) => ({ ...p, rate: parseFloat(e.target.value) }))}
                    className="w-full accent-indigo-500 bg-slate-900 rounded-lg h-2"
                  />
                </div>
              </div>

              {/* Live Test & Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">Live Synthetic Speech Test:</span>
                  <span className="text-[10px] font-mono text-purple-300">Malayalam + Manglish</span>
                </div>
                <textarea
                  rows={2}
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-medium"
                />

                <button
                  type="button"
                  onClick={handleTestPreview}
                  className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    isPlayingPreview
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-lg'
                  }`}
                >
                  {isPlayingPreview ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlayingPreview ? 'Stop Audio Preview' : '▶ Test Synthetic Voice (കേട്ടുനോക്കുക)'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: Mandatory Consent & Disclosure */}
          {activeTab === 'consent' && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
                <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">Consent & Safety Disclosure</h4>
                  <p className="leading-relaxed">
                    Your recorded voice sample will be used to generate an AI-synthesized version of your voice for message playback.
                  </p>
                  <p className="text-[11px] text-purple-300/80 font-mono pt-1">
                    • Authoritative message is always the original typed text.
                    <br />• Your voice is never used for authentication or financial authorization.
                    <br />• You can delete your voice profile anytime with 1 click.
                  </p>
                </div>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-indigo-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
                />
                <span className="font-bold text-white text-xs leading-relaxed">
                  I explicitly consent to the creation and opt-in use of my synthetic voice profile for message playback representation.
                </span>
              </label>
            </div>
          )}

          {/* TAB 4: Privacy & Deletion */}
          {activeTab === 'privacy' && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <div className="space-y-2">
                <h4 className="font-extrabold text-sm text-white">Privacy & Safety Settings</h4>
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span>Allow contacts to hear my messages in my synthetic voice</span>
                  <input
                    type="checkbox"
                    checked={profile.isEnabled}
                    onChange={(e) => setProfile((p) => ({ ...p, isEnabled: e.target.checked }))}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-700 bg-slate-950"
                  />
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <h4 className="font-extrabold text-sm text-rose-300">Delete Voice Profile</h4>
                <p className="text-[11px] text-slate-400">
                  Permanently deletes your enrolled voice model, revokes all playback permissions, and clears all cached audio.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-400" />
                  <span>Delete My Voice Profile</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800 flex-shrink-0">
          <button
            type="button"
            onClick={() => {
              cleanupRecordingResources();
              stopPreviewRef.current?.();
              sampleAudioPlayerRef.current?.pause();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-extrabold shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
          >
            Save & Activate My Voice (സേവ് ചെയ്യുക)
          </button>
        </div>

      </div>
    </div>
  );
};

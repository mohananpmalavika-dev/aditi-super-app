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
  Lock
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

export const VoiceCloneStudioModal: React.FC<VoiceCloneStudioModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'consent' | 'record' | 'customize' | 'privacy'>('customize');
  const [hasConsent, setHasConsent] = useState(true);
  const [profile, setProfile] = useState<VoiceProfile>(getActiveVoiceProfile() || DEFAULT_ENROLLED_VOICE);

  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(profile.sampleDurationSec || 0);
  const [qualityScore, setQualityScore] = useState(85);
  const [qualityFeedback, setQualityFeedback] = useState('Voice profile is enrolled and active');

  // Preview / Test State
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [testText, setTestText] = useState('ഹലോ! ഇത് അദിതി ആപ്പിലെ എന്റെ സ്വന്തം AI ശബ്ദമാണ്. Njan nale 10 manikku ethum.');

  const stopPreviewRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      const active = getActiveVoiceProfile();
      if (active) {
        setProfile(active);
        setHasConsent(true);
        setActiveTab('customize');
      } else {
        setProfile(DEFAULT_ENROLLED_VOICE);
        setHasConsent(false);
        setActiveTab('consent');
      }
      setIsPlayingPreview(false);
      setIsRecording(false);
    } else {
      stopPreviewRef.current?.();
      setIsPlayingPreview(false);
    }
  }, [isOpen]);

  // Recording timer simulation
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          const next = prev + 1;
          const quality = validateEnrollmentAudioQuality(next);
          setQualityScore(quality.score);
          setQualityFeedback(quality.feedback);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    setQualityScore(10);
    setQualityFeedback('Recording live vocal sample... Please read the prompt clearly.');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    const quality = validateEnrollmentAudioQuality(recordingDuration);
    setQualityScore(quality.score);
    setQualityFeedback(quality.feedback);
    if (quality.isValid) {
      confetti({ particleCount: 50, spread: 60 });
    }
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
      language: updated.languageHints[0] as any || 'ml-IN',
      enrolledDate: updated.updatedAt
    });
    confetti({ particleCount: 80, spread: 80 });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your synthetic voice profile? This will immediately revoke synthetic voice playback for your messages.')) {
      deleteVoiceProfile();
      setProfile(DEFAULT_ENROLLED_VOICE);
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

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in overflow-y-auto">
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
                Consent-based Synthetic Vocal Avatar (എന്റെ ശബ്ദം)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopPreviewRef.current?.();
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
            onClick={() => setActiveTab('consent')}
            className={`py-2 rounded-xl transition-colors ${
              activeTab === 'consent' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Consent
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('record')}
            className={`py-2 rounded-xl transition-colors ${
              activeTab === 'record' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Record
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('customize')}
            className={`py-2 rounded-xl transition-colors ${
              activeTab === 'customize' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Tune & Test
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
          
          {/* TAB 1: Mandatory Consent & Disclosure */}
          {activeTab === 'consent' && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200">
                <ShieldCheck className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-white">Consent & Safety Disclosure</h4>
                  <p className="leading-relaxed">
                    Your recorded voice sample will be used exclusively to create an AI-generated synthetic representation of your voice for message playback.
                  </p>
                  <p className="text-[11px] text-purple-300/80 font-mono pt-1">
                    • Authoritative message remains the original text.
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

              <button
                type="button"
                disabled={!hasConsent}
                onClick={() => setActiveTab('record')}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                  hasConsent
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Continue to Vocal Recording ➔
              </button>
            </div>
          )}

          {/* TAB 2: Guided Vocal Recording Prompts & Quality Meter */}
          {activeTab === 'record' && (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-white">Guided Prompt Phrases (Read aloud):</span>
                <div className="space-y-1.5">
                  {SAMPLE_PROMPTS.map((prompt, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs text-slate-200 font-medium">
                      <span className="text-indigo-400 font-mono mr-2">{idx + 1}.</span>
                      {prompt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality & Duration Meter */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Sample Duration:</span>
                  <span className="text-emerald-400 font-bold">{recordingDuration}s / 30s Optimal</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, (recordingDuration / 30) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Quality Score: <strong className="text-purple-300">{qualityScore}%</strong></span>
                  <span className="text-indigo-300">{qualityFeedback}</span>
                </div>
              </div>

              {/* Record Button */}
              <div className="flex items-center justify-center pt-2">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 text-white font-extrabold text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Guided Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl flex items-center gap-2 animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop Recording ({recordingDuration}s)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Vocal Pitch, Timbre, and Test Box */}
          {activeTab === 'customize' && (
            <div className="space-y-4">
              
              {/* Vocal Timbre */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <span className="text-xs font-extrabold text-white">Vocal Timbre & Resonance:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['warm', 'deep', 'crisp', 'energetic', 'calm'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setProfile((p) => ({ ...p, timbre: t }))}
                      className={`p-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                        profile.timbre === t
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pitch & Rate Sliders */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
                    <span>Vocal Pitch (ശബ്ദ ശ്രുതി):</span>
                    <span className="font-mono text-indigo-400">{profile.pitch.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.35"
                    step="0.05"
                    value={profile.pitch}
                    onChange={(e) => setProfile((p) => ({ ...p, pitch: parseFloat(e.target.value) }))}
                    className="w-full accent-indigo-500 bg-slate-900 rounded-lg h-2"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1">
                    <span>Speech Rate (സംസാര വേഗത):</span>
                    <span className="font-mono text-indigo-400">{profile.rate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="1.30"
                    step="0.05"
                    value={profile.rate}
                    onChange={(e) => setProfile((p) => ({ ...p, rate: parseFloat(e.target.value) }))}
                    className="w-full accent-indigo-500 bg-slate-900 rounded-lg h-2"
                  />
                </div>
              </div>

              {/* Interactive Test & Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white">Live Synthetic Speech Preview:</span>
                  <span className="text-[10px] font-mono text-purple-300">Malayalam + Manglish + English</span>
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
                  <span>{isPlayingPreview ? 'Stop Audio Preview' : '▶ Test Synthetic Voice Output'}</span>
                </button>
              </div>

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
              stopPreviewRef.current?.();
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
            Save & Activate Voice Profile
          </button>
        </div>

      </div>
    </div>
  );
};

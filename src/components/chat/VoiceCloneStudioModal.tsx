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
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserVoiceProfile } from '../../types/superApp';
import { getUserVoiceProfile, saveUserVoiceProfile, playTextInSenderVoice } from '../../services/voiceCloneService';

interface VoiceCloneStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserVoiceProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', // Ananya
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', // Rahul
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', // Deepa
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', // Vivek
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'  // Malavika
];

export const VoiceCloneStudioModal: React.FC<VoiceCloneStudioModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated
}) => {
  const [profile, setProfile] = useState<UserVoiceProfile>(getUserVoiceProfile());
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    profile.talkingPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [sampleRecorded, setSampleRecorded] = useState(profile.isEnrolled);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [testText, setTestText] = useState('ഹലോ! ഇത് അദിതി ആപ്പിലെ എന്റെ സ്വന്തം AI സംസാരിക്കുന്ന ഫോട്ടോയും ശബ്ദവുമാണ്. ഞാൻ അയക്കുന്ന ടെക്സ്റ്റുകൾ ഈ ഫോട്ടോ സംസാരിക്കുന്നതുപോലെ നിങ്ങൾക്ക് കാണാം.');
  const stopSpeechRef = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const p = getUserVoiceProfile();
      setProfile(p);
      setSelectedPhoto(p.talkingPhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200');
      setIsPlayingTest(false);
      setIsRecording(false);
    } else {
      stopSpeechRef.current?.();
      setIsPlayingTest(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 6) {
            handleStopRecording();
            return 6;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setSelectedPhoto(url);
        setProfile((prev) => ({ ...prev, talkingPhotoUrl: url }));
        confetti({ particleCount: 30, spread: 50 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    setSampleRecorded(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setSampleRecorded(true);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleTestPlayback = () => {
    if (isPlayingTest) {
      stopSpeechRef.current?.();
      setIsPlayingTest(false);
      return;
    }

    setIsPlayingTest(true);
    const stopper = playTextInSenderVoice(
      testText,
      profile,
      () => setIsPlayingTest(true),
      () => setIsPlayingTest(false),
      () => setIsPlayingTest(false)
    );
    stopSpeechRef.current = stopper;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserVoiceProfile = {
      ...profile,
      talkingPhotoUrl: selectedPhoto,
      isEnrolled: true,
      enrolledDate: new Date().toISOString().split('T')[0]
    };
    saveUserVoiceProfile(updated);
    onProfileUpdated?.(updated);
    confetti({ particleCount: 70, spread: 70 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                AI Talking Photo & Voice Studio
              </h3>
              <p className="text-xs text-purple-300/80">
                സംസാരിക്കുന്ന ഫോട്ടോ അവതാർ + സ്വന്തം AI ശബ്ദം ക്രമീകരിക്കുക
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeechRef.current?.();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Step 1: Talking Portrait Photo Upload & Selector */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                <span>1. Talking Portrait Photo (സംസാരിക്കുന്ന നിങ്ങളുടെ ഫോട്ടോ)</span>
              </span>
              <span className="text-[10px] text-purple-300 font-mono">Face Morphing Active</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Photo Preview with Lip-Sync Halo */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-lg flex-shrink-0 bg-slate-900">
                <img
                  src={selectedPhoto}
                  alt="Talking Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                  <span className="text-[9px] text-white font-bold">Avatar</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Your Own Photo (ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക)</span>
                </button>

                {/* Preset Avatar Selection */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {PRESET_AVATARS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(url);
                        setProfile((prev) => ({ ...prev, talkingPhotoUrl: url }));
                      }}
                      className={`w-8 h-8 rounded-lg overflow-hidden border transition-all flex-shrink-0 ${
                        selectedPhoto === url ? 'border-purple-400 ring-2 ring-purple-500' : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Voice Sample Enrollment Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-purple-400" />
                <span>2. Voice Sample Enrollment (5 സെക്കൻഡ് റെക്കോർഡിംഗ്)</span>
              </span>
              {sampleRecorded && (
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" />
                  Voice Enrolled
                </span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed italic">
              "ഹലോ, ഇത് അദിതി സൂപ്പർ ആപ്പിലെ എന്റെ സ്വന്തം AI ശബ്ദമാണ്. ഞാൻ അയക്കുന്ന ടെക്സ്റ്റുകൾ ഈ ശബ്ദത്തിൽ കേൾക്കാം."
            </div>

            {!isRecording ? (
              <button
                type="button"
                onClick={handleStartRecording}
                className="w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Mic className="w-4 h-4 text-rose-400" />
                <span>{sampleRecorded ? 'Re-record Voice Sample (വീണ്ടും റെക്കോർഡ് ചെയ്യുക)' : 'Start 5s Sample Recording'}</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40">
                <div className="flex items-center gap-2 text-xs text-rose-300 font-bold animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Recording voice pitch & timbre... 00:0{recordingTime}/00:06</span>
                </div>
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-3.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Done</span>
                </button>
              </div>
            )}
          </div>

          {/* Step 3: Voice Customization & Timbre Tuning */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>3. Voice Tone & Accent Customization (ശബ്ദ ക്രമീകരണങ്ങൾ)</span>
            </span>

            {/* Timbre Preset Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400">Timbre & Tone Presets</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {(
                  [
                    { id: 'warm', label: 'Warm (സ്നേഹം)' },
                    { id: 'deep', label: 'Deep (കനത്തത്)' },
                    { id: 'crisp', label: 'Crisp (വ്യക്തം)' },
                    { id: 'calm', label: 'Calm (ശാന്തം)' },
                    { id: 'energetic', label: 'Energetic' }
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, timbre: t.id })}
                    className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all text-center ${
                      profile.timbre === t.id
                        ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pitch & Rate Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Pitch (ശബ്ദ ഉയരം)</span>
                  <span className="font-mono text-purple-400 font-bold">{profile.pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={profile.pitch}
                  onChange={(e) => setProfile({ ...profile, pitch: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Speed Rate (വേഗത)</span>
                  <span className="font-mono text-indigo-400 font-bold">{profile.rate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.35"
                  step="0.05"
                  value={profile.rate}
                  onChange={(e) => setProfile({ ...profile, rate: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Primary Language */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-purple-400" />
                <span>Primary Narration Language</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ml-IN', label: 'Malayalam (മലയാളം)' },
                  { id: 'en-IN', label: 'Indian English' },
                  { id: 'hi-IN', label: 'Hindi (ഹിന്ദി)' }
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setProfile({ ...profile, language: l.id as any })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      profile.language === l.id
                        ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Step 4: Test Cloned Voice Playback */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>4. Test Live Talking Photo Playback</span>
              </span>

              {isPlayingTest && (
                <div className="flex items-center gap-1">
                  {[20, 60, 40, 80, 50, 90, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-emerald-400 rounded-full animate-pulse"
                      style={{ height: `${h * 0.2}px`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              rows={2}
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />

            <button
              type="button"
              onClick={handleTestPlayback}
              className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                isPlayingTest
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
              }`}
            >
              {isPlayingTest ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Stop Test Playback</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Listen to Talking Photo (ശബ്ദം ടെസ്റ്റ് ചെയ്യുക)</span>
                </>
              )}
            </button>
          </div>

          {/* Submit / Save Voice Profile */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Save & Enable AI Talking Photo Avatar</span>
          </button>

        </form>

      </div>
    </div>
  );
};

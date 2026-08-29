import React, { useState } from 'react';
import { Camera, Upload, X, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { LanguageMode } from '../../../types/caTutor';

interface CameraDoubtSolverProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDoubt: (prompt: string, imageUri?: string) => void;
  lang?: LanguageMode;
}

export const CameraDoubtSolver: React.FC<CameraDoubtSolverProps> = ({
  isOpen,
  onClose,
  onSubmitDoubt,
  lang = 'ml-en'
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('Please solve this problem step-by-step and explain the working note.');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (presetText: string) => {
    setCustomQuestion(presetText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSubmitDoubt(customQuestion, imagePreview || undefined);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in font-sans">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/40 p-5 sm:p-6 shadow-2xl space-y-4 text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {lang === 'ml' ? 'ക്യാമറ / സ്ക്രീൻഷോട്ട് ഡൗട്ട് സോൾവർ' : 'Camera / Image Doubt Solver'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Upload textbook question or handwritten notes for instant AI resolution.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-950/60">
            {imagePreview ? (
              <div className="space-y-2">
                <img src={imagePreview} alt="Doubt Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="text-xs text-rose-400 font-bold hover:underline"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-purple-400 mx-auto" />
                <p className="text-xs font-bold text-slate-200">
                  Click to upload question photo or paste screenshot
                </p>
                <p className="text-[10px] text-slate-400">PNG, JPG, WebP up to 10MB</p>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Quick Voice / Question Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Doubt Prompts:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                'ഈ third step എനിക്ക് മനസ്സിലായില്ല',
                'Show full journal entry and ledger accounts',
                'What is the exam presentation format for this?'
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-all"
                >
                  💡 {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Question Text Area */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">Your Specific Question</label>
            <textarea
              rows={2}
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 resize-none"
              placeholder="What specifically do you want the tutor to explain?"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? 'Analyzing Image...' : 'Ask AI Tutor'}</span>
          </button>

        </form>

      </div>
    </div>
  );
};

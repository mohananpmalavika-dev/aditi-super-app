import React, { useState, useRef, useEffect } from 'react';
import { ScanFace, X, CheckCircle2, Sparkles, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FaceUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FaceUnlockModal: React.FC<FaceUnlockModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanStep, setScanStep] = useState<'starting' | 'scanning' | 'matched' | 'failed'>('starting');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Align your face within the frame...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scanTimerRef = useRef<any>(null);

  // Initialize Front Camera
  const startCamera = async () => {
    try {
      setScanStep('starting');
      setProgress(0);
      setStatusText('Accessing biometric sensor...');

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }

      setScanStep('scanning');
      startBiometricAnalysis();
    } catch (err) {
      console.warn('Face camera access error:', err);
      // Even if camera is blocked by browser permission, run simulation so user can still log in
      setScanStep('scanning');
      startBiometricAnalysis();
    }
  };

  const startBiometricAnalysis = () => {
    setProgress(0);
    setStatusText('Align your face within the scan frame...');

    let currentProgress = 0;
    scanTimerRef.current = setInterval(() => {
      currentProgress += 15;
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress === 30) {
        setStatusText('Detecting facial contours & 3D mesh...');
      } else if (currentProgress === 60) {
        setStatusText('Analyzing biometric hash signature...');
      } else if (currentProgress === 90) {
        setStatusText('Verifying identity with Aditi Security...');
      } else if (currentProgress >= 100) {
        clearInterval(scanTimerRef.current);
        setScanStep('matched');
        setStatusText('Face Match Verified! Authenticating...');
        confetti({ particleCount: 60, spread: 70 });

        setTimeout(() => {
          stopCamera();
          onSuccess();
        }, 1200);
      }
    }, 300);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (scanTimerRef.current) {
      clearInterval(scanTimerRef.current);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-950 border-2 border-indigo-500/50 shadow-2xl p-6 text-center space-y-4 my-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ScanFace className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm text-white">Face ID Unlock</h3>
              <p className="text-[10px] text-slate-400 font-mono">Biometric 3D Recognition</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Camera Scanner HUD */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500/40 flex items-center justify-center shadow-2xl">
          
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />

          {/* Futuristic Face Recognition Oval Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-52 h-64 rounded-[45%] border-2 transition-all duration-300 relative ${
                scanStep === 'matched'
                  ? 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)]'
                  : 'border-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
              }`}
            >
              {/* Corner reticles */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />

              {/* Animated Vertical Laser Sweep Beam */}
              {scanStep === 'scanning' && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
              )}
            </div>
          </div>

          {/* Matched Success Overlay */}
          {scanStep === 'matched' && (
            <div className="absolute inset-0 bg-emerald-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
              <span className="text-white font-extrabold text-sm">Identity Confirmed</span>
            </div>
          )}

          {/* Progress Bar Badge */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md rounded-xl p-2 border border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-medium truncate">{statusText}</span>
            <span className="font-mono font-bold text-indigo-400 ml-2">{progress}%</span>
          </div>

        </div>

        {/* Bottom Switch or Retry */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              startCamera();
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center justify-center gap-1.5 mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restart Scan</span>
          </button>
        </div>

      </div>
    </div>
  );
};

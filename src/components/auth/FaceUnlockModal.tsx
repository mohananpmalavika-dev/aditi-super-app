import React, { useState, useRef, useEffect } from 'react';
import { ScanFace, X, AlertCircle, RefreshCw, Lock } from 'lucide-react';

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
  const [scanStep, setScanStep] = useState<'starting' | 'scanning' | 'device_lock_only'>('starting');
  const [statusText, setStatusText] = useState('Accessing camera sensor...');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize Front Camera
  const startCamera = async () => {
    try {
      setScanStep('starting');
      setStatusText('Accessing device camera sensor...');

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
      setStatusText('Face preview active. WebAuthn platform authenticator required.');
    } catch (err) {
      setScanStep('device_lock_only');
      setStatusText('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
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
              <ScanFace className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm text-white">Device Face Unlock</h3>
              <p className="text-[10px] text-slate-400 font-mono">Platform Biometric Security</p>
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
            <div className="w-52 h-64 rounded-[45%] border-2 border-indigo-400/80 shadow-[0_0_20px_rgba(99,102,241,0.4)] relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
            </div>
          </div>

          {/* Notice Overlay */}
          <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md rounded-xl p-2.5 border border-white/10 text-[11px] text-slate-300 text-left">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-0.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Production Biometric Security</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Hardware-backed WebAuthn or password authentication is required for secure login.
            </p>
          </div>

        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
          >
            Use Email & Password / Google
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Start Camera Stream
  const startCamera = async (mode = facingMode) => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
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
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Unable to access device camera. Please grant camera permissions in your browser or choose file upload.'
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth || 400, video.videoHeight || 400);

    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    // Mirror image for natural selfie feel
    if (facingMode === 'user') {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(dataUrl);
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      stopCamera();
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl p-5 space-y-4 my-auto text-center">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-extrabold text-sm text-white">Live Profile Photo</h3>
              <p className="text-[11px] text-slate-400">Take a real-time photo with your camera</p>
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

        {/* Camera Feed / Captured Photo Preview */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-indigo-500/40 flex items-center justify-center shadow-xl">
          {cameraError ? (
            <div className="p-4 text-xs text-rose-300 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-rose-400" />
              <p>{cameraError}</p>
            </div>
          ) : capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Captured Portrait"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          )}

          {/* Hidden Canvas for Processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Shutter Circle Guide Overlay */}
          {!capturedPhoto && !cameraError && (
            <div className="absolute inset-0 pointer-events-none border-4 border-indigo-500/30 rounded-full m-6" />
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          {capturedPhoto ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Use This Photo</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Flip Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Big Snap Shutter Button */}
              <button
                type="button"
                onClick={handleTakeSnapshot}
                disabled={Boolean(cameraError)}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl shadow-indigo-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
                title="Click to take snapshot"
              >
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <Camera className="w-5 h-5 text-indigo-600" />
                </div>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

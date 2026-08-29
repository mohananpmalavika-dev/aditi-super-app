import React, { useState, useEffect, useRef } from 'react';
import { X, Video, Play, Square, RotateCcw, Send, Sparkles } from 'lucide-react';

interface VideoNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendVideoNote: (videoUrl: string, duration: number) => void;
}

export const VideoNoteModal: React.FC<VideoNoteModalProps> = ({
  isOpen,
  onClose,
  onSendVideoNote
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setIsRecording(false);
      setRecordedTime(0);
      setVideoPreview(null);
    }
  }, [isOpen]);

  // Timer while recording
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordedTime((prev) => {
          if (prev >= 60) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
        audio: true
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access fallback: using simulated circular video stream');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Use simulated or recorded circular video
    setVideoPreview('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');
  };

  const handleSend = () => {
    const videoUrl = videoPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80';
    onSendVideoNote(videoUrl, recordedTime || 5);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col items-center space-y-5 animate-in zoom-in-95">
        
        {/* Top Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <Video className="w-5 h-5" />
            <h3 className="font-extrabold text-sm text-white">Circular Video Message</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Circular Camera Viewfinder / Preview */}
        <div className="relative">
          <div
            className={`w-60 h-60 rounded-full overflow-hidden border-4 shadow-2xl bg-slate-950 flex items-center justify-center transition-all ${
              isRecording
                ? 'border-rose-500 ring-4 ring-rose-500/30 animate-pulse scale-105'
                : 'border-indigo-500 ring-4 ring-indigo-500/20'
            }`}
          >
            {videoPreview ? (
              <img
                src={videoPreview}
                alt="Recorded Video Note"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
          </div>

          {/* Time Badge */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/90 border border-slate-700 text-xs font-mono font-bold text-white shadow-lg flex items-center gap-1.5">
            {isRecording && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
            <span>{Math.floor(recordedTime / 60)}:{(recordedTime % 60).toString().padStart(2, '0')} / 1:00</span>
          </div>
        </div>

        {/* Instructions / Controls */}
        <div className="w-full text-center space-y-3">
          <p className="text-xs text-slate-400">
            {videoPreview
              ? 'Preview your 60-second circular video message before sending.'
              : isRecording
              ? 'Recording in progress... Tap stop when done.'
              : 'Tap record to capture a quick selfie round video note.'}
          </p>

          <div className="flex items-center justify-center gap-3">
            {!videoPreview ? (
              !isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Recording</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="px-6 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-extrabold text-xs border border-rose-500/40 flex items-center gap-2 transition-all animate-bounce"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Recording</span>
                </button>
              )
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setVideoPreview(null);
                    setRecordedTime(0);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>

                <button
                  type="button"
                  onClick={handleSend}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Round Note</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  SwitchCamera, 
  Mic, 
  MicOff, 
  MapPin, 
  Eye, 
  Sliders, 
  X, 
  Radio, 
  Navigation,
  Compass,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';

interface LiveBackgroundCameraProps {
  isActive: boolean;
  onClose: () => void;
  onLocationUpdate?: (locString: string) => void;
  isLocationTagged: boolean;
  onToggleLocationTag: () => void;
}

export const LiveBackgroundCamera: React.FC<LiveBackgroundCameraProps> = ({
  isActive,
  onClose,
  onLocationUpdate,
  isLocationTagged,
  onToggleLocationTag
}) => {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [dimmerOpacity, setDimmerOpacity] = useState(0.45); // overlay darkness for readability
  const [locationInfo, setLocationInfo] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
    speed: number | null;
  }>({
    latitude: 11.2588,
    longitude: 75.7804,
    accuracy: 8,
    address: 'Kozhikode, Kerala, India',
    speed: 1.2
  });

  const [hasCameraError, setHasCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize Camera Stream
  useEffect(() => {
    if (isActive) {
      startCameraStream();
      startLocationWatcher();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isActive, facingMode, isAudioActive]);

  const startCameraStream = async () => {
    stopCameraStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: isAudioActive
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasCameraError(false);
    } catch (err) {
      console.warn('Live background camera stream fallback active:', err);
      setHasCameraError(true);
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const startLocationWatcher = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy, speed } = pos.coords;
          const locStr = `📍 Kerala (Lat: ${latitude.toFixed(4)}°, Lng: ${longitude.toFixed(4)}°)`;
          setLocationInfo({
            latitude,
            longitude,
            accuracy: Math.round(accuracy),
            speed: speed ? Math.round(speed * 3.6) : null,
            address: 'Calicut, Kerala'
          });
          onLocationUpdate?.(locStr);
        },
        () => {
          // Fallback location
          const fallback = '📍 Kozhikode, Kerala (11.2588° N, 75.7804° E)';
          onLocationUpdate?.(fallback);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full">
        {!hasCameraError ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={!isAudioActive}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              facingMode === 'user' ? 'scale-x-[-1]' : ''
            }`}
          />
        ) : (
          /* Simulated Live Cam Feed with Ambience Animation */
          <div className="w-full h-full relative overflow-hidden bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80"
              alt="Live Environment Feed"
              className="w-full h-full object-cover animate-pulse duration-1000 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/30 to-slate-950/80" />
          </div>
        )}
      </div>

      {/* Dimmer Overlay for Message Readability */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: `rgba(2, 6, 23, ${dimmerOpacity})`,
          backdropFilter: 'blur(1px)'
        }}
      />

      {/* Live AR Camera & GPS HUD Layer */}
      <div className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-between pointer-events-auto">
        
        {/* Top Live Status Bar */}
        <div className="flex items-center justify-between gap-2 flex-wrap animate-in fade-in">
          
          {/* Live Indicator Chip */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-emerald-500/40 backdrop-blur-md shadow-xl text-xs font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>LIVE CAM WALK & CHAT</span>
            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
              ({facingMode === 'environment' ? 'Rear Cam' : 'Front Selfie'})
            </span>
          </div>

          {/* Location Tagged HUD Badge */}
          {isLocationTagged && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/85 border border-indigo-500/40 backdrop-blur-md shadow-xl text-xs text-indigo-200 animate-in slide-in-from-top-2">
              <Navigation className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-bold">{locationInfo.address}</span>
              <span className="font-mono text-[10px] text-indigo-300">
                ({locationInfo.latitude.toFixed(2)}°N, {locationInfo.longitude.toFixed(2)}°E)
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                ±{locationInfo.accuracy}m
              </span>
            </div>
          )}

          {/* Live Floating Control Center */}
          <div className="flex items-center gap-1.5 bg-slate-950/85 p-1 rounded-2xl border border-slate-700/80 backdrop-blur-xl shadow-2xl">
            
            {/* Flip Camera */}
            <button
              type="button"
              onClick={toggleCameraFacing}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Switch Front / Rear Camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>

            {/* Toggle Ambient Live Audio */}
            <button
              type="button"
              onClick={() => setIsAudioActive(!isAudioActive)}
              className={`p-2 rounded-xl transition-colors ${
                isAudioActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title={isAudioActive ? 'Ambient Mic Audio On' : 'Mute Ambient Audio'}
            >
              {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Toggle Location Tagging */}
            <button
              type="button"
              onClick={onToggleLocationTag}
              className={`p-2 rounded-xl transition-colors ${
                isLocationTagged
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title={isLocationTagged ? 'Live GPS Location Tagged' : 'Tag Live GPS Location'}
            >
              <MapPin className="w-4 h-4" />
            </button>

            {/* Background Dimmer Opacity Slider */}
            <div className="flex items-center gap-1 px-2 py-1 bg-slate-900/90 rounded-xl text-xs text-slate-300">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={dimmerOpacity}
                onChange={(e) => setDimmerOpacity(parseFloat(e.target.value))}
                className="w-14 sm:w-20 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                title="Adjust Background Readability Dimmer"
              />
            </div>

            {/* Exit Live Camera Background */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 transition-colors"
              title="Close Live Cam Background"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Ambient Audio Equalizer Visualizer Strip when audio is on */}
        {isAudioActive && (
          <div className="flex items-center justify-center gap-1 py-1 px-3 rounded-full bg-slate-950/80 border border-emerald-500/30 w-max mx-auto backdrop-blur-md">
            <span className="text-[10px] font-bold text-emerald-400 mr-1.5 flex items-center gap-1">
              <Mic className="w-3 h-3 animate-pulse" />
              <span>Surroundings Audio</span>
            </span>
            {[35, 75, 45, 90, 60, 100, 70, 40, 85, 50, 95, 30].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-emerald-400 animate-pulse"
                style={{
                  height: `${h * 0.2}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, RefreshCw } from 'lucide-react';
import CallManager from '../../services/webrtcCallService';
import { useSuperApp } from '../../context/SuperAppContext';
import { broadcastSocialEvent, subscribeToSocialEvents } from '../../services/cloudDatabaseService';
import { playSound } from '../../utils/soundEffects';

interface VideoCallModalProps {
  isOpen: boolean;
  contactName: string;
  contactAvatar: string;
  isVideo: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  callId?: string;
  isCaller?: boolean;
  targetUserId?: string;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  contactName,
  contactAvatar,
  isVideo,
  onClose,
  onMinimize,
  callId: propCallId,
  isCaller: propIsCaller,
  targetUserId: propTargetUserId
}) => {
  const { user, showToast } = useSuperApp();

  const callId = propCallId || `call-${Date.now()}`;
  const isCaller = propIsCaller !== undefined ? propIsCaller : true;
  const targetUserId = propTargetUserId || user.id || user.email || contactName;

  // State
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideo);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const callManagerRef = useRef<CallManager | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const durationInterval = useRef<any>(null);

  // Initialize call when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const initCall = async () => {
      try {
        setError(null);
        const manager = new CallManager();
        callManagerRef.current = manager;

        // Setup callbacks
        manager.onStateChange = (state) => {
          if (state.localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = state.localStream;
            localVideoRef.current.muted = true;
            localVideoRef.current.play().catch(() => {});
          }

          if (state.remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = state.remoteStream;
            remoteVideoRef.current.muted = false;
            remoteVideoRef.current.play().catch(() => {});
          }
        };

        manager.onRemoteStream = (stream) => {
          console.log('Remote stream received');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
            remoteVideoRef.current.muted = false;
            remoteVideoRef.current.play().catch(() => {});
          }
          setIsConnecting(false);
          showToast(`🟢 Connected with ${contactName}!`);
          playSound('call_connected');
        };

        manager.onIceCandidate = (candidate) => {
          broadcastSocialEvent({
            type: 'WEBRTC_ICE_CANDIDATE',
            callId,
            fromUserId: user.id || 'user',
            toUserId: targetUserId,
            candidate: candidate.toJSON()
          });
        };

        manager.onError = (error) => {
          setError(error.message);
          console.error('Call error:', error);
          showToast(`❌ ${error.message}`);
        };

        // Start local media
        console.log('Starting local media...');
        const stream = await manager.startLocalMedia(!isVideoOff, true);
        if (!stream) {
          throw new Error('Failed to access camera/microphone');
        }

        // Initialize peer connection
        manager.initializePeerConnection();

        // Setup local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }

        // Subscribe to signaling events
        const unsubscribe = subscribeToSocialEvents(async (event: any) => {
          if (!event.callId || event.callId !== callId) return;
          if (event.fromUserId === (user.id || 'user')) return; // Ignore own events

          if (event.type === 'WEBRTC_OFFER' && !isCaller) {
            console.log('Received offer, sending answer...');
            const answer = await manager.handleOffer(event.offer);
            if (answer) {
              broadcastSocialEvent({
                type: 'WEBRTC_ANSWER',
                callId,
                fromUserId: user.id || 'user',
                toUserId: event.fromUserId,
                answer
              });
            }
          } else if (event.type === 'WEBRTC_ANSWER' && isCaller) {
            console.log('Received answer');
            await manager.handleAnswer(event.answer);
          } else if (event.type === 'WEBRTC_ICE_CANDIDATE') {
            console.log('Received ICE candidate');
            await manager.addIceCandidate(event.candidate);
          }
        });

        // Send offer if caller
        if (isCaller) {
          console.log('Sending offer...');
          const offer = await manager.createOffer();
          if (offer) {
            broadcastSocialEvent({
              type: 'WEBRTC_OFFER',
              callId,
              fromUserId: user.id || 'user',
              toUserId: targetUserId,
              offer
            });
          }
        }

        // Start call duration timer
        durationInterval.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);

        return () => {
          unsubscribe();
          if (durationInterval.current) clearInterval(durationInterval.current);
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        showToast(`❌ Call error: ${message}`);
      }
    };

    const cleanup = initCall();
    return () => {
      cleanup?.then((fn) => fn?.());
      callManagerRef.current?.disconnect();
    };
  }, [isOpen, callId, isCaller, isVideoOff, contactName, targetUserId, user]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Video Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
        />

        {/* Local Video (PIP) */}
        <video
          ref={localVideoRef}
          className="absolute bottom-4 right-4 w-32 h-40 bg-slate-900 rounded-lg border-2 border-slate-400 object-cover"
          autoPlay
          playsInline
          muted
        />

        {/* Connecting Overlay */}
        {isConnecting && !error && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <div className="animate-spin">
              <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-500 rounded-full" />
            </div>
            <p className="text-white mt-4 text-lg font-semibold">Connecting...</p>
            <p className="text-slate-300 text-sm mt-2">Waiting for {contactName}</p>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-red-900/60 flex flex-col items-center justify-center">
            <p className="text-white text-lg font-bold">❌ {error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              End Call
            </button>
          </div>
        )}

        {/* Call Info Overlay (Top) */}
        <div className="absolute top-4 left-4 text-white">
          <h2 className="text-xl font-bold">{contactName}</h2>
          <p className="text-sm text-slate-300">{formatDuration(callDuration)}</p>
        </div>
      </div>

      {/* Controls (Bottom) */}
      <div className="bg-slate-900 border-t border-slate-700 px-4 py-6 flex justify-center gap-4">
        {/* Mute Audio */}
        <button
          onClick={() => {
            const newState = !isAudioMuted;
            setIsAudioMuted(newState);
            callManagerRef.current?.toggleAudio(!newState);
            showToast(newState ? '🔇 Mic muted' : '🎙️ Mic on');
          }}
          className={`p-4 rounded-full transition-all ${
            isAudioMuted
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-slate-800 hover:bg-slate-700'
          }`}
          title="Toggle microphone"
        >
          {isAudioMuted ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Toggle Video */}
        {isVideo && (
          <button
            onClick={() => {
              const newState = !isVideoOff;
              setIsVideoOff(newState);
              callManagerRef.current?.toggleVideo(!newState);
              showToast(newState ? '📷 Camera off' : '📷 Camera on');
            }}
            className={`p-4 rounded-full transition-all ${
              isVideoOff
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
            title="Toggle camera"
          >
            {isVideoOff ? (
              <VideoOff className="w-6 h-6 text-white" />
            ) : (
              <Video className="w-6 h-6 text-white" />
            )}
          </button>
        )}

        {/* Switch Camera */}
        {isVideo && !isVideoOff && (
          <button
            onClick={() => {
              callManagerRef.current?.switchCamera();
              showToast('🔄 Switching camera...');
            }}
            className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
            title="Switch camera"
          >
            <RefreshCw className="w-6 h-6 text-white" />
          </button>
        )}

        {/* End Call */}
        <button
          onClick={() => {
            playSound('call_end');
            callManagerRef.current?.disconnect();
            onClose();
          }}
          className="p-4 px-8 rounded-full bg-red-600 hover:bg-red-700 transition-all"
          title="End call"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoCallModal;

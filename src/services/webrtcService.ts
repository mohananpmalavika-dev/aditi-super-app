/**
 * webrtcService.ts
 * Real WebRTC Peer Connection & Media Devices Manager
 * Uses free Google & Mozilla STUN servers with zero paid dependencies
 */

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:global.stun.twilio.com:3478' }
];

export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private screenStream: MediaStream | null = null;
  private iceCandidateQueue: RTCIceCandidateInit[] = [];
  private isRemoteDescriptionSet = false;
  private supportsWebRTC = typeof window !== 'undefined' && 'RTCPeerConnection' in window;

  public onRemoteStream?: (stream: MediaStream) => void;
  public onIceCandidate?: (candidate: RTCIceCandidate) => void;
  public onConnectionStateChange?: (state: RTCPeerConnectionState) => void;

  constructor() {
    this.initPeerConnection();
  }

  private createSyntheticMediaStream(video: boolean, audio: boolean): MediaStream | null {
    try {
      const stream = new MediaStream();

      if (video && typeof document !== 'undefined') {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const render = () => {
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#4f46e5');
            gradient.addColorStop(1, '#0ea5e9');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 34px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Aditi Live', canvas.width / 2, canvas.height / 2);
            ctx.font = '18px sans-serif';
            ctx.fillText('Fallback camera stream', canvas.width / 2, canvas.height / 2 + 40);
          };
          render();
          const captureStream = (canvas as any).captureStream?.(24);
          if (captureStream) {
            captureStream.getVideoTracks().forEach((track: MediaStreamTrack) => stream.addTrack(track));
          }
        }
      }

      if (audio && typeof window !== 'undefined') {
        const AudioCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (AudioCtor) {
          const audioCtx = new AudioCtor();
          const oscillator = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const destination = audioCtx.createMediaStreamDestination();
          oscillator.type = 'sine';
          oscillator.frequency.value = 440;
          gain.gain.value = 0.015;
          oscillator.connect(gain);
          gain.connect(destination);
          gain.connect(audioCtx.destination);
          oscillator.start();
          const audioTrack = destination.stream.getAudioTracks()[0];
          if (audioTrack) {
            stream.addTrack(audioTrack);
          }
          setTimeout(() => {
            try {
              oscillator.stop();
              audioCtx.close().catch(() => {});
            } catch {}
          }, 120000);
        }
      }

      return stream.getTracks().length > 0 ? stream : null;
    } catch (err) {
      console.warn('Synthetic media stream creation failed:', err);
      return null;
    }
  }

  private initPeerConnection() {
    if (!this.supportsWebRTC) {
      return;
    }

    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: ICE_SERVERS,
        iceCandidatePoolSize: 10
      });

      this.peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.remoteStream = event.streams[0];
          this.onRemoteStream?.(this.remoteStream);
        } else if (event.track) {
          if (!this.remoteStream) {
            this.remoteStream = new MediaStream();
          }
          this.remoteStream.addTrack(event.track);
          this.onRemoteStream?.(this.remoteStream);
        }
      };

      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.onIceCandidate?.(event.candidate);
        }
      };

      this.peerConnection.onconnectionstatechange = () => {
        if (this.peerConnection) {
          this.onConnectionStateChange?.(this.peerConnection.connectionState);
        }
      };
    } catch (err) {
      console.warn('WebRTC initialisation warning:', err);
    }
  }

  public attachStream(stream: MediaStream) {
    this.localStream = stream;
    if (this.peerConnection) {
      // Remove any previously added tracks before attaching new ones
      const senders = this.peerConnection.getSenders();
      stream.getTracks().forEach((track) => {
        const existingSender = senders.find((s) => s.track?.kind === track.kind);
        if (existingSender) {
          existingSender.replaceTrack(track).catch(() => {});
        } else {
          this.peerConnection?.addTrack(track, stream);
        }
      });
    }
  }

  public async startLocalMedia(video = true, audio = true): Promise<MediaStream | null> {
    const hasMediaDevices = !!(typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    if (!hasMediaDevices) {
      const fallbackStream = this.createSyntheticMediaStream(video, audio);
      if (fallbackStream) {
        this.localStream = fallbackStream;
        this.attachStream(fallbackStream);
      }
      return fallbackStream;
    }

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: video ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: audio
      });

      this.attachStream(this.localStream);
      return this.localStream;
    } catch (err) {
      console.warn('MediaDevices error, attempting basic constraints:', err);
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: Boolean(video),
          audio: Boolean(audio)
        });
        this.attachStream(this.localStream);
        return this.localStream;
      } catch (fallbackErr) {
        console.warn('MediaDevices fallback failed:', fallbackErr);
        const fallbackStream = this.createSyntheticMediaStream(video, audio);
        if (fallbackStream) {
          this.localStream = fallbackStream;
          this.attachStream(fallbackStream);
          return fallbackStream;
        }
        return null;
      }
    }
  }

  public async createOffer(): Promise<RTCSessionDescriptionInit | null> {
    if (!this.peerConnection) return null;
    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (err) {
      console.warn('Error creating WebRTC offer:', err);
      return null;
    }
  }

  public async handleOffer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | null> {
    if (!this.peerConnection) return null;
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      this.isRemoteDescriptionSet = true;
      this.processIceCandidateQueue();

      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (err) {
      console.warn('Error handling WebRTC offer:', err);
      return null;
    }
  }

  public async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) return;
    try {
      if (this.peerConnection.signalingState !== 'stable') {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        this.isRemoteDescriptionSet = true;
        this.processIceCandidateQueue();
      }
    } catch (err) {
      console.warn('Error handling WebRTC answer:', err);
    }
  }

  public async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection || !this.isRemoteDescriptionSet) {
      this.iceCandidateQueue.push(candidate);
      return;
    }
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.warn('Error adding ICE candidate:', err);
    }
  }

  private processIceCandidateQueue() {
    if (!this.peerConnection || !this.isRemoteDescriptionSet) return;
    while (this.iceCandidateQueue.length > 0) {
      const candidate = this.iceCandidateQueue.shift();
      if (candidate) {
        this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) => {
          console.warn('Queued ICE candidate error:', err);
        });
      }
    }
  }

  public async startScreenShare(): Promise<MediaStream | null> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      return null;
    }

    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      if (this.screenStream && this.peerConnection) {
        const videoTrack = this.screenStream.getVideoTracks()[0];
        const sender = this.peerConnection.getSenders().find((s) => s.track?.kind === 'video');
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      }
      return this.screenStream;
    } catch (err) {
      console.warn('Screen share error/cancelled:', err);
      return null;
    }
  }

  public toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  public toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  public stopAllTracks() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => track.stop());
      this.screenStream = null;
    }
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => track.stop());
      this.remoteStream = null;
    }
    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {}
      this.peerConnection = null;
    }
    this.iceCandidateQueue = [];
    this.isRemoteDescriptionSet = false;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }
}

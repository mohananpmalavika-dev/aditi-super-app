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
  private connectionStartTime: number = 0;
  private statsInterval: number | null = null;

  public onRemoteStream?: (stream: MediaStream) => void;
  public onIceCandidate?: (candidate: RTCIceCandidate) => void;
  public onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  public onIceConnectionStateChange?: (state: RTCIceConnectionState) => void;
  public onStats?: (stats: any) => void;

  constructor() {
    this.initPeerConnection();
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
          if (this.peerConnection.connectionState === 'connected') {
            this.connectionStartTime = Date.now();
            this.startStatsMonitoring();
          }
        }
      };

      this.peerConnection.oniceconnectionstatechange = () => {
        if (this.peerConnection) {
          this.onIceConnectionStateChange?.(this.peerConnection.iceConnectionState);
        }
      };
    } catch (err) {
      console.warn('WebRTC initialisation warning:', err);
    }
  }

  private startStatsMonitoring() {
    if (this.statsInterval !== null || !this.peerConnection) return;
    
    this.statsInterval = window.setInterval(async () => {
      if (!this.peerConnection) {
        if (this.statsInterval !== null) {
          clearInterval(this.statsInterval);
          this.statsInterval = null;
        }
        return;
      }
      
      try {
        const stats = await this.peerConnection!.getStats();
        const statsReport: any = {};
        
        stats.forEach((report) => {
          if (report.type === 'inbound-rtp' && report.kind === 'audio') {
            statsReport.audioIn = {
              bytesReceived: report.bytesReceived,
              packetsReceived: report.packetsReceived,
              packetsLost: report.packetsLost,
              jitter: report.jitter
            };
          } else if (report.type === 'inbound-rtp' && report.kind === 'video') {
            statsReport.videoIn = {
              bytesReceived: report.bytesReceived,
              framesReceived: report.framesReceived,
              framesDropped: report.framesDropped,
              frameHeight: report.frameHeight,
              frameWidth: report.frameWidth
            };
          } else if (report.type === 'outbound-rtp' && report.kind === 'audio') {
            statsReport.audioOut = {
              bytesSent: report.bytesSent,
              packetsSent: report.packetsSent
            };
          } else if (report.type === 'outbound-rtp' && report.kind === 'video') {
            statsReport.videoOut = {
              bytesSent: report.bytesSent,
              framesSent: report.framesSent,
              frameHeight: report.frameHeight,
              frameWidth: report.frameWidth
            };
          } else if (report.type === 'candidate-pair' && report.state === 'succeeded') {
            statsReport.connectionStats = {
              roundTripTime: report.currentRoundTripTime,
              availableOutgoingBitrate: report.availableOutgoingBitrate,
              availableIncomingBitrate: report.availableIncomingBitrate
            };
          }
        });
        
        if (this.onStats) {
          this.onStats(statsReport);
        }
      } catch (err) {
        console.warn('Error collecting WebRTC stats:', err);
      }
    }, 1000);
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
      console.warn('WebRTC startLocalMedia aborted: browser media APIs are unavailable.');
      return null;
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
    if (this.statsInterval !== null) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
    
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
    this.connectionStartTime = 0;
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  public getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  public getConnectionState(): RTCPeerConnectionState | null {
    return this.peerConnection?.connectionState ?? null;
  }

  public getIceConnectionState(): RTCIceConnectionState | null {
    return this.peerConnection?.iceConnectionState ?? null;
  }

  public getConnectionDuration(): number {
    if (this.connectionStartTime === 0) return 0;
    return Math.floor((Date.now() - this.connectionStartTime) / 1000);
  }
}

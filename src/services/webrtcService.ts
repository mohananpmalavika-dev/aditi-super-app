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

  public onRemoteStream?: (stream: MediaStream) => void;
  public onIceCandidate?: (candidate: RTCIceCandidate) => void;
  public onConnectionStateChange?: (state: RTCPeerConnectionState) => void;

  constructor() {
    this.initPeerConnection();
  }

  private initPeerConnection() {
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

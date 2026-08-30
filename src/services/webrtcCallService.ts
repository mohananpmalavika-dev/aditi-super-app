/**
 * webrtcCallService.ts
 * Fresh, minimal WebRTC implementation for audio/video calls
 * Direct peer-to-peer connection with real media streams only
 */

const STUN_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' }
];

export interface CallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState | null;
  iceConnectionState: RTCIceConnectionState | null;
}

export class CallManager {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  public onRemoteStream?: (stream: MediaStream) => void;
  public onStateChange?: (state: CallState) => void;
  public onIceCandidate?: (candidate: RTCIceCandidate) => void;
  public onError?: (error: Error) => void;

  async startLocalMedia(audio: boolean, video: boolean): Promise<MediaStream | null> {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        return null;
      }

      const constraints: MediaStreamConstraints = {
        audio: audio ? { echoCancellation: true, noiseSuppression: true } : false,
        video: video
          ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
          : false
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.localStream;
    } catch (err) {
      const error = new Error(`Failed to access media: ${err instanceof Error ? err.message : String(err)}`);
      this.onError?.(error);
      return null;
    }
  }

  initializePeerConnection(): void {
    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: STUN_SERVERS
      });

      // Handle incoming remote stream
      this.peerConnection.ontrack = (event) => {
        console.log('Remote track received:', event.track.kind);
        if (event.streams[0]) {
          this.remoteStream = event.streams[0];
          this.onRemoteStream?.(this.remoteStream);
          this.notifyStateChange();
        }
      };

      // Handle connection state changes
      this.peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', this.peerConnection?.connectionState);
        this.notifyStateChange();
      };

      this.peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', this.peerConnection?.iceConnectionState);
        this.notifyStateChange();
      };

      // Send ICE candidates
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          this.onIceCandidate?.(event.candidate);
        }
      };

      // Add local stream tracks
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }
    } catch (err) {
      const error = new Error(`Failed to initialize peer connection: ${err instanceof Error ? err.message : String(err)}`);
      this.onError?.(error);
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit | null> {
    try {
      if (!this.peerConnection) return null;
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (err) {
      const error = new Error(`Failed to create offer: ${err instanceof Error ? err.message : String(err)}`);
      this.onError?.(error);
      return null;
    }
  }

  async handleOffer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | null> {
    try {
      if (!this.peerConnection) return null;
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (err) {
      const error = new Error(`Failed to handle offer: ${err instanceof Error ? err.message : String(err)}`);
      this.onError?.(error);
      return null;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      if (!this.peerConnection) return;
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
      const error = new Error(`Failed to handle answer: ${err instanceof Error ? err.message : String(err)}`);
      this.onError?.(error);
    }
  }

  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      if (this.peerConnection && candidate) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.warn('Failed to add ICE candidate:', err);
    }
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }

  async switchCamera(): Promise<void> {
    try {
      if (!this.localStream) return;

      const videoTrack = this.localStream.getVideoTracks()[0];
      if (!videoTrack) return;

      const currentFacingMode = videoTrack.getSettings().facingMode;
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: newFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      const newVideoTrack = newStream.getVideoTracks()[0];
      const sender = this.peerConnection?.getSenders().find((s) => s.track?.kind === 'video');

      if (sender) {
        await sender.replaceTrack(newVideoTrack);
      }

      // Stop old track and update local stream
      videoTrack.stop();
      this.localStream.removeTrack(videoTrack);
      this.localStream.addTrack(newVideoTrack);
    } catch (err) {
      console.warn('Failed to switch camera:', err);
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStream(): MediaStream | null {
    return this.remoteStream;
  }

  getCallState(): CallState {
    return {
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      connectionState: this.peerConnection?.connectionState ?? null,
      iceConnectionState: this.peerConnection?.iceConnectionState ?? null
    };
  }

  private notifyStateChange(): void {
    this.onStateChange?.(this.getCallState());
  }

  disconnect(): void {
    // Stop all local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.localStream = null;
    }

    // Stop all remote tracks
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.remoteStream = null;
    }

    // Close peer connection
    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {}
      this.peerConnection = null;
    }
  }
}

export default CallManager;

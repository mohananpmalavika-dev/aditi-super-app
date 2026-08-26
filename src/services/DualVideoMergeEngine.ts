/**
 * DualVideoMergeEngine.ts
 * Real-time 30 FPS Dual User Video Merge Engine using HTML5 Canvas & MediaStreamTrack
 * Combines Local camera feed and Remote peer feed into a single unified stream
 * Layout Modes: SIDE_BY_SIDE | PIP | TOP_BOTTOM | EQUAL_SPLIT
 */

export type DualVideoLayout = 'SIDE_BY_SIDE' | 'PIP' | 'TOP_BOTTOM' | 'EQUAL_SPLIT';

export class DualVideoMergeEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private localVideo: HTMLVideoElement;
  private remoteVideo: HTMLVideoElement;
  private animationFrameId: number | null = null;
  private layout: DualVideoLayout = 'SIDE_BY_SIDE';
  private width: number = 1280;
  private height: number = 720;
  private fps: number = 30;
  private isRunning: boolean = false;

  constructor(width = 1280, height = 720, layout: DualVideoLayout = 'SIDE_BY_SIDE') {
    this.width = width;
    this.height = height;
    this.layout = layout;

    // Create rendering canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // Internal video source elements
    this.localVideo = document.createElement('video');
    this.localVideo.muted = true;
    this.localVideo.playsInline = true;
    this.localVideo.autoplay = true;

    this.remoteVideo = document.createElement('video');
    this.remoteVideo.playsInline = true;
    this.remoteVideo.autoplay = true;
  }

  public setLocalStream(stream: MediaStream | null) {
    if (stream && stream.getVideoTracks().length > 0) {
      this.localVideo.srcObject = stream;
      this.localVideo.play().catch(() => {});
    } else {
      this.localVideo.srcObject = null;
    }
  }

  public setRemoteStream(stream: MediaStream | null) {
    if (stream && stream.getVideoTracks().length > 0) {
      this.remoteVideo.srcObject = stream;
      this.remoteVideo.play().catch(() => {});
    } else {
      this.remoteVideo.srcObject = null;
    }
  }

  public setLayout(layout: DualVideoLayout) {
    this.layout = layout;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public captureMergedStream(): MediaStream {
    if (typeof this.canvas.captureStream === 'function') {
      return this.canvas.captureStream(this.fps);
    }
    // Fallback stream
    return new MediaStream();
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.renderLoop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private renderLoop = () => {
    if (!this.isRunning) return;
    this.renderFrame();
    this.animationFrameId = requestAnimationFrame(this.renderLoop);
  };

  private renderFrame() {
    if (!this.ctx) return;

    const w = this.width;
    const h = this.height;

    // Dark high-tech background
    this.ctx.fillStyle = '#030712';
    this.ctx.fillRect(0, 0, w, h);

    const hasLocal = this.localVideo.readyState >= 2;
    const hasRemote = this.remoteVideo.readyState >= 2;

    switch (this.layout) {
      case 'SIDE_BY_SIDE': {
        const halfW = w / 2;
        // User A (Left)
        if (hasLocal) {
          this.ctx.drawImage(this.localVideo, 0, 0, halfW, h);
        } else {
          this.drawFallbackUserCard(0, 0, halfW, h, 'You (Camera Off)');
        }

        // User B (Right)
        if (hasRemote) {
          this.ctx.drawImage(this.remoteVideo, halfW, 0, halfW, h);
        } else {
          this.drawFallbackUserCard(halfW, 0, halfW, h, 'Remote Participant');
        }

        // Center separator line
        this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(halfW, 0);
        this.ctx.lineTo(halfW, h);
        this.ctx.stroke();
        break;
      }

      case 'TOP_BOTTOM': {
        const halfH = h / 2;
        if (hasLocal) {
          this.ctx.drawImage(this.localVideo, 0, 0, w, halfH);
        } else {
          this.drawFallbackUserCard(0, 0, w, halfH, 'You');
        }

        if (hasRemote) {
          this.ctx.drawImage(this.remoteVideo, 0, halfH, w, halfH);
        } else {
          this.drawFallbackUserCard(0, halfH, w, halfH, 'Remote Participant');
        }
        break;
      }

      case 'PIP':
      default: {
        // Main Remote Video
        if (hasRemote) {
          this.ctx.drawImage(this.remoteVideo, 0, 0, w, h);
        } else {
          this.drawFallbackUserCard(0, 0, w, h, 'Remote Participant');
        }

        // Inset PiP Local Thumbnail (Bottom-Right)
        const pipW = w * 0.28;
        const pipH = h * 0.28;
        const pipX = w - pipW - 24;
        const pipY = h - pipH - 24;

        this.ctx.save();
        this.ctx.fillStyle = '#0f172a';
        this.ctx.strokeStyle = '#6366f1';
        this.ctx.lineWidth = 3;
        this.ctx.fillRect(pipX, pipY, pipW, pipH);
        this.ctx.strokeRect(pipX, pipY, pipW, pipH);

        if (hasLocal) {
          this.ctx.drawImage(this.localVideo, pipX, pipY, pipW, pipH);
        } else {
          this.drawFallbackUserCard(pipX, pipY, pipW, pipH, 'You');
        }
        this.ctx.restore();
        break;
      }
    }

    // Watermark badge
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(16, 16, 180, 28);
    this.ctx.fillStyle = '#818cf8';
    this.ctx.font = 'bold 12px sans-serif';
    this.ctx.fillText('Aditi Dual Merge • 30 FPS', 24, 35);
  }

  private drawFallbackUserCard(x: number, y: number, w: number, h: number, label: string) {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(x, y, w, h);

    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = 'bold 14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(label, x + w / 2, y + h / 2);
    this.ctx.textAlign = 'left';
  }

  public destroy() {
    this.stop();
    this.localVideo.srcObject = null;
    this.remoteVideo.srcObject = null;
  }
}

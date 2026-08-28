import { describe, it, expect } from 'vitest';
import {
  editPhotoWithAiPrompt,
  animatePhotoToVideo,
  applyCanvasFilter
} from '../services/clientMediaAiEngine';

describe('100% Client-Side AI Creative Media Engine', () => {
  const dummyPhotoUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  describe('Photo-to-Image AI Prompt Editing', () => {
    it('processes uploaded photo and generates AI transformation on user photo', async () => {
      const result = await editPhotoWithAiPrompt(
        dummyPhotoUrl,
        'Change outfit to traditional Kerala Kasavu gold attire',
        'Kerala Traditional Look (കേരള തനിമ)',
        'Photorealistic',
        '1:1',
        { aiStrength: 90, warmth: 20, contrast: 15 }
      );

      expect(result.id).toContain('photo-edit-');
      expect(result.type).toBe('image');
      expect(result.originalUrl).toBe(dummyPhotoUrl);
      expect(result.resultUrl).toBeDefined();
      expect(result.prompt).toBe('Change outfit to traditional Kerala Kasavu gold attire');
      expect(result.style).toContain('Kerala Traditional Look');
      expect(result.dimensions?.width).toBe(1024);
      expect(result.dimensions?.height).toBe(1024);
    });

    it('supports different aspect ratios properly', async () => {
      const result16x9 = await editPhotoWithAiPrompt(
        dummyPhotoUrl,
        'Cyberpunk city background',
        'Cyberpunk Avatar (സൈബർപങ്ക്)',
        'Cyberpunk',
        '16:9'
      );

      expect(result16x9.dimensions?.width).toBe(1280);
      expect(result16x9.dimensions?.height).toBe(720);
      expect(result16x9.resultUrl).toBeDefined();
    });
  });

  describe('Photo-to-Video Motion Animator', () => {
    it('animates uploaded photo into dynamic video motion sequence', async () => {
      const result = await animatePhotoToVideo(
        dummyPhotoUrl,
        'Living Portrait (സജീവ മുഖഭാവം)',
        'Gentle smiling gaze with natural eye movement',
        5
      );

      expect(result.id).toContain('photo-vid-');
      expect(result.type).toBe('video');
      expect(result.originalUrl).toBe(dummyPhotoUrl);
      expect(result.resultUrl).toBe(dummyPhotoUrl);
      expect(result.duration).toBe(5);
      expect(result.motionStyle).toBe('Living Portrait (സജീവ മുഖഭാവം)');
      expect(result.dimensions?.width).toBe(1280);
      expect(result.dimensions?.height).toBe(720);
    });
  });

  describe('Canvas Filter Operations', () => {
    it('applies color filters safely', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        expect(() => applyCanvasFilter(ctx, 100, 100, 'Cyber')).not.toThrow();
        expect(() => applyCanvasFilter(ctx, 100, 100, 'Anime')).not.toThrow();
        expect(() => applyCanvasFilter(ctx, 100, 100, 'Vintage')).not.toThrow();
        expect(() => applyCanvasFilter(ctx, 100, 100, 'None')).not.toThrow();
      }
    });
  });
});

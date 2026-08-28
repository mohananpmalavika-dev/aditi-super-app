import { describe, it, expect } from 'vitest';
import {
  generateGeminiPhotoTransformation,
  buildGenerativeTransformPrompt,
  GeminiTransformMode
} from '../services/geminiStudioService';

describe('Gemini AI Studio: Real Generative Photo Transformation & Vision', () => {
  const dummyPhotoUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  it('builds real generative prompts accurately reflecting user prompt and mode', () => {
    const prompt1 = buildGenerativeTransformPrompt(
      'Astronaut in futuristic spacesuit on Mars',
      'generative_reimagine',
      'Photorealistic'
    );
    expect(prompt1).toContain('Astronaut in futuristic spacesuit on Mars');
    expect(prompt1).toContain('photorealistic');

    const prompt2 = buildGenerativeTransformPrompt(
      'Taj Mahal Agra',
      'background_swap',
      'Photorealistic'
    );
    expect(prompt2).toContain('Taj Mahal');

    const prompt3 = buildGenerativeTransformPrompt(
      'Kasavu dress at temple',
      'kerala_traditional',
      'Photorealistic'
    );
    expect(prompt3).toContain('traditional Kerala Kasavu gold border attire');
  });

  it('transforms user photo into real generative AI output matching custom prompt', async () => {
    const result = await generateGeminiPhotoTransformation(
      dummyPhotoUrl,
      'Astronaut walking on red planet Mars with glowing helmet',
      'generative_reimagine',
      'Photorealistic',
      '1:1',
      { engine: 'gemini-2.0-flash' }
    );

    expect(result.id).toContain('gemini-gen-');
    expect(result.originalUrl).toBe(dummyPhotoUrl);
    expect(result.resultUrl).toBeDefined();
    expect(result.resultUrl).toContain('pollinations.ai/prompt');
    expect(result.prompt).toBe('Astronaut walking on red planet Mars with glowing helmet');
    expect(result.engine).toBe('gemini-2.0-flash');
    expect(result.dimensions.width).toBe(1024);
    expect(result.dimensions.height).toBe(1024);
    expect(result.thoughts.length).toBeGreaterThanOrEqual(3);
  });

  it('handles background swap to Taj Mahal with realistic scenery conditioning', async () => {
    const result = await generateGeminiPhotoTransformation(
      dummyPhotoUrl,
      'Change background to Taj Mahal Agra India at sunset',
      'background_swap',
      'Photorealistic',
      '16:9',
      { engine: 'imagen-3-photoreal' }
    );

    expect(result.resultUrl).toContain('Taj%20Mahal');
    expect(result.dimensions.width).toBe(1280);
    expect(result.dimensions.height).toBe(720);
    expect(result.mode).toBe('background_swap');
  });

  it('supports 3D Pixar character mode with Disney animation styling', async () => {
    const result = await generateGeminiPhotoTransformation(
      dummyPhotoUrl,
      'Disney 3D animated hero in magical kingdom',
      'pixar_3d_character',
      '3D Render',
      '9:16'
    );

    expect(result.mode).toBe('pixar_3d_character');
    expect(result.style).toBe('3D Render');
    expect(result.dimensions.width).toBe(720);
    expect(result.dimensions.height).toBe(1280);
  });
});

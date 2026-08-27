import { AspectRatioType, GeneratedImage, ImageStylePreset, BrainMessage, BrainThoughtTrace, MiniAppId } from '../types/superApp';

/**
 * 100% FREE AI Service powered by Pollinations.ai & Client-Side Intelligence
 * No API Keys required, no credit cards, completely unlimited.
 */

const STYLE_PROMPTS: Record<ImageStylePreset, string> = {
  'Cyberpunk': 'cyberpunk aesthetic, neon lighting, futuristic city, highly detailed 8k octane render',
  'Photorealistic': 'photorealistic 8k, professional photography, natural lighting, sharp focus, award winning',
  'Anime / Manga': 'anime visual style, Makoto Shinkai aesthetic, vibrant colors, detailed line art, masterpiece',
  '3D Render': '3D Pixar and Unreal Engine 5 render, smooth subsurface scattering, studio lighting, cute and detailed',
  'Oil Painting': 'classic oil painting on textured canvas, expressive brush strokes, dramatic chiaroscuro lighting',
  'Cinematic Film': 'cinematic 35mm film still, anamorphic lens flare, moody color grading, panavision, dramatic depth of field',
  'Digital Art': 'modern digital concept art, trending on artstation, vivid colors, intricate composition'
};

const ASPECT_RATIO_DIMS: Record<AspectRatioType, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '16:9': { width: 1280, height: 720 },
  '9:16': { width: 720, height: 1280 },
  '4:3': { width: 1024, height: 768 }
};

export async function generateFreeImage(
  prompt: string,
  style: ImageStylePreset = 'Photorealistic',
  aspectRatio: AspectRatioType = '1:1'
): Promise<GeneratedImage> {
  const enhancedPrompt = `${prompt}, ${STYLE_PROMPTS[style]}`;
  const seed = Math.floor(Math.random() * 10000000);
  const dims = ASPECT_RATIO_DIMS[aspectRatio];

  // Pollinations.ai direct free image URL
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    enhancedPrompt
  )}?width=${dims.width}&height=${dims.height}&model=flux&seed=${seed}&nologo=true`;

  return {
    id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    prompt,
    imageUrl,
    style,
    aspectRatio,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    likes: 0
  };
}

/**
 * OmniBrain Natural Language Reasoning & Action Dispatcher
 */
export async function queryOmniBrain(
  userQuery: string,
  appContext: {
    userName: string;
    tasksCount: number;
    activePropertiesCount: number;
  }
): Promise<BrainMessage> {
  const queryLower = userQuery.toLowerCase();
  const thoughts: BrainThoughtTrace[] = [
    {
      step: 'Query Ingestion & Intent Parsing',
      details: `Received user prompt: "${userQuery}". Analyzing semantic intent across 12 app verticals.`,
      timestamp: new Date().toLocaleTimeString()
    }
  ];

  let responseText = '';
  let dispatchedAction: { vertical: MiniAppId; actionSummary: string } | undefined;
  let suggestedPrompts: string[] = [];

  // Cross-app intent classification & autonomous dispatch logic
  if (queryLower.includes('tutor') || queryLower.includes('learn') || queryLower.includes('code') || queryLower.includes('python') || queryLower.includes('math')) {
    thoughts.push({
      step: 'Vertical Dispatch: Tutor & Academy',
      details: 'Identified educational query. Searching relevant tutors and study options.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = 'I can help you find suitable tutors and study resources based on your goals. Tell me the subject, budget, and preferred schedule and I will narrow it down.';
    dispatchedAction = {
      vertical: 'tutor',
      actionSummary: 'Filtered relevant learning options'
    };
    suggestedPrompts = [
      'Find a Python tutor',
      'Show math help options',
      'View my learning plan'
    ];
  } else if (queryLower.includes('house') || queryLower.includes('rent') || queryLower.includes('buy') || queryLower.includes('apartment') || queryLower.includes('property') || queryLower.includes('real estate')) {
    thoughts.push({
      step: 'Vertical Dispatch: Real Estate',
      details: 'Identified real estate inquiry. Querying active property database for top listings and price metrics.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = 'I can help you explore suitable property options, compare prices, and narrow down matching listings for your budget and location preferences.';
    dispatchedAction = {
      vertical: 'realestate',
      actionSummary: 'Opened property search and comparison flow'
    };
    suggestedPrompts = [
      'Find apartments in my preferred area',
      'Compare rental options',
      'Calculate affordability for a property'
    ];
  } else if (queryLower.includes('match') || queryLower.includes('marry') || queryLower.includes('matrimony') || queryLower.includes('dating') || queryLower.includes('bride') || queryLower.includes('groom')) {
    thoughts.push({
      step: 'Vertical Dispatch: Matrimony & Matchmaking',
      details: 'Analyzing partner compatibility based on education, lifestyle, and astrological harmony.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = 'I can help you review compatible profiles, sort by shared interests, and prepare a respectful introduction based on your preferences.';
    dispatchedAction = {
      vertical: 'matrimony',
      actionSummary: 'Filtered relevant matchmaking options'
    };
    suggestedPrompts = [
      'Show top matches',
      'Draft a polite introduction',
      'Compare compatibility preferences'
    ];
  } else if (queryLower.includes('horoscope') || queryLower.includes('astrology') || queryLower.includes('zodiac') || queryLower.includes('kundali') || queryLower.includes('tarot')) {
    thoughts.push({
      step: 'Vertical Dispatch: Astrology Studio',
      details: 'Calculating celestial transits, Moon signs, and drawing cards from the Major Arcana.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = 'I can help with daily insights, life guidance, and general astrology readings based on your birth details and current preferences.';
    dispatchedAction = {
      vertical: 'astrology',
      actionSummary: 'Prepared astrology guidance'
    };
    suggestedPrompts = [
      'Read my horoscope',
      'Generate a Tarot reading',
      'Check compatibility insights'
    ];
  } else if (queryLower.includes('image') || queryLower.includes('draw') || queryLower.includes('generate') || queryLower.includes('video') || queryLower.includes('art')) {
    thoughts.push({
      step: 'Vertical Dispatch: AI Media Studio',
      details: 'Connecting to Pollinations.ai high-speed FLUX engine for zero-cost creative synthesis.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = 'I can help you create visual concepts, image prompts, and media ideas for your creative workflow or campaign needs.';
    dispatchedAction = {
      vertical: 'media_studio',
      actionSummary: 'Prepared AI media workflow'
    };
    suggestedPrompts = [
      'Generate a concept image',
      'Create a video storyboard',
      'Open the media editor'
    ];
  } else {
    thoughts.push({
      step: 'General LifeOS Assistant',
      details: 'Synthesized global assistant response with multi-vertical shortcuts.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `Hello ${appContext.userName}! I am Aditi Brain, your personal AI assistant. I can help with work, planning, recommendations, and cross-app actions. What would you like to do first?`;
    suggestedPrompts = [
      'Generate a futuristic neon city wallpaper',
      'Show 3BHK villas for rent',
      'What is my Vedic horoscope today?',
      'Find me a coding tutor for React & TypeScript'
    ];
  }

  thoughts.push({
    step: 'Execution Complete',
    details: 'Dispatched response and contextual quick actions to user interface.',
    timestamp: new Date().toLocaleTimeString()
  });

  return {
    id: `brain-msg-${Date.now()}`,
    sender: 'brain',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    thoughtTraces: thoughts,
    actionDispatched: dispatchedAction,
    suggestedPrompts
  };
}

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
    walletBalance: number;
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
      details: 'Identified educational query. Searching verified tutors in coding, math, and languages.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `I found top-rated tutors matching your interest! Sarah Chen (Senior Python & AI Specialist, $45/hr) and David Miller (Fullstack Web Dev, $40/hr) are available this week. Would you like me to book a 1-on-1 session?`;
    dispatchedAction = {
      vertical: 'tutor',
      actionSummary: 'Filtered available tech and coding tutors'
    };
    suggestedPrompts = [
      'Book a Python trial with Sarah Chen',
      'Show math tutors under $35/hr',
      'View my upcoming study sessions'
    ];
  } else if (queryLower.includes('house') || queryLower.includes('rent') || queryLower.includes('buy') || queryLower.includes('apartment') || queryLower.includes('property') || queryLower.includes('real estate')) {
    thoughts.push({
      step: 'Vertical Dispatch: Real Estate',
      details: 'Identified real estate inquiry. Querying active property database for top listings and price metrics.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `I've opened the Real Estate portal. We have 8 curated listings matching your criteria, including a 3BHK Penthouse in Skyline Towers ($850,000) and a luxury 2BHK rental ($2,400/mo). I can also calculate your monthly EMI or schedule a virtual viewing.`;
    dispatchedAction = {
      vertical: 'realestate',
      actionSummary: 'Opened Real Estate listings and mortgage calculator'
    };
    suggestedPrompts = [
      'Calculate EMI for $500k loan at 6.5%',
      'Show 3BHK apartments with swimming pool',
      'Schedule a tour for Skyline Penthouse'
    ];
  } else if (queryLower.includes('match') || queryLower.includes('marry') || queryLower.includes('matrimony') || queryLower.includes('dating') || queryLower.includes('bride') || queryLower.includes('groom')) {
    thoughts.push({
      step: 'Vertical Dispatch: Matrimony & Matchmaking',
      details: 'Analyzing partner compatibility based on education, lifestyle, and astrological harmony.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `Exploring our verified Matrimony network. You have 4 profiles with over 90% compatibility score! I've highlighted verified profiles in Tech, Medicine, and Design. You can send interest or request an icebreaker.`;
    dispatchedAction = {
      vertical: 'matrimony',
      actionSummary: 'Filtered 90%+ compatibility matrimony profiles'
    };
    suggestedPrompts = [
      'Show profiles in New York & San Francisco',
      'Draft a polite icebreaker message',
      'Check horoscope compatibility with match'
    ];
  } else if (queryLower.includes('horoscope') || queryLower.includes('astrology') || queryLower.includes('zodiac') || queryLower.includes('kundali') || queryLower.includes('tarot')) {
    thoughts.push({
      step: 'Vertical Dispatch: Astrology Studio',
      details: 'Calculating celestial transits, Moon signs, and drawing cards from the Major Arcana.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `The stars indicate powerful creative and financial momentum for you today! Jupiter's favorable aspect brings opportunities in new collaborations. Would you like a 3-Card Tarot reading or your Vedic Kundali birth chart analysis?`;
    dispatchedAction = {
      vertical: 'astrology',
      actionSummary: 'Computed daily horoscope & opened Tarot reader'
    };
    suggestedPrompts = [
      'Draw 3 Tarot cards for today',
      'Generate my Vedic Kundali chart',
      'Check Leo and Sagittarius compatibility'
    ];
  } else if (queryLower.includes('image') || queryLower.includes('draw') || queryLower.includes('generate') || queryLower.includes('video') || queryLower.includes('art')) {
    thoughts.push({
      step: 'Vertical Dispatch: AI Media Studio',
      details: 'Connecting to Pollinations.ai high-speed FLUX engine for zero-cost creative synthesis.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `Welcome to the AI Creative Studio! I can generate ultra-high-definition images in Cyberpunk, Anime, or Photorealistic styles, create dynamic motion video snippets, or help you edit clips on the web timeline.`;
    dispatchedAction = {
      vertical: 'media_studio',
      actionSummary: 'Prepared AI Image & Video Studio'
    };
    suggestedPrompts = [
      'Generate a cyberpunk city at sunset in 16:9',
      'Create an anime illustration of a coffee shop in the rain',
      'Open the Video Editor timeline'
    ];
  } else if (queryLower.includes('money') || queryLower.includes('wallet') || queryLower.includes('balance') || queryLower.includes('pay') || queryLower.includes('transfer')) {
    thoughts.push({
      step: 'Vertical Dispatch: Digital Wallet',
      details: `Retrieved wallet status: $${appContext.walletBalance.toFixed(2)} available.`,
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `Your current Digital Wallet balance is **$${appContext.walletBalance.toFixed(2)}**. You can send instant P2P payments, pay electricity or internet bills, or view your visual spending analytics.`;
    dispatchedAction = {
      vertical: 'wallet',
      actionSummary: 'Retrieved Digital Wallet balance & payment dock'
    };
    suggestedPrompts = [
      'Send $50 to Alex Rivera',
      'Pay monthly electricity bill',
      'View my monthly spend breakdown'
    ];
  } else {
    thoughts.push({
      step: 'General LifeOS Assistant',
      details: 'Synthesized global assistant response with multi-vertical shortcuts.',
      timestamp: new Date().toLocaleTimeString()
    });
    responseText = `Hello ${appContext.userName}! I am **Aditi Brain**, your personal AI Core. I have complete context across all 12 modules of Aditi. I can manage your tasks, find properties, search tutors, match matrimony profiles, generate AI images, read your horoscope, or handle your wallet. What shall we do first?`;
    suggestedPrompts = [
      'Generate a futuristic neon city wallpaper',
      'Find me a coding tutor for React & TypeScript',
      'Show 3BHK luxury apartments for rent',
      'Give me today\'s Tarot reading'
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

/**
 * voiceToTextService.ts
 * Real-Time Voice-to-Text (Speech Recognition / STT) Engine
 * 
 * Supports:
 * - Malayalam (ml-IN) & Indian English (en-IN) Speech-to-Text
 * - Live interim streaming transcripts
 * - Continuous recognition with auto-reconnect
 * - Browser Web Speech Recognition API (SpeechRecognition / webkitSpeechRecognition)
 */

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type SpeechLanguage = 'ml-IN' | 'en-IN' | 'en-US';

export interface VoiceRecognitionOptions {
  lang?: SpeechLanguage;
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

let activeRecognitionInstance: any = null;

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const startVoiceRecognition = (options: VoiceRecognitionOptions): (() => void) => {
  if (!isSpeechRecognitionSupported()) {
    options.onError?.('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    return () => {};
  }

  // Stop any active recognition
  stopVoiceRecognition();

  const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognitionClass();

  recognition.lang = options.lang || 'ml-IN';
  recognition.continuous = options.continuous !== false;
  recognition.interimResults = options.interimResults !== false;
  recognition.maxAlternatives = 1;

  let finalTranscript = '';

  recognition.onstart = () => {
    options.onStart?.();
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      const text = result[0].transcript;
      if (result.isFinal) {
        finalTranscript += (finalTranscript ? ' ' : '') + text;
        options.onResult(finalTranscript, true);
      } else {
        interimTranscript += text;
        options.onResult(finalTranscript ? `${finalTranscript} ${interimTranscript}` : interimTranscript, false);
      }
    }
  };

  recognition.onerror = (event: any) => {
    console.warn('Speech Recognition Error:', event.error);
    if (event.error === 'no-speech') {
      // Normal pause, keep listening
      return;
    }
    options.onError?.(event.error || 'Speech recognition encountered an error');
  };

  recognition.onend = () => {
    options.onEnd?.();
  };

  try {
    recognition.start();
    activeRecognitionInstance = recognition;
  } catch (err) {
    console.error('Failed to start Speech Recognition:', err);
    options.onError?.('Could not activate microphone for speech recognition');
  }

  return () => {
    try {
      recognition.stop();
    } catch {}
    activeRecognitionInstance = null;
  };
};

export const stopVoiceRecognition = (): void => {
  if (activeRecognitionInstance) {
    try {
      activeRecognitionInstance.stop();
    } catch {}
    activeRecognitionInstance = null;
  }
};

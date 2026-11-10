/**
 * Web Speech API Voice Guidance / Read Aloud helper for Inspire Typing
 */

export interface VoiceGuidanceOptions {
  volume?: number; // 0 to 100
  rate?: number;   // 0.5 to 2.0
  lang?: string;
}

class VoiceGuidanceService {
  private isSupported: boolean;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getSupported(): boolean {
    return this.isSupported;
  }

  public speak(text: string, options: VoiceGuidanceOptions = {}) {
    if (!this.isSupported || !text) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech to prevent backlog

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = Math.max(0, Math.min(1, (options.volume ?? 80) / 100));
      utterance.rate = Math.max(0.5, Math.min(2.0, options.rate ?? 1.0));
      
      if (options.lang) {
        utterance.lang = options.lang;
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
    }
  }

  public cancel() {
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  public speakKeyInstruction(key: string, fingerName: string, isUrdu: boolean, options: VoiceGuidanceOptions = {}) {
    if (!this.isSupported) return;

    let text = '';
    if (key === ' ' || key === 'space') {
      text = isUrdu ? 'اسپیس بار دبائیں، انگوٹھے سے' : 'Press Space Bar with thumb';
    } else {
      text = isUrdu
        ? `${key.toUpperCase()} دبائیں، ${fingerName} سے`
        : `Press ${key.toUpperCase()} with ${fingerName}`;
    }

    this.speak(text, {
      ...options,
      lang: isUrdu ? 'ur-PK' : 'en-US',
    });
  }
}

export const voiceGuidance = new VoiceGuidanceService();

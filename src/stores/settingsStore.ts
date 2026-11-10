import { create } from 'zustand';
import { Language } from '../types';
import { soundEffects } from '../lib/soundEffects';

interface SettingsState {
  language: Language;
  showKeyboard: boolean;
  soundEnabled: boolean;
  fontSize: 'normal' | 'large';
  fingerGuideEnabled: boolean;
  readAloudEnabled: boolean;
  readAloudMode: 'basic' | 'keys';
  readAloudVolume: number; // 0-100
  readAloudSpeed: number;  // 0.5 - 2.0
  setLanguage: (lang: Language) => void;
  setShowKeyboard: (show: boolean) => void;
  toggleKeyboard: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setFontSize: (size: 'normal' | 'large') => void;
  toggleFingerGuide: () => void;
  setReadAloudEnabled: (enabled: boolean) => void;
  toggleReadAloud: () => void;
  setReadAloudVolume: (volume: number) => void;
  setReadAloudSpeed: (speed: number) => void;
  setReadAloudMode: (mode: 'basic' | 'keys') => void;
}

const SETTINGS_KEY = 'inspire_typing_settings';

const getInitialSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore
  }
  return {
    language: 'english' as Language,
    showKeyboard: true,
    soundEnabled: true,
    fontSize: 'normal' as const,
    fingerGuideEnabled: true,
    readAloudEnabled: false,
    readAloudMode: 'basic' as const,
    readAloudVolume: 80,
    readAloudSpeed: 1.0,
  };
};

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = getInitialSettings();
  soundEffects.setEnabled(initial.soundEnabled);

  const saveSettings = (newState: Partial<SettingsState>) => {
    try {
      const current = {
        language: get().language,
        showKeyboard: get().showKeyboard,
        soundEnabled: get().soundEnabled,
        fontSize: get().fontSize,
        fingerGuideEnabled: get().fingerGuideEnabled,
        readAloudEnabled: get().readAloudEnabled,
        readAloudMode: get().readAloudMode,
        readAloudVolume: get().readAloudVolume,
        readAloudSpeed: get().readAloudSpeed,
        ...newState,
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
    } catch {
      // Ignore
    }
  };

  return {
    language: initial.language,
    showKeyboard: initial.showKeyboard,
    soundEnabled: initial.soundEnabled,
    fontSize: initial.fontSize,
    fingerGuideEnabled: initial.fingerGuideEnabled ?? true,
    readAloudEnabled: initial.readAloudEnabled ?? false,
    readAloudMode: initial.readAloudMode ?? 'basic',
    readAloudVolume: initial.readAloudVolume ?? 80,
    readAloudSpeed: initial.readAloudSpeed ?? 1.0,

    setLanguage: (language: Language) => {
      saveSettings({ language });
      set({ language });
    },

    setShowKeyboard: (showKeyboard: boolean) => {
      saveSettings({ showKeyboard });
      set({ showKeyboard });
    },

    toggleKeyboard: () => {
      const next = !get().showKeyboard;
      saveSettings({ showKeyboard: next });
      set({ showKeyboard: next });
    },

    setSoundEnabled: (soundEnabled: boolean) => {
      soundEffects.setEnabled(soundEnabled);
      saveSettings({ soundEnabled });
      set({ soundEnabled });
    },

    toggleSound: () => {
      const next = !get().soundEnabled;
      soundEffects.setEnabled(next);
      saveSettings({ soundEnabled: next });
      set({ soundEnabled: next });
    },

    setFontSize: (fontSize: 'normal' | 'large') => {
      saveSettings({ fontSize });
      set({ fontSize });
    },

    toggleFingerGuide: () => {
      const next = !get().fingerGuideEnabled;
      saveSettings({ fingerGuideEnabled: next });
      set({ fingerGuideEnabled: next });
    },

    setReadAloudEnabled: (readAloudEnabled: boolean) => {
      saveSettings({ readAloudEnabled });
      set({ readAloudEnabled });
    },

    toggleReadAloud: () => {
      const next = !get().readAloudEnabled;
      saveSettings({ readAloudEnabled: next });
      set({ readAloudEnabled: next });
    },

    setReadAloudVolume: (readAloudVolume: number) => {
      saveSettings({ readAloudVolume });
      set({ readAloudVolume });
    },

    setReadAloudSpeed: (readAloudSpeed: number) => {
      saveSettings({ readAloudSpeed });
      set({ readAloudSpeed });
    },

    setReadAloudMode: (readAloudMode: 'basic' | 'keys') => {
      saveSettings({ readAloudMode });
      set({ readAloudMode });
    },
  };
});

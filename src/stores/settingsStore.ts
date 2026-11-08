import { create } from 'zustand';
import { Language } from '../types';
import { soundEffects } from '../lib/soundEffects';

interface SettingsState {
  language: Language;
  showKeyboard: boolean;
  soundEnabled: boolean;
  fontSize: 'normal' | 'large';
  fingerGuideEnabled: boolean;
  setLanguage: (lang: Language) => void;
  setShowKeyboard: (show: boolean) => void;
  toggleKeyboard: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setFontSize: (size: 'normal' | 'large') => void;
  toggleFingerGuide: () => void;
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
  };
});

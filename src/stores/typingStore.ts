import { create } from 'zustand';
import { TypingStats, Language } from '../types';

interface TypingStoreState {
  lastResult: {
    stats: TypingStats;
    language: Language;
    mode: 'lesson' | 'test';
    title: string;
    durationSeconds?: number;
    lessonId?: string;
  } | null;
  setLastResult: (result: TypingStoreState['lastResult']) => void;
  clearLastResult: () => void;
}

export const useTypingStore = create<TypingStoreState>((set) => ({
  lastResult: null,
  setLastResult: (lastResult) => set({ lastResult }),
  clearLastResult: () => set({ lastResult: null }),
}));

/**
 * Pure typing utility functions for WPM, CPM, Accuracy, and formatting.
 */

export function calculateWPM(correctChars: number, secondsElapsed: number): number {
  if (secondsElapsed <= 0 || correctChars <= 0) return 0;
  const minutes = secondsElapsed / 60;
  const wpm = (correctChars / 5) / minutes;
  return Math.max(0, Math.round(wpm));
}

export function calculateCPM(correctChars: number, secondsElapsed: number): number {
  if (secondsElapsed <= 0 || correctChars <= 0) return 0;
  const minutes = secondsElapsed / 60;
  const cpm = correctChars / minutes;
  return Math.max(0, Math.round(cpm));
}

export function calculateAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  const acc = (correctChars / totalTyped) * 100;
  return Math.max(0, Math.min(100, Math.round(acc * 10) / 10));
}

export function getPerformanceTier(wpm: number): {
  title: string;
  badge: string;
  color: string;
  description: string;
} {
  if (wpm >= 80) {
    return {
      title: 'Pro',
      badge: '👑 Master Typist',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      description: 'Exceptional speed! You are typing at an elite professional level.',
    };
  }
  if (wpm >= 60) {
    return {
      title: 'Fast',
      badge: '⚡ Fast Fingers',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      description: 'Impressive pace! Well above average typing speed.',
    };
  }
  if (wpm >= 40) {
    return {
      title: 'Good',
      badge: '🎯 Skilled',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      description: 'Solid typing performance! Fluent and comfortable.',
    };
  }
  if (wpm >= 20) {
    return {
      title: 'Improving',
      badge: '🌱 Steady Learner',
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      description: 'Good foundation! Consistent daily practice will take you to 40+ WPM.',
    };
  }
  return {
    title: 'Beginner',
    badge: '🚀 Getting Started',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    description: 'Keep going! Focus on finger placement and accuracy over speed.',
  };
}

export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

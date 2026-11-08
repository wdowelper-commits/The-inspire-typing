import { useMemo } from 'react';
import { Language } from '../types';
import { getPhysicalKeyForChar } from '../lib/urduKeyboardMap';

interface UseKeyboardProps {
  targetChar?: string;
  language: Language;
}

export function useKeyboard({ targetChar, language }: UseKeyboardProps) {
  const activeKeyInfo = useMemo(() => {
    if (!targetChar) {
      return { key: '', shift: false };
    }
    return getPhysicalKeyForChar(targetChar, language);
  }, [targetChar, language]);

  return {
    nextKey: activeKeyInfo.key,
    requiresShift: activeKeyInfo.shift,
  };
}

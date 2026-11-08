import { useState, useEffect, useRef, useCallback } from 'react';
import { Language, TypingStats } from '../types';
import { calculateWPM, calculateCPM, calculateAccuracy } from '../lib/typingUtils';
import { getUrduPhoneticChar, URDU_STANDARD_MAP } from '../lib/urduKeyboardMap';
import { soundEffects } from '../lib/soundEffects';

interface UseTypingEngineProps {
  targetText: string;
  mode: 'lesson' | 'test';
  language: Language;
  timeLimitSeconds?: number;
  onComplete?: (stats: TypingStats) => void;
}

export interface CharStateRecord {
  char: string;
  status: 'correct' | 'wrong';
}

export function useTypingEngine({
  targetText,
  mode,
  language,
  timeLimitSeconds = 60,
  onComplete,
}: UseTypingEngineProps) {
  const [typedHistory, setTypedHistory] = useState<CharStateRecord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // In test mode: track index of last confirmed space boundary
  const lastSpaceIndexRef = useRef<number>(-1);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset engine when target text or mode changes
  const resetEngine = useCallback(() => {
    setTypedHistory([]);
    setCurrentIndex(0);
    setMistakes(0);
    setCorrectChars(0);
    setIsStarted(false);
    setIsComplete(false);
    setStartTime(null);
    setElapsedSeconds(0);
    lastSpaceIndexRef.current = -1;
  }, []);

  // Update timer tick
  useEffect(() => {
    if (!isStarted || isComplete) return;

    const timer = setInterval(() => {
      if (startTime) {
        const secs = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        setElapsedSeconds(secs);

        // Test mode duration check
        if (mode === 'test' && timeLimitSeconds > 0 && secs >= timeLimitSeconds) {
          finishTyping(secs);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, isComplete, startTime, mode, timeLimitSeconds]);

  const finishTyping = useCallback(
    (finalElapsed?: number) => {
      if (isComplete) return;
      setIsComplete(true);

      const time = finalElapsed !== undefined
        ? finalElapsed
        : startTime
        ? Math.max(1, Math.floor((Date.now() - startTime) / 1000))
        : 1;

      setElapsedSeconds(time);
      soundEffects.playSuccess();

      const finalStats: TypingStats = {
        wpm: calculateWPM(correctChars, time),
        cpm: calculateCPM(correctChars, time),
        accuracy: calculateAccuracy(correctChars, correctChars + mistakes),
        mistakes,
        charactersTyped: correctChars + mistakes,
        correctChars,
        elapsedSeconds: time,
        isComplete: true,
      };

      if (onCompleteRef.current) {
        onCompleteRef.current(finalStats);
      }
    },
    [isComplete, startTime, correctChars, mistakes]
  );

  // Handle typed character
  const handleChar = useCallback(
    (char: string) => {
      if (isComplete || !targetText) return;

      // Start timer on first keystroke
      if (!isStarted) {
        setIsStarted(true);
        setStartTime(Date.now());
      }

      if (currentIndex >= targetText.length) {
        finishTyping();
        return;
      }

      const expectedChar = targetText[currentIndex];
      const isCorrect = char === expectedChar;

      if (isCorrect) {
        soundEffects.playKeyClick();
        setCorrectChars((c) => c + 1);
        setTypedHistory((prev) => [...prev, { char, status: 'correct' }]);
      } else {
        soundEffects.playError();
        setMistakes((m) => m + 1);
        setTypedHistory((prev) => [...prev, { char, status: 'wrong' }]);
      }

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (char === ' ' && isCorrect) {
        lastSpaceIndexRef.current = nextIndex - 1;
      }

      // Check if finished full text (especially in lesson mode)
      if (nextIndex >= targetText.length) {
        setTimeout(() => finishTyping(), 50);
      }
    },
    [isComplete, targetText, isStarted, currentIndex, finishTyping]
  );

  // Handle Backspace
  const handleBackspace = useCallback(() => {
    if (isComplete || currentIndex <= 0) return;

    if (mode === 'test') {
      // In strict test mode: backspace counts as a mistake!
      // And cannot backspace past a completed word (spacebar)
      if (currentIndex - 1 <= lastSpaceIndexRef.current) {
        // Locked word
        return;
      }
      setMistakes((m) => m + 1);
      soundEffects.playError();
    }

    // In lesson mode or valid test backspace
    const lastEntry = typedHistory[typedHistory.length - 1];
    if (lastEntry && lastEntry.status === 'correct') {
      setCorrectChars((c) => Math.max(0, c - 1));
    }

    setTypedHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((idx) => Math.max(0, idx - 1));
  }, [isComplete, currentIndex, mode, typedHistory]);

  // Resolve keystroke considering Urdu mappings
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (isComplete) return;

      // Ignore functional keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (['Shift', 'CapsLock', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
      }

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        return;
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleChar(' ');
        return;
      }

      if (e.key.length === 1) {
        e.preventDefault();
        let charToType = e.key;

        // If in Urdu mode and the key is an English letter, map it via phonetic/standard map
        if (language === 'urdu-phonetic') {
          const mapped = getUrduPhoneticChar(e.key, e.shiftKey);
          if (mapped) {
            charToType = mapped;
          }
        } else if (language === 'urdu-standard') {
          const normKey = e.key.toLowerCase();
          const std = URDU_STANDARD_MAP[normKey];
          if (std) {
            charToType = e.shiftKey ? (std.shift || std.base) : std.base;
          }
        }

        handleChar(charToType);
      }
    },
    [isComplete, handleBackspace, handleChar, language]
  );

  // Compute live statistics
  const currentWpm = calculateWPM(correctChars, elapsedSeconds);
  const currentCpm = calculateCPM(correctChars, elapsedSeconds);
  const currentAccuracy = calculateAccuracy(correctChars, correctChars + mistakes);

  return {
    typedHistory,
    currentIndex,
    mistakes,
    correctChars,
    isStarted,
    isComplete,
    elapsedSeconds,
    wpm: currentWpm,
    cpm: currentCpm,
    accuracy: currentAccuracy,
    handleKeyDown,
    handleChar,
    handleBackspace,
    finishTyping,
    resetEngine,
  };
}

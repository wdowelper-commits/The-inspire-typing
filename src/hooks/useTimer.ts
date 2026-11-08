import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerProps {
  initialSeconds?: number;
  mode: 'countdown' | 'countup';
  onComplete?: () => void;
  autostart?: boolean;
}

export function useTimer({
  initialSeconds = 60,
  mode,
  onComplete,
  autostart = false,
}: UseTimerProps) {
  const [seconds, setSeconds] = useState(mode === 'countdown' ? initialSeconds : 0);
  const [isRunning, setIsRunning] = useState(autostart);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const reset = useCallback(
    (newSeconds?: number) => {
      stop();
      if (mode === 'countdown') {
        setSeconds(newSeconds !== undefined ? newSeconds : initialSeconds);
      } else {
        setSeconds(0);
      }
    },
    [initialSeconds, mode, stop]
  );

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setSeconds((prev) => {
        if (mode === 'countdown') {
          if (prev <= 1) {
            stop();
            if (onCompleteRef.current) {
              setTimeout(() => onCompleteRef.current?.(), 0);
            }
            return 0;
          }
          return prev - 1;
        } else {
          return prev + 1;
        }
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, mode, stop]);

  return {
    seconds,
    isRunning,
    start,
    stop,
    reset,
  };
}

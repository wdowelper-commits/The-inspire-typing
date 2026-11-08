import React, { useRef, useEffect } from 'react';
import { Language } from '../../types';
import { CharStateRecord } from '../../hooks/useTypingEngine';

export interface TypingAreaProps {
  targetText: string;
  typedHistory: CharStateRecord[];
  currentIndex: number;
  language: Language;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  typedHistory,
  currentIndex,
  language,
  onKeyDown,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCharRef = useRef<HTMLSpanElement>(null);

  const isUrdu = language.startsWith('urdu');

  // Keep focus on input automatically
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, currentIndex]);

  const handleContainerClick = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  // Scroll current character into view
  useEffect(() => {
    if (currentCharRef.current && containerRef.current) {
      currentCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full h-[105px] sm:h-[120px] overflow-y-auto bg-white rounded-xl border-2 transition-all p-2.5 sm:p-3 shadow-xs cursor-text select-none ${
        disabled
          ? 'border-slate-200 bg-slate-50 opacity-80'
          : 'border-blue-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100'
      }`}
      dir={isUrdu ? 'rtl' : 'ltr'}
      lang={isUrdu ? 'ur' : 'en'}
    >
      {/* Hidden input to capture keystrokes reliably on desktop & mobile virtual keyboards */}
      <input
        ref={inputRef}
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        tabIndex={0}
        aria-label={isUrdu ? 'اردو ٹائپنگ ان پٹ' : 'Typing test input'}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="absolute inset-0 opacity-0 cursor-default pointer-events-none"
      />

      <div
        className={`leading-relaxed tracking-normal whitespace-pre-wrap break-words ${
          isUrdu ? 'font-urdu-typing text-xl sm:text-2xl text-right' : 'font-mono-typing text-base sm:text-lg text-left'
        }`}
      >
        {targetText.split('').map((char, index) => {
          const isTyped = index < currentIndex;
          const isCurrent = index === currentIndex;
          const record = typedHistory[index];

          if (isCurrent) {
            return (
              <span
                key={index}
                ref={currentCharRef}
                className="relative bg-blue-100 text-blue-900 border-b-3 border-blue-600 rounded-xs px-0.5"
              >
                {char === ' ' ? ' ' : char}
                <span className="inline-block w-[2px] h-[1em] bg-blue-600 cursor-blink align-middle ml-0.5" />
              </span>
            );
          }

          if (isTyped && record) {
            if (record.status === 'correct') {
              return (
                <span key={index} className="text-emerald-600 font-medium">
                  {char}
                </span>
              );
            } else {
              return (
                <span
                  key={index}
                  className="bg-rose-100 text-rose-700 underline decoration-rose-500 decoration-2 rounded-xs font-semibold"
                >
                  {char}
                </span>
              );
            }
          }

          // Untyped
          return (
            <span key={index} className="text-slate-400">
              {char}
            </span>
          );
        })}
      </div>

      {!disabled && (
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{isUrdu ? 'ٹائپنگ شروع کرنے کے لیے چابیاں دبائیں' : 'Click here or start typing to begin'}</span>
          <span className="font-mono">
            {currentIndex} / {targetText.length} {isUrdu ? 'حروف' : 'characters'}
          </span>
        </div>
      )}
    </div>
  );
};

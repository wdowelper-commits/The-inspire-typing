import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Zap,
  Clock,
  RotateCcw,
  Trophy,
  Globe,
  Eye,
  EyeOff,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { StatsBar } from '../components/typing/StatsBar';
import { TypingArea } from '../components/typing/TypingArea';
import { Keyboard } from '../components/typing/Keyboard';
import { ResultModal } from '../components/typing/ResultModal';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTimer } from '../hooks/useTimer';
import { useSettingsStore } from '../stores/settingsStore';
import { useTypingStore } from '../stores/typingStore';
import { Language, TypingStats, TestParagraph } from '../types';
import { TEST_PARAGRAPHS } from '../data/testParagraphs';

const DURATIONS = [
  { label: '1 Min', seconds: 60 },
  { label: '2 Min', seconds: 120 },
  { label: '3 Min', seconds: 180 },
  { label: '5 Min', seconds: 300 },
  { label: '10 Min', seconds: 600 },
];

export const TestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { language: storeLang, setLanguage, showKeyboard, toggleKeyboard, fingerGuideEnabled, toggleFingerGuide } = useSettingsStore();
  const { setLastResult } = useTypingStore();

  const [testLang, setTestLang] = useState<Language>(storeLang);
  const [duration, setDuration] = useState<number>(60);
  const [paragraphIndex, setParagraphIndex] = useState<number>(0);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [completedStats, setCompletedStats] = useState<TypingStats | null>(null);

  // Check if custom drill text passed from AI coach
  const customDrillText = (location.state as any)?.customText;

  // Filter matching paragraphs
  const matchingParagraphs = useMemo(() => {
    const list = TEST_PARAGRAPHS.filter(
      (p) => p.language === testLang || (testLang.startsWith('urdu') && p.language.startsWith('urdu'))
    );
    return list.length > 0 ? list : TEST_PARAGRAPHS;
  }, [testLang]);

  const activeParagraph: TestParagraph = matchingParagraphs[paragraphIndex % matchingParagraphs.length];
  const targetText = customDrillText || activeParagraph?.content || '';

  // Timer countdown hook
  const timer = useTimer({
    initialSeconds: duration,
    mode: 'countdown',
    onComplete: () => {
      engine.finishTyping(duration);
    },
  });

  const handleComplete = (stats: TypingStats) => {
    timer.stop();
    setCompletedStats(stats);
    setIsResultOpen(true);
    setLastResult({
      stats,
      language: testLang,
      mode: 'test',
      title: `${duration / 60}-Minute ${testLang.toUpperCase()} Speed Test`,
      durationSeconds: duration,
    });
  };

  // Strict typing engine hook
  const engine = useTypingEngine({
    targetText,
    mode: 'test',
    language: testLang,
    timeLimitSeconds: duration,
    onComplete: handleComplete,
  });

  // Start countdown on first keystroke
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!timer.isRunning && !engine.isComplete) {
      timer.start();
    }
    engine.handleKeyDown(e);
  };

  const handleNextParagraph = () => {
    timer.reset(duration);
    engine.resetEngine();
    setParagraphIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setIsResultOpen(false);
    timer.reset(duration);
    engine.resetEngine();
  };

  const handleDurationChange = (secs: number) => {
    setDuration(secs);
    timer.reset(secs);
    engine.resetEngine();
  };

  const handleLanguageChange = (l: Language) => {
    setTestLang(l);
    setLanguage(l);
    timer.reset(duration);
    engine.resetEngine();
    setParagraphIndex(0);
  };

  // Keyboard active key
  const nextChar = targetText[engine.currentIndex];
  const { nextKey, requiresShift } = useKeyboard({ targetChar: nextChar, language: testLang });

  return (
    <PageWrapper maxWidth="normal" className="py-1.5 sm:py-2.5 px-2 sm:px-4">
      {/* Test Setup Header Toolbar (compact ~40px) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-2xs">
        {/* Left: Language & Duration selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => handleLanguageChange('english')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                testLang === 'english' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('urdu-phonetic')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                testLang === 'urdu-phonetic'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو Phonetic
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('urdu-standard')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                testLang === 'urdu-standard'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              اردو معیاری
            </button>
          </div>

          {/* Duration Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            {DURATIONS.map((d) => (
              <button
                key={d.seconds}
                type="button"
                onClick={() => handleDurationChange(d.seconds)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  duration === d.seconds ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {!customDrillText && (
            <button
              type="button"
              onClick={handleNextParagraph}
              className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors px-1"
              title="Next Text Paragraph"
            >
              Change Text ↻
            </button>
          )}
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={toggleKeyboard}
            icon={showKeyboard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">{showKeyboard ? 'Hide Keys' : 'Show Keys'}</span>
          </Button>

          {showKeyboard && (
            <label className="inline-flex items-center gap-1 px-2 h-7 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors select-none">
              <input
                type="checkbox"
                checked={fingerGuideEnabled}
                onChange={toggleFingerGuide}
                className="rounded text-blue-600 focus:ring-blue-500 w-3 h-3 cursor-pointer"
              />
              <span className="hidden sm:inline">🖐 Hands &amp; Finger Guide</span>
              <span className="sm:hidden">🖐 Guide</span>
            </label>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-slate-600"
            onClick={handleRestart}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Restart</span>
          </Button>
        </div>
      </div>

      {/* 1. Live Stats Bar with Countdown (compact ~52px) */}
      <div className="mb-2">
        <StatsBar
          wpm={engine.wpm}
          cpm={engine.cpm}
          accuracy={engine.accuracy}
          mistakes={engine.mistakes}
          seconds={timer.seconds}
          mode="countdown"
        />
      </div>

      {/* 2. Main Typing Area (compact ~125-140px) */}
      <div className="mb-2">
        <TypingArea
          targetText={targetText}
          typedHistory={engine.typedHistory}
          currentIndex={engine.currentIndex}
          language={testLang}
          onKeyDown={handleKeyDown}
          disabled={engine.isComplete}
        />
      </div>

      {/* 3. On-screen Keyboard (compact ~275px) */}
      {showKeyboard && (
        <div className="mb-2 animate-in fade-in">
          <Keyboard nextKey={nextKey} requiresShift={requiresShift} language={testLang} />
        </div>
      )}

      {/* Result Modal */}
      {completedStats && (
        <ResultModal
          isOpen={isResultOpen}
          stats={completedStats}
          language={testLang}
          mode="test"
          title={`${duration / 60}-Min ${testLang.replace('-', ' ').toUpperCase()} Test`}
          onRetry={handleRestart}
        />
      )}
    </PageWrapper>
  );
};

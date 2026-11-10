import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  Keyboard as KeyboardIcon,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { StatsBar } from '../components/typing/StatsBar';
import { TypingArea } from '../components/typing/TypingArea';
import { Keyboard, KEY_FINGER_MAP, FINGER_CONFIGS } from '../components/typing/Keyboard';
import { ResultModal } from '../components/typing/ResultModal';
import { ReadAloudSettingsModal } from '../components/typing/ReadAloudSettingsModal';
import { voiceGuidance } from '../lib/voiceGuidance';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTimer } from '../hooks/useTimer';
import { useSettingsStore } from '../stores/settingsStore';
import { useTypingStore } from '../stores/typingStore';
import { Language, TypingStats } from '../types';
import { ENGLISH_LESSONS } from '../data/englishLessons';
import { URDU_PHONETIC_LESSONS } from '../data/urduPhoneticLessons';
import { URDU_STANDARD_LESSONS } from '../data/urduStandardLessons';

export const LessonDetail: React.FC = () => {
  const { language: routeLang, lessonId } = useParams<{ language: string; lessonId: string }>();
  const navigate = useNavigate();
  const {
    showKeyboard,
    toggleKeyboard,
    soundEnabled,
    toggleSound,
    fingerGuideEnabled,
    toggleFingerGuide,
    readAloudEnabled,
    readAloudVolume,
    readAloudSpeed,
  } = useSettingsStore();
  const { setLastResult } = useTypingStore();

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [completedStats, setCompletedStats] = useState<TypingStats | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const lang: Language = (routeLang as Language) || 'english';

  // Find lesson bundle from seed data
  const allBundles = useMemo(() => {
    switch (lang) {
      case 'urdu-phonetic':
        return URDU_PHONETIC_LESSONS;
      case 'urdu-standard':
        return URDU_STANDARD_LESSONS;
      default:
        return ENGLISH_LESSONS;
    }
  }, [lang]);

  // Match by id or lesson_code
  const currentIndex = allBundles.findIndex(
    (b) => b.lesson.lesson_code === lessonId || b.lesson.id === lessonId
  );

  const currentBundle = allBundles[currentIndex >= 0 ? currentIndex : 0];
  const nextBundle = currentIndex >= 0 && currentIndex + 1 < allBundles.length ? allBundles[currentIndex + 1] : null;
  const prevBundle = currentIndex > 0 ? allBundles[currentIndex - 1] : null;

  const targetText = currentBundle?.text.content || '';

  // Timer for countup
  const timer = useTimer({ mode: 'countup' });

  // Completion callback
  const handleComplete = (stats: TypingStats) => {
    timer.stop();
    setCompletedStats(stats);
    setIsResultOpen(true);
    setLastResult({
      stats,
      language: lang,
      mode: 'lesson',
      title: currentBundle.lesson.title,
      lessonId: currentBundle.lesson.id,
    });
  };

  // Typing Engine hook
  const engine = useTypingEngine({
    targetText,
    mode: 'lesson',
    language: lang,
    onComplete: handleComplete,
  });

  // Start timer on first keystroke
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!timer.isRunning && !engine.isComplete) {
      timer.start();
    }
    engine.handleKeyDown(e);
  };

  // On-screen keyboard key resolution
  const nextChar = targetText[engine.currentIndex];
  const { nextKey, requiresShift } = useKeyboard({ targetChar: nextChar, language: lang });

  // Read Aloud / Voice Guidance Effect
  useEffect(() => {
    if (readAloudEnabled && nextKey && !engine.isComplete) {
      const fingerId = KEY_FINGER_MAP[nextKey.toLowerCase()] || 'left-pinky';
      const finger = FINGER_CONFIGS[fingerId];
      voiceGuidance.speakKeyInstruction(
        nextKey,
        finger?.nameEn || 'index',
        lang.startsWith('urdu'),
        { volume: readAloudVolume, rate: readAloudSpeed }
      );
    }
  }, [engine.currentIndex, nextKey, readAloudEnabled, readAloudVolume, readAloudSpeed, lang, engine.isComplete]);

  const handleRestart = () => {
    setIsResultOpen(false);
    timer.reset();
    engine.resetEngine();
  };

  const handleNextLesson = () => {
    if (nextBundle) {
      setIsResultOpen(false);
      timer.reset();
      engine.resetEngine();
      navigate(`/lessons/${lang}/${nextBundle.lesson.lesson_code}`);
    }
  };

  if (!currentBundle) {
    return (
      <PageWrapper>
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Lesson Not Found</h2>
          <p className="text-sm text-slate-500 mb-6">The requested lesson code could not be resolved.</p>
          <Link to={`/lessons/${lang}`}>
            <Button variant="primary">Return to Lessons</Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="normal" className="py-1.5 sm:py-2.5 px-2 sm:px-4">
      {/* Top Compact Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 bg-white rounded-xl border border-slate-200 px-3 py-1.5 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            to={`/lessons/${lang}`}
            className="text-slate-500 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-slate-100 shrink-0"
            title="All Lessons"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 truncate">
              <span className="text-blue-600 font-mono">
                {currentBundle.lesson.lesson_number}.{currentBundle.lesson.sub_lesson_number}
              </span>
              <span className="truncate">{currentBundle.lesson.title}</span>
            </div>
            <p className="text-[10px] text-slate-500 truncate hidden sm:block">
              {currentBundle.lesson.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={toggleSound}
            icon={soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          >
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={toggleKeyboard}
            icon={showKeyboard ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">{showKeyboard ? 'Hide Keys' : 'Show Keys'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setSettingsOpen(true)}
            icon={<Settings className="w-3.5 h-3.5 text-slate-600" />}
            title="Read Aloud / Voice Guidance Settings"
          >
            <span className="hidden sm:inline">Voice</span>
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

      {/* 1. Live Stats Bar (compact ~52px) */}
      <div className="mb-2">
        <StatsBar
          wpm={engine.wpm}
          cpm={engine.cpm}
          accuracy={engine.accuracy}
          mistakes={engine.mistakes}
          seconds={timer.seconds}
          mode="countup"
        />
      </div>

      {/* 2. Main Interactive Typing Area (compact ~125-140px) */}
      <div className="mb-2">
        <TypingArea
          targetText={targetText}
          typedHistory={engine.typedHistory}
          currentIndex={engine.currentIndex}
          language={lang}
          onKeyDown={handleKeyDown}
          disabled={engine.isComplete}
        />
      </div>

      {/* 3. On-Screen Keyboard with Hand Guide (compact ~275px) */}
      {showKeyboard && (
        <div className="mb-2 animate-in fade-in">
          <Keyboard nextKey={nextKey} requiresShift={requiresShift} language={lang} />
        </div>
      )}

      {/* Bottom Lesson Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
        {prevBundle ? (
          <Button
            variant="outline"
            size="sm"
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => {
              timer.reset();
              engine.resetEngine();
              navigate(`/lessons/${lang}/${prevBundle.lesson.lesson_code}`);
            }}
          >
            Previous: {prevBundle.lesson.lesson_number}.{prevBundle.lesson.sub_lesson_number}
          </Button>
        ) : (
          <div />
        )}

        <Button variant="ghost" size="sm" onClick={handleRestart} icon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset Lesson
        </Button>

        {nextBundle ? (
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
            onClick={() => {
              timer.reset();
              engine.resetEngine();
              navigate(`/lessons/${lang}/${nextBundle.lesson.lesson_code}`);
            }}
          >
            Next: {nextBundle.lesson.lesson_number}.{nextBundle.lesson.sub_lesson_number}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/certificate/${lang}`)}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Track Completed! View Certificate
          </Button>
        )}
      </div>

      {/* Result Modal */}
      {completedStats && (
        <ResultModal
          isOpen={isResultOpen}
          stats={completedStats}
          language={lang}
          mode="lesson"
          title={currentBundle.lesson.title}
          lessonId={currentBundle.lesson.id}
          nextLessonId={nextBundle?.lesson.lesson_code}
          onRetry={handleRestart}
          onNext={nextBundle ? handleNextLesson : undefined}
        />
      )}

      {/* Voice Guidance / Read Aloud Settings Modal */}
      <ReadAloudSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </PageWrapper>
  );
};

import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, ArrowRight, Award, CheckCircle2, UserPlus, Sparkles } from 'lucide-react';
import { TypingStats, Language } from '../../types';
import { getPerformanceTier, formatTime } from '../../lib/typingUtils';
import { useAuthStore } from '../../stores/authStore';
import { dataService } from '../../lib/supabase';
import { Button } from '../ui/Button';
import { downloadCertificate } from '../../lib/certificateGenerator';
import { useNavigate } from 'react-router-dom';

export interface ResultModalProps {
  isOpen: boolean;
  stats: TypingStats;
  language: Language;
  mode: 'lesson' | 'test';
  title: string;
  lessonId?: string;
  nextLessonId?: string;
  onRetry: () => void;
  onNext?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  stats,
  language,
  mode,
  title,
  lessonId,
  nextLessonId,
  onRetry,
  onNext,
}) => {
  const { user, isGuest } = useAuthStore();
  const [unlockedBadgeName, setUnlockedBadgeName] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const navigate = useNavigate();

  const tier = getPerformanceTier(stats.wpm);

  useEffect(() => {
    if (!isOpen) return;

    // Confetti blast
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore
    }

    // Save result if registered
    if (user && !isGuest) {
      if (mode === 'test') {
        dataService
          .saveTestResult({
            user_id: user.id,
            display_name: user.display_name,
            language,
            duration_seconds: stats.elapsedSeconds,
            wpm: stats.wpm,
            cpm: stats.cpm,
            accuracy: stats.accuracy,
            mistakes: stats.mistakes,
            characters_typed: stats.charactersTyped,
            completed_at: new Date().toISOString(),
          })
          .then(() => setSavedSuccess(true));
      } else if (mode === 'lesson' && lessonId) {
        dataService
          .saveLessonProgress({
            user_id: user.id,
            lesson_id: lessonId,
            completed: true,
            best_wpm: stats.wpm,
            best_accuracy: stats.accuracy,
            attempts: 1,
            last_attempted_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          })
          .then(() => setSavedSuccess(true));
      }

      // Check badge milestones
      if (stats.wpm >= 40) {
        dataService.awardBadge(user.id, 'badge-speed-demon').then((b) => {
          if (b) setUnlockedBadgeName('Speed Demon (40+ WPM)');
        });
      }
      if (stats.wpm >= 60) {
        dataService.awardBadge(user.id, 'badge-fast-fingers').then((b) => {
          if (b) setUnlockedBadgeName('Fast Fingers (60+ WPM)');
        });
      }
      if (stats.accuracy >= 98 && stats.charactersTyped > 50) {
        dataService.awardBadge(user.id, 'badge-accuracy-master').then((b) => {
          if (b) setUnlockedBadgeName('Accuracy Master (98%+ Acc)');
        });
      }
    }
  }, [isOpen, user, isGuest, mode, stats, language, lessonId]);

  // Body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadCert = () => {
    downloadCertificate({
      recipientName: user?.display_name || 'Inspire Typist',
      achievementTitle: `${title} (${language.replace('-', ' ').toUpperCase()})`,
      language,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      certificateId: 'IT-' + Date.now().toString(36).toUpperCase().substring(0, 8),
    });
  };

  return (
    <>
      {/* Non-blurry dark backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 transition-opacity"
        style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
        aria-hidden="true"
      />

      {/* Crisp centered modal box */}
      <div
        role="dialog"
        aria-modal="true"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] bg-white rounded-[16px] max-w-[480px] w-[90vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 text-left"
        style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
      >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {mode === 'lesson' ? 'Lesson Completed!' : 'Test Completed!'}
            </h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">{title}</p>

            {/* Performance Tier Pill */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 shadow-2xs">
              <span>{tier.badge}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">{tier.title} Tier</span>
            </div>
          </div>

          {/* Unlocked Badge Alert */}
          {unlockedBadgeName && (
            <div className="mb-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">New Badge Unlocked!</p>
                <p className="text-sm font-semibold text-amber-800">{unlockedBadgeName}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-2xl font-black text-blue-600 tracking-tight">{stats.wpm}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">WPM</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-2xl font-black text-indigo-600 tracking-tight">{stats.cpm}</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">CPM</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-2xl font-black text-emerald-600 tracking-tight">{stats.accuracy}%</div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Accuracy</div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
                {formatTime(stats.elapsedSeconds)}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Duration</div>
            </div>
          </div>

          {/* Guest Prompt */}
          {isGuest && (
            <div className="mb-6 bg-blue-50/80 border border-blue-200 rounded-2xl p-4 text-center">
              <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                Save your progress & earn badges
              </p>
              <p className="text-sm text-slate-600 mt-1 mb-3">
                Sign up free to rank on the global leaderboard and download verified certificates!
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={() => navigate('/signup')}
              >
                Create Free Account
              </Button>
            </div>
          )}

          {/* Registered User Success Indicator */}
          {!isGuest && savedSuccess && (
            <div className="mb-5 flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 py-2 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Result saved to your profile and leaderboard!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Button
              variant="outline"
              className="flex-1"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={onRetry}
            >
              {mode === 'lesson' ? 'Retry Lesson' : 'Try Again'}
            </Button>

            {!isGuest && (
              <Button
                variant="secondary"
                icon={<Award className="w-4 h-4" />}
                onClick={handleDownloadCert}
              >
                Certificate
              </Button>
            )}

            {mode === 'lesson' && onNext && nextLessonId && (
              <Button
                variant="primary"
                className="flex-1"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={onNext}
              >
                Next Lesson
              </Button>
            )}

            {mode === 'test' && (
              <Button
                variant="primary"
                className="flex-1"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigate('/leaderboard')}
              >
                Leaderboard
              </Button>
            )}
          </div>
      </div>
    </>
  );
};

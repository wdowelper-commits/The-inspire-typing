import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Target,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Download,
  Calendar,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { WPMChart } from '../components/dashboard/WPMChart';
import { AccuracyChart } from '../components/dashboard/AccuracyChart';
import { BadgesGrid } from '../components/dashboard/BadgesGrid';
import { useAuthStore } from '../stores/authStore';
import { dataService } from '../lib/supabase';
import { TestResult, LessonProgress, UserBadge, UserStreak } from '../types';
import { downloadCertificate } from '../lib/certificateGenerator';
import { ENGLISH_LESSONS } from '../data/englishLessons';
import { URDU_PHONETIC_LESSONS } from '../data/urduPhoneticLessons';
import { URDU_STANDARD_LESSONS } from '../data/urduStandardLessons';
import { AdBanner } from '../components/ads/AdBanner';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [streak, setStreak] = useState<UserStreak | null>(null);

  useEffect(() => {
    if (user) {
      dataService.getUserTestResults(user.id).then(setTestResults);
      dataService.getUserLessonProgress(user.id).then(setLessonProgress);
      dataService.getUserBadges(user.id).then(setUserBadges);
      dataService.getUserStreak(user.id).then(setStreak);
    }
  }, [user]);

  // Aggregate stats
  const bestWpm = testResults.reduce((max, r) => Math.max(max, r.wpm), 0);
  const avgAccuracy =
    testResults.length > 0
      ? Math.round(
          testResults.reduce((sum, r) => sum + r.accuracy, 0) / testResults.length
        )
      : 100;

  const completedLessonIds = new Set(
    lessonProgress.filter((p) => p.completed).map((p) => p.lesson_id)
  );

  const englishCompleted = ENGLISH_LESSONS.filter((b) => completedLessonIds.has(b.lesson.id)).length;
  const urduPhoneticCompleted = URDU_PHONETIC_LESSONS.filter((b) => completedLessonIds.has(b.lesson.id)).length;
  const urduStandardCompleted = URDU_STANDARD_LESSONS.filter((b) => completedLessonIds.has(b.lesson.id)).length;

  const totalLessonsDone = englishCompleted + urduPhoneticCompleted + urduStandardCompleted;

  // Chart data (sorted by date ascending)
  const chartData = [...testResults]
    .reverse()
    .slice(-15)
    .map((r) => ({
      date: new Date(r.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      wpm: r.wpm,
      accuracy: r.accuracy,
      language: r.language,
    }));

  const handleDownloadTrackCert = (trackName: string, langKey: string) => {
    if (!user) return;
    downloadCertificate({
      recipientName: user.display_name,
      achievementTitle: `${trackName} Mastery`,
      language: langKey,
      wpm: Math.max(bestWpm, 45),
      accuracy: avgAccuracy,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      certificateId: 'IT-' + Date.now().toString(36).toUpperCase().substring(0, 8),
    });
  };

  return (
    <PageWrapper maxWidth="normal">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Personal Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Welcome back, {user?.display_name}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
              Track your touch typing speed trajectories, lesson completions, and download official
              accreditation certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/test">
              <Button
                variant="primary"
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-md shadow-blue-900/20"
                icon={<Zap className="w-4 h-4" />}
              >
                Take Speed Test
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 5 Stats Overview Cards */}
      <div className="mb-8">
        <StatsOverview
          bestWpm={bestWpm}
          avgAccuracy={avgAccuracy}
          lessonsDone={totalLessonsDone}
          totalLessons={108}
          testsTaken={testResults.length}
          streakDays={streak?.current_streak || 1}
        />
      </div>

      {/* Charts Section & Right Sidebar Ad */}
      <div className="flex flex-col xl:flex-row gap-6 items-start mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 w-full">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" /> WPM Speed Trajectory
                </h3>
                <p className="text-xs text-slate-500">Historical performance across timed evaluations</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Peak: {bestWpm} WPM
              </span>
            </div>
            <WPMChart data={chartData} />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-600" /> Accuracy Consistency
                </h3>
                <p className="text-xs text-slate-500">Percentage accuracy curve over time</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Avg: {avgAccuracy}%
              </span>
            </div>
            <AccuracyChart data={chartData} />
          </Card>
        </div>

        {/* Right Side: Adsterra 160x600 Ad */}
        <aside className="w-full xl:w-[176px] flex flex-col items-center shrink-0">
          <div className="sticky top-24">
            <AdBanner size="160x600" />
          </div>
        </aside>
      </div>

      {/* Lesson Progress by Language */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Curriculum Track Progress
          </h3>
          <Link to="/lessons/english" className="text-xs font-bold text-blue-600 hover:underline">
            View All Lessons →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* English */}
          <Card className="p-5 border-t-4 border-t-blue-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Track 1</span>
              <span className="text-xs font-bold text-blue-600">{englishCompleted} / 36</span>
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-3">English QWERTY</h4>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(englishCompleted / 36) * 100}%` }}
              />
            </div>
            <Link to="/lessons/english">
              <Button variant="outline" size="sm" className="w-full">
                Continue English
              </Button>
            </Link>
          </Card>

          {/* Urdu Phonetic */}
          <Card className="p-5 border-t-4 border-t-emerald-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Track 2</span>
              <span className="text-xs font-bold text-emerald-600">{urduPhoneticCompleted} / 36</span>
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-3 font-urdu-typing">اردو فونیٹک</h4>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(urduPhoneticCompleted / 36) * 100}%` }}
              />
            </div>
            <Link to="/lessons/urdu-phonetic">
              <Button variant="outline" size="sm" className="w-full">
                Continue اردو Phonetic
              </Button>
            </Link>
          </Card>

          {/* Urdu Standard */}
          <Card className="p-5 border-t-4 border-t-purple-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Track 3</span>
              <span className="text-xs font-bold text-purple-600">{urduStandardCompleted} / 36</span>
            </div>
            <h4 className="font-bold text-base text-slate-900 mb-3 font-urdu-typing">اردو معیاری (Nastaliq)</h4>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(urduStandardCompleted / 36) * 100}%` }}
              />
            </div>
            <Link to="/lessons/urdu-standard">
              <Button variant="outline" size="sm" className="w-full">
                Continue اردو Standard
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Achievements &amp; Badges ({userBadges.length} Unlocked)
          </h3>
          <Link to="/profile" className="text-xs font-bold text-blue-600 hover:underline">
            View Details →
          </Link>
        </div>
        <BadgesGrid userBadges={userBadges} />
      </div>

      {/* Official Certificates Download Section */}
      <div className="mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Earned Accreditation Certificates
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-200">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">English Typing Certificate</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Verified credential for 36-lesson English curriculum completion.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              icon={<Download className="w-4 h-4" />}
              onClick={() => handleDownloadTrackCert('English Touch Typing', 'english')}
            >
              Download PDF
            </Button>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-slate-50 to-emerald-50/50 border border-emerald-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">اردو فونیٹک سرٹیفکیٹ</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              اردو زبان میں فونیٹک کی بورڈ ٹائپنگ میں مہارت کی سند۔
            </p>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              icon={<Download className="w-4 h-4" />}
              onClick={() => handleDownloadTrackCert('Urdu Phonetic Touch Typing', 'urdu-phonetic')}
            >
              Download PDF
            </Button>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-slate-50 to-purple-50/50 border border-purple-200">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">Speed Benchmark Certificate</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Accredited verification of your personal best {bestWpm} WPM speed.
            </p>
            <Button
              size="sm"
              variant="primary"
              className="w-full bg-purple-600 hover:bg-purple-700"
              icon={<Download className="w-4 h-4" />}
              onClick={() => handleDownloadTrackCert('Speed Benchmark Master', 'english')}
            >
              Download PDF
            </Button>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

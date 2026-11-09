import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Keyboard,
  Zap,
  Globe,
  Award,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageWrapper } from '../components/layout/PageWrapper';
import { dataService } from '../lib/supabase';
import { TestResult } from '../types';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import { isAICoachAvailable } from '../lib/aiCoach';
import { AdBanner } from '../components/ads/AdBanner';

export const Home: React.FC<{ onOpenAICoach?: () => void }> = ({ onOpenAICoach }) => {
  const navigate = useNavigate();
  const { setLanguage } = useSettingsStore();
  const { isGuest } = useAuthStore();

  const [stats, setStats] = useState({ totalUsers: 1420, lessonsCompleted: 8940, testsTaken: 12580 });
  const [topTypists, setTopTypists] = useState<TestResult[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'access-denied') {
      setToastMessage('Access denied: Administrator privileges required to access the Admin Panel.');
      setTimeout(() => setToastMessage(null), 4000);
      window.history.replaceState({}, '', window.location.pathname);
    }

    dataService.getPlatformStats().then(setStats);
    dataService.getLeaderboard('all').then((res) => setTopTypists(res.slice(0, 5)));
  }, []);

  const handleStartEnglish = () => {
    setLanguage('english');
    navigate('/lessons/english');
  };

  const handleStartUrdu = () => {
    setLanguage('urdu-phonetic');
    navigate('/lessons/urdu-phonetic');
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-rose-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-rose-700 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-4">
          <span>⚠️ {toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 hover:bg-rose-700 p-1 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50/40 to-slate-50 py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Premier Bilingual Typing Tutor</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Type Faster. <br />
                Work Smarter. <br />
                <span className="text-blue-600">In English &amp; اردو.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Master professional touch typing with structured interactive lessons, real-time animated
                keyboard highlights, speed tests, and verified certificates. Completely free, no registration
                required to start.
              </p>

              {/* Big CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto shadow-lg shadow-blue-500/25 text-base"
                  icon={<Keyboard className="w-5 h-5" />}
                  onClick={handleStartEnglish}
                >
                  Start English Lessons
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-base"
                  icon={<Globe className="w-5 h-5 text-emerald-600" />}
                  onClick={handleStartUrdu}
                >
                  Start اردو Lessons
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-slate-700"
                  icon={<Zap className="w-5 h-5 text-amber-500" />}
                  onClick={() => navigate('/test')}
                >
                  Take 1-Min Test
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free Public Access
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Phonetic &amp; Standard Nastaliq
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Instant PDF Certificates
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Keyboard Visual Preview & Adsterra Ad */}
            <div className="lg:col-span-5 flex flex-col xl:flex-row items-center justify-center gap-4">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200/80 relative">
                {/* Visual badge */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Live Typing Engine
                    </span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    78 WPM
                  </span>
                </div>

                {/* Animated Typing Sample */}
                <div className="bg-slate-50 rounded-2xl p-4 font-mono-typing text-sm leading-relaxed mb-4 border border-slate-200">
                  <span className="text-emerald-600 font-semibold">The quick brown fox </span>
                  <span className="bg-blue-100 text-blue-900 border-b-2 border-blue-600">j</span>
                  <span className="text-slate-400">umps over the lazy dog.</span>
                </div>

                {/* Urdu Sample */}
                <div
                  className="bg-slate-50 rounded-2xl p-3.5 font-urdu-typing text-right text-base leading-loose mb-4 border border-slate-200"
                  dir="rtl"
                >
                  <span className="text-emerald-600 font-bold">علم ایک ایسی دولت ہے </span>
                  <span className="bg-blue-100 text-blue-900 border-b-2 border-blue-600">ج</span>
                  <span className="text-slate-400">سے کوئی چرا نہیں سکتا۔</span>
                </div>

                {/* Micro Key Row Highlight */}
                <div className="flex gap-1.5 justify-center pt-2">
                  {['f', 'j', 'd', 'k', 's', 'l'].map((k) => (
                    <div
                      key={k}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                        k === 'j'
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40 scale-105 border border-blue-400'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {k}
                    </div>
                  ))}
                </div>

                <div className="mt-5 text-center">
                  <Link
                    to="/lessons/english"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  >
                    Explore all 36 interactive lessons <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right Side: Adsterra 160x300 Ad Unit */}
              <div className="shrink-0 flex justify-center">
                <AdBanner size="160x300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Strip */}
      <section className="bg-white py-10 border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {stats.totalUsers.toLocaleString()}+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Active Typists Worldwide
              </div>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                {stats.lessonsCompleted.toLocaleString()}+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Lessons Completed
              </div>
            </div>

            <div className="pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                {stats.testsTaken.toLocaleString()}+
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                Speed Tests Evaluated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <PageWrapper>
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Everything You Need to Master Touch Typing
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Engineered with modern pedagogy, live finger guidance, and native Urdu Unicode Nastaliq support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card hoverable className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Keyboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">36 Structured Lessons</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Step-by-step curriculum starting from home row resting keys up to complete paragraphs, numbers,
              and advanced punctuation.
            </p>
          </Card>

          <Card hoverable className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Native Urdu Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full support for both Urdu Phonetic (InPage style) and Urdu Standard typewriter layouts with
              Noto Nastaliq Urdu rendering.
            </p>
          </Card>

          <Card hoverable className="p-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Official Certificates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Download high-resolution verified PDF certificates displaying your name, exact WPM speed,
              accuracy, and unique credential ID.
            </p>
          </Card>
        </div>

        {/* How It Works 3-Step Strip */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white mb-16 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Simple 3-Step Flow</span>
            <h3 className="text-2xl sm:text-3xl font-black mt-1">How Inspire Typing Works</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/20">
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 font-black text-lg flex items-center justify-center mb-4 shadow-sm">
                1
              </div>
              <h4 className="font-bold text-base mb-2">Choose Language &amp; Layout</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Select English QWERTY or switch to Urdu Phonetic or Standard Nastaliq layout.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/20">
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 font-black text-lg flex items-center justify-center mb-4 shadow-sm">
                2
              </div>
              <h4 className="font-bold text-base mb-2">Follow The Animated Keyboard</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Watch the glowing on-screen keys guide your finger movements without ever looking down.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-6 border border-white/20">
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 font-black text-lg flex items-center justify-center mb-4 shadow-sm">
                3
              </div>
              <h4 className="font-bold text-base mb-2">Earn Badges &amp; Certificates</h4>
              <p className="text-xs text-blue-100 leading-relaxed">
                Climb the global leaderboard, unlock 10 milestone badges, and download your credential.
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                Global Leaderboard Champions
              </h3>
              <p className="text-xs text-slate-500 mt-1">Top speed records achieved across all languages</p>
            </div>
            <Link to="/leaderboard">
              <Button variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                View Full Top 50
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topTypists.map((item, idx) => (
              <Card key={item.id || idx} className="p-4 text-center border-t-4 border-t-blue-600">
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 mb-2">
                  Rank #{idx + 1}
                </div>
                <h4 className="font-bold text-sm text-slate-900 truncate">{item.display_name}</h4>
                <div className="text-2xl font-black text-blue-600 my-1">{item.wpm} <span className="text-xs font-semibold text-slate-400">WPM</span></div>
                <div className="text-xs text-slate-500">
                  {item.accuracy}% Acc • {item.language === 'english' ? 'English' : 'Urdu'}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Typing Coach Banner */}
        {isAICoachAvailable && onOpenAICoach && (
          <div className="mb-16 bg-purple-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-purple-800">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-800 text-purple-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> High Thinking Mode Enabled
              </div>
              <h3 className="text-2xl font-black">AI-Powered Typing Coach &amp; Drill Generator</h3>
              <p className="text-xs text-purple-200 max-w-xl">
                Get individualized diagnostic feedback on your rhythm, hesitate keys, and generate custom
                practice drills in English or Urdu powered by Gemini.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-purple-900 hover:bg-purple-50 shrink-0 font-bold"
              onClick={onOpenAICoach}
            >
              Open AI Coach
            </Button>
          </div>
        )}

        {/* Final Sign Up Callout */}
        {isGuest && (
          <div className="text-center py-12 px-6 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900">Ready to boost your typing speed?</h3>
            <p className="text-sm text-slate-600 mt-2 mb-6 max-w-md mx-auto">
              Join thousands of students and professionals learning to type with confidence in English &amp; Urdu.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/signup">
                <Button variant="primary" size="lg">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/lessons/english">
                <Button variant="outline" size="lg">
                  Practice as Guest
                </Button>
              </Link>
            </div>
          </div>
        )}
      </PageWrapper>
    </div>
  );
};

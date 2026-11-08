import React, { useState, useEffect } from 'react';
import { Trophy, Globe, Clock, UserPlus, Sparkles } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable';
import { Button } from '../components/ui/Button';
import { dataService } from '../lib/supabase';
import { TestResult } from '../types';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';

export const LeaderboardPage: React.FC = () => {
  const { isGuest } = useAuthStore();
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<number>(0);

  useEffect(() => {
    setLoading(true);
    dataService
      .getLeaderboard(selectedLang, selectedDuration)
      .then((data) => {
        setResults(data);
      })
      .finally(() => setLoading(false));
  }, [selectedLang, selectedDuration]);

  return (
    <PageWrapper maxWidth="normal">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Trophy className="w-8 h-8 text-amber-500" />
            Global Typists Leaderboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Top 50 speed records verified across English and Urdu touch typing evaluations.
          </p>
        </div>

        <Link to="/test">
          <Button variant="primary" size="md" icon={<Sparkles className="w-4 h-4" />}>
            Take Speed Test &amp; Rank
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Language Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Languages' },
            { id: 'english', label: 'English' },
            { id: 'urdu-phonetic', label: 'اردو Phonetic' },
            { id: 'urdu-standard', label: 'اردو Standard' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedLang(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedLang === tab.id ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Duration Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {[
            { sec: 0, label: 'All Durations' },
            { sec: 60, label: '1 Min' },
            { sec: 120, label: '2 Min' },
            { sec: 180, label: '3 Min' },
            { sec: 300, label: '5 Min' },
          ].map((dur) => (
            <button
              key={dur.sec}
              type="button"
              onClick={() => setSelectedDuration(dur.sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedDuration === dur.sec
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guest Sign Up Callout */}
      {isGuest && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Want your name on the Leaderboard?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Guest scores are not ranked publicly. Create a free account to immortalize your best WPM!
            </p>
          </div>
          <Link to="/signup">
            <Button variant="primary" size="sm" icon={<UserPlus className="w-4 h-4" />}>
              Sign Up Free
            </Button>
          </Link>
        </div>
      )}

      {/* Table */}
      <LeaderboardTable results={results} loading={loading} />
    </PageWrapper>
  );
};

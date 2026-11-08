import React from 'react';
import { Trophy, Medal, Zap, Target, Clock, Globe } from 'lucide-react';
import { TestResult } from '../../types';
import { Avatar } from '../ui/Avatar';
import { formatTime } from '../../lib/typingUtils';
import { useAuthStore } from '../../stores/authStore';

export interface LeaderboardTableProps {
  results: TestResult[];
  loading?: boolean;
}

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  results,
  loading = false,
}) => {
  const { user } = useAuthStore();

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-amber-950 font-black text-xs shadow-xs">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs shadow-xs">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-600/80 text-white font-black text-xs shadow-xs">
          3
        </span>
      );
    }
    return <span className="font-bold text-slate-500 text-xs w-7 text-center">#{rank}</span>;
  };

  const getLanguageLabel = (l: string) => {
    if (l === 'urdu-phonetic') return 'اردو (Phonetic)';
    if (l === 'urdu-standard') return 'اردو (Standard)';
    return 'English';
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 text-center animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/3 mx-auto mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
          <Trophy className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No leaderboard entries found</h3>
        <p className="text-xs text-slate-500 mt-1">
          Take a typing test to be the first to set a record in this category!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 text-center w-16">Rank</th>
              <th className="py-3.5 px-4">Typist</th>
              <th className="py-3.5 px-4 text-right">Speed</th>
              <th className="py-3.5 px-4 text-right">Accuracy</th>
              <th className="py-3.5 px-4">Language</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.map((res, idx) => {
              const rank = idx + 1;
              const isCurrentUser = user && user.id === res.user_id;

              return (
                <tr
                  key={res.id || idx}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-blue-50/60 font-semibold'
                      : rank <= 3
                      ? 'bg-amber-50/20 hover:bg-slate-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center">{getRankBadge(rank)}</div>
                  </td>

                  {/* Typist */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={res.display_name} url={res.avatar_url} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                          {res.display_name || 'Anonymous Typist'}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* WPM */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-black text-slate-900 text-base">
                      <Zap className="w-3.5 h-3.5 text-blue-600 inline" />
                      {res.wpm} <span className="text-xs font-semibold text-slate-400">WPM</span>
                    </span>
                  </td>

                  {/* Accuracy */}
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                      <Target className="w-3.5 h-3.5 inline" />
                      {res.accuracy}%
                    </span>
                  </td>

                  {/* Language */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {getLanguageLabel(res.language)}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-slate-500 font-medium">
                      {formatTime(res.duration_seconds)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-right text-xs text-slate-400">
                    {new Date(res.completed_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

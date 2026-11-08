import React from 'react';
import { Zap, Target, BookOpen, Clock, Flame } from 'lucide-react';
import { Card } from '../ui/Card';

export interface StatsOverviewProps {
  bestWpm: number;
  avgAccuracy: number;
  lessonsDone: number;
  totalLessons: number;
  testsTaken: number;
  streakDays: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  bestWpm,
  avgAccuracy,
  lessonsDone,
  totalLessons = 36,
  testsTaken,
  streakDays,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="p-4 border-l-4 border-l-blue-600">
        <div className="flex items-center justify-between text-blue-600 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Best Speed</span>
          <Zap className="w-5 h-5" />
        </div>
        <div className="text-3xl font-black text-slate-900">{bestWpm}</div>
        <div className="text-xs text-slate-400 mt-1">Words per minute</div>
      </Card>

      <Card className="p-4 border-l-4 border-l-emerald-600">
        <div className="flex items-center justify-between text-emerald-600 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accuracy</span>
          <Target className="w-5 h-5" />
        </div>
        <div className="text-3xl font-black text-slate-900">{avgAccuracy}%</div>
        <div className="text-xs text-slate-400 mt-1">Overall average</div>
      </Card>

      <Card className="p-4 border-l-4 border-l-purple-600">
        <div className="flex items-center justify-between text-purple-600 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Lessons</span>
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="text-3xl font-black text-slate-900">
          {lessonsDone} <span className="text-base font-medium text-slate-400">/ {totalLessons}</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">Sub-lessons completed</div>
      </Card>

      <Card className="p-4 border-l-4 border-l-indigo-600">
        <div className="flex items-center justify-between text-indigo-600 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tests Taken</span>
          <Clock className="w-5 h-5" />
        </div>
        <div className="text-3xl font-black text-slate-900">{testsTaken}</div>
        <div className="text-xs text-slate-400 mt-1">Speed evaluations</div>
      </Card>

      <Card className="col-span-2 md:col-span-1 p-4 border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between text-amber-500 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Streak</span>
          <Flame className="w-5 h-5" />
        </div>
        <div className="text-3xl font-black text-slate-900">{streakDays} Days</div>
        <div className="text-xs text-slate-400 mt-1">Continuous practice</div>
      </Card>
    </div>
  );
};

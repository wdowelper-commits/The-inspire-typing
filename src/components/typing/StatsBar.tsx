import React from 'react';
import { Zap, Type, Target, AlertCircle, Clock } from 'lucide-react';
import { formatTime } from '../../lib/typingUtils';

export interface StatsBarProps {
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  seconds: number;
  mode: 'countdown' | 'countup';
}

export const StatsBar: React.FC<StatsBarProps> = ({
  wpm,
  cpm,
  accuracy,
  mistakes,
  seconds,
  mode,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5 w-full">
      {/* WPM */}
      <div className="bg-white rounded-xl border border-slate-200 border-b-3 border-b-blue-600 py-2 px-3 shadow-xs flex items-center gap-2.5 h-[52px]">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none truncate">{wpm}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">WPM</div>
        </div>
      </div>

      {/* CPM */}
      <div className="bg-white rounded-xl border border-slate-200 border-b-3 border-b-indigo-600 py-2 px-3 shadow-xs flex items-center gap-2.5 h-[52px]">
        <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
          <Type className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none truncate">{cpm}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">CPM</div>
        </div>
      </div>

      {/* Accuracy */}
      <div className="bg-white rounded-xl border border-slate-200 border-b-3 border-b-emerald-600 py-2 px-3 shadow-xs flex items-center gap-2.5 h-[52px]">
        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
          <Target className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none truncate">{accuracy}%</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Accuracy</div>
        </div>
      </div>

      {/* Mistakes */}
      <div className="bg-white rounded-xl border border-slate-200 border-b-3 border-b-rose-500 py-2 px-3 shadow-xs flex items-center gap-2.5 h-[52px]">
        <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none truncate">{mistakes}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Mistakes</div>
        </div>
      </div>

      {/* Time */}
      <div className="col-span-2 sm:col-span-1 bg-white rounded-xl border border-slate-200 border-b-3 border-b-amber-500 py-2 px-3 shadow-xs flex items-center gap-2.5 h-[52px]">
        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none font-mono truncate">
            {formatTime(seconds)}
          </div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 truncate">
            {mode === 'countdown' ? 'Time Left' : 'Time'}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import { DIRECT_MONETIZE_URL } from './AdUnit';

interface SponsoredBannerProps {
  className?: string;
}

export const SponsoredBanner: React.FC<SponsoredBannerProps> = ({ className = '' }) => {
  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-900/60 p-3 sm:p-4 text-white shadow-lg overflow-hidden ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Sponsored • اسپانسرڈ
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
              Support Inspire Typing — Discover Exclusive Partner Offers &amp; Rewards
            </p>
          </div>
        </div>

        <a
          href={DIRECT_MONETIZE_URL}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>View Offers</span>
          <span className="font-urdu-typing text-xs">پیشکش دیکھیں</span>
          <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
        </a>
      </div>
    </div>
  );
};

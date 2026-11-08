import React from 'react';
import {
  Award,
  Zap,
  Flame,
  Crown,
  Target,
  BookOpen,
  Sparkles,
  Calendar,
  ShieldCheck,
  Trophy,
  Lock,
} from 'lucide-react';
import { Badge, UserBadge } from '../../types';
import { DEFAULT_BADGES } from '../../data/badges';

export interface BadgesGridProps {
  userBadges: UserBadge[];
  badges?: Badge[];
}

const iconMap: Record<string, React.ReactNode> = {
  Award: <Award className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
};

export const BadgesGrid: React.FC<BadgesGridProps> = ({
  userBadges,
  badges = DEFAULT_BADGES,
}) => {
  const earnedMap = new Map<string, UserBadge>();
  userBadges.forEach((ub) => earnedMap.set(ub.badge_id, ub));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {badges.map((badge) => {
        const earned = earnedMap.get(badge.id);
        const icon = iconMap[badge.icon_name] || <Award className="w-6 h-6" />;

        return (
          <div
            key={badge.id}
            className={`group relative rounded-2xl p-4 text-center transition-all duration-200 border ${
              earned
                ? 'bg-white border-blue-200 shadow-xs hover:shadow-md hover:border-blue-400'
                : 'bg-slate-50/70 border-slate-200/80 opacity-70 grayscale'
            }`}
          >
            {/* Badge Icon Circle */}
            <div
              className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3 shadow-inner transition-transform group-hover:scale-105 ${
                earned
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              {icon}
            </div>

            {/* Title & Description */}
            <h4 className="text-xs font-bold text-slate-900 leading-tight mb-1">{badge.name}</h4>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{badge.description}</p>

            {earned ? (
              <span className="mt-2.5 inline-block text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Unlocked
              </span>
            ) : (
              <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-slate-400">
                <Lock className="w-3 h-3" />
                <span>Locked</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

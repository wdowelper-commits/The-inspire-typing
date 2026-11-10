import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  Zap,
  Flame,
  Award,
  Play,
  ArrowRight,
  Sparkles,
  Trophy,
  Target,
  Wind,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface GameItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  badge: string;
  gradient: string;
  accentColor: string;
  icon: React.ElementType;
  features: string[];
}

export const GamesPage: React.FC = () => {
  const games: GameItem[] = [
    {
      id: 'key-catcher',
      title: 'Key Catcher',
      subtitle: 'Keyboard Ninja Reflexes',
      description:
        'Letters and words rain down from the sky. Strike the corresponding keys before they hit the ground. Test your key precision and reaction time!',
      path: '/games/key-catcher',
      badge: 'Reflex & Precision',
      gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
      accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
      icon: Target,
      features: ['HTML5 Canvas physics', '3 Lives & Combo multiplier', 'Dynamic speed scaling'],
    },
    {
      id: 'word-balloon',
      title: 'Word Balloon',
      subtitle: 'Floating Sky Popper',
      description:
        'Vibrant balloons carrying vocabulary float up towards the stratosphere. Type the words swiftly to pop them before they escape!',
      path: '/games/word-balloon',
      badge: 'Vocabulary & Speed',
      gradient: 'from-purple-600 via-pink-600 to-rose-500',
      accentColor: 'text-purple-600 bg-purple-50 border-purple-200',
      icon: Wind,
      features: ['Balloon pop animations', 'Word difficulty levels', 'Live score & timer'],
    },
    {
      id: 'speed-race',
      title: 'Speed Race',
      subtitle: 'Nitro Type Drag Racer',
      description:
        'Put the pedal to the metal! Every keystroke fuels your sports car down the drag strip against challenging AI drivers. High WPM wins the cup!',
      path: '/games/speed-race',
      badge: 'Nitro WPM Challenge',
      gradient: 'from-amber-500 via-orange-600 to-red-600',
      accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
      icon: Flame,
      features: ['Multi-lane track racer', 'Real-time WPM speedometer', 'Podium finish & rankings'],
    },
  ];

  return (
    <PageWrapper maxWidth="normal">
      {/* Hero Header */}
      <div className="relative mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-3">
            <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
            Arcade Mode
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Typing Arcade &amp; Mini-Games
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Gamify your touch typing practice. Build instantaneous muscle memory, enhance your
            words-per-minute rate, and climb the gaming leaderboards.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 relative z-10">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center">
            <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
            <div className="text-lg font-black">3 Modes</div>
            <div className="text-[10px] text-slate-300 uppercase font-semibold">Ready to Play</div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {games.map((game) => {
          const Icon = game.icon;
          return (
            <Card
              key={game.id}
              className="flex flex-col justify-between overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-slate-300 hover:-translate-y-1"
            >
              {/* Card Header with Banner */}
              <div>
                <div className={`h-36 bg-gradient-to-tr ${game.gradient} p-6 relative flex flex-col justify-between overflow-hidden`}>
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/30 text-white backdrop-blur-md border border-white/20">
                      {game.badge}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-black text-white tracking-tight">{game.title}</h3>
                    <p className="text-xs text-white/80 font-medium">{game.subtitle}</p>
                  </div>

                  {/* Decorative shape */}
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-md" />
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {game.description}
                  </p>

                  <div className="space-y-1.5 mb-6">
                    {game.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                        <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="p-6 pt-0">
                <Link to={game.path} className="block">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full flex items-center justify-center gap-2 font-bold shadow-xs group-hover:shadow-md transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Play Now
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </PageWrapper>
  );
};

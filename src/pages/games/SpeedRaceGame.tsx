import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  Trophy,
  Flame,
  Zap,
  Gauge,
  Flag,
  Sparkles,
  Award,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Button } from '../../components/ui/Button';
import { useSettingsStore } from '../../stores/settingsStore';

interface Racer {
  id: string;
  name: string;
  color: string;
  carBg: string;
  progress: number; // 0 to 100
  wpm: number;
  isPlayer: boolean;
}

const RACE_PASSAGES = [
  'The engines roar under the stadium floodlights as the countdown begins. Focus every finger on the home row, breathe steadily, and unleash blazing speed across the digital tarmac. Every crisp keystroke propels your machine closer to glory.',
  'Lightning fast reflexes separate the amateur from the grandmaster. As your fingers glide over the keys with effortless rhythm, the speedometer climbs into the nitro zone. Victory belongs to those who type with flawless precision.',
  'Accelerate past the competition with unyielding concentration. Feel the momentum build as word after word flows smoothly from your mind directly into the keystrokes. The checkered flag awaits the fastest typist on the track.',
];

export const SpeedRaceGame: React.FC = () => {
  const { soundEnabled } = useSettingsStore();

  const [passageIndex, setPassageIndex] = useState(0);
  const targetText = RACE_PASSAGES[passageIndex % RACE_PASSAGES.length];

  const [gameState, setGameState] = useState<'idle' | 'countdown' | 'racing' | 'finished'>('idle');
  const [countdown, setCountdown] = useState(3);
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  // Live stats
  const [playerWpm, setPlayerWpm] = useState(0);
  const [playerAccuracy, setPlayerAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);

  // Racers
  const [racers, setRacers] = useState<Racer[]>([
    { id: 'player', name: 'You (Champion)', color: '#2563EB', carBg: 'bg-blue-600', progress: 0, wpm: 0, isPlayer: true },
    { id: 'bot1', name: 'Turbo Bot', color: '#8B5CF6', carBg: 'bg-purple-600', progress: 0, wpm: 48, isPlayer: false },
    { id: 'bot2', name: 'Nitro Bot', color: '#EA580C', carBg: 'bg-orange-600', progress: 0, wpm: 65, isPlayer: false },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  const playRevSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext unavailable
    }
  };

  const playWinSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.25);
      });
    } catch {
      // AudioContext unavailable
    }
  };

  const startRaceCountdown = () => {
    setGameState('countdown');
    setCountdown(3);
    setTypedText('');
    setStartTime(null);
    setEndTime(null);
    setPlayerWpm(0);
    setPlayerAccuracy(100);
    setMistakes(0);

    setRacers([
      { id: 'player', name: 'You (Champion)', color: '#2563EB', carBg: 'bg-blue-600', progress: 0, wpm: 0, isPlayer: true },
      { id: 'bot1', name: 'Turbo Bot', color: '#8B5CF6', carBg: 'bg-purple-600', progress: 0, wpm: 46 + Math.floor(Math.random() * 8), isPlayer: false },
      { id: 'bot2', name: 'Nitro Bot', color: '#EA580C', carBg: 'bg-orange-600', progress: 0, wpm: 60 + Math.floor(Math.random() * 12), isPlayer: false },
    ]);
  };

  // 3-2-1 Countdown Timer
  useEffect(() => {
    if (gameState !== 'countdown') return;

    if (countdown > 0) {
      playRevSound();
      const timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState('racing');
      setStartTime(Date.now());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [gameState, countdown]);

  // AI Bots Movement Simulation while racing
  useEffect(() => {
    if (gameState !== 'racing' || !startTime) return;

    const interval = setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      if (elapsedMinutes <= 0) return;

      const wordsTotal = targetText.split(/\s+/).length;

      setRacers((prev) =>
        prev.map((racer) => {
          if (racer.isPlayer) return racer;
          // Bot progress based on assigned WPM
          const wordsTyped = racer.wpm * elapsedMinutes;
          const progress = Math.min(100, Math.round((wordsTyped / wordsTotal) * 100));
          return { ...racer, progress };
        })
      );
    }, 200);

    return () => clearInterval(interval);
  }, [gameState, startTime, targetText]);

  // Typing Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'racing') return;

    const currentLen = typedText.length;
    const nextChar = targetText[currentLen];

    if (e.key === 'Backspace') {
      // Prevent backspacing
      e.preventDefault();
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();

      if (e.key === nextChar) {
        // Correct Keystroke
        const newTyped = typedText + e.key;
        setTypedText(newTyped);

        // Update WPM & Progress
        if (startTime) {
          const minutes = (Date.now() - startTime) / 60000;
          const words = newTyped.length / 5;
          const currentWpm = minutes > 0 ? Math.round(words / minutes) : 0;
          setPlayerWpm(currentWpm);

          const progress = Math.min(100, Math.round((newTyped.length / targetText.length) * 100));

          setRacers((prev) =>
            prev.map((r) => (r.isPlayer ? { ...r, progress, wpm: currentWpm } : r))
          );

          // Check race finish
          if (newTyped.length >= targetText.length) {
            setGameState('finished');
            setEndTime(Date.now());
            playWinSound();
          }
        }
      } else {
        // Mistake
        setMistakes((m) => m + 1);
        const total = typedText.length + mistakes + 1;
        const acc = Math.max(0, Math.round(((typedText.length) / total) * 100));
        setPlayerAccuracy(acc);
      }
    }
  };

  // Determine positions / ranks
  const sortedRacers = [...racers].sort((a, b) => b.progress - a.progress || b.wpm - a.wpm);
  const playerRank = sortedRacers.findIndex((r) => r.isPlayer) + 1;

  const totalTimeSeconds = startTime && endTime ? Math.max(1, Math.round((endTime - startTime) / 1000)) : 0;

  return (
    <PageWrapper maxWidth="normal">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>

        {/* Live Gauges */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-slate-500 uppercase font-bold">Speed:</span>
            <span className="text-lg font-black text-blue-600">{playerWpm} WPM</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-500 uppercase font-bold">Accuracy:</span>
            <span className="text-sm font-black text-emerald-600">{playerAccuracy}%</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Flag className="w-3.5 h-3.5 text-red-500" />
            <span>Position: {playerRank === 1 ? '1st 🥇' : playerRank === 2 ? '2nd 🥈' : '3rd 🥉'}</span>
          </div>
        </div>

        <Button variant="ghost" size="sm" onClick={startRaceCountdown} icon={<RotateCcw className="w-3.5 h-3.5" />}>
          Restart
        </Button>
      </div>

      {/* Main Raceway Arena */}
      <div className="bg-slate-900 rounded-3xl p-5 border-2 border-slate-800 shadow-2xl mb-4 relative overflow-hidden">
        {/* Race Track Lanes */}
        <div className="space-y-3 relative z-10">
          {racers.map((racer, index) => (
            <div key={racer.id} className="relative">
              {/* Lane Info */}
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-1 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: racer.color }} />
                  {racer.name}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{racer.wpm} WPM ({racer.progress}%)</span>
              </div>

              {/* Asphalt Lane */}
              <div className="h-14 bg-slate-800/90 rounded-2xl relative border border-slate-700/80 overflow-hidden flex items-center px-4">
                {/* Lane Dashed Center Line */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0 border-t border-dashed border-slate-600/50" />

                {/* Checkered Finish Line Strip */}
                <div className="absolute right-4 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-70" />

                {/* Animated Race Car */}
                <div
                  style={{ left: `calc(${racer.progress * 0.88}% + 4px)` }}
                  className="absolute transition-all duration-200 ease-out flex items-center gap-1"
                >
                  <div
                    className={`h-9 px-3 rounded-xl ${racer.carBg} text-white font-black text-xs flex items-center gap-1.5 shadow-lg border border-white/30`}
                  >
                    <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                    <span>🏎️ {racer.isPlayer ? 'YOU' : racer.name.split(' ')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Countdown Overlay */}
        {gameState === 'countdown' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
            <div className="text-7xl font-black text-amber-400 animate-ping">
              {countdown > 0 ? countdown : 'GO!'}
            </div>
            <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-4">
              Get ready to accelerate...
            </p>
          </div>
        )}

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-20">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4">
              <Flame className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-3xl font-black mb-2">Nitro Speed Race</h2>
            <p className="text-sm text-slate-300 max-w-md mb-6">
              Race against Turbo Bot and Nitro Bot on a live drag strip. Keep your typing smooth and error-free to push your engine past 100 WPM!
            </p>
            <Button variant="primary" size="lg" onClick={startRaceCountdown} icon={<Flame className="w-5 h-5 fill-white" />}>
              Start Race
            </Button>
          </div>
        )}
      </div>

      {/* Typing Passage Area */}
      <div
        className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-4 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <span>RACE TRANSCRIPT</span>
          <span>{typedText.length} / {targetText.length} Characters</span>
        </div>

        <div className="font-mono text-base sm:text-lg leading-relaxed select-none tracking-wide text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <span className="text-blue-600 font-bold bg-blue-50/80 underline decoration-blue-500 decoration-2">
            {targetText.slice(0, typedText.length)}
          </span>
          <span className="text-slate-900 font-semibold">
            {targetText[typedText.length]}
          </span>
          <span className="text-slate-400">
            {targetText.slice(typedText.length + 1)}
          </span>
        </div>

        {/* Hidden Input field capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          className="opacity-0 absolute -z-10"
          autoFocus={gameState === 'racing'}
        />
      </div>

      {/* Results Modal */}
      {gameState === 'finished' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-800">
              {playerRank === 1 ? '1st Place Finish! 🏆' : `${playerRank}rd Place Finish`}
            </span>

            <h3 className="text-2xl font-black text-slate-900 mt-2 mb-1">
              {playerRank === 1 ? 'Race Champion!' : 'Great Race!'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              You crossed the finish line in {totalTimeSeconds} seconds.
            </p>

            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 mb-6">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">WPM</div>
                <div className="text-xl font-black text-blue-600">{playerWpm}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Accuracy</div>
                <div className="text-xl font-black text-emerald-600">{playerAccuracy}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Mistakes</div>
                <div className="text-xl font-black text-red-500">{mistakes}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => {
                  setPassageIndex((prev) => prev + 1);
                  startRaceCountdown();
                }}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Next Race
              </Button>
              <Link to="/games" className="flex-1">
                <Button variant="outline" size="md" className="w-full">
                  Arcade Hub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

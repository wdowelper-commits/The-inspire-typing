import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  Heart,
  Trophy,
  Play,
  Pause,
  Clock,
  Sparkles,
  Wind,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Button } from '../../components/ui/Button';
import { useSettingsStore } from '../../stores/settingsStore';

interface Balloon {
  id: number;
  word: string;
  x: number; // percentage (10% - 90%)
  y: number; // pixels from top
  speed: number;
  color: string;
  popped: boolean;
  scale: number;
}

const BALLOON_WORDS = [
  'sky', 'blue', 'wind', 'cloud', 'float', 'breeze', 'soar', 'glide', 'flight', 'dream',
  'high', 'light', 'swift', 'speed', 'shine', 'glow', 'flash', 'spark', 'quest', 'zenith',
  'galaxy', 'cosmic', 'orbit', 'meteor', 'rocket', 'comet', 'horizon', 'vision', 'magic', 'zen',
];

const BALLOON_COLORS = [
  'from-rose-500 to-pink-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-amber-400 to-orange-500',
  'from-purple-500 to-violet-600',
  'from-cyan-400 to-blue-500',
];

export const WordBalloonGame: React.FC = () => {
  const { soundEnabled } = useSettingsStore();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [typedBuffer, setTypedBuffer] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('inspire_word_balloon_high') || 0);
  });

  const nextIdRef = useRef(1);
  const lastSpawnRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const playPopSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch {
      // AudioContext unavailable
    }
  };

  const playMissSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // AudioContext unavailable
    }
  };

  const startGame = () => {
    setBalloons([]);
    setTypedBuffer('');
    setScore(0);
    setLives(3);
    setSeconds(0);
    setPoppedCount(0);
    nextIdRef.current = 1;
    lastSpawnRef.current = Date.now();
    setGameState('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
    } else if (gameState === 'paused') {
      setGameState('playing');
      lastSpawnRef.current = Date.now();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Timer interval
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Main animation frame for rising balloons
  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;

    const loop = () => {
      const now = Date.now();

      // Spawn new balloon
      const spawnRate = Math.max(1200, 2400 - seconds * 25);
      if (now - lastSpawnRef.current > spawnRate) {
        lastSpawnRef.current = now;
        const randomWord = BALLOON_WORDS[Math.floor(Math.random() * BALLOON_WORDS.length)];
        const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const x = 12 + Math.random() * 76; // 12% to 88%
        const speed = 1.0 + Math.random() * 0.8 + Math.min(seconds * 0.02, 1.8);

        setBalloons((prev) => [
          ...prev,
          {
            id: nextIdRef.current++,
            word: randomWord,
            x,
            y: 500, // Starts at bottom
            speed,
            color,
            popped: false,
            scale: 1,
          },
        ]);
      }

      // Move balloons upward (decrement Y)
      setBalloons((prev) => {
        let missedCount = 0;
        const updated = prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => {
            if (b.popped) return false;
            // Escape beyond top of sky (y < 30)
            if (b.y < 30) {
              missedCount++;
              return false;
            }
            return true;
          });

        if (missedCount > 0) {
          playMissSound();
          setLives((l) => {
            const nextLives = l - missedCount;
            if (nextLives <= 0) {
              setGameState('gameover');
            }
            return Math.max(0, nextLives);
          });
        }

        return updated;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, seconds]);

  // Update high score on game over
  useEffect(() => {
    if (gameState === 'gameover') {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('inspire_word_balloon_high', String(score));
      }
    }
  }, [gameState, score, highScore]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toLowerCase().trim();
    setTypedBuffer(val);

    // Check if typed buffer matches any balloon's word exactly
    const matchIndex = balloons.findIndex((b) => !b.popped && b.word.toLowerCase() === val);
    if (matchIndex >= 0) {
      const targetBalloon = balloons[matchIndex];
      playPopSound();

      // Remove balloon with pop animation
      setBalloons((prev) => prev.filter((b) => b.id !== targetBalloon.id));
      setTypedBuffer('');

      const pts = targetBalloon.word.length * 10 + 20;
      setScore((s) => s + pts);
      setPoppedCount((c) => c + 1);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <PageWrapper maxWidth="normal">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>

        {/* Live HUD */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-500 uppercase font-bold">Score:</span>
            <span className="text-base font-black text-slate-900">{score}</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold font-mono text-slate-700">{formatTime(seconds)}</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-500 uppercase font-bold mr-1">Lives:</span>
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                className={`w-4 h-4 transition-all ${
                  heart <= lives ? 'text-red-500 fill-red-500 scale-100' : 'text-slate-300 scale-90'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {gameState === 'playing' && (
            <Button variant="outline" size="sm" onClick={togglePause} icon={<Pause className="w-3.5 h-3.5" />}>
              Pause
            </Button>
          )}
          {gameState === 'paused' && (
            <Button variant="primary" size="sm" onClick={togglePause} icon={<Play className="w-3.5 h-3.5" />}>
              Resume
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={startGame} icon={<RotateCcw className="w-3.5 h-3.5" />}>
            Restart
          </Button>
        </div>
      </div>

      {/* Main Game Stage - Sky Arena */}
      <div
        className="relative w-full aspect-[16/9] max-h-[560px] bg-gradient-to-b from-sky-400 via-sky-200 to-indigo-100 rounded-3xl overflow-hidden shadow-2xl border-2 border-sky-300 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Floating Clouds Background */}
        <div className="absolute top-10 left-12 w-36 h-12 bg-white/70 rounded-full blur-xs opacity-75" />
        <div className="absolute top-24 right-20 w-48 h-16 bg-white/70 rounded-full blur-xs opacity-70" />
        <div className="absolute top-48 left-1/3 w-40 h-14 bg-white/60 rounded-full blur-xs opacity-60" />

        {/* Danger Escape Ceiling Line */}
        <div className="absolute top-[30px] left-0 right-0 h-0.5 border-t-2 border-dashed border-red-400/60 pointer-events-none">
          <span className="absolute right-4 -top-3 text-[10px] font-bold text-red-500 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-full">
            Escape Zone
          </span>
        </div>

        {/* Active Balloons in Air */}
        {balloons.map((b) => (
          <div
            key={b.id}
            style={{
              left: `${b.x}%`,
              top: `${b.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute flex flex-col items-center select-none pointer-events-none transition-transform"
          >
            {/* Balloon Body */}
            <div
              className={`w-20 h-24 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${b.color} shadow-lg flex items-center justify-center p-2 border border-white/30`}
            >
              <span className="text-white font-black text-xs tracking-wider uppercase drop-shadow-md text-center break-all px-1">
                {b.word}
              </span>
            </div>
            {/* Knot & String */}
            <div className="w-2 h-1.5 bg-black/30 rounded-full -mt-0.5" />
            <div className="w-px h-8 bg-slate-400/80" />
          </div>
        ))}

        {/* Live Typing Input Dock at Bottom */}
        {gameState === 'playing' && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-80 max-w-[90%] bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-slate-200">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={typedBuffer}
              onChange={handleInputChange}
              placeholder="Type word to pop balloon..."
              className="w-full text-center text-lg font-black text-blue-600 bg-transparent border-none outline-none placeholder:text-slate-400 placeholder:text-xs placeholder:font-normal"
            />
          </div>
        )}

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center mb-4">
              <Wind className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-3xl font-black mb-2">Word Balloon</h2>
            <p className="text-sm text-slate-300 max-w-md mb-6">
              Balloons float up towards the sky. Type the exact word written on any balloon to pop it
              before it escapes past the top line.
            </p>
            <Button variant="primary" size="lg" onClick={startGame} icon={<Play className="w-5 h-5 fill-white" />}>
              Start Floating
            </Button>
            {highScore > 0 && (
              <p className="mt-4 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> All-Time High Score: {highScore}
              </p>
            )}
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
            <h2 className="text-3xl font-black mb-4">Game Paused</h2>
            <Button variant="primary" size="md" onClick={togglePause} icon={<Play className="w-4 h-4 fill-white" />}>
              Resume
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-3xl font-black mb-1">Game Over!</h2>
            <p className="text-xs text-slate-400 mb-6">Too many balloons escaped into space.</p>

            <div className="grid grid-cols-3 gap-3 bg-white/10 p-4 rounded-2xl border border-white/15 w-80 mb-6">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Score</div>
                <div className="text-xl font-black text-white">{score}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Popped</div>
                <div className="text-xl font-black text-purple-400">{poppedCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Time</div>
                <div className="text-xl font-black text-amber-400">{formatTime(seconds)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" size="md" onClick={startGame} icon={<RotateCcw className="w-4 h-4" />}>
                Try Again
              </Button>
              <Link to="/games">
                <Button variant="outline" size="md" className="border-white/30 text-white hover:bg-white/10">
                  Arcade Hub
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

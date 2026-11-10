import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  RotateCcw,
  Heart,
  Trophy,
  Zap,
  Play,
  Pause,
  Award,
  Sparkles,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Button } from '../../components/ui/Button';
import { useSettingsStore } from '../../stores/settingsStore';

interface FallingItem {
  id: number;
  text: string;
  x: number;
  y: number;
  speed: number;
  color: string;
  radius: number;
  isWord: boolean;
  typedIndex: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  radius: number;
}

const COMMON_KEYS = 'abcdefghijklmnopqrstuvwxyz';
const COMMON_WORDS = [
  'key', 'type', 'fast', 'flow', 'code', 'neon', 'race', 'star', 'fire', 'hand',
  'mind', 'zoom', 'dash', 'game', 'play', 'hero', 'jump', 'gold', 'beat', 'cool',
];

const ITEM_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4'];

export const KeyCatcherGame: React.FC = () => {
  const { soundEnabled } = useSettingsStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return Number(localStorage.getItem('inspire_key_catcher_high') || 0);
  });

  // Game loop internal refs to avoid closure stale state
  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'paused' | 'gameover',
    score: 0,
    lives: 3,
    combo: 0,
    maxCombo: 0,
    items: [] as FallingItem[],
    particles: [] as Particle[],
    lastSpawn: 0,
    spawnInterval: 1400, // ms
    baseSpeed: 1.2,
    nextId: 1,
  });

  const playBeep = (freq: number, duration: number = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext unavailable
    }
  };

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.2;
      const speed = Math.random() * 3 + 2;
      stateRef.current.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        alpha: 1,
        radius: Math.random() * 3 + 2,
      });
    }
  };

  const startGame = () => {
    stateRef.current = {
      gameState: 'playing',
      score: 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      items: [],
      particles: [],
      lastSpawn: Date.now(),
      spawnInterval: 1400,
      baseSpeed: 1.4,
      nextId: 1,
    };
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setGameState('playing');
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      stateRef.current.gameState = 'paused';
      setGameState('paused');
    } else if (gameState === 'paused') {
      stateRef.current.gameState = 'playing';
      stateRef.current.lastSpawn = Date.now();
      setGameState('playing');
    }
  };

  // Keyboard typing listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current.gameState !== 'playing') return;
      if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;

      const key = e.key.toLowerCase();
      if (key.length !== 1 && key !== ' ') return;

      const items = stateRef.current.items;
      let matchedIndex = -1;

      // Find the lowest falling item that matches next required character
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const targetChar = item.text[item.typedIndex]?.toLowerCase();
        if (targetChar === key) {
          if (matchedIndex === -1 || item.y > items[matchedIndex].y) {
            matchedIndex = i;
          }
        }
      }

      if (matchedIndex >= 0) {
        const item = items[matchedIndex];
        item.typedIndex += 1;
        playBeep(440 + item.typedIndex * 80, 0.05);

        // Word or letter complete!
        if (item.typedIndex >= item.text.length) {
          createParticles(item.x, item.y, item.color);
          items.splice(matchedIndex, 1);

          const addedScore = item.isWord ? 40 : 15;
          const newCombo = stateRef.current.combo + 1;
          const newScore = stateRef.current.score + addedScore + Math.floor(newCombo / 5) * 5;

          stateRef.current.combo = newCombo;
          stateRef.current.score = newScore;
          if (newCombo > stateRef.current.maxCombo) {
            stateRef.current.maxCombo = newCombo;
            setMaxCombo(newCombo);
          }

          setCombo(newCombo);
          setScore(newScore);
          playBeep(750, 0.1);

          // Speed up slightly as score rises
          stateRef.current.baseSpeed = 1.4 + Math.min(newScore / 400, 2.5);
          stateRef.current.spawnInterval = Math.max(700, 1400 - (newScore / 300) * 120);
        }
      } else {
        // Missed key: reset combo
        stateRef.current.combo = 0;
        setCombo(0);
        playBeep(180, 0.07);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main Canvas Animation Loop
  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Background Grid / Stars
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);

      // Subtle horizontal floor danger line
      const floorY = height - 40;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(width, floorY);
      ctx.stroke();
      ctx.setLineDash([]);

      if (stateRef.current.gameState === 'playing') {
        const now = Date.now();

        // Spawn new item if interval passed
        if (now - stateRef.current.lastSpawn > stateRef.current.spawnInterval) {
          stateRef.current.lastSpawn = now;
          const isWord = Math.random() > 0.65;
          const text = isWord
            ? COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]
            : COMMON_KEYS[Math.floor(Math.random() * COMMON_KEYS.length)];

          const color = ITEM_COLORS[Math.floor(Math.random() * ITEM_COLORS.length)];
          const padding = 60;
          const x = padding + Math.random() * (width - padding * 2);

          stateRef.current.items.push({
            id: stateRef.current.nextId++,
            text,
            x,
            y: 20,
            speed: stateRef.current.baseSpeed * (0.8 + Math.random() * 0.4),
            color,
            radius: isWord ? 32 : 24,
            isWord,
            typedIndex: 0,
          });
        }

        // Update items
        const items = stateRef.current.items;
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i];
          item.y += item.speed;

          // Check hit floor
          if (item.y >= floorY) {
            createParticles(item.x, item.y, '#EF4444');
            items.splice(i, 1);
            const remainingLives = stateRef.current.lives - 1;
            stateRef.current.lives = remainingLives;
            stateRef.current.combo = 0;
            setLives(remainingLives);
            setCombo(0);
            playBeep(120, 0.2);

            if (remainingLives <= 0) {
              stateRef.current.gameState = 'gameover';
              setGameState('gameover');
              const finalScore = stateRef.current.score;
              if (finalScore > highScore) {
                setHighScore(finalScore);
                localStorage.setItem('inspire_key_catcher_high', String(finalScore));
              }
            }
          }
        }

        // Update particles
        const particles = stateRef.current.particles;
        for (let p = particles.length - 1; p >= 0; p--) {
          const part = particles[p];
          part.x += part.vx;
          part.y += part.vy;
          part.alpha -= 0.03;
          if (part.alpha <= 0) {
            particles.splice(p, 1);
          }
        }
      }

      // Render Falling Items
      stateRef.current.items.forEach((item) => {
        // Glowing bubble
        ctx.save();
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 12;

        if (item.isWord) {
          const pillWidth = item.text.length * 15 + 24;
          const pillHeight = 36;
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.roundRect(item.x - pillWidth / 2, item.y - pillHeight / 2, pillWidth, pillHeight, 18);
          ctx.fill();
        } else {
          ctx.fillStyle = item.color;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Render text (highlighting typed prefix)
        ctx.font = 'bold 18px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (item.isWord) {
          const fullText = item.text;
          const typed = fullText.slice(0, item.typedIndex);
          const remaining = fullText.slice(item.typedIndex);

          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(fullText.toUpperCase(), item.x, item.y);

          // Underline typed progress
          if (item.typedIndex > 0) {
            ctx.fillStyle = '#FDE047';
            ctx.fillText(typed.toUpperCase(), item.x - ctx.measureText(remaining.toUpperCase()).width / 2, item.y);
          }
        } else {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(item.text.toUpperCase(), item.x, item.y);
        }
      });

      // Render Particles
      stateRef.current.particles.forEach((part) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, part.alpha);
        ctx.fillStyle = part.color;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [highScore]);

  return (
    <PageWrapper maxWidth="normal">
      {/* Top Navbar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Link>

        {/* Live HUD Score & Lives */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-500 uppercase font-bold">Score:</span>
            <span className="text-base font-black text-slate-900">{score}</span>
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

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-1 text-xs font-bold text-purple-600">
            <Zap className="w-3.5 h-3.5" />
            <span>{combo}x Combo</span>
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

      {/* Main Canvas Area */}
      <div className="relative w-full aspect-[16/9] max-h-[560px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800">
        <canvas
          ref={canvasRef}
          width={900}
          height={520}
          className="w-full h-full object-contain block select-none"
        />

        {/* Start Overlay */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-3xl font-black mb-2">Key Catcher</h2>
            <p className="text-sm text-slate-300 max-w-md mb-6">
              Press the matching keys on your physical keyboard to disintegrate falling letters and words
              before they touch the red danger line.
            </p>
            <Button variant="primary" size="lg" onClick={startGame} icon={<Play className="w-5 h-5 fill-white" />}>
              Start Game
            </Button>
            {highScore > 0 && (
              <p className="mt-4 text-xs font-bold text-amber-400 flex items-center gap-1.5">
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
              Resume Playing
            </Button>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-3xl font-black mb-1">Game Over!</h2>
            <p className="text-xs text-slate-400 mb-6">You ran out of lives.</p>

            <div className="grid grid-cols-2 gap-4 bg-white/10 p-4 rounded-2xl border border-white/15 w-64 mb-6">
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold">Final Score</div>
                <div className="text-2xl font-black text-white">{score}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase font-bold">Best Combo</div>
                <div className="text-2xl font-black text-purple-400">{maxCombo}x</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="primary" size="md" onClick={startGame} icon={<RotateCcw className="w-4 h-4" />}>
                Play Again
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

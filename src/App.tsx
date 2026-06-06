/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Flag, Settings, Play, Info, Loader as Loader2, Map, ShoppingBag, ChevronRight, Gauge, Zap, Volume2, VolumeX, Star, RotateCcw, BookOpen, ChevronLeft } from 'lucide-react';

import { RacingGame, TrackThemeType } from './components/RacingGame';
import Garage from './components/Garage';
import Store from './components/Store';
import {
  CarConfig,
  CAR_MODELS,
  CarModelType,
  RaceMode,
  Inventory,
  getDefaultCarConfig,
  getDefaultInventory,
  getChassisIntroducedAtLevel,
} from './types';
import { getCarAssetForModel } from './utils';
import { DifficultyLevel, DIFFICULTY_PRESETS } from './constants/gameConfig';

// ============================================================================
// Types
// ============================================================================

type GameState =
  | 'title'
  | 'menu'
  | 'how-to-play'
  | 'playing'
  | 'gameover'
  | 'level-complete'
  | 'options'
  | 'mode-select'
  | 'garage'
  | 'store';

interface RaceResult {
  position: number;
  time: string;
  reward: number;
  score?: number;
  unlockedChassis?: CarModelType;
}

// ============================================================================
// localStorage hook
// ============================================================================

function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // ignore
    }
  }, [key, state]);

  return [state, setState];
}

// ============================================================================
// Cover image hook
// ============================================================================

function useCoverImage(): string | null {
  const [coverImage, setCoverImage] = useState<string | null>(() => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem('coverImage') : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (coverImage) return;
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 1280;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0d1117');
    gradient.addColorStop(0.3, '#1a1f3c');
    gradient.addColorStop(0.6, '#0e2a47');
    gradient.addColorStop(1, '#051426');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sunGrad = ctx.createRadialGradient(
      canvas.width / 2, canvas.height * 0.38, 0,
      canvas.width / 2, canvas.height * 0.38, 220,
    );
    sunGrad.addColorStop(0, '#facc15');
    sunGrad.addColorStop(0.4, '#f97316');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height * 0.38, 220, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 22; i++) {
      const y = canvas.height * 0.58 + i * i * 2.6;
      if (y > canvas.height) break;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    for (let i = -12; i <= 12; i++) {
      const topX = canvas.width / 2 + i * 60;
      const botX = canvas.width / 2 + i * 110;
      ctx.beginPath();
      ctx.moveTo(topX, canvas.height * 0.58);
      ctx.lineTo(botX, canvas.height);
      ctx.stroke();
    }

    ctx.fillStyle = '#05101f';
    ctx.beginPath();
    ctx.moveTo(90, canvas.height - 160);
    ctx.lineTo(180, canvas.height - 160);
    ctx.lineTo(205, canvas.height - 215);
    ctx.lineTo(345, canvas.height - 215);
    ctx.lineTo(395, canvas.height - 160);
    ctx.lineTo(630, canvas.height - 160);
    ctx.lineTo(630, canvas.height - 105);
    ctx.lineTo(90, canvas.height - 105);
    ctx.closePath();
    ctx.fill();

    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 22;
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(140, canvas.height - 118);
    ctx.lineTo(580, canvas.height - 118);
    ctx.stroke();
    ctx.shadowBlur = 0;

    const url = canvas.toDataURL('image/png');
    setCoverImage(url);
    try { localStorage.setItem('coverImage', url); } catch { /* ignore */ }
  }, [coverImage]);

  return coverImage;
}

// ============================================================================
// How To Play screen
// ============================================================================

function HowToPlayScreen({ onBack }: { onBack: () => void }) {
  const controls = [
    { key: 'W / ↑', action: 'Accelerate' },
    { key: 'S / ↓', action: 'Brake / Reverse' },
    { key: 'A / ←', action: 'Steer Left' },
    { key: 'D / →', action: 'Steer Right' },
    { key: 'Shift', action: 'Charge Turbo' },
    { key: 'Ctrl', action: 'Activate Turbo' },
    { key: 'P / Esc', action: 'Pause' },
  ];

  const tips = [
    'Draft behind opponents for a Slipstream speed boost.',
    'Drifting charges your Turbo meter faster.',
    'Hit Checkpoints before the timer runs out.',
    'Stay on the road — going off-road slows you down.',
    'Higher level = faster opponents and tighter checkpoints.',
    'Repair damage by visiting the Garage between races.',
  ];

  return (
    <motion.div
      key="how-to-play"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-xl w-full px-6 space-y-8"
    >
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase font-bold tracking-widest">Back</span>
        </button>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">How To Play</h2>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Controls & Tips</p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Keyboard Controls</h3>
        <div className="grid grid-cols-2 gap-2">
          {controls.map(({ key, action }) => (
            <div key={key} className="flex items-center gap-3">
              <kbd className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-[10px] font-mono text-cyan-400 whitespace-nowrap">
                {key}
              </kbd>
              <span className="text-xs text-zinc-300">{action}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Mobile Controls</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          On-screen buttons appear automatically on mobile. Use the large
          on-screen <span className="text-white font-bold">Accel / Brake / Left / Right</span> buttons.
          Enable <span className="text-cyan-400 font-bold">Tilt</span> in the HUD to steer with your device.
        </p>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-yellow-400" /> Pro Tips
        </h3>
        <ul className="space-y-2">
          {tips.map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
              <span className="text-cyan-400 font-bold mt-0.5">›</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onBack}
        className="w-full bg-white text-black font-black italic uppercase tracking-tight py-4 rounded-sm hover:bg-zinc-200 transition-all transform hover:skew-x-[-10deg] active:scale-95"
      >
        Got it!
      </button>
    </motion.div>
  );
}

// ============================================================================
// Main App
// ============================================================================

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [trackTheme, setTrackTheme] = useState<TrackThemeType>('neon_city');
  const [raceMode, setRaceMode] = useState<RaceMode>('classic');
  const [lastResult, setLastResult] = useState<RaceResult | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [difficulty, setDifficulty] = useLocalStorageState<DifficultyLevel>('racing_difficulty', 'normal');
  const [isMuted, setIsMuted] = useLocalStorageState<boolean>('racing_muted', false);

  const [level, setLevel] = useLocalStorageState<number>('racing_level', 1);
  const [money, setMoney] = useLocalStorageState<number>('racing_money', 0);
  const [bestScore, setBestScore] = useLocalStorageState<number>('racing_best_score', 0);
  const [totalRaces, setTotalRaces] = useLocalStorageState<number>('racing_total_races', 0);
  const [carConfig, setCarConfig] = useLocalStorageState<CarConfig>('racing_car_config', getDefaultCarConfig());
  const [inventory, setInventoryRaw] = useLocalStorageState<Inventory>('racing_inventory', getDefaultInventory());

  const setInventory: React.Dispatch<React.SetStateAction<Inventory>> = (value) => {
    setInventoryRaw((prev) => {
      const next = typeof value === 'function' ? (value as (p: Inventory) => Inventory)(prev) : value;
      return { ...next, cars: next.cars && next.cars.length ? next.cars : ['speedster'] };
    });
  };

  useEffect(() => {
    if (!inventory.cars || inventory.cars.length === 0) {
      setInventoryRaw({ ...inventory, cars: ['speedster'] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ESC key to go back from playing → menu (handled inside RacingGame via pause)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && gameState === 'playing') {
        // RacingGame handles its own pause; we don't need to do anything here
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  const coverImage = useCoverImage();

  const handleRaceEnd = (
    position: number,
    time: number,
    score?: number,
    opponentModels?: CarModelType[],
  ) => {
    setTotalRaces((r) => r + 1);

    const timeStr = position === 99 ? 'BUSTED' : (time / 1000).toFixed(2) + 's';
    let reward = Math.max(0, (10 - position) * 200 + (position === 1 ? 500 : 0));

    if (position === 99) {
      setLastResult({ position: 99, time: 'BUSTED', reward: 0, score });
      setGameState('gameover');
      return;
    }

    if (raceMode === 'drift' && score) {
      reward += Math.floor(score / 10);
    } else if (raceMode === 'tokyo-expressway') {
      reward = position === 1 ? 2000 + level * 500 : 100 + level * 50;
    }

    setMoney((prev) => prev + reward);

    const finalScore = score ?? Math.round(reward + (1000 / Math.max(1, time / 1000)));
    if (finalScore > bestScore) setBestScore(finalScore);

    let unlockedChassis: CarModelType | undefined;
    if (position === 1 && opponentModels && opponentModels.length > 0) {
      const owned = new Set(inventory.cars);
      const candidates = opponentModels.filter((m) => !owned.has(m));
      if (candidates.length > 0) {
        candidates.sort(
          (a, b) => (CAR_MODELS[b].unlockLevel ?? 0) - (CAR_MODELS[a].unlockLevel ?? 0),
        );
        unlockedChassis = candidates[0];
        setInventory((prev) => ({
          ...prev,
          cars: prev.cars.includes(unlockedChassis!) ? prev.cars : [...prev.cars, unlockedChassis!],
        }));
      }
    }

    setLastResult({ position, time: timeStr, reward, score, unlockedChassis });
    setGameState(position === 1 ? 'level-complete' : 'gameover');
  };

  const nextLevel = () => {
    setLevel((prev) => prev + 1);
    setGameState('playing');
  };

  const retryLevel = () => setGameState('playing');

  const resetProgress = () => {
    ['racing_level', 'racing_car_config', 'racing_money', 'racing_inventory',
      'racing_best_score', 'racing_total_races'].forEach((k) => {
      try { localStorage.removeItem(k); } catch { /* ignore */ }
    });
    window.location.reload();
  };

  const scoreForResult = () => {
    if (!lastResult) return 0;
    if (lastResult.score) return lastResult.score;
    return lastResult.reward;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center py-8">
      <AnimatePresence mode="wait">

        {/* ── Title ── */}
        {gameState === 'title' && (
          <motion.div
            key="title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGameState('menu')}
            className="fixed inset-0 z-50 cursor-pointer bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            {coverImage ? (
              <img
                src={coverImage}
                alt="Pro Star-Racing"
                className="absolute inset-0 w-full h-full object-cover opacity-55"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 opacity-55">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
              </div>
            )}
            <div className="relative z-10 text-center space-y-8 p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                className="space-y-2 px-4"
              >
                <h1 className="text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-blue-500 to-sky-700 uppercase drop-shadow-[0_0_30px_rgba(6,182,212,0.5)] leading-tight">
                  Pro Star-Racing
                </h1>
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              </motion.div>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-lg sm:text-2xl font-mono font-bold tracking-[0.4em] text-cyan-400 uppercase"
              >
                Press Start
              </motion.div>
            </div>
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d422_1px,transparent_1px),linear-gradient(to_bottom,#06b6d422_1px,transparent_1px)] bg-[size:60px_60px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom" />
            </div>
          </motion.div>
        )}

        {/* ── Main Menu ── */}
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8 max-w-md w-full px-6"
          >
            <div className="space-y-1">
              <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 uppercase">
                Main Menu
              </h1>
              <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase">Select your destination</p>
            </div>

            {/* Quick stats */}
            <div className="flex justify-between px-2 py-3 bg-zinc-900/50 border border-zinc-800 rounded-sm text-xs font-mono">
              <div className="text-center">
                <div className="text-zinc-500 uppercase tracking-widest text-[9px]">Level</div>
                <div className="text-cyan-400 font-bold text-base">{level}</div>
              </div>
              <div className="text-center">
                <div className="text-zinc-500 uppercase tracking-widest text-[9px]">Races</div>
                <div className="text-white font-bold text-base">{totalRaces}</div>
              </div>
              <div className="text-center">
                <div className="text-zinc-500 uppercase tracking-widest text-[9px]">Best</div>
                <div className="text-yellow-400 font-bold text-base">{bestScore.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-zinc-500 uppercase tracking-widest text-[9px]">Cash</div>
                <div className="text-emerald-400 font-bold text-base">${money.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setGameState('mode-select')}
                className="group relative flex items-center justify-center gap-3 bg-white text-black font-bold py-5 px-6 rounded-sm hover:bg-zinc-200 transition-all transform hover:skew-x-[-10deg] active:scale-95"
              >
                <Play className="w-5 h-5 fill-current" />
                <span className="uppercase tracking-tight text-lg">Start Race</span>
                <div className="absolute -bottom-1 -right-1 w-full h-full border border-white/20 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGameState('garage')}
                  className="group relative flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold py-4 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] active:scale-95"
                >
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span className="uppercase tracking-tight text-sm">Garage</span>
                </button>
                <button
                  onClick={() => setGameState('store')}
                  className="group relative flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold py-4 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  <span className="uppercase tracking-tight text-sm">Store</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setGameState('how-to-play')}
                  className="group relative flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold py-4 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] active:scale-95"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span className="uppercase tracking-tight text-sm">How to Play</span>
                </button>
                <button
                  onClick={() => setGameState('options')}
                  className="group relative flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold py-4 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] active:scale-95"
                >
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="uppercase tracking-tight text-sm">Options</span>
                </button>
              </div>

              <button
                onClick={() => setGameState('title')}
                className="group relative flex items-center justify-center gap-3 bg-zinc-900 text-white font-bold py-4 px-6 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] active:scale-95"
              >
                <Flag className="w-5 h-5 text-red-500" />
                <span className="uppercase tracking-tight text-base">Quit to Title</span>
              </button>
            </div>

            <div className="flex justify-between items-center px-2 pt-6 border-t border-zinc-800/50">
              <div className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">v2.5.0</div>
              <div className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest">© 2026 939PRO</div>
            </div>
          </motion.div>
        )}

        {/* ── How to Play ── */}
        {gameState === 'how-to-play' && (
          <HowToPlayScreen onBack={() => setGameState('menu')} />
        )}

        {/* ── Mode Select ── */}
        {gameState === 'mode-select' && (
          <motion.div
            key="mode-select"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center space-y-8 max-w-md w-full px-6"
          >
            <div className="space-y-2 text-left">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Select Mode</h2>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Choose your racing experience</p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {[
                { id: 'classic', name: 'Classic Race', desc: 'Lap-based race with AI opponents.', icon: Trophy, color: 'text-cyan-400' },
                { id: 'time-trial', name: 'Time Trial', desc: 'Beat the target time solo.', icon: Gauge, color: 'text-blue-400' },
                { id: 'elimination', name: 'Elimination', desc: 'Last car removed every 30 seconds.', icon: Flag, color: 'text-red-500' },
                { id: 'drift', name: 'Drift King', desc: 'Score points by drifting corners.', icon: Zap, color: 'text-yellow-400' },
                { id: 'tokyo-expressway', name: 'Tokyo Expressway', desc: 'Head-to-head highway battle.', icon: Zap, color: 'text-pink-500' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setRaceMode(mode.id as RaceMode);
                    if (mode.id === 'tokyo-expressway') setTrackTheme('neon_city');
                    setGameState('playing');
                  }}
                  className="group relative flex items-center justify-between bg-zinc-900 text-white font-bold py-4 px-6 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <mode.icon className={`w-5 h-5 ${mode.color}`} />
                    <div className="text-left">
                      <div className="uppercase tracking-tight text-lg">{mode.name}</div>
                      <div className="text-[10px] font-mono text-zinc-500">{mode.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}

              <button
                onClick={() => setGameState('menu')}
                className="mt-2 text-zinc-500 hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
              >
                Back to Main Menu
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Options ── */}
        {gameState === 'options' && (
          <motion.div
            key="options"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center space-y-8 max-w-md w-full px-6"
          >
            <div className="space-y-2 text-left">
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">Options</h2>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Configure your game</p>
            </div>

            <div className="space-y-5 w-full">
              {/* Difficulty */}
              <div className="bg-zinc-900/50 p-5 rounded-sm border border-zinc-800 text-left space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5" /> Difficulty
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(DIFFICULTY_PRESETS) as DifficultyLevel[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`py-3 px-1 rounded-sm border text-[10px] uppercase font-bold transition-all ${
                        difficulty === d
                          ? 'bg-cyan-500 border-cyan-400 text-black'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {DIFFICULTY_PRESETS[d].label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">
                  {DIFFICULTY_PRESETS[difficulty].description}
                </p>
              </div>

              {/* Sound */}
              <div className="bg-zinc-900/50 p-5 rounded-sm border border-zinc-800 text-left space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sound</h3>
                <button
                  onClick={() => setIsMuted((m) => !m)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm border font-bold text-xs uppercase tracking-widest transition-all w-full ${
                    isMuted
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-400'
                      : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isMuted ? 'Sound Off (click to enable)' : 'Sound On (click to mute)'}
                </button>
              </div>

              {/* Track Theme */}
              <div className="bg-zinc-900/50 p-5 rounded-sm border border-zinc-800 text-left space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Map className="w-3.5 h-3.5" /> Track Theme
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(['neon_city', 'coastal_highway', 'desert_canyon', 'cyber_industrial', 'mountain_pass', 'urban_downtown'] as TrackThemeType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTrackTheme(t)}
                      className={`py-2 px-1 rounded-sm border text-[10px] uppercase font-bold transition-all ${
                        trackTheme === t
                          ? 'bg-cyan-500 border-cyan-400 text-black'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {t.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls ref */}
              <div className="bg-zinc-900/50 p-5 rounded-sm border border-zinc-800 text-left space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Controls</h3>
                <ul className="text-[10px] space-y-1.5 font-mono text-zinc-500">
                  <li><span className="text-zinc-300">DRIVE</span> — WASD / Arrows</li>
                  <li><span className="text-zinc-300">TURBO</span> — Ctrl (Shift to charge)</li>
                  <li><span className="text-zinc-300">DRIFT</span> — Brake + Steer at speed</li>
                  <li><span className="text-zinc-300">PAUSE</span> — P / Esc</li>
                </ul>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-full py-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-red-900/40 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset All Progress
                </button>
                <button
                  onClick={() => setGameState('menu')}
                  className="w-full py-4 bg-white text-black font-bold rounded-sm hover:bg-zinc-200 transition-colors uppercase tracking-widest text-xs"
                >
                  Save & Back
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Playing ── */}
        {gameState === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex items-center justify-center p-2 md:p-4"
          >
            <RacingGame
              level={level}
              trackTheme={trackTheme}
              carConfig={carConfig}
              setCarConfig={setCarConfig}
              mode={raceMode}
              difficulty={difficulty}
              initialMuted={isMuted}
              availableOpponentModels={getChassisIntroducedAtLevel(level)}
              onRaceEnd={handleRaceEnd}
              onBack={() => setGameState('menu')}
            />
          </motion.div>
        )}

        {/* ── Garage ── */}
        {gameState === 'garage' && (
          <Garage
            carConfig={carConfig}
            setCarConfig={setCarConfig}
            money={money}
            setMoney={setMoney}
            inventory={inventory}
            onBack={() => setGameState('menu')}
          />
        )}

        {/* ── Store ── */}
        {gameState === 'store' && (
          <Store
            money={money}
            setMoney={setMoney}
            inventory={inventory}
            setInventory={setInventory}
            level={level}
            onBack={() => setGameState('menu')}
          />
        )}

        {/* ── Game Over ── */}
        {gameState === 'gameover' && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 max-w-sm w-full px-6"
          >
            <div className="space-y-2">
              <h2 className="text-5xl font-black italic text-red-500 uppercase tracking-tighter">
                {lastResult?.position === 99 ? 'BUSTED!' : 'Race Failed'}
              </h2>
              <p className="text-zinc-400 font-mono text-sm">
                {lastResult?.position === 99
                  ? 'The police caught you.'
                  : raceMode === 'drift'
                  ? `Drift Score: ${lastResult?.score ?? 0}`
                  : raceMode === 'tokyo-expressway'
                  ? 'You lost the head-to-head.'
                  : `Finished P${lastResult?.position}`}
              </p>
              {(lastResult?.score ?? 0) > 0 && (
                <p className="text-yellow-400 font-mono text-sm">Drift Bonus: +${Math.floor((lastResult?.score ?? 0) / 10)}</p>
              )}
              <p className="text-emerald-400 font-mono">Reward: +${lastResult?.reward ?? 0}</p>

              <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm flex justify-between text-xs font-mono">
                <span className="text-zinc-500">Your Score</span>
                <span className="text-white font-bold">{scoreForResult().toLocaleString()}</span>
              </div>
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm flex justify-between text-xs font-mono">
                <span className="text-zinc-500 flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-400" /> Best Score</span>
                <span className="text-yellow-400 font-bold">{bestScore.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-zinc-400 max-w-xs mx-auto text-sm">
              {lastResult?.position === 99
                ? 'Avoid police to stay in the race.'
                : raceMode === 'time-trial'
                ? 'Beat the target time to advance.'
                : 'Finish 1st to advance.'}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={retryLevel}
                className="bg-white text-black font-bold py-4 px-10 rounded-sm hover:bg-zinc-200 transition-all transform hover:skew-x-[-10deg] uppercase flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Retry Race
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="bg-zinc-900 text-zinc-400 font-bold py-4 px-10 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] uppercase"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Level Complete ── */}
        {gameState === 'level-complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 max-w-sm w-full px-6"
          >
            <div className="space-y-2">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-5xl font-black italic text-emerald-500 uppercase tracking-tighter">Victory!</h2>
              <p className="text-zinc-400 font-mono text-sm">
                {raceMode === 'drift'
                  ? `Drift Score: ${lastResult?.score ?? 0}`
                  : raceMode === 'tokyo-expressway'
                  ? 'Rival eliminated!'
                  : `Time: ${lastResult?.time}`}
              </p>
              {(lastResult?.score ?? 0) > 0 && (
                <p className="text-yellow-400 font-mono text-sm">Drift Bonus: +${Math.floor((lastResult?.score ?? 0) / 10)}</p>
              )}
              <p className="text-emerald-400 font-mono font-bold">Reward: +${lastResult?.reward ?? 0}</p>

              <div className="mt-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm flex justify-between text-xs font-mono">
                <span className="text-zinc-500">Your Score</span>
                <span className="text-white font-bold">{scoreForResult().toLocaleString()}</span>
              </div>
              <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm flex justify-between text-xs font-mono">
                <span className="text-zinc-500 flex items-center gap-1"><Trophy className="w-3 h-3 text-yellow-400" /> Best Score</span>
                <span className={`font-bold ${scoreForResult() >= bestScore ? 'text-yellow-400' : 'text-zinc-400'}`}>
                  {bestScore.toLocaleString()}
                  {scoreForResult() >= bestScore && <span className="ml-1 text-yellow-300">★ NEW</span>}
                </span>
              </div>
            </div>

            {lastResult?.unlockedChassis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mx-auto max-w-sm bg-cyan-900/20 border border-cyan-700/50 rounded-sm p-4 flex items-center gap-4"
              >
                <img
                  src={getCarAssetForModel(lastResult.unlockedChassis)}
                  alt={CAR_MODELS[lastResult.unlockedChassis].name}
                  className="w-20 h-16 object-contain shrink-0"
                />
                <div className="text-left">
                  <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest">New Chassis Unlocked</p>
                  <p className="text-xl font-black italic uppercase tracking-tight">
                    {CAR_MODELS[lastResult.unlockedChassis].name}
                  </p>
                  <p className="text-xs text-zinc-400">Available in your Garage now.</p>
                </div>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={nextLevel}
                className="bg-white text-black font-bold py-4 px-10 rounded-sm hover:bg-zinc-200 transition-all transform hover:skew-x-[-10deg] uppercase"
              >
                Next Level
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="bg-zinc-900 text-zinc-400 font-bold py-4 px-10 rounded-sm border border-zinc-800 hover:bg-zinc-800 transition-all transform hover:skew-x-[-10deg] uppercase"
              >
                Back to Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirm Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 p-8 max-w-sm w-full space-y-6 text-center"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-red-500">Reset Progress?</h3>
                <p className="text-zinc-400 text-sm font-mono uppercase tracking-tight">
                  All levels, money, and upgrades will be lost. This cannot be undone.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={resetProgress}
                  className="bg-red-600 text-white font-bold py-4 rounded-sm hover:bg-red-500 transition-colors uppercase tracking-widest text-xs"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-zinc-800 text-zinc-400 font-bold py-4 rounded-sm hover:bg-zinc-700 transition-colors uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background grid */}
      <div className="fixed inset-0 -z-20 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
    </div>
  );
}

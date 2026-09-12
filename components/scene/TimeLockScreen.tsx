'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import {
  Lock,
  Clock,
  Sparkles,
  Calendar,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronDown,
  Heart,
  PartyPopper,
  Flame,
  Wine
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { TimeLockAtmosphere } from './TimeLockAtmosphere';
import { Vault3DCore } from './Vault3DCore';
import { TimeLockArcade } from './TimeLockArcade';
import {
  generateGoogleCalendarUrl,
  downloadIcsFile
} from '../../utils/calendarReminder';

interface TimeLockScreenProps {
  recipientName: string;
  unlockDateTime: string;
  onUnlock: () => void;
  themeBackgroundClass?: string;
  senderName?: string;
}

interface TimeRemaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FloatingReaction {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

function calculateTimeRemaining(targetIso: string): TimeRemaining {
  const target = new Date(targetIso).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0 || isNaN(target)) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { totalMs: diff, days, hours, minutes, seconds };
}

// Pentatonic frequencies for crystal vault chime interactions (C5, D5, E5, G5, A5, C6)
const PENTATONIC_FREQS = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

export const TimeLockScreen: React.FC<TimeLockScreenProps> = ({
  recipientName,
  unlockDateTime,
  onUnlock,
  senderName
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(unlockDateTime)
  );
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [calendarMenuOpen, setCalendarMenuOpen] = useState(false);
  const [sparkCount, setSparkCount] = useState(7);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; gain?: GainNode }>({});
  const chimeIndexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(unlockDateTime);
      setTimeLeft(remaining);

      if (remaining.totalMs <= 0) {
        clearInterval(timer);
        stopAtmosphericSound();
        audio.playSFX('horn');
        audio.playSFX('sparkle');
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDateTime, onUnlock]);

  // Clean up Web Audio on unmount
  useEffect(() => {
    return () => {
      stopAtmosphericSound();
    };
  }, []);

  const getOrCreateAudioCtx = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  // Play harmonious crystal chime on user interaction
  const playCrystalChime = () => {
    try {
      const ctx = getOrCreateAudioCtx();
      if (!ctx) return;

      const freq = PENTATONIC_FREQS[chimeIndexRef.current % PENTATONIC_FREQS.length];
      chimeIndexRef.current += 1;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {}
  };

  const startAtmosphericSound = () => {
    try {
      const ctx = getOrCreateAudioCtx();
      if (!ctx) return;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.connect(ctx.destination);

      // Low celestial harmonic drone
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
      osc1.connect(gain);
      osc1.start();

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(165, ctx.currentTime); // E3 fifth
      osc2.connect(gain);
      osc2.start();

      oscillatorNodesRef.current = { osc1, osc2, gain };
      setIsAudioActive(true);
    } catch (err) {
      console.warn('Web Audio drone init error:', err);
    }
  };

  const stopAtmosphericSound = () => {
    try {
      const { osc1, osc2, gain } = oscillatorNodesRef.current;
      if (gain && audioContextRef.current) {
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current.currentTime + 0.5);
      }
      setTimeout(() => {
        osc1?.stop();
        osc2?.stop();
        oscillatorNodesRef.current = {};
      }, 500);
    } catch {}
    setIsAudioActive(false);
  };

  const toggleAtmosphericAudio = () => {
    if (isAudioActive) {
      stopAtmosphericSound();
    } else {
      startAtmosphericSound();
    }
  };

  // Interactive Reactions (Confetti, Hearts, Toast, Spark)
  const triggerReaction = (type: 'confetti' | 'heart' | 'spark' | 'toast', e?: React.MouseEvent) => {
    setSparkCount((prev) => prev + 1);
    playCrystalChime();

    if (type === 'confetti') {
      audio.playSFX('sparkle');
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.75 }
      });
    }

    // Spawn floating emoji element
    const rect = e?.currentTarget.getBoundingClientRect();
    const spawnX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const spawnY = rect ? rect.top : window.innerHeight * 0.7;

    const emojis = {
      confetti: '🎉',
      heart: '💖',
      spark: '✨',
      toast: '🥂'
    };

    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      emoji: emojis[type],
      x: spawnX + (Math.random() - 0.5) * 40,
      y: spawnY
    };

    setFloatingReactions((prev) => [...prev.slice(-15), newReaction]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 1600);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  const formattedDate = unlockDateTime
    ? new Date(unlockDateTime).toLocaleString(undefined, {
        dateStyle: 'full',
        timeStyle: 'medium'
      })
    : 'Upcoming Zero-Hour';

  const googleCalUrl = generateGoogleCalendarUrl(recipientName, unlockDateTime);

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-between p-4 sm:p-7 text-center select-none relative overflow-hidden font-sans">
      
      {/* 1. Harmonious Dark Graph-Paper Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(245, 158, 11, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(245, 158, 11, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Blueprint Crosshairs on Corners */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-amber-500/30 select-none pointer-events-none hidden sm:block">
        + [GRID: 32px · LAT_01]
      </div>
      <div className="absolute top-4 right-4 font-mono text-[9px] text-amber-500/30 select-none pointer-events-none hidden sm:block">
        [TIME_LOCKED: ACTIVE] +
      </div>

      {/* Dynamic Starlight & Particle Waves */}
      <TimeLockAtmosphere themeColor="#f59e0b" />

      {/* Radial Obsidian Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.4)_0%,rgba(7,11,20,0.92)_80%)] pointer-events-none z-0" />

      {/* Floating Animated Reaction Emojis */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingReactions.map((r) => (
          <span
            key={r.id}
            className="absolute text-2xl sm:text-3xl animate-float-up opacity-90 transition-all"
            style={{ left: `${r.x}px`, top: `${r.y}px` }}
          >
            {r.emoji}
          </span>
        ))}
      </div>

      {/* 2. Top Control Bar */}
      <header className="relative z-20 w-full max-w-4xl flex items-center justify-between border-b border-white/10 pb-3 pt-1">
        <BrandLogo size="sm" showSubtitle={true} href="" variant="gold" />

        <div className="flex items-center gap-2">
          {/* Audio Soundscape Toggle */}
          <button
            onClick={toggleAtmosphericAudio}
            className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase rounded-md border flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
              isAudioActive
                ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'
            }`}
            title="Toggle atmospheric harmonic drone"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-zinc-950" />
                <span>AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span>SOUNDSCAPE</span>
              </>
            )}
          </button>

          {/* Calendar Reminder Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-400/30 rounded-md font-mono text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md hover:border-amber-400/50"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>REMIND ME</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {calendarMenuOpen && (
              <div
                className="absolute right-0 top-10 w-52 bg-[#0d1424] border border-amber-400/40 rounded-lg p-1.5 flex flex-col gap-1 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 text-left"
                onClick={() => setCalendarMenuOpen(false)}
              >
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-left font-mono text-xs font-semibold rounded-md hover:bg-amber-400/15 text-zinc-200 hover:text-amber-300 flex items-center justify-between transition-colors"
                >
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <button
                  onClick={() => downloadIcsFile(recipientName, unlockDateTime)}
                  className="px-3 py-2 text-left font-mono text-xs font-semibold rounded-md hover:bg-amber-400/15 text-zinc-200 hover:text-amber-300 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Apple / Outlook (iCal)</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Center Stage */}
      <main className="relative z-10 my-auto py-4 sm:py-6 flex flex-col items-center max-w-2xl w-full">
        
        {/* Discreet Locked Status */}
        <div className="inline-flex items-center gap-2 mb-2">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px] text-amber-300/90 uppercase tracking-[0.25em] font-semibold">
            LOCKED TIME CAPSULE
          </span>
        </div>

        {/* Recipient Headline */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-tight">
          FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">{recipientName}</span>
        </h1>

        <p className="mt-1.5 font-mono text-xs text-zinc-400 uppercase tracking-wider font-medium max-w-md">
          A personalized celebration has been sealed inside. Unlocks automatically at zero-hour.
        </p>

        {/* 4. COUNTDOWN MATRIX MOVED UP (Primary Focal Point) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-lg mt-5 mb-2">
          {/* Days */}
          <div className="bg-[#0c1220]/85 border border-amber-500/25 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {pad(timeLeft.days)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="bg-[#0c1220]/85 border border-amber-500/25 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {pad(timeLeft.hours)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-[#0c1220]/85 border border-amber-500/25 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {pad(timeLeft.minutes)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1">
              MINUTES
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-[#0c1220]/85 border border-amber-400/40 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(245,158,11,0.15)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-amber-300 tracking-tighter drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              {pad(timeLeft.seconds)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>SECONDS</span>
            </span>
          </div>
        </div>

        {/* 5. 3D Radiant Gold Vault Core with Sound Resonance */}
        <div className="my-1">
          <Vault3DCore
            themeColor="#f59e0b"
            onInteract={() => {
              playCrystalChime();
              setSparkCount((p) => p + 1);
            }}
          />
        </div>

        {/* 6. Interactive Pre-Celebration Reaction Station */}
        <div className="flex flex-col items-center gap-2 mt-1 max-w-md w-full">
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>SEND PRE-CELEBRATION ENERGY</span>
          </span>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Confetti */}
            <button
              onClick={(e) => triggerReaction('confetti', e)}
              className="px-3 py-1.5 bg-white/5 hover:bg-amber-400/20 active:scale-95 border border-amber-400/30 rounded-full font-mono text-xs flex items-center gap-1.5 transition-all text-zinc-200 hover:text-amber-300 cursor-pointer backdrop-blur-md"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span>Confetti</span>
            </button>

            {/* Heart */}
            <button
              onClick={(e) => triggerReaction('heart', e)}
              className="px-3 py-1.5 bg-white/5 hover:bg-rose-400/20 active:scale-95 border border-rose-400/30 rounded-full font-mono text-xs flex items-center gap-1.5 transition-all text-zinc-200 hover:text-rose-300 cursor-pointer backdrop-blur-md"
            >
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
              <span>Wish Love</span>
            </button>

            {/* Spark */}
            <button
              onClick={(e) => triggerReaction('spark', e)}
              className="px-3 py-1.5 bg-white/5 hover:bg-yellow-400/20 active:scale-95 border border-yellow-400/30 rounded-full font-mono text-xs flex items-center gap-1.5 transition-all text-zinc-200 hover:text-yellow-300 cursor-pointer backdrop-blur-md"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-400" />
              <span>Sparkle</span>
            </button>

            {/* Toast */}
            <button
              onClick={(e) => triggerReaction('toast', e)}
              className="px-3 py-1.5 bg-white/5 hover:bg-amber-400/20 active:scale-95 border border-amber-400/30 rounded-full font-mono text-xs flex items-center gap-1.5 transition-all text-zinc-200 hover:text-amber-300 cursor-pointer backdrop-blur-md"
            >
              <Wine className="w-3.5 h-3.5 text-amber-300" />
              <span>Toast</span>
            </button>
          </div>

          <span className="font-mono text-[9px] text-amber-400/70 tracking-wider mt-0.5">
            ✦ {sparkCount} CELEBRATION SPARKS TRANSMITTED
          </span>
        </div>

        {/* 7. Interactive Celebration Arcade (Piano & Speed Typing) */}
        <TimeLockArcade />

        {/* 8. Zero-Hour Schedule Footnote */}
        <div className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-zinc-400 uppercase font-medium border-t border-white/10 pt-3">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>ZERO-HOUR: <strong className="text-zinc-200 font-bold ml-1">{formattedDate}</strong></span>
        </div>
      </main>

      {/* 8. Bottom Status Strip */}
      <footer className="relative z-20 w-full max-w-4xl border-t border-white/10 pt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        <span>ENCRYPTED CELEBRATION CAPSULE</span>
        <span className="text-amber-400/80 font-medium">AUTOMATIC UNSEAL ON EXPIRY</span>
      </footer>
    </div>
  );
};



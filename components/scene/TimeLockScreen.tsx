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
  type: 'confetti' | 'heart' | 'spark' | 'toast';
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

    // Spawn floating icon element
    const rect = e?.currentTarget.getBoundingClientRect();
    const spawnX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const spawnY = rect ? rect.top : window.innerHeight * 0.7;

    const newReaction: FloatingReaction = {
      id: Date.now() + Math.random(),
      type,
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
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex flex-col items-center justify-between text-center select-none relative overflow-hidden font-sans grid-bg selection:bg-amber-400 selection:text-black">
      
      {/* Dynamic Starlight & Particle Waves */}
      <TimeLockAtmosphere themeColor="#f59e0b" />

      {/* Floating Animated Reaction Badges */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="absolute animate-float-up transition-all flex items-center justify-center p-2 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917]"
            style={{ left: `${r.x - 16}px`, top: `${r.y - 16}px` }}
          >
            {r.type === 'confetti' && <PartyPopper className="w-5 h-5 text-amber-600" />}
            {r.type === 'heart' && <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />}
            {r.type === 'spark' && <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />}
            {r.type === 'toast' && <Wine className="w-5 h-5 text-amber-700" />}
          </div>
        ))}
      </div>

      {/* 1. Swiss Architectural Top Navigation */}
      <nav className="h-16 border-b-2 border-[#1c1917] bg-white px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50 w-full">
        <BrandLogo size="md" />

        <div className="flex items-center gap-3">
          {/* Audio Soundscape Toggle */}
          <button
            onClick={toggleAtmosphericAudio}
            className={`px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-[#1c1917] flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none ${
              isAudioActive
                ? 'bg-amber-400 text-[#1c1917]'
                : 'bg-white hover:bg-[#eeeae0] text-[#1c1917]'
            }`}
            title="Toggle atmospheric soundscape"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#1c1917]" />
                <span>[ AUDIO: ON ]</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-600" />
                <span>[ SOUNDSCAPE ]</span>
              </>
            )}
          </button>

          {/* Calendar Reminder Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCalendarMenuOpen(!calendarMenuOpen)}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1c1917]" />
              <span>[ REMIND ME ]</span>
              <ChevronDown className="w-3 h-3 text-[#1c1917]" />
            </button>

            {calendarMenuOpen && (
              <div
                className="absolute right-0 top-11 w-52 bg-white border-2 border-[#1c1917] p-1.5 flex flex-col gap-1 z-50 shadow-[4px_4px_0px_#1c1917] animate-in fade-in zoom-in-95 duration-100 text-left"
                onClick={() => setCalendarMenuOpen(false)}
              >
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-left font-mono text-xs font-bold uppercase hover:bg-amber-100 text-[#1c1917] flex items-center justify-between border border-transparent hover:border-[#1c1917] transition-all"
                >
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                </a>

                <button
                  onClick={() => downloadIcsFile(recipientName, unlockDateTime)}
                  className="px-3 py-2 text-left font-mono text-xs font-bold uppercase hover:bg-amber-100 text-[#1c1917] flex items-center justify-between border border-transparent hover:border-[#1c1917] transition-all cursor-pointer"
                >
                  <span>Apple / Outlook (iCal)</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-700" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 2. Main Center Stage */}
      <main className="relative z-10 my-auto py-8 px-4 flex flex-col items-center max-w-2xl w-full">
        
        {/* Architectural Locked Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] mb-3">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span className="font-mono text-xs text-[#1c1917] uppercase tracking-wider font-bold">
            [ TIME-LOCKED CELEBRATION DISPATCH ]
          </span>
        </div>

        {/* Recipient Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#1c1917] leading-none">
          FOR <span className="bg-amber-400 text-[#1c1917] px-3 py-1 border-2 border-[#1c1917] inline-block shadow-[4px_4px_0px_#1c1917] mt-1 ml-1">{recipientName}</span>
        </h1>

        <p className="mt-4 font-mono text-xs sm:text-sm uppercase tracking-wide text-zinc-800 max-w-lg leading-relaxed font-semibold border-y-2 border-[#1c1917]/20 py-2">
          A personalized celebration has been sealed inside this vault. Unlocks automatically at zero-hour.
        </p>

        {/* 3. COUNTDOWN MATRIX (4 Uniform Swiss White Cards) */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-lg mt-6 mb-3">
          {/* Days */}
          <div className="bg-white border-2 border-[#1c1917] p-3 sm:p-4 flex flex-col items-center shadow-[4px_4px_0px_#1c1917] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <span className="font-mono text-3xl sm:text-5xl font-black text-[#1c1917] tracking-tighter leading-none">
              {pad(timeLeft.days)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#1c1917] px-2 py-0.5 bg-amber-200 border border-[#1c1917] mt-2">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="bg-white border-2 border-[#1c1917] p-3 sm:p-4 flex flex-col items-center shadow-[4px_4px_0px_#1c1917] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <span className="font-mono text-3xl sm:text-5xl font-black text-[#1c1917] tracking-tighter leading-none">
              {pad(timeLeft.hours)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#1c1917] px-2 py-0.5 bg-amber-200 border border-[#1c1917] mt-2">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-white border-2 border-[#1c1917] p-3 sm:p-4 flex flex-col items-center shadow-[4px_4px_0px_#1c1917] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <span className="font-mono text-3xl sm:text-5xl font-black text-[#1c1917] tracking-tighter leading-none">
              {pad(timeLeft.minutes)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#1c1917] px-2 py-0.5 bg-amber-200 border border-[#1c1917] mt-2">
              MINUTES
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-white border-2 border-[#1c1917] p-3 sm:p-4 flex flex-col items-center shadow-[4px_4px_0px_#1c1917] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all">
            <span className="font-mono text-3xl sm:text-5xl font-black text-amber-600 tracking-tighter leading-none">
              {pad(timeLeft.seconds)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#1c1917] px-2 py-0.5 bg-amber-400 border border-[#1c1917] mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1c1917] animate-pulse" />
              <span>SECONDS</span>
            </span>
          </div>
        </div>

        {/* 4. 3D Swiss Architectural Interactive Vault */}
        <div className="my-2">
          <Vault3DCore
            themeColor="#f59e0b"
            onInteract={() => {
              playCrystalChime();
              setSparkCount((p) => p + 1);
            }}
          />
        </div>

        {/* 5. Interactive Pre-Celebration Reaction Station */}
        <div className="flex flex-col items-center gap-2 mt-1 max-w-md w-full">
          <span className="font-mono text-[10px] text-zinc-700 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>[ TRANSMIT PRE-CELEBRATION ENERGY ]</span>
          </span>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            {/* Confetti */}
            <button
              onClick={(e) => triggerReaction('confetti', e)}
              className="px-3.5 py-2 bg-white hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:shadow-none font-mono text-xs font-bold text-[#1c1917] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <PartyPopper className="w-4 h-4 text-amber-600" />
              <span>[ CONFETTI ]</span>
            </button>

            {/* Heart */}
            <button
              onClick={(e) => triggerReaction('heart', e)}
              className="px-3.5 py-2 bg-white hover:bg-rose-100 active:translate-x-[1px] active:translate-y-[1px] border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:shadow-none font-mono text-xs font-bold text-[#1c1917] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Heart className="w-4 h-4 text-rose-600 fill-rose-600/30" />
              <span>[ WISH LOVE ]</span>
            </button>

            {/* Spark */}
            <button
              onClick={(e) => triggerReaction('spark', e)}
              className="px-3.5 py-2 bg-white hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:shadow-none font-mono text-xs font-bold text-[#1c1917] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Flame className="w-4 h-4 text-amber-500" />
              <span>[ SPARKLE ]</span>
            </button>

            {/* Toast */}
            <button
              onClick={(e) => triggerReaction('toast', e)}
              className="px-3.5 py-2 bg-white hover:bg-amber-100 active:translate-x-[1px] active:translate-y-[1px] border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:shadow-none font-mono text-xs font-bold text-[#1c1917] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Wine className="w-4 h-4 text-amber-700" />
              <span>[ TOAST ]</span>
            </button>
          </div>

          <span className="font-mono text-[9px] text-zinc-600 uppercase font-bold tracking-wider mt-0.5">
            &gt;&gt; {sparkCount} CELEBRATION SPARKS TRANSMITTED
          </span>
        </div>

        {/* 6. Interactive Celebration Arcade (Piano & Speed Typing) */}
        <TimeLockArcade />

        {/* 7. Zero-Hour Schedule Footnote */}
        <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-zinc-700 uppercase font-bold border-y-2 border-[#1c1917]/20 py-2 px-4 bg-white/60">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>ZERO-HOUR: <strong className="text-[#1c1917] font-black ml-1">{formattedDate}</strong></span>
        </div>
      </main>

      {/* 8. Swiss Architectural Bottom Strip */}
      <footer className="w-full border-t-2 border-[#1c1917] bg-white py-3 px-6 sm:px-12 flex items-center justify-between text-xs font-mono text-zinc-700 uppercase font-bold">
        <span>[ ENCRYPTED CELEBRATION CAPSULE ]</span>
        <span className="text-amber-800 font-black">[ AUTOMATIC UNSEAL ON EXPIRY ]</span>
      </footer>
    </div>
  );
};

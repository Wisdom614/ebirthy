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
  ChevronDown
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { TimeLockAtmosphere } from './TimeLockAtmosphere';
import { Vault3DCore } from './Vault3DCore';
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorNodesRef = useRef<{ osc1?: OscillatorNode; osc2?: OscillatorNode; gain?: GainNode }>({});

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

  const startAtmosphericSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.connect(ctx.destination);

      // Celestial harmonic drone
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
        audioContextRef.current?.close();
        audioContextRef.current = null;
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

  const pad = (n: number) => String(n).padStart(2, '0');

  const formattedDate = unlockDateTime
    ? new Date(unlockDateTime).toLocaleString(undefined, {
        dateStyle: 'full',
        timeStyle: 'medium'
      })
    : 'Upcoming Zero-Hour';

  const googleCalUrl = generateGoogleCalendarUrl(recipientName, unlockDateTime);

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col items-center justify-between p-4 sm:p-8 text-center select-none relative overflow-hidden font-sans">
      {/* 1. Ambient Dynamic Starlight & Particle Nebula Canvas */}
      <TimeLockAtmosphere themeColor="#f59e0b" />

      {/* Deep Obsidian Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.6)_0%,rgba(6,9,17,0.95)_70%)] pointer-events-none" />

      {/* 2. Top Minimalist Control Bar */}
      <header className="relative z-20 w-full max-w-4xl flex items-center justify-between border-b border-white/10 pb-4 pt-1">
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
            title="Toggle atmospheric audio"
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
      <main className="relative z-10 my-auto py-8 flex flex-col items-center max-w-2xl w-full">
        
        {/* Subtle Luxury Lock Status Line */}
        <div className="inline-flex items-center gap-2 mb-3">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px] sm:text-xs text-amber-300/90 uppercase tracking-[0.25em] font-semibold">
            LOCKED TIME CAPSULE
          </span>
        </div>

        {/* Recipient Headline */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] leading-tight">
          FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">{recipientName}</span>
        </h1>

        <p className="mt-2 font-mono text-xs sm:text-sm text-zinc-400 uppercase tracking-wider font-medium max-w-md">
          A personalized celebration has been sealed inside. It will automatically unlock when zero-hour arrives.
        </p>

        {/* 3D Radiant Gold Vault Core */}
        <div className="my-3">
          <Vault3DCore themeColor="#f59e0b" />
        </div>

        {/* 4. Luxury Dark Glass Countdown Matrix */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-lg mt-2">
          {/* Days */}
          <div className="bg-[#0c1220]/80 border border-amber-500/25 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {pad(timeLeft.days)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1.5">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="bg-[#0c1220]/80 border border-amber-500/25 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {pad(timeLeft.hours)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1.5">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-[#0c1220]/80 border border-amber-500/25 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter drop-shadow-md">
              {pad(timeLeft.minutes)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1.5">
              MINUTES
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-[#0c1220]/80 border border-amber-400/40 rounded-lg p-3 sm:p-4 flex flex-col items-center shadow-[0_4px_25px_rgba(245,158,11,0.15)] backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-amber-300 tracking-tighter drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              {pad(timeLeft.seconds)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] text-amber-400 mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>SECONDS</span>
            </span>
          </div>
        </div>

        {/* Unlock Target Timestamp Footnote */}
        <div className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] sm:text-xs text-zinc-400 uppercase font-medium">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>ZERO-HOUR: <strong className="text-zinc-200 font-bold ml-1">{formattedDate}</strong></span>
        </div>
      </main>

      {/* 5. Bottom Status Strip */}
      <footer className="relative z-20 w-full max-w-4xl border-t border-white/10 pt-4 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
        <span>ENCRYPTED CELEBRATION CAPSULE</span>
        <span className="text-amber-400/80 font-medium">AUTOMATIC UNSEAL ON EXPIRY</span>
      </footer>
    </div>
  );
};


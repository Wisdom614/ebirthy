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
  Radio,
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
  themeBackgroundClass = 'bg-[#0f141c]',
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
    <div
      className={`min-h-screen ${themeBackgroundClass} bg-gradient-to-b from-[#0a0f18] via-[#0f172a] to-[#0a0e17] flex flex-col items-center justify-between p-4 sm:p-8 text-center select-none relative overflow-hidden text-white font-sans`}
    >
      {/* 1. Ambient Dynamic Particle Nebula Canvas */}
      <TimeLockAtmosphere themeColor="#f59e0b" />

      {/* 2. Top Sleek Ambient Control Bar */}
      <header className="relative z-20 w-full max-w-4xl flex items-center justify-between border-b border-amber-400/20 pb-4 pt-2">
        <BrandLogo size="sm" showSubtitle={true} href="" variant="gold" />

        <div className="flex items-center gap-2">
          {/* Audio Soundscape Toggle */}
          <button
            onClick={toggleAtmosphericAudio}
            className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase border border-amber-400/40 rounded-none flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
              isAudioActive
                ? 'bg-amber-400 text-zinc-950 border-amber-400'
                : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800'
            }`}
            title="Toggle atmospheric suspense drone"
          >
            {isAudioActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-zinc-950" />
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-zinc-950 animate-pulse" />
                  <span className="w-1 h-2 bg-zinc-950 animate-pulse delay-75" />
                  <span className="w-1 h-3.5 bg-zinc-950 animate-pulse delay-150" />
                </span>
                <span>AUDIO [ ON ]</span>
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
              className="px-3 py-1.5 bg-zinc-900/80 hover:bg-zinc-800 text-amber-300 border border-amber-400/40 font-mono text-[10px] font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>REMIND ME</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {calendarMenuOpen && (
              <div
                className="absolute right-0 top-10 w-52 bg-[#121826] border-2 border-amber-400 p-2 flex flex-col gap-1 z-50 shadow-[4px_4px_0px_#f59e0b] animate-in fade-in zoom-in-95 duration-100 text-left"
                onClick={() => setCalendarMenuOpen(false)}
              >
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-2 text-left font-mono text-xs font-bold uppercase hover:bg-amber-400/20 text-zinc-200 hover:text-white flex items-center justify-between"
                >
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </a>

                <button
                  onClick={() => downloadIcsFile(recipientName, unlockDateTime)}
                  className="px-2.5 py-2 text-left font-mono text-xs font-bold uppercase hover:bg-amber-400/20 text-zinc-200 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Apple / Outlook (iCal)</span>
                  <Calendar className="w-3 h-3 text-amber-400" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 3. Main Center Stage: 3D Holographic Vault & Countdown Matrix */}
      <main className="relative z-10 my-auto py-6 flex flex-col items-center max-w-2xl w-full">
        
        {/* Status Security Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-400/10 border border-amber-400/50 backdrop-blur-md font-mono text-[10px] sm:text-[11px] uppercase font-bold tracking-widest text-amber-300 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>[ VAULT STATUS: SEALED · UNLOCKS AUTOMATICALLY ]</span>
        </div>

        {/* Recipient Headline */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] leading-none">
          FOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">{recipientName}</span>
        </h1>

        <p className="mt-2 font-mono text-xs sm:text-sm text-zinc-400 uppercase tracking-wider font-semibold max-w-md">
          A personalized celebration dispatch is sealed inside this cryptographic vault.
        </p>

        {/* 3D Interactive WebGL Vault Core */}
        <div className="my-2">
          <Vault3DCore themeColor="#f59e0b" />
        </div>

        {/* 4. Giant Mechanical Flip HUD Countdown Matrix */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full max-w-lg mt-2">
          {/* Days */}
          <div className="bg-[#131b2e]/90 border-2 border-amber-400/40 p-3 sm:p-4 flex flex-col items-center shadow-[0_0_15px_rgba(15,23,42,0.6)] backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-amber-400/60" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter">
              {pad(timeLeft.days)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-amber-400 mt-1">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="bg-[#131b2e]/90 border-2 border-amber-400/40 p-3 sm:p-4 flex flex-col items-center shadow-[0_0_15px_rgba(15,23,42,0.6)] backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-amber-400/60" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter">
              {pad(timeLeft.hours)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-amber-400 mt-1">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-[#131b2e]/90 border-2 border-amber-400/40 p-3 sm:p-4 flex flex-col items-center shadow-[0_0_15px_rgba(15,23,42,0.6)] backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-amber-400/60" />
            <span className="font-mono text-3xl sm:text-5xl font-black text-white tracking-tighter">
              {pad(timeLeft.minutes)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-amber-400 mt-1">
              MINUTES
            </span>
          </div>

          {/* Seconds (Pulsing Active Card) */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-amber-300 p-3 sm:p-4 flex flex-col items-center shadow-[0_0_20px_rgba(245,158,11,0.5)] text-zinc-950 font-black relative overflow-hidden animate-pulse">
            <span className="font-mono text-3xl sm:text-5xl font-black text-zinc-950 tracking-tighter">
              {pad(timeLeft.seconds)}
            </span>
            <span className="font-mono text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-zinc-900 mt-1">
              SECONDS
            </span>
          </div>
        </div>

        {/* Unlock Target Timestamp Footnote */}
        <div className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] text-zinc-400 uppercase font-semibold border-t border-amber-400/20 pt-3">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>ZERO-HOUR SCHEDULE: <strong className="text-white font-black">{formattedDate}</strong></span>
        </div>
      </main>

      {/* 5. Bottom Status Strip */}
      <footer className="relative z-20 w-full max-w-4xl border-t border-amber-400/20 pt-3 flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">
        <span>SECURITY ENCRYPTION: 256-BIT CELEBRATION VAULT</span>
        <span className="text-amber-400/80">AUTOMATIC UNSEAL ON EXPIRY</span>
      </footer>
    </div>
  );
};

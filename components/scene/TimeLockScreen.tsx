'use client';

import React, { useState, useEffect } from 'react';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { Lock, Clock, Sparkles } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface TimeLockScreenProps {
  recipientName: string;
  unlockDateTime: string;
  onUnlock: () => void;
  themeBackgroundClass?: string;
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
  themeBackgroundClass = 'bg-[#f7f4ed]'
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(unlockDateTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(unlockDateTime);
      setTimeLeft(remaining);

      if (remaining.totalMs <= 0) {
        clearInterval(timer);
        audio.playSFX('horn');
        audio.playSFX('sparkle');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onUnlock();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDateTime, onUnlock]);

  const pad = (n: number) => String(n).padStart(2, '0');

  const formattedDate = unlockDateTime
    ? new Date(unlockDateTime).toLocaleString(undefined, {
        dateStyle: 'full',
        timeStyle: 'medium'
      })
    : 'Midnight Today';

  return (
    <div
      className={`min-h-screen ${themeBackgroundClass} flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden text-[#1c1917]`}
    >
      <div className="relative z-10 max-w-lg w-full bg-white border-2 border-[#1c1917] p-6 sm:p-10 shadow-[10px_10px_0px_#1c1917] flex flex-col items-center animate-in zoom-in-95 duration-200">
        {/* Brand Logo Header */}
        <div className="mb-4">
          <BrandLogo size="md" showSubtitle={true} href="" />
        </div>

        {/* Top Lock Icon Badge */}
        <div className="w-14 h-14 bg-amber-400 border-2 border-[#1c1917] text-[#1c1917] flex items-center justify-center shadow-[3px_3px_0px_#1c1917] mb-4">
          <Lock className="w-7 h-7" />
        </div>

        {/* Security / Status Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f7f4ed] border-2 border-[#1c1917] font-mono text-[10px] uppercase font-bold tracking-widest text-[#1c1917] mb-4 shadow-[2px_2px_0px_#1c1917]">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>[ STATUS: TIME-LOCKED · DISPATCH CLASSIFIED ]</span>
        </div>

        {/* Recipient Title */}
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1c1917]">
          FOR {recipientName}
        </h1>

        <p className="mt-3 font-mono text-xs text-zinc-600 uppercase leading-relaxed font-semibold max-w-sm">
          A personalized celebration scene has been sealed. The vault opens automatically when the countdown reaches zero.
        </p>

        {/* Segmented Digital Clock Display */}
        <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-3 w-full">
          {/* Days */}
          <div className="bg-[#f7f4ed] border-2 border-[#1c1917] p-3 flex flex-col items-center shadow-[3px_3px_0px_#1c1917]">
            <span className="font-mono text-2xl sm:text-4xl font-black text-[#1c1917] tracking-tighter">
              {pad(timeLeft.days)}
            </span>
            <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-zinc-500 mt-1">
              DAYS
            </span>
          </div>

          {/* Hours */}
          <div className="bg-[#f7f4ed] border-2 border-[#1c1917] p-3 flex flex-col items-center shadow-[3px_3px_0px_#1c1917]">
            <span className="font-mono text-2xl sm:text-4xl font-black text-[#1c1917] tracking-tighter">
              {pad(timeLeft.hours)}
            </span>
            <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-zinc-500 mt-1">
              HOURS
            </span>
          </div>

          {/* Minutes */}
          <div className="bg-[#f7f4ed] border-2 border-[#1c1917] p-3 flex flex-col items-center shadow-[3px_3px_0px_#1c1917]">
            <span className="font-mono text-2xl sm:text-4xl font-black text-[#1c1917] tracking-tighter">
              {pad(timeLeft.minutes)}
            </span>
            <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-zinc-500 mt-1">
              MIN
            </span>
          </div>

          {/* Seconds */}
          <div className="bg-amber-400 border-2 border-[#1c1917] p-3 flex flex-col items-center shadow-[3px_3px_0px_#1c1917] animate-pulse">
            <span className="font-mono text-2xl sm:text-4xl font-black text-[#1c1917] tracking-tighter">
              {pad(timeLeft.seconds)}
            </span>
            <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-[#1c1917] mt-1">
              SEC
            </span>
          </div>
        </div>

        {/* Target Time Footnote */}
        <div className="mt-6 pt-4 border-t-2 border-[#1c1917]/20 w-full flex items-center justify-center gap-1.5 font-mono text-[10px] text-zinc-600 uppercase font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>UNLOCKS AUTOMATICALLY: {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

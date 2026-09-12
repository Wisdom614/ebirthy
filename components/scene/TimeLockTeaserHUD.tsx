'use client';

import React, { useState, useEffect } from 'react';
import { PhotoMemory } from '../../types/scene';
import { calculateLifeChronicle } from '../../utils/chronicleCalculator';
import { audio } from '../../utils/audioManager';
import {
  Eye,
  Camera,
  Orbit,
  Shield,
  User,
  Layers,
  Scan
} from 'lucide-react';

interface TimeLockTeaserHUDProps {
  recipientName: string;
  senderName?: string;
  relationship?: string;
  age?: number;
  birthDate?: string;
  photos?: PhotoMemory[];
  giftPhotoUrl?: string;
  unlockDateTime?: string;
}

export const TimeLockTeaserHUD: React.FC<TimeLockTeaserHUDProps> = ({
  recipientName,
  senderName,
  relationship,
  age,
  birthDate,
  photos = [],
  giftPhotoUrl,
  unlockDateTime
}) => {
  // Collect all available preview image URLs
  const availableImages: { url: string; caption?: string }[] = [];
  if (photos && photos.length > 0) {
    photos.forEach((p) => {
      if (p.url) availableImages.push({ url: p.url, caption: p.caption });
    });
  }
  if (giftPhotoUrl && !availableImages.some((i) => i.url === giftPhotoUrl)) {
    availableImages.push({ url: giftPhotoUrl, caption: 'Special Vault Surprise' });
  }

  const hasPhotos = availableImages.length > 0;

  // Mode: 'peek' (showing picture for 5s) | 'intel' (showing statistics)
  const [mode, setMode] = useState<'peek' | 'intel'>(hasPhotos ? 'peek' : 'intel');
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [peekCountdown, setPeekCountdown] = useState(5);
  const [intelTab, setIntelTab] = useState(0);

  // Life Chronicle stats calculation
  const chronicle = calculateLifeChronicle(birthDate);
  const effectiveAge = age || (chronicle.isValid ? chronicle.totalYears : undefined);

  // Initial and recurring photo flash timer
  useEffect(() => {
    if (!hasPhotos) {
      setMode('intel');
      return;
    }

    let peekTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;
    let autoFlashTimer: NodeJS.Timeout;

    if (mode === 'peek') {
      setPeekCountdown(5);
      countdownInterval = setInterval(() => {
        setPeekCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);

      peekTimer = setTimeout(() => {
        setMode('intel');
        audio.playSFX('pop');
      }, 5000);
    } else {
      // While in intel mode, auto-trigger a brief 5s sneak peek every 14 seconds
      autoFlashTimer = setTimeout(() => {
        setActivePhotoIdx((prev) => (prev + 1) % availableImages.length);
        setMode('peek');
        audio.playSFX('sparkle');
      }, 14000);
    }

    return () => {
      clearTimeout(peekTimer);
      clearInterval(countdownInterval);
      clearTimeout(autoFlashTimer);
    };
  }, [mode, hasPhotos, availableImages.length]);

  // Rotate intel facts every 4.5 seconds when in intel mode
  useEffect(() => {
    if (mode !== 'intel') return;
    const interval = setInterval(() => {
      setIntelTab((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [mode]);

  const triggerManualPeek = () => {
    if (!hasPhotos) return;
    setActivePhotoIdx((prev) => (prev + 1) % availableImages.length);
    setMode('peek');
    audio.playSFX('sparkle');
  };

  const currentPhoto = availableImages[activePhotoIdx];

  return (
    <div className="w-full max-w-lg mx-auto my-3 text-[#1c1917] select-none">
      {mode === 'peek' && hasPhotos && currentPhoto ? (
        /* SNEAK PEEK FLASH CARD (5s Duration) */
        <div className="bg-white border-2 border-[#1c1917] p-4 sm:p-5 shadow-[4px_4px_0px_#1c1917] flex flex-col items-center animate-in zoom-in-95 duration-200">
          
          {/* Top Status Strip */}
          <div className="w-full flex items-center justify-between border-b-2 border-[#1c1917] pb-2 mb-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase text-amber-700">
              <Eye className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>[ SNEAK PEEK FLASH ]</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-black bg-amber-300 px-2 py-0.5 border border-[#1c1917] text-[#1c1917]">
                RESEALING IN {peekCountdown}s
              </span>
              <button
                onClick={() => setMode('intel')}
                className="font-mono text-[10px] text-zinc-600 hover:text-black font-bold uppercase underline cursor-pointer"
              >
                Skip
              </button>
            </div>
          </div>

          {/* Photo Frame */}
          <div className="relative w-full max-w-[320px] aspect-4/3 bg-[#f7f4ed] border-2 border-[#1c1917] overflow-hidden shadow-[2px_2px_0px_#1c1917]">
            {/* Corner Precision Targets */}
            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#1c1917] z-20 pointer-events-none" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#1c1917] z-20 pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#1c1917] z-20 pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#1c1917] z-20 pointer-events-none" />

            {/* Radar / Scan Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent pointer-events-none animate-pulse" />

            <img
              src={currentPhoto.url}
              alt="Celebration Sneak Peek"
              className="w-full h-full object-cover"
            />

            {/* Micro Badge */}
            <div className="absolute bottom-2 right-2 bg-white/95 border border-[#1c1917] px-2 py-0.5 font-mono text-[9px] font-black uppercase text-[#1c1917] shadow-xs">
              Memory {activePhotoIdx + 1}/{availableImages.length}
            </div>
          </div>

          {/* Caption if provided */}
          {currentPhoto.caption && (
            <div className="mt-2.5 font-mono text-xs font-bold text-zinc-800 uppercase tracking-wide bg-[#f7f4ed] border border-[#1c1917] px-3 py-1 text-center max-w-[320px] truncate">
              &quot;{currentPhoto.caption}&quot;
            </div>
          )}

          {/* 5-Second Linear Progress Bar */}
          <div className="w-full max-w-[320px] h-1.5 bg-[#eeeae0] border border-[#1c1917] mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(peekCountdown / 5) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        /* VAULT INTEL & TELEMETRY MATRIX (When sealed or rotated) */
        <div className="bg-white border-2 border-[#1c1917] p-4 sm:p-5 shadow-[4px_4px_0px_#1c1917] flex flex-col items-center">
          
          {/* Header Strip */}
          <div className="w-full flex items-center justify-between border-b-2 border-[#1c1917] pb-2.5 mb-3">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase text-[#1c1917]">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>[ VAULT TELEMETRY &amp; INTEL ]</span>
            </div>

            {hasPhotos && (
              <button
                onClick={triggerManualPeek}
                className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-[9px] font-black uppercase flex items-center gap-1 shadow-[1px_1px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                <Camera className="w-3 h-3 text-[#1c1917]" />
                <span>FLASH SNEAK PEEK</span>
              </button>
            )}
          </div>

          {/* Dynamic Intel Carousel Views */}
          <div className="w-full bg-[#f7f4ed] border-2 border-[#1c1917] p-3.5 shadow-[2px_2px_0px_#1c1917] min-h-[92px] flex flex-col justify-center text-left">
            {intelTab === 0 ? (
              /* Telemetry 1: Solar Orbit Milestone */
              <div className="flex items-center gap-3 animate-in fade-in duration-200">
                <div className="w-9 h-9 bg-amber-400 border-2 border-[#1c1917] flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#1c1917]">
                  <Orbit className="w-4 h-4 text-[#1c1917]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    SOLAR JOURNEY MILESTONE
                  </span>
                  <span className="font-mono text-xs font-black text-[#1c1917] uppercase">
                    {effectiveAge
                      ? `${effectiveAge} SOLAR ORBITS COMPLETED`
                      : `CELEBRATING ${recipientName.toUpperCase()}`}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-600 font-semibold mt-0.5">
                    {chronicle.isValid
                      ? `${chronicle.totalDays.toLocaleString()} days of remarkable memories`
                      : 'Preparing the ultimate birthday unlock'}
                  </span>
                </div>
              </div>
            ) : intelTab === 1 ? (
              /* Telemetry 2: Encrypted Vault Contents */
              <div className="flex items-center gap-3 animate-in fade-in duration-200">
                <div className="w-9 h-9 bg-white border-2 border-[#1c1917] flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#1c1917]">
                  <Layers className="w-4 h-4 text-[#1c1917]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    VAULT MANIFEST
                  </span>
                  <span className="font-mono text-xs font-black text-[#1c1917] uppercase">
                    {photos.length > 0
                      ? `${photos.length} ARCHIVED MEMORIES SEALED`
                      : 'CUSTOM MULTIMEDIA CELEBRATION'}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-600 font-semibold mt-0.5">
                    1 Personal Letter · Interactive Cake &amp; Candle Ceremony
                  </span>
                </div>
              </div>
            ) : (
              /* Telemetry 3: Dispatch Transmission Origin */
              <div className="flex items-center gap-3 animate-in fade-in duration-200">
                <div className="w-9 h-9 bg-amber-400 border-2 border-[#1c1917] flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_#1c1917]">
                  <User className="w-4 h-4 text-[#1c1917]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    DISPATCH TRANSMITTER
                  </span>
                  <span className="font-mono text-xs font-black text-[#1c1917] uppercase">
                    FROM {senderName ? senderName.toUpperCase() : 'YOUR SPECIAL CIRCLE'}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-600 font-semibold mt-0.5">
                    {relationship
                      ? `Affiliation: ${relationship}`
                      : 'Encrypted under 256-bit celebration protocol'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-between w-full mt-3 px-1">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setIntelTab(idx)}
                  className={`w-2.5 h-2.5 border border-[#1c1917] transition-all cursor-pointer ${
                    intelTab === idx ? 'bg-amber-400' : 'bg-white hover:bg-zinc-200'
                  }`}
                  title={`View Intel ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[9px] text-zinc-500 font-bold uppercase">
              <Scan className="w-3 h-3 text-amber-600" />
              <span>AUTO-ROTATING INTEL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

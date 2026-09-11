'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SceneConfig } from '../../types/scene';
import { THEME_DEFINITIONS } from '../../utils/presets';
import { audio } from '../../utils/audioManager';
import { InteractiveCake } from './InteractiveCake';
import { FloatingBalloons } from './FloatingBalloons';
import { SurpriseGiftBox } from './SurpriseGiftBox';
import { FireworksCanvas } from './FireworksCanvas';
import { PolaroidReel } from './PolaroidReel';
import { CinematicLetter } from './CinematicLetter';
import { SoundController } from './SoundController';
import { PartyPopper, Share2 } from 'lucide-react';

interface CelebrationCanvasProps {
  scene: SceneConfig;
  previewMode?: boolean;
  onShareClick?: () => void;
}

export const CelebrationCanvas: React.FC<CelebrationCanvasProps> = ({
  scene,
  previewMode = false,
  onShareClick
}) => {
  const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;
  const [activeTab, setActiveTab] = useState<'all' | 'cake' | 'gift' | 'letter' | 'photos'>('all');

  const triggerConfettiCannon = () => {
    audio.playSFX('horn');
    audio.playSFX('cheer');

    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.8 },
      colors: theme.particlesColor
    });
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.8 },
      colors: theme.particlesColor
    });
  };

  return (
    <div
      className={`relative w-full min-h-screen overflow-x-hidden ${theme.backgroundClass} flex flex-col items-center justify-start select-none transition-colors duration-300`}
    >
      {/* Background Interactive Fireworks */}
      {scene.enableFireworks && (
        <FireworksCanvas colors={theme.particlesColor} interactive={!previewMode} />
      )}

      {/* Floating Balloons */}
      {scene.enableBalloons && (
        <FloatingBalloons
          count={scene.balloonCount}
          colors={scene.balloonColors}
          interactive={!previewMode}
        />
      )}

      {/* Top Action Bar */}
      <div className="w-full max-w-5xl px-4 pt-6 flex items-center justify-between z-30 border-b-2 border-[#1c1917]/20 pb-4 gap-2 flex-wrap">
        <button
          onClick={triggerConfettiCannon}
          className="px-4 py-2 bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#1c1917] hover:bg-amber-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-2"
        >
          <PartyPopper className="w-4 h-4" />
          <span>[ BLAST CANNON ]</span>
        </button>

        {/* Audio Manager (Inline Deck) */}
        <SoundController track={scene.musicTrack} autoPlay={scene.autoPlayCelebration} />

        {onShareClick && (
          <button
            onClick={onShareClick}
            className="px-4 py-2 bg-white text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#1c1917] hover:bg-[#eeeae0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>[ SHARE SCENE ]</span>
          </button>
        )}
      </div>

      {/* Swiss Hero Celebration Banner */}
      <div className="relative z-20 w-full max-w-4xl px-4 pt-10 pb-6 text-center flex flex-col items-center">
        
        {/* Technical Metadata Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#1c1917] font-mono text-[10px] uppercase font-bold tracking-widest text-[#1c1917] mb-6 shadow-[2px_2px_0px_#1c1917]">
          <span>[ EDITION // {scene.age ? `${scene.age}_YEARS` : 'SPECIAL_MILESTONE'} ]</span>
          {scene.relationship && (
            <>
              <span className="text-zinc-400">/</span>
              <span className="text-amber-700 font-extrabold">{scene.relationship.toUpperCase()}</span>
            </>
          )}
        </div>

        {/* Main Recipient Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tighter text-[#1c1917]">
          HAPPY BIRTHDAY, <br className="hidden sm:inline" />
          <span className="text-[#1c1917] bg-amber-400 px-3 py-0.5 border-2 border-[#1c1917] inline-block mt-2 shadow-[4px_4px_0px_#1c1917]">
            {scene.recipientName}
          </span>
        </h1>

        {/* Headline Quote */}
        {scene.headline && (
          <p className="mt-6 text-base sm:text-lg font-mono font-bold uppercase tracking-wide text-[#1c1917] max-w-2xl border-y-2 border-[#1c1917]/30 py-3">
            {scene.headline}
          </p>
        )}

        {/* Wishes Quote */}
        {scene.wishes && (
          <p className="mt-4 text-sm sm:text-base text-stone-800 font-bold max-w-xl leading-relaxed font-sans">
            "{scene.wishes}"
          </p>
        )}
      </div>

      {/* Straight Navigation Sub-Tabs */}
      <div className="relative z-30 flex items-center justify-center gap-2 my-6 px-4 flex-wrap border-y-2 border-[#1c1917]/20 py-3 w-full max-w-4xl">
        {[
          { id: 'all', label: '[ FULL EXPERIENCE ]' },
          scene.enableCake ? { id: 'cake', label: '[ CAKE & CANDLES ]' } : null,
          scene.enableGift ? { id: 'gift', label: '[ SECRET PARCEL ]' } : null,
          scene.letterText ? { id: 'letter', label: '[ PERSONAL MEMO ]' } : null,
          scene.enablePhotoReel && scene.photos.length > 0 ? { id: 'photos', label: '[ ARCHIVE REEL ]' } : null
        ]
          .filter(Boolean)
          .map(tab => (
            <button
              key={tab!.id}
              onClick={() => setActiveTab(tab!.id as unknown as typeof activeTab)}
              className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer border-2 ${
                activeTab === tab!.id
                  ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[3px_3px_0px_#1c1917]'
                  : 'bg-white text-[#1c1917] border-[#1c1917] hover:bg-[#eeeae0] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
              }`}
            >
              {tab!.label}
            </button>
          ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-20 w-full max-w-4xl px-4 pb-20 flex flex-col items-center gap-10">
        
        {/* Cake Section */}
        {scene.enableCake && (activeTab === 'all' || activeTab === 'cake') && (
          <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
            <InteractiveCake
              candleCount={scene.candleCount}
              flavor={scene.cakeFlavor}
              recipientName={scene.recipientName}
              onAllCandlesBlown={triggerConfettiCannon}
            />
          </div>
        )}

        {/* Gift Section */}
        {scene.enableGift && (activeTab === 'all' || activeTab === 'gift') && (
          <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
            <SurpriseGiftBox
              content={scene.giftContent}
              primaryColor={scene.primaryColor}
              secondaryColor={scene.secondaryColor}
            />
          </div>
        )}

        {/* Photo Reel Section */}
        {scene.enablePhotoReel && scene.photos.length > 0 && (activeTab === 'all' || activeTab === 'photos') && (
          <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
            <PolaroidReel photos={scene.photos} themeAccent={scene.primaryColor} />
          </div>
        )}

        {/* Letter Section */}
        {scene.letterText && (activeTab === 'all' || activeTab === 'letter') && (
          <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
            <CinematicLetter
              senderName={scene.senderName}
              recipientName={scene.recipientName}
              letterText={scene.letterText}
              fontStyle={scene.fontStyle}
            />
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="w-full py-6 text-center font-mono text-[10px] uppercase tracking-widest text-[#1c1917] font-bold border-t-2 border-[#1c1917]/20 relative z-20">
        BIRTHDAY SCENE STUDIO // SWISS EDITORIAL SYSTEM // 2026
      </div>
    </div>
  );
};

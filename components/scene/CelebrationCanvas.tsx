'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { SceneConfig } from '../../types/scene';
import { THEME_DEFINITIONS } from '../../utils/presets';
import { audio } from '../../utils/audioManager';
import { InteractiveCake } from './InteractiveCake';
import { FloatingBalloons } from './FloatingBalloons';
import { SurpriseGiftBox } from './SurpriseGiftBox';
import { FireworksCanvas } from './FireworksCanvas';
import { PolaroidReel } from './PolaroidReel';
import { SoundController } from './SoundController';
import { KeepsakePosterModal } from './KeepsakePosterModal';
import { PartyPopper, Share2, Image as ImageIcon } from 'lucide-react';

const CinematicLetter = dynamic(
  () => import('./CinematicLetter').then((m) => m.CinematicLetter),
  { ssr: false }
);
const GuestbookWall = dynamic(
  () => import('./GuestbookWall').then((m) => m.GuestbookWall),
  { ssr: false }
);

interface CelebrationCanvasProps {
  scene: SceneConfig;
  previewMode?: boolean;
  onShareClick?: () => void;
  slug?: string;
}

export const CelebrationCanvas: React.FC<CelebrationCanvasProps> = ({
  scene,
  previewMode = false,
  onShareClick,
  slug
}) => {
  const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;
  const [activeTab, setActiveTab] = useState<'all' | 'cake' | 'gift' | 'letter' | 'photos' | 'guestbook' | 'poster'>('all');
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

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

        <div className="flex items-center gap-2">
          {/* High-Visibility Keepsake Poster Button */}
          <button
            onClick={() => setIsPosterModalOpen(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
            title="Download commemorative keepsake poster"
          >
            <ImageIcon className="w-4 h-4 text-[#1c1917]" />
            <span>[ KEEPSAKE POSTER ]</span>
          </button>

          {onShareClick && (
            <button
              onClick={onShareClick}
              className="px-4 py-2 bg-white text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#1c1917] hover:bg-[#eeeae0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>[ SHARE ]</span>
            </button>
          )}
        </div>
      </div>

      {/* Swiss Hero Celebration Banner */}
      <div className="relative z-20 w-full max-w-4xl px-4 pt-10 pb-6 text-center flex flex-col items-center">
        
        {/* Technical Metadata Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#1c1917] font-mono text-[10px] uppercase font-bold tracking-widest text-[#1c1917] mb-6 shadow-[2px_2px_0px_#1c1917]">
          <span>[ EDITION · {scene.age ? `${scene.age}_YEARS` : 'SPECIAL_MILESTONE'} ]</span>
          {scene.relationship && (
            <>
              <span className="text-zinc-400">·</span>
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
          scene.enablePhotoReel && scene.photos.length > 0 ? { id: 'photos', label: '[ ARCHIVE REEL ]' } : null,
          scene.enableGuestbook !== false ? { id: 'guestbook', label: '[ WISHES BOARD ]' } : null,
          { id: 'poster', label: '[ POSTER EXPORT ]' }
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
        
        {/* Dedicated Commemorative Keepsake Poster Showcase Plate */}
        {(activeTab === 'all' || activeTab === 'poster') && (
          <div className="w-full bg-[#fefcf8] border-4 border-[#1c1917] p-6 sm:p-8 shadow-[8px_8px_0px_#1c1917] flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="flex-1 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-amber-400 border-2 border-[#1c1917] font-mono text-[10px] font-black uppercase tracking-widest text-[#1c1917] mb-2 shadow-[2px_2px_0px_#1c1917]">
                <PartyPopper className="w-3 h-3" />
                <span>OFFICIAL COMMEMORATIVE KEEPSAKE · 300 DPI</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1c1917]">
                YOUR BIRTHDAY POSTER IS READY
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-zinc-700 font-medium font-sans leading-relaxed">
                Download a studio-grade, high-resolution 300 DPI keepsake poster customized with your edition milestone, photograph plate, and personal headline to print or frame.
              </p>
            </div>

            <button
              onClick={() => setIsPosterModalOpen(true)}
              className="w-full md:w-auto px-6 py-4 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-black text-sm uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2.5 flex-shrink-0 cursor-pointer"
            >
              <ImageIcon className="w-5 h-5 text-[#1c1917]" />
              <span>[ GET PRINTABLE POSTER ]</span>
            </button>
          </div>
        )}

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
        {(scene.letterText || scene.voiceNoteUrl) && (activeTab === 'all' || activeTab === 'letter') && (
          <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
            <CinematicLetter
              senderName={scene.senderName}
              recipientName={scene.recipientName}
              letterText={scene.letterText || ''}
              fontStyle={scene.fontStyle}
              voiceNoteUrl={scene.voiceNoteUrl}
              voiceNoteDuration={scene.voiceNoteDuration}
            />
          </div>
        )}

        {/* Community Wishes Guestbook Section */}
        {scene.enableGuestbook !== false && (activeTab === 'all' || activeTab === 'guestbook') && (
          <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
            <GuestbookWall
              sceneSlug={slug || scene.id || scene.recipientName?.toLowerCase().replace(/\s+/g, '-') || 'celebrate'}
              recipientName={scene.recipientName}
              themeAccent={scene.primaryColor}
            />
          </div>
        )}
      </div>

      {/* Floating High-Visibility Keepsake Poster Quick Badge */}
      <button
        onClick={() => setIsPosterModalOpen(true)}
        className="fixed bottom-6 right-4 sm:right-6 z-40 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-2"
        title="Download high-resolution 300 DPI keepsake poster"
      >
        <ImageIcon className="w-4 h-4 text-[#1c1917]" />
        <span>[ KEEPSAKE POSTER ]</span>
      </button>

      {/* Footer Branding */}
      <div className="w-full py-6 text-center font-mono text-[10px] uppercase tracking-widest text-[#1c1917] font-bold border-t-2 border-[#1c1917]/20 relative z-20">
        BIRTHDAY SCENE STUDIO · SWISS EDITORIAL SYSTEM · 2026
      </div>

      {/* Keepsake Commemorative Poster Modal */}
      <KeepsakePosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        scene={scene}
        slug={slug}
      />
    </div>
  );
};

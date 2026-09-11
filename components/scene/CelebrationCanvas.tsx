'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import confetti from 'canvas-confetti';
import { SceneConfig } from '../../types/scene';
import { THEME_DEFINITIONS } from '../../utils/presets';
import { audio } from '../../utils/audioManager';
import { startTenSecondGrandCelebration } from '../../utils/celebrationEffects';
import { InteractiveCake } from './InteractiveCake';
import { FloatingBalloons } from './FloatingBalloons';
import { SurpriseGiftBox } from './SurpriseGiftBox';
import { FireworksCanvas } from './FireworksCanvas';
import { PolaroidReel } from './PolaroidReel';
import { SoundController } from './SoundController';
import { KeepsakePosterModal } from './KeepsakePosterModal';
import { LifeChronometer } from './LifeChronometer';
import { BrandLogo } from '../ui/BrandLogo';
import { formatBirthDayMonth } from '../../utils/dateFormatter';
import {
  PartyPopper,
  Share2,
  Image as ImageIcon,
  Cake,
  Gift,
  Mail,
  Camera,
  MessageSquareHeart,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  Compass,
  CheckCircle2,
  Sparkles,
  Flame,
  Star
} from 'lucide-react';

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

type StageId = 'cake' | 'gift' | 'letter' | 'photos' | 'guestbook' | 'poster';

export const CelebrationCanvas: React.FC<CelebrationCanvasProps> = ({
  scene,
  previewMode = false,
  onShareClick,
  slug
}) => {
  const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;
  
  // Available interactive stages based on scene configuration
  const availableStages = React.useMemo(() => {
    const list: Array<{ id: StageId; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }> = [];
    if (scene.enableCake) list.push({ id: 'cake', title: 'CANDLES & CAKE', subtitle: 'BLOW CANDLES', icon: Cake });
    if (scene.enableGift) list.push({ id: 'gift', title: 'SECRET PARCEL', subtitle: 'UNSEAL SURPRISE', icon: Gift });
    if (scene.letterText || scene.voiceNoteUrl) list.push({ id: 'letter', title: 'CINEMATIC MEMO', subtitle: 'LETTER & AUDIO', icon: Mail });
    if (scene.enablePhotoReel && scene.photos && scene.photos.length > 0) list.push({ id: 'photos', title: 'MEMORY REEL', subtitle: 'PHOTO GALLERY', icon: Camera });
    if (scene.enableGuestbook !== false) list.push({ id: 'guestbook', title: 'WISHES BOARD', subtitle: 'GUESTBOOK WALL', icon: MessageSquareHeart });
    list.push({ id: 'poster', title: 'KEEPSAKE POSTER', subtitle: '300 DPI PRINT', icon: ImageIcon });
    return list;
  }, [scene]);

  const [viewMode, setViewMode] = useState<'story' | 'exhibition'>('exhibition');
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<Record<string, boolean>>({});
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);

  const activeStage = availableStages[currentStageIndex] || availableStages[0];

  const markStageCompleted = (stageId: StageId) => {
    if (!completedStages[stageId]) {
      setCompletedStages((prev) => ({ ...prev, [stageId]: true }));
      audio.playSFX('sparkle');
    }
  };

  const goToNextStage = () => {
    if (currentStageIndex < availableStages.length - 1) {
      audio.playSFX('chime');
      setCurrentStageIndex((prev) => prev + 1);
    }
  };

  const goToPrevStage = () => {
    if (currentStageIndex > 0) {
      audio.playSFX('unwrap');
      setCurrentStageIndex((prev) => prev - 1);
    }
  };

  const triggerConfettiCannon = () => {
    startTenSecondGrandCelebration(theme.particlesColor);
  };

  const triggerReactionCheer = () => {
    audio.playSFX('sparkle');
    audio.playSFX('cheer');
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981']
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

      {/* Sticky Top Architectural Navigation & Control Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#f7f4ed]/95 backdrop-blur-sm border-b-2 border-[#1c1917]/20 shadow-sm transition-all">
        <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          {/* Left: Brand Logo (compact on mobile) */}
          <div className="flex-shrink-0">
            <BrandLogo size="sm" showSubtitle={false} href="/" />
          </div>

          {/* Center: Sound Controller */}
          <div className="flex-shrink-0">
            <SoundController track={scene.musicTrack} autoPlay={scene.autoPlayCelebration} />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Confetti Blaster */}
            <button
              onClick={triggerConfettiCannon}
              className="px-2.5 sm:px-3 py-1.5 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] sm:text-xs font-bold uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer hidden md:flex items-center gap-1.5"
              title="Trigger Confetti Cannon"
            >
              <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
              <span>[ CANNON ]</span>
            </button>

            {/* Keepsake Poster Button */}
            <button
              onClick={() => {
                setIsPosterModalOpen(true);
                markStageCompleted('poster');
              }}
              className="px-2.5 sm:px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
              title="Download commemorative keepsake poster"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">[ POSTER ]</span>
              <span className="sm:hidden">POSTER</span>
            </button>

            {onShareClick && (
              <button
                onClick={onShareClick}
                className="px-2.5 sm:px-3 py-1.5 bg-white text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] sm:text-xs font-bold uppercase shadow-[2px_2px_0px_#1c1917] hover:bg-[#eeeae0] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                title="Share Celebration Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">[ SHARE ]</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Swiss Hero Celebration Spotlight */}
      <section className="relative z-20 w-full max-w-4xl px-4 pt-8 pb-4 text-center flex flex-col items-center">
        {/* Technical Dispatch Metadata */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#1c1917] font-mono text-[10px] uppercase font-bold tracking-widest text-[#1c1917] mb-5 shadow-[2px_2px_0px_#1c1917] flex-wrap justify-center">
          <span>[ CELEBRATION DISPATCH ]</span>
          {scene.birthDate && (
            <>
              <span className="text-zinc-400">·</span>
              <span className="text-amber-700 font-extrabold bg-amber-100 px-1.5 py-0.5 border border-amber-300">
                DATE: {formatBirthDayMonth(scene.birthDate)}
              </span>
            </>
          )}
          {scene.relationship && (
            <>
              <span className="text-zinc-400">·</span>
              <span className="text-amber-700 font-extrabold">{scene.relationship.toUpperCase()}</span>
            </>
          )}
        </div>

        {/* Main Recipient Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-[#1c1917] leading-[0.98]">
          HAPPY BIRTHDAY, <br className="hidden sm:inline" />
          <span className="text-[#1c1917] bg-amber-400 px-3 py-0.5 border-2 border-[#1c1917] inline-block mt-2 shadow-[4px_4px_0px_#1c1917]">
            {scene.recipientName}
          </span>
        </h1>

        {/* Headline Slogan */}
        {scene.headline && (
          <p className="mt-5 text-sm sm:text-base font-mono font-bold uppercase tracking-wide text-[#1c1917] max-w-2xl border-y-2 border-[#1c1917]/30 py-2.5">
            {scene.headline}
          </p>
        )}

        {/* Wishes Quote */}
        {scene.wishes && (
          <p className="mt-4 text-xs sm:text-sm text-stone-800 font-semibold max-w-xl leading-relaxed font-sans">
            "{scene.wishes}"
          </p>
        )}

        {/* Interactive Quick Cheers Ribbon */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={triggerReactionCheer}
            className="px-3 py-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>[ CHEERS ]</span>
          </button>
          <button
            onClick={triggerConfettiCannon}
            className="px-3 py-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] font-bold uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3 h-3 text-orange-600" />
            <span>[ BLAST CONFETTI ]</span>
          </button>
          <button
            onClick={() => {
              setIsPosterModalOpen(true);
              markStageCompleted('poster');
            }}
            className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] font-black uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Star className="w-3 h-3 text-[#1c1917]" />
            <span>[ GET 300 DPI POSTER ]</span>
          </button>
        </div>
      </section>

      {/* Real-Time Life Chronometer Milestone Section */}
      {scene.birthDate && (
        <LifeChronometer
          birthDate={scene.birthDate}
          recipientName={scene.recipientName}
        />
      )}

      {/* View Mode & Milestone Tracker Control Bar */}
      <section className="relative z-30 w-full max-w-4xl px-4 my-6">
        <div className="bg-white border-2 border-[#1c1917] p-3 shadow-[4px_4px_0px_#1c1917] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Milestone Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-amber-700">
              [ CELEBRATION PROGRESS ]
            </span>
            <div className="flex items-center gap-1">
              {availableStages.map((stg, idx) => (
                <div
                  key={stg.id}
                  title={stg.title}
                  className={`w-4 h-4 border border-[#1c1917] flex items-center justify-center font-mono text-[9px] font-bold ${
                    completedStages[stg.id]
                      ? 'bg-amber-400 text-[#1c1917]'
                      : idx === currentStageIndex && viewMode === 'story'
                      ? 'bg-zinc-800 text-white animate-pulse'
                      : 'bg-[#eeeae0] text-zinc-500'
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
            <span className="font-mono text-[10px] text-zinc-600 font-bold uppercase ml-1">
              {Object.keys(completedStages).length}/{availableStages.length} UNLOCKED
            </span>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center gap-1 bg-[#eeeae0] p-1 border border-[#1c1917]">
            <button
              onClick={() => {
                setViewMode('story');
                audio.playSFX('unwrap');
              }}
              className={`px-2.5 py-1 font-mono text-[10px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'story'
                  ? 'bg-amber-400 text-[#1c1917] border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>[ GUIDED STORY ]</span>
            </button>
            <button
              onClick={() => {
                setViewMode('exhibition');
                audio.playSFX('unwrap');
              }}
              className={`px-2.5 py-1 font-mono text-[10px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'exhibition'
                  ? 'bg-amber-400 text-[#1c1917] border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              <span>[ ALL EXHIBITS ]</span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN STAGE CONTENT */}
      {viewMode === 'story' ? (
        /* GUIDED STORY MODE (Interactive Theater) */
        <section className="relative z-20 w-full max-w-4xl px-4 pb-24 flex flex-col items-center">
          
          {/* Stage Sequence Navigation Header */}
          <div className="w-full flex items-center justify-between gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
            {availableStages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = idx === currentStageIndex;
              const isDone = completedStages[stage.id];

              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    setCurrentStageIndex(idx);
                    audio.playSFX('chime');
                  }}
                  className={`flex-1 min-w-[105px] sm:min-w-[130px] p-2 sm:p-2.5 border-2 text-left transition-all cursor-pointer relative flex-shrink-0 ${
                    isActive
                      ? 'bg-white border-[#1c1917] shadow-[3px_3px_0px_#1c1917] sm:shadow-[4px_4px_0px_#1c1917] translate-y-[-2px]'
                      : isDone
                      ? 'bg-[#f7f4ed] border-[#1c1917]/60 hover:border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                      : 'bg-white/80 border-[#1c1917]/40 hover:border-[#1c1917]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] font-black text-amber-700 uppercase">
                      0{idx + 1}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 text-zinc-600" />
                    )}
                  </div>
                  <div className="font-mono text-[11px] font-black uppercase text-[#1c1917] truncate mt-1">
                    {stage.title}
                  </div>
                  <div className="font-mono text-[8px] text-zinc-500 uppercase truncate">
                    {stage.subtitle}
                  </div>
                  {isActive && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-400 border border-[#1c1917] rotate-45" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Stage Interactive Showcase Card */}
          <div className="w-full bg-white border-4 border-[#1c1917] p-4 sm:p-8 shadow-[8px_8px_0px_#1c1917] relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Top Registration Corner Marks */}
            <span className="absolute top-2 left-2 font-mono text-zinc-400 text-xs select-none">+</span>
            <span className="absolute top-2 right-2 font-mono text-zinc-400 text-xs select-none">+</span>
            <span className="absolute bottom-2 left-2 font-mono text-zinc-400 text-xs select-none">+</span>
            <span className="absolute bottom-2 right-2 font-mono text-zinc-400 text-xs select-none">+</span>

            {/* Stage Title Bar */}
            <div className="border-b-2 border-[#1c1917] pb-3 mb-6 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400 border border-[#1c1917]" />
                <span className="font-mono text-xs font-black uppercase tracking-widest text-[#1c1917]">
                  [ STAGE 0{currentStageIndex + 1} // {activeStage.title} ]
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 border border-amber-400">
                {completedStages[activeStage.id] ? '[ STATUS: COMPLETED ]' : '[ STATUS: INTERACTIVE ]'}
              </span>
            </div>

            {/* Stage Body */}
            <div className="py-2">
              {activeStage.id === 'cake' && scene.enableCake && (
                <InteractiveCake
                  candleCount={scene.candleCount}
                  flavor={scene.cakeFlavor}
                  recipientName={scene.recipientName}
                  onAllCandlesBlown={() => {
                    markStageCompleted('cake');
                    triggerConfettiCannon();
                  }}
                />
              )}

              {activeStage.id === 'gift' && scene.enableGift && (
                <div onClick={() => markStageCompleted('gift')}>
                  <SurpriseGiftBox
                    content={scene.giftContent}
                    primaryColor={scene.primaryColor}
                    secondaryColor={scene.secondaryColor}
                  />
                </div>
              )}

              {activeStage.id === 'letter' && (scene.letterText || scene.voiceNoteUrl) && (
                <div onClick={() => markStageCompleted('letter')}>
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

              {activeStage.id === 'photos' && scene.enablePhotoReel && scene.photos.length > 0 && (
                <div onClick={() => markStageCompleted('photos')}>
                  <PolaroidReel photos={scene.photos} themeAccent={scene.primaryColor} />
                </div>
              )}

              {activeStage.id === 'guestbook' && scene.enableGuestbook !== false && (
                <div onClick={() => markStageCompleted('guestbook')}>
                  <GuestbookWall
                    sceneSlug={slug || scene.id || scene.recipientName?.toLowerCase().replace(/\s+/g, '-') || 'celebrate'}
                    recipientName={scene.recipientName}
                    themeAccent={scene.primaryColor}
                  />
                </div>
              )}

              {activeStage.id === 'poster' && (
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 p-4 sm:p-6 bg-[#f7f4ed] border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917]">
                  <div className="flex-1 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-400 border border-[#1c1917] font-mono text-[9px] font-black uppercase text-[#1c1917] mb-2">
                      <ImageIcon className="w-3 h-3" />
                      <span>COMMEMORATIVE KEEPSAKE ARCHIVE</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-[#1c1917] tracking-tight">
                      PRINTABLE KEEPSAKE POSTER
                    </h3>
                    <p className="mt-2 text-xs text-zinc-700 font-medium leading-relaxed font-sans">
                      A personalized 300 DPI high-resolution commemorative poster with your photos, celebration milestone, and personal wishes.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsPosterModalOpen(true);
                      markStageCompleted('poster');
                    }}
                    className="w-full md:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-black text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>[ OPEN POSTER EXPORTER ]</span>
                  </button>
                </div>
              )}
            </div>

            {/* Stage Pagination Controls */}
            <div className="mt-8 pt-4 border-t-2 border-[#1c1917] flex items-center justify-between gap-3">
              <button
                onClick={goToPrevStage}
                disabled={currentStageIndex === 0}
                className="px-4 py-2.5 bg-white hover:bg-[#eeeae0] disabled:opacity-40 disabled:hover:bg-white text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>[ PREVIOUS ]</span>
              </button>

              <span className="font-mono text-xs font-black uppercase text-[#1c1917]">
                STAGE {currentStageIndex + 1} OF {availableStages.length}
              </span>

              {currentStageIndex < availableStages.length - 1 ? (
                <button
                  onClick={goToNextStage}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono text-xs font-black uppercase border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>[ NEXT SURPRISE ]</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsPosterModalOpen(true);
                    markStageCompleted('poster');
                  }}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono text-xs font-black uppercase border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>[ EXPORT POSTER ]</span>
                  <ImageIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* EXHIBITION GRID MODE (All Sections Visible) */
        <section className="relative z-20 w-full max-w-4xl px-4 pb-24 flex flex-col items-center gap-8 animate-in fade-in duration-200">
          
          {/* Commemorative Keepsake Poster Showcase Plate */}
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
              onClick={() => {
                setIsPosterModalOpen(true);
                markStageCompleted('poster');
              }}
              className="w-full md:w-auto px-6 py-4 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-black text-sm uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2.5 flex-shrink-0 cursor-pointer"
            >
              <ImageIcon className="w-5 h-5 text-[#1c1917]" />
              <span>[ GET PRINTABLE POSTER ]</span>
            </button>
          </div>

          {/* Cake Section */}
          {scene.enableCake && (
            <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
              <div className="w-full border-b-2 border-[#1c1917] pb-2 mb-4 flex items-center justify-between font-mono text-xs font-bold uppercase text-[#1c1917]">
                <span>[ EXHIBIT 01 · CAKE & CANDLES ]</span>
                <span className="text-amber-700">BLOW TO MAKE A WISH</span>
              </div>
              <InteractiveCake
                candleCount={scene.candleCount}
                flavor={scene.cakeFlavor}
                recipientName={scene.recipientName}
                onAllCandlesBlown={() => {
                  markStageCompleted('cake');
                  triggerConfettiCannon();
                }}
              />
            </div>
          )}

          {/* Gift Section */}
          {scene.enableGift && (
            <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
              <div className="w-full border-b-2 border-[#1c1917] pb-2 mb-4 flex items-center justify-between font-mono text-xs font-bold uppercase text-[#1c1917]">
                <span>[ EXHIBIT 02 · SECRET PARCEL ]</span>
                <span className="text-amber-700">TAP TO UNSEAL</span>
              </div>
              <SurpriseGiftBox
                content={scene.giftContent}
                primaryColor={scene.primaryColor}
                secondaryColor={scene.secondaryColor}
              />
            </div>
          )}

          {/* Photo Reel Section */}
          {scene.enablePhotoReel && scene.photos.length > 0 && (
            <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
              <div className="w-full border-b-2 border-[#1c1917] pb-2 mb-4 flex items-center justify-between font-mono text-xs font-bold uppercase text-[#1c1917]">
                <span>[ EXHIBIT 03 · MEMORY ARCHIVE ]</span>
                <span className="text-amber-700">{scene.photos.length} PHOTOGRAPHS</span>
              </div>
              <PolaroidReel photos={scene.photos} themeAccent={scene.primaryColor} />
            </div>
          )}

          {/* Letter Section */}
          {(scene.letterText || scene.voiceNoteUrl) && (
            <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
              <div className="w-full border-b-2 border-[#1c1917] pb-2 mb-4 flex items-center justify-between font-mono text-xs font-bold uppercase text-[#1c1917]">
                <span>[ EXHIBIT 04 · PERSONAL MEMO & AUDIO ]</span>
                <span className="text-amber-700">FROM {scene.senderName || 'A CLOSE FRIEND'}</span>
              </div>
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
          {scene.enableGuestbook !== false && (
            <div className="w-full flex flex-col items-center border-2 border-[#1c1917] p-6 bg-white shadow-[4px_4px_0px_#1c1917]">
              <div className="w-full border-b-2 border-[#1c1917] pb-2 mb-4 flex items-center justify-between font-mono text-xs font-bold uppercase text-[#1c1917]">
                <span>[ EXHIBIT 05 · WISHES & REACTIONS ]</span>
                <span className="text-amber-700">COMMUNITY BOARD</span>
              </div>
              <GuestbookWall
                sceneSlug={slug || scene.id || scene.recipientName?.toLowerCase().replace(/\s+/g, '-') || 'celebrate'}
                recipientName={scene.recipientName}
                themeAccent={scene.primaryColor}
              />
            </div>
          )}
        </section>
      )}

      {/* Floating High-Visibility Keepsake Poster Quick Badge */}
      <button
        onClick={() => {
          setIsPosterModalOpen(true);
          markStageCompleted('poster');
        }}
        className="fixed bottom-5 right-4 sm:right-6 z-40 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-2"
        title="Download high-resolution 300 DPI keepsake poster"
      >
        <ImageIcon className="w-4 h-4 text-[#1c1917]" />
        <span>[ KEEPSAKE POSTER ]</span>
      </button>

      {/* Footer Branding */}
      <footer className="w-full py-6 text-center font-mono text-[10px] uppercase tracking-widest text-[#1c1917] font-bold border-t-2 border-[#1c1917]/20 relative z-20 flex flex-col items-center gap-2">
        <BrandLogo size="sm" showSubtitle={false} href="/" />
        <span className="text-zinc-500">
          BIRTHDAY SCENE STUDIO · SWISS EDITORIAL SYSTEM · 2026
        </span>
      </footer>

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

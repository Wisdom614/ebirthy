'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SceneConfig } from '../../types/scene';
import { DEFAULT_SCENE, THEME_DEFINITIONS } from '../../utils/presets';
import { decodeScene } from '../../utils/sceneEncoder';
import { fetchSceneById } from '../../utils/supabase/db';
import { CelebrationCanvas } from '../../components/scene/CelebrationCanvas';
import { ShareModal } from '../../components/studio/ShareModal';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Wand2, Loader2 } from 'lucide-react';
import Link from 'next/link';

function CelebrateContent() {
  const searchParams = useSearchParams();
  const [scene, setScene] = useState<SceneConfig>(DEFAULT_SCENE);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const c = searchParams.get('c');
    const data = searchParams.get('data');
    const id = searchParams.get('id');

    if (c || data) {
      const decoded = decodeScene(c || data || '');
      setScene(decoded);
      setLoading(false);
    } else if (id) {
      fetchSceneById(id).then((record) => {
        if (record && record.config) {
          setScene(record.config);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleStartCelebration = () => {
    setHasStarted(true);

    audio.playMusic(scene.musicTrack);
    audio.playSFX('horn');
    audio.playSFX('cheer');

    const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: theme.particlesColor
    });
  };

  const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex flex-col items-center justify-center gap-3 font-mono text-xs uppercase">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <span>[ LOADING CELEBRATION DATA... ]</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] relative flex flex-col">
      {!hasStarted ? (
        /* Grand Architectural Entrance Screen */
        <div
          className={`min-h-screen ${theme.backgroundClass} flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden`}
        >
          {/* Card */}
          <div className="relative z-10 max-w-md w-full bg-white border-2 border-[#1c1917] p-8 shadow-[8px_8px_0px_#1c1917] flex flex-col items-center animate-in zoom-in-95 duration-200 text-[#1c1917]">
            <div className="w-14 h-14 bg-amber-400 border-2 border-[#1c1917] text-[#1c1917] flex items-center justify-center shadow-[3px_3px_0px_#1c1917] mb-6">
              <Sparkles className="w-7 h-7" />
            </div>

            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-2">
              [ SPECIAL BIRTHDAY DISPATCH ]
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#1c1917]">
              FOR {scene.recipientName}
            </h1>

            <p className="mt-3 font-mono text-xs text-zinc-600 uppercase leading-relaxed font-semibold">
              AN INTERACTIVE CELEBRATION SCENE HAS BEEN PREPARED EXCLUSIVELY FOR YOU.
            </p>

            {/* Start Celebration Button */}
            <button
              onClick={handleStartCelebration}
              className="mt-8 w-full py-4 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-black text-sm uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>[ LAUNCH CELEBRATION ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="mt-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              &gt;&gt; AUDIO SYSTEM READY // TURN ON SOUND
            </span>
          </div>

          <div className="mt-8 z-10">
            <Link
              href="/studio"
              className="font-mono text-xs text-zinc-600 hover:text-black uppercase tracking-wider transition-colors flex items-center gap-1.5 font-bold"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600" />
              <span>[ CREATE A SCENE FOR SOMEONE ELSE ]</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Full Live Celebration Canvas */
        <div className="flex-1 flex flex-col">
          <CelebrationCanvas
            scene={scene}
            onShareClick={() => setIsShareOpen(true)}
          />

          {/* Floating Remix Button */}
          <div className="fixed bottom-6 right-6 z-40">
            <Link
              href={`/studio?${searchParams.toString()}`}
              className="px-4 py-2.5 bg-white hover:bg-[#eeeae0] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-amber-600" />
              <span>[ CUSTOMIZE / REMIX ]</span>
            </Link>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        scene={scene}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}

export default function CelebratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex items-center justify-center font-mono text-xs uppercase">[ LOADING CELEBRATION... ]</div>}>
      <CelebrateContent />
    </Suspense>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSceneById } from '../../../utils/supabase/db';
import { CelebrationCanvas } from '../../../components/scene/CelebrationCanvas';
import { ShareModal } from '../../../components/studio/ShareModal';
import { TimeLockScreen } from '../../../components/scene/TimeLockScreen';
import { THEME_DEFINITIONS } from '../../../utils/presets';
import { SceneConfig } from '../../../types/scene';
import { audio } from '../../../utils/audioManager';
import { startTenSecondGrandCelebration } from '../../../utils/celebrationEffects';
import confetti from 'canvas-confetti';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import { Sparkles, ArrowRight, Wand2, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ShortLinkCelebratePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [scene, setScene] = useState<SceneConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isTimeLocked, setIsTimeLocked] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetchSceneById(slug)
      .then((record) => {
        if (record && record.config) {
          setScene(record.config);
          setLoading(false);
        } else {
          // Check local client cache
          try {
            const cached = localStorage.getItem(`ebirthy_scene_${slug}`);
            if (cached) {
              setScene(JSON.parse(cached));
              setLoading(false);
              return;
            }
          } catch {}
          setError('Celebration scene not found or link has expired.');
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Supabase fetch failed, checking local cache:', err);
        try {
          const cached = localStorage.getItem(`ebirthy_scene_${slug}`);
          if (cached) {
            setScene(JSON.parse(cached));
            setLoading(false);
            return;
          }
        } catch {}
        setError('Failed to load celebration data.');
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (scene?.enableTimeLock && scene?.unlockDateTime) {
      const isLocked = new Date() < new Date(scene.unlockDateTime);
      setIsTimeLocked(isLocked);
    }
  }, [scene]);

  const handleStartCelebration = () => {
    if (!scene) return;
    setHasStarted(true);

    audio.playMusic(scene.musicTrack);

    const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;
    startTenSecondGrandCelebration(theme.particlesColor);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex flex-col items-center justify-center gap-3 font-mono text-xs uppercase">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
        <span>[ RETRIEVING DISPATCH · {slug} ]</span>
      </div>
    );
  }

  if (error || !scene) {
    return (
      <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white border-2 border-[#1c1917] p-8 shadow-[8px_8px_0px_#1c1917]">
          <div className="w-12 h-12 bg-rose-500 border-2 border-[#1c1917] text-white flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1c1917]">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="font-mono font-bold text-lg uppercase text-[#1c1917]">DISPATCH NOT FOUND</h2>
          <p className="font-mono text-xs text-zinc-600 mt-2">
            The link "{slug}" could not be located in database.
          </p>
          <Link
            href="/studio"
            className="mt-6 inline-flex px-4 py-2.5 bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] font-mono font-bold text-xs uppercase shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            [ CREATE NEW SCENE ]
          </Link>
        </div>
      </div>
    );
  }

  const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;

  if (isTimeLocked && scene.unlockDateTime) {
    return (
      <TimeLockScreen
        recipientName={scene.recipientName}
        unlockDateTime={scene.unlockDateTime}
        onUnlock={() => setIsTimeLocked(false)}
        themeBackgroundClass={theme.backgroundClass}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] relative flex flex-col">
      {!hasStarted ? (
        /* Entrance Screen */
        <div
          className={`min-h-screen ${theme.backgroundClass} flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden`}
        >
          <div className="relative z-10 max-w-md w-full bg-white border-2 border-[#1c1917] p-8 shadow-[8px_8px_0px_#1c1917] flex flex-col items-center animate-in zoom-in-95 duration-200 text-[#1c1917]">
            {/* Custom Brand Logo Mark */}
            <div className="mb-6">
              <BrandLogo size="lg" showSubtitle={true} href="" />
            </div>

            <div className="flex items-center gap-1.5 mb-2 flex-wrap justify-center">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-700 font-bold">
                [ SPECIAL BIRTHDAY DISPATCH ]
              </span>
              {scene.birthDate && (
                <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  BORN {new Date(scene.birthDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#1c1917]">
              FOR {scene.recipientName}
            </h1>

            <p className="mt-3 font-mono text-xs text-zinc-600 uppercase leading-relaxed font-semibold">
              AN INTERACTIVE CELEBRATION SCENE HAS BEEN PREPARED EXCLUSIVELY FOR YOU.
            </p>

            <button
              onClick={handleStartCelebration}
              className="mt-8 w-full py-4 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-black text-sm uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>[ LAUNCH CELEBRATION ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="mt-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              &gt;&gt; AUDIO SYSTEM READY · TURN ON SOUND
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
            slug={slug}
            onShareClick={() => setIsShareOpen(true)}
          />

          {/* Floating Remix Button */}
          <div className="fixed bottom-6 right-6 z-40">
            <Link
              href={`/studio?id=${slug}`}
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
        slug={slug}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}

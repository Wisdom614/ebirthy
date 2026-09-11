'use client';

import React from 'react';
import Link from 'next/link';
import { PRESET_TEMPLATES, THEME_DEFINITIONS } from '../utils/presets';
import { encodeScene } from '../utils/sceneEncoder';
import { audio } from '../utils/audioManager';
import confetti from 'canvas-confetti';
import { BrandLogo } from '../components/ui/BrandLogo';
import {
  Wand2,
  Play,
  PartyPopper,
  ArrowRight,
  Scroll,
  Compass,
  Leaf,
  Zap,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const handleConfettiBlast = () => {
    audio.playSFX('horn');
    audio.playSFX('cheer');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const renderPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'scroll':
        return <Scroll className="w-4 h-4 text-amber-800" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-rose-700" />;
      case 'leaf':
        return <Leaf className="w-4 h-4 text-emerald-800" />;
      case 'zap':
        return <Zap className="w-4 h-4 text-blue-700" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-700" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Swiss Architectural Top Navigation */}
      <nav className="h-16 border-b-2 border-[#1c1917] bg-white px-6 sm:px-12 flex items-center justify-between sticky top-0 z-50">
        <BrandLogo size="md" />

        <div className="flex items-center gap-3">
          <button
            onClick={handleConfettiBlast}
            className="px-3 py-1.5 bg-white hover:bg-[#eeeae0] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs font-bold uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer hidden sm:flex items-center gap-1.5"
            title="Trigger Confetti Cannon"
          >
            <PartyPopper className="w-3.5 h-3.5 text-amber-600" />
            <span>[ TEST CANNON ]</span>
          </button>

          <Link
            href="/studio"
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono font-bold text-xs uppercase shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>[ CREATE SCENE ]</span>
          </Link>
        </div>
      </nav>

      {/* Hero Poster Section */}
      <section className="relative pt-16 pb-20 px-6 sm:px-12 flex flex-col items-center text-center overflow-hidden border-b-2 border-[#1c1917] bg-[#f7f4ed] grid-bg">
        
        {/* Header Metadata Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-[#1c1917] font-mono text-[10px] font-bold uppercase tracking-widest text-[#1c1917] mb-8 shadow-[2px_2px_0px_#1c1917]">
          <span>[ RELEASE · EDITION 2026 ]</span>
          <span className="text-zinc-400">·</span>
          <span>[ WARM LINEN & CHARCOAL INK ]</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black max-w-5xl tracking-tighter leading-[0.95] uppercase text-[#1c1917]">
          PRECISION CRAFTED <br />
          <span className="bg-amber-400 text-[#1c1917] px-3 py-1 border-2 border-[#1c1917] inline-block mt-2 shadow-[6px_6px_0px_#1c1917]">
            BIRTHDAY SCENES
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 font-mono text-xs sm:text-sm uppercase tracking-wide text-zinc-800 max-w-2xl leading-relaxed border-y-2 border-[#1c1917]/20 py-3 font-semibold">
          Design interactive celebration experiences with blowable cake candles, faceted physics balloons, classified unboxing parcels, and instant zero-friction share links.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10">
          <Link
            href="/studio"
            className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-black text-sm uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span>[ LAUNCH CREATOR STUDIO ]</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/celebrate"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#eeeae0] text-[#1c1917] font-mono font-bold text-sm uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-amber-600" />
            <span>[ EXPERIENCE LIVE DEMO ]</span>
          </Link>
        </div>

        {/* Feature Indices */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] font-bold uppercase text-zinc-700">
          <span className="px-2.5 py-1 bg-white border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]">[ 01: BLOWABLE CANDLES ]</span>
          <span className="px-2.5 py-1 bg-white border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]">[ 02: FACETED BALLOONS ]</span>
          <span className="px-2.5 py-1 bg-white border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]">[ 03: CLASSIFIED PARCEL ]</span>
          <span className="px-2.5 py-1 bg-white border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]">[ 04: PHOTO PLATES ]</span>
          <span className="px-2.5 py-1 bg-white border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]">[ 05: SYNTH AUDIO ENGINE ]</span>
        </div>
      </section>

      {/* Curated Templates Gallery */}
      <section className="py-20 px-6 sm:px-12 bg-[#eeeae0] border-b-2 border-[#1c1917]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b-2 border-[#1c1917] pb-4 mb-10 gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
                [ CATALOG ARCHIVE · CURATED PRESETS ]
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1c1917] tracking-tight">
                CELEBRATION SCENE TEMPLATES
              </h2>
            </div>
            <span className="font-mono text-xs text-zinc-600 uppercase font-semibold">
              SELECT TO PREVIEW OR CUSTOMIZE DIRECTLY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(PRESET_TEMPLATES).map(([key, template], idx) => {
              const theme = THEME_DEFINITIONS[template.config.theme];
              const encoded = encodeScene(template.config);

              return (
                <div
                  key={key}
                  className="bg-white border-2 border-[#1c1917] p-5 flex flex-col justify-between shadow-[4px_4px_0px_#1c1917] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#1c1917] transition-all group"
                >
                  <div>
                    {/* Header Strip */}
                    <div className={`h-20 -mx-5 -mt-5 ${theme.backgroundClass} p-3 flex items-center justify-between border-b-2 border-[#1c1917] mb-4`}>
                      <div className="w-8 h-8 bg-white border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] flex items-center justify-center">
                        {renderPresetIcon(template.iconName)}
                      </div>
                      <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-white text-[#1c1917] border border-[#1c1917] uppercase shadow-sm">
                        {template.tag}
                      </span>
                    </div>

                    <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold">PRESET 0{idx + 1}</span>
                    <h3 className="font-mono font-bold text-sm uppercase text-[#1c1917] mt-1 group-hover:text-amber-600 transition-colors">
                      {template.name}
                    </h3>
                    <p className="font-mono text-xs text-zinc-600 mt-2 line-clamp-3 leading-relaxed font-medium">
                      "{template.config.wishes}"
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t-2 border-[#1c1917]/20 flex items-center gap-2">
                    <Link
                      href={`/celebrate?data=${encoded}`}
                      className="flex-1 py-2 bg-[#f7f4ed] hover:bg-[#eeeae0] text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] flex items-center justify-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 text-amber-600" />
                      VIEW
                    </Link>
                    <Link
                      href={`/studio?data=${encoded}`}
                      className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1 transition-colors"
                    >
                      <Wand2 className="w-3 h-3" />
                      EDIT
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-6 sm:px-12 max-w-6xl mx-auto w-full">
        <div className="border-b-2 border-[#1c1917] pb-4 mb-10">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
            [ SYSTEM SPECIFICATIONS ]
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1c1917] tracking-tight">
            ENGINEERED WITH RIGOROUS PRECISION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917]">
            <span className="font-mono text-[10px] text-amber-700 font-bold uppercase block mb-2">[ 01 · AUDIO & SENSORS ]</span>
            <h3 className="font-mono font-bold text-base uppercase text-[#1c1917] mb-2">MIC BLOWING & CAKE</h3>
            <p className="font-mono text-xs text-zinc-600 leading-relaxed font-medium">
              Extinguish candles with real microphone breath detection or precision click triggers with simulated smoke physics and fanfare.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917]">
            <span className="font-mono text-[10px] text-amber-700 font-bold uppercase block mb-2">[ 02 · REVEAL PAYLOAD ]</span>
            <h3 className="font-mono font-bold text-base uppercase text-[#1c1917] mb-2">CLASSIFIED PARCEL</h3>
            <p className="font-mono text-xs text-zinc-600 leading-relaxed font-medium">
              3D interactive parcel with mechanical unboxing unsealing custom secret messages, promises, and VIP birthday voucher codes.
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917]">
            <span className="font-mono text-[10px] text-amber-700 font-bold uppercase block mb-2">[ 03 · PERSISTENCE ]</span>
            <h3 className="font-mono font-bold text-base uppercase text-[#1c1917] mb-2">CLOUD SYNC & VAULT</h3>
            <p className="font-mono text-xs text-zinc-600 leading-relaxed font-medium">
              Encrypted cloud persistence with real-time recipient view counters, creator accounts, and instant asset synchronization.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t-2 border-[#1c1917] bg-white py-12 px-6 sm:px-12 text-center flex flex-col items-center">
        <h3 className="text-xl sm:text-2xl font-black uppercase text-[#1c1917] tracking-tight">
          READY TO CONSTRUCT A CELEBRATION SCENE?
        </h3>
        <p className="font-mono text-xs text-zinc-600 mt-2 uppercase font-semibold">
          LAUNCH THE STUDIO WORKSPACE IN SECONDS. ZERO SETUP REQUIRED.
        </p>

        <Link
          href="/studio"
          className="mt-6 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <span>[ LAUNCH CREATOR STUDIO NOW ]</span>
        </Link>

        <span className="mt-8 font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
          BIRTHDAY SCENE STUDIO · INTERNATIONAL TYPOGRAPHIC SYSTEM · 2026
        </span>
      </footer>
    </div>
  );
}

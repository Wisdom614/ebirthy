'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PRESET_TEMPLATES, THEME_DEFINITIONS } from '../utils/presets';
import { encodeScene } from '../utils/sceneEncoder';
import { audio } from '../utils/audioManager';
import { formatBirthDayMonth } from '../utils/dateFormatter';
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
  Sparkles,
  Award
} from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleConfettiBlast = () => {
    audio.playSFX('horn');
    audio.playSFX('cheer');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const filteredPresets = Object.entries(PRESET_TEMPLATES).filter(([_, template]) => {
    if (activeCategory === 'all') return true;
    return template.category === activeCategory;
  });

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
      case 'award':
        return <Award className="w-4 h-4 text-amber-600" />;
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
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-2 border-[#1c1917] pb-4 mb-8 gap-4">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
                [ CATALOG ARCHIVE · 2026 CURATED EDITIONS ]
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#1c1917] tracking-tight">
                CELEBRATION SCENE SPECIMENS
              </h2>
            </div>
            <p className="font-mono text-xs text-zinc-600 uppercase font-semibold max-w-sm">
              SELECT ANY ARCHIVAL SPECIMEN TO INSTANTLY TEST-DRIVE OR CUSTOMIZE WITH YOUR RECIPIENT DETAILS.
            </p>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {[
              { id: 'all', label: `ALL EDITIONS (${Object.keys(PRESET_TEMPLATES).length})` },
              { id: 'friends', label: 'FRIENDS & BROTHER' },
              { id: 'romance', label: 'ROMANCE & PARTNER' },
              { id: 'family', label: 'FAMILY & SISTER' },
              { id: 'minimalist', label: 'MINIMALIST & EDITORIAL' }
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    audio.playSFX('sparkle');
                  }}
                  className={`px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-2 border-[#1c1917] cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-[#1c1917] shadow-[3px_3px_0px_#1c1917] translate-x-[-1px] translate-y-[-1px]'
                      : 'bg-white text-zinc-700 hover:bg-[#f7f4ed] shadow-[1px_1px_0px_#1c1917]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Specimen Cards Grid (3 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPresets.map(([key, template]) => {
              const theme = THEME_DEFINITIONS[template.config.theme] || THEME_DEFINITIONS.gold;

              return (
                <div
                  key={key}
                  className="bg-white border-2 border-[#1c1917] flex flex-col justify-between shadow-[4px_4px_0px_#1c1917] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#1c1917] transition-all group overflow-hidden"
                >
                  <div>
                    {/* Top Archival Header Bar */}
                    <div className="p-3 bg-[#f7f4ed] border-b-2 border-[#1c1917] flex items-center justify-between text-[9px] font-mono font-bold text-[#1c1917]">
                      <span className="text-zinc-600 uppercase tracking-wider">{template.specimenRef}</span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 border border-amber-400 uppercase">
                        {template.badge}
                      </span>
                    </div>

                    {/* Visual Mini-Simulation Header Plate */}
                    <div className={`p-4 ${theme.backgroundClass} border-b-2 border-[#1c1917] relative`}>
                      {/* Top Row: Icon and Color Swatches */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 bg-white border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] flex items-center justify-center">
                          {renderPresetIcon(template.iconName)}
                        </div>

                        {/* Palette Swatch Dots */}
                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 border border-[#1c1917] shadow-[1px_1px_0px_#1c1917]">
                          <span className="font-mono text-[8px] text-zinc-500 uppercase mr-0.5">PALETTE:</span>
                          {template.swatches.map((color, cIdx) => (
                            <span
                              key={cIdx}
                              className="w-3 h-3 rounded-full border border-[#1c1917]"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Mini Preview Mockup Card */}
                      <div className="bg-white border-2 border-[#1c1917] p-3 shadow-[2px_2px_0px_#1c1917]">
                        <div className="flex items-center justify-between font-mono text-[9px] font-bold text-zinc-500 border-b border-[#1c1917]/20 pb-1 mb-1.5">
                          <span>FOR: {template.config.recipientName.toUpperCase()}</span>
                          <span className="text-amber-700 bg-amber-100 px-1 border border-amber-300">
                            {template.config.birthDate ? formatBirthDayMonth(template.config.birthDate) : '13|05'}
                          </span>
                        </div>
                        <h4 className="font-black text-sm uppercase text-[#1c1917] leading-tight truncate">
                          HAPPY BIRTHDAY, {template.config.recipientName}!
                        </h4>
                        <p className="font-mono text-[9px] text-zinc-600 uppercase font-semibold mt-1 truncate">
                          {template.config.headline}
                        </p>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9px] text-amber-700 uppercase font-extrabold tracking-wider">
                          [ {template.tag} · {template.category.toUpperCase()} ]
                        </span>
                      </div>
                      <h3 className="font-mono font-bold text-base uppercase text-[#1c1917] group-hover:text-amber-600 transition-colors">
                        {template.name}
                      </h3>

                      <p className="font-sans text-xs text-zinc-700 mt-2.5 line-clamp-3 leading-relaxed font-medium italic">
                        "{template.config.wishes}"
                      </p>

                      {/* Highlighted Feature Chips */}
                      <div className="mt-4 pt-3 border-t border-[#1c1917]/20">
                        <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold block mb-1.5">
                          INCLUDED ARCHIVE MODULES:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {template.highlightFeatures.map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-2 py-0.5 bg-[#f7f4ed] border border-[#1c1917] font-mono text-[9px] font-bold uppercase text-[#1c1917]"
                            >
                              ✦ {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-[#f7f4ed] border-t-2 border-[#1c1917] flex items-center gap-2">
                    <Link
                      href={`/celebrate?preset=${key}`}
                      className="flex-1 py-2.5 bg-white hover:bg-[#eeeae0] text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-600" />
                      <span>PREVIEW</span>
                    </Link>
                    <Link
                      href={`/studio?preset=${key}`}
                      className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>CUSTOMIZE</span>
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
        <div className="mb-4">
          <BrandLogo size="md" showSubtitle={true} href="/" />
        </div>

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

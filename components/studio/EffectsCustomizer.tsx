'use client';

import React from 'react';
import { SceneConfig } from '../../types/scene';

interface EffectsCustomizerProps {
  scene: SceneConfig;
  onChange: (updated: Partial<SceneConfig>) => void;
}

export const EffectsCustomizer: React.FC<EffectsCustomizerProps> = ({ scene, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b-2 border-[#1c1917] pb-3">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-amber-600 block mb-1">
          [ 03 · PARTY CONTROLS & PHYSICS ]
        </span>
        <h3 className="text-sm font-bold uppercase tracking-tight text-[#1c1917]">
          Interactive Party Features
        </h3>
      </div>

      {/* Birthday Cake Controls */}
      <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1c1917]/20 pb-3">
          <div>
            <h4 className="font-mono font-bold text-xs uppercase text-[#1c1917]">[ INTERACTIVE LAYERED CAKE ]</h4>
            <p className="font-mono text-[10px] text-zinc-600 uppercase font-semibold">Blow candles via mic or tap</p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ enableCake: !scene.enableCake })}
            className={`px-3 py-1 font-mono text-[10px] font-bold uppercase border-2 transition-all cursor-pointer ${
              scene.enableCake
                ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#eeeae0] text-zinc-600 border-[#1c1917]'
            }`}
          >
            {scene.enableCake ? '[ ENABLED ]' : '[ DISABLED ]'}
          </button>
        </div>

        {scene.enableCake && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <div className="flex justify-between font-mono text-[11px] font-bold uppercase text-[#1c1917] mb-1">
                <span>CANDLE COUNT</span>
                <span className="text-amber-600 font-bold">{scene.candleCount} CANDLES</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={scene.candleCount}
                onChange={(e) => onChange({ candleCount: parseInt(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-[#1c1917] mb-1.5">
                CAKE FLAVOR TIER
              </label>
              <select
                value={scene.cakeFlavor}
                onChange={(e) => onChange({ cakeFlavor: e.target.value as unknown as SceneConfig['cakeFlavor'] })}
                className="w-full px-3 py-2 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
              >
                <option value="chocolate">CHOCOLATE OBSIDIAN</option>
                <option value="strawberry">STRAWBERRY VERMILLION</option>
                <option value="vanilla">VANILLA STONE PAPER</option>
                <option value="rainbow">BAUHAUS FUNFETTI</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Floating Balloons Controls */}
      <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1c1917]/20 pb-3">
          <div>
            <h4 className="font-mono font-bold text-xs uppercase text-[#1c1917]">[ GEOMETRIC BALLOONS ]</h4>
            <p className="font-mono text-[10px] text-zinc-600 uppercase font-semibold">Faceted prisms with tap-to-pop</p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ enableBalloons: !scene.enableBalloons })}
            className={`px-3 py-1 font-mono text-[10px] font-bold uppercase border-2 transition-all cursor-pointer ${
              scene.enableBalloons
                ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#eeeae0] text-zinc-600 border-[#1c1917]'
            }`}
          >
            {scene.enableBalloons ? '[ ENABLED ]' : '[ DISABLED ]'}
          </button>
        </div>

        {scene.enableBalloons && (
          <div className="pt-1">
            <div className="flex justify-between font-mono text-[11px] font-bold uppercase text-[#1c1917] mb-1">
              <span>DENSITY COUNT</span>
              <span className="text-amber-600 font-bold">{scene.balloonCount} UNITS</span>
            </div>
            <input
              type="range"
              min="3"
              max="16"
              value={scene.balloonCount}
              onChange={(e) => onChange({ balloonCount: parseInt(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Surprise Gift Box */}
      <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#1c1917]/20 pb-3">
          <div>
            <h4 className="font-mono font-bold text-xs uppercase text-[#1c1917]">[ SECRET GIFT PARCEL ]</h4>
            <p className="font-mono text-[10px] text-zinc-600 uppercase font-semibold">Unboxing interaction with custom reward</p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ enableGift: !scene.enableGift })}
            className={`px-3 py-1 font-mono text-[10px] font-bold uppercase border-2 transition-all cursor-pointer ${
              scene.enableGift
                ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#eeeae0] text-zinc-600 border-[#1c1917]'
            }`}
          >
            {scene.enableGift ? '[ ENABLED ]' : '[ DISABLED ]'}
          </button>
        </div>

        {scene.enableGift && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-[#1c1917] mb-1">
                PARCEL REVEAL TITLE
              </label>
              <input
                type="text"
                value={scene.giftContent.title}
                onChange={(e) =>
                  onChange({
                    giftContent: { ...scene.giftContent, title: e.target.value }
                  })
                }
                placeholder="e.g. SPECIAL BIRTHDAY REVEAL · PRIZE 01"
                className="w-full px-3.5 py-2 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-[#1c1917] mb-1">
                SURPRISE MESSAGE / REWARD
              </label>
              <textarea
                rows={2}
                value={scene.giftContent.message}
                onChange={(e) =>
                  onChange({
                    giftContent: { ...scene.giftContent, message: e.target.value }
                  })
                }
                placeholder="e.g. Surprise! You've unlocked 1 Free Birthday Dinner & Unlimited Good Vibes!"
                className="w-full px-3.5 py-2 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917] resize-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold uppercase text-[#1c1917] mb-1">
                VIP VOUCHER CODE (OPTIONAL)
              </label>
              <input
                type="text"
                value={scene.giftContent.voucherCode || ''}
                onChange={(e) =>
                  onChange({
                    giftContent: { ...scene.giftContent, voucherCode: e.target.value }
                  })
                }
                placeholder="e.g. BDAY-VIP-2026"
                className="w-full px-3.5 py-2 bg-[#f7f4ed] border-2 border-[#1c1917] text-amber-600 font-mono text-xs font-bold focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Audio Engine Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917]">
          <label className="block font-mono text-[11px] font-bold uppercase text-[#1c1917] mb-2">
            SYNTHESIZER SOUNDTRACK
          </label>
          <select
            value={scene.musicTrack}
            onChange={(e) => onChange({ musicTrack: e.target.value as unknown as SceneConfig['musicTrack'] })}
            className="w-full px-3.5 py-2 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
          >
            <option value="orchestral">GRAND ORCHESTRAL BELLS</option>
            <option value="festive">JOYFUL CHIMES</option>
            <option value="chill-lofi">WARM LO-FI SYNTH</option>
            <option value="synthwave">RETRO 8-BIT SYNTHWAVE</option>
            <option value="acoustic">ACOUSTIC FOLK</option>
            <option value="none">MUTE / NO SOUNDTRACK</option>
          </select>
        </div>

        <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] flex items-center justify-between">
          <div>
            <h4 className="font-mono font-bold text-xs uppercase text-[#1c1917]">[ FIREWORKS ENGINE ]</h4>
            <p className="font-mono text-[10px] text-zinc-600 uppercase font-semibold">Interactive particle bursts</p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ enableFireworks: !scene.enableFireworks })}
            className={`px-3 py-1 font-mono text-[10px] font-bold uppercase border-2 transition-all cursor-pointer ${
              scene.enableFireworks
                ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#eeeae0] text-zinc-600 border-[#1c1917]'
            }`}
          >
            {scene.enableFireworks ? '[ ON ]' : '[ OFF ]'}
          </button>
        </div>
      </div>
    </div>
  );
};

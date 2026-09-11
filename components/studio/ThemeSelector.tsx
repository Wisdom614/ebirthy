'use client';

import React from 'react';
import { SceneConfig, ThemeId } from '../../types/scene';
import { THEME_DEFINITIONS } from '../../utils/presets';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  scene: SceneConfig;
  onChange: (updated: Partial<SceneConfig>) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ scene, onChange }) => {
  const themes = Object.values(THEME_DEFINITIONS);

  const handleSelectTheme = (themeId: ThemeId) => {
    const themeDef = THEME_DEFINITIONS[themeId];
    onChange({
      theme: themeId,
      primaryColor: themeDef.defaultPrimary,
      secondaryColor: themeDef.defaultSecondary,
      musicTrack: themeDef.defaultMusic
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-[#1c1917] pb-3">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-amber-600 block mb-1">
          [ 02 // ARCHITECTURAL PALETTE & STYLE ]
        </span>
        <h3 className="text-sm font-bold uppercase tracking-tight text-[#1c1917]">
          Visual Atmosphere & Environment
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {themes.map((t, idx) => {
          const isSelected = scene.theme === t.id;

          return (
            <div
              key={t.id}
              onClick={() => handleSelectTheme(t.id)}
              className={`group relative p-4 border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#1c1917] bg-white shadow-[4px_4px_0px_#1c1917] ring-2 ring-amber-400'
                  : 'border-[#1c1917]/30 bg-[#f7f4ed] hover:border-[#1c1917] hover:bg-white shadow-[2px_2px_0px_#1c1917]'
              }`}
            >
              {/* Header preview stripe */}
              <div className={`h-12 w-full ${t.backgroundClass} mb-3 border-2 border-[#1c1917] p-2 flex items-center justify-between`}>
                <div className="flex items-center gap-1.5">
                  {t.particlesColor.map((c, i) => (
                    <span
                      key={i}
                      className="w-3.5 h-3.5 border border-[#1c1917] shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {isSelected && (
                  <div className="px-2 py-0.5 bg-amber-400 text-[#1c1917] font-mono text-[9px] font-bold uppercase border border-[#1c1917] shadow-[1px_1px_0px_#1c1917] flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>ACTIVE</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-zinc-500 uppercase font-semibold">PALETTE // 0{idx + 1}</span>
              </div>

              <h4 className="font-mono font-bold text-sm text-[#1c1917] uppercase mt-0.5">{t.name}</h4>
              <p className="font-mono text-xs text-zinc-600 mt-1 leading-relaxed">{t.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { SceneConfig, FontStyle } from '../../types/scene';
import { calculateLifeChronicle } from '../../utils/chronicleCalculator';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';

interface DetailsFormProps {
  scene: SceneConfig;
  onChange: (updated: Partial<SceneConfig>) => void;
}

export const DetailsForm: React.FC<DetailsFormProps> = ({ scene, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="border-b-2 border-[#1c1917] pb-3">
        <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-amber-600 block mb-1">
          [ 01 · IDENTITY & DISPATCH ]
        </span>
        <h3 className="text-sm font-bold uppercase tracking-tight text-[#1c1917]">
          Recipient & Personal Message
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipient Name */}
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold tracking-wider text-[#1c1917] mb-1.5">
            RECIPIENT NAME *
          </label>
          <input
            type="text"
            value={scene.recipientName}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            placeholder="e.g. ALEX"
            className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
          />
        </div>

        {/* Sender Name */}
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold tracking-wider text-[#1c1917] mb-1.5">
            YOUR NAME (SENDER)
          </label>
          <input
            type="text"
            value={scene.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
            placeholder="e.g. BEST FRIEND"
            className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
          />
        </div>

        {/* Birth Date */}
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold tracking-wider text-[#1c1917] mb-1.5">
            BIRTH DATE (CALCULATES LIVE CHRONOMETER)
          </label>
          <input
            type="date"
            value={scene.birthDate || ''}
            onChange={(e) => onChange({ birthDate: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
          />
          {scene.birthDate && calculateLifeChronicle(scene.birthDate).isValid ? (
            <div className="mt-1.5 p-1.5 bg-amber-50 border border-amber-300 font-mono text-[9px] font-bold text-amber-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                LIVE CHRONICLE: {calculateLifeChronicle(scene.birthDate).years}YRS · {calculateLifeChronicle(scene.birthDate).months}MOS · {calculateLifeChronicle(scene.birthDate).weeks}WKS · {calculateLifeChronicle(scene.birthDate).days}DAYS
              </span>
            </div>
          ) : (
            <span className="font-mono text-[9px] text-zinc-500 uppercase mt-1 block">
              DISPLAYS LIVE YEARS, MONTHS, WEEKS, DAYS & MINUTES
            </span>
          )}
        </div>

        {/* Relationship */}
        <div>
          <label className="block font-mono text-[11px] uppercase font-bold tracking-wider text-[#1c1917] mb-1.5">
            RELATIONSHIP / TAG
          </label>
          <input
            type="text"
            value={scene.relationship}
            onChange={(e) => onChange({ relationship: e.target.value })}
            placeholder="e.g. SOULMATE, BROTHER"
            className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
          />
        </div>
      </div>

      {/* Main Headline */}
      <div>
        <label className="block font-mono text-[11px] uppercase font-bold tracking-wider text-[#1c1917] mb-1.5">
          BANNER HEADLINE
        </label>
        <input
          type="text"
          value={scene.headline}
          onChange={(e) => onChange({ headline: e.target.value })}
          placeholder="e.g. ANOTHER YEAR OF PURE EXCELLENCE"
          className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
        />
      </div>

      {/* Short Wishes */}
      <div>
        <label className="block font-mono text-[11px] uppercase font-bold tracking-wider text-[#1c1917] mb-1.5">
          QUICK WISHES QUOTE
        </label>
        <textarea
          rows={2}
          value={scene.wishes}
          onChange={(e) => onChange({ wishes: e.target.value })}
          placeholder="Short wish that appears under the main headline..."
          className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917] resize-none"
        />
      </div>

      {/* Secret Letter */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-mono text-[11px] uppercase font-bold tracking-wider text-[#1c1917]">
            SECRET HEARTFELT MEMO (SEALED UNBOXING)
          </label>
          <div className="flex items-center gap-1">
            {(['modern', 'elegant', 'playful'] as FontStyle[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => onChange({ fontStyle: f })}
                className={`px-2 py-0.5 font-mono text-[9px] uppercase border-2 transition-colors ${
                  scene.fontStyle === f
                    ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] font-bold shadow-[1px_1px_0px_#1c1917]'
                    : 'bg-white text-zinc-700 border-[#1c1917] hover:bg-[#eeeae0]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <textarea
          rows={5}
          value={scene.letterText}
          onChange={(e) => onChange({ letterText: e.target.value })}
          placeholder="Write a personal note. When the recipient opens the envelope, this will reveal with a typewriter animation..."
          className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-sm focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917] resize-none"
        />
      </div>

      {/* Voice Note Recorder */}
      <VoiceNoteRecorder
        voiceNoteUrl={scene.voiceNoteUrl}
        voiceNoteDuration={scene.voiceNoteDuration}
        onChange={onChange}
      />

      {/* Midnight Reveal Time-Lock */}
      <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] space-y-3">
        <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-3">
          <div>
            <h4 className="font-mono font-bold text-xs uppercase text-[#1c1917]">[ MIDNIGHT REVEAL TIME-LOCK ]</h4>
            <p className="font-mono text-[10px] text-zinc-600 uppercase font-semibold">
              Seal celebration scene with a live countdown clock until target time
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const willEnable = !scene.enableTimeLock;
              // Default to next midnight if no date set
              let nextMidnight = scene.unlockDateTime;
              if (willEnable && !nextMidnight) {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                d.setHours(0, 0, 0, 0);
                nextMidnight = d.toISOString().slice(0, 16);
              }
              onChange({
                enableTimeLock: willEnable,
                unlockDateTime: nextMidnight
              });
            }}
            className={`px-3 py-1 font-mono text-[10px] font-bold uppercase border-2 transition-all cursor-pointer ${
              scene.enableTimeLock
                ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                : 'bg-[#eeeae0] text-zinc-600 border-[#1c1917]'
            }`}
          >
            {scene.enableTimeLock ? '[ ENABLED ]' : '[ DISABLED ]'}
          </button>
        </div>

        {scene.enableTimeLock && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block font-mono text-[10px] font-bold uppercase text-[#1c1917] mb-1.5">
                UNLOCK DATE & TIME (LOCAL TIMEZONE)
              </label>
              <input
                type="datetime-local"
                value={scene.unlockDateTime || ''}
                onChange={(e) => onChange({ unlockDateTime: e.target.value })}
                className="w-full px-3.5 py-2 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 1);
                  d.setHours(0, 0, 0, 0);
                  onChange({ unlockDateTime: d.toISOString().slice(0, 16) });
                }}
                className="px-2.5 py-1 bg-[#f7f4ed] hover:bg-[#eeeae0] text-[#1c1917] border border-[#1c1917] font-mono text-[9px] font-bold uppercase cursor-pointer"
              >
                [ TONIGHT 00:00 (MIDNIGHT) ]
              </button>

              <button
                type="button"
                onClick={() => {
                  const d = new Date();
                  d.setDate(d.getDate() + 2);
                  d.setHours(0, 0, 0, 0);
                  onChange({ unlockDateTime: d.toISOString().slice(0, 16) });
                }}
                className="px-2.5 py-1 bg-[#f7f4ed] hover:bg-[#eeeae0] text-[#1c1917] border border-[#1c1917] font-mono text-[9px] font-bold uppercase cursor-pointer"
              >
                [ TOMORROW MIDNIGHT ]
              </button>

              <button
                type="button"
                onClick={() => {
                  const d = new Date(Date.now() + 60 * 60 * 1000);
                  onChange({ unlockDateTime: d.toISOString().slice(0, 16) });
                }}
                className="px-2.5 py-1 bg-[#f7f4ed] hover:bg-[#eeeae0] text-[#1c1917] border border-[#1c1917] font-mono text-[9px] font-bold uppercase cursor-pointer"
              >
                [ IN 1 HOUR ]
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

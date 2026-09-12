'use client';

import React, { useState } from 'react';
import { Gamepad2, Music, Zap, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react';
import { TimeLockPiano } from './TimeLockPiano';
import { TimeLockTypingGame } from './TimeLockTypingGame';

export const TimeLockArcade: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'piano' | 'typing'>('piano');

  return (
    <div className="w-full max-w-lg mx-auto mt-4 mb-2 z-20 relative">
      {!isOpen ? (
        /* Floating Launch Bar */
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-2.5 px-4 bg-[#0a0f1c]/80 hover:bg-[#0f172a] border border-amber-500/30 hover:border-amber-400/60 rounded-xl flex items-center justify-between text-zinc-200 transition-all cursor-pointer backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>WAITING ARCADE &amp; LOUNGE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </span>
              <span className="font-mono text-[9px] text-zinc-400">
                Play Piano &amp; Typing Speed Challenge while waiting
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300 font-bold bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-md">
            <span>PLAY</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>
      ) : (
        /* Expanded Game Drawer */
        <div className="w-full bg-[#080d1a]/95 border border-amber-500/40 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl animate-in zoom-in-95 duration-150 relative">
          
          {/* Top Control Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('piano')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'piano'
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Birthday Piano</span>
              </button>

              <button
                onClick={() => setActiveTab('typing')}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'typing'
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Speed Typing</span>
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close arcade"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Game Views */}
          {activeTab === 'piano' ? <TimeLockPiano /> : <TimeLockTypingGame />}
        </div>
      )}
    </div>
  );
};

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
          className="w-full py-3 px-4 bg-white hover:bg-[#eeeae0] border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center justify-between text-[#1c1917] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-400 border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] flex items-center justify-center flex-shrink-0">
              <Gamepad2 className="w-4 h-4 text-[#1c1917]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-xs font-black text-[#1c1917] uppercase tracking-wider flex items-center gap-2">
                <span>[ WAITING ARCADE &amp; LOUNGE ]</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </span>
              <span className="font-mono text-[10px] text-zinc-600 font-semibold uppercase">
                Play Piano &amp; Typing Speed Challenge
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] px-2.5 py-1 shadow-[1px_1px_0px_#1c1917]">
            <span>OPEN</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>
      ) : (
        /* Expanded Game Drawer */
        <div className="w-full bg-white border-2 border-[#1c1917] p-5 shadow-[6px_6px_0px_#1c1917] animate-in zoom-in-95 duration-150 relative">
          
          {/* Top Control Bar */}
          <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('piano')}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer border-2 border-[#1c1917] ${
                  activeTab === 'piano'
                    ? 'bg-amber-400 text-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-[#eeeae0] text-zinc-700 hover:text-black hover:bg-[#e4dfd4]'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>[ PIANO ]</span>
              </button>

              <button
                onClick={() => setActiveTab('typing')}
                className={`px-3 py-1.5 font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer border-2 border-[#1c1917] ${
                  activeTab === 'typing'
                    ? 'bg-amber-400 text-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-[#eeeae0] text-zinc-700 hover:text-black hover:bg-[#e4dfd4]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>[ TYPING TEST ]</span>
              </button>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 bg-[#eeeae0] hover:bg-[#e4dfd4] border-2 border-[#1c1917] text-[#1c1917] transition-colors cursor-pointer shadow-[1px_1px_0px_#1c1917]"
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

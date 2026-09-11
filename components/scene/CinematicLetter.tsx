'use client';

import React, { useState, useEffect } from 'react';
import { audio } from '../../utils/audioManager';
import { Mail, Feather } from 'lucide-react';

interface CinematicLetterProps {
  senderName: string;
  recipientName: string;
  letterText: string;
  themeClass?: string;
  fontStyle?: 'playful' | 'elegant' | 'modern' | 'handwritten';
}

export const CinematicLetter: React.FC<CinematicLetterProps> = ({
  senderName,
  recipientName,
  letterText,
  fontStyle = 'modern'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const fontClass = {
    playful: 'font-mono text-zinc-900',
    elegant: 'font-serif text-zinc-950 font-medium',
    modern: 'font-mono text-zinc-900 tracking-tight',
    handwritten: 'font-mono text-zinc-900'
  }[fontStyle];

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    audio.playSFX('unwrap');
    audio.playSFX('chime');
  };

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplayedText(letterText.slice(0, current));
      if (current >= letterText.length) {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [isOpen, letterText]);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-xl mx-auto">
      {!isOpen ? (
        /* Sealed Straight Architectural Parcel */
        <div
          onClick={handleOpen}
          className="group relative cursor-pointer flex flex-col items-center select-none transition-all active:translate-x-[2px] active:translate-y-[2px]"
        >
          {/* Envelope Body */}
          <div className="relative w-72 sm:w-88 h-48 bg-[#f5f2eb] border-2 border-black shadow-[6px_6px_0px_#000] p-6 flex flex-col justify-between overflow-hidden">
            {/* Stamp */}
            <div className="absolute top-4 right-4 w-12 h-14 bg-rose-600 border-2 border-black flex flex-col items-center justify-center text-white font-mono shadow-[2px_2px_0px_#000]">
              <span className="text-[7px] font-bold tracking-widest uppercase">AIR MAIL</span>
              <span className="text-xs font-bold">2026</span>
            </div>

            {/* Recipient Marker */}
            <div className="my-auto text-left w-full">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">
                DISPATCH TO:
              </span>
              <h4 className="font-mono text-xl font-bold uppercase tracking-tight text-black">
                {recipientName}
              </h4>
            </div>

            {/* Straight Seal Stamp */}
            <div className="relative z-10 -mb-2 flex items-center justify-between border-t-2 border-black pt-2">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-bold tracking-widest">
                [ CONFIDENTIAL MEMO ]
              </span>
              <div className="px-2 py-0.5 bg-rose-600 text-white font-mono text-[9px] font-bold uppercase border border-black shadow-[1px_1px_0px_#000]">
                SEALED
              </div>
            </div>
          </div>

          <span className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917] bg-amber-400 border-2 border-black px-3.5 py-1.5 shadow-[3px_3px_0px_#000] flex items-center gap-2">
            <Feather className="w-3.5 h-3.5" />
            <span>[ CLICK TO BREAK SEAL & REVEAL LETTER ]</span>
          </span>
        </div>
      ) : (
        /* Unfolded Straight Letterpress Memorandum */
        <div className="relative w-full bg-[#fcfaf4] border-2 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000] text-black animate-in fade-in duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-rose-600 border border-black" />
              <span className="font-mono text-xs uppercase font-bold tracking-widest text-black">
                PERSONAL DISPATCH · MEMORANDUM
              </span>
            </div>
            <span className="font-mono text-[10px] text-zinc-600 uppercase">
              STATUS: READ_ONLY
            </span>
          </div>

          <h3 className="font-mono text-base font-bold text-black uppercase mb-3">
            DEAR {recipientName},
          </h3>

          {/* Typewriter Text Body */}
          <p className={`text-sm sm:text-base leading-relaxed min-h-[120px] whitespace-pre-line ${fontClass}`}>
            {displayedText}
            {displayedText.length < letterText.length && (
              <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse" />
            )}
          </p>

          {/* Signoff */}
          <div className="mt-8 pt-4 border-t-2 border-black flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-600 uppercase">WITH ALL RESPECT & WISHES</span>
            <p className="font-mono text-sm font-bold uppercase text-black">
              ~ {senderName}
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="font-mono text-[10px] text-zinc-500 hover:text-black uppercase tracking-wider cursor-pointer"
            >
              [ RE-SEAL ENVELOPE ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { audio } from '../../utils/audioManager';
import { GiftContent } from '../../types/scene';
import { Copy, Check, Sparkles } from 'lucide-react';

interface SurpriseGiftBoxProps {
  content: GiftContent;
  primaryColor?: string;
  secondaryColor?: string;
}

export const SurpriseGiftBox: React.FC<SurpriseGiftBoxProps> = ({
  content,
  primaryColor = '#f59e0b',
  secondaryColor = '#ea580c'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const openGift = () => {
    if (isOpen) return;

    audio.playSFX('unwrap');
    setTimeout(() => {
      audio.playSFX('chime');
      audio.playSFX('cheer');
    }, 200);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.65 },
      colors: [primaryColor, secondaryColor, '#1c1917', '#ffffff']
    });

    setIsOpen(true);
  };

  const copyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    audio.playSFX('sparkle');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {!isOpen ? (
        /* Unopened Straight Parcel */
        <div
          onClick={openGift}
          className="group relative cursor-pointer flex flex-col items-center select-none transition-transform active:translate-x-[2px] active:translate-y-[2px]"
        >
          {/* Label Stamp */}
          <div className="mb-4 px-3 py-1 bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] font-bold tracking-widest uppercase shadow-[3px_3px_0px_#1c1917] flex items-center gap-1.5 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            [ TAP PARCEL TO UNSEAL SURPRISE ]
          </div>

          {/* Straight 3D Box Construction */}
          <div className="relative w-36 h-36 flex flex-col items-center justify-end">
            
            {/* Straight Lid */}
            <div className="relative z-20 w-40 h-10 bg-rose-600 border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] flex items-center justify-center group-hover:-translate-y-2 transition-transform">
              <div className="absolute -top-4 flex items-center justify-center">
                <div className="w-4 h-4 bg-amber-400 border-2 border-[#1c1917] -rotate-45" />
                <div className="w-4 h-4 bg-amber-400 border-2 border-[#1c1917] rotate-45 -ml-2" />
              </div>
              <div className="w-6 h-full bg-amber-400 border-x-2 border-[#1c1917]" />
            </div>

            {/* Straight Box Body */}
            <div className="relative z-10 w-36 h-28 bg-rose-700 border-2 border-[#1c1917] shadow-[5px_5px_0px_#1c1917] flex items-center justify-center -mt-0.5">
              <div className="w-6 h-full bg-amber-400 border-x-2 border-[#1c1917]" />
              <div className="absolute w-full h-6 bg-amber-400 border-y-2 border-[#1c1917]" />
            </div>
          </div>
        </div>
      ) : (
        /* Revealed Straight Card */
        <div className="relative max-w-md w-full bg-white border-2 border-[#1c1917] p-6 sm:p-8 shadow-[6px_6px_0px_#1c1917] text-[#1c1917]">
          <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-4">
            <span className="font-mono text-[10px] text-amber-600 font-bold uppercase tracking-widest">
              [ CLASSIFIED BIRTHDAY PAYLOAD // 01 ]
            </span>
            <span className="font-mono text-[10px] text-zinc-500 uppercase font-semibold">
              STATUS: UNSEALED
            </span>
          </div>

          <h3 className="text-xl font-bold uppercase tracking-tight text-[#1c1917]">
            {content.title || 'BIRTHDAY SURPRISE UNLOCKED'}
          </h3>

          <p className="mt-3 text-sm text-zinc-700 leading-relaxed font-sans whitespace-pre-line font-medium">
            {content.message}
          </p>

          {/* Secret Voucher Code */}
          {content.voucherCode && (
            <div className="mt-5 p-4 bg-[#f7f4ed] border-2 border-[#1c1917] flex items-center justify-between gap-3 shadow-[3px_3px_0px_#1c1917]">
              <div className="text-left">
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">
                  VIP VOUCHER CODE
                </span>
                <span className="font-mono text-base font-bold text-amber-600 tracking-wider">
                  {content.voucherCode}
                </span>
              </div>
              <button
                onClick={() => copyCode(content.voucherCode)}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono text-xs font-bold uppercase border border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          )}

          <div className="mt-5 pt-3 border-t-2 border-[#1c1917]/20 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="font-mono text-[10px] text-zinc-500 hover:text-black uppercase tracking-wider font-semibold cursor-pointer"
            >
              [ RE-SEAL PARCEL ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

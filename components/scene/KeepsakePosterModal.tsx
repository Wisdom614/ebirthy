'use client';

import React, { useRef, useState } from 'react';
import { SceneConfig } from '../../types/scene';
import { THEME_DEFINITIONS } from '../../utils/presets';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { X, Download, Printer, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { formatBirthDayMonth } from '../../utils/dateFormatter';

interface KeepsakePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: SceneConfig;
  slug?: string;
}

export const KeepsakePosterModal: React.FC<KeepsakePosterModalProps> = ({
  isOpen,
  onClose,
  scene,
  slug
}) => {
  const posterRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const theme = THEME_DEFINITIONS[scene.theme] || THEME_DEFINITIONS.gold;
  const primaryPhoto = scene.photos && scene.photos.length > 0 ? scene.photos[0] : null;

  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);

    try {
      audio.playSFX('sparkle');
      
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 3, // 300 DPI crisp print quality
        cacheBust: true,
        quality: 0.98
      });

      const link = document.createElement('a');
      const safeName = (scene.recipientName || 'birthday').toLowerCase().replace(/\s+/g, '-');
      link.download = `${safeName}-birthday-keepsake-2026.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Failed to export poster PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    audio.playSFX('chime');
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-[#eeeae0] border-2 border-[#1c1917] p-4 sm:p-6 shadow-[10px_10px_0px_#1c1917] text-[#1c1917] my-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showSubtitle={false} href="" />
            <span className="hidden sm:inline font-mono text-xs font-bold uppercase tracking-widest text-[#1c1917] border-l-2 border-[#1c1917] pl-3">
              [ KEEPSAKE POSTER EXPORTER ]
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Printable Poster Frame Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex items-center justify-center bg-zinc-900/10 border-2 border-dashed border-[#1c1917]/30">
          
          {/* Print Target Node (300 DPI layout container) */}
          <div
            ref={posterRef}
            id="printable-keepsake-poster"
            className="w-full max-w-[480px] bg-[#f7f4ed] border-4 border-[#1c1917] p-6 sm:p-8 flex flex-col justify-between shadow-[8px_8px_0px_#1c1917] relative text-[#1c1917] aspect-[3/4.2]"
          >
            {/* Top Structural Header */}
            <div className="border-b-2 border-[#1c1917] pb-3 flex items-center justify-between gap-2 flex-wrap">
              <BrandLogo size="sm" showSubtitle={true} href="" />
              <div className="flex items-center gap-1.5">
                {scene.birthDate && (
                  <span className="font-mono text-[10px] font-black px-2 py-0.5 bg-amber-400 text-[#1c1917] border border-[#1c1917] uppercase shadow-sm">
                    {formatBirthDayMonth(scene.birthDate)}
                  </span>
                )}
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-white border border-[#1c1917] uppercase shadow-sm">
                  OFFICIAL ARCHIVE
                </span>
              </div>
            </div>

            {/* Poster Main Body */}
            <div className="my-auto py-4 flex flex-col items-center text-center">
              {/* Optional Photo Plate Header */}
              {primaryPhoto?.url ? (
                <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white border-2 border-[#1c1917] p-2 shadow-[4px_4px_0px_#1c1917] mb-4">
                  <img
                    src={primaryPhoto.url}
                    alt={scene.recipientName}
                    className="w-full h-full object-cover grayscale contrast-125"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="p-3 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] mb-4 flex items-center justify-center">
                  <BrandLogo size="md" showSubtitle={false} href="" />
                </div>
              )}

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#1c1917] leading-none">
                HAPPY BIRTHDAY <br />
                <span className="bg-amber-400 text-[#1c1917] px-2.5 py-0.5 border-2 border-[#1c1917] inline-block mt-1 shadow-[3px_3px_0px_#1c1917]">
                  {scene.recipientName}
                </span>
              </h2>

              {/* Headline Slogan */}
              {scene.headline && (
                <p className="mt-3 font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917] border-y border-[#1c1917]/30 py-1.5 w-full">
                  {scene.headline}
                </p>
              )}

              {/* Personal Wishes Quote */}
              <p className="mt-3 text-xs sm:text-sm text-zinc-800 leading-relaxed font-sans font-semibold line-clamp-3">
                "{scene.wishes || scene.letterText || 'Wishing you limitless health, joy, and incredible milestones in the year ahead.'}"
              </p>
            </div>

            {/* Bottom Signature & Verification Seal */}
            <div className="pt-3 border-t-2 border-[#1c1917] flex items-end justify-between font-mono text-[9px] gap-2">
              <div className="text-left">
                <span className="text-zinc-500 uppercase block font-semibold">HONORED SENDER</span>
                <span className="font-bold text-xs uppercase text-[#1c1917]">~ {scene.senderName || 'A Close Friend'}</span>
              </div>

              {scene.birthDate && (
                <div className="text-center">
                  <span className="text-zinc-500 uppercase block font-semibold">DATE</span>
                  <span className="font-mono font-black text-xs uppercase text-[#1c1917] bg-white px-2 py-0.5 border border-[#1c1917]">
                    {formatBirthDayMonth(scene.birthDate)}
                  </span>
                </div>
              )}

              <div className="text-right">
                <span className="text-zinc-500 uppercase block font-semibold">VERIFIED YEAR</span>
                <span className="font-bold text-xs uppercase text-[#1c1917]">{new Date().getFullYear()} CELEBRATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="mt-4 pt-3 border-t-2 border-[#1c1917] flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="w-full sm:flex-1 py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>GENERATING 300 DPI POSTER...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>[ DOWNLOAD HIGH-RES POSTER (PNG) ]</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-[#eeeae0] text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-600" />
            <span>[ PRINT / PDF ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useRef, useState } from 'react';
import { SceneConfig } from '../../types/scene';
import { THEME_DEFINITIONS } from '../../utils/presets';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Printer,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Check,
  Camera,
  QrCode
} from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';
import { formatBirthDayMonth } from '../../utils/dateFormatter';
import { trackEvent } from '../../utils/analytics/tracker';

export type PosterStyle = 'ivory' | 'noir' | 'kodak';

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
  const [posterStyle, setPosterStyle] = useState<PosterStyle>('ivory');

  if (!isOpen) return null;

  const primaryPhoto = scene.photos && scene.photos.length > 0 ? scene.photos[0] : null;
  const currentYear = new Date().getFullYear();

  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    setIsExporting(true);

    try {
      audio.playSFX('sparkle');

      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(posterRef.current, {
        pixelRatio: 3, // 300 DPI ultra-crisp print quality
        cacheBust: true,
        quality: 0.98
      });

      const link = document.createElement('a');
      const safeName = (scene.recipientName || 'birthday').toLowerCase().replace(/\s+/g, '-');
      link.download = `${safeName}-birthday-keepsake-${posterStyle}-${currentYear}.png`;
      link.href = dataUrl;
      link.click();

      trackEvent('poster_downloaded', {
        recipient: scene.recipientName,
        theme: scene.theme,
        style: posterStyle,
        slug: slug || 'preview'
      });

      confetti({
        particleCount: 55,
        spread: 70,
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
    trackEvent('poster_printed', {
      recipient: scene.recipientName,
      style: posterStyle,
      slug: slug || 'preview'
    });
    window.print();
  };

  // Dynamic style theme tokens
  const styleConfig = {
    ivory: {
      bg: 'bg-[#f7f4ed]',
      border: 'border-[#1c1917]',
      text: 'text-[#1c1917]',
      accentBg: 'bg-amber-400 text-[#1c1917]',
      cardBg: 'bg-white',
      shadow: 'shadow-[8px_8px_0px_#1c1917]',
      divider: 'border-[#1c1917]',
      quoteColor: 'text-zinc-800'
    },
    noir: {
      bg: 'bg-[#12110e]',
      border: 'border-[#f59e0b]',
      text: 'text-[#f5f5f4]',
      accentBg: 'bg-[#f59e0b] text-[#12110e]',
      cardBg: 'bg-[#1c1a17]',
      shadow: 'shadow-[8px_8px_0px_#f59e0b]',
      divider: 'border-[#f59e0b]/40',
      quoteColor: 'text-zinc-300'
    },
    kodak: {
      bg: 'bg-[#f4ede2]',
      border: 'border-[#854d0e]',
      text: 'text-[#451a03]',
      accentBg: 'bg-[#eab308] text-[#451a03]',
      cardBg: 'bg-[#fffdfa]',
      shadow: 'shadow-[8px_8px_0px_#854d0e]',
      divider: 'border-[#854d0e]/40',
      quoteColor: 'text-[#713f12]'
    }
  }[posterStyle];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white border-2 border-[#1c1917] p-4 sm:p-6 shadow-[10px_10px_0px_#1c1917] text-[#1c1917] my-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[94vh]"
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-3 flex-shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <BrandLogo size="sm" showSubtitle={false} href="" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 border-l-2 border-[#1c1917] pl-2.5">
              [ 300 DPI KEEPSAKE POSTER STUDIO ]
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Style Selector Palette Bar */}
        <div className="flex items-center justify-between gap-2 py-2 mb-3 px-3 bg-[#f7f4ed] border-2 border-[#1c1917] flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold uppercase text-[#1c1917]">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            <span>POSTER AESTHETIC:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
            {(
              [
                { id: 'ivory', label: 'SWISS IVORY' },
                { id: 'noir', label: 'OBSIDIAN NOIR' },
                { id: 'kodak', label: 'VINTAGE KODAK' }
              ] as { id: PosterStyle; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  audio.playSFX('sparkle');
                  setPosterStyle(s.id);
                }}
                className={`px-2.5 py-1 uppercase border-2 transition-all cursor-pointer flex items-center gap-1 ${
                  posterStyle === s.id
                    ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] font-black shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-white text-zinc-700 border-[#1c1917]/40 hover:border-[#1c1917]'
                }`}
              >
                {posterStyle === s.id && <Check className="w-3 h-3" />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Printable Poster Frame Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-5 flex items-center justify-center bg-zinc-900/10 border-2 border-dashed border-[#1c1917]/30">
          
          {/* Printable 300 DPI Poster Node */}
          <div
            ref={posterRef}
            id="printable-keepsake-poster"
            className={`w-full max-w-[480px] ${styleConfig.bg} border-4 ${styleConfig.border} p-6 sm:p-8 flex flex-col justify-between ${styleConfig.shadow} relative ${styleConfig.text} aspect-[3/4.2] transition-colors duration-200 select-none overflow-hidden`}
          >
            {/* Registration Corner Crosshairs */}
            <span className="absolute top-2 left-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
            <span className="absolute top-2 right-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
            <span className="absolute bottom-2 left-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
            <span className="absolute bottom-2 right-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>

            {/* Top Structural Header */}
            <div className={`border-b-2 ${styleConfig.divider} pb-3 flex items-center justify-between gap-2 flex-wrap`}>
              <div className="flex items-center gap-2">
                <BrandLogo size="sm" showSubtitle={true} href="" />
              </div>

              <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold">
                {scene.birthDate && (
                  <span className={`px-2 py-0.5 ${styleConfig.accentBg} border ${styleConfig.border} uppercase shadow-sm font-black`}>
                    DATE: {formatBirthDayMonth(scene.birthDate)}
                  </span>
                )}
                <span className={`px-2 py-0.5 ${styleConfig.cardBg} border ${styleConfig.border} uppercase shadow-sm font-bold`}>
                  ARCHIVE VOL. {currentYear}
                </span>
              </div>
            </div>

            {/* Poster Main Body */}
            <div className="my-auto py-3 flex flex-col items-center text-center">
              {/* Recipient Photo Plate Header */}
              {primaryPhoto?.url ? (
                <div className={`w-36 h-36 sm:w-44 sm:h-44 ${styleConfig.cardBg} border-2 ${styleConfig.border} p-2 shadow-[4px_4px_0px_#1c1917] mb-3 relative`}>
                  {/* Metal Pin Tag */}
                  <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-zinc-800 border ${styleConfig.border}`} />
                  <img
                    src={primaryPhoto.url}
                    alt={scene.recipientName}
                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className={`p-4 ${styleConfig.cardBg} border-2 ${styleConfig.border} shadow-[3px_3px_0px_#1c1917] mb-3 flex items-center justify-center`}>
                  <Camera className="w-8 h-8 text-amber-500" />
                </div>
              )}

              {/* Sub-label Title */}
              <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-extrabold block mb-1">
                COMMEMORATIVE BIRTHDAY EXHIBIT
              </span>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none">
                HAPPY BIRTHDAY <br />
                <span className={`px-2.5 py-0.5 ${styleConfig.accentBg} border-2 ${styleConfig.border} inline-block mt-1.5 shadow-[3px_3px_0px_#1c1917]`}>
                  {scene.recipientName}
                </span>
              </h2>

              {/* Headline Slogan Tag */}
              {scene.headline && (
                <p className={`mt-2.5 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider border-y ${styleConfig.divider} py-1.5 w-full`}>
                  {scene.headline}
                </p>
              )}

              {/* Personal Wishes Quote */}
              <p className={`mt-2.5 text-xs sm:text-sm ${styleConfig.quoteColor} leading-relaxed font-sans font-semibold line-clamp-3 italic px-2`}>
                "{scene.wishes || scene.letterText || 'Wishing you limitless health, joy, and incredible milestones in the year ahead.'}"
              </p>
            </div>

            {/* Bottom Signature & Archival Barcode Seal */}
            <div className={`pt-3 border-t-2 ${styleConfig.divider} flex items-end justify-between font-mono text-[9px] gap-2`}>
              <div className="text-left">
                <span className="text-zinc-500 uppercase block font-semibold text-[8px]">HONORED SENDER</span>
                <span className="font-bold text-xs uppercase text-[#1c1917] block">
                  ~ {scene.senderName || 'A Close Friend'}
                </span>
              </div>

              {/* Archival Serial Code / Stamp */}
              <div className="text-center hidden sm:block">
                <span className="text-zinc-500 uppercase block font-semibold text-[8px]">SERIAL CODE</span>
                <span className={`px-2 py-0.5 ${styleConfig.cardBg} border ${styleConfig.border} font-bold text-[9px] uppercase tracking-widest`}>
                  EB-{currentYear}-{(slug || '01').toUpperCase().slice(0, 8)}
                </span>
              </div>

              <div className="text-right">
                <span className="text-zinc-500 uppercase block font-semibold text-[8px]">VERIFIED ARCHIVE</span>
                <span className="font-bold text-xs uppercase text-[#1c1917] block">
                  {currentYear} CELEBRATION
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Controls */}
        <div className="mt-3 pt-3 border-t-2 border-[#1c1917] flex flex-col sm:flex-row items-center gap-2 flex-shrink-0">
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

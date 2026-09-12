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

export type PosterStyle = 'classic' | 'editorial' | 'polaroid' | 'brutalist' | 'bauhaus' | 'luxury';

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
  const [posterStyle, setPosterStyle] = useState<PosterStyle>('classic');

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
      link.download = `${safeName}-birthday-poster-${posterStyle}-${currentYear}.png`;
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
            <span>POSTER DESIGN LAYOUT:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold overflow-x-auto pb-1 max-w-full">
            {(
              [
                { id: 'classic', label: 'ORIGINAL CLASSIC' },
                { id: 'editorial', label: 'SWISS EDITORIAL' },
                { id: 'polaroid', label: 'VINTAGE POLAROID' },
                { id: 'brutalist', label: 'BRUTALIST' },
                { id: 'bauhaus', label: 'BAUHAUS ART' },
                { id: 'luxury', label: 'ROYAL GILDED' }
              ] as { id: PosterStyle; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  audio.playSFX('sparkle');
                  setPosterStyle(s.id);
                }}
                className={`px-2 py-1 uppercase border-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
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
          
          {/* ========================================================
              LAYOUT 0: ORIGINAL CLASSIC (The Beloved Initial Design)
             ======================================================== */}
          {posterStyle === 'classic' && (
            <div
              ref={posterRef}
              id="printable-keepsake-poster-classic"
              className="w-full max-w-[480px] bg-[#f7f4ed] border-4 border-[#1c1917] p-5 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_#1c1917] relative text-[#1c1917] aspect-[3/4.2] select-none overflow-hidden"
            >
              {/* Registration Corner Crosshairs */}
              <span className="absolute top-2 left-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
              <span className="absolute top-2 right-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
              <span className="absolute bottom-2 left-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
              <span className="absolute bottom-2 right-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>

              {/* Top Structural Header */}
              <div className="border-b-2 border-[#1c1917] pb-2.5 flex items-center justify-between gap-2 flex-wrap">
                <BrandLogo size="sm" showSubtitle={true} href="" />
                <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold">
                  {scene.birthDate && (
                    <span className="px-2 py-0.5 bg-amber-400 text-[#1c1917] border border-[#1c1917] uppercase shadow-sm font-black">
                      DATE: {formatBirthDayMonth(scene.birthDate)}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white border border-[#1c1917] uppercase shadow-sm font-bold">
                    ARCHIVE VOL. {currentYear}
                  </span>
                </div>
              </div>

              {/* Poster Main Body */}
              <div className="my-auto py-2.5 flex flex-col items-center text-center">
                {/* Recipient Photo Plate Header */}
                {primaryPhoto?.url ? (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white border-2 border-[#1c1917] p-2 shadow-[4px_4px_0px_#1c1917] mb-2.5 relative">
                    {/* Metal Pin Tag */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-zinc-800 border border-[#1c1917]" />
                    <img
                      src={primaryPhoto.url}
                      alt={scene.recipientName}
                      className="w-full h-full object-cover grayscale contrast-125"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] mb-2.5 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-amber-500" />
                  </div>
                )}

                {/* Sub-label Title */}
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-zinc-500 font-extrabold block mb-1">
                  COMMEMORATIVE BIRTHDAY EXHIBIT
                </span>

                {/* Main Headline */}
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none">
                  HAPPY BIRTHDAY <br />
                  <span className="px-2.5 py-0.5 bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] inline-block mt-1 shadow-[3px_3px_0px_#1c1917]">
                    {scene.recipientName}
                  </span>
                </h2>

                {/* Headline Slogan Tag */}
                {scene.headline && (
                  <p className="mt-2 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border-y border-[#1c1917]/40 py-1 w-full">
                    {scene.headline}
                  </p>
                )}

                {/* Personal Wishes Quote */}
                <p className="mt-2 text-xs text-zinc-800 leading-relaxed font-sans font-semibold line-clamp-3 italic px-2">
                  "{scene.wishes || scene.letterText || 'Wishing you limitless health, joy, and incredible milestones in the year ahead.'}"
                </p>
              </div>

              {/* Bottom Signature & Archival Barcode Seal */}
              <div className="pt-2.5 border-t-2 border-[#1c1917] flex items-end justify-between font-mono text-[9px] gap-2">
                <div className="text-left">
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">HONORED SENDER</span>
                  <span className="font-bold text-xs uppercase text-[#1c1917] block">
                    ~ {scene.senderName || 'A Close Friend'}
                  </span>
                </div>

                <div className="text-center hidden sm:block">
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">SERIAL CODE</span>
                  <span className="px-2 py-0.5 bg-white border border-[#1c1917] font-bold text-[8px] uppercase tracking-widest">
                    EB-{currentYear}-{(slug || '01').toUpperCase().slice(0, 8)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">VERIFIED ARCHIVE</span>
                  <span className="font-bold text-xs uppercase text-[#1c1917] block">
                    {currentYear} CELEBRATION
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 1: SWISS EDITORIAL (Magazine / Masthead Layout)
             ======================================================== */}
          {posterStyle === 'editorial' && (
            <div
              ref={posterRef}
              id="printable-keepsake-poster-editorial"
              className="w-full max-w-[480px] bg-[#f7f4ed] border-4 border-[#1c1917] p-5 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_#1c1917] relative text-[#1c1917] aspect-[3/4.2] select-none overflow-hidden"
            >
              <span className="absolute top-2 left-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
              <span className="absolute top-2 right-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
              <span className="absolute bottom-2 left-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>
              <span className="absolute bottom-2 right-2 font-mono text-zinc-400 text-[10px] font-bold select-none">+</span>

              <div className="border-b-2 border-[#1c1917] pb-2.5 flex items-center justify-between gap-2">
                <BrandLogo size="sm" showSubtitle={true} href="" />
                <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold">
                  {scene.birthDate && (
                    <span className="px-2 py-0.5 bg-amber-400 text-[#1c1917] border border-[#1c1917] uppercase font-black">
                      DATE: {formatBirthDayMonth(scene.birthDate)}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white border border-[#1c1917] uppercase font-bold">
                    VOL. {currentYear}
                  </span>
                </div>
              </div>

              <div className="my-auto py-3 grid grid-cols-12 gap-3 sm:gap-4 items-center">
                <div className="col-span-5 flex flex-col items-center">
                  {primaryPhoto?.url ? (
                    <div className="w-full aspect-square bg-white border-2 border-[#1c1917] p-1.5 shadow-[4px_4px_0px_#1c1917] relative">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-zinc-800 border border-[#1c1917]" />
                      <img
                        src={primaryPhoto.url}
                        alt={scene.recipientName}
                        className="w-full h-full object-cover grayscale contrast-125"
                        crossOrigin="anonymous"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-white border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] flex items-center justify-center">
                      <Camera className="w-8 h-8 text-amber-500" />
                    </div>
                  )}
                  <span className="mt-1.5 font-mono text-[8px] uppercase tracking-wider text-zinc-500 font-bold">
                    FIG 01. PORTRAIT
                  </span>
                </div>

                <div className="col-span-7 flex flex-col justify-center text-left">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-amber-800 font-black mb-0.5 block">
                    SPECIAL COMMEMORATIVE EDITION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none text-[#1c1917]">
                    HAPPY <br />
                    BIRTHDAY
                  </h2>
                  <div className="mt-1.5">
                    <span className="bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] px-2.5 py-0.5 font-black text-sm sm:text-base uppercase tracking-tight inline-block shadow-[2px_2px_0px_#1c1917]">
                      {scene.recipientName}
                    </span>
                  </div>
                  {scene.headline && (
                    <p className="mt-2 font-mono text-[9px] sm:text-[10px] font-bold uppercase text-zinc-700 leading-tight">
                      "{scene.headline}"
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white border-2 border-[#1c1917] p-2.5 sm:p-3.5 shadow-[3px_3px_0px_#1c1917] my-1 relative">
                <div className="absolute -top-2.5 left-4 bg-amber-400 border border-[#1c1917] px-1.5 py-0.2 font-mono text-[7px] font-black uppercase">
                  MESSAGE OF TRIBUTE
                </div>
                <p className="text-xs sm:text-[13px] text-zinc-800 leading-relaxed font-sans font-medium italic line-clamp-3">
                  "{scene.wishes || scene.letterText || 'Wishing you limitless health, joy, and incredible milestones in the year ahead.'}"
                </p>
              </div>

              <div className="pt-2.5 border-t-2 border-[#1c1917] flex items-end justify-between font-mono text-[9px] gap-2">
                <div className="text-left">
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">HONORED SENDER</span>
                  <span className="font-bold text-xs uppercase text-[#1c1917]">
                    ~ {scene.senderName || 'A Close Friend'}
                  </span>
                </div>

                <div className="text-center hidden sm:block">
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">ARCHIVE SERIAL</span>
                  <span className="px-1.5 py-0.5 bg-white border border-[#1c1917] font-bold text-[8px] uppercase tracking-widest">
                    EB-{currentYear}-{(slug || '01').toUpperCase().slice(0, 6)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">VERIFIED ARCHIVE</span>
                  <span className="font-bold text-xs uppercase text-[#1c1917]">
                    {currentYear} CELEBRATION
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 2: VINTAGE POLAROID (Gallery Film / Vinyl Plate)
             ======================================================== */}
          {posterStyle === 'polaroid' && (
            <div
              ref={posterRef}
              id="printable-keepsake-poster-polaroid"
              className="w-full max-w-[480px] bg-[#f4ede2] border-4 border-[#854d0e] p-5 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_#854d0e] relative text-[#451a03] aspect-[3/4.2] select-none overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#854d0e]/40 pb-1.5 font-mono text-[8px] text-[#854d0e] font-bold">
                <BrandLogo size="sm" showSubtitle={false} href="" variant="sepia" />
                <div className="flex items-center gap-2">
                  <span>EXP 36 · {currentYear}</span>
                  <span>FRAME 24A</span>
                </div>
              </div>

              <div className="my-auto py-2 flex flex-col items-center">
                <div className="w-full max-w-[290px] sm:max-w-[320px] bg-white border-2 border-[#854d0e] p-3 pb-5 shadow-[5px_5px_0px_#854d0e] flex flex-col items-center">
                  <div className="w-full aspect-square bg-[#ece5d8] border border-[#854d0e]/40 overflow-hidden relative mb-3">
                    {primaryPhoto?.url ? (
                      <img
                        src={primaryPhoto.url}
                        alt={scene.recipientName}
                        className="w-full h-full object-cover contrast-110 sepia-[0.15]"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-10 h-10 text-[#854d0e]/60" />
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-amber-300 font-mono text-[8px] font-bold px-1.5 py-0.5">
                      {formatBirthDayMonth(scene.birthDate)}
                    </div>
                  </div>

                  <h2 className="font-serif text-lg sm:text-xl font-bold italic text-[#451a03] tracking-wide">
                    Happy Birthday, {scene.recipientName}!
                  </h2>
                  <span className="font-mono text-[8px] text-[#854d0e] uppercase tracking-widest mt-0.5">
                    ★ AN ORIGINAL MOMENT IN TIME ★
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-[#854d0e] pt-2.5 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-8 text-left">
                  <p className="text-[11px] sm:text-xs text-[#5c2b09] font-serif italic line-clamp-2 leading-relaxed">
                    "{scene.wishes || scene.letterText || 'Wishing you unforgettable moments and timeless happiness.'}"
                  </p>
                  <span className="font-mono text-[9px] font-bold text-[#854d0e] uppercase mt-1 block">
                    — From {scene.senderName || 'Your Friend'}
                  </span>
                </div>

                <div className="col-span-4 flex justify-end">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#854d0e] flex flex-col items-center justify-center text-center p-1 bg-[#faebd7]">
                    <span className="font-mono text-[6px] font-black text-[#854d0e] uppercase leading-none">OFFICIAL</span>
                    <span className="font-serif text-[10px] font-bold text-[#451a03] leading-none my-0.5">{currentYear}</span>
                    <span className="font-mono text-[6px] font-black text-[#854d0e] uppercase leading-none">KEEPSAKE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 3: BRUTALIST MONOLITH (High-Impact Poster Art)
             ======================================================== */}
          {posterStyle === 'brutalist' && (
            <div
              ref={posterRef}
              id="printable-keepsake-poster-brutalist"
              className="w-full max-w-[480px] bg-[#12110e] border-4 border-[#f59e0b] p-5 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_#f59e0b] relative text-[#f5f5f4] aspect-[3/4.2] select-none overflow-hidden"
            >
              <div className="border-b-2 border-[#f59e0b] pb-2 flex items-start justify-between">
                <div>
                  <div className="mb-1.5">
                    <BrandLogo size="sm" showSubtitle={true} href="" variant="light" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none text-white mt-1">
                    HAPPY BIRTHDAY
                  </h1>
                </div>
                <div className="text-right">
                  <span className="bg-[#f59e0b] text-[#12110e] font-mono text-[10px] font-black px-2 py-0.5 uppercase">
                    {currentYear}
                  </span>
                </div>
              </div>

              <div className="my-auto py-3 flex flex-col items-center">
                <div className="relative mb-3">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-3 border-[#f59e0b] overflow-hidden bg-zinc-900 p-1 shadow-[0px_0px_15px_rgba(245,158,11,0.3)]">
                    {primaryPhoto?.url ? (
                      <img
                        src={primaryPhoto.url}
                        alt={scene.recipientName}
                        className="w-full h-full object-cover rounded-full grayscale contrast-150"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-10 h-10 text-[#f59e0b]" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#f59e0b] text-[#12110e] font-mono text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase whitespace-nowrap border border-black">
                    ★ {formatBirthDayMonth(scene.birthDate)} ★
                  </div>
                </div>

                <div className="w-full bg-[#1c1a17] border-2 border-[#f59e0b] p-2 text-center shadow-[4px_4px_0px_#f59e0b]">
                  <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block font-bold">
                    HONORING THE LIVING LEGEND
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase text-amber-400 tracking-tight leading-none mt-0.5">
                    {scene.recipientName}
                  </h2>
                </div>
              </div>

              <div className="border-l-2 border-[#f59e0b] pl-3 py-1 my-1">
                <p className="text-xs text-zinc-300 font-sans italic line-clamp-2">
                  "{scene.wishes || scene.letterText || 'May your upcoming year be defined by grand breakthroughs and boundless happiness.'}"
                </p>
                <span className="font-mono text-[9px] text-[#f59e0b] uppercase font-bold mt-0.5 block">
                  DEDICATED BY: {scene.senderName || 'A Close Friend'}
                </span>
              </div>

              <div className="pt-2 border-t-2 border-[#f59e0b]/60 flex items-center justify-between font-mono text-[8px] text-zinc-400">
                <span className="tracking-widest">|||||| |||| |||||||| ||| ||</span>
                <span className="text-[#f59e0b] font-bold">AUTHENTICATED CERTIFICATE</span>
                <span>VOL. #{currentYear}</span>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 4: BAUHAUS ART (Geometric International Poster)
             ======================================================== */}
          {posterStyle === 'bauhaus' && (
            <div
              ref={posterRef}
              id="printable-keepsake-poster-bauhaus"
              className="w-full max-w-[480px] bg-[#fbf9f5] border-4 border-[#1e293b] p-5 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_#1e293b] relative text-[#1e293b] aspect-[3/4.2] select-none overflow-hidden"
            >
              {/* Geometric Bauhaus Header */}
              <div className="flex items-center justify-between border-b-3 border-[#1e293b] pb-2.5 gap-2">
                <BrandLogo size="sm" showSubtitle={false} href="" />
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[7px] font-bold uppercase tracking-widest text-[#1e293b]/70 hidden sm:inline">
                    EXHIBITION #{currentYear}
                  </span>
                  <div className="bg-[#2563eb] text-white font-mono text-[9px] font-black px-2 py-0.5">
                    {formatBirthDayMonth(scene.birthDate)}
                  </div>
                </div>
              </div>

              {/* Center Bauhaus Geometric Grid */}
              <div className="my-auto py-2 grid grid-cols-12 gap-3 items-center">
                {/* Left: Geometric Block & Portrait */}
                <div className="col-span-6 relative">
                  <div className="w-full aspect-square bg-[#fbbf24] border-3 border-[#1e293b] p-1.5 shadow-[4px_4px_0px_#1e293b] relative overflow-hidden">
                    {primaryPhoto?.url ? (
                      <img
                        src={primaryPhoto.url}
                        alt={scene.recipientName}
                        className="w-full h-full object-cover grayscale contrast-150"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1e293b] flex items-center justify-center text-white">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-[#dc2626] border-2 border-[#1e293b] flex items-center justify-center text-white font-mono text-[8px] font-black">
                    ★
                  </div>
                </div>

                {/* Right: Modernist Typography */}
                <div className="col-span-6 text-left space-y-1">
                  <span className="font-mono text-[8px] font-extrabold uppercase tracking-widest text-[#dc2626]">
                    CELEBRATION DEPT.
                  </span>
                  <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight text-[#1e293b]">
                    HAPPY<br />BIRTHDAY
                  </h2>
                  <div className="bg-[#1e293b] text-white font-mono font-black text-xs uppercase px-2 py-0.5 inline-block">
                    {scene.recipientName}
                  </div>
                </div>
              </div>

              {/* Bauhaus Graphic Quote Strip */}
              <div className="bg-[#f1eee7] border-2 border-[#1e293b] p-2.5 my-1 text-left">
                <p className="font-mono text-[10px] sm:text-[11px] text-[#1e293b] font-medium leading-snug line-clamp-2">
                  "{scene.wishes || scene.letterText || 'Wishing you limitless health, joy, and grand artistic breakthroughs.'}"
                </p>
                <div className="mt-1 flex justify-between font-mono text-[8px] font-bold text-[#dc2626] border-t border-[#1e293b]/20 pt-0.5">
                  <span>DEDICATION: {scene.senderName || 'HONORED FRIEND'}</span>
                  <span>ORIGINAL PRINT</span>
                </div>
              </div>

              {/* Bauhaus Bottom Axis */}
              <div className="border-t-3 border-[#1e293b] pt-1.5 flex items-center justify-between font-mono text-[8px] font-black">
                <span className="text-[#2563eb]">FORM FOLLOWS CELEBRATION</span>
                <span className="text-[#dc2626]">ARCHIV · {currentYear}</span>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 5: ROYAL GILDED (Fine-Art Gilded Monograph)
             ======================================================== */}
          {posterStyle === 'luxury' && (
            <div
              ref={posterRef}
              id="printable-keepsake-poster-luxury"
              className="w-full max-w-[480px] bg-[#0c131d] border-4 border-[#d4af37] p-5 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_#d4af37] relative text-[#fbf8f0] aspect-[3/4.2] select-none overflow-hidden"
            >
              {/* Ornate Gold Double Border Frame */}
              <div className="absolute inset-2 border border-[#d4af37]/40 pointer-events-none" />

              {/* Royal Monograph Header */}
              <div className="border-b border-[#d4af37]/60 pb-2.5 flex items-center justify-between relative">
                <BrandLogo size="sm" showSubtitle={true} href="" variant="gold" />
                <div className="text-right">
                  <span className="font-serif text-[8px] uppercase tracking-[0.2em] text-[#d4af37] block">
                    ROYAL MONOGRAPH
                  </span>
                  <span className="font-mono text-[8px] text-zinc-400">
                    EDITION #{currentYear}
                  </span>
                </div>
              </div>

              {/* Center Fine-Art Portrait in Gold Filigree */}
              <div className="my-auto py-2 flex flex-col items-center text-center">
                <div className="w-32 h-32 sm:w-36 sm:h-36 bg-[#16202c] border-2 border-[#d4af37] p-1.5 shadow-[0px_0px_18px_rgba(212,175,55,0.25)] relative mb-2">
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />
                  {primaryPhoto?.url ? (
                    <img
                      src={primaryPhoto.url}
                      alt={scene.recipientName}
                      className="w-full h-full object-cover contrast-110 sepia-[0.1]"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#d4af37]">
                      <Camera className="w-8 h-8" />
                    </div>
                  )}
                </div>

                <span className="font-serif text-lg sm:text-xl font-bold text-[#d4af37] tracking-wide">
                  {scene.recipientName}
                </span>
                <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest mt-0.5">
                  COMMEMORATIVE ANNIVERSARY · {formatBirthDayMonth(scene.birthDate)}
                </span>
              </div>

              {/* Regal Tribute Quote Block */}
              <div className="border-t border-b border-[#d4af37]/40 py-2 my-1 text-center px-3">
                <p className="font-serif italic text-xs sm:text-[13px] text-[#f2e6cb] leading-relaxed line-clamp-3">
                  "{scene.wishes || scene.letterText || 'Wishing you limitless elegance, enduring wisdom, and splendid milestones.'}"
                </p>
                <span className="font-serif text-[9px] text-[#d4af37] uppercase tracking-wider mt-1 block">
                  — Presented by {scene.senderName || 'An Honored Friend'} —
                </span>
              </div>

              {/* Royal Footer Crest */}
              <div className="pt-1 flex items-center justify-between font-mono text-[7px] text-[#d4af37]/80 uppercase">
                <span>SEAL NO. #{currentYear}</span>
                <span>AUTHENTICATED MONOGRAPH</span>
              </div>
            </div>
          )}
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

'use client';

import React, { useRef, useState } from 'react';
import { LifeChronicle } from '../../utils/chronicleCalculator';
import { formatBirthDayMonth } from '../../utils/dateFormatter';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { X, Download, Loader2, Sparkles, Image as ImageIcon, Camera, Check } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

import { trackEvent } from '../../utils/analytics/tracker';

export type ChronicleLayout = 'classic' | 'matrix' | 'passport' | 'ribbon' | 'cosmic' | 'receipt';

interface ChronicleImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  birthDate: string;
  chronicle: LifeChronicle;
  photoUrl?: string;
}

export const ChronicleImageModal: React.FC<ChronicleImageModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  birthDate,
  chronicle,
  photoUrl
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState<ChronicleLayout>('classic');

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      audio.playSFX('sparkle');

      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, // 300 DPI ultra-crisp quality
        cacheBust: true,
        quality: 0.98
      });

      const link = document.createElement('a');
      const safeName = (recipientName || 'milestone').toLowerCase().replace(/\s+/g, '-');
      link.download = `${safeName}-chronicle-${layoutStyle}-${currentYear}.png`;
      link.href = dataUrl;
      link.click();

      trackEvent('chronicle_card_downloaded', {
        recipient: recipientName,
        total_days: chronicle.totalDays,
        layout: layoutStyle
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (err) {
      console.error('Failed to export milestone card PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full bg-white border-2 border-[#1c1917] p-4 sm:p-6 shadow-[10px_10px_0px_#1c1917] text-[#1c1917] my-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[95vh]"
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-3 flex-shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showSubtitle={false} href="" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 border-l-2 border-[#1c1917] pl-2">
              [ MILESTONE CHRONICLE STUDIO ]
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Layout Style Selector */}
        <div className="flex items-center justify-between gap-2 py-2 mb-3 px-3 bg-[#f7f4ed] border-2 border-[#1c1917] flex-shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold uppercase text-[#1c1917]">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>CHRONICLE LAYOUT:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold overflow-x-auto pb-1 max-w-full">
            {(
              [
                { id: 'classic', label: 'ORIGINAL GRID' },
                { id: 'matrix', label: 'TELEMETRY' },
                { id: 'passport', label: 'PASSPORT VISA' },
                { id: 'ribbon', label: 'EDITORIAL' },
                { id: 'cosmic', label: 'COSMIC STAR-LOG' },
                { id: 'receipt', label: 'LIFE RECEIPT' }
              ] as { id: ChronicleLayout; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  audio.playSFX('sparkle');
                  setLayoutStyle(s.id);
                }}
                className={`px-2 py-1 uppercase border-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  layoutStyle === s.id
                    ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] font-black shadow-[2px_2px_0px_#1c1917]'
                    : 'bg-white text-zinc-700 border-[#1c1917]/40 hover:border-[#1c1917]'
                }`}
              >
                {layoutStyle === s.id && <Check className="w-3 h-3" />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Printable Card Frame Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex items-center justify-center bg-zinc-900/10 border-2 border-dashed border-[#1c1917]/30">
          
          {/* ========================================================
              LAYOUT 0: ORIGINAL CLASSIC GRID (The Beloved Initial Design)
             ======================================================== */}
          {layoutStyle === 'classic' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-classic"
              className="w-full max-w-[380px] bg-[#f7f4ed] border-4 border-[#1c1917] p-3.5 sm:p-5 flex flex-col justify-between shadow-[6px_6px_0px_#1c1917] relative text-[#1c1917]"
            >
              <div className="border-b-2 border-[#1c1917] pb-2 sm:pb-3 flex items-center justify-between gap-2 flex-wrap">
                <BrandLogo size="sm" showSubtitle={true} href="" />
                <div className="flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] font-bold">
                  <span className="px-1.5 sm:px-2 py-0.5 bg-amber-400 text-[#1c1917] border border-[#1c1917] uppercase shadow-sm font-black">
                    {formatBirthDayMonth(birthDate)}
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 bg-white border border-[#1c1917] uppercase shadow-sm">
                    OFFICIAL ARCHIVE
                  </span>
                </div>
              </div>

              <div className="my-1.5 sm:my-3 flex flex-col items-center text-center">
                {photoUrl ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-[#1c1917] p-1 shadow-[2px_2px_0px_#1c1917] mb-1.5 sm:mb-2">
                    <img
                      src={photoUrl}
                      alt={recipientName}
                      className="w-full h-full object-cover grayscale contrast-125"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-400 border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] mb-1.5 sm:mb-2 flex items-center justify-center">
                    <Camera className="w-5 h-5 sm:w-7 sm:h-7 text-[#1c1917]" />
                  </div>
                )}

                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#1c1917] leading-tight">
                  LIVING CHRONICLE OF <br />
                  <span className="bg-amber-400 px-2 py-0.5 border border-[#1c1917] inline-block mt-0.5">
                    {recipientName}
                  </span>
                </h2>
                <span className="font-mono text-[8px] text-zinc-600 uppercase font-bold tracking-wider mt-0.5 block">
                  CUMULATIVE MILESTONE TELEMETRY · BORN {formatBirthDayMonth(birthDate)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 my-1.5 sm:my-2 font-mono">
                <div className="bg-white border-2 border-[#1c1917] p-1.5 sm:p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] sm:text-[8px] text-zinc-500 uppercase font-bold block">TOTAL YEARS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalYears.toLocaleString()}
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-amber-700 uppercase font-bold">SOLAR ORBITS</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-1.5 sm:p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] sm:text-[8px] text-zinc-500 uppercase font-bold block">TOTAL MONTHS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalMonths.toLocaleString()}
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-amber-700 uppercase font-bold">MONTHS LIVED</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-1.5 sm:p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] sm:text-[8px] text-zinc-500 uppercase font-bold block">TOTAL WEEKS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalWeeks.toLocaleString()}
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-amber-700 uppercase font-bold">WEEKS PASSED</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-1.5 sm:p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] sm:text-[8px] text-zinc-500 uppercase font-bold block">TOTAL DAYS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalDays.toLocaleString()}
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-amber-700 uppercase font-bold">DAYS ON EARTH</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-1.5 sm:p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] sm:text-[8px] text-zinc-500 uppercase font-bold block">TOTAL HOURS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalHours.toLocaleString()}
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-amber-700 uppercase font-bold">HOURS OF IMPACT</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-1.5 sm:p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] sm:text-[8px] text-zinc-500 uppercase font-bold block">TOTAL MINUTES</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block truncate">
                    {chronicle.totalMinutes.toLocaleString()}
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-amber-700 uppercase font-bold">MINUTES LIVED</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t-2 border-[#1c1917] flex items-end justify-between font-mono text-[7px] sm:text-[8px] gap-2">
                <div className="text-left">
                  <span className="text-zinc-500 uppercase block font-semibold">VERIFIED MILESTONE</span>
                  <span className="font-bold text-[8px] sm:text-[9px] uppercase text-[#1c1917]">{chronicle.totalDays.toLocaleString()} DAYS OF EXCELLENCE</span>
                </div>

                <div className="text-right">
                  <span className="text-zinc-500 uppercase block font-semibold">STAMPED YEAR</span>
                  <span className="font-bold text-[8px] sm:text-[9px] uppercase text-[#1c1917]">{currentYear} CELEBRATION</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 1: TELEMETRY MATRIX (Technical High-Density Grid)
             ======================================================== */}
          {layoutStyle === 'matrix' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-matrix"
              className="w-full max-w-[390px] bg-[#f7f4ed] border-4 border-[#1c1917] p-4 sm:p-5 flex flex-col justify-between shadow-[6px_6px_0px_#1c1917] relative text-[#1c1917] select-none overflow-hidden"
            >
              <div className="border-b-2 border-[#1c1917] pb-2 flex items-center justify-between gap-2">
                <BrandLogo size="sm" showSubtitle={true} href="" />
                <div className="flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] font-bold">
                  <span className="px-1.5 py-0.5 bg-amber-400 text-[#1c1917] border border-[#1c1917] uppercase font-black">
                    {formatBirthDayMonth(birthDate)}
                  </span>
                  <span className="px-1.5 py-0.5 bg-white border border-[#1c1917] uppercase">
                    SYS. TELEMETRY
                  </span>
                </div>
              </div>

              <div className="my-2 flex flex-col items-center text-center">
                {photoUrl ? (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-[#1c1917] p-1 shadow-[3px_3px_0px_#1c1917] mb-2 relative">
                    <img
                      src={photoUrl}
                      alt={recipientName}
                      className="w-full h-full object-cover grayscale contrast-125"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-400 border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] mb-2 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-[#1c1917]" />
                  </div>
                )}

                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#1c1917] leading-tight">
                  LIFESPAN TELEMETRY: <br />
                  <span className="bg-amber-400 px-2 py-0.5 border border-[#1c1917] inline-block mt-0.5 shadow-[2px_2px_0px_#1c1917]">
                    {recipientName}
                  </span>
                </h2>
                <span className="font-mono text-[7px] sm:text-[8px] text-zinc-600 uppercase font-bold tracking-wider mt-1 block">
                  ORBITAL COORDINATES · BORN {formatBirthDayMonth(birthDate)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-1 font-mono">
                <div className="bg-white border-2 border-[#1c1917] p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] text-zinc-500 uppercase font-bold block">TOTAL YEARS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalYears.toLocaleString()}
                  </span>
                  <div className="w-full bg-zinc-200 h-1 mt-1 border border-[#1c1917] overflow-hidden">
                    <div className="bg-amber-500 h-full w-[85%]" />
                  </div>
                  <span className="text-[6px] text-amber-800 uppercase font-bold mt-0.5 block">SOLAR ORBITS</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] text-zinc-500 uppercase font-bold block">TOTAL MONTHS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalMonths.toLocaleString()}
                  </span>
                  <div className="w-full bg-zinc-200 h-1 mt-1 border border-[#1c1917] overflow-hidden">
                    <div className="bg-amber-500 h-full w-[70%]" />
                  </div>
                  <span className="text-[6px] text-amber-800 uppercase font-bold mt-0.5 block">LUNAR CYCLES</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] text-zinc-500 uppercase font-bold block">TOTAL WEEKS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalWeeks.toLocaleString()}
                  </span>
                  <div className="w-full bg-zinc-200 h-1 mt-1 border border-[#1c1917] overflow-hidden">
                    <div className="bg-amber-500 h-full w-[60%]" />
                  </div>
                  <span className="text-[6px] text-amber-800 uppercase font-bold mt-0.5 block">WEEKS PASSED</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] text-zinc-500 uppercase font-bold block">TOTAL DAYS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalDays.toLocaleString()}
                  </span>
                  <div className="w-full bg-zinc-200 h-1 mt-1 border border-[#1c1917] overflow-hidden">
                    <div className="bg-amber-500 h-full w-[95%]" />
                  </div>
                  <span className="text-[6px] text-amber-800 uppercase font-bold mt-0.5 block">DAYS ON EARTH</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] text-zinc-500 uppercase font-bold block">TOTAL HOURS</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block">
                    {chronicle.totalHours.toLocaleString()}
                  </span>
                  <div className="w-full bg-zinc-200 h-1 mt-1 border border-[#1c1917] overflow-hidden">
                    <div className="bg-amber-500 h-full w-[80%]" />
                  </div>
                  <span className="text-[6px] text-amber-800 uppercase font-bold mt-0.5 block">HOURS OF IMPACT</span>
                </div>

                <div className="bg-white border-2 border-[#1c1917] p-2 text-center shadow-[1px_1px_0px_#1c1917]">
                  <span className="text-[7px] text-zinc-500 uppercase font-bold block">TOTAL MINUTES</span>
                  <span className="text-base sm:text-lg font-black text-[#1c1917] leading-tight block truncate">
                    {chronicle.totalMinutes.toLocaleString()}
                  </span>
                  <div className="w-full bg-zinc-200 h-1 mt-1 border border-[#1c1917] overflow-hidden">
                    <div className="bg-amber-500 h-full w-[90%]" />
                  </div>
                  <span className="text-[6px] text-amber-800 uppercase font-bold mt-0.5 block">MINUTES LIVED</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t-2 border-[#1c1917] flex items-end justify-between font-mono text-[8px] gap-2">
                <div>
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">CALIBRATED STATUS</span>
                  <span className="font-black uppercase text-[#1c1917]">{chronicle.totalDays.toLocaleString()} DAYS OF EXCELLENCE</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 uppercase block font-semibold text-[7px]">STAMPED YEAR</span>
                  <span className="font-black uppercase text-[#1c1917]">{currentYear} ARCHIVE</span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 2: CITIZEN PASSPORT (Official Visa Certificate)
             ======================================================== */}
          {layoutStyle === 'passport' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-passport"
              className="w-full max-w-[390px] bg-[#fcf9f2] border-4 border-[#1c1917] p-4 sm:p-5 flex flex-col justify-between shadow-[6px_6px_0px_#1c1917] relative text-[#1c1917] select-none overflow-hidden"
            >
              <div className="border-b-2 border-[#1c1917] pb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 bg-[#1c1917] text-amber-400 font-bold font-mono text-[9px] flex items-center justify-center">
                    ★
                  </div>
                  <div className="text-left">
                    <span className="font-mono text-[7px] text-zinc-500 uppercase font-bold block leading-none">PASSPORT ARCHIVE</span>
                    <span className="font-mono text-[10px] font-black uppercase text-[#1c1917] leading-none">PLANET EARTH // LIFESPAN VISA</span>
                  </div>
                </div>
                <span className="font-mono text-[8px] font-black bg-amber-400 px-1.5 py-0.5 border border-[#1c1917] uppercase">
                  EP-{currentYear}
                </span>
              </div>

              <div className="my-2 grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5 flex flex-col items-center">
                  <div className="w-24 h-28 bg-white border-2 border-[#1c1917] p-1 shadow-[3px_3px_0px_#1c1917] relative overflow-hidden">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={recipientName}
                        className="w-full h-full object-cover grayscale contrast-125"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                        <Camera className="w-8 h-8 text-zinc-400" />
                      </div>
                    )}
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full border border-amber-600/80 bg-amber-400/20 backdrop-blur-xs flex items-center justify-center rotate-[-15deg] pointer-events-none">
                      <span className="font-mono text-[5px] font-black text-amber-900 uppercase text-center">
                        VERIFIED<br />CITIZEN
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-[7px] text-zinc-500 font-bold uppercase mt-1">
                    NATIONAL: EARTH
                  </span>
                </div>

                <div className="col-span-7 flex flex-col font-mono text-left">
                  <div className="border-b border-[#1c1917]/30 pb-1 mb-1">
                    <span className="text-[6px] text-zinc-500 uppercase block font-bold leading-none">HOLDER / NAME</span>
                    <span className="text-xs font-black uppercase text-[#1c1917] leading-tight block">{recipientName}</span>
                  </div>

                  <div className="border-b border-[#1c1917]/30 pb-1 mb-1 grid grid-cols-2 gap-1">
                    <div>
                      <span className="text-[6px] text-zinc-500 uppercase block font-bold leading-none">DATE OF BIRTH</span>
                      <span className="text-[9px] font-bold text-amber-800">{formatBirthDayMonth(birthDate)}</span>
                    </div>
                    <div>
                      <span className="text-[6px] text-zinc-500 uppercase block font-bold leading-none">SOLAR ORBITS</span>
                      <span className="text-[9px] font-bold text-[#1c1917]">{chronicle.totalYears} YEARS</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-[8px]">
                    <div className="flex justify-between border-b border-dotted border-[#1c1917]/30 py-0.5">
                      <span className="text-zinc-500">DAYS ON EARTH:</span>
                      <span className="font-black text-[#1c1917]">{chronicle.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-dotted border-[#1c1917]/30 py-0.5">
                      <span className="text-zinc-500">LUNAR CYCLES:</span>
                      <span className="font-bold text-[#1c1917]">{chronicle.totalMonths.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-dotted border-[#1c1917]/30 py-0.5">
                      <span className="text-zinc-500">HOURS OF IMPACT:</span>
                      <span className="font-bold text-[#1c1917]">{chronicle.totalHours.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-[#1c1917] pt-1.5 font-mono text-[7px] text-zinc-600 uppercase tracking-widest leading-tight">
                <div>P&lt;EARTH&lt;&lt;{(recipientName || 'RECIPIENT').toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                <div>{chronicle.totalDays}D&lt;&lt;{chronicle.totalYears}Y&lt;&lt;{currentYear}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 3: LUXURY EDITORIAL (Feature Magazine Spread)
             ======================================================== */}
          {layoutStyle === 'ribbon' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-ribbon"
              className="w-full max-w-[390px] bg-[#1a1816] border-4 border-[#f59e0b] p-4 sm:p-5 flex flex-col justify-between shadow-[6px_6px_0px_#f59e0b] relative text-[#f5f5f4] select-none overflow-hidden"
            >
              <div className="border-b border-[#f59e0b]/40 pb-2 flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-widest text-[#f59e0b] font-black">
                  ★ LUXURY MILESTONE CHRONICLE ★
                </span>
                <span className="font-mono text-[8px] bg-[#f59e0b] text-[#12110e] font-black px-1.5 py-0.2 uppercase">
                  {currentYear} EDITION
                </span>
              </div>

              <div className="my-2 text-center flex flex-col items-center">
                {photoUrl && (
                  <div className="w-16 h-16 rounded-full border-2 border-[#f59e0b] p-0.5 mb-1.5 overflow-hidden shadow-[0px_0px_10px_rgba(245,158,11,0.2)]">
                    <img
                      src={photoUrl}
                      alt={recipientName}
                      className="w-full h-full object-cover rounded-full grayscale contrast-125"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
                <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-wider">
                  CELEBRATING THE TIME OF
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold italic text-amber-300">
                  {recipientName}
                </h2>

                <div className="w-full bg-[#262320] border-2 border-[#f59e0b] py-2 px-3 my-2 text-center shadow-[3px_3px_0px_#f59e0b]">
                  <span className="font-mono text-[7px] text-amber-400 uppercase tracking-widest block font-bold">
                    CUMULATIVE EXISTENCE
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight leading-none block my-0.5">
                    {chronicle.totalDays.toLocaleString()}
                  </span>
                  <span className="font-mono text-[7px] text-zinc-300 uppercase font-bold tracking-wider">
                    GLORIOUS DAYS ON THIS EARTH
                  </span>
                </div>
              </div>

              <div className="space-y-1 font-mono text-[8px]">
                <div className="bg-[#262320] border border-[#f59e0b]/40 px-2.5 py-1 flex items-center justify-between">
                  <span className="text-zinc-400">☀️ SOLAR ORBITS:</span>
                  <span className="font-black text-amber-400">{chronicle.totalYears} YEARS</span>
                </div>
                <div className="bg-[#262320] border border-[#f59e0b]/40 px-2.5 py-1 flex items-center justify-between">
                  <span className="text-zinc-400">🌙 LUNAR PHASES:</span>
                  <span className="font-black text-amber-400">{chronicle.totalMonths} MONTHS</span>
                </div>
                <div className="bg-[#262320] border border-[#f59e0b]/40 px-2.5 py-1 flex items-center justify-between">
                  <span className="text-zinc-400">⚡ HOURS OF IMPACT:</span>
                  <span className="font-black text-amber-400">{chronicle.totalHours.toLocaleString()} HOURS</span>
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-[#f59e0b]/40 flex items-center justify-between font-mono text-[7px] text-zinc-400">
                <span>BORN: {formatBirthDayMonth(birthDate)}</span>
                <span className="text-[#f59e0b] font-bold">VERIFIED ARCHIVE</span>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 4: COSMIC STAR-LOG (Deep Space Astronomy Journey)
             ======================================================== */}
          {layoutStyle === 'cosmic' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-cosmic"
              className="w-full max-w-[390px] bg-[#090d16] border-4 border-[#38bdf8] p-4 sm:p-5 flex flex-col justify-between shadow-[6px_6px_0px_#0284c7] relative text-[#f0f9ff] select-none overflow-hidden"
            >
              {/* Cosmic Header */}
              <div className="border-b border-[#38bdf8]/40 pb-2 flex items-center justify-between font-mono text-[8px]">
                <span className="text-[#38bdf8] font-black uppercase tracking-widest flex items-center gap-1">
                  ✦ DEEP SPACE STAR-LOG
                </span>
                <span className="bg-[#0284c7] text-white px-2 py-0.5 font-bold uppercase">
                  MISSION #{currentYear}
                </span>
              </div>

              {/* Cosmic Hero Center */}
              <div className="my-2 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#38bdf8] p-1 mb-2 relative flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={recipientName}
                        className="w-full h-full object-cover grayscale contrast-125"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#38bdf8]">
                        <Camera className="w-7 h-7" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 bg-[#38bdf8] text-[#090d16] font-mono text-[7px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    VOYAGER
                  </div>
                </div>

                <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                  {recipientName}
                </h2>
                <span className="font-mono text-[7px] text-[#38bdf8] uppercase tracking-wider block">
                  CELESTIAL TIME ELAPSED SINCE {formatBirthDayMonth(birthDate)}
                </span>
              </div>

              {/* Starlight Metrics Grid */}
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[7px] my-1">
                <div className="bg-[#131b2e] border border-[#38bdf8]/30 p-1.5 text-center">
                  <span className="text-slate-400 block">SOLAR LAPS</span>
                  <span className="text-sm font-black text-[#38bdf8] block">{chronicle.totalYears}</span>
                  <span className="text-[6px] text-slate-500">ORBITS</span>
                </div>
                <div className="bg-[#131b2e] border border-[#38bdf8]/30 p-1.5 text-center">
                  <span className="text-slate-400 block">EARTH TURNS</span>
                  <span className="text-sm font-black text-amber-300 block">{chronicle.totalDays.toLocaleString()}</span>
                  <span className="text-[6px] text-slate-500">DAYS</span>
                </div>
                <div className="bg-[#131b2e] border border-[#38bdf8]/30 p-1.5 text-center">
                  <span className="text-slate-400 block">LIGHT TIME</span>
                  <span className="text-sm font-black text-[#38bdf8] block">{chronicle.totalHours.toLocaleString()}</span>
                  <span className="text-[6px] text-slate-500">HOURS</span>
                </div>
              </div>

              {/* Cosmic Footer */}
              <div className="mt-2 pt-1.5 border-t border-[#38bdf8]/30 flex justify-between font-mono text-[7px] text-slate-400">
                <span>INTERSTELLAR ARCHIVE</span>
                <span className="text-[#38bdf8] font-bold">100% LIVING PULSE</span>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 5: LIFE RECEIPT (Modernist Thermal Ledger)
             ======================================================== */}
          {layoutStyle === 'receipt' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-receipt"
              className="w-full max-w-[370px] bg-[#fffdf9] border-2 border-dashed border-[#1c1917] p-4 sm:p-5 flex flex-col justify-between shadow-[5px_5px_0px_#1c1917] relative text-[#1c1917] font-mono select-none"
            >
              {/* Receipt Header */}
              <div className="text-center border-b-2 border-dashed border-[#1c1917] pb-2">
                <span className="text-xs font-black tracking-widest block uppercase">
                  *** TIME OF LIFE RECEIPT ***
                </span>
                <span className="text-[8px] text-zinc-600 uppercase block">
                  CUSTOMER: {recipientName}
                </span>
                <span className="text-[8px] text-zinc-500 uppercase block">
                  ORIGIN DATE: {formatBirthDayMonth(birthDate)} · {currentYear}
                </span>
              </div>

              {/* Receipt Itemized Table */}
              <div className="my-2 space-y-1 text-[9px]">
                <div className="flex justify-between border-b border-dotted border-zinc-400 pb-0.5 font-bold">
                  <span>ITEM / TIME UNIT</span>
                  <span>QUANTITY</span>
                </div>
                <div className="flex justify-between">
                  <span>1. SOLAR ORBITS</span>
                  <span className="font-bold">{chronicle.totalYears} YRS</span>
                </div>
                <div className="flex justify-between">
                  <span>2. LUNAR PHASES</span>
                  <span className="font-bold">{chronicle.totalMonths} MOS</span>
                </div>
                <div className="flex justify-between">
                  <span>3. WEEKS OF GROWTH</span>
                  <span className="font-bold">{chronicle.totalWeeks.toLocaleString()} WKS</span>
                </div>
                <div className="flex justify-between">
                  <span>4. DAYS ON EARTH</span>
                  <span className="font-black text-amber-700">{chronicle.totalDays.toLocaleString()} DAYS</span>
                </div>
                <div className="flex justify-between">
                  <span>5. HOURS OF IMPACT</span>
                  <span className="font-bold">{chronicle.totalHours.toLocaleString()} HRS</span>
                </div>
                <div className="flex justify-between">
                  <span>6. MINUTES LIVED</span>
                  <span className="font-bold">{chronicle.totalMinutes.toLocaleString()} MIN</span>
                </div>
              </div>

              {/* Receipt Total & Barcode */}
              <div className="border-t-2 border-dashed border-[#1c1917] pt-2 text-center">
                <div className="flex justify-between font-black text-xs my-0.5">
                  <span>TOTAL LIFE SCORE:</span>
                  <span className="text-amber-600">PRICELESS (∞)</span>
                </div>
                <p className="text-[7px] text-zinc-500 uppercase mt-1">
                  THANK YOU FOR BEING A LEGEND · KEEP SHINING
                </p>
                <div className="mt-1.5 text-[8px] tracking-[0.3em] font-black text-center overflow-hidden whitespace-nowrap">
                  |||||| | |||||||| |||| | |||||| |||||
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="mt-3 pt-3 border-t-2 border-[#1c1917] flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>EXPORTING 300 DPI IMAGE...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>[ DOWNLOAD MILESTONE CARD (PNG) ]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

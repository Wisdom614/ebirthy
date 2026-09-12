'use client';

import React, { useRef, useState } from 'react';
import { LifeChronicle } from '../../utils/chronicleCalculator';
import { formatBirthDayMonth } from '../../utils/dateFormatter';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { X, Download, Loader2, Sparkles, Image as ImageIcon, Camera, Check } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

import { trackEvent } from '../../utils/analytics/tracker';

export type ChronicleLayout = 'id_pass' | 'classic' | 'editorial' | 'polaroid' | 'monolith' | 'receipt';

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
  const [layoutStyle, setLayoutStyle] = useState<ChronicleLayout>('id_pass');

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
            <span>CHRONICLE DESIGN:</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold overflow-x-auto pb-1 max-w-full">
            {(
              [
                { id: 'id_pass', label: '1. CITIZEN ID PASS' },
                { id: 'classic', label: '2. ORIGINAL CLASSIC' },
                { id: 'editorial', label: '3. SWISS EDITORIAL' },
                { id: 'polaroid', label: '4. VINTAGE POLAROID' },
                { id: 'monolith', label: '5. OBSIDIAN MONOLITH' },
                { id: 'receipt', label: '6. THERMAL RECEIPT' }
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
              LAYOUT 1: CITIZEN ID PASS (Realistic Official Lifespan ID Card)
             ======================================================== */}
          {layoutStyle === 'id_pass' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-id-pass"
              className="w-full max-w-[390px] bg-[#f8f6f0] border-4 border-[#1c1917] p-3.5 sm:p-5 flex flex-col justify-between shadow-[7px_7px_0px_#1c1917] relative text-[#1c1917] select-none overflow-hidden rounded-xl"
            >
              {/* Lanyard Slot Cutout */}
              <div className="w-14 h-2 bg-[#1c1917] rounded-full mx-auto mb-2 opacity-90 shadow-inner" />

              {/* ID Card Top Header */}
              <div className="border-b-2 border-[#1c1917] pb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#1c1917] text-amber-400 font-bold font-mono text-[10px] flex items-center justify-center rounded">
                    ★
                  </div>
                  <div>
                    <span className="font-mono text-[7px] text-zinc-500 uppercase font-black block leading-none tracking-wider">
                      DEPARTMENT OF LIFESPAN TELEMETRY
                    </span>
                    <span className="font-mono text-[10px] font-black uppercase text-[#1c1917] leading-tight block">
                      CITIZEN IDENTIFICATION PASS
                    </span>
                  </div>
                </div>
                <span className="bg-amber-400 text-[#1c1917] font-mono text-[8px] font-black px-1.5 py-0.5 border border-[#1c1917] rounded uppercase">
                  EP-{currentYear}
                </span>
              </div>

              {/* ID Body: Photo & EMV Chip + Data Ledger */}
              <div className="my-2 grid grid-cols-12 gap-3 items-center">
                {/* Left Column: ID Photo + Gold Chip */}
                <div className="col-span-5 flex flex-col items-center">
                  <div className="w-24 h-28 bg-white border-2 border-[#1c1917] p-1 shadow-[3px_3px_0px_#1c1917] relative rounded overflow-hidden">
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
                    {/* Holographic Security Overlay Seal */}
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full border border-amber-600/80 bg-amber-400/25 backdrop-blur-xs flex items-center justify-center rotate-[-12deg] pointer-events-none">
                      <span className="font-mono text-[5px] font-black text-amber-900 uppercase text-center leading-tight">
                        VERIFIED<br />CITIZEN<br />★ 100% ★
                      </span>
                    </div>
                  </div>

                  {/* Golden Smart EMV Chip Graphic */}
                  <div className="w-10 h-7 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-700 rounded mt-1.5 shadow-xs relative flex items-center justify-center overflow-hidden">
                    <div className="w-full h-[1px] bg-amber-700/60 absolute top-1/2 -translate-y-1/2" />
                    <div className="h-full w-[1px] bg-amber-700/60 absolute left-1/3" />
                    <div className="h-full w-[1px] bg-amber-700/60 absolute right-1/3" />
                    <div className="w-3 h-3 rounded-full border border-amber-700/50" />
                  </div>
                </div>

                {/* Right Column: Structured Identity Fields */}
                <div className="col-span-7 flex flex-col font-mono text-left space-y-1">
                  <div className="bg-white border border-[#1c1917] p-1 rounded shadow-xs">
                    <span className="text-[6px] text-zinc-500 uppercase block font-bold leading-none">HOLDER / CITIZEN</span>
                    <span className="text-xs font-black uppercase text-[#1c1917] leading-tight block truncate">
                      {recipientName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-white border border-[#1c1917] p-1 rounded shadow-xs">
                      <span className="text-[6px] text-zinc-500 uppercase block font-bold leading-none">DOB</span>
                      <span className="text-[9px] font-black text-amber-800 leading-tight block">
                        {formatBirthDayMonth(birthDate)}
                      </span>
                    </div>
                    <div className="bg-white border border-[#1c1917] p-1 rounded shadow-xs">
                      <span className="text-[6px] text-zinc-500 uppercase block font-bold leading-none">SOLAR ORBITS</span>
                      <span className="text-[9px] font-black text-[#1c1917] leading-tight block">
                        {chronicle.totalYears} YRS
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-[#1c1917] p-1 rounded shadow-xs space-y-0.5 text-[8px]">
                    <div className="flex justify-between border-b border-zinc-200 pb-0.5">
                      <span className="text-zinc-500 font-bold text-[7px]">DAYS ON EARTH:</span>
                      <span className="font-black text-[#1c1917]">{chronicle.totalDays.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-200 pb-0.5">
                      <span className="text-zinc-500 font-bold text-[7px]">HOURS LIVED:</span>
                      <span className="font-bold text-[#1c1917]">{chronicle.totalHours.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500 font-bold text-[7px]">STATUS:</span>
                      <span className="font-black text-amber-700">LIVING LEGEND</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Machine Readable Zone (MRZ Chevrons Strip) */}
              <div className="bg-[#1c1917] text-amber-300 p-1.5 rounded font-mono text-[7px] uppercase tracking-widest leading-tight">
                <div className="truncate">IDETH&lt;&lt;{(recipientName || 'RECIPIENT').toUpperCase().replace(/\s+/g, '&lt;')}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                <div className="truncate">EP{currentYear}&lt;&lt;{chronicle.totalDays}D&lt;&lt;{chronicle.totalYears}Y&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 2: ORIGINAL CLASSIC (Swiss Commemorative 2x3 Grid)
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
              LAYOUT 3: SWISS EDITORIAL (Magazine Feature Cover)
             ======================================================== */}
          {layoutStyle === 'editorial' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-editorial"
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
              LAYOUT 4: VINTAGE POLAROID (Instant Film Keepsake)
             ======================================================== */}
          {layoutStyle === 'polaroid' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-polaroid"
              className="w-full max-w-[380px] bg-[#f4ede2] border-4 border-[#854d0e] p-4 sm:p-5 flex flex-col justify-between shadow-[6px_6px_0px_#854d0e] relative text-[#451a03] select-none overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-[#854d0e]/40 pb-1 font-mono text-[8px] text-[#854d0e] font-bold">
                <span>▶ KODAK SAFETY FILM 400</span>
                <span>EXP 36 · {currentYear}</span>
              </div>

              <div className="my-2 flex flex-col items-center">
                <div className="w-full max-w-[260px] bg-white border-2 border-[#854d0e] p-2.5 pb-3.5 shadow-[4px_4px_0px_#854d0e] flex flex-col items-center">
                  <div className="w-full aspect-square bg-[#ece5d8] border border-[#854d0e]/40 overflow-hidden relative mb-2">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={recipientName}
                        className="w-full h-full object-cover contrast-110 sepia-[0.15]"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-[#854d0e]/60" />
                      </div>
                    )}
                    <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-amber-300 font-mono text-[7px] font-bold px-1 py-0.2">
                      {formatBirthDayMonth(birthDate)}
                    </div>
                  </div>

                  <h2 className="font-serif text-sm sm:text-base font-bold italic text-[#451a03]">
                    {recipientName} — {chronicle.totalYears} Years
                  </h2>
                  <span className="font-mono text-[7px] text-[#854d0e] uppercase tracking-widest">
                    ★ {chronicle.totalDays.toLocaleString()} DAYS LIVED ★
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-[#854d0e] pt-1.5 flex justify-between items-center font-mono text-[8px]">
                <span>{chronicle.totalHours.toLocaleString()} HOURS OF JOY</span>
                <span className="font-bold text-[#854d0e]">VINTAGE KEEPSAKE</span>
              </div>
            </div>
          )}

          {/* ========================================================
              LAYOUT 5: OBSIDIAN MONOLITH (Modernist Dark Gold)
             ======================================================== */}
          {layoutStyle === 'monolith' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-monolith"
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
                  <div className="w-14 h-14 rounded-full border-2 border-[#f59e0b] p-0.5 mb-1.5 overflow-hidden shadow-[0px_0px_10px_rgba(245,158,11,0.2)]">
                    <img
                      src={photoUrl}
                      alt={recipientName}
                      className="w-full h-full object-cover rounded-full grayscale contrast-125"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
                <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-wider">
                  HONORING THE TIME OF
                </span>
                <h2 className="font-serif text-base sm:text-lg font-bold italic text-amber-300">
                  {recipientName}
                </h2>

                <div className="w-full bg-[#262320] border-2 border-[#f59e0b] py-2 px-3 my-1.5 text-center shadow-[3px_3px_0px_#f59e0b]">
                  <span className="font-mono text-[7px] text-amber-400 uppercase tracking-widest block font-bold">
                    CUMULATIVE EXISTENCE
                  </span>
                  <span className="text-2xl font-black font-mono text-white tracking-tight leading-none block my-0.5">
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
              LAYOUT 6: THERMAL LIFE RECEIPT (Modernist Thermal Ledger)
             ======================================================== */}
          {layoutStyle === 'receipt' && (
            <div
              ref={cardRef}
              id="printable-chronicle-card-receipt"
              className="w-full max-w-[370px] bg-[#fffdf9] border-2 border-dashed border-[#1c1917] p-4 sm:p-5 flex flex-col justify-between shadow-[5px_5px_0px_#1c1917] relative text-[#1c1917] font-mono select-none"
            >
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

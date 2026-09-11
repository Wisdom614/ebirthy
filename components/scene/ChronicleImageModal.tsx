'use client';

import React, { useRef, useState } from 'react';
import { LifeChronicle } from '../../utils/chronicleCalculator';
import { formatBirthDayMonth } from '../../utils/dateFormatter';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { X, Download, Loader2, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

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

  if (!isOpen) return null;

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
      link.download = `${safeName}-life-chronicle-card.png`;
      link.href = dataUrl;
      link.click();

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

  const currentYear = new Date().getFullYear();

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full bg-white border-2 border-[#1c1917] p-4 sm:p-6 shadow-[8px_8px_0px_#1c1917] text-[#1c1917] animate-in zoom-in-95 duration-150 flex flex-col max-h-[95vh]"
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <BrandLogo size="sm" showSubtitle={false} href="" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 border-l-2 border-[#1c1917] pl-2">
              [ MILESTONE CHRONICLE CARD ]
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Printable Card Frame Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 flex items-center justify-center bg-zinc-900/10 border-2 border-dashed border-[#1c1917]/30">
          
          {/* Print Target Container (300 DPI Layout) */}
          <div
            ref={cardRef}
            id="printable-chronicle-card"
            className="w-full max-w-[380px] bg-[#f7f4ed] border-3 sm:border-4 border-[#1c1917] p-3.5 sm:p-6 flex flex-col justify-between shadow-[4px_4px_0px_#1c1917] sm:shadow-[6px_6px_0px_#1c1917] relative text-[#1c1917]"
          >
            {/* Top Structural Header */}
            <div className="border-b-2 border-[#1c1917] pb-2 sm:pb-3 flex items-center justify-between gap-2 flex-wrap">
              <BrandLogo size="sm" showSubtitle={true} href="" />
              <div className="flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] font-bold">
                <span className="px-1.5 sm:px-2 py-0.5 bg-amber-400 text-[#1c1917] border border-[#1c1917] uppercase shadow-sm">
                  {formatBirthDayMonth(birthDate)}
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 bg-white border border-[#1c1917] uppercase shadow-sm">
                  OFFICIAL ARCHIVE
                </span>
              </div>
            </div>

            {/* Main Portrait & Name Header */}
            <div className="my-1.5 sm:my-3 flex flex-col items-center text-center">
              {/* Recipient Photo Frame Plate */}
              {photoUrl ? (
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white border-2 border-[#1c1917] p-1 shadow-[2px_2px_0px_#1c1917] sm:shadow-[3px_3px_0px_#1c1917] mb-1.5 sm:mb-2.5">
                  <img
                    src={photoUrl}
                    alt={recipientName}
                    className="w-full h-full object-cover grayscale contrast-125"
                    crossOrigin="anonymous"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-400 border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] mb-1.5 sm:mb-2.5 flex items-center justify-center">
                  <Camera className="w-5 h-5 sm:w-7 sm:h-7 text-[#1c1917]" />
                </div>
              )}

              <h2 className="text-base sm:text-xl font-black uppercase tracking-tight text-[#1c1917] leading-tight">
                LIVING CHRONICLE OF <br />
                <span className="bg-amber-400 px-2 py-0.5 border border-[#1c1917] inline-block mt-0.5">
                  {recipientName}
                </span>
              </h2>
              <span className="font-mono text-[8px] text-zinc-600 uppercase font-bold tracking-wider mt-0.5 block">
                CUMULATIVE MILESTONE TELEMETRY · BORN {formatBirthDayMonth(birthDate)}
              </span>
            </div>

            {/* Total Units 2x3 Grid */}
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

            {/* Bottom Signature & Verification Seal */}
            <div className="mt-2 pt-2 border-t-2 border-[#1c1917] flex items-end justify-between font-mono text-[7px] sm:text-[8px] gap-2">
              <div className="text-left">
                <span className="text-zinc-500 uppercase block font-semibold">VERIFIED MILESTONE</span>
                <span className="font-bold text-[8px] sm:text-[10px] uppercase text-[#1c1917]">{chronicle.totalDays.toLocaleString()} DAYS OF EXCELLENCE</span>
              </div>

              <div className="text-right">
                <span className="text-zinc-500 uppercase block font-semibold">STAMPED YEAR</span>
                <span className="font-bold text-[8px] sm:text-[10px] uppercase text-[#1c1917]">{currentYear} CELEBRATION</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="mt-4 pt-3 border-t-2 border-[#1c1917] flex items-center gap-2 flex-shrink-0">
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

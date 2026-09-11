'use client';

import React, { useState, useEffect } from 'react';
import { calculateLifeChronicle, LifeChronicle } from '../../utils/chronicleCalculator';
import { formatBirthDayMonth } from '../../utils/dateFormatter';
import { Clock, Calendar, Download, Camera, Image as ImageIcon } from 'lucide-react';
import { ChronicleImageModal } from './ChronicleImageModal';

interface LifeChronometerProps {
  birthDate?: string;
  recipientName: string;
  photoUrl?: string;
}

export const LifeChronometer: React.FC<LifeChronometerProps> = ({
  birthDate,
  recipientName,
  photoUrl
}) => {
  const [chronicle, setChronicle] = useState<LifeChronicle>(() =>
    calculateLifeChronicle(birthDate)
  );
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  useEffect(() => {
    if (!birthDate) return;

    // Update telemetry immediately and every 1000ms
    setChronicle(calculateLifeChronicle(birthDate));

    const interval = setInterval(() => {
      setChronicle(calculateLifeChronicle(birthDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [birthDate]);

  if (!birthDate || !chronicle.isValid) {
    return null;
  }

  const units = [
    { label: 'TOTAL YEARS', value: chronicle.totalYears.toLocaleString(), unitName: 'SOLAR ORBITS' },
    { label: 'TOTAL MONTHS', value: chronicle.totalMonths.toLocaleString(), unitName: 'MONTHS LIVED' },
    { label: 'TOTAL WEEKS', value: chronicle.totalWeeks.toLocaleString(), unitName: 'WEEKS PASSED' },
    { label: 'TOTAL DAYS', value: chronicle.totalDays.toLocaleString(), unitName: 'DAYS ON EARTH' },
    { label: 'TOTAL HOURS', value: chronicle.totalHours.toLocaleString(), unitName: 'HOURS OF IMPACT' },
    { label: 'TOTAL MINUTES', value: chronicle.totalMinutes.toLocaleString(), unitName: 'MINUTES LIVED' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white border-2 border-[#1c1917] p-5 sm:p-7 shadow-[6px_6px_0px_#1c1917] text-[#1c1917] relative overflow-hidden">
        {/* Top Architectural Header */}
        <div className="border-b-2 border-[#1c1917] pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1c1917]">
              LIVING CHRONICLE OF {recipientName}
            </h3>
            <span className="font-mono text-[10px] text-zinc-500 uppercase font-bold tracking-wider block mt-0.5">
              CUMULATIVE LIFETIME MILESTONE RECORD
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            <span className="px-2.5 py-1 bg-[#f7f4ed] border border-[#1c1917] font-bold text-[#1c1917] flex items-center gap-1.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>BORN: {formatBirthDayMonth(birthDate)}</span>
            </span>

            <button
              onClick={() => setIsCardModalOpen(true)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-black uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer text-xs"
              title="Export shareable milestone image card"
            >
              <Download className="w-3.5 h-3.5" />
              <span>[ EXPORT CARD ]</span>
            </button>
          </div>
        </div>

        {/* 6 Grid Units */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="bg-[#f7f4ed] border-2 border-[#1c1917] p-3 text-center shadow-[2px_2px_0px_#1c1917] hover:translate-y-[-2px] transition-transform"
            >
              <span className="font-mono text-[9px] font-bold uppercase text-zinc-500 block mb-1">
                {unit.label}
              </span>
              <div className="font-mono font-black text-xl sm:text-2xl text-[#1c1917] tracking-tight truncate">
                {unit.value}
              </div>
              <span className="font-mono text-[8px] font-bold uppercase text-amber-700 tracking-wider block mt-1">
                {unit.unitName}
              </span>
            </div>
          ))}
        </div>

        {/* Real-Time Total Seconds Live Pulsar Bar */}
        <div className="mt-4 pt-4 border-t-2 border-[#1c1917]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono font-bold">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[#1c1917] uppercase tracking-wide">
              TOTAL SECONDS LIVED (LIVE TICKER):
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 font-mono font-black text-sm">
              {chronicle.totalSeconds.toLocaleString()}s
            </span>
          </div>

          <div className="text-zinc-600 text-[11px] uppercase tracking-wider text-center sm:text-right">
            <span>MILESTONE: </span>
            <span className="text-[#1c1917] font-black">
              {chronicle.totalDays.toLocaleString()} DAYS OF PURE EXCELLENCE
            </span>
          </div>
        </div>
      </div>

      {/* Export Chronicle Card Modal */}
      <ChronicleImageModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        recipientName={recipientName}
        birthDate={birthDate}
        chronicle={chronicle}
        photoUrl={photoUrl}
      />
    </div>
  );
};

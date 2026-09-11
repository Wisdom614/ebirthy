'use client';

import React, { useState, useEffect } from 'react';
import { calculateLifeChronicle, LifeChronicle } from '../../utils/chronicleCalculator';
import { formatBirthDayMonth } from '../../utils/dateFormatter';
import { Clock, Activity, Sparkles, Calendar } from 'lucide-react';

interface LifeChronometerProps {
  birthDate?: string;
  recipientName: string;
}

export const LifeChronometer: React.FC<LifeChronometerProps> = ({ birthDate, recipientName }) => {
  const [chronicle, setChronicle] = useState<LifeChronicle>(() =>
    calculateLifeChronicle(birthDate)
  );

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
    { label: 'YEARS', value: chronicle.years, unitName: 'SOLAR ORBITS' },
    { label: 'MONTHS', value: chronicle.months, unitName: 'FULL MONTHS' },
    { label: 'WEEKS', value: chronicle.weeks, unitName: 'WEEKS PASSED' },
    { label: 'DAYS', value: chronicle.days, unitName: 'DAYS' },
    { label: 'HOURS', value: chronicle.hours, unitName: 'HOURS' },
    { label: 'MINUTES', value: chronicle.minutes, unitName: 'MINUTES' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <div className="bg-white border-2 border-[#1c1917] p-5 sm:p-7 shadow-[6px_6px_0px_#1c1917] text-[#1c1917] relative overflow-hidden">
        {/* Top Architectural Header */}
        <div className="border-b-2 border-[#1c1917] pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="font-mono text-[10px] uppercase font-black tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 border border-amber-300">
                [ REAL-TIME LIFE CHRONOMETER ]
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1c1917]">
              LIVING CHRONICLE OF {recipientName}
            </h3>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 bg-[#f7f4ed] border border-[#1c1917] font-bold text-[#1c1917] flex items-center gap-1.5 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>BORN: {formatBirthDayMonth(birthDate)}</span>
            </span>
            <span className="px-2.5 py-1 bg-amber-400 border border-[#1c1917] font-black text-[#1c1917] shadow-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>LIVE</span>
            </span>
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
              <div className="font-mono font-black text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
                {unit.value}
              </div>
              <span className="font-mono text-[8px] font-bold uppercase text-amber-700 tracking-wider block mt-1">
                {unit.unitName}
              </span>
            </div>
          ))}
        </div>

        {/* Real-Time Seconds Live Pulsar Bar */}
        <div className="mt-4 pt-4 border-t-2 border-[#1c1917]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[#1c1917] uppercase tracking-wide">
              SECONDS TICKING:
            </span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400 font-mono font-black">
              {String(chronicle.seconds).padStart(2, '0')}s
            </span>
          </div>

          <div className="text-zinc-600 text-[11px] uppercase tracking-wider text-center sm:text-right">
            <span>CUMULATIVE: </span>
            <span className="text-[#1c1917] font-black">
              {chronicle.totalDays.toLocaleString()} DAYS · {chronicle.totalHours.toLocaleString()} HOURS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

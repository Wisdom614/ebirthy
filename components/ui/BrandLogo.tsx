'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  href = '/',
  showSubtitle = true,
  className = ''
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none group cursor-pointer ${className}`}>
      {/* Swiss Architectural Badge Mark */}
      <div
        className={`relative bg-amber-400 border-2 border-[#1c1917] flex items-center justify-center transition-transform group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex-shrink-0 ${
          isSm
            ? 'w-7 h-7 shadow-[2px_2px_0px_#1c1917]'
            : isLg
            ? 'w-10 h-10 shadow-[3px_3px_0px_#1c1917]'
            : 'w-8 h-8 shadow-[2px_2px_0px_#1c1917]'
        }`}
      >
        <svg
          viewBox="0 0 32 32"
          className={isSm ? 'w-4 h-4' : isLg ? 'w-6 h-6' : 'w-5 h-5'}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Architectural Candle Spark */}
          <path
            d="M16 3 L17.5 8 L22 9.5 L17.5 11 L16 16 L14.5 11 L10 9.5 L14.5 8 Z"
            fill="#1c1917"
          />
          {/* 'e' letterform */}
          <rect x="9" y="17" width="12" height="2.5" fill="#1c1917" />
          <rect x="9" y="17" width="2.5" height="10" fill="#1c1917" />
          <rect x="9" y="21" width="10" height="2" fill="#1c1917" />
          <rect x="9" y="25" width="12" height="2.5" fill="#1c1917" />
          <rect x="18.5" y="17" width="2.5" height="4.5" fill="#1c1917" />
          <rect x="22.5" y="25" width="2.5" height="2.5" fill="#1c1917" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <span
          className={`font-mono font-black tracking-tight uppercase text-[#1c1917] leading-none ${
            isSm ? 'text-xs' : isLg ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
          }`}
        >
          EBIRTHY
        </span>
        {showSubtitle && (
          <span
            className={`font-mono text-amber-700 uppercase tracking-widest font-bold block truncate leading-none mt-1 ${
              isSm ? 'text-[8px]' : 'text-[9px]'
            }`}
          >
            SWISS EDITORIAL SYSTEM
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

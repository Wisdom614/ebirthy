'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  showSubtitle?: boolean;
  className?: string;
  variant?: 'default' | 'light' | 'gold' | 'cyan' | 'sepia';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  href = '/',
  showSubtitle = true,
  className = '',
  variant = 'default'
}) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  // Palette styling based on variant
  const getColors = () => {
    switch (variant) {
      case 'light':
        return {
          badgeBg: 'bg-amber-400',
          badgeBorder: 'border-white',
          svgFill: '#1c1917',
          shadow: 'shadow-[2px_2px_0px_#ffffff]',
          titleText: 'text-white',
          subText: 'text-amber-400'
        };
      case 'gold':
        return {
          badgeBg: 'bg-[#d4af37]',
          badgeBorder: 'border-[#f5ebd2]',
          svgFill: '#0c131d',
          shadow: 'shadow-[2px_2px_0px_#d4af37]',
          titleText: 'text-[#f5ebd2]',
          subText: 'text-[#d4af37]'
        };
      case 'cyan':
        return {
          badgeBg: 'bg-[#38bdf8]',
          badgeBorder: 'border-white',
          svgFill: '#090d16',
          shadow: 'shadow-[2px_2px_0px_#38bdf8]',
          titleText: 'text-white',
          subText: 'text-[#38bdf8]'
        };
      case 'sepia':
        return {
          badgeBg: 'bg-[#d97706]',
          badgeBorder: 'border-[#854d0e]',
          svgFill: '#451a03',
          shadow: 'shadow-[2px_2px_0px_#854d0e]',
          titleText: 'text-[#451a03]',
          subText: 'text-[#854d0e]'
        };
      case 'default':
      default:
        return {
          badgeBg: 'bg-amber-400',
          badgeBorder: 'border-[#1c1917]',
          svgFill: '#1c1917',
          shadow: 'shadow-[2px_2px_0px_#1c1917]',
          titleText: 'text-[#1c1917]',
          subText: 'text-amber-700'
        };
    }
  };

  const colors = getColors();

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none group cursor-pointer ${className}`}>
      {/* Swiss Architectural Badge Mark */}
      <div
        className={`relative ${colors.badgeBg} border-2 ${colors.badgeBorder} flex items-center justify-center transition-transform group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex-shrink-0 ${
          isSm
            ? `w-7 h-7 ${colors.shadow}`
            : isLg
            ? `w-10 h-10 ${colors.shadow}`
            : `w-8 h-8 ${colors.shadow}`
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
            fill={colors.svgFill}
          />
          {/* 'e' letterform */}
          <rect x="9" y="17" width="12" height="2.5" fill={colors.svgFill} />
          <rect x="9" y="17" width="2.5" height="10" fill={colors.svgFill} />
          <rect x="9" y="21" width="10" height="2" fill={colors.svgFill} />
          <rect x="9" y="25" width="12" height="2.5" fill={colors.svgFill} />
          <rect x="18.5" y="17" width="2.5" height="4.5" fill={colors.svgFill} />
          <rect x="22.5" y="25" width="2.5" height="2.5" fill={colors.svgFill} />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0 text-left">
        <span
          className={`font-mono font-black tracking-tight uppercase ${colors.titleText} leading-none ${
            isSm ? 'text-xs' : isLg ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'
          }`}
        >
          EBIRTHY
        </span>
        {showSubtitle && (
          <span
            className={`font-mono ${colors.subText} uppercase tracking-widest font-bold hidden sm:block truncate leading-none mt-1 ${
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

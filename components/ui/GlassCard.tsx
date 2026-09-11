'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  brutalShadow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  brutalShadow = true,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-none border-2 border-[#1c1917] bg-white p-6 text-[#1c1917] transition-all ${
        brutalShadow ? 'shadow-[4px_4px_0px_#1c1917]' : ''
      } ${
        onClick
          ? 'cursor-pointer hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
          : ''
      } ${className}`}
    >
      {/* Corner crosshairs */}
      <span className="absolute top-1 left-1 font-mono text-[9px] text-zinc-400 select-none leading-none">+</span>
      <span className="absolute top-1 right-1 font-mono text-[9px] text-zinc-400 select-none leading-none">+</span>
      <span className="absolute bottom-1 left-1 font-mono text-[9px] text-zinc-400 select-none leading-none">+</span>
      <span className="absolute bottom-1 right-1 font-mono text-[9px] text-zinc-400 select-none leading-none">+</span>

      {children}
    </div>
  );
};

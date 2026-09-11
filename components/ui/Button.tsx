'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'cobalt' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-mono tracking-tight gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold tracking-tight gap-2',
    lg: 'px-6 py-3.5 text-base font-bold tracking-tight gap-2.5'
  }[size];

  const variantClasses = {
    primary: 'bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] hover:bg-amber-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    secondary: 'bg-white text-[#1c1917] border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] hover:bg-[#eeeae0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    cobalt: 'bg-blue-600 text-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] hover:bg-blue-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    outline: 'bg-transparent text-[#1c1917] border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] hover:bg-[#eeeae0] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    danger: 'bg-rose-600 text-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] hover:bg-rose-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none'
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center transition-all uppercase cursor-pointer disabled:opacity-50 disabled:pointer-events-none rounded-none select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

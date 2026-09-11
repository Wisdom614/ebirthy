'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audio } from '../../utils/audioManager';

interface BalloonItem {
  id: number;
  color: string;
  left: number;
  speed: number;
  delay: number;
  size: number;
  popped: boolean;
}

interface FloatingBalloonsProps {
  count?: number;
  colors?: string[];
  interactive?: boolean;
}

export const FloatingBalloons: React.FC<FloatingBalloonsProps> = ({
  count = 8,
  colors = ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'],
  interactive = true
}) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);

  useEffect(() => {
    const newBalloons: BalloonItem[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: 5 + Math.random() * 90,
      speed: 12 + Math.random() * 8,
      delay: Math.random() * 6,
      size: 44 + Math.random() * 20,
      popped: false
    }));

    setBalloons(newBalloons);
  }, [count, colors]);

  const popBalloon = (id: number, e: React.MouseEvent) => {
    if (!interactive) return;
    audio.playSFX('pop');

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 20,
      spread: 50,
      origin: { x, y },
      colors: [balloons.find(b => b.id === id)?.color || '#f59e0b', '#ffffff']
    });

    setBalloons(prev =>
      prev.map(b => (b.id === id ? { ...b, popped: true } : b))
    );

    setTimeout(() => {
      setBalloons(prev =>
        prev.map(b =>
          b.id === id
            ? {
                ...b,
                popped: false,
                left: 5 + Math.random() * 90,
                color: colors[Math.floor(Math.random() * colors.length)]
              }
            : b
        )
      );
    }, 4000);
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {balloons.map(balloon => {
        if (balloon.popped) return null;

        return (
          <div
            key={balloon.id}
            className="absolute bottom-[-100px] pointer-events-auto cursor-pointer select-none group will-change-transform"
            style={{
              left: `${balloon.left}%`,
              animation: `floatSlow ${balloon.speed}s linear infinite`,
              animationDelay: `${balloon.delay}s`,
              width: `${balloon.size}px`,
              willChange: 'transform'
            }}
            onClick={(e) => popBalloon(balloon.id, e)}
            title="[ CLICK TO POP ]"
          >
            {/* Geometric Straight-Edge Hex/Diamond Balloon Body */}
            <div
              className="relative border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95"
              style={{
                backgroundColor: balloon.color,
                width: `${balloon.size}px`,
                height: `${balloon.size * 1.3}px`,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
              }}
            >
              {/* Highlight facet */}
              <div className="absolute top-2 left-2 w-2 h-4 bg-white/40 border-r border-b border-black/20" />
            </div>

            {/* Straight Mechanical String */}
            <div className="w-[1.5px] h-16 bg-white/50 mx-auto -mt-0.5 shadow-sm" />
          </div>
        );
      })}
    </div>
  );
};

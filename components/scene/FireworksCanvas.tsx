'use client';

import React, { useRef, useEffect } from 'react';
import { audio } from '../../utils/audioManager';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface FireworksCanvasProps {
  enabled?: boolean;
  colors?: string[];
  interactive?: boolean;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  enabled = true,
  colors = ['#f59e0b', '#ec4899', '#38bdf8', '#a855f7', '#4ade80', '#fbbf24'],
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isRunning = false;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const startLoopIfNeeded = () => {
      if (!isRunning && particlesRef.current.length > 0) {
        isRunning = true;
        animFrameId.current = requestAnimationFrame(loop);
      }
    };

    const createBurst = (x: number, y: number, count = 35) => {
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
        const speed = 2 + Math.random() * 4.5;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.3 ? baseColor : '#ffffff',
          size: 2 + Math.random() * 2,
          decay: 0.018 + Math.random() * 0.015
        });
      }
      startLoopIfNeeded();
    };

    // Auto fireworks interval
    const interval = setInterval(() => {
      if (document.hidden) return;
      const x = window.innerWidth * (0.2 + Math.random() * 0.6);
      const y = window.innerHeight * (0.15 + Math.random() * 0.35);
      createBurst(x, y, 30);
    }, 3200);

    // High performance render loop (zero shadowBlur overhead)
    const loop = () => {
      if (particlesRef.current.length === 0) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.98; // air resistance
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }

      if (particlesRef.current.length > 0) {
        animFrameId.current = requestAnimationFrame(loop);
      } else {
        isRunning = false;
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [enabled, colors]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    audio.playSFX('sparkle');

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const baseColor = colors[Math.floor(Math.random() * colors.length)];
    const count = 40;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = 2.5 + Math.random() * 5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: Math.random() > 0.3 ? baseColor : '#ffffff',
        size: 2 + Math.random() * 2.5,
        decay: 0.018 + Math.random() * 0.015
      });
    }

    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
    }
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const loop = () => {
        if (particlesRef.current.length === 0) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          return;
        }
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }

        if (particlesRef.current.length > 0) {
          animFrameId.current = requestAnimationFrame(loop);
        }
      };
      animFrameId.current = requestAnimationFrame(loop);
    }
  };

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className={`absolute inset-0 pointer-events-auto z-0 ${
        interactive ? 'cursor-crosshair' : 'pointer-events-none'
      }`}
    />
  );
};

'use client';

import confetti from 'canvas-confetti';
import { audio } from './audioManager';

let activeAnimationId: number | null = null;
let activeIntervalId: NodeJS.Timeout | null = null;

export const startTenSecondGrandCelebration = (themeColors: string[] = ['#f59e0b', '#ec4899', '#38bdf8', '#a855f7', '#10b981', '#ffffff']) => {
  // Cancel any existing running loop
  if (activeAnimationId) {
    cancelAnimationFrame(activeAnimationId);
    activeAnimationId = null;
  }
  if (activeIntervalId) {
    clearInterval(activeIntervalId);
    activeIntervalId = null;
  }

  // Play opening celebration sound effects
  audio.playSFX('horn');
  audio.playSFX('cheer');

  // Prepare custom flower, star, and celebration emoji shapes safely
  let flowerShapes: any[] = [];
  try {
    if (typeof confetti.shapeFromText === 'function') {
      const s1 = confetti.shapeFromText({ text: '🌸', scalar: 2.8 });
      const s2 = confetti.shapeFromText({ text: '🌺', scalar: 2.8 });
      const s3 = confetti.shapeFromText({ text: '✨', scalar: 2.4 });
      const s4 = confetti.shapeFromText({ text: '⭐', scalar: 2.4 });
      const s5 = confetti.shapeFromText({ text: '🎉', scalar: 2.4 });
      flowerShapes = [s1, s2, s3, s4, s5];
    }
  } catch (err) {
    console.warn('Custom confetti shapes not supported:', err);
  }

  const duration = 10 * 1000; // 10 seconds
  const animationEnd = Date.now() + duration;

  // Initial big burst
  confetti({
    particleCount: 100,
    spread: 90,
    origin: { y: 0.6 },
    colors: themeColors
  });

  // Mid-celebration chime at 5 seconds
  setTimeout(() => {
    audio.playSFX('sparkle');
    audio.playSFX('chime');
  }, 4500);

  // 10-second continuous celebration loop
  const frame = () => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      activeAnimationId = null;
      return;
    }

    const particleRatio = Math.max(0.2, timeLeft / duration);

    // Left cannon burst
    confetti({
      particleCount: Math.floor(4 * particleRatio),
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.8 },
      colors: themeColors,
      shapes: flowerShapes.length > 0 && Math.random() > 0.4 ? flowerShapes : undefined,
      scalar: 1.2
    });

    // Right cannon burst
    confetti({
      particleCount: Math.floor(4 * particleRatio),
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.8 },
      colors: themeColors,
      shapes: flowerShapes.length > 0 && Math.random() > 0.4 ? flowerShapes : undefined,
      scalar: 1.2
    });

    // Top gentle flower & emoji shower
    if (Math.random() > 0.6 && flowerShapes.length > 0) {
      confetti({
        particleCount: 2,
        angle: 270,
        spread: 120,
        origin: { x: Math.random(), y: -0.05 },
        gravity: 0.5,
        drift: (Math.random() - 0.5) * 0.8,
        ticks: 250,
        shapes: flowerShapes,
        scalar: 2.2
      });
    }

    activeAnimationId = requestAnimationFrame(frame);
  };

  activeAnimationId = requestAnimationFrame(frame);
};

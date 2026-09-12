'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { Zap, RefreshCw, Trophy, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

const TYPING_PHRASES = [
  'Celebrating another incredible orbit around the sun with joy, laughter, and wisdom.',
  'May this special birthday milestone unlock endless happiness, peace, and prosperity.',
  'The secrets of this celebration vault are encrypted with warmth, memories, and love.',
  'Counting down every single second until the grand zero-hour birthday celebration begins.',
  'A bespoke digital time capsule crafted exclusively for you to cherish forever.'
];

export const TimeLockTypingGame: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const targetPhrase = TYPING_PHRASES[phraseIndex];

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isFinished) {
      interval = setInterval(() => {
        const sec = Math.floor((Date.now() - startTime) / 1000);
        setElapsedSeconds(sec);

        // Calculate WPM live
        const words = inputVal.trim().split(/\s+/).filter(Boolean).length;
        const mins = (Date.now() - startTime) / 60000;
        if (mins > 0) {
          setWpm(Math.round(words / mins));
        }
      }, 300);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished, inputVal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setInputVal(val);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetPhrase[i]) {
        correctChars++;
      }
    }
    const acc = val.length > 0 ? Math.round((correctChars / val.length) * 100) : 100;
    setAccuracy(acc);

    // Check if finished
    if (val === targetPhrase) {
      setIsFinished(true);
      const totalMins = (Date.now() - (startTime || Date.now())) / 60000;
      const finalWords = targetPhrase.split(' ').length;
      const finalWpm = Math.max(1, Math.round(finalWords / (totalMins || 0.01)));
      setWpm(finalWpm);

      audio.playSFX('horn');
      audio.playSFX('sparkle');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  };

  const handleRestart = () => {
    setInputVal('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
    setElapsedSeconds(0);
    inputRef.current?.focus();
  };

  const handleNextPhrase = () => {
    setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
    handleRestart();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-[#0a0f1c]/90 border border-amber-500/30 rounded-xl p-4 sm:p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] select-none">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            SPEED TYPING TEST
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{elapsedSeconds}s</span>
          </span>
          <span className="text-amber-400 font-bold">
            {wpm} <span className="text-zinc-500 font-normal">WPM</span>
          </span>
          <span className="text-emerald-400 font-bold">
            {accuracy}% <span className="text-zinc-500 font-normal">ACC</span>
          </span>
        </div>
      </div>

      {/* Target Quote Display */}
      <div className="w-full bg-[#060911] border border-amber-500/20 rounded-lg p-3.5 mb-3 text-left font-mono text-xs sm:text-sm leading-relaxed tracking-wide relative overflow-hidden">
        {targetPhrase.split('').map((char, index) => {
          let colorClass = 'text-zinc-500';
          let bgClass = '';

          if (index < inputVal.length) {
            if (inputVal[index] === char) {
              colorClass = 'text-amber-300 font-bold';
            } else {
              colorClass = 'text-rose-400 bg-rose-500/20 underline';
            }
          } else if (index === inputVal.length) {
            bgClass = 'border-b-2 border-amber-400 animate-pulse text-white';
          }

          return (
            <span key={index} className={`${colorClass} ${bgClass}`}>
              {char}
            </span>
          );
        })}
      </div>

      {/* Input or Completion State */}
      {!isFinished ? (
        <div className="w-full flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            placeholder="Start typing the phrase above..."
            className="flex-1 px-3.5 py-2.5 bg-black/40 border border-amber-400/40 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-zinc-600"
            autoFocus
          />
          <button
            onClick={handleRestart}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-lg border border-white/10 transition-colors"
            title="Reset typing test"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-full bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/50 rounded-lg p-3 flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-2.5 text-left">
            <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <div className="font-mono text-xs font-black text-white">
                SPEED: <span className="text-amber-300">{wpm} WPM</span> · ACCURACY: <span className="text-emerald-400">{accuracy}%</span>
              </div>
              <div className="font-mono text-[9px] text-zinc-400">
                {wpm > 60 ? '🚀 Quantum Velocity Typist!' : wpm > 40 ? '⚡ Supersonic Celebrator!' : '✨ Splendid Effort!'}
              </div>
            </div>
          </div>

          <button
            onClick={handleNextPhrase}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-md font-mono text-[10px] font-black uppercase flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Next Quote</span>
          </button>
        </div>
      )}

      <div className="w-full flex items-center justify-between text-[9px] font-mono text-zinc-500 mt-2.5 px-1">
        <span>Quote {phraseIndex + 1} of {TYPING_PHRASES.length}</span>
        <span>Tap box or type to start test</span>
      </div>
    </div>
  );
};

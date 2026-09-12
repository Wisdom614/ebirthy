'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { Zap, RefreshCw, Trophy, Clock, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

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
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-white border-2 border-[#1c1917] p-4 sm:p-5 shadow-[4px_4px_0px_#1c1917] select-none text-[#1c1917]">
      
      {/* Header */}
      <div className="flex items-center justify-between w-full border-b-2 border-[#1c1917] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-400 border-2 border-[#1c1917] flex items-center justify-center shadow-[2px_2px_0px_#1c1917]">
            <Zap className="w-3.5 h-3.5 text-[#1c1917]" />
          </div>
          <span className="font-mono text-xs font-black text-[#1c1917] uppercase tracking-wider">
            SPEED TYPING TEST
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px] text-[#57534e]">
          <span className="flex items-center gap-1 font-bold">
            <Clock className="w-3 h-3 text-[#1c1917]" />
            <span>{elapsedSeconds}s</span>
          </span>
          <span className="text-[#1c1917] font-black bg-amber-300 px-1.5 py-0.5 border border-[#1c1917]">
            {wpm} <span className="text-[#57534e] font-normal">WPM</span>
          </span>
          <span className="text-emerald-700 font-black bg-emerald-100 px-1.5 py-0.5 border border-emerald-600">
            {accuracy}% <span className="text-emerald-600 font-normal">ACC</span>
          </span>
        </div>
      </div>

      {/* Target Quote Display */}
      <div className="w-full bg-[#f7f4ed] border-2 border-[#1c1917] p-3.5 mb-3 text-left font-mono text-xs sm:text-sm leading-relaxed tracking-wide relative overflow-hidden shadow-[2px_2px_0px_#1c1917]">
        {targetPhrase.split('').map((char, index) => {
          let colorClass = 'text-[#78716c]';
          let bgClass = '';

          if (index < inputVal.length) {
            if (inputVal[index] === char) {
              colorClass = 'text-[#1c1917] font-bold bg-amber-200/60';
            } else {
              colorClass = 'text-rose-700 bg-rose-200 underline font-bold';
            }
          } else if (index === inputVal.length) {
            bgClass = 'border-b-2 border-[#1c1917] animate-pulse text-[#1c1917] font-bold';
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
            className="flex-1 px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs shadow-[2px_2px_0px_#1c1917] focus:outline-none focus:bg-amber-50 placeholder:text-[#a8a29e]"
            autoFocus
          />
          <button
            onClick={handleRestart}
            className="p-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] shadow-[2px_2px_0px_#1c1917] hover:bg-[#eeeae0] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Reset typing test"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-full bg-[#f7f4ed] border-2 border-[#1c1917] p-3 flex items-center justify-between shadow-[2px_2px_0px_#1c1917] animate-in zoom-in-95">
          <div className="flex items-center gap-2.5 text-left">
            <Trophy className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <div className="font-mono text-xs font-black text-[#1c1917]">
                SPEED: <span className="text-amber-700 font-black">{wpm} WPM</span> · ACCURACY: <span className="text-emerald-700 font-black">{accuracy}%</span>
              </div>
              <div className="font-mono text-[9px] text-[#57534e] flex items-center gap-1 mt-0.5 font-bold uppercase tracking-wider">
                {wpm > 60 ? (
                  <>
                    <Zap className="w-3 h-3 text-amber-600" />
                    <span>Quantum Velocity Typist</span>
                  </>
                ) : wpm > 40 ? (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Supersonic Celebrator</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Splendid Effort</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleNextPhrase}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-[10px] font-black uppercase flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Next Quote</span>
          </button>
        </div>
      )}

      <div className="w-full flex items-center justify-between text-[9px] font-mono font-bold text-[#78716c] uppercase tracking-wider mt-3 px-1">
        <span>Quote {phraseIndex + 1} of {TYPING_PHRASES.length}</span>
        <span>Tap box or type to start test</span>
      </div>
    </div>
  );
};

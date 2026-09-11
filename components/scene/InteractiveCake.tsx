'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audio } from '../../utils/audioManager';
import { Sparkles, Wind, Mic } from 'lucide-react';

interface InteractiveCakeProps {
  candleCount?: number;
  flavor?: 'chocolate' | 'strawberry' | 'vanilla' | 'rainbow';
  recipientName?: string;
  onAllCandlesBlown?: () => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({
  candleCount = 3,
  flavor = 'chocolate',
  recipientName = 'FRIEND',
  onAllCandlesBlown
}) => {
  const [litCandles, setLitCandles] = useState<boolean[]>([]);
  const [isAllBlown, setIsAllBlown] = useState(false);
  const [isListeningMic, setIsListeningMic] = useState(false);

  useEffect(() => {
    setLitCandles(new Array(candleCount).fill(true));
    setIsAllBlown(false);
  }, [candleCount]);

  const flavorStyles = {
    chocolate: {
      tierTop: 'bg-[#452715] border-2 border-[#1c1917] text-white',
      tierBottom: 'bg-[#2e190c] border-2 border-[#1c1917] text-white',
      icing: 'bg-[#633a20] border-b-2 border-[#1c1917]',
      stand: 'bg-[#eeeae0] border-2 border-[#1c1917]'
    },
    strawberry: {
      tierTop: 'bg-[#e11d48] border-2 border-[#1c1917] text-white',
      tierBottom: 'bg-[#be123c] border-2 border-[#1c1917] text-white',
      icing: 'bg-[#fb7185] border-b-2 border-[#1c1917]',
      stand: 'bg-[#eeeae0] border-2 border-[#1c1917]'
    },
    vanilla: {
      tierTop: 'bg-[#fef9c3] border-2 border-[#1c1917] text-[#1c1917]',
      tierBottom: 'bg-[#fef08a] border-2 border-[#1c1917] text-[#1c1917]',
      icing: 'bg-[#ffffff] border-b-2 border-[#1c1917]',
      stand: 'bg-[#eeeae0] border-2 border-[#1c1917]'
    },
    rainbow: {
      tierTop: 'bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400 border-2 border-[#1c1917] text-[#1c1917]',
      tierBottom: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-2 border-[#1c1917] text-white',
      icing: 'bg-white border-b-2 border-[#1c1917]',
      stand: 'bg-[#eeeae0] border-2 border-[#1c1917]'
    }
  }[flavor];

  const blowCandle = (index: number) => {
    if (!litCandles[index]) return;
    audio.playSFX('blow');

    const nextLit = [...litCandles];
    nextLit[index] = false;
    setLitCandles(nextLit);

    const remaining = nextLit.filter(Boolean).length;
    if (remaining === 0) {
      handleAllBlown();
    }
  };

  const blowAllCandles = () => {
    if (isAllBlown) return;
    audio.playSFX('blow');
    setLitCandles(new Array(candleCount).fill(false));
    handleAllBlown();
  };

  const handleAllBlown = () => {
    setIsAllBlown(true);
    setTimeout(() => {
      audio.playSFX('cheer');
      audio.playSFX('horn');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      onAllCandlesBlown?.();
    }, 250);
  };

  const toggleMicDetection = async () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListeningMic(true);

      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!isListeningMic && stream) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        if (average > 45) {
          blowAllCandles();
          stream.getTracks().forEach(track => track.stop());
          setIsListeningMic(false);
          return;
        }

        requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn('Microphone permission denied or not supported:', err);
      setIsListeningMic(false);
    }
  };

  const relightCandles = () => {
    setLitCandles(new Array(candleCount).fill(true));
    setIsAllBlown(false);
    audio.playSFX('sparkle');
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      {/* Straight Architectural Cake */}
      <div className="relative flex flex-col items-center justify-center w-72 sm:w-80 group">
        
        {/* Candle Row */}
        <div className="relative z-20 flex items-end justify-center gap-4 sm:gap-6 mb-[-2px]">
          {litCandles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => blowCandle(idx)}
              className="relative flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              title={isLit ? "Click to extinguish" : "Extinguished"}
            >
              {isLit ? (
                <div className="relative flex flex-col items-center">
                  <div className="w-3 h-5 bg-gradient-to-t from-amber-500 to-yellow-200 border border-[#1c1917] shadow-[0_0_8px_#f59e0b] animate-flame" />
                  <div className="w-0.5 h-1 bg-[#1c1917]" />
                </div>
              ) : (
                <div className="relative flex flex-col items-center h-6 justify-end">
                  <div className="w-1.5 h-2 bg-zinc-400 border border-[#1c1917] -translate-y-1" />
                  <div className="w-0.5 h-1.5 bg-[#1c1917]" />
                </div>
              )}

              {/* Straight Candle Body */}
              <div className="w-3 h-10 bg-amber-100 border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] relative">
                <div className="w-full h-1 bg-rose-500 mt-2" />
                <div className="w-full h-1 bg-rose-500 mt-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Top Cake Tier */}
        <div className={`relative z-10 w-48 h-16 ${flavorStyles.tierTop} shadow-[4px_4px_0px_#1c1917] flex flex-col justify-between overflow-hidden`}>
          <div className={`w-full h-3 ${flavorStyles.icing}`} />
          <div className="px-2 py-0.5 my-auto text-center border-y border-[#1c1917]/30 bg-black/10">
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase">
              [ {recipientName} ]
            </span>
          </div>
          <div className="w-full h-2 bg-black/20" />
        </div>

        {/* Bottom Cake Tier */}
        <div className={`relative z-0 w-64 h-20 -mt-1 ${flavorStyles.tierBottom} shadow-[5px_5px_0px_#1c1917] flex flex-col justify-between overflow-hidden`}>
          <div className={`w-full h-3 ${flavorStyles.icing} flex justify-around px-2`}>
            {[...Array(6)].map((_, i) => (
              <span key={i} className="w-2 h-2 bg-amber-400 border border-[#1c1917]" />
            ))}
          </div>
          <div className="w-full h-3 bg-black/20" />
        </div>

        {/* Cake Stand */}
        <div className={`w-72 sm:w-80 h-3.5 ${flavorStyles.stand} shadow-[5px_5px_0px_#1c1917] -mt-0.5 relative z-[-1] flex items-center justify-between px-3`}>
          <span className="font-mono text-[8px] text-zinc-600 font-bold">PLATFORM BASE 01</span>
          <span className="font-mono text-[8px] text-zinc-600 font-bold">SYS STABLE</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="mt-8 flex flex-col items-center gap-3">
        {isAllBlown ? (
          <div className="flex flex-col items-center">
            <div className="px-4 py-2 bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-bold tracking-wider uppercase shadow-[3px_3px_0px_#1c1917] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>[ STATUS: CANDLES EXTINGUISHED · WISH RECORDED ]</span>
            </div>
            <button
              onClick={relightCandles}
              className="mt-3 px-3 py-1.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs font-semibold uppercase hover:bg-[#eeeae0] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            >
              [ RE-IGNITE CANDLES ]
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={blowAllCandles}
              className="px-5 py-2.5 bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-bold uppercase tracking-wide shadow-[3px_3px_0px_#1c1917] hover:bg-amber-300 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer flex items-center gap-2"
            >
              <Wind className="w-4 h-4" />
              <span>[ EXTINGUISH ALL CANDLES ]</span>
            </button>

            <button
              onClick={toggleMicDetection}
              title="Toggle microphone breath detection"
              className={`p-2.5 border-2 border-[#1c1917] font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer transition-colors ${
                isListeningMic
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-white text-[#1c1917] hover:bg-[#eeeae0]'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
        )}

        <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">
          {isListeningMic
            ? '>> MICROPHONE ACTIVE · BLOW AIR INTO SENSOR'
            : '>> CLICK CANDLES DIRECTLY OR EXECUTE COMMAND'}
        </span>
      </div>
    </div>
  );
};

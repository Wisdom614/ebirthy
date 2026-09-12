'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import { Music, Sparkles, RefreshCw, Trophy, Volume2 } from 'lucide-react';

interface PianoKey {
  note: string;
  name: string;
  freq: number;
  isBlack: boolean;
  keyboardKey?: string;
}

const PIANO_KEYS: PianoKey[] = [
  { note: 'C4', name: 'C', freq: 261.63, isBlack: false, keyboardKey: 'A' },
  { note: 'C#4', name: 'C#', freq: 277.18, isBlack: true, keyboardKey: 'W' },
  { note: 'D4', name: 'D', freq: 293.66, isBlack: false, keyboardKey: 'S' },
  { note: 'D#4', name: 'D#', freq: 311.13, isBlack: true, keyboardKey: 'E' },
  { note: 'E4', name: 'E', freq: 329.63, isBlack: false, keyboardKey: 'D' },
  { note: 'F4', name: 'F', freq: 349.23, isBlack: false, keyboardKey: 'F' },
  { note: 'F#4', name: 'F#', freq: 369.99, isBlack: true, keyboardKey: 'T' },
  { note: 'G4', name: 'G', freq: 392.00, isBlack: false, keyboardKey: 'G' },
  { note: 'G#4', name: 'G#', freq: 415.30, isBlack: true, keyboardKey: 'Y' },
  { note: 'A4', name: 'A', freq: 440.00, isBlack: false, keyboardKey: 'H' },
  { note: 'A#4', name: 'A#', freq: 466.16, isBlack: true, keyboardKey: 'U' },
  { note: 'B4', name: 'B', freq: 493.88, isBlack: false, keyboardKey: 'J' },
  { note: 'C5', name: 'C', freq: 523.25, isBlack: false, keyboardKey: 'K' },
  { note: 'D5', name: 'D', freq: 587.33, isBlack: false, keyboardKey: 'L' }
];

// Happy Birthday song sequence
const HAPPY_BIRTHDAY_SONG = [
  { note: 'C4', lyric: 'Hap-' },
  { note: 'C4', lyric: 'py' },
  { note: 'D4', lyric: 'Birth-' },
  { note: 'C4', lyric: 'day' },
  { note: 'F4', lyric: 'to' },
  { note: 'E4', lyric: 'you,' },
  { note: 'C4', lyric: 'Hap-' },
  { note: 'C4', lyric: 'py' },
  { note: 'D4', lyric: 'Birth-' },
  { note: 'C4', lyric: 'day' },
  { note: 'G4', lyric: 'to' },
  { note: 'F4', lyric: 'you,' },
  { note: 'C4', lyric: 'Hap-' },
  { note: 'C4', lyric: 'py' },
  { note: 'C5', lyric: 'Birth-' },
  { note: 'A4', lyric: 'day' },
  { note: 'F4', lyric: 'dear' },
  { note: 'E4', lyric: 'cele-' },
  { note: 'D4', lyric: 'brant,' },
  { note: 'A#4', lyric: 'Hap-' },
  { note: 'A#4', lyric: 'py' },
  { note: 'A4', lyric: 'Birth-' },
  { note: 'F4', lyric: 'day' },
  { note: 'G4', lyric: 'to' },
  { note: 'F4', lyric: 'you! 🎉' }
];

export const TimeLockPiano: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'free' | 'guided'>('guided');
  const [songStep, setSongStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playNote = (freq: number, noteName: string) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Master gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.18, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      masterGain.connect(ctx.destination);

      // Fundamental oscillator (Warm triangle/sine blend for piano body)
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);
      osc1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 1.8);

      // 1st overtone for acoustic richness
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.08, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(masterGain);
      osc2.start(now);
      osc2.stop(now + 1.2);

      // High sparkle chime
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(freq * 3, now);
      const gain3 = ctx.createGain();
      gain3.gain.setValueAtTime(0.03, now);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc3.connect(gain3);
      gain3.connect(masterGain);
      osc3.start(now);
      osc3.stop(now + 0.6);

      setActiveKey(noteName);
      setTimeout(() => setActiveKey(null), 250);

      // Song Progress check in Guided Mode
      if (gameMode === 'guided' && !isCompleted) {
        const expectedNote = HAPPY_BIRTHDAY_SONG[songStep]?.note;
        if (noteName === expectedNote) {
          if (songStep + 1 >= HAPPY_BIRTHDAY_SONG.length) {
            setIsCompleted(true);
            audio.playSFX('horn');
            audio.playSFX('sparkle');
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.7 }
            });
          } else {
            setSongStep((prev) => prev + 1);
          }
        }
      }
    } catch (err) {
      console.warn('Piano note synthesis error:', err);
    }
  };

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const matched = PIANO_KEYS.find(
        (k) => k.keyboardKey && k.keyboardKey.toLowerCase() === e.key.toLowerCase()
      );
      if (matched) {
        playNote(matched.freq, matched.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameMode, songStep, isCompleted]);

  const restartSong = () => {
    setSongStep(0);
    setIsCompleted(false);
  };

  const currentSongTarget = HAPPY_BIRTHDAY_SONG[songStep];

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto bg-[#0a0f1c]/90 border border-amber-500/30 rounded-xl p-4 sm:p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] select-none">
      
      {/* Top Header & Mode Switcher */}
      <div className="flex items-center justify-between w-full border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
            <Music className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            CELEBRATION PIANO
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/40 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => {
              setGameMode('guided');
              restartSong();
            }}
            className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase transition-all ${
              gameMode === 'guided'
                ? 'bg-amber-400 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Song Mode
          </button>
          <button
            onClick={() => setGameMode('free')}
            className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold uppercase transition-all ${
              gameMode === 'free'
                ? 'bg-amber-400 text-zinc-950 shadow-xs'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Free Play
          </button>
        </div>
      </div>

      {/* Guided Song Prompt Banner */}
      {gameMode === 'guided' && (
        <div className="w-full bg-[#111827]/80 border border-amber-500/20 rounded-lg p-2.5 mb-3 flex items-center justify-between">
          {!isCompleted ? (
            <div className="flex items-center gap-2 overflow-hidden text-left">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
                  Next Note: <strong className="text-amber-300 text-xs font-black">{currentSongTarget?.note}</strong> ({currentSongTarget?.lyric})
                </span>
                <span className="font-mono text-[9px] text-zinc-500">
                  Step {songStep + 1} of {HAPPY_BIRTHDAY_SONG.length}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>SONG COMPLETED! YOU'RE A MAESTRO! 🎉</span>
            </div>
          )}

          <button
            onClick={restartSong}
            className="p-1.5 hover:bg-white/10 rounded-md text-zinc-400 hover:text-amber-300 transition-colors"
            title="Restart song"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Piano Keyboard */}
      <div className="relative flex justify-center w-full h-32 sm:h-36 pt-1 pb-2 bg-[#060911] border border-amber-400/30 rounded-lg p-1.5 shadow-inner overflow-x-auto">
        {/* White Keys */}
        <div className="flex gap-1 sm:gap-1.5 h-full w-full justify-center">
          {PIANO_KEYS.filter((k) => !k.isBlack).map((key) => {
            const isTarget = gameMode === 'guided' && !isCompleted && currentSongTarget?.note === key.note;
            const isCurrentlyActive = activeKey === key.note;

            return (
              <button
                key={key.note}
                onClick={() => playNote(key.freq, key.note)}
                className={`flex-1 min-w-[28px] sm:min-w-[34px] max-w-[42px] h-full rounded-b-md flex flex-col justify-end items-center pb-2 transition-all cursor-pointer relative border ${
                  isCurrentlyActive
                    ? 'bg-amber-300 border-amber-200 translate-y-[2px] shadow-[0_0_15px_rgba(245,158,11,0.8)]'
                    : isTarget
                    ? 'bg-gradient-to-b from-white via-amber-100 to-amber-200 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] animate-pulse'
                    : 'bg-gradient-to-b from-zinc-200 to-zinc-100 border-zinc-400/80 hover:bg-zinc-50'
                }`}
              >
                <span className="font-mono text-[9px] sm:text-[10px] font-black text-zinc-900 leading-none">
                  {key.name}
                </span>
                {key.keyboardKey && (
                  <span className="font-mono text-[8px] text-zinc-500 mt-1 uppercase font-bold leading-none hidden sm:block">
                    {key.keyboardKey}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mt-2.5">
        ⌨️ Press keyboard keys (A-S-D-F...) or tap keys to play
      </span>
    </div>
  );
};

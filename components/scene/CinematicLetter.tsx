'use client';

import React, { useState, useEffect, useRef } from 'react';
import { audio } from '../../utils/audioManager';
import { Feather, Play, Pause, Volume2 } from 'lucide-react';

interface CinematicLetterProps {
  senderName: string;
  recipientName: string;
  letterText: string;
  themeClass?: string;
  fontStyle?: 'playful' | 'elegant' | 'modern' | 'handwritten';
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
}

export const CinematicLetter: React.FC<CinematicLetterProps> = ({
  senderName,
  recipientName,
  letterText,
  fontStyle = 'modern',
  voiceNoteUrl,
  voiceNoteDuration = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fontClass = {
    playful: 'font-mono text-zinc-900',
    elegant: 'font-serif text-zinc-950 font-medium',
    modern: 'font-mono text-zinc-900 tracking-tight',
    handwritten: 'font-mono text-zinc-900'
  }[fontStyle];

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    audio.playSFX('unwrap');
    audio.playSFX('chime');
  };

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlayingAudio(false);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDisplayedText(letterText.slice(0, current));
      if (current >= letterText.length) {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [isOpen, letterText]);

  // Audio event listeners
  useEffect(() => {
    const player = audioRef.current;
    if (!player) return;

    const handleTimeUpdate = () => {
      if (player.duration) {
        setPlayProgress(player.currentTime / player.duration);
      }
    };

    const handleEnded = () => {
      setIsPlayingAudio(false);
      setPlayProgress(0);
    };

    player.addEventListener('timeupdate', handleTimeUpdate);
    player.addEventListener('ended', handleEnded);

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate);
      player.removeEventListener('ended', handleEnded);
    };
  }, [voiceNoteUrl]);

  const toggleVoiceNote = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(false));
    }
  };

  const formatSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-xl mx-auto">
      {voiceNoteUrl && <audio ref={audioRef} src={voiceNoteUrl} preload="auto" />}

      {!isOpen ? (
        /* Sealed Straight Architectural Parcel */
        <div
          onClick={handleOpen}
          className="group relative cursor-pointer flex flex-col items-center select-none transition-all active:translate-x-[2px] active:translate-y-[2px]"
        >
          {/* Envelope Body */}
          <div className="relative w-72 sm:w-88 h-48 bg-[#f5f2eb] border-2 border-black shadow-[6px_6px_0px_#000] p-6 flex flex-col justify-between overflow-hidden">
            {/* Stamp */}
            <div className="absolute top-4 right-4 w-12 h-14 bg-rose-600 border-2 border-black flex flex-col items-center justify-center text-white font-mono shadow-[2px_2px_0px_#000]">
              <span className="text-[7px] font-bold tracking-widest uppercase">AIR MAIL</span>
              <span className="text-xs font-bold">2026</span>
            </div>

            {/* Recipient Marker */}
            <div className="my-auto text-left w-full">
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">
                DISPATCH TO:
              </span>
              <h4 className="font-mono text-xl font-bold uppercase tracking-tight text-black">
                {recipientName}
              </h4>
            </div>

            {/* Straight Seal Stamp */}
            <div className="relative z-10 -mb-2 flex items-center justify-between border-t-2 border-black pt-2">
              <span className="font-mono text-[9px] text-zinc-600 uppercase font-bold tracking-widest">
                [ CONFIDENTIAL MEMO ]
              </span>
              <div className="px-2 py-0.5 bg-rose-600 text-white font-mono text-[9px] font-bold uppercase border border-black shadow-[1px_1px_0px_#000]">
                SEALED
              </div>
            </div>
          </div>

          <span className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-[#1c1917] bg-amber-400 border-2 border-black px-3.5 py-1.5 shadow-[3px_3px_0px_#000] flex items-center gap-2">
            <Feather className="w-3.5 h-3.5" />
            <span>[ CLICK TO BREAK SEAL & REVEAL LETTER ]</span>
          </span>
        </div>
      ) : (
        /* Unfolded Straight Letterpress Memorandum */
        <div className="relative w-full bg-[#fcfaf4] border-2 border-black p-6 sm:p-8 shadow-[8px_8px_0px_#000] text-black animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-rose-600 border border-black" />
              <span className="font-mono text-xs uppercase font-bold tracking-widest text-black">
                PERSONAL DISPATCH · MEMORANDUM
              </span>
            </div>
            <span className="font-mono text-[10px] text-zinc-600 uppercase font-bold">
              STATUS: READ_ONLY
            </span>
          </div>

          {/* Voice Note Audio Deck Component */}
          {voiceNoteUrl && (
            <div className="mb-6 p-4 bg-[#f0ede4] border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  [ VOICE GREETING ATTACHED ]
                </span>
                <span className="font-mono text-[10px] font-bold text-zinc-600">
                  {formatSec(voiceNoteDuration || 15)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleVoiceNote}
                  className="p-2.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer flex-shrink-0"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                </button>

                {/* Animated Equalizer Waveform */}
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="flex items-end gap-1 h-5 overflow-hidden">
                    {[30, 60, 90, 45, 80, 100, 70, 50, 85, 40, 95, 65, 85, 40, 75, 55, 90, 60].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 transition-all ${
                          isPlayingAudio ? 'bg-[#1c1917] animate-pulse' : 'bg-zinc-400'
                        }`}
                        style={{
                          height: isPlayingAudio ? `${h}%` : '25%',
                          animationDuration: `${0.3 + (i % 4) * 0.15}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress Line */}
                  <div className="w-full bg-zinc-300 h-1.5 border border-[#1c1917] overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-100"
                      style={{ width: `${playProgress * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <h3 className="font-mono text-base font-bold text-black uppercase mb-3">
            DEAR {recipientName},
          </h3>

          {/* Typewriter Text Body */}
          <p className={`text-sm sm:text-base leading-relaxed min-h-[120px] whitespace-pre-line ${fontClass}`}>
            {displayedText}
            {displayedText.length < letterText.length && (
              <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse" />
            )}
          </p>

          {/* Signoff */}
          <div className="mt-8 pt-4 border-t-2 border-black flex items-center justify-between">
            <span className="font-mono text-[10px] text-zinc-600 uppercase font-semibold">
              WITH ALL RESPECT & WISHES
            </span>
            <p className="font-mono text-sm font-bold uppercase text-black">
              ~ {senderName}
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="font-mono text-[10px] text-zinc-500 hover:text-black uppercase tracking-wider cursor-pointer font-semibold"
            >
              [ RE-SEAL ENVELOPE ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


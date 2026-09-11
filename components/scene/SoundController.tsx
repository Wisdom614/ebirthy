'use client';

import React, { useState, useEffect } from 'react';
import { audio } from '../../utils/audioManager';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { SceneConfig } from '../../types/scene';

interface SoundControllerProps {
  track: SceneConfig['musicTrack'];
  autoPlay?: boolean;
  className?: string;
}

export const SoundController: React.FC<SoundControllerProps> = ({
  track,
  autoPlay = true,
  className = ''
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (autoPlay && track !== 'none') {
      const startOnInteraction = () => {
        if (!isMuted) {
          audio.playMusic(track);
          setIsPlaying(true);
        }
        window.removeEventListener('click', startOnInteraction);
        window.removeEventListener('keydown', startOnInteraction);
      };

      window.addEventListener('click', startOnInteraction);
      window.addEventListener('keydown', startOnInteraction);

      return () => {
        window.removeEventListener('click', startOnInteraction);
        window.removeEventListener('keydown', startOnInteraction);
        audio.stopMusic();
      };
    }
  }, [track, autoPlay, isMuted]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audio.setMuted(nextMuted);
    if (nextMuted) {
      setIsPlaying(false);
    } else {
      audio.playMusic(track);
      setIsPlaying(true);
    }
  };

  const manualTogglePlay = () => {
    if (isPlaying) {
      audio.stopMusic();
      setIsPlaying(false);
    } else {
      setIsMuted(false);
      audio.setMuted(false);
      audio.playMusic(track);
      setIsPlaying(true);
    }
  };

  if (track === 'none') return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Mechanical Audio Deck Pill */}
      <button
        onClick={manualTogglePlay}
        className={`px-3 py-2 border-2 border-[#1c1917] font-mono text-xs font-bold uppercase flex items-center gap-2 shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer ${
          isPlaying
            ? 'bg-amber-400 text-[#1c1917]'
            : 'bg-white text-[#1c1917] hover:bg-[#eeeae0]'
        }`}
      >
        <Music className="w-3.5 h-3.5" />
        <span>{isPlaying ? `AUDIO · ${track}` : 'AUDIO: OFF'}</span>

        {/* Mechanical VU Equalizer Bars */}
        {isPlaying && (
          <div className="flex items-end gap-0.5 h-3">
            <span className="w-1 h-full bg-[#1c1917] animate-pulse" />
            <span className="w-1 h-2 bg-[#1c1917] animate-bounce" />
            <span className="w-1 h-full bg-[#1c1917] animate-pulse" />
          </div>
        )}
      </button>

      {/* Straight Mute Toggle */}
      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute audio' : 'Mute audio'}
        className="p-2 bg-white hover:bg-[#eeeae0] border-2 border-[#1c1917] text-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-[#1c1917]" />}
      </button>
    </div>
  );
};

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Trash2, Upload, Volume2 } from 'lucide-react';
import { audio } from '../../utils/audioManager';

interface VoiceNoteRecorderProps {
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  onChange: (data: { voiceNoteUrl?: string; voiceNoteDuration?: number }) => void;
}

const MAX_RECORD_SECONDS = 45;

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  voiceNoteUrl,
  voiceNoteDuration = 0,
  onChange
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [audioError, setAudioError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer and media stream
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Handle Playback progress
  useEffect(() => {
    const player = audioPlayerRef.current;
    if (!player) return;

    const handleTimeUpdate = () => {
      if (player.duration) {
        setPlayProgress(player.currentTime / player.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setPlayProgress(0);
    };

    player.addEventListener('timeupdate', handleTimeUpdate);
    player.addEventListener('ended', handleEnded);

    return () => {
      player.removeEventListener('timeupdate', handleTimeUpdate);
      player.removeEventListener('ended', handleEnded);
    };
  }, [voiceNoteUrl]);

  const startRecording = async () => {
    setAudioError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onChange({
            voiceNoteUrl: base64Audio,
            voiceNoteDuration: recordSeconds
          });
        };

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordSeconds(0);
      audio.playSFX('sparkle');

      timerRef.current = setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= MAX_RECORD_SECONDS - 1) {
            stopRecording();
            return MAX_RECORD_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setAudioError('Microphone permission required to record personal voice note.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    audio.playSFX('chime');
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Audio = reader.result as string;
      const tempAudio = new Audio(base64Audio);
      tempAudio.onloadedmetadata = () => {
        onChange({
          voiceNoteUrl: base64Audio,
          voiceNoteDuration: Math.round(tempAudio.duration) || 15
        });
      };
    };
  };

  const removeVoiceNote = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setIsPlaying(false);
    setPlayProgress(0);
    onChange({ voiceNoteUrl: undefined, voiceNoteDuration: undefined });
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2.5">
        <div>
          <h4 className="font-mono font-bold text-xs uppercase text-[#1c1917] flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>[ PERSONAL VOICE NOTE DISPATCH ]</span>
          </h4>
          <p className="font-mono text-[10px] text-zinc-600 uppercase font-semibold">
            Attach a real voice greeting inside the sealed letter
          </p>
        </div>

        {voiceNoteUrl && (
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-700 font-mono text-[9px] font-bold uppercase">
            ATTACHED
          </span>
        )}
      </div>

      {audioError && (
        <div className="p-2.5 bg-rose-100 border border-rose-600 text-rose-800 font-mono text-xs">
          [ ERROR: {audioError} ]
        </div>
      )}

      {/* Hidden Audio Element */}
      {voiceNoteUrl && (
        <audio ref={audioPlayerRef} src={voiceNoteUrl} preload="auto" />
      )}

      {isRecording ? (
        /* Recording Active State */
        <div className="p-4 bg-rose-50 border-2 border-rose-600 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <span className="font-mono text-xs font-bold text-rose-700 uppercase tracking-wider">
              RECORDING VOICE NOTE...
            </span>
          </div>

          <div className="font-mono text-2xl font-black text-[#1c1917]">
            {formatSeconds(recordSeconds)} / {formatSeconds(MAX_RECORD_SECONDS)}
          </div>

          {/* Equalizer Visualizer Bars */}
          <div className="flex items-end gap-1 h-8 my-1">
            {[40, 70, 100, 60, 85, 30, 95, 60, 80, 45, 90, 70].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-rose-600 animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.3 + (i % 5) * 0.15}s`
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="mt-1 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold uppercase tracking-wider border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>[ STOP & SAVE NOTE ]</span>
          </button>
        </div>
      ) : voiceNoteUrl ? (
        /* Recorded Audio Preview State */
        <div className="p-3 bg-[#f7f4ed] border-2 border-[#1c1917] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayback}
                className="p-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <div className="font-mono text-xs font-bold text-[#1c1917]">
                {isPlaying ? 'PLAYING VOICE NOTE' : 'VOICE NOTE READY'}
              </div>
            </div>

            <div className="font-mono text-xs font-bold text-amber-700">
              {formatSeconds(voiceNoteDuration || 10)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-300 h-2 border border-[#1c1917] overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-100"
              style={{ width: `${playProgress * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={startRecording}
              className="font-mono text-[10px] text-zinc-700 hover:text-black font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RE-RECORD</span>
            </button>

            <button
              type="button"
              onClick={removeVoiceNote}
              className="font-mono text-[10px] text-rose-600 hover:text-rose-800 font-bold uppercase flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>REMOVE</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty / Idle State */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Record Button */}
          <button
            type="button"
            onClick={startRecording}
            className="py-3 px-4 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>[ ⏺ RECORD MIC VOICE ]</span>
          </button>

          {/* Upload Existing Audio Button */}
          <label className="py-3 px-4 bg-white hover:bg-[#eeeae0] text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-amber-600" />
            <span>[ UPLOAD AUDIO CLIP ]</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};

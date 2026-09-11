'use client';

import React, { useState } from 'react';
import { PhotoMemory } from '../../types/scene';
import { X, Image as ImageIcon } from 'lucide-react';

interface PolaroidReelProps {
  photos: PhotoMemory[];
  themeAccent?: string;
}

export const PolaroidReel: React.FC<PolaroidReelProps> = ({
  photos,
  themeAccent = '#f59e0b'
}) => {
  const [activePhoto, setActivePhoto] = useState<PhotoMemory | null>(null);

  if (!photos || photos.length === 0) return null;

  return (
    <div className="relative w-full py-6">
      {/* Industrial Structural Line */}
      <div className="relative w-full h-4 flex items-center justify-between px-4 mb-4 border-b-2 border-zinc-800">
        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">[ ARCHIVE REEL // 01-0{photos.length} ]</span>
        <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">[ MEMORY PLATES ]</span>
      </div>

      {/* Straight Photographic Plates Row */}
      <div className="flex flex-wrap items-center justify-center gap-6 px-4">
        {photos.map((photo, index) => {
          return (
            <div
              key={photo.id || index}
              onClick={() => setActivePhoto(photo)}
              className="group relative cursor-pointer bg-white p-3 pb-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#f59e0b] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all w-48 sm:w-56"
            >
              {/* Metallic Steel Pin Marker on top */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-zinc-900 border-2 border-black shadow-[1px_1px_0px_#000]" />

              {/* Photo Frame */}
              <div className="w-full aspect-square bg-zinc-200 border border-black overflow-hidden relative">
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Birthday Memory'}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-1 font-mono text-[10px]">
                    <ImageIcon className="w-6 h-6 opacity-50" />
                    <span>[ NO IMAGE ]</span>
                  </div>
                )}
              </div>

              {/* Monospaced Caption */}
              <div className="mt-3 text-left border-t border-black/20 pt-2">
                <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500 block">
                  PLATE // 0{index + 1}
                </span>
                <p className="font-mono text-xs text-black font-semibold tracking-tight uppercase line-clamp-2">
                  {photo.caption || 'ARCHIVE MEMORY'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Zoom Modal */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-white p-4 pb-6 border-2 border-black shadow-[8px_8px_0px_#f59e0b] text-left animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-black">
                [ FULL-SIZE ARCHIVE PLATE ]
              </span>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1 bg-black text-white hover:bg-amber-400 hover:text-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full aspect-[4/3] border-2 border-black overflow-hidden bg-zinc-100">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="mt-4 font-mono text-sm text-black font-bold uppercase tracking-tight">
              "{activePhoto.caption}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

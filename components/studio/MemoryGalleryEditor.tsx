'use client';

import React, { useState } from 'react';
import { SceneConfig, PhotoMemory } from '../../types/scene';
import { uploadImageToCloudinary } from '../../utils/cloudinary';
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface MemoryGalleryEditorProps {
  scene: SceneConfig;
  onChange: (updated: Partial<SceneConfig>) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  {
    url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80',
    caption: 'ARCHIVE ITEM 01 · Celebrating good times'
  },
  {
    url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    caption: 'ARCHIVE ITEM 02 · Memories that shine bright'
  },
  {
    url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80',
    caption: 'ARCHIVE ITEM 03 · To many sweet years ahead'
  }
];

export const MemoryGalleryEditor: React.FC<MemoryGalleryEditorProps> = ({ scene, onChange }) => {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addPhoto = () => {
    const newId = `photo-${Date.now()}`;
    const sample = SAMPLE_PHOTO_PRESETS[scene.photos.length % SAMPLE_PHOTO_PRESETS.length];
    const newPhoto: PhotoMemory = {
      id: newId,
      url: sample.url,
      caption: sample.caption,
      rotation: 0
    };
    onChange({ photos: [...scene.photos, newPhoto] });
  };

  const removePhoto = (id: string) => {
    onChange({ photos: scene.photos.filter((p) => p.id !== id) });
  };

  const updatePhoto = (id: string, updated: Partial<PhotoMemory>) => {
    onChange({
      photos: scene.photos.map((p) => (p.id === id ? { ...p, ...updated } : p))
    });
  };

  const handleFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    setUploadError(null);

    try {
      const url = await uploadImageToCloudinary(file);
      updatePhoto(id, { url });
    } catch (err: any) {
      console.error('Cloudinary upload failed:', err);
      setUploadError(err.message || 'Image upload failed');
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-[#1c1917] pb-3 flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-amber-600 block mb-1">
            [ 04 · VISUAL ARCHIVE & MEMORIES ]
          </span>
          <h3 className="text-sm font-bold uppercase tracking-tight text-[#1c1917]">
            Photographic Memory Plates
          </h3>
        </div>

        <button
          type="button"
          onClick={() => onChange({ enablePhotoReel: !scene.enablePhotoReel })}
          className={`px-3 py-1 font-mono text-[10px] font-bold uppercase border-2 transition-all cursor-pointer ${
            scene.enablePhotoReel
              ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
              : 'bg-[#eeeae0] text-zinc-600 border-[#1c1917]'
          }`}
        >
          {scene.enablePhotoReel ? '[ ENABLED ]' : '[ DISABLED ]'}
        </button>
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-100 border-2 border-rose-600 text-rose-800 font-mono text-xs">
          [ ERROR: {uploadError} ]
        </div>
      )}

      {scene.enablePhotoReel && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scene.photos.map((photo, index) => {
              const isUploading = uploadingId === photo.id;

              return (
                <div
                  key={photo.id}
                  className="p-4 bg-white border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2">
                    <span className="font-mono text-xs font-bold text-amber-600">
                      [ PLATE 0{index + 1} ]
                    </span>
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="p-1 text-rose-600 hover:bg-rose-100 border border-transparent hover:border-rose-600 transition-colors"
                      title="Delete plate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail / Upload State */}
                  <div className="w-full h-32 bg-[#eeeae0] border-2 border-[#1c1917] relative flex items-center justify-center overflow-hidden">
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-xs text-zinc-500 gap-1 font-mono">
                        <ImageIcon className="w-5 h-5 opacity-40" />
                        <span>[ NO ASSET ]</span>
                      </div>
                    )}

                    {isUploading && (
                      <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center gap-2 text-[#1c1917] font-mono">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">
                          UPLOADING PHOTO...
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Photo Upload Button */}
                  <div>
                    <label className="w-full py-2 px-3 bg-[#f7f4ed] hover:bg-[#eeeae0] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span>UPLOAD PHOTOGRAPH</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        onChange={(e) => handleFileUpload(photo.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Direct Image URL input */}
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-zinc-600 mb-1">
                      OR DIRECT IMAGE URL
                    </label>
                    <input
                      type="text"
                      value={photo.url}
                      onChange={(e) => updatePhoto(photo.id, { url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block font-mono text-[10px] font-bold uppercase text-zinc-600 mb-1">
                      CATALOG CAPTION
                    </label>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
                      placeholder="e.g. ARCHIVE ITEM 01 · BEST MOMENT"
                      className="w-full px-3 py-1.5 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addPhoto}
            className="w-full py-3 border-2 border-dashed border-[#1c1917] hover:bg-white bg-[#eeeae0] text-[#1c1917] font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>[ + ADD PHOTOGRAPHIC PLATE ]</span>
          </button>
        </div>
      )}
    </div>
  );
};

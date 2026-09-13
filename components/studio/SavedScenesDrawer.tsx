'use client';

import React, { useState, useEffect } from 'react';
import { fetchUserScenes, deleteSceneFromSupabase, SavedSceneRecord } from '../../utils/supabase/db';
import { SceneConfig } from '../../types/scene';
import { getSceneEditStatus } from '../../utils/sceneExpiry';
import { audio } from '../../utils/audioManager';
import { X, Trash2, Eye, Clock, ShieldCheck, Lock } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo';

interface SavedScenesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScene: (scene: SceneConfig, id: string, createdAt?: string, slug?: string) => void;
  userId?: string;
  onOpenAuth: () => void;
}

export const SavedScenesDrawer: React.FC<SavedScenesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectScene,
  userId,
  onOpenAuth
}) => {
  const [scenes, setScenes] = useState<SavedSceneRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadScenes();
    }
  }, [isOpen, userId]);

  const loadScenes = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const records = await fetchUserScenes(userId);
      setScenes(records);
    } catch (err) {
      console.error('Failed to load scenes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Permanently delete this saved scene?')) return;

    const ok = await deleteSceneFromSupabase(id);
    if (ok) {
      setScenes((prev) => prev.filter((s) => s.id !== id));
      audio.playSFX('unwrap');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-none animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md h-full bg-[#f7f4ed] border-l-2 border-[#1c1917] p-6 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-200 text-[#1c1917]"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#1c1917]">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" showSubtitle={false} href="" />
              <div className="border-l-2 border-[#1c1917] pl-3">
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-amber-600 block">
                  [ DATABASE ARCHIVE ]
                </span>
                <h3 className="font-mono font-bold text-sm uppercase text-[#1c1917]">MY SAVED SCENES</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-white border-2 border-[#1c1917] text-[#1c1917] hover:bg-[#eeeae0] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!userId ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-amber-400 border-2 border-[#1c1917] text-[#1c1917] font-mono text-xl font-bold flex items-center justify-center shadow-[3px_3px_0px_#1c1917]">
                !
              </div>
              <h4 className="font-mono font-bold text-sm uppercase text-[#1c1917]">AUTHENTICATION REQUIRED</h4>
              <p className="font-mono text-xs text-zinc-600 max-w-xs mx-auto font-medium">
                Sign in to save your custom celebration scenes and track recipient view metrics in real time.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-5 py-2.5 bg-amber-400 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                [ SIGN IN / REGISTER ]
              </button>
            </div>
          ) : loading ? (
            <div className="py-20 text-center font-mono text-xs text-zinc-500 uppercase font-semibold">
              LOADING SAVED CELEBRATION SCENES...
            </div>
          ) : scenes.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <h4 className="font-mono font-bold text-sm uppercase text-[#1c1917]">NO ARCHIVED SCENES FOUND</h4>
              <p className="font-mono text-xs text-zinc-600 max-w-xs mx-auto font-medium">
                Click "[ SAVE CLOUD ]" in the Studio navbar to archive your celebration scenes.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {scenes.map((record) => {
                const editStatus = getSceneEditStatus(record.created_at);
                return (
                  <div
                    key={record.id}
                    onClick={() => {
                      onSelectScene(record.config, record.id, record.created_at, record.slug);
                      onClose();
                    }}
                    className="p-4 bg-white border-2 border-[#1c1917] hover:bg-[#eeeae0] transition-all cursor-pointer group shadow-[3px_3px_0px_#1c1917]"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-mono font-bold text-sm uppercase text-[#1c1917] group-hover:text-amber-600 transition-colors">
                        FOR: {record.recipient_name}
                      </h4>
                      <button
                        onClick={(e) => handleDelete(record.id, e)}
                        className="p-1 text-rose-600 hover:bg-rose-100 border border-transparent hover:border-rose-600 transition-colors"
                        title="Delete scene"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-mono text-xs text-zinc-600 line-clamp-1 uppercase font-medium mb-2">
                      {record.config.headline || record.config.wishes}
                    </p>

                    {/* 3-Day Edit Status Badge */}
                    <div className="mb-2">
                      {editStatus.canEdit ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-500 text-emerald-800 font-mono text-[8px] font-black uppercase">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>⏱️ {editStatus.formattedRemaining}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 border border-zinc-400 text-zinc-600 font-mono text-[8px] font-bold uppercase">
                          <Lock className="w-2.5 h-2.5" />
                          <span>🔒 FINALIZED (3-DAY WINDOW CLOSED)</span>
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#1c1917]/20 flex items-center justify-between font-mono text-[10px] text-zinc-600 uppercase font-semibold">
                      <span className="flex items-center gap-1 text-amber-700">
                        <Eye className="w-3 h-3" />
                        {record.view_count || 0} VIEWS
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(record.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-4 border-t-2 border-[#1c1917] text-center font-mono text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
          CLOUD PERSISTENCE VAULT · VER_2.4
        </div>
      </div>
    </div>
  );
};

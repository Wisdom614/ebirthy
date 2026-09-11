'use client';

import React, { useState, useEffect } from 'react';
import { SceneConfig } from '../../types/scene';
import { generateSceneSlug } from '../../utils/sceneEncoder';
import { saveSceneToSupabase } from '../../utils/supabase/db';
import { isSupabaseConfigured } from '../../utils/supabase/client';
import { audio } from '../../utils/audioManager';
import { X, Copy, Check, ExternalLink, Send, Link as LinkIcon, Sparkles } from 'lucide-react';

interface ShareModalProps {
  scene: SceneConfig;
  isOpen: boolean;
  slug?: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ scene, isOpen, slug: initialSlug, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shortSlug, setShortSlug] = useState<string>('');
  const [cloudStatus, setCloudStatus] = useState<'saving' | 'synced' | 'local_only' | 'error'>('saving');
  const [cloudErrorMsg, setCloudErrorMsg] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    // Use initial slug or generate a clean human-readable slug (e.g. alex24-k9x)
    const slug = initialSlug || generateSceneSlug(scene.recipientName, scene.age);
    setShortSlug(slug);

    // Save to local cache so link opens instantly on this device
    try {
      localStorage.setItem(`ebirthy_scene_${slug}`, JSON.stringify(scene));
    } catch {}

    // Persist to Supabase so it can be opened on any phone or device anywhere
    if (isSupabaseConfigured) {
      setCloudStatus('saving');
      saveSceneToSupabase(scene, undefined, undefined, slug)
        .then(() => {
          setCloudStatus('synced');
        })
        .catch((err) => {
          console.error('Supabase save error:', err);
          setCloudStatus('error');
          setCloudErrorMsg(err?.message || 'Database sync error');
        });
    } else {
      setCloudStatus('local_only');
    }
  }, [isOpen, initialSlug, scene]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/c/${shortSlug || 'celebration'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    audio.playSFX('sparkle');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `[ CELEBRATION DISPATCH ] Hey ${scene.recipientName}! I created an interactive birthday celebration experience for you: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOpenLive = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full bg-white border-2 border-[#1c1917] p-6 sm:p-8 shadow-[8px_8px_0px_#1c1917] text-[#1c1917] animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            [ SHORT CELEBRATION LINK ]
          </span>
          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer shadow-[1px_1px_0px_#1c1917]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1c1917]">
          SHARE DISPATCH FOR {scene.recipientName}
        </h3>
        
        {/* Status Indicator */}
        <div className="mt-2 mb-3">
          {cloudStatus === 'saving' && (
            <span className="font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-300 inline-block animate-pulse">
              [ SYNCING TO CLOUD VAULT... ]
            </span>
          )}
          {cloudStatus === 'synced' && (
            <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-300 inline-flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" />
              [ SAVED TO CLOUD VAULT · ACCESSIBLE ON ANY DEVICE ]
            </span>
          )}
          {cloudStatus === 'local_only' && (
            <div className="p-2.5 bg-amber-50 border-2 border-amber-400 text-amber-950 text-xs font-mono">
              <p className="font-bold">⚠️ Cloud Database not configured in environment variables.</p>
              <p className="text-[11px] text-amber-900 mt-0.5">
                This link works only on this browser until <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are added to your <code>.env</code> file and hosting platform.
              </p>
            </div>
          )}
          {cloudStatus === 'error' && (
            <div className="p-2.5 bg-rose-50 border-2 border-rose-400 text-rose-950 text-xs font-mono">
              <p className="font-bold">⚠️ Cloud sync failed: {cloudErrorMsg}</p>
              <p className="text-[11px] text-rose-900 mt-0.5">
                Please ensure your Supabase database tables and RLS policies are created.
              </p>
            </div>
          )}
        </div>

        {/* Short URL Box */}
        <div className="mt-4 p-2.5 bg-[#f7f4ed] border-2 border-[#1c1917] flex items-center justify-between gap-2 shadow-[3px_3px_0px_#1c1917]">
          <div className="flex items-center gap-2 overflow-hidden flex-1 pl-1">
            <LinkIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-xs sm:text-sm text-[#1c1917] font-mono focus:outline-none select-all overflow-hidden text-ellipsis font-extrabold"
            />
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-bold text-xs uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>DISPATCH VIA WHATSAPP</span>
          </button>

          <button
            onClick={handleOpenLive}
            className="w-full py-3 bg-white hover:bg-[#eeeae0] text-[#1c1917] font-mono font-bold text-xs uppercase border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-amber-600" />
            <span>OPEN LIVE SCENE</span>
          </button>
        </div>

        <div className="mt-6 pt-3 border-t-2 border-[#1c1917]/20 text-center">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">
            FORMAT: [NAME][DATE] · INSTANT LIVE PLAYBACK
          </span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { SceneConfig } from '../../types/scene';
import { getShareableUrl, compressScene } from '../../utils/sceneEncoder';
import { saveSceneToSupabase } from '../../utils/supabase/db';
import { isSupabaseConfigured } from '../../utils/supabase/client';
import { audio } from '../../utils/audioManager';
import { X, Copy, Check, ExternalLink, Send, Link as LinkIcon, Loader2, Sparkles } from 'lucide-react';

interface ShareModalProps {
  scene: SceneConfig;
  isOpen: boolean;
  slug?: string;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ scene, isOpen, slug: initialSlug, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shortSlug, setShortSlug] = useState<string | undefined>(initialSlug);
  const [isGeneratingShort, setIsGeneratingShort] = useState(false);
  const [linkType, setLinkType] = useState<'short' | 'offline'>('short');

  useEffect(() => {
    if (!isOpen) return;

    if (initialSlug) {
      setShortSlug(initialSlug);
      return;
    }

    // Auto-generate short link via Supabase if configured
    if (isSupabaseConfigured && !shortSlug) {
      setIsGeneratingShort(true);
      saveSceneToSupabase(scene)
        .then((record) => {
          if (record && (record.slug || record.id)) {
            setShortSlug(record.slug || record.id);
          }
        })
        .catch((err) => {
          console.warn('Could not auto-generate short link in Supabase, using compressed fallback:', err);
        })
        .finally(() => {
          setIsGeneratingShort(false);
        });
    }
  }, [isOpen, initialSlug, scene]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shortUrl = shortSlug ? `${origin}/c/${shortSlug}` : `${origin}/celebrate?c=${compressScene(scene)}`;
  const offlineUrl = `${origin}/celebrate?c=${compressScene(scene)}`;
  const activeUrl = linkType === 'short' ? shortUrl : offlineUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    audio.playSFX('sparkle');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `🎉 Hey ${scene.recipientName}! I created an interactive birthday celebration experience for you: ${activeUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleOpenLive = () => {
    window.open(activeUrl, '_blank');
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
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            [ SHARE DISPATCH // SHORT LINK ]
          </span>
          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer shadow-[1px_1px_0px_#1c1917]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1c1917]">
          SHARE CELEBRATION WITH {scene.recipientName}
        </h3>
        <p className="font-mono text-xs text-zinc-600 mt-1 font-medium">
          Send this concise link to let them experience the interactive birthday scene.
        </p>

        {/* Link Format Switcher */}
        <div className="mt-4 flex items-center gap-2 bg-[#f7f4ed] p-1 border-2 border-[#1c1917]">
          <button
            type="button"
            onClick={() => setLinkType('short')}
            className={`flex-1 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer border ${
              linkType === 'short'
                ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[1px_1px_0px_#1c1917]'
                : 'text-zinc-600 border-transparent hover:text-black'
            }`}
          >
            [ SHORT LINK // CLEAN ]
          </button>
          <button
            type="button"
            onClick={() => setLinkType('offline')}
            className={`flex-1 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors cursor-pointer border ${
              linkType === 'offline'
                ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[1px_1px_0px_#1c1917]'
                : 'text-zinc-600 border-transparent hover:text-black'
            }`}
          >
            [ COMPRESSED OFFLINE ]
          </button>
        </div>

        {/* Share URL Box */}
        <div className="mt-4 p-2.5 bg-[#f7f4ed] border-2 border-[#1c1917] flex items-center justify-between gap-2 shadow-[3px_3px_0px_#1c1917]">
          <div className="flex items-center gap-2 overflow-hidden flex-1 pl-1">
            <LinkIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
            {isGeneratingShort ? (
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>GENERATING SHORT SLUG...</span>
              </div>
            ) : (
              <input
                type="text"
                readOnly
                value={activeUrl}
                className="w-full bg-transparent text-xs text-[#1c1917] font-mono focus:outline-none select-all overflow-hidden text-ellipsis font-bold"
              />
            )}
          </div>
          <button
            onClick={handleCopy}
            disabled={isGeneratingShort}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-bold text-xs uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1.5 flex-shrink-0 cursor-pointer disabled:opacity-50"
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
            <span>OPEN LIVE VIEWPORT</span>
          </button>
        </div>

        <div className="mt-6 pt-3 border-t-2 border-[#1c1917]/20 text-center">
          <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">
            {linkType === 'short'
              ? 'CLEAN UNIQUE SLUG // PERSISTENT SUPABASE RECORD'
              : 'COMPACT LZW COMPRESSED // ZERO SERVER DEPENDENCY'}
          </span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { GuestbookEntry, GuestbookStamp } from '../../types/scene';
import { fetchGuestbookEntries, saveGuestbookEntry } from '../../utils/supabase/db';
import { GuestbookEntryModal } from './GuestbookEntryModal';
import { audio } from '../../utils/audioManager';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Flame,
  Heart,
  Star,
  Zap,
  Cake,
  PenTool,
  Clock,
  MessageSquare
} from 'lucide-react';

interface GuestbookWallProps {
  sceneSlug: string;
  recipientName: string;
  themeAccent?: string;
}

const STAMP_CONFIG: Record<
  GuestbookStamp,
  { label: string; icon: React.ComponentType<{ className?: string }>; badgeColor: string }
> = {
  celebrate: { label: 'CELEBRATION', icon: Sparkles, badgeColor: 'bg-amber-400 text-[#1c1917]' },
  fire: { label: 'LEGENDARY', icon: Flame, badgeColor: 'bg-orange-500 text-white' },
  heart: { label: 'MUCH LOVE', icon: Heart, badgeColor: 'bg-rose-500 text-white' },
  star: { label: 'SHINE BRIGHT', icon: Star, badgeColor: 'bg-yellow-400 text-[#1c1917]' },
  zap: { label: 'POWER MOVE', icon: Zap, badgeColor: 'bg-indigo-600 text-white' },
  cake: { label: 'SWEET YEAR', icon: Cake, badgeColor: 'bg-emerald-600 text-white' }
};

export const GuestbookWall: React.FC<GuestbookWallProps> = ({
  sceneSlug,
  recipientName
}) => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const effectiveSlug = sceneSlug || 'default-celebration';

  useEffect(() => {
    let isMounted = true;
    fetchGuestbookEntries(effectiveSlug).then((data) => {
      if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [effectiveSlug]);

  const handleAddEntry = async (item: {
    sender_name: string;
    message: string;
    stamp: GuestbookStamp;
  }) => {
    const newEntry: GuestbookEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      scene_slug: effectiveSlug,
      sender_name: item.sender_name,
      message: item.message,
      stamp: item.stamp,
      created_at: new Date().toISOString()
    };

    setEntries((prev) => [newEntry, ...prev]);

    // Save to persistence (Supabase & localStorage)
    await saveGuestbookEntry(newEntry);

    // Micro-confetti burst from the button area
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#dc2626', '#2563eb', '#15803d', '#1c1917']
    });
  };

  const renderStampBadge = (stamp: GuestbookStamp) => {
    const config = STAMP_CONFIG[stamp] || STAMP_CONFIG.celebrate;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[9px] font-bold uppercase border border-[#1c1917] shadow-[1px_1px_0px_#1c1917] ${config.badgeColor}`}
      >
        <Icon className="w-3 h-3 flex-shrink-0" />
        <span>{config.label}</span>
      </span>
    );
  };

  return (
    <div className="w-full relative">
      {/* Wall Header & Actions */}
      <div className="border-b-2 border-[#1c1917] pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 bg-amber-400 border border-[#1c1917]" />
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-amber-700">
              [ COMMUNITY WISHES BOARD · {entries.length} {entries.length === 1 ? 'SIGNATURE' : 'SIGNATURES'} ]
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1c1917]">
            GUESTBOOK FOR {recipientName}
          </h3>
        </div>

        <button
          onClick={() => {
            audio.playSFX('sparkle');
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PenTool className="w-4 h-4" />
          <span>[ + SIGN GUESTBOOK ]</span>
        </button>
      </div>

      {/* Wishes Grid */}
      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-zinc-500 uppercase font-semibold">
          LOADING WISHES WALL...
        </div>
      ) : entries.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 bg-[#fcfaf4] border-2 border-dashed border-[#1c1917] text-center flex flex-col items-center gap-3 shadow-[4px_4px_0px_#1c1917]">
          <div className="w-12 h-12 bg-amber-400 border-2 border-[#1c1917] text-[#1c1917] flex items-center justify-center shadow-[3px_3px_0px_#1c1917]">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h4 className="font-mono font-bold text-sm uppercase text-[#1c1917]">
            BE THE FIRST TO SIGN THE GUESTBOOK
          </h4>
          <p className="font-mono text-xs text-zinc-600 max-w-sm leading-relaxed font-medium">
            Leave a personalized birthday note, memory, or wish for {recipientName} on their live board!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 px-5 py-2 bg-white hover:bg-[#eeeae0] text-[#1c1917] font-mono font-bold text-xs uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            [ LEAVE FIRST WISH ]
          </button>
        </div>
      ) : (
        /* Postcard Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-[#fcfaf4] border-2 border-[#1c1917] p-5 shadow-[4px_4px_0px_#1c1917] flex flex-col justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1c1917] transition-all relative group"
            >
              {/* Postmark / Stamp Row */}
              <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2.5 mb-3">
                <div className="font-mono text-xs font-bold uppercase text-[#1c1917] tracking-tight">
                  FROM: {entry.sender_name}
                </div>
                <div>{renderStampBadge(entry.stamp)}</div>
              </div>

              {/* Message Body */}
              <p className="font-sans text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium whitespace-pre-line my-1">
                "{entry.message}"
              </p>

              {/* Timestamp Footer */}
              <div className="mt-4 pt-2.5 border-t border-[#1c1917]/15 flex items-center justify-between font-mono text-[9px] text-zinc-500 uppercase font-semibold">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
                <span className="tracking-widest">VERIFIED POSTMARK</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sign Guestbook Modal */}
      <GuestbookEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddEntry}
        recipientName={recipientName}
      />
    </div>
  );
};

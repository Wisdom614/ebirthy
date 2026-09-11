'use client';

import React, { useState, useEffect } from 'react';
import { GuestbookEntry, GuestbookStamp } from '../../types/scene';
import {
  fetchGuestbookEntries,
  saveGuestbookEntry,
  updateGuestbookEntryReaction,
  toggleGuestbookPin
} from '../../utils/supabase/db';
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
  MessageSquare,
  Send,
  Download,
  Pin,
  Smile,
  Edit3
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

  // Recipient Thank-You Note State
  const [thankYouNote, setThankYouNote] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteDraft, setNoteDraft] = useState<string>('');

  const effectiveSlug = sceneSlug || 'default-celebration';
  const thankYouStorageKey = `ebirthy_thankyou_${effectiveSlug}`;

  useEffect(() => {
    let isMounted = true;
    fetchGuestbookEntries(effectiveSlug).then((data) => {
      if (isMounted) {
        setEntries(data);
        setLoading(false);
      }
    });

    // Load saved thank-you note from local storage
    if (typeof window !== 'undefined') {
      try {
        const savedNote = localStorage.getItem(thankYouStorageKey);
        if (savedNote) {
          setThankYouNote(savedNote);
          setNoteDraft(savedNote);
        } else {
          const defaultNote = `Thank you to everyone who took the time to celebrate and leave such warm wishes! You made my birthday truly unforgettable. — ${recipientName}`;
          setThankYouNote(defaultNote);
          setNoteDraft(defaultNote);
        }
      } catch {}
    }

    return () => {
      isMounted = false;
    };
  }, [effectiveSlug, recipientName, thankYouStorageKey]);

  const handleSaveThankYouNote = () => {
    setThankYouNote(noteDraft);
    setIsEditingNote(false);
    audio.playSFX('sparkle');
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(thankYouStorageKey, noteDraft);
      } catch {}
    }
  };

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
      reactions: { heart: 1, cheers: 0, star: 0 },
      is_pinned: false,
      created_at: new Date().toISOString()
    };

    setEntries((prev) => [newEntry, ...prev]);

    // Save to persistence (Supabase & localStorage)
    await saveGuestbookEntry(newEntry);

    // Micro-confetti burst from the button area
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#f59e0b', '#dc2626', '#2563eb', '#15803d', '#1c1917']
    });
  };

  const handleReaction = (entryId: string, reactionType: 'heart' | 'cheers' | 'star', e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playSFX('sparkle');

    const updated = updateGuestbookEntryReaction(effectiveSlug, entryId, reactionType);

    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === entryId) {
          return {
            ...item,
            reactions: updated
          };
        }
        return item;
      })
    );

    // Micro sparkle confetti
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 15,
      spread: 40,
      origin: { x, y },
      colors: ['#f59e0b', '#ef4444', '#3b82f6', '#10b981']
    });
  };

  const handleTogglePin = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audio.playSFX('chime');
    const isPinned = toggleGuestbookPin(effectiveSlug, entryId);

    setEntries((prev) =>
      prev.map((item) => {
        if (item.id === entryId) {
          return {
            ...item,
            is_pinned: isPinned
          };
        }
        return item;
      })
    );
  };

  const handleWhatsAppInvite = () => {
    audio.playSFX('sparkle');
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `[ GUESTBOOK DISPATCH ] Drop your birthday wishes and memories for ${recipientName} on their live celebration board: ${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleExportWishes = () => {
    audio.playSFX('sparkle');
    const title = `=====================================================\nBIRTHDAY WISHES ARCHIVE FOR ${recipientName.toUpperCase()}\nCOMMEMORATIVE GUESTBOOK DISPATCH\n=====================================================\n\n`;
    
    const thankYouSection = thankYouNote ? `RECIPIENT APPRECIATION NOTE:\n"${thankYouNote}"\n\n-----------------------------------------------------\n\n` : '';

    const entriesText = entries.map((e, idx) => {
      const date = new Date(e.created_at).toLocaleDateString();
      return `[ENTRY #${idx + 1}] FROM: ${e.sender_name.toUpperCase()} (STAMP: ${e.stamp.toUpperCase()}) - ${date}\n"${e.message}"\n`;
    }).join('\n-----------------------------------------------------\n\n');

    const fullArchive = title + thankYouSection + entriesText + `\n\nEXPORTED FROM EBIRTHY CELEBRATION STUDIO`;

    const blob = new Blob([fullArchive], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const safeName = recipientName.toLowerCase().replace(/\s+/g, '-');
    link.download = `${safeName}-birthday-wishes-archive.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 }
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

  // Sort entries so pinned items appear first
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="w-full relative">
      {/* Wall Header & Actions */}
      <div className="border-b-2 border-[#1c1917] pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleWhatsAppInvite}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            title="Invite friends to sign on WhatsApp"
          >
            <Send className="w-3.5 h-3.5" />
            <span>[ INVITE FRIENDS ]</span>
          </button>

          {entries.length > 0 && (
            <button
              onClick={handleExportWishes}
              className="px-3.5 py-2 bg-white hover:bg-[#eeeae0] text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              title="Download text archive of all wishes"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>[ EXPORT ARCHIVE ]</span>
            </button>
          )}

          <button
            onClick={() => {
              audio.playSFX('sparkle');
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[3px_3px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>[ + SIGN GUESTBOOK ]</span>
          </button>
        </div>
      </div>

      {/* Recipient Official Appreciation Memo Card */}
      <div className="mb-6 p-4 sm:p-5 bg-[#fffbeb] border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] relative">
        <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Smile className="w-4 h-4 text-amber-600" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#1c1917]">
              [ OFFICIAL APPRECIATION NOTE FROM {recipientName.toUpperCase()} ]
            </span>
          </div>

          <button
            onClick={() => setIsEditingNote(!isEditingNote)}
            className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-700 hover:text-black flex items-center gap-1 underline cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isEditingNote ? 'CANCEL' : 'EDIT NOTE'}</span>
          </button>
        </div>

        {isEditingNote ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-white border-2 border-[#1c1917] font-sans text-xs sm:text-sm text-[#1c1917] focus:outline-none"
              placeholder="Write your thank-you note to everyone who wished you..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveThankYouNote}
                className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] cursor-pointer"
              >
                [ SAVE APPRECIATION NOTE ]
              </button>
            </div>
          </div>
        ) : (
          <p className="font-sans text-xs sm:text-sm text-zinc-800 leading-relaxed font-semibold italic">
            "{thankYouNote}"
          </p>
        )}
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
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-[#1c1917] font-mono font-bold text-xs uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
            >
              [ LEAVE FIRST WISH ]
            </button>
            <button
              onClick={handleWhatsAppInvite}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] cursor-pointer"
            >
              [ SHARE ON WHATSAPP ]
            </button>
          </div>
        </div>
      ) : (
        /* Postcard Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedEntries.map((entry) => (
            <div
              key={entry.id}
              className={`bg-[#fcfaf4] border-2 border-[#1c1917] p-5 shadow-[4px_4px_0px_#1c1917] flex flex-col justify-between hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0px_#1c1917] transition-all relative group ${
                entry.is_pinned ? 'ring-2 ring-amber-500 bg-[#fffdfa]' : ''
              }`}
            >
              {/* Pinned Badge if marked */}
              {entry.is_pinned && (
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-amber-400 text-[#1c1917] font-mono text-[9px] font-extrabold uppercase border border-[#1c1917] shadow-[1px_1px_0px_#1c1917] flex items-center gap-1 z-10">
                  <Star className="w-2.5 h-2.5 fill-current" />
                  <span>[ PINNED MEMORY ]</span>
                </div>
              )}

              {/* Postmark / Stamp Row */}
              <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2.5 mb-3 mt-1">
                <div className="font-mono text-xs font-bold uppercase text-[#1c1917] tracking-tight">
                  FROM: {entry.sender_name}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleTogglePin(entry.id, e)}
                    className="p-1 hover:bg-zinc-200 text-zinc-500 hover:text-black transition-colors cursor-pointer"
                    title={entry.is_pinned ? 'Unpin message' : 'Pin to top'}
                  >
                    <Pin className={`w-3 h-3 ${entry.is_pinned ? 'fill-amber-500 text-amber-700' : ''}`} />
                  </button>
                  {renderStampBadge(entry.stamp)}
                </div>
              </div>

              {/* Message Body */}
              <p className="font-sans text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium whitespace-pre-line my-1">
                "{entry.message}"
              </p>

              {/* Interactive Reaction & Timestamp Footer */}
              <div className="mt-4 pt-3 border-t border-[#1c1917]/15 flex items-center justify-between flex-wrap gap-2">
                {/* Micro Reactions Deck - Clean Vector Icons, No Emojis */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleReaction(entry.id, 'heart', e)}
                    className="px-2 py-0.5 bg-white hover:bg-rose-50 border border-[#1c1917] font-mono text-[10px] font-bold text-[#1c1917] shadow-[1px_1px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 cursor-pointer transition-colors"
                    title="Send love reaction"
                  >
                    <Heart className="w-3 h-3 text-rose-600 fill-rose-600" />
                    <span>{entry.reactions?.heart || 0}</span>
                  </button>

                  <button
                    onClick={(e) => handleReaction(entry.id, 'cheers', e)}
                    className="px-2 py-0.5 bg-white hover:bg-amber-50 border border-[#1c1917] font-mono text-[10px] font-bold text-[#1c1917] shadow-[1px_1px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 cursor-pointer transition-colors"
                    title="Toast / Cheers"
                  >
                    <Flame className="w-3 h-3 text-amber-600" />
                    <span>{entry.reactions?.cheers || 0}</span>
                  </button>

                  <button
                    onClick={(e) => handleReaction(entry.id, 'star', e)}
                    className="px-2 py-0.5 bg-white hover:bg-yellow-50 border border-[#1c1917] font-mono text-[10px] font-bold text-[#1c1917] shadow-[1px_1px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none flex items-center gap-1 cursor-pointer transition-colors"
                    title="Sparkle star"
                  >
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{entry.reactions?.star || 0}</span>
                  </button>
                </div>

                {/* Timestamp */}
                <div className="font-mono text-[9px] text-zinc-500 uppercase font-semibold flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>
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

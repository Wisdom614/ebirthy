'use client';

import React, { useState } from 'react';
import { GuestbookStamp } from '../../types/scene';
import { audio } from '../../utils/audioManager';
import { X, Sparkles, Flame, Heart, Star, Zap, Cake, Send } from 'lucide-react';

interface GuestbookEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: { sender_name: string; message: string; stamp: GuestbookStamp }) => void;
  recipientName: string;
}

const STAMP_OPTIONS: Array<{
  id: GuestbookStamp;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = [
  { id: 'celebrate', label: 'CELEBRATION', icon: Sparkles, color: 'bg-amber-400 text-[#1c1917]' },
  { id: 'fire', label: 'LEGENDARY', icon: Flame, color: 'bg-orange-500 text-white' },
  { id: 'heart', label: 'MUCH LOVE', icon: Heart, color: 'bg-rose-500 text-white' },
  { id: 'star', label: 'SHINE BRIGHT', icon: Star, color: 'bg-yellow-400 text-[#1c1917]' },
  { id: 'zap', label: 'POWER MOVE', icon: Zap, color: 'bg-indigo-600 text-white' },
  { id: 'cake', label: 'SWEET YEAR', icon: Cake, color: 'bg-emerald-600 text-white' }
];

export const GuestbookEntryModal: React.FC<GuestbookEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  recipientName
}) => {
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedStamp, setSelectedStamp] = useState<GuestbookStamp>('celebrate');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    audio.playSFX('sparkle');
    
    onSubmit({
      sender_name: senderName.trim(),
      message: message.trim(),
      stamp: selectedStamp
    });

    setSenderName('');
    setMessage('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full bg-[#fcfaf4] border-2 border-[#1c1917] p-6 sm:p-8 shadow-[8px_8px_0px_#1c1917] text-[#1c1917] animate-in zoom-in-95 duration-150"
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-400 border border-[#1c1917]" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-700">
              [ SIGN BIRTHDAY WISHES WALL ]
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1c1917]">
          LEAVE A BIRTHDAY WISH FOR {recipientName}
        </h3>
        <p className="font-mono text-xs text-zinc-600 mt-1 font-semibold">
          Your personal signature and reaction badge will appear on their live celebration board.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Signer Name Input */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              YOUR NAME / SENDER *
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Sarah & Leo, The London Crew..."
              className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
            />
          </div>

          {/* Birthday Wish Textarea */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              YOUR BIRTHDAY WISH *
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt note, memory, or celebratory wish..."
              className="w-full px-3.5 py-2.5 bg-white border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917] leading-relaxed"
            />
          </div>

          {/* Reaction Stamp Badge Selector */}
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-2">
              SELECT REACTION POSTMARK STAMP
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STAMP_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedStamp === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedStamp(opt.id)}
                    className={`p-2 font-mono text-[10px] font-bold uppercase border-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? `${opt.color} border-[#1c1917] shadow-[3px_3px_0px_#1c1917] translate-x-[-1px] translate-y-[-1px]`
                        : 'bg-white border-[#1c1917]/30 text-zinc-600 hover:border-[#1c1917] hover:bg-[#eeeae0]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !senderName.trim() || !message.trim()}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#1c1917] font-mono font-bold text-xs uppercase tracking-wider border-2 border-[#1c1917] shadow-[4px_4px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>[ STAMP & POST WISH ]</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

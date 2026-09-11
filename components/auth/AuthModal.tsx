'use client';

import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../utils/supabase/client';
import { audio } from '../../utils/audioManager';
import { X, Mail, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Cloud authentication is currently not connected. Please try again later.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signup') {
        const { error, data } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;
        setSuccessMsg(
          data.session
            ? 'Account created successfully! [ OK ]'
            : 'Account registered. Please check email for verification.'
        );
        audio.playSFX('sparkle');
        if (data.session) {
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1200);
        }
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        setSuccessMsg('Authentication successful.');
        audio.playSFX('sparkle');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-md w-full bg-white border-2 border-[#1c1917] p-6 sm:p-8 shadow-[8px_8px_0px_#1c1917] text-[#1c1917] animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b-2 border-[#1c1917] pb-3 mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-600">
            [ USER AUTHENTICATION ]
          </span>
          <button
            onClick={onClose}
            className="p-1 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1c1917]">
          {mode === 'signin' ? 'SIGN IN TO STUDIO' : 'REGISTER CREATOR ACCOUNT'}
        </h3>
        <p className="font-mono text-xs text-zinc-600 mt-1 font-medium">
          Store, update, and manage your custom celebration scenes in cloud.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-100 border-2 border-rose-600 text-rose-800 font-mono text-xs font-semibold">
            [ ERROR: {errorMsg} ]
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-800 font-mono text-xs font-semibold">
            [ OK: {successMsg} ]
          </div>
        )}

        <form onSubmit={handleAuth} className="mt-6 space-y-4">
          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#1c1917] mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#f7f4ed] border-2 border-[#1c1917] text-[#1c1917] font-mono text-xs focus:outline-none focus:border-amber-500 shadow-[2px_2px_0px_#1c1917]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono text-xs font-bold uppercase tracking-wider shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>PROCESSING...</span>
            ) : mode === 'signin' ? (
              <span>[ SIGN IN TO WORKSPACE ]</span>
            ) : (
              <span>[ CREATE FREE ACCOUNT ]</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#1c1917]/20 text-center font-mono text-xs text-zinc-600 font-medium">
          {mode === 'signin' ? (
            <p>
              NO ACCOUNT YET?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-amber-700 font-bold underline cursor-pointer"
              >
                CREATE ONE
              </button>
            </p>
          ) : (
            <p>
              ALREADY REGISTERED?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-amber-700 font-bold underline cursor-pointer"
              >
                SIGN IN
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

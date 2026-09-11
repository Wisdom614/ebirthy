'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SceneConfig } from '../../types/scene';
import { DEFAULT_SCENE, PRESET_TEMPLATES } from '../../utils/presets';
import { decodeScene, encodeScene } from '../../utils/sceneEncoder';
import { supabase, isSupabaseConfigured } from '../../utils/supabase/client';
import { saveSceneToSupabase, fetchSceneById } from '../../utils/supabase/db';
import { CelebrationCanvas } from '../../components/scene/CelebrationCanvas';
import { DetailsForm } from '../../components/studio/DetailsForm';
import { ThemeSelector } from '../../components/studio/ThemeSelector';
import { EffectsCustomizer } from '../../components/studio/EffectsCustomizer';
import { MemoryGalleryEditor } from '../../components/studio/MemoryGalleryEditor';
import { ShareModal } from '../../components/studio/ShareModal';
import { AuthModal } from '../../components/auth/AuthModal';
import { SavedScenesDrawer } from '../../components/studio/SavedScenesDrawer';
import { audio } from '../../utils/audioManager';
import {
  Share2,
  Eye,
  Play,
  FolderHeart,
  Cloud,
  Check,
  Loader2,
  LogIn,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

function StudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [scene, setScene] = useState<SceneConfig>(DEFAULT_SCENE);
  const [activeTab, setActiveTab] = useState<'details' | 'theme' | 'effects' | 'gallery'>('details');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // User auth state
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const data = searchParams.get('data');
    const id = searchParams.get('id');

    if (data) {
      const decoded = decodeScene(data);
      setScene(decoded);
    } else if (id) {
      fetchSceneById(id).then((record) => {
        if (record) {
          setScene(record.config);
          setCurrentSceneId(record.id);
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateScene = (updated: Partial<SceneConfig>) => {
    setScene((prev) => ({ ...prev, ...updated }));
  };

  const loadPreset = (presetKey: string) => {
    const preset = PRESET_TEMPLATES[presetKey];
    if (preset) {
      setScene(preset.config);
      setCurrentSceneId(undefined);
    }
  };

  const handleSaveToCloud = async () => {
    if (!isSupabaseConfigured) {
      alert('Supabase is not configured yet. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env');
      return;
    }

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const result = await saveSceneToSupabase(scene, user?.id, currentSceneId);
      if (result) {
        setCurrentSceneId(result.id);
        setSavedSuccess(true);
        audio.playSFX('sparkle');
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('Save to cloud failed:', err);
      alert(err.message || 'Failed to save scene to cloud');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  const handleLaunchLive = () => {
    const encoded = encodeScene(scene);
    router.push(`/celebrate?data=${encoded}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex flex-col font-sans">
      {/* Swiss Architectural Top Navbar */}
      <header className="h-16 border-b-2 border-[#1c1917] bg-white px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 gap-3">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/"
            className="p-2 bg-[#f7f4ed] hover:bg-[#eeeae0] border-2 border-[#1c1917] text-[#1c1917] transition-colors shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-400 border-2 border-[#1c1917] text-[#1c1917] font-mono font-extrabold text-xs flex items-center justify-center shadow-[2px_2px_0px_#1c1917]">
              01
            </div>
            <div>
              <h1 className="font-mono font-extrabold text-xs sm:text-sm uppercase tracking-tight text-[#1c1917]">
                BIRTHDAY STUDIO
              </h1>
              <span className="font-mono text-[9px] text-amber-700 block uppercase font-bold tracking-wider">
                VIP: {scene.recipientName}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Presets Quick Bar (Hidden on smaller screens) */}
        <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 bg-[#f7f4ed] border-2 border-[#1c1917]">
          <span className="font-mono text-[10px] text-stone-600 uppercase font-extrabold">PRESETS:</span>
          {Object.entries(PRESET_TEMPLATES).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => loadPreset(key)}
              className="px-2 py-0.5 bg-white hover:bg-amber-100 border border-[#1c1917] font-mono text-[10px] font-bold uppercase text-[#1c1917] transition-colors cursor-pointer"
            >
              <span>{preset.tag}</span>
            </button>
          ))}
        </div>

        {/* Right: Cloud, Auth & Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Cloud Save Button */}
          <button
            onClick={handleSaveToCloud}
            disabled={isSaving}
            className={`px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 ${
              savedSuccess
                ? 'bg-emerald-400 text-[#1c1917]'
                : 'bg-[#f7f4ed] hover:bg-[#eeeae0] text-[#1c1917]'
            }`}
            title="Save to Supabase Cloud"
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : savedSuccess ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span className="hidden sm:inline">{savedSuccess ? 'SAVED' : 'SAVE CLOUD'}</span>
          </button>

          {/* My Scenes Drawer Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2 bg-[#f7f4ed] hover:bg-[#eeeae0] border-2 border-[#1c1917] text-amber-700 shadow-[2px_2px_0px_#1c1917] transition-colors cursor-pointer"
            title="My Saved Scenes"
          >
            <FolderHeart className="w-4 h-4" />
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleSignOut}
              className="p-2 bg-white hover:bg-rose-100 border-2 border-[#1c1917] text-zinc-700 hover:text-rose-700 transition-colors cursor-pointer hidden sm:block shadow-[2px_2px_0px_#1c1917]"
              title={`Signed in as ${user.email} (Click to Sign Out)`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-2.5 py-1.5 bg-white hover:bg-[#eeeae0] border-2 border-[#1c1917] font-mono text-xs uppercase text-[#1c1917] font-bold transition-colors cursor-pointer hidden sm:flex items-center gap-1 shadow-[2px_2px_0px_#1c1917]"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span>SIGN IN</span>
            </button>
          )}

          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="md:hidden px-2.5 py-1.5 bg-white border-2 border-[#1c1917] font-mono text-xs uppercase text-[#1c1917] font-bold flex items-center gap-1 shadow-[2px_2px_0px_#1c1917]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showMobilePreview ? 'EDIT' : 'PREVIEW'}</span>
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-[#1c1917] border-2 border-[#1c1917] font-mono font-bold text-xs uppercase shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>[ SHARE ]</span>
          </button>

          {/* Full View Live Link */}
          <button
            onClick={handleLaunchLive}
            className="hidden sm:flex px-3.5 py-1.5 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] font-mono font-bold text-xs uppercase shadow-[3px_3px_0px_#1c1917] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none items-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-amber-600" />
            <span>[ FULL VIEW ]</span>
          </button>
        </div>
      </header>

      {/* Swiss Grid Studio Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Side: Editor Panels */}
        <div
          className={`w-full md:w-[480px] lg:w-[540px] flex-shrink-0 flex flex-col border-r-2 border-[#1c1917] bg-[#f7f4ed] overflow-y-auto ${
            showMobilePreview ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Navigation Sub-Tabs */}
          <div className="p-2 border-b-2 border-[#1c1917] flex items-center gap-1.5 overflow-x-auto bg-[#eeeae0] sticky top-0 z-20">
            {[
              { id: 'details', label: '[ 01 // DETAILS ]' },
              { id: 'theme', label: '[ 02 // PALETTE ]' },
              { id: 'effects', label: '[ 03 // PHYSICS ]' },
              { id: 'gallery', label: '[ 04 // MEDIA ]' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as unknown as typeof activeTab)}
                  className={`px-3 py-2 font-mono text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap transition-all cursor-pointer border-2 ${
                    isActive
                      ? 'bg-amber-400 text-[#1c1917] border-[#1c1917] shadow-[2px_2px_0px_#1c1917]'
                      : 'bg-white text-zinc-700 border-[#1c1917] hover:bg-[#eeeae0]'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="p-4 sm:p-6 pb-24">
            {activeTab === 'details' && <DetailsForm scene={scene} onChange={updateScene} />}
            {activeTab === 'theme' && <ThemeSelector scene={scene} onChange={updateScene} />}
            {activeTab === 'effects' && <EffectsCustomizer scene={scene} onChange={updateScene} />}
            {activeTab === 'gallery' && <MemoryGalleryEditor scene={scene} onChange={updateScene} />}
          </div>
        </div>

        {/* Right Side: Live Simulator Viewport */}
        <div
          className={`flex-1 flex-col bg-[#eeeae0] relative overflow-hidden ${
            showMobilePreview ? 'flex' : 'hidden md:flex'
          }`}
        >
          {/* Simulator Toolbar */}
          <div className="h-12 border-b-2 border-[#1c1917] bg-white px-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-amber-400 border border-[#1c1917]" />
              <span className="font-mono text-xs font-bold uppercase text-[#1c1917]">[ SIMULATOR // LIVE VIEW ]</span>
            </div>

            {/* Device Switcher */}
            <div className="flex items-center gap-1 bg-[#f7f4ed] p-1 border-2 border-[#1c1917]">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2 py-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                  previewDevice === 'desktop' ? 'bg-amber-400 text-[#1c1917] border-[#1c1917]' : 'text-zinc-600 border-transparent hover:text-black'
                }`}
              >
                DESKTOP
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2 py-1 font-mono text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                  previewDevice === 'mobile' ? 'bg-amber-400 text-[#1c1917] border-[#1c1917]' : 'text-zinc-600 border-transparent hover:text-black'
                }`}
              >
                MOBILE
              </button>
            </div>
          </div>

          {/* Viewport Canvas Wrapper */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-2 sm:p-6 bg-[#f7f4ed] grid-bg">
            {previewDevice === 'mobile' ? (
              /* Mobile Straight Bezel */
              <div className="w-[375px] h-[720px] border-4 border-[#1c1917] bg-white shadow-[8px_8px_0px_#1c1917] overflow-hidden relative flex flex-col">
                <div className="h-5 bg-[#eeeae0] border-b-2 border-[#1c1917] flex items-center justify-between px-3 text-[9px] font-mono font-bold text-[#1c1917]">
                  <span>MOBILE VIEW</span>
                  <span>9:41 AM</span>
                </div>
                <div className="flex-1 overflow-y-auto relative">
                  <CelebrationCanvas
                    scene={scene}
                    previewMode={false}
                    onShareClick={() => setIsShareModalOpen(true)}
                  />
                </div>
              </div>
            ) : (
              /* Full Responsive Desktop Canvas */
              <div className="w-full h-full border-2 border-[#1c1917] overflow-y-auto shadow-[8px_8px_0px_#1c1917] relative bg-white">
                <CelebrationCanvas
                  scene={scene}
                  previewMode={false}
                  onShareClick={() => setIsShareModalOpen(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        scene={scene}
        slug={currentSceneId}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Auth Modal Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAuthModalOpen(false)}
      />

      {/* Saved Scenes Drawer */}
      <SavedScenesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        userId={user?.id}
        onSelectScene={(selected, id) => {
          setScene(selected);
          setCurrentSceneId(id);
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] flex items-center justify-center font-mono text-xs uppercase">[ LOADING WORKSPACE... ]</div>}>
      <StudioContent />
    </Suspense>
  );
}

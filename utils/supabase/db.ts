import { supabase, isSupabaseConfigured } from './client';
import { SceneConfig } from '../../types/scene';
import { generateSceneSlug } from '../sceneEncoder';

export interface SavedSceneRecord {
  id: string;
  user_id?: string;
  slug?: string;
  recipient_name: string;
  sender_name?: string;
  theme: string;
  config: SceneConfig;
  view_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Saves or updates a scene in Supabase with a short unique slug
 */
export async function saveSceneToSupabase(
  scene: SceneConfig,
  userId?: string,
  existingId?: string,
  customSlug?: string
): Promise<SavedSceneRecord | null> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env');
  }

  const slug = customSlug || generateSceneSlug(scene.recipientName, scene.age);

  const payload = {
    recipient_name: scene.recipientName || 'Friend',
    sender_name: scene.senderName || '',
    theme: scene.theme,
    config: scene,
    slug: slug,
    ...(userId ? { user_id: userId } : {})
  };

  if (existingId) {
    const { data, error } = await supabase
      .from('scenes')
      .update(payload)
      .eq('id', existingId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('scenes')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

/**
 * Fetches a scene by UUID or Slug
 */
export async function fetchSceneById(idOrSlug: string): Promise<SavedSceneRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  // Check if it looks like a UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);

  const query = isUuid
    ? supabase.from('scenes').select('*').eq('id', idOrSlug).single()
    : supabase.from('scenes').select('*').eq('slug', idOrSlug).single();

  const { data, error } = await query;
  if (error || !data) return null;

  // Increment view count asynchronously
  try {
    supabase.rpc('increment_scene_views', { scene_id: data.id }).then();
  } catch {}

  return data;
}

/**
 * Fetches all scenes created by an authenticated user
 */
export async function fetchUserScenes(userId: string): Promise<SavedSceneRecord[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from('scenes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch user scenes:', error);
    return [];
  }

  return data || [];
}

/**
 * Deletes a scene
 */
export async function deleteSceneFromSupabase(sceneId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('scenes')
    .delete()
    .eq('id', sceneId);

  return !error;
}

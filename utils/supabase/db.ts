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

  const slug = customSlug || generateSceneSlug(scene.recipientName, scene.birthDate || scene.age);

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
      .upsert([payload], { onConflict: 'slug' })
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

const LOCAL_GUESTBOOK_PREFIX = 'ebirthy_guestbook_';

const isValidUuid = (str?: string): boolean =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

/**
 * Fetches guestbook entries for a given scene slug
 */
export async function fetchGuestbookEntries(sceneSlug: string): Promise<import('../../types/scene').GuestbookEntry[]> {
  const localKey = `${LOCAL_GUESTBOOK_PREFIX}${sceneSlug}`;
  let localEntries: import('../../types/scene').GuestbookEntry[] = [];
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(localKey);
      if (cached) localEntries = JSON.parse(cached);
    } catch {}
  }

  if (!isSupabaseConfigured || !supabase) {
    return localEntries;
  }

  try {
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .eq('scene_slug', sceneSlug)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase guestbook fetch notice, using local cache:', error);
      return localEntries;
    }

    if (data && data.length > 0) {
      // Update local storage with authoritative cloud data
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(localKey, JSON.stringify(data));
        } catch {}
      }
      return data;
    }

    return localEntries;
  } catch {
    return localEntries;
  }
}

/**
 * Adds a new signature/wish to the guestbook and persists to Supabase cloud
 */
export async function saveGuestbookEntry(
  entry: import('../../types/scene').GuestbookEntry
): Promise<import('../../types/scene').GuestbookEntry | null> {
  const localKey = `${LOCAL_GUESTBOOK_PREFIX}${entry.scene_slug}`;
  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(localKey);
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(entry);
      localStorage.setItem(localKey, JSON.stringify(list));
    } catch {}
  }

  if (!isSupabaseConfigured || !supabase) {
    return entry;
  }

  try {
    const payload: {
      id?: string;
      scene_slug: string;
      sender_name: string;
      message: string;
      stamp: string;
      created_at: string;
    } = {
      scene_slug: entry.scene_slug,
      sender_name: entry.sender_name || 'Anonymous Friend',
      message: entry.message || '',
      stamp: entry.stamp || 'celebrate',
      created_at: entry.created_at || new Date().toISOString()
    };

    // Only include id if it's a valid Postgres UUID
    if (entry.id && isValidUuid(entry.id)) {
      payload.id = entry.id;
    }

    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Supabase guestbook insert failed:', error);
      return null;
    }

    // If Supabase generated an ID or returned the created row, update local cache
    if (data && typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem(localKey);
        if (existing) {
          const list = JSON.parse(existing);
          const updatedList = list.map((item: any) =>
            item.id === entry.id ? { ...item, id: data.id } : item
          );
          localStorage.setItem(localKey, JSON.stringify(updatedList));
        }
      } catch {}
    }

    return data || entry;
  } catch (err) {
    console.error('Guestbook save error:', err);
    return null;
  }
}

/**
 * Updates an entry's reaction tally or pin status in local cache
 */
export function updateGuestbookEntryReaction(
  sceneSlug: string,
  entryId: string,
  reactionType: 'heart' | 'cheers' | 'star'
): { [key: string]: number } {
  const localKey = `${LOCAL_GUESTBOOK_PREFIX}${sceneSlug}`;
  let updatedReactions: { [key: string]: number } = {};

  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(localKey);
      const list = existing ? JSON.parse(existing) : [];
      const updatedList = list.map((item: any) => {
        if (item.id === entryId) {
          const currentReactions = item.reactions || {};
          const currentCount = currentReactions[reactionType] || 0;
          item.reactions = {
            ...currentReactions,
            [reactionType]: currentCount + 1
          };
          updatedReactions = item.reactions;
        }
        return item;
      });
      localStorage.setItem(localKey, JSON.stringify(updatedList));
    } catch {}
  }

  return updatedReactions;
}

/**
 * Toggles an entry's pinned status in local cache
 */
export function toggleGuestbookPin(sceneSlug: string, entryId: string): boolean {
  const localKey = `${LOCAL_GUESTBOOK_PREFIX}${sceneSlug}`;
  let isPinned = false;

  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(localKey);
      const list = existing ? JSON.parse(existing) : [];
      const updatedList = list.map((item: any) => {
        if (item.id === entryId) {
          item.is_pinned = !item.is_pinned;
          isPinned = item.is_pinned;
        }
        return item;
      });
      localStorage.setItem(localKey, JSON.stringify(updatedList));
    } catch {}
  }

  return isPinned;
}

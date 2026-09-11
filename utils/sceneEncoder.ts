import LZString from 'lz-string';
import { nanoid } from 'nanoid';
import { SceneConfig } from '../types/scene';
import { DEFAULT_SCENE } from './presets';

/**
 * Generates a clean, short human-readable slug (e.g. 'alex24-k9x' or 'alex2026')
 */
export function generateSceneSlug(recipientName: string, age?: number): string {
  const cleanName = (recipientName || 'friend')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 10);
  
  const currentYear = new Date().getFullYear();
  const randomSuffix = nanoid(4).toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Format: [name][age or year]-[shortSuffix]
  const tag = age ? `${age}` : `${currentYear}`;
  return `${cleanName}${tag}-${randomSuffix}`;
}

/**
 * Encodes a SceneConfig object into a compact LZ-compressed URL-safe string
 */
export function compressScene(scene: SceneConfig): string {
  try {
    const jsonStr = JSON.stringify(scene);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (err) {
    console.error('Failed to compress scene with LZ-string:', err);
    return encodeSceneFallback(scene);
  }
}

/**
 * Legacy Base64 encoding fallback
 */
function encodeSceneFallback(scene: SceneConfig): string {
  try {
    const jsonStr = JSON.stringify(scene);
    const utf8Bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

export const encodeScene = compressScene;

/**
 * Decodes either an LZ-compressed string or a legacy Base64 string back into a SceneConfig object
 */
export function decodeScene(encoded: string): SceneConfig {
  if (!encoded) return DEFAULT_SCENE;

  try {
    // 1. Try LZ-string decompression first
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (decompressed) {
      const parsed = JSON.parse(decompressed);
      return mergeWithDefaultScene(parsed);
    }
  } catch {
    // Continue to legacy fallback
  }

  try {
    // 2. Try legacy Base64 decoding
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonStr);
    return mergeWithDefaultScene(parsed);
  } catch (err) {
    console.warn('Failed to decode scene data, using default:', err);
    return DEFAULT_SCENE;
  }
}

function mergeWithDefaultScene(parsed: any): SceneConfig {
  return {
    ...DEFAULT_SCENE,
    ...parsed,
    giftContent: {
      ...DEFAULT_SCENE.giftContent,
      ...(parsed.giftContent || {})
    },
    photos: Array.isArray(parsed.photos) ? parsed.photos : DEFAULT_SCENE.photos
  };
}

/**
 * Generates the clean short shareable URL
 */
export function getShareableUrl(scene: SceneConfig, slugOrId?: string, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  const slug = slugOrId || generateSceneSlug(scene.recipientName, scene.age);
  return `${base}/c/${slug}`;
}

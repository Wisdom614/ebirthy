/**
 * Scene Edit Expiry & Window Utilities
 * Creators have a 3-day (72-hour) window from creation time to edit scene content.
 */

export const EDIT_WINDOW_DAYS = 3;
export const EDIT_WINDOW_HOURS = EDIT_WINDOW_DAYS * 24; // 72 hours
export const EDIT_WINDOW_MS = EDIT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export interface SceneEditStatus {
  canEdit: boolean;
  isExpired: boolean;
  createdAt?: Date;
  expiresAt?: Date;
  remainingMs: number;
  formattedRemaining: string;
  isNew: boolean;
}

/**
 * Calculates whether a scene can still be edited by the creator
 * based on its creation timestamp.
 */
export function getSceneEditStatus(createdAtIso?: string | null): SceneEditStatus {
  if (!createdAtIso) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + EDIT_WINDOW_MS);
    return {
      canEdit: true,
      isExpired: false,
      createdAt: now,
      expiresAt,
      remainingMs: EDIT_WINDOW_MS,
      formattedRemaining: '3d 0h left to edit',
      isNew: true
    };
  }

  const createdAt = new Date(createdAtIso);
  const now = new Date();

  if (isNaN(createdAt.getTime())) {
    return {
      canEdit: true,
      isExpired: false,
      remainingMs: EDIT_WINDOW_MS,
      formattedRemaining: '3d 0h left to edit',
      isNew: true
    };
  }

  const expiresAt = new Date(createdAt.getTime() + EDIT_WINDOW_MS);
  const remainingMs = expiresAt.getTime() - now.getTime();

  if (remainingMs <= 0) {
    return {
      canEdit: false,
      isExpired: true,
      createdAt,
      expiresAt,
      remainingMs: 0,
      formattedRemaining: 'Edit window closed',
      isNew: false
    };
  }

  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingMs / (1000 * 60)) % 60);

  let formatted = '';
  if (days > 0) {
    formatted = `${days}d ${hours}h left to edit`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m left to edit`;
  } else {
    formatted = `${minutes}m left to edit`;
  }

  return {
    canEdit: true,
    isExpired: false,
    createdAt,
    expiresAt,
    remainingMs,
    formattedRemaining: formatted,
    isNew: false
  };
}

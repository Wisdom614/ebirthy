import { supabase, isSupabaseConfigured } from '../supabase/client';

const VISITOR_STORAGE_KEY = 'ebirthy_visitor_id';

const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getOrCreateVisitorId = (): string => {
  if (typeof window === 'undefined') return 'server';
  try {
    let vid = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!vid) {
      vid = `v_${generateUUID()}`;
      localStorage.setItem(VISITOR_STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return `v_${Math.random().toString(36).substring(2, 10)}`;
  }
};

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

const getBrowserName = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('SamsungBrowser')) return 'Samsung Browser';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  if (ua.includes('Trident')) return 'Internet Explorer';
  if (ua.includes('Edge') || ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Browser';
};

const getOSName = (): string => {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac') || ua.includes('iPhone') || ua.includes('iPad')) return 'Apple';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'OS';
};

export interface ActiveSession {
  sessionId: string;
  visitorId: string;
  path: string;
  startTime: number;
}

let activeSession: ActiveSession | null = null;
let heartbeatInterval: any = null;

/**
 * Initializes a new page session in Supabase and starts duration heartbeat
 */
export async function trackPageView(path: string): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // Flush previous session if changing route
  if (activeSession) {
    flushSessionDuration();
    if (heartbeatInterval) clearInterval(heartbeatInterval);
  }

  const visitorId = getOrCreateVisitorId();
  const sessionId = generateUUID();
  const startTime = Date.now();

  activeSession = {
    sessionId,
    visitorId,
    path,
    startTime
  };

  const deviceType = getDeviceType();
  const browser = getBrowserName();
  const os = getOSName();
  const screenSize = `${window.innerWidth}x${window.innerHeight}`;
  const referrer = document.referrer ? new URL(document.referrer, window.location.href).hostname : 'Direct / App';

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('visitor_sessions').insert([
        {
          id: sessionId,
          visitor_id: visitorId,
          path,
          referrer,
          device_type: deviceType,
          browser,
          os,
          screen_size: screenSize,
          duration_seconds: 0
        }
      ]);
    } catch (err) {
      console.warn('Analytics session track notice:', err);
    }
  }

  // Heartbeat every 12 seconds to increment duration
  heartbeatInterval = setInterval(() => {
    sendHeartbeat();
  }, 12000);

  return sessionId;
}

/**
 * Sends heartbeat ping to update session duration in database
 */
export function sendHeartbeat() {
  if (!activeSession || !isSupabaseConfigured || !supabase) return;

  const elapsedSeconds = Math.floor((Date.now() - activeSession.startTime) / 1000);
  if (elapsedSeconds <= 0) return;

  try {
    supabase
      .from('visitor_sessions')
      .update({
        duration_seconds: elapsedSeconds,
        last_ping_at: new Date().toISOString()
      })
      .eq('id', activeSession.sessionId)
      .then();
  } catch {}
}

/**
 * Flushes the final duration on page exit or tab switch
 */
export function flushSessionDuration() {
  if (!activeSession) return;
  const elapsedSeconds = Math.floor((Date.now() - activeSession.startTime) / 1000);
  if (elapsedSeconds <= 0) return;

  if (isSupabaseConfigured && supabase) {
    try {
      supabase
        .from('visitor_sessions')
        .update({
          duration_seconds: elapsedSeconds,
          last_ping_at: new Date().toISOString()
        })
        .eq('id', activeSession.sessionId)
        .then();
    } catch {}
  }
}

/**
 * Tracks a custom user activity or milestone action
 */
export async function trackEvent(
  eventName: string,
  eventData: Record<string, any> = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  const visitorId = activeSession ? activeSession.visitorId : getOrCreateVisitorId();
  const sessionId = activeSession ? activeSession.sessionId : null;
  const path = activeSession ? activeSession.path : window.location.pathname;

  if (isSupabaseConfigured && supabase) {
    try {
      const payload: any = {
        visitor_id: visitorId,
        path,
        event_name: eventName,
        event_data: eventData
      };

      if (sessionId) {
        payload.session_id = sessionId;
      }

      await supabase.from('analytics_events').insert([payload]);
    } catch (err) {
      console.warn('Event telemetry track notice:', err);
    }
  }
}

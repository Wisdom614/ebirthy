import { supabase, isSupabaseConfigured } from './client';

export interface VisitorSessionRecord {
  id: string;
  visitor_id: string;
  path: string;
  referrer: string;
  device_type: string;
  browser: string;
  os: string;
  screen_size: string;
  duration_seconds: number;
  created_at: string;
  last_ping_at: string;
}

export interface AnalyticsEventRecord {
  id: string;
  session_id?: string;
  visitor_id: string;
  path: string;
  event_name: string;
  event_data: Record<string, any>;
  created_at: string;
}

export interface AnalyticsSummary {
  activeVisitorsNow: number;
  totalPageViews: number;
  uniqueVisitors: number;
  avgDurationSeconds: number;
  topPages: { path: string; count: number }[];
  eventBreakdown: { event_name: string; count: number }[];
  deviceBreakdown: { device_type: string; count: number }[];
  referrerBreakdown: { referrer: string; count: number }[];
  recentEvents: AnalyticsEventRecord[];
  recentSessions: VisitorSessionRecord[];
}

/**
 * Fetches aggregated analytics summary from Supabase
 */
export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    // 1. Fetch recent 100 sessions
    const { data: sessions, error: sessionErr } = await supabase
      .from('visitor_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    // 2. Fetch recent 100 events
    const { data: events, error: eventErr } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (sessionErr || !sessions) {
      console.warn('Analytics fetch error:', sessionErr);
      return null;
    }

    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    // Active visitors whose last ping was within the last 5 minutes
    const activeVisitorsSet = new Set<string>();
    sessions.forEach((s) => {
      const pingTime = new Date(s.last_ping_at || s.created_at).getTime();
      if (pingTime >= fiveMinutesAgo) {
        activeVisitorsSet.add(s.visitor_id);
      }
    });

    const uniqueVisitors = new Set(sessions.map((s) => s.visitor_id)).size;
    const totalPageViews = sessions.length;

    // Calculate average duration
    const totalDuration = sessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
    const avgDurationSeconds = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;

    // Top Pages
    const pageCounts: Record<string, number> = {};
    sessions.forEach((s) => {
      const p = s.path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device breakdown
    const deviceCounts: Record<string, number> = {};
    sessions.forEach((s) => {
      const d = s.device_type || 'desktop';
      deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    });
    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device_type, count]) => ({ device_type, count }))
      .sort((a, b) => b.count - a.count);

    // Referrer breakdown
    const referrerCounts: Record<string, number> = {};
    sessions.forEach((s) => {
      const r = s.referrer || 'Direct / App';
      referrerCounts[r] = (referrerCounts[r] || 0) + 1;
    });
    const referrerBreakdown = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Event breakdown
    const eventCounts: Record<string, number> = {};
    (events || []).forEach((e) => {
      const name = e.event_name || 'unknown';
      eventCounts[name] = (eventCounts[name] || 0) + 1;
    });
    const eventBreakdown = Object.entries(eventCounts)
      .map(([event_name, count]) => ({ event_name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      activeVisitorsNow: activeVisitorsSet.size,
      totalPageViews,
      uniqueVisitors,
      avgDurationSeconds,
      topPages,
      eventBreakdown,
      deviceBreakdown,
      referrerBreakdown,
      recentEvents: events || [],
      recentSessions: sessions.slice(0, 15)
    };
  } catch (err) {
    console.error('Failed to compute analytics summary:', err);
    return null;
  }
}

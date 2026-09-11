'use client';

import React, { useEffect, useState } from 'react';
import { fetchAnalyticsSummary, AnalyticsSummary } from '../../../utils/supabase/analyticsDb';
import { BrandLogo } from '../../../components/ui/BrandLogo';
import {
  Activity,
  Users,
  Eye,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  Sparkles,
  Flame,
  Download,
  Share2,
  Cake,
  Gift,
  Mail,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  Radio
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAnalyticsSummary();
    setSummary(data);
    setLoading(false);
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    loadData();

    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData();
    }, 15000); // 15s auto-refresh

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return iso;
    }
  };

  const getEventIcon = (eventName: string) => {
    if (eventName.includes('cake')) return <Cake className="w-3.5 h-3.5 text-amber-600" />;
    if (eventName.includes('gift')) return <Gift className="w-3.5 h-3.5 text-rose-600" />;
    if (eventName.includes('letter')) return <Mail className="w-3.5 h-3.5 text-blue-600" />;
    if (eventName.includes('download') || eventName.includes('card') || eventName.includes('poster'))
      return <Download className="w-3.5 h-3.5 text-emerald-600" />;
    if (eventName.includes('confetti') || eventName.includes('cheer'))
      return <Sparkles className="w-3.5 h-3.5 text-yellow-600" />;
    if (eventName.includes('shared')) return <Share2 className="w-3.5 h-3.5 text-purple-600" />;
    return <Activity className="w-3.5 h-3.5 text-zinc-600" />;
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-[#1c1917] p-4 sm:p-8 font-sans selection:bg-amber-400 selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Control Bar */}
        <header className="bg-white border-4 border-[#1c1917] p-5 sm:p-6 shadow-[6px_6px_0px_#1c1917] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" showSubtitle={false} href="/" />
            <div className="border-l-2 border-[#1c1917] pl-3">
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#1c1917]">
                TELEMETRY & VISITOR INTELLIGENCE
              </h1>
              <span className="font-mono text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">
                LIVE TRAFFIC MATRIX · ACTION FUNNEL · DWELL METRICS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f7f4ed] border-2 border-[#1c1917] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE FEED</span>
              <span className="text-zinc-500 text-[10px]">
                ({lastRefreshed.toLocaleTimeString()})
              </span>
            </div>

            <button
              onClick={() => loadData()}
              disabled={loading}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#1c1917] border-2 border-[#1c1917] font-bold uppercase shadow-[2px_2px_0px_#1c1917] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>REFRESH</span>
            </button>

            <Link
              href="/studio"
              className="px-3 py-1.5 bg-white hover:bg-[#eeeae0] text-[#1c1917] border-2 border-[#1c1917] font-bold uppercase shadow-[2px_2px_0px_#1c1917] transition-all flex items-center gap-1"
            >
              <span>STUDIO</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Visitors */}
          <div className="bg-white border-3 border-[#1c1917] p-5 shadow-[4px_4px_0px_#1c1917] relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">
                ACTIVE RIGHT NOW
              </span>
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            </div>
            <div className="font-mono font-black text-3xl sm:text-4xl text-[#1c1917]">
              {summary ? summary.activeVisitorsNow : '—'}
            </div>
            <span className="font-mono text-[9px] font-bold uppercase text-emerald-700 block mt-1">
              PAST 5 MINUTES WINDOW
            </span>
          </div>

          {/* Card 2: Total Page Views */}
          <div className="bg-white border-3 border-[#1c1917] p-5 shadow-[4px_4px_0px_#1c1917]">
            <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">
                TOTAL PAGE VIEWS
              </span>
              <Eye className="w-4 h-4 text-blue-600" />
            </div>
            <div className="font-mono font-black text-3xl sm:text-4xl text-[#1c1917]">
              {summary ? summary.totalPageViews.toLocaleString() : '—'}
            </div>
            <span className="font-mono text-[9px] font-bold uppercase text-blue-700 block mt-1">
              CUMULATIVE SESSIONS LOGGED
            </span>
          </div>

          {/* Card 3: Unique Visitors */}
          <div className="bg-white border-3 border-[#1c1917] p-5 shadow-[4px_4px_0px_#1c1917]">
            <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">
                UNIQUE VISITORS
              </span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="font-mono font-black text-3xl sm:text-4xl text-[#1c1917]">
              {summary ? summary.uniqueVisitors.toLocaleString() : '—'}
            </div>
            <span className="font-mono text-[9px] font-bold uppercase text-purple-700 block mt-1">
              INDIVIDUAL DEVICES IDENTIFIED
            </span>
          </div>

          {/* Card 4: Average Duration */}
          <div className="bg-white border-3 border-[#1c1917] p-5 shadow-[4px_4px_0px_#1c1917]">
            <div className="flex items-center justify-between border-b border-[#1c1917]/20 pb-2 mb-3">
              <span className="font-mono text-[10px] font-bold uppercase text-zinc-500">
                AVG DWELL TIME
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-mono font-black text-3xl sm:text-4xl text-[#1c1917]">
              {summary ? formatDuration(summary.avgDurationSeconds) : '—'}
            </div>
            <span className="font-mono text-[9px] font-bold uppercase text-amber-700 block mt-1">
              TIME SPENT ON CELEBRATION
            </span>
          </div>
        </div>

        {/* Middle Section: Top Destinations & Interaction Action Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Visited Pages & Links */}
          <div className="bg-white border-4 border-[#1c1917] p-5 sm:p-6 shadow-[6px_6px_0px_#1c1917]">
            <div className="border-b-2 border-[#1c1917] pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <h2 className="font-mono font-black text-sm uppercase text-[#1c1917]">
                  [ TOP DESTINATIONS & CELEBRATION LINKS ]
                </h2>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">
                RANKED BY VISITS
              </span>
            </div>

            {summary && summary.topPages.length > 0 ? (
              <div className="space-y-2.5">
                {summary.topPages.map((item, idx) => {
                  const maxCount = summary.topPages[0]?.count || 1;
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={idx} className="font-mono text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#1c1917] truncate max-w-[280px] sm:max-w-sm">
                          {idx + 1}. {item.path}
                        </span>
                        <span className="font-black text-amber-700 ml-2">
                          {item.count} views
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#eeeae0] border border-[#1c1917]/30 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 border-r border-[#1c1917]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center font-mono text-xs text-zinc-500 uppercase">
                [ NO PAGEVIEWS RECORDED YET ]
              </div>
            )}
          </div>

          {/* User Action Matrix */}
          <div className="bg-white border-4 border-[#1c1917] p-5 sm:p-6 shadow-[6px_6px_0px_#1c1917]">
            <div className="border-b-2 border-[#1c1917] pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-600" />
                <h2 className="font-mono font-black text-sm uppercase text-[#1c1917]">
                  [ USER ACTION & INTERACTION MATRIX ]
                </h2>
              </div>
              <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">
                EVENT TELEMETRY
              </span>
            </div>

            {summary && summary.eventBreakdown.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5 font-mono">
                {summary.eventBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#f7f4ed] border-2 border-[#1c1917] flex items-center justify-between shadow-[2px_2px_0px_#1c1917]"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getEventIcon(item.event_name)}
                      <span className="text-[11px] font-bold uppercase truncate">
                        {item.event_name.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-black text-[#1c1917] ml-2">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center font-mono text-xs text-zinc-500 uppercase">
                [ NO INTERACTION EVENTS LOGGED YET ]
              </div>
            )}
          </div>
        </div>

        {/* Third Row: Devices & Referrer Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Devices & Platforms */}
          <div className="bg-white border-4 border-[#1c1917] p-5 sm:p-6 shadow-[6px_6px_0px_#1c1917]">
            <div className="border-b-2 border-[#1c1917] pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <h2 className="font-mono font-black text-sm uppercase text-[#1c1917]">
                  [ DEVICE & HARDWARE DISTRIBUTION ]
                </h2>
              </div>
            </div>

            {summary && summary.deviceBreakdown.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                {summary.deviceBreakdown.map((d, i) => (
                  <div key={i} className="p-3 bg-[#f7f4ed] border-2 border-[#1c1917] shadow-[2px_2px_0px_#1c1917]">
                    <span className="text-[9px] font-bold uppercase text-zinc-500 block mb-1">
                      {d.device_type}
                    </span>
                    <span className="text-xl font-black text-[#1c1917] block">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center font-mono text-xs text-zinc-500 uppercase">
                [ NO DEVICE DATA YET ]
              </div>
            )}
          </div>

          {/* Traffic Sources & Referrers */}
          <div className="bg-white border-4 border-[#1c1917] p-5 sm:p-6 shadow-[6px_6px_0px_#1c1917]">
            <div className="border-b-2 border-[#1c1917] pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-purple-600" />
                <h2 className="font-mono font-black text-sm uppercase text-[#1c1917]">
                  [ TRAFFIC REFERRALS & SOURCES ]
                </h2>
              </div>
            </div>

            {summary && summary.referrerBreakdown.length > 0 ? (
              <div className="space-y-2 font-mono text-xs">
                {summary.referrerBreakdown.map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-[#f7f4ed] border border-[#1c1917]">
                    <span className="font-bold text-[#1c1917]">{r.referrer}</span>
                    <span className="font-black text-amber-700">{r.count} visits</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center font-mono text-xs text-zinc-500 uppercase">
                [ NO REFERRER DATA YET ]
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Live Real-Time Event Feed Stream */}
        <div className="bg-white border-4 border-[#1c1917] p-5 sm:p-6 shadow-[6px_6px_0px_#1c1917]">
          <div className="border-b-2 border-[#1c1917] pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="font-mono font-black text-sm uppercase text-[#1c1917]">
                [ LIVE REAL-TIME VISITOR ACTIVITY STREAM ]
              </h2>
            </div>
            <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">
              RECENT 25 ACTIONS
            </span>
          </div>

          {summary && summary.recentEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1c1917] bg-[#eeeae0] text-[#1c1917]">
                    <th className="p-2 uppercase font-bold">TIME</th>
                    <th className="p-2 uppercase font-bold">EVENT TYPE</th>
                    <th className="p-2 uppercase font-bold">PAGE PATH</th>
                    <th className="p-2 uppercase font-bold">DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentEvents.slice(0, 25).map((e, idx) => (
                    <tr key={idx} className="border-b border-[#1c1917]/20 hover:bg-[#f7f4ed] transition-colors">
                      <td className="p-2 text-zinc-500 font-bold whitespace-nowrap">
                        {formatTimestamp(e.created_at)}
                      </td>
                      <td className="p-2 font-black text-[#1c1917] flex items-center gap-2 whitespace-nowrap">
                        {getEventIcon(e.event_name)}
                        <span>{e.event_name.toUpperCase()}</span>
                      </td>
                      <td className="p-2 text-zinc-700 font-bold truncate max-w-[200px]">
                        {e.path}
                      </td>
                      <td className="p-2 text-zinc-600 font-mono text-[11px] truncate max-w-[300px]">
                        {e.event_data ? JSON.stringify(e.event_data) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center font-mono text-xs text-zinc-500 uppercase">
              [ NO RECENT EVENTS RECORDED YET ]
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

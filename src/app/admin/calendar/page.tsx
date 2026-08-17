'use client';

import React, { useEffect, useState } from 'react';

interface Feed {
  id: string;
  name: string;
  feedKey: string;
  createdAt: string;
}

export default function CalendarPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const res = await fetch(`${apiUrl}/calendar/feeds`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setFeeds(json.data || []);
        }
      } catch (e) {
        console.error('Failed to load feeds:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeds();
  }, []);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin.replace('3000', '4000') : 'http://localhost:4000';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Calendar Feeds & iCal Sync</h1>
          <p className="text-sm text-slate-500 mt-1">
            Subscribe Apple Calendar, Google Calendar, and Outlook to live dispatch schedules.
          </p>
        </div>
      </div>

      {/* Main Operations Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 m-0">System Operations Feed</h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="font-bold text-sm text-slate-900">All Scheduled Fleet Bookings</div>
            <div className="text-xs font-mono text-blue-600 mt-1 break-all">
              {`${baseUrl}/api/calendar/feed/main-feed.ics`}
            </div>
          </div>
          <button
            onClick={() => handleCopy(`${baseUrl}/api/calendar/feed/main-feed.ics`, 'main')}
            className="px-4 py-2 rounded-xl bg-blue-600 font-semibold text-xs text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer border-0 shrink-0"
          >
            {copiedKey === 'main' ? 'Copied!' : 'Copy Feed URL'}
          </button>
        </div>
      </div>

      {/* Active Feeds List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 m-0">Custom Driver Feeds</h2>
        {loading ? (
          <div className="text-sm text-slate-500 py-4">Loading calendar feeds...</div>
        ) : feeds.length === 0 ? (
          <div className="text-sm text-slate-500 py-4 italic">
            No driver-specific calendar feeds configured.
          </div>
        ) : (
          <div className="space-y-3">
            {feeds.map((feed) => {
              const url = `${baseUrl}/api/calendar/feed/${feed.feedKey}.ics`;
              return (
                <div
                  key={feed.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">{feed.name}</div>
                    <div className="text-xs font-mono text-blue-600 mt-1 break-all">{url}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(url, feed.id)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedKey === feed.id ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

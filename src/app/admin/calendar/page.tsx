import React from 'react';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendar Integration</h1>
          <p className="text-sm text-slate-400">Live iCal feeds for drivers and external dispatch sync.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all">
          + New iCal Feed
        </button>
      </div>

      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-bold text-white">Active Calendar Feeds</h2>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
          <div>
            <div className="font-bold text-white">Main Operations Feed</div>
            <div className="text-xs font-mono text-cyan-400 mt-1">http://localhost:4000/api/calendar/feed/a98f12k.ics</div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700">
            Copy URL
          </button>
        </div>
      </div>
    </div>
  );
}

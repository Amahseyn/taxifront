import React from 'react';

export function Topbar() {
  return (
    <header className="h-16 glass-panel border-b border-slate-800/60 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search bookings, customers, drivers..."
          className="bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-72 transition-all"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold hover:bg-cyan-500/20 transition-all">
          + New Booking
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
          AD
        </div>
      </div>
    </header>
  );
}

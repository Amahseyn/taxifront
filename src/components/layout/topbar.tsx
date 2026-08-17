'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';

export function Topbar() {
  const { user, logout } = useAuth();
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD';

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
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white">{user?.email || 'admin@admin.com'}</div>
            <div className="text-[10px] text-cyan-400">Platform Admin</div>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
            {initials}
          </div>
          <button
            onClick={logout}
            className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium hover:bg-red-500/20 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}


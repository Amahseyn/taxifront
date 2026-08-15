import React from 'react';

export default function ZonesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Geofenced Zones</h1>
          <p className="text-sm text-slate-400">GeoJSON service zones and surge boundary definitions.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all">
          + Create Zone
        </button>
      </div>

      <div className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-slate-700">
        <div className="h-16 w-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl font-bold">
          🗺️
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Interactive GeoJSON Map Manager</h3>
          <p className="text-sm text-slate-400 max-w-md">Draw polygon boundaries and map out zone surcharges for Manhattan, Brooklyn, and Airport zones.</p>
        </div>
      </div>
    </div>
  );
}

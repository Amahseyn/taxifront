import React from 'react';

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Locations</h1>
          <p className="text-sm text-slate-400">Featured locations, airports, and terminals.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all">
          + Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['JFK Airport Terminal 4', 'LaGuardia Airport Terminal B', 'Grand Central Terminal'].map((loc, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl space-y-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Airport / Terminal
            </span>
            <h3 className="font-bold text-lg text-white">{loc}</h3>
            <p className="text-xs text-slate-400">New York, NY 11430</p>
          </div>
        ))}
      </div>
    </div>
  );
}

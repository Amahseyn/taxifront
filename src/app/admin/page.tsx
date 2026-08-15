import React from 'react';

export default function DashboardOverviewPage() {
  const stats = [
    { title: 'Total Bookings', value: '1,284', change: '+12%', color: 'from-blue-500 to-cyan-500' },
    { title: 'Active Jobs', value: '38', change: 'Live Now', color: 'from-emerald-500 to-teal-500' },
    { title: 'Monthly Revenue', value: '$48,250', change: '+18.4%', color: 'from-indigo-500 to-purple-500' },
    { title: 'Active Drivers', value: '24 / 28', change: 'On Shift', color: 'from-amber-500 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Fleet & Dispatch Overview</h1>
        <p className="text-sm text-slate-400">Real-time status of current rides, drivers, and revenue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.color} opacity-10 rounded-full blur-2xl`} />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.title}</span>
            <div className="text-3xl font-extrabold text-white my-2">{s.value}</div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {s.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Live Bookings</h2>
            <button className="text-xs text-cyan-400 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    #{1000 + i}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Airport Transfer - JFK to Manhattan</div>
                    <div className="text-xs text-slate-400">Scheduled: 14:30 • Passenger: John Doe</div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white">Driver Status</h2>
          <div className="space-y-3">
            {['Alex Rivera', 'Michael Chen', 'Sarah Jenkins', 'David Miller'].map((driver, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                    {driver.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{driver}</div>
                    <div className="text-xs text-slate-400">Toyota Camry (Executive)</div>
                  </div>
                </div>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

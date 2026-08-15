import React from 'react';

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-sm text-slate-400">Manage dispatch orders, pickup schedules, and line items.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all">
          + Create Booking
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Booking #</th>
              <th className="px-6 py-4">Pickup Address</th>
              <th className="px-6 py-4">Dropoff Address</th>
              <th className="px-6 py-4">Pickup Time</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {[1001, 1002, 1003, 1004].map((id) => (
              <tr key={id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-bold text-cyan-400">BK-{id}</td>
                <td className="px-6 py-4">125 Park Ave, New York, NY</td>
                <td className="px-6 py-4">JFK Terminal 4, Queens, NY</td>
                <td className="px-6 py-4 text-slate-400">2026-08-16 14:00</td>
                <td className="px-6 py-4 font-semibold text-white">$120.00</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Confirmed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';

export default function SurchargesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Surcharges</h1>
          <p className="text-sm text-slate-400">Night rates, holiday, meet & greet, and extra luggage fees.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all">
          + Add Surcharge
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Mode</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {[
              { name: 'Night Shift Surcharge', type: 'Time', amount: '$15.00', mode: 'Flat' },
              { name: 'Airport Meet & Greet', type: 'Location', amount: '$25.00', mode: 'Flat' },
              { name: 'Holiday Surge', type: 'Date', amount: '15%', mode: 'Percentage' },
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{row.name}</td>
                <td className="px-6 py-4 text-slate-400">{row.type}</td>
                <td className="px-6 py-4 font-bold text-cyan-400">{row.amount}</td>
                <td className="px-6 py-4">{row.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

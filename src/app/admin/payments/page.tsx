import React from 'react';

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments & Transactions</h1>
        <p className="text-sm text-slate-400">Stripe charges, cash collections, and credit line billing.</p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Booking #</th>
              <th className="px-6 py-4">Provider</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-slate-400">txn_3M921{i}x8291</td>
                <td className="px-6 py-4 font-bold text-cyan-400">BK-100{i}</td>
                <td className="px-6 py-4">Stripe (Card)</td>
                <td className="px-6 py-4 font-bold text-white">${110 + i * 15}.00</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Paid
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

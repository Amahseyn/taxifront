import React from 'react';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-slate-400">Corporate accounts and VIP passengers.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all">
          + Add Customer
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Credit Limit</th>
              <th className="px-6 py-4">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {['John Doe', 'Alice Smith', 'Robert Johnson'].map((name, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{name}</td>
                <td className="px-6 py-4 text-slate-400">{name.toLowerCase().replace(' ', '.')}@example.com</td>
                <td className="px-6 py-4">Acme Corp</td>
                <td className="px-6 py-4 font-semibold text-slate-300">$5,000.00</td>
                <td className="px-6 py-4 font-semibold text-emerald-400">$340.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

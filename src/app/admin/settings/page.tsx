import React from 'react';

export default function SettingsPage() {
  const tabs = [
    'Booking Settings',
    'Google Maps API',
    'Localization',
    'Email Integration',
    'SMS (Twilio)',
    'WhatsApp API',
    'Company Profile',
    'Tax & VAT',
    'Terms & Conditions',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">System Settings</h1>
        <p className="text-sm text-slate-400">Configure business logic, integrations, and branding.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                idx === 0
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white">Booking & General Rules</h2>
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Minimum Advance Notice (Hours)
              </label>
              <input
                type="number"
                defaultValue={2}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Default Currency Code
              </label>
              <input
                type="text"
                defaultValue="USD"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

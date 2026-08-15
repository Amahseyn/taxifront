import React from 'react';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications & Templates</h1>
        <p className="text-sm text-slate-400">Automated SMS, Email, and WhatsApp dispatch rules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { channel: 'Email', name: 'Booking Confirmation', trigger: 'On Booking Created' },
          { channel: 'SMS', name: 'Driver Assigned Notification', trigger: 'On Job Assigned' },
          { channel: 'WhatsApp', name: 'Driver On The Way', trigger: 'Driver En Route' },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl space-y-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {item.channel}
            </span>
            <h3 className="font-bold text-lg text-white">{item.name}</h3>
            <p className="text-xs text-slate-400">Trigger: {item.trigger}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

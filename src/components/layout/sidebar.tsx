import React from 'react';
import Link from 'next/link';

export function Sidebar() {
  const navItems = [
    { label: 'Overview', href: '/admin' },
    { label: 'Bookings', href: '/admin/bookings' },
    { label: 'Customers', href: '/admin/customers' },
    { label: 'Drivers', href: '/admin/drivers' },
    { label: 'Locations', href: '/admin/locations' },
    { label: 'Zones', href: '/admin/zones' },
    { label: 'Pricing', href: '/admin/pricing' },
    { label: 'Surcharges', href: '/admin/surcharges' },
    { label: 'Payments', href: '/admin/payments' },
    { label: 'Notifications', href: '/admin/notifications' },
    { label: 'Calendar', href: '/admin/calendar' },
    { label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/60 p-4 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            R
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-none">RouteOS</h1>
            <span className="text-xs text-cyan-400 font-medium">Company Edition</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-3 glass-card rounded-xl">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tenant</div>
        <div className="text-sm font-medium text-white truncate">Acme Executive Dispatch</div>
      </div>
    </aside>
  );
}

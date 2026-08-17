'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();

  // Compute dynamic page title header based on route
  const getPageTitle = (path: string) => {
    if (path === '/admin') return 'Dashboard';
    if (path.startsWith('/admin/bookings/create')) return 'Add New Booking';
    if (path.startsWith('/admin/bookings')) return 'Bookings';
    if (path.startsWith('/admin/customers')) return 'Customers';
    if (path.startsWith('/admin/drivers')) return 'Drivers';
    if (path.startsWith('/admin/locations')) return 'Locations';
    if (path.startsWith('/admin/zones')) return 'Zones';
    if (path.startsWith('/admin/pricing')) return 'Pricing';
    if (path.startsWith('/admin/surcharges')) return 'Surcharges';
    if (path.startsWith('/admin/payments')) return 'Payment Settings';
    if (path.startsWith('/admin/notifications')) return 'Notifications Overview';
    if (path.startsWith('/admin/calendar')) return 'Dispatch Calendar';
    if (path.startsWith('/admin/settings')) return 'Settings';
    return 'Control Center';
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="h-[60px] bg-white/85 backdrop-blur-md border-b border-slate-200 px-5 sticky top-0 z-40 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="font-semibold text-slate-900 text-lg m-0 truncate">
          {pageTitle}
        </h1>
      </div>

      <nav className="flex items-center gap-2.5">
        <Link
          href="/admin/bookings?page=latest"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-sm font-semibold transition-colors text-decoration-none ${
            pathname.startsWith('/admin/bookings') && !pathname.includes('create')
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
            <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 10.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
          </svg>
          <span className="hidden sm:inline">Bookings</span>
        </Link>

        <Link
          href="/admin/bookings/create"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 text-sm font-semibold transition-colors text-decoration-none shadow-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
          <span>New Booking</span>
        </Link>

        <Link
          href="/admin/calendar"
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-sm font-semibold transition-colors text-decoration-none ${
            pathname.startsWith('/admin/calendar')
              ? 'bg-blue-50 border-blue-200 text-blue-600'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="hidden sm:inline">Calendar</span>
        </Link>
      </nav>
    </header>
  );
}

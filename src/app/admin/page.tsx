'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Kpi {
  label: string;
  value: string | number;
  sub: string;
}

interface AttentionItem {
  level: string;
  title: string;
  sub: string;
  href: string;
}

interface JobItem {
  booking_id: string;
  booking_number: string;
  time: string;
  title: string;
  sub: string;
  status: string;
  status_class: string;
  href: string;
}

interface DashboardData {
  kpis: Kpi[];
  attentionItems: AttentionItem[];
  bookingViews: {
    today: JobItem[];
    next24: JobItem[];
    latest: JobItem[];
  };
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'next24' | 'latest'>('today');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
        const res = await fetch(`${apiUrl}/bookings/dashboard-summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const kpis = data?.kpis || [
    { label: "Today's Jobs", value: '0', sub: '0 scheduled | 0 completed | 0 cancelled' },
    { label: 'Revenue Today', value: '$0.00', sub: '0 bookings' },
    { label: 'Revenue This Month', value: '$0.00', sub: 'Month to date' },
    { label: 'Needs Attention', value: '0', sub: '0 unassigned' },
    { label: 'Active Vehicle Types', value: '0', sub: '0 available' },
    { label: 'Active Drivers', value: '0', sub: '0 active in dispatch' },
  ];

  const attentionItems = data?.attentionItems || [];
  const currentJobs = data?.bookingViews?.[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status of current rides, drivers, and revenue.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/bookings/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm text-decoration-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
            + New Booking
          </Link>
        </div>
      </div>

      {/* KPI Grid (6 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{kpi.value}</div>
            <p className="text-xs text-slate-500 font-medium m-0">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 2-Column Grid: Needs Attention + Bookings Dispatch List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 m-0">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Needs Attention
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {attentionItems.length} open
            </span>
          </div>

          <div className="space-y-3">
            {attentionItems.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4 text-center m-0">No urgent attention items at this moment.</p>
            ) : (
              attentionItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-start justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 transition-colors text-decoration-none"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.level === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.level}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 m-0 truncate">{item.title}</h4>
                    <p className="text-xs text-slate-500 m-0 leading-relaxed">{item.sub}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 shrink-0 self-center" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Bookings Dispatch List Column */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 m-0">Dispatch Bookings</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border-0 cursor-pointer ${
                  activeTab === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab('next24')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border-0 cursor-pointer ${
                  activeTab === 'next24' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Next 24h
              </button>
              <button
                onClick={() => setActiveTab('latest')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors border-0 cursor-pointer ${
                  activeTab === 'latest' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 bg-transparent'
                }`}
              >
                Latest
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {currentJobs.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-6 text-center m-0">
                No jobs listed under this view.
              </p>
            ) : (
              currentJobs.map((job, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 transition-colors">
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold font-mono shrink-0">
                      {job.time}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 m-0 truncate leading-snug">{job.title}</h4>
                      <p className="text-xs text-slate-500 m-0 truncate mt-0.5 leading-snug">{job.sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`badge ${job.status_class}`}>{job.status}</span>
                    <Link
                      href={job.href}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors text-decoration-none"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


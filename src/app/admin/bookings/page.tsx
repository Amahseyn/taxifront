'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Job {
  id: string;
  driver?: Driver;
  status: string;
}

interface Booking {
  id: string;
  bookingNumber: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDateTime: string;
  passengerCount: number;
  luggageCount: number;
  totalPrice: number;
  status: string;
  notes?: string;
  customer?: Customer;
  jobs?: Job[];
}

export default function BookingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageFilter = searchParams.get('page') || 'all';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const params = new URLSearchParams();
      if (pageFilter !== 'all') params.set('page', pageFilter);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${apiUrl}/bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setBookings(json.data || []);
        setTotalCount(json.meta?.total || (json.data || []).length);
      }
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
    } finally {
      setLoading(false);
    }
  }, [pageFilter, search]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchBookings();
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleBulk = async (op: string) => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to ${op} ${selectedIds.length} bookings?`)) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/bookings/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ op, ids: selectedIds }),
      });
      if (res.ok) {
        setSelectedIds([]);
        fetchBookings();
      }
    } catch (e) {
      console.error('Failed bulk op:', e);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === bookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookings.map((b) => b.id));
    }
  };

  const tabs = [
    { id: 'next24', label: 'Next 24 Hours' },
    { id: 'latest', label: 'Latest' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'all', label: 'All Bookings' },
    { id: 'trash', label: 'Trash' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Bookings Dispatch</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage rides, schedules, driver assignments, and trip statuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/bookings/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 transition-colors shadow-sm text-decoration-none"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
            + Add New Booking
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => router.push(tab.id === 'all' ? '/admin/bookings' : `/admin/bookings?page=${tab.id}`)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border-0 cursor-pointer ${
              pageFilter === tab.id
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Bulk Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search reference, customer, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500">{selectedIds.length} selected:</span>
            <button
              onClick={() => handleBulk('complete')}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
            >
              Complete
            </button>
            <button
              onClick={() => handleBulk('cancel')}
              className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 border border-amber-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleBulk('trash')}
              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 border border-red-200 cursor-pointer"
            >
              Trash
            </button>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No bookings found under "{pageFilter}". Click "+ Add New Booking" to dispatch a ride.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === bookings.length && bookings.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3.5">Ref #</th>
                  <th className="px-4 py-3.5">Pickup Date & Time</th>
                  <th className="px-4 py-3.5">Routing (From &rarr; To)</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Driver</th>
                  <th className="px-4 py-3.5">Fare</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => {
                  const driverName = booking.jobs?.[0]?.driver
                    ? `${booking.jobs[0].driver.firstName} ${booking.jobs[0].driver.lastName}`
                    : 'Unassigned';
                  const custName = booking.customer
                    ? `${booking.customer.firstName} ${booking.customer.lastName}`
                    : 'Guest';

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(booking.id)}
                          onChange={() => toggleSelect(booking.id)}
                        />
                      </td>
                      <td className="px-4 py-3.5 font-bold font-mono text-slate-900 text-xs">
                        {booking.bookingNumber}
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">
                          {new Date(booking.pickupDateTime).toLocaleDateString()}
                        </div>
                        <div className="text-slate-500">
                          {new Date(booking.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-xs text-xs">
                        <div className="font-medium text-slate-900 truncate">📍 {booking.pickupAddress}</div>
                        <div className="text-slate-500 truncate mt-0.5">🏁 {booking.dropoffAddress}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <div className="font-semibold text-slate-900">{custName}</div>
                        <div className="text-slate-500">{booking.customer?.phone || booking.customer?.email || '-'}</div>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                          driverName === 'Unassigned' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {driverName}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900 text-xs whitespace-nowrap">
                        ${(booking.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                            booking.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : booking.status === 'cancelled' || booking.status === 'trashed'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="trashed">Trash</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleStatusChange(booking.id, 'trashed')}
                          className="text-xs font-semibold text-red-600 hover:underline bg-transparent border-0 cursor-pointer ml-2"
                        >
                          Trash
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="text-xs text-slate-500 text-right">
        Showing {bookings.length} of {totalCount} total bookings
      </div>
    </div>
  );
}

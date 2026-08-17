'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  provider: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  booking?: {
    bookingNumber: string;
    pickupAddress: string;
    dropoffAddress: string;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');

  const fetchPayments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setPayments(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load payments:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filteredPayments = payments.filter((p) => {
    const matchesProvider = providerFilter === 'all' || p.provider === providerFilter;
    const matchesSearch =
      search.trim() === '' ||
      p.booking?.bookingNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase());
    return matchesProvider && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Payment Transactions & Gateway Logs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Cash, Stripe, PayPal, Square, and corporate invoices audit ledger.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="Search reference # or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
          >
            <option value="all">All Gateways</option>
            <option value="cash">Cash to Driver</option>
            <option value="stripe">Stripe Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="square">Square POS</option>
            <option value="invoice">Corporate Account</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading payment ledger...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No payment transaction records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Transaction Date</th>
                  <th className="px-6 py-4">Booking Ref</th>
                  <th className="px-6 py-4">Payment Method</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold font-mono text-slate-900 text-xs">
                      {p.booking?.bookingNumber || p.bookingId}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {p.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 font-mono text-sm">
                      ${(p.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {p.transactionId || 'CASH-SETTLED'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface Surcharge {
  id: string;
  name: string;
  type: string;
  amount: number;
  isPercentage: boolean;
  rulesJson?: string;
}

export default function SurchargesPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [surcharges, setSurcharges] = useState<Surcharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurcharge, setEditingSurcharge] = useState<Surcharge | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'time',
    amount: '15.00',
    isPercentage: false,
    rulesJson: '{}',
  });

  const fetchSurcharges = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.set('type', activeTab);
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${apiUrl}/surcharges?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setSurcharges(json.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch surcharges:', e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    fetchSurcharges();
  }, [fetchSurcharges]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const url = editingSurcharge ? `${apiUrl}/surcharges/${editingSurcharge.id}` : `${apiUrl}/surcharges`;
      const method = editingSurcharge ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount) || 0,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingSurcharge(null);
        setFormData({ name: '', type: 'time', amount: '15.00', isPercentage: false, rulesJson: '{}' });
        fetchSurcharges();
      }
    } catch (e) {
      console.error('Failed to save surcharge:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this surcharge rule?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/surcharges/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchSurcharges();
    } catch (e) {
      console.error('Failed to delete surcharge:', e);
    }
  };

  const openEditModal = (sur: Surcharge) => {
    setEditingSurcharge(sur);
    setFormData({
      name: sur.name,
      type: sur.type,
      amount: String(sur.amount || 0),
      isPercentage: sur.isPercentage,
      rulesJson: sur.rulesJson || '{}',
    });
    setIsModalOpen(true);
  };

  const tabs = [
    { id: 'all', label: 'All Surcharges' },
    { id: 'time', label: 'Time / Night Rates' },
    { id: 'date', label: 'Date / Holiday Rates' },
    { id: 'location', label: 'Location / Meet & Greet' },
    { id: 'zone', label: 'Zone Congestion Surcharges' },
    { id: 'item', label: 'Extra Luggage / Items' },
    { id: 'diversion', label: 'Via Stop Diversions' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Surcharges & Extra Fees</h1>
          <p className="text-sm text-slate-500 mt-1">
            Night rates, holiday rates, airport meet & greet fees, child seats, and via-stop diversions.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSurcharge(null);
            setFormData({
              name: '',
              type: activeTab !== 'all' ? activeTab : 'time',
              amount: '15.00',
              isPercentage: false,
              rulesJson: '{}',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 transition-colors shadow-sm border-0 cursor-pointer"
        >
          + Add Surcharge Rule
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors border-0 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search surcharge rule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Surcharge Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading surcharges...</div>
        ) : surcharges.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No surcharge rules configured under "{activeTab}". Click "+ Add Surcharge Rule" to set one up.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Rule Name</th>
                  <th className="px-4 py-3.5">Category Type</th>
                  <th className="px-4 py-3.5">Charge Amount</th>
                  <th className="px-4 py-3.5">Calculation Type</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {surcharges.map((sur) => (
                  <tr key={sur.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{sur.name}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                        {sur.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-blue-600 text-sm font-mono">
                      {sur.isPercentage ? `${sur.amount}%` : `$${(sur.amount || 0).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {sur.isPercentage ? 'Percentage markup' : 'Flat fixed surcharge'}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(sur)}
                        className="text-xs font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sur.id)}
                        className="text-xs font-semibold text-red-600 hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Surcharge Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 m-0">
                {editingSurcharge ? 'Edit Surcharge Rule' : 'Add Surcharge Rule'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Christmas Day Holiday Surcharge / Heathrow Airport Dropoff"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Surcharge Type</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="time">Time / Night Rate</option>
                  <option value="date">Date / Holiday Rate</option>
                  <option value="location">Location / Meet & Greet</option>
                  <option value="zone">Zone Congestion Fee</option>
                  <option value="item">Extra Item / Child Seat / Luggage</option>
                  <option value="diversion">Via Stop Diversion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Charge Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPercentage"
                  checked={formData.isPercentage}
                  onChange={(e) => setFormData({ ...formData, isPercentage: e.target.checked })}
                />
                <label htmlFor="isPercentage" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Is Percentage (%) of total ride?
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rule Config (JSON)</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  value={formData.rulesJson}
                  onChange={(e) => setFormData({ ...formData, rulesJson: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer border-0"
                >
                  {editingSurcharge ? 'Save Changes' : 'Save Surcharge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

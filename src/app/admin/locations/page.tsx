'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface LocationItem {
  id: string;
  name: string;
  type: string;
  address: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<LocationItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'airport',
    address: '',
    lat: '',
    lng: '',
    placeId: '',
  });

  const fetchLocations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (typeFilter !== 'all') params.set('type', typeFilter);

      const res = await fetch(`${apiUrl}/locations?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setLocations(json.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch locations:', e);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          lat: formData.lat ? parseFloat(formData.lat) : undefined,
          lng: formData.lng ? parseFloat(formData.lng) : undefined,
        }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({ name: '', type: 'airport', address: '', lat: '', lng: '', placeId: '' });
        fetchLocations();
      }
    } catch (e) {
      console.error('Failed to create location:', e);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/locations/${editingLocation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          lat: formData.lat ? parseFloat(formData.lat) : undefined,
          lng: formData.lng ? parseFloat(formData.lng) : undefined,
        }),
      });
      if (res.ok) {
        setEditingLocation(null);
        fetchLocations();
      }
    } catch (e) {
      console.error('Failed to update location:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/locations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchLocations();
    } catch (e) {
      console.error('Failed to delete location:', e);
    }
  };

  const openEditModal = (loc: LocationItem) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name,
      type: loc.type,
      address: loc.address,
      lat: loc.lat !== undefined && loc.lat !== null ? String(loc.lat) : '',
      lng: loc.lng !== undefined && loc.lng !== null ? String(loc.lng) : '',
      placeId: loc.placeId || '',
    });
  };

  const typePill = (type: string) => {
    const map: Record<string, string> = {
      airport: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      seaport: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      station: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      hotel: 'bg-amber-50 text-amber-700 border-amber-200',
      address: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${map[type] || 'bg-slate-100 text-slate-700'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Locations Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Standard pickup & drop-off hubs, airports, seaports, stations, and Google Place IDs.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', type: 'airport', address: '', lat: '', lng: '', placeId: '' });
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer border-0"
        >
          + Add Location
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <input
              type="text"
              placeholder="Search location name or address..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="airport">Airports</option>
            <option value="seaport">Seaports</option>
            <option value="station">Train Stations</option>
            <option value="hotel">Hotels</option>
            <option value="address">Standard Addresses</option>
          </select>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading locations...</div>
        ) : locations.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No locations configured yet. Click "+ Add Location" to create standard hubs.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Hub / Location Name</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Full Physical Address</th>
                  <th className="px-4 py-3.5">Coordinates (Lat, Lng)</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{loc.name}</td>
                    <td className="px-4 py-3.5">{typePill(loc.type)}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 max-w-sm truncate">{loc.address}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-slate-500">
                      {loc.lat && loc.lng ? `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` : '-'}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(loc)}
                        className="text-xs font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
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

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingLocation) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 m-0">
                {editingLocation ? 'Edit Location Hub' : 'Add New Location Hub'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingLocation(null);
                }}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingLocation ? handleUpdate : handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Hub / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. London Stansted Airport (STN)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location Type *</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="airport">Airport Hub</option>
                  <option value="seaport">Seaport / Cruise Terminal</option>
                  <option value="station">Train Station</option>
                  <option value="hotel">Hotel / Resort</option>
                  <option value="address">Standard Street Address</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Physical Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bassingbourn Rd, Stansted CM24 1QW"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="e.g. 51.8860"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="e.g. 0.2389"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Google Place ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ChIJ..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  value={formData.placeId}
                  onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingLocation(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  {editingLocation ? 'Save Changes' : 'Save Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

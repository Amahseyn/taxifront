'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface VehicleCategory {
  id: string;
  name: string;
  description?: string;
  capacityPax: number;
  capacityLug: number;
  basePrice: number;
  perKmPrice: number;
  perMinPrice: number;
  sortOrder: number;
}

export default function VehiclesPage() {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<VehicleCategory | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacityPax: '4',
    capacityLug: '2',
    basePrice: '15.00',
    perKmPrice: '2.50',
    perMinPrice: '0.50',
    sortOrder: '0',
  });

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());

      const res = await fetch(`${apiUrl}/vehicles/categories?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch vehicle categories:', e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/vehicles/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          capacityPax: parseInt(formData.capacityPax) || 4,
          capacityLug: parseInt(formData.capacityLug) || 2,
          basePrice: parseFloat(formData.basePrice) || 0,
          perKmPrice: parseFloat(formData.perKmPrice) || 0,
          perMinPrice: parseFloat(formData.perMinPrice) || 0,
          sortOrder: parseInt(formData.sortOrder) || 0,
        }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({ name: '', description: '', capacityPax: '4', capacityLug: '2', basePrice: '15.00', perKmPrice: '2.50', perMinPrice: '0.50', sortOrder: '0' });
        fetchCategories();
      }
    } catch (e) {
      console.error('Failed to create vehicle category:', e);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/vehicles/categories/${editingCategory.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          capacityPax: parseInt(formData.capacityPax) || 4,
          capacityLug: parseInt(formData.capacityLug) || 2,
          basePrice: parseFloat(formData.basePrice) || 0,
          perKmPrice: parseFloat(formData.perKmPrice) || 0,
          perMinPrice: parseFloat(formData.perMinPrice) || 0,
          sortOrder: parseInt(formData.sortOrder) || 0,
        }),
      });
      if (res.ok) {
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (e) {
      console.error('Failed to update category:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle category?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/vehicles/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchCategories();
    } catch (e) {
      console.error('Failed to delete category:', e);
    }
  };

  const openEditModal = (cat: VehicleCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      capacityPax: String(cat.capacityPax || 4),
      capacityLug: String(cat.capacityLug || 2),
      basePrice: String(cat.basePrice || 0),
      perKmPrice: String(cat.perKmPrice || 0),
      perMinPrice: String(cat.perMinPrice || 0),
      sortOrder: String(cat.sortOrder || 0),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Vehicle Categories & Fleets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage saloon, executive, MPV, and minibus vehicle classes, passenger capacities, and rate cards.
          </p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', description: '', capacityPax: '4', capacityLug: '2', basePrice: '15.00', perKmPrice: '2.50', perMinPrice: '0.50', sortOrder: '0' });
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer border-0"
        >
          + Add Vehicle Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search vehicle tier name..."
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

      {/* Vehicle Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 p-8 text-center text-slate-500">Loading vehicle categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-3 p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No vehicle categories configured. Click "+ Add Vehicle Category" to register fleet vehicle classes.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-900 m-0">{cat.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Order #{cat.sortOrder}
                  </span>
                </div>
                {cat.description && (
                  <p className="text-xs text-slate-500 m-0 line-clamp-2">{cat.description}</p>
                )}
              </div>

              {/* Capacities */}
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700">
                <div className="flex items-center gap-1.5 font-semibold">
                  <span>👥</span> {cat.capacityPax} Passengers
                </div>
                <div className="text-slate-300">|</div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <span>🧳</span> {cat.capacityLug} Luggage
                </div>
              </div>

              {/* Rates */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Base Flag Drop:</span>
                  <strong className="text-slate-900">${(cat.basePrice || 0).toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Per Km / Mile:</span>
                  <strong className="text-slate-900">${(cat.perKmPrice || 0).toFixed(2)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Per Minute:</span>
                  <strong className="text-slate-900">${(cat.perMinPrice || 0).toFixed(2)}</strong>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => openEditModal(cat)}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer bg-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="px-3 py-1 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer bg-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingCategory) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 m-0">
                {editingCategory ? 'Edit Vehicle Category' : 'Add Vehicle Category'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingCategory(null);
                }}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingCategory ? handleUpdate : handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Saloon / MPV 8-Seater"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Mercedes E-Class or BMW 5-Series"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Passengers</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={formData.capacityPax}
                    onChange={(e) => setFormData({ ...formData, capacityPax: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Luggage</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={formData.capacityLug}
                    onChange={(e) => setFormData({ ...formData, capacityLug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Base ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Per Km ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={formData.perKmPrice}
                    onChange={(e) => setFormData({ ...formData, perKmPrice: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Per Min ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={formData.perMinPrice}
                    onChange={(e) => setFormData({ ...formData, perMinPrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Sort Order</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer border-0"
                >
                  {editingCategory ? 'Save Changes' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

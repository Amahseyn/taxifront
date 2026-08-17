'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface VehicleCategory {
  id: string;
  name: string;
  capacityPax: number;
  capacityLug: number;
  basePrice: number;
  perKmPrice: number;
  perMinPrice: number;
}

interface LocationItem {
  id: string;
  name: string;
}

interface RoutePrice {
  id: string;
  fromLocationId: string;
  toLocationId: string;
  categoryId: string;
  price: number;
}

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'distance' | 'fixed'>('distance');
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [routePrices, setRoutePrices] = useState<RoutePrice[]>([]);
  const [loading, setLoading] = useState(true);

  // Fixed route modal
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [routeFormData, setRouteFormData] = useState({
    fromLocationId: '',
    toLocationId: '',
    categoryId: '',
    price: '75.00',
  });

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

      const [catRes, locRes, routeRes] = await Promise.all([
        fetch(`${apiUrl}/vehicles/categories`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/locations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/pricing/routes`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (catRes.ok) {
        const json = await catRes.json();
        setCategories(json.data || []);
      }
      if (locRes.ok) {
        const json = await locRes.json();
        setLocations(json.data || []);
      }
      if (routeRes.ok) {
        const json = await routeRes.json();
        setRoutePrices(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load pricing data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateRoutePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/pricing/routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...routeFormData,
          price: parseFloat(routeFormData.price) || 0,
        }),
      });
      if (res.ok) {
        setIsRouteModalOpen(false);
        fetchData();
      }
    } catch (e) {
      console.error('Failed to create route price:', e);
    }
  };

  const getLocationName = (id: string) => locations.find((l) => l.id === id)?.name || id;
  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Pricing & Rate Rules</h1>
          <p className="text-sm text-slate-500 mt-1">
            Distance/Time mileage calculations and Fixed point-to-point route fares.
          </p>
        </div>
        {activeTab === 'fixed' && (
          <button
            onClick={() => setIsRouteModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer border-0"
          >
            + Add Fixed Route Price
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('distance')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border-0 cursor-pointer ${
            activeTab === 'distance'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
          }`}
        >
          Distance & Time Rates
        </button>
        <button
          onClick={() => setActiveTab('fixed')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border-0 cursor-pointer ${
            activeTab === 'fixed'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
          }`}
        >
          Fixed Route Pricing (Point-to-Point)
        </button>
      </div>

      {/* Distance & Time Tab */}
      {activeTab === 'distance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 p-8 text-center text-slate-500">Loading rates...</div>
            ) : categories.length === 0 ? (
              <div className="col-span-3 p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                No vehicle rate categories found. Configure vehicles in the Vehicles section.
              </div>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900 m-0">{cat.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {cat.capacityPax} Pax / {cat.capacityLug} Lug
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm text-slate-600 border-t border-slate-100 pt-2">
                    <div className="flex justify-between">
                      <span>Base Dispatch Fee:</span>
                      <strong className="text-slate-900">${(cat.basePrice || 0).toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Per Mile / Km Rate:</span>
                      <strong className="text-slate-900">${(cat.perKmPrice || 0).toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Per Minute Waiting Rate:</span>
                      <strong className="text-slate-900">${(cat.perMinPrice || 0).toFixed(2)}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Fixed Route Pricing Tab */}
      {activeTab === 'fixed' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading route prices...</div>
          ) : routePrices.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No fixed point-to-point routes set up. Click "+ Add Fixed Route Price" to override dynamic mileage pricing.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">From Location</th>
                    <th className="px-4 py-3.5">To Location</th>
                    <th className="px-4 py-3.5">Vehicle Tier</th>
                    <th className="px-4 py-3.5">Agreed Flat Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {routePrices.map((rp) => (
                    <tr key={rp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-slate-900">📍 {getLocationName(rp.fromLocationId)}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">🏁 {getLocationName(rp.toLocationId)}</td>
                      <td className="px-4 py-3.5 text-xs text-slate-600">{getCategoryName(rp.categoryId)}</td>
                      <td className="px-4 py-3.5 font-bold text-emerald-600 text-sm font-mono">
                        ${(rp.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Fixed Route Modal */}
      {isRouteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 m-0">Add Fixed Route Price</h3>
              <button
                onClick={() => setIsRouteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRoutePrice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">From Location *</label>
                <select
                  required
                  value={routeFormData.fromLocationId}
                  onChange={(e) => setRouteFormData({ ...routeFormData, fromLocationId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="">-- Select Origin Location --</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">To Destination *</label>
                <select
                  required
                  value={routeFormData.toLocationId}
                  onChange={(e) => setRouteFormData({ ...routeFormData, toLocationId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="">-- Select Destination Location --</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Tier *</label>
                <select
                  required
                  value={routeFormData.categoryId}
                  onChange={(e) => setRouteFormData({ ...routeFormData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="">-- Select Vehicle Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Agreed Flat Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={routeFormData.price}
                  onChange={(e) => setRouteFormData({ ...routeFormData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRouteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer border-0"
                >
                  Save Fixed Price
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

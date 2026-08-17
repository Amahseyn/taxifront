'use client';

import React, { useEffect, useState } from 'react';

interface ZoneItem {
  id: string;
  name: string;
  geojson: string;
  createdAt: string;
}

export default function ZonesPage() {
  const [zones, setZones] = useState<ZoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    geojson: '{"type":"Polygon","coordinates":[[[-0.1278,51.5074],[-0.1180,51.5090],[-0.1150,51.5030],[-0.1278,51.5074]]]}',
  });

  const fetchZones = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/zones`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setZones(json.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch zones:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const url = editingZone ? `${apiUrl}/zones/${editingZone.id}` : `${apiUrl}/zones`;
      const method = editingZone ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingZone(null);
        fetchZones();
      }
    } catch (e) {
      console.error('Failed to save zone:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this zone boundary?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/zones/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchZones();
    } catch (e) {
      console.error('Failed to delete zone:', e);
    }
  };

  const openEditModal = (z: ZoneItem) => {
    setEditingZone(z);
    setFormData({
      name: z.name,
      geojson: z.geojson,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Geofenced Service Zones</h1>
          <p className="text-sm text-slate-500 mt-1">
            Polygon boundaries, congestion charge zones, airport drop zones, and service radii.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingZone(null);
            setFormData({
              name: '',
              geojson: '{"type":"Polygon","coordinates":[[[-0.1278,51.5074],[-0.1180,51.5090],[-0.1150,51.5030],[-0.1278,51.5074]]]}',
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer border-0"
        >
          + Create Zone
        </button>
      </div>

      {/* Zones List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 p-8 text-center text-slate-500">Loading zones...</div>
        ) : zones.length === 0 ? (
          <div className="col-span-3 p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No geofenced zones created yet. Click "+ Create Zone" to define a service polygon.
          </div>
        ) : (
          zones.map((zone) => (
            <div key={zone.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 m-0 flex items-center gap-2">
                  <span className="text-lg">🗺️</span> {zone.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Active GeoJSON
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[11px] text-slate-600 truncate max-h-16">
                {zone.geojson}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">Created: {new Date(zone.createdAt).toLocaleDateString()}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => openEditModal(zone)}
                    className="text-xs font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="text-xs font-semibold text-red-600 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 m-0">
                {editingZone ? 'Edit Zone Boundary' : 'Create Geofenced Zone'}
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Zone Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Central London Congestion Zone / Terminal 5 Area"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">GeoJSON Polygon Data *</label>
                <textarea
                  rows={6}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  value={formData.geojson}
                  onChange={(e) => setFormData({ ...formData, geojson: e.target.value })}
                />
                <p className="text-[11px] text-slate-400 mt-1 m-0">
                  Standard GeoJSON geometry format (Polygon or MultiPolygon with lng, lat coordinate arrays).
                </p>
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
                  {editingZone ? 'Save Changes' : 'Save Zone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

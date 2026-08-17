'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'general';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: 'Colchester Airport Taxi',
    company_phone: '+44 1206 123456',
    company_email: 'info@colchestertaxi.co.uk',
    company_address: 'Colchester, Essex, UK',
    currency_code: 'GBP',
    currency_symbol: '£',
    distance_unit: 'miles',
    tax_name: 'VAT',
    tax_rate: '20',
    tax_enabled: '1',
    google_maps_api_key: '',
    enable_night_surcharge: '1',
    terms_text: 'All bookings are subject to 24-hour cancellation notice. Waiting time charges apply after 45 minutes for airport pickups.',
    thank_you_text: 'Thank you for choosing our private transfer service. A booking confirmation has been dispatched.',
  });

  const fetchSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setSettings((prev) => ({ ...prev, ...(json.data || {}) }));
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save settings:', e);
    } finally {
      setSaving(false);
    }
  };

  const updateKey = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', label: 'Company Profile & Info' },
    { id: 'booking', label: 'Booking & Dispatch Settings' },
    { id: 'localization', label: 'Localization & Currency' },
    { id: 'tax', label: 'Tax & VAT Settings' },
    { id: 'integrations', label: 'Google & API Keys' },
    { id: 'terms', label: 'Terms & Thank You Page' },
  ];

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading system settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure company branding, currency, tax rates, APIs, and policies.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <span>✓</span> Settings successfully updated.
        </div>
      )}

      {/* Grid Layout: Tabs Left, Form Right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tab Sidebar */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all border-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Form */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            {/* General Profile Tab */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 m-0 border-b border-slate-100 pb-2">
                  Company Profile & Contact Information
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Trading Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={settings.company_name || ''}
                    onChange={(e) => updateKey('company_name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Support Phone Number</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      value={settings.company_phone || ''}
                      onChange={(e) => updateKey('company_phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Support Email Address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      value={settings.company_email || ''}
                      onChange={(e) => updateKey('company_email', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Address</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={settings.company_address || ''}
                    onChange={(e) => updateKey('company_address', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Booking Settings */}
            {activeTab === 'booking' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 m-0 border-b border-slate-100 pb-2">
                  Booking Engine & Dispatch Policies
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enable_night"
                    checked={settings.enable_night_surcharge === '1'}
                    onChange={(e) => updateKey('enable_night_surcharge', e.target.checked ? '1' : '0')}
                  />
                  <label htmlFor="enable_night" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    Enable Automatic Night/Peak Surcharge Calculation
                  </label>
                </div>
              </div>
            )}

            {/* Localization */}
            {activeTab === 'localization' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 m-0 border-b border-slate-100 pb-2">
                  Currency & Units of Measurement
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Code</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      value={settings.currency_code || 'GBP'}
                      onChange={(e) => updateKey('currency_code', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      value={settings.currency_symbol || '£'}
                      onChange={(e) => updateKey('currency_symbol', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Distance Unit</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                      value={settings.distance_unit || 'miles'}
                      onChange={(e) => updateKey('distance_unit', e.target.value)}
                    >
                      <option value="miles">Miles (UK/US)</option>
                      <option value="km">Kilometers (EU/Metric)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tax & VAT */}
            {activeTab === 'tax' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 m-0 border-b border-slate-100 pb-2">
                  Sales Tax & VAT Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tax / VAT Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      value={settings.tax_name || 'VAT'}
                      onChange={(e) => updateKey('tax_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      value={settings.tax_rate || '20'}
                      onChange={(e) => updateKey('tax_rate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Google APIs */}
            {activeTab === 'integrations' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 m-0 border-b border-slate-100 pb-2">
                  Google Maps & Geocoding API Keys
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Google Maps Browser API Key</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                    value={settings.google_maps_api_key || ''}
                    onChange={(e) => updateKey('google_maps_api_key', e.target.value)}
                  />
                  <p className="text-[11px] text-slate-500 mt-1 m-0">Used for Autocomplete and Distance Matrix routing.</p>
                </div>
              </div>
            )}

            {/* Terms & Thank You */}
            {activeTab === 'terms' && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 m-0 border-b border-slate-100 pb-2">
                  Terms & Booking Confirmation Text
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Terms & Conditions Disclaimer</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={settings.terms_text || ''}
                    onChange={(e) => updateKey('terms_text', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thank You Page Confirmation Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={settings.thank_you_text || ''}
                    onChange={(e) => updateKey('thank_you_text', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm cursor-pointer border-0"
              >
                {saving ? 'Saving...' : 'Save All Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

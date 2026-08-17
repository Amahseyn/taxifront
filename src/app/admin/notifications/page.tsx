'use client';

import React, { useEffect, useState, useCallback } from 'react';

interface Template {
  id: string;
  name: string;
  channel: string;
  subject?: string;
  body: string;
}

interface Rule {
  id: string;
  event: string;
  channel: string;
  enabled: boolean;
}

interface Log {
  id: string;
  channel: string;
  recipient: string;
  content: string;
  status: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'rules' | 'logs'>('templates');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // Template Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    channel: 'email',
    subject: '',
    body: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

      const [tempRes, rulesRes, logsRes] = await Promise.all([
        fetch(`${apiUrl}/notifications/templates`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/notifications/rules`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${apiUrl}/notifications/logs`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (tempRes.ok) {
        const json = await tempRes.json();
        setTemplates(json.data || []);
      }
      if (rulesRes.ok) {
        const json = await rulesRes.json();
        setRules(json.data || []);
      }
      if (logsRes.ok) {
        const json = await logsRes.json();
        setLogs(json.data || []);
      }
    } catch (e) {
      console.error('Failed to load notifications data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/notifications/templates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(templateFormData),
      });
      if (res.ok) {
        setIsTemplateModalOpen(false);
        setTemplateFormData({ name: '', channel: 'email', subject: '', body: '' });
        fetchData();
      }
    } catch (e) {
      console.error('Failed to save template:', e);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/notifications/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error('Failed to delete template:', e);
    }
  };

  const handleToggleRule = async (rule: Rule) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/notifications/rules/${rule.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: !rule.enabled }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error('Failed to toggle rule:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight m-0">Notifications & Automation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure automated SMS, Email, and WhatsApp templates, triggers, and dispatch logs.
          </p>
        </div>
        {activeTab === 'templates' && (
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white hover:bg-blue-700 transition-colors shadow-sm border-0 cursor-pointer"
          >
            + Create Template
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border-0 cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
          }`}
        >
          Message Templates
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border-0 cursor-pointer ${
            activeTab === 'rules'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
          }`}
        >
          Notification Rules & Triggers
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border-0 cursor-pointer ${
            activeTab === 'logs'
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-transparent'
          }`}
        >
          Delivery Audit Log
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 p-8 text-center text-slate-500">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="col-span-3 p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              No message templates configured. Click "+ Create Template" to build customer & driver templates.
            </div>
          ) : (
            templates.map((tpl) => (
              <div key={tpl.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 uppercase">
                      {tpl.channel}
                    </span>
                    <button
                      onClick={() => handleDeleteTemplate(tpl.id)}
                      className="text-xs text-red-600 hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 m-0">{tpl.name}</h3>
                  {tpl.subject && (
                    <p className="text-xs font-semibold text-slate-700 m-0">Subject: {tpl.subject}</p>
                  )}
                  <p className="text-xs text-slate-500 m-0 line-clamp-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono">
                    {tpl.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Rules Tab */}
      {activeTab === 'rules' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {rules.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No trigger rules registered yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Trigger Event</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 capitalize">{rule.event.replace('_', ' ')}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-xs text-slate-600">{rule.channel}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        rule.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleRule(rule)}
                        className="text-xs font-semibold text-blue-600 hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No recent notifications dispatched.
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Message Snippet</th>
                  <th className="px-6 py-4">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 uppercase font-semibold text-xs text-slate-600">{log.channel}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-800">{log.recipient}</td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs truncate">{log.content}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 m-0">Create Notification Template</h3>
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 border-0 bg-transparent text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Template Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Booking Confirmation Email"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={templateFormData.name}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Channel *</label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  value={templateFormData.channel}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, channel: e.target.value })}
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              {templateFormData.channel === 'email' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Line</label>
                  <input
                    type="text"
                    placeholder="e.g. Your Ride Confirmation #{bookingNumber}"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    value={templateFormData.subject}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, subject: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message Content Body *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Dear {customer_name}, your driver {driver_name} is arriving for pickup at {pickup_time}."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  value={templateFormData.body}
                  onChange={(e) => setTemplateFormData({ ...templateFormData, body: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 cursor-pointer border-0"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

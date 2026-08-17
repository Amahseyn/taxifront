'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('secp@8907');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md p-8 glass-card rounded-2xl shadow-2xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xl text-white mx-auto shadow-lg shadow-cyan-500/20">
            R
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-sm text-slate-400">Sign in to access RouteOS Dashboard</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              placeholder="admin@admin.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-sm text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

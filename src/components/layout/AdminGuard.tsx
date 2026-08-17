'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/layout/sidebar';
import { Topbar } from '../../components/layout/topbar';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading) {
      if (!token && !isLoginPage) {
        router.push('/admin/login');
      } else if (token && isLoginPage) {
        router.push('/admin');
      }
    }
  }, [token, loading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

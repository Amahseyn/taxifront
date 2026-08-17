'use client';

import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { AdminGuard } from '../../components/layout/AdminGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>
        {children}
      </AdminGuard>
    </AuthProvider>
  );
}


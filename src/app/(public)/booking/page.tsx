'use client';

import React from 'react';
import BookingForm from '@/components/BookingForm';

export default function PublicBookingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <BookingForm />
    </div>
  );
}

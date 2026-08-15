import React from 'react';

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pricing & Quotes</h1>
        <p className="text-sm text-slate-400">Fixed route rates, distance/time pricing matrix, and category base rates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white">Vehicle Category Pricing</h2>
          <div className="space-y-3">
            {[
              { name: 'Executive Sedan', base: '$15.00', perKm: '$2.50', perMin: '$0.50' },
              { name: 'Luxury SUV', base: '$25.00', perKm: '$3.80', perMin: '$0.75' },
              { name: 'First Class Van', base: '$40.00', perKm: '$4.50', perMin: '$1.00' },
            ].map((cat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="font-bold text-white">{cat.name}</div>
                  <div className="text-xs text-slate-400">Base: {cat.base} • {cat.perKm}/km • {cat.perMin}/min</div>
                </div>
                <button className="text-xs text-cyan-400 hover:underline">Edit Rate</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h2 className="text-lg font-bold text-white">Fixed Route Rates</h2>
          <div className="space-y-3">
            {[
              { route: 'Manhattan ↔ JFK Airport', price: '$85.00' },
              { route: 'Manhattan ↔ LaGuardia Airport', price: '$65.00' },
              { route: 'Wall Street ↔ Newark Liberty', price: '$110.00' },
            ].map((route, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex justify-between items-center">
                <div className="font-medium text-slate-200">{route.route}</div>
                <div className="font-bold text-cyan-400">{route.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared pricing logic — mirrors the backend PricingService rules so the
// frontend can show instant per-car estimates. See backend/app/services/pricing_service.py.

export const LOCAL_RULE = {
  minimum_fare: 15.0,
  per_mile_rate: 2.5,
  vehicle_prices: { saloon: 1.0, estate: 1.2, executive: 1.4, minibus: 1.8 },
};

export const AIRPORT_PRICES = {
  STN: { saloon: 75.0, estate: 85.0, executive: 90.0, minibus: 120.0 },
  SEN: { saloon: 85.0, estate: 95.0, executive: 100.0, minibus: 135.0 },
  LCY: { saloon: 125.0, estate: 135.0, executive: 140.0, minibus: 150.0 },
  NWI: { saloon: 130.0, estate: 140.0, executive: 145.0, minibus: 150.0 },
  LHR: { saloon: 160.0, estate: 175.0, executive: 175.0, minibus: 225.0 },
  LGW: { saloon: 160.0, estate: 175.0, executive: 175.0, minibus: 225.0 },
  LTN: { saloon: 160.0, estate: 175.0, executive: 175.0, minibus: 225.0 },
  BHX: { saloon: 250.0, estate: 265.0, executive: 270.0, minibus: 290.0 },
  EMA: { saloon: 250.0, estate: 265.0, executive: 270.0, minibus: 290.0 },
  LBA: { saloon: 355.0, estate: 365.0, executive: 370.0, minibus: 400.0 },
  MAN: { saloon: 355.0, estate: 365.0, executive: 370.0, minibus: 450.0 },
  LPL: { saloon: 370.0, estate: 385.0, executive: 390.0, minibus: 470.0 },
};

// UK bank holidays (England & Wales) used for the time-based surcharge.
export const BANK_HOLIDAYS_2026 = [
  "2026-01-01", "2026-04-03", "2026-04-06", "2026-05-04", "2026-05-25",
  "2026-08-31", "2026-12-25", "2026-12-28",
];

export const NIGHT_SURCHARGE = 0.15; // +15% between 22:00 and 06:00
export const WEEKEND_SURCHARGE = 0.1; // +10% on Sundays & bank holidays

export function isNight(timeStr) {
  if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return false;
  const h = parseInt(timeStr.slice(0, 2), 10);
  return h >= 22 || h < 6;
}

export function hasTimeSurcharge(dateStr, timeStr) {
  let weekend = false;
  if (dateStr) {
    const d = new Date(`${dateStr}T00:00:00`);
    if (!Number.isNaN(d.getTime())) {
      weekend = d.getDay() === 0 || BANK_HOLIDAYS_2026.includes(dateStr);
    }
  }
  return (weekend ? WEEKEND_SURCHARGE : 0) + (isNight(timeStr) ? NIGHT_SURCHARGE : 0);
}

// Estimate a single vehicle's price given distance (miles) and the chosen
// journey/time context. Returns null when distance is unavailable.
export function estimateVehiclePrice(vehicleCode, distanceMiles, journeyType, airportCode, dateStr, timeStr) {
  if (!distanceMiles || distanceMiles <= 0) return null;
  const isAirport = (journeyType && journeyType.includes("Airport")) || (airportCode && airportCode.length > 0);

  let price = 0;
  if (isAirport && airportCode && AIRPORT_PRICES[airportCode] && AIRPORT_PRICES[airportCode][vehicleCode] != null) {
    price = AIRPORT_PRICES[airportCode][vehicleCode];
  } else {
    const raw = LOCAL_RULE.minimum_fare + distanceMiles * LOCAL_RULE.per_mile_rate;
    const multiplier = LOCAL_RULE.vehicle_prices[vehicleCode] ?? 1.0;
    price = raw * multiplier;
  }

  const surcharge = hasTimeSurcharge(dateStr, timeStr);
  if (surcharge > 0) price = price * (1 + surcharge);
  return Math.round(price * 100) / 100;
}

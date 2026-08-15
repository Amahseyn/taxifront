import { describe, it, expect } from "vitest";
import {
  estimateVehiclePrice,
  hasTimeSurcharge,
  isNight,
  AIRPORT_PRICES,
  LOCAL_RULE,
} from "./pricing";

describe("pricing: isNight", () => {
  it("flags late night and early morning hours", () => {
    expect(isNight("22:00")).toBe(true);
    expect(isNight("23:30")).toBe(true);
    expect(isNight("00:00")).toBe(true);
    expect(isNight("05:59")).toBe(true);
  });

  it("does not flag daytime hours", () => {
    expect(isNight("06:00")).toBe(false);
    expect(isNight("12:00")).toBe(false);
    expect(isNight("21:59")).toBe(false);
  });

  it("returns false for invalid input", () => {
    expect(isNight("")).toBe(false);
    expect(isNight("noon")).toBe(false);
  });
});

describe("pricing: hasTimeSurcharge", () => {
  it("applies night surcharge only", () => {
    expect(hasTimeSurcharge("2026-06-15", "23:00")).toBeCloseTo(0.15);
  });

  it("applies weekend surcharge for Sundays", () => {
    // 2026-06-21 is a Sunday
    expect(hasTimeSurcharge("2026-06-21", "10:00")).toBeCloseTo(0.1);
  });

  it("applies combined surcharge on a Sunday night", () => {
    expect(hasTimeSurcharge("2026-06-21", "23:30")).toBeCloseTo(0.25);
  });

  it("applies bank-holiday surcharge", () => {
    // 2026-12-25 is in BANK_HOLIDAYS_2026
    expect(hasTimeSurcharge("2026-12-25", "12:00")).toBeCloseTo(0.1);
  });

  it("no surcharge on a normal weekday daytime", () => {
    expect(hasTimeSurcharge("2026-06-17", "14:00")).toBe(0);
  });
});

describe("pricing: estimateVehiclePrice", () => {
  it("returns null when distance is missing", () => {
    expect(estimateVehiclePrice("saloon", 0, "Local Journey", null, "2026-06-17", "10:00")).toBeNull();
    expect(estimateVehiclePrice("saloon", null, "Local Journey", null, "2026-06-17", "10:00")).toBeNull();
  });

  it("uses fixed airport price ignoring distance", () => {
    expect(estimateVehiclePrice("saloon", 50, "Airport Drop-off", "STN", "2026-06-17", "10:00")).toBe(75);
    expect(estimateVehiclePrice("minibus", 50, "Airport Drop-off", "STN", "2026-06-17", "10:00")).toBe(120);
  });

  it("computes local price from distance + per-mile + multiplier", () => {
    // min fare 15 + 10 miles * 2.5 = 40, saloon multiplier 1.0
    expect(estimateVehiclePrice("saloon", 10, "Local Journey", null, "2026-06-17", "10:00")).toBe(40);
    // minibus multiplier 1.8 -> (15 + 10*2.5)*1.8 = 72
    expect(estimateVehiclePrice("minibus", 10, "Local Journey", null, "2026-06-17", "10:00")).toBe(72);
  });

  it("applies night surcharge to the computed price", () => {
    // saloon local 40 * 1.15 = 46
    expect(estimateVehiclePrice("saloon", 10, "Local Journey", null, "2026-06-17", "23:00")).toBe(46);
  });

  it("applies weekend surcharge to airport price", () => {
    // STN saloon 75 * 1.10 = 82.5 (2026-06-21 Sunday)
    expect(estimateVehiclePrice("saloon", 50, "Airport Drop-off", "STN", "2026-06-21", "10:00")).toBe(82.5);
  });

  it("treats airport journey type without code as local", () => {
    expect(estimateVehiclePrice("saloon", 10, "Airport Drop-off", null, "2026-06-17", "10:00")).toBe(40);
  });
});

describe("pricing: data sanity", () => {
  it("exposes expected vehicle codes", () => {
    expect(Object.keys(LOCAL_RULE.vehicle_prices).sort()).toEqual(["estate", "executive", "minibus", "saloon"]);
  });

  it("has a price for every airport per vehicle", () => {
    for (const [code, prices] of Object.entries(AIRPORT_PRICES)) {
      for (const v of Object.keys(LOCAL_RULE.vehicle_prices)) {
        expect(prices[v], `${code} ${v}`).toBeTypeOf("number");
      }
    }
  });
});

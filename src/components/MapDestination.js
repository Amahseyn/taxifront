"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MapDestination.module.css";
import AddressAutocomplete from "./AddressAutocomplete";

// Fixed origin: Colchester.
const ORIGIN = { lng: 0.892, lat: 51.896, label: "Colchester" };

// Base prices (saloon / suv / minibus) — matched to the price guide
// for a typical ~25km airport run. Distance scales these.
const BASE = [
  { type: "Saloon", price: 75, perKm: 1.6 },
  { type: "SUV", price: 90, perKm: 1.9 },
  { type: "Minibus", price: 120, perKm: 2.4 },
];

export default function MapDestination({ onSelect }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { distanceKm, durationMin, lng, lat, label }
  const [pickMode, setPickMode] = useState(false);

  // Load Leaflet once
  useEffect(() => {
    let mounted = true;
    if (window.L) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync after mount
      if (!leafletLoaded) setLeafletLoaded(true);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => mounted && setLeafletLoaded(true);
    document.head.appendChild(script);
    return () => {
      mounted = false;
    };
  }, []);

  // Init map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapRef.current) return;
    const L = window.L;

    const map = L.map(mapContainerRef.current, {
      center: [ORIGIN.lat, ORIGIN.lng],
      zoom: 10,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Origin marker (fixed)
    L.marker([ORIGIN.lat, ORIGIN.lng], {
      icon: L.divIcon({
        className: styles.originIcon,
        html: "<div class='" + styles.originDot + "'></div>",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    })
      .addTo(map)
      .bindPopup(`<strong>${ORIGIN.label}</strong> (pickup)`);

    // Click to pick destination
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      await computeRoute(lat, lng);
    });
  }, [leafletLoaded]);

  const drawRoute = (lat, lng) => {
    const L = window.L;
    if (!L || !mapRef.current) return;
    if (routeLineRef.current) {
      mapRef.current.removeLayer(routeLineRef.current);
    }
    if (destMarkerRef.current) {
      mapRef.current.removeLayer(destMarkerRef.current);
    }
    destMarkerRef.current = L.marker([lat, lng], {
      icon: L.divIcon({
        className: styles.destIcon,
        html: "<div class='" + styles.destDot + "'></div>",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      }),
    }).addTo(mapRef.current);
    routeLineRef.current = L.polyline(
      [[ORIGIN.lat, ORIGIN.lng], [lat, lng]],
      { color: "#066aab", weight: 4, opacity: 0.8 }
    ).addTo(mapRef.current);
  };

  async function computeRoute(lat, lng, label) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/distance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Route failed");
      const r = { ...data, lat, lng, label: label || `Destination (${lat.toFixed(3)}, ${lng.toFixed(3)})` };
      setResult(r);
      drawRoute(lat, lng);
      onSelect && onSelect(r);
    } catch (err) {
      setError(err.message || "Could not calculate route.");
    } finally {
      setLoading(false);
    }
  }

  const handleGeocode = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Geocode failed");
      if (mapRef.current) mapRef.current.setView([data.lat, data.lng], 12);
      await computeRoute(data.lat, data.lng, data.label);
    } catch (err) {
      setError(err.message || "Could not find that location.");
    } finally {
      setLoading(false);
    }
  };

  // Chosen from the autocomplete dropdown — use its coordinates directly.
  const handleSuggestionSelect = async (s) => {
    setAddress(s.label);
    if (typeof s.lat !== "number" || typeof s.lng !== "number") return;
    if (mapRef.current) mapRef.current.setView([s.lat, s.lng], 12);
    await computeRoute(s.lat, s.lng, s.label);
  };

  const estimate = (b) => {
    if (!result) return null;
    const total = Math.round(b.price + result.distanceKm * b.perKm);
    return total;
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.searchRow} onSubmit={handleGeocode}>
        <div className={styles.searchField}>
          <AddressAutocomplete
            name="planDestination"
            className={styles.searchInput}
            placeholder="Enter destination (e.g. Stansted Airport)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onSelect={handleSuggestionSelect}
          />
        </div>
        <button type="submit" className={styles.searchBtn} disabled={loading}>
          {loading ? "…" : "Find"}
        </button>
        <button
          type="button"
          className={`${styles.pickBtn} ${pickMode ? styles.pickBtnActive : ""}`}
          onClick={() => setPickMode((v) => !v)}
        >
          {pickMode ? "Click map…" : "Pick on map"}
        </button>
      </form>

      <div className={styles.mapWrapper}>
        <div ref={mapContainerRef} className={styles.map} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.resultCard}>
          <div className={styles.resultHead}>
            <span className={styles.resultLabel}>{result.label}</span>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{result.distanceKm} km</span>
              <span className={styles.statName}>Distance</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>
                {Math.floor(result.durationMin / 60)}h {result.durationMin % 60}m
              </span>
              <span className={styles.statName}>Est. time</span>
            </div>
          </div>

          <div className={styles.priceList}>
            {BASE.map((b) => (
              <div key={b.type} className={styles.priceRow}>
                <span>{b.type}</span>
                <span className={styles.priceVal}>£{estimate(b)}</span>
              </div>
            ))}
          </div>
          <p className={styles.note}>
            Fixed, transparent pricing. Final quote confirmed on booking.
          </p>
        </div>
      )}
    </div>
  );
}

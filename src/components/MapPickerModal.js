"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MapPickerModal.module.css";

// Default map center (Colchester area).
const DEFAULT_CENTER = { lat: 51.896, lng: 0.892 };

/**
 * MapPickerModal
 * A modal Leaflet map for picking an address by clicking on the map.
 * On confirm, calls onSelect with a suggestion-like object:
 * { label, name, street, housenumber, city, region, postal, lat, lng }
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - onSelect: (address) => void
 *  - title: string
 *  - initial: { lat, lng } optional starting point
 */
export default function MapPickerModal({ open, onClose, onSelect, title = "Pick location on map", initial }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [picked, setPicked] = useState(null); // reverse-geocode result
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Leaflet once.
  useEffect(() => {
    if (!open) return;
    if (typeof window !== "undefined" && window.L) {
      setLeafletLoaded(true);
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, [open]);

  // Reverse geocode a picked point.
  const reverseGeocode = async (lat, lng) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reverse-geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not look up that location.");
      setPicked({ ...data, lat, lng });
    } catch (err) {
      setPicked({ label: "", lat, lng });
      setError(err.message || "Could not look up that location.");
    } finally {
      setLoading(false);
    }
  };

  const placeMarker = (lat, lng) => {
    const L = window.L;
    if (!L || !mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current);
      markerRef.current.on("dragend", (e) => {
        const { lat: dlat, lng: dlng } = e.target.getLatLng();
        setCoords({ lat: dlat, lng: dlng });
        reverseGeocode(dlat, dlng);
      });
    }
    setCoords({ lat, lng });
  };

  // Init map when opened and leaflet is ready.
  useEffect(() => {
    if (!open || !leafletLoaded || !containerRef.current) return;
    const L = window.L;

    // Recreate the map each time the modal opens for a clean state.
    const start = initial && typeof initial.lat === "number" ? initial : DEFAULT_CENTER;
    const map = L.map(containerRef.current, {
      center: [start.lat, start.lng],
      zoom: 12,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      placeMarker(lat, lng);
      reverseGeocode(lat, lng);
    });

    // Fix tile rendering inside a modal that was just shown.
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      setPicked(null);
      setCoords(null);
      setError("");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, leafletLoaded]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const confirm = () => {
    if (!coords) return;
    onSelect &&
      onSelect(
        picked || {
          label: "",
          lat: coords.lat,
          lng: coords.lng,
        }
      );
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <p className={styles.hint}>Click on the map to drop a pin, or drag the pin to fine-tune.</p>

        <div className={styles.mapWrapper}>
          <div ref={containerRef} className={styles.map} />
          {!leafletLoaded && <div className={styles.mapLoading}>Loading map…</div>}
        </div>

        <div className={styles.selection}>
          {loading ? (
            <span className={styles.selText}>Looking up address…</span>
          ) : picked ? (
            <span className={styles.selText}>
              {picked.label || `Pinned at ${coords?.lat.toFixed(4)}, ${coords?.lng.toFixed(4)}`}
            </span>
          ) : (
            <span className={styles.selPlaceholder}>No location selected yet.</span>
          )}
          {error && <span className={styles.error}>{error}</span>}
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.confirmBtn} onClick={confirm} disabled={!coords || loading}>
            Use this location
          </button>
        </div>
      </div>
    </div>
  );
}

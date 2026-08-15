"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AreasMap.module.css";

const markersData = [
  { name: "Colchester", lat: 51.896, lng: 0.892 },
  { name: "Witham", lat: 51.795999, lng: 0.637048 },
  { name: "Braintree", lat: 51.87867, lng: 0.55292 },
  { name: "Coggeshall", lat: 51.871277, lng: 0.686201 },
  { name: "Manningtree", lat: 51.94545, lng: 1.06462 },
  { name: "Brightlingsea", lat: 51.81184, lng: 1.02395 },
  { name: "Clacton-on-Sea", lat: 51.78954, lng: 1.15442 },
  { name: "West Mersea", lat: 51.77898, lng: 0.91864 },
  { name: "Walton-on-the-Naze", lat: 51.84832, lng: 1.26754 },
  { name: "Sudbury", lat: 52.04163, lng: 0.73117 },
  { name: "Hadleigh", lat: 52.04458, lng: 0.95302 },
  { name: "Harwich", lat: 51.94183, lng: 1.28495 },
];

export default function AreasMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (window.L) {
        if (isMounted) setLeafletLoaded(true);
        return;
      }

      // Dynamically load Leaflet CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);

      // Dynamically load Leaflet JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.onload = () => {
        if (isMounted) setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = window.L;
    if (!L) return;

    // Destroy existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      center: [51.896, 0.892],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: false, // Prevent zoom scroll hijacking
    });

    mapInstanceRef.current = map;

    // Greyscale openstreetmap layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Custom animated markers matching WordPress 'nectar' marker style
    const customIcon = L.divIcon({
      html: `
        <div class="${styles.animatedDot}">
          <div class="${styles.middleDot}"></div>
          <div class="${styles.signal}"></div>
          <div class="${styles.signal2}"></div>
        </div>
      `,
      className: styles.customDivIcon,
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });

    // Add markers with popups
    markersData.forEach((marker) => {
      L.marker([marker.lat, marker.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(`<strong>${marker.name}</strong>`);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  return (
    <div className={styles.container}>
      <div className={styles.textCol}>
        <p className={styles.text}>
          We&rsquo;re <strong>based in Colchester</strong> and proudly serve customers across the surrounding areas of <strong>Essex and Suffolk</strong>.
          Our reliable airport transfer service covers: <strong>Brightlingsea, Clacton, Frinton, Harwich, Walton, Manningtree, Hadleigh, Dedham, Sudbury, Wivenhoe, Mersea, Coggeshall, Halstead, Witham, and Maldon</strong>.
        </p>
        <p className={styles.text} style={{ marginTop: "20px" }}>
          Whether you&rsquo;re travelling to or from these towns, we provide <strong>comfortable, on-time transfers to all major UK airports, seaports, and long-distance destinations</strong>.
        </p>
        <p className={styles.highlightedText}>We cover pick-ups from any UK airport to Essex</p>
      </div>
      <div className={styles.mapCol}>
        <div className={styles.mapWrapper}>
          <div
            ref={mapContainerRef}
            className={`${styles.mapElement} ${styles.grayscaleMap}`}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

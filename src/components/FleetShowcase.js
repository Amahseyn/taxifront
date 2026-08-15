"use client";

import { useState } from "react";
import styles from "./FleetShowcase.module.css";

export default function FleetShowcase() {
  const [activeHotspot, setActiveHotspot] = useState(null); // `${vehicleIdx}-${hotspotIdx}`

  const vehicles = [
    {
      name: "Saloon Car | 4 People | 2 Large or 4 Small Suitcases",
      image: "/tesla.png",
      alt: "Saloon Car",
      hotspots: [
        {
          title: "Frunk",
          text: "Some space for back packs in frunk 🙂",
          top: "36.8464%",
          left: "15.4752%",
          position: "top",
        },
        {
          title: "Passenger Capacity",
          text: "4 Passengers.",
          top: "56.923%",
          left: "64.4137%",
          position: "right",
        },
        {
          title: "Boot Capacity",
          text: "2 Large or 4 Small Suitcases.",
          top: "21.0611%",
          left: "81.0344%",
          position: "top",
        },
      ],
    },
    {
      name: "SUV / Estate Car | 4 People | Spacious Luggage Area",
      image: "/audi.png",
      alt: "Estate Car",
      hotspots: [
        {
          title: "Boot Capacity",
          text: "3 Large and 2 small suitcases",
          top: "21.0611%",
          left: "81.0344%",
          position: "top",
        },
        {
          title: "Passenger Capacity",
          text: "4 Passengers.",
          top: "65.2389%",
          left: "60.5454%",
          position: "right",
        },
      ],
    },
    {
      name: "Minibus | 8 People | Spacious Luggage Area",
      image: "/transporter.png",
      alt: "Minibus",
      hotspots: [
        {
          title: "Boot Capacity",
          text: "Plenty of space for many large suitcases.",
          top: "21.0611%",
          left: "81.0344%",
          position: "top",
          forceLeft: true,
        },
        {
          title: "Passenger Capacity",
          text: "8 Passengers.",
          top: "65.2389%",
          left: "60.5454%",
          position: "right",
          forceLeft: true,
        },
      ],
    },
  ];

  const handleHotspotClick = (key, e) => {
    e.stopPropagation();
    setActiveHotspot(activeHotspot === key ? null : key);
  };

  return (
    <div className={styles.container} onClick={() => setActiveHotspot(null)}>
      <div className={styles.grid}>
        {vehicles.map((vehicle, vehicleIdx) => (
          <div key={`vehicle-${vehicleIdx}`} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={vehicle.image}
                alt={vehicle.alt}
                className={styles.img}
              />
              
              {/* Hotspots */}
              {vehicle.hotspots.map((hotspot, hotspotIdx) => {
                const key = `${vehicleIdx}-${hotspotIdx}`;
                const isActive = activeHotspot === key;
                return (
                  <div
                    key={key}
                    className={`${styles.hotspotWrap} ${isActive ? styles.active : ""}`}
                    style={{
                      top: hotspot.top,
                      left: hotspot.left,
                    }}
                    onClick={(e) => handleHotspotClick(key, e)}
                  >
                    <div className={styles.hotspot}>
                      <span className={styles.plusIcon}>+</span>
                    </div>
                    
                    <div
                      className={`${styles.tooltip} ${
                        styles[hotspot.position]
                      } ${hotspot.forceLeft ? styles.forceLeft : ""}`}
                    >
                      <div className={styles.tooltipInner}>
                        <h5 className={styles.tooltipTitle}>{hotspot.title}</h5>
                        <p className={styles.tooltipText}>{hotspot.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className={styles.infoWrapper}>
              <h4 className={styles.title}>{vehicle.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

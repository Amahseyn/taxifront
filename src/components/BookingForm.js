"use client";

import React, { useState, useEffect, useRef } from "react";
import AddressAutocomplete from "./AddressAutocomplete";
import MapPickerModal from "./MapPickerModal";
import { estimateVehiclePrice } from "../lib/pricing";

const API_BASE = "/api/v1";

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [airports, setAirports] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showMapFor, setShowMapFor] = useState(null); // "pickup" | "destination" | null

  // Interactive stops
  const [stops, setStops] = useState([]);

  // Special Reqs drawer
  const [showSpecialReqs, setShowSpecialReqs] = useState(false);

  // Form State
  const [journeyType, setJourneyType] = useState("return"); // 'dropoff' | 'pickup' | 'return' | 'point'
  
  const [formData, setFormData] = useState({
    pickup_address: "",
    pickup_postcode: "",
    pickup_lat: 51.896,
    pickup_lng: 0.892,

    destination_address: "",
    destination_postcode: "",
    destination_lat: 51.896,
    destination_lng: 0.892,

    outbound_airport: "STN",
    pickup_date: "",
    pickup_time: "",

    primary_flight_number: "",

    // Return leg details
    same_airport: true,
    return_airport: "STN",
    same_return_dropoff: true,
    return_dropoff_address: "",
    return_date: "",
    return_time: "",
    return_flight_number: "",

    // Counters
    passengers: 3,
    suitcases: 3,

    // Extras & Notes
    extras: [],
    driver_notes: "",

    // Vehicle
    vehicle_code: "estate",

    // Passenger info
    passenger_name: "",
    passenger_phone: "",
    passenger_email: "",
    payment_method: "express",
  });

  const [errors, setErrors] = useState({});

  // Route calculation
  const [route, setRoute] = useState({ loading: false, error: "", distanceMiles: 0, durationMinutes: 0 });
  const routeReqRef = useRef(0);

  // Fetch airports & vehicles from backend
  useEffect(() => {
    fetch(`${API_BASE}/airports`)
      .then((res) => res.json())
      .then((data) => setAirports(data || []))
      .catch((err) => console.error("Failed to load airports:", err));

    fetch(`${API_BASE}/vehicles`)
      .then((res) => res.json())
      .then((data) => setVehicles(data || []))
      .catch((err) => console.error("Failed to load vehicles:", err));
  }, []);

  // Distance estimation
  useEffect(() => {
    const { pickup_lat, pickup_lng, destination_lat, destination_lng } = formData;
    const hasPickup = typeof pickup_lat === "number" && typeof pickup_lng === "number" && (pickup_lat !== 51.896 || pickup_lng !== 0.892);
    const hasDest = typeof destination_lat === "number" && typeof destination_lng === "number" && (destination_lat !== 51.896 || destination_lng !== 0.892);
    
    if (!hasPickup || !hasDest) return;

    const reqId = ++routeReqRef.current;
    (async () => {
      setRoute((r) => ({ ...r, loading: true, error: "" }));
      try {
        const res = await fetch("/api/distance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: destination_lat, lng: destination_lng }),
        });
        const data = await res.json();
        if (reqId !== routeReqRef.current) return;
        if (!res.ok) throw new Error(data.error || "Route calculation failed");
        setRoute({
          loading: false,
          error: "",
          distanceMiles: (data.distanceKm || 25) * 0.621371,
          durationMinutes: data.durationMin || 35,
        });
      } catch (err) {
        if (reqId !== routeReqRef.current) return;
        setRoute({ loading: false, error: "", distanceMiles: 25, durationMinutes: 35 });
      }
    })();
  }, [formData.pickup_lat, formData.pickup_lng, formData.destination_lat, formData.destination_lng]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressSelect = (type) => (s) => {
    const fullAddress = [s.housenumber, s.street, s.city].filter(Boolean).join(", ") || s.label;
    if (type === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickup_address: fullAddress,
        pickup_postcode: s.postal || "",
        pickup_lat: s.lat,
        pickup_lng: s.lng,
      }));
    } else if (type === "destination") {
      setFormData((prev) => ({
        ...prev,
        destination_address: fullAddress,
        destination_postcode: s.postal || "",
        destination_lat: s.lat,
        destination_lng: s.lng,
      }));
    } else if (type === "return_dropoff") {
      setFormData((prev) => ({
        ...prev,
        return_dropoff_address: fullAddress,
      }));
    }
  };

  const handleMapSelect = (type) => (s) => {
    const fullAddress =
      [s.housenumber, s.street, s.city].filter(Boolean).join(", ") ||
      s.label ||
      `Pinned location (${Number(s.lat).toFixed(4)}, ${Number(s.lng).toFixed(4)})`;
    
    if (type === "pickup") {
      setFormData((prev) => ({
        ...prev,
        pickup_address: fullAddress,
        pickup_postcode: s.postal || "",
        pickup_lat: s.lat,
        pickup_lng: s.lng,
      }));
    } else if (type === "destination") {
      setFormData((prev) => ({
        ...prev,
        destination_address: fullAddress,
        destination_postcode: s.postal || "",
        destination_lat: s.lat,
        destination_lng: s.lng,
      }));
    }
    setShowMapFor(null);
  };

  // Adjust Pax / Suitcase counts
  const adjustCount = (type, delta) => {
    setFormData((prev) => {
      const current = prev[type];
      const nextVal = type === "passengers" ? Math.max(1, current + delta) : Math.max(0, current + delta);
      return { ...prev, [type]: nextVal };
    });
  };

  // Intermediate Stops
  const addStop = () => setStops((prev) => [...prev, ""]);
  const updateStop = (idx, val) => {
    setStops((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };
  const removeStop = (idx) => setStops((prev) => prev.filter((_, i) => i !== idx));

  // Check capacity limit
  const isOverCapacity = formData.passengers > 8 || formData.suitcases > 8;

  // Available vehicle filtering based on capacity
  const isVehicleAvailable = (vCode) => {
    const p = formData.passengers;
    const s = formData.suitcases;
    if (vCode === "saloon") return p <= 4 && s <= 2;
    if (vCode === "estate") return p <= 4 && s <= 3;
    if (vCode === "mpv") return p <= 6 && s <= 4;
    if (vCode === "minibus") return p <= 8 && s <= 8;
    return true;
  };

  // Auto-select valid vehicle if current selection becomes unavailable
  useEffect(() => {
    if (!isVehicleAvailable(formData.vehicle_code)) {
      if (isVehicleAvailable("saloon")) handleInputChange("vehicle_code", "saloon");
      else if (isVehicleAvailable("estate")) handleInputChange("vehicle_code", "estate");
      else if (isVehicleAvailable("mpv")) handleInputChange("vehicle_code", "mpv");
      else if (isVehicleAvailable("minibus")) handleInputChange("vehicle_code", "minibus");
    }
  }, [formData.passengers, formData.suitcases]);

  // Handle Extras checkboxes
  const toggleExtra = (value) => {
    setFormData((prev) => {
      const exists = prev.extras.includes(value);
      const nextExtras = exists ? prev.extras.filter((x) => x !== value) : [...prev.extras, value];
      return { ...prev, extras: nextExtras };
    });
  };

  // Vehicle Price mapping (base rates + dynamic estimation)
  const getVehiclePrice = (vCode) => {
    const miles = route.distanceMiles > 0 ? route.distanceMiles : 25;
    const estimated = estimateVehiclePrice(
      vCode,
      miles,
      journeyType === "return" ? "Return Airport Transfer" : journeyType === "pickup" ? "Airport Pickup" : "Airport Drop-off",
      formData.outbound_airport,
      formData.pickup_date,
      formData.pickup_time
    );
    if (estimated) return estimated;

    // Fallback base fares matching UI widget
    const basePrices = { saloon: 75, estate: 90, mpv: 105, minibus: 120 };
    let fare = basePrices[vCode] || 90;
    if (journeyType === "return") fare = fare * 1.9; // discount for return
    return Math.round(fare);
  };

  const currentFare = getVehiclePrice(formData.vehicle_code);
  const tollFee = (journeyType.includes("dropoff") || journeyType.includes("pickup") || journeyType.includes("return")) ? 7 : 0;
  const totalPrice = currentFare + tollFee;

  // Step Validation
  const validateStep1 = () => {
    const errs = {};
    if (!formData.pickup_address && journeyType !== "pickup") errs.pickup_address = true;
    if (journeyType === "point" && !formData.destination_address) errs.destination_address = true;
    if (!formData.pickup_date) errs.pickup_date = true;
    if (!formData.pickup_time) errs.pickup_time = true;

    if (journeyType === "pickup" && !formData.primary_flight_number) {
      errs.primary_flight_number = true;
    }

    if (journeyType === "return") {
      if (!formData.return_date) errs.return_date = true;
      if (!formData.return_time) errs.return_time = true;
      if (!formData.return_flight_number) errs.return_flight_number = true;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.passenger_name) errs.passenger_name = true;
    if (!formData.passenger_phone) errs.passenger_phone = true;
    if (!formData.passenger_email) errs.passenger_email = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep2 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleNextStep3 = () => {
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        journey_type: journeyType === "return" ? "Return Airport Transfer" : journeyType === "pickup" ? "Airport Pickup" : journeyType === "dropoff" ? "Airport Drop-off" : "Local Journey",
        pickup_address: formData.pickup_address || `${formData.outbound_airport} Airport`,
        destination_address: journeyType === "point" ? formData.destination_address : `${formData.outbound_airport} Airport`,
        airport_code: formData.outbound_airport,
        flight_number: formData.primary_flight_number || null,
        vehicle_code: formData.vehicle_code,
        passengers: formData.passengers,
        large_luggage: formData.suitcases,
        small_luggage: 0,
        travel_date: formData.pickup_date,
        travel_time: formData.pickup_time,
        name: formData.passenger_name,
        email: formData.passenger_email,
        phone: formData.passenger_phone,
        notes: [
          stops.length > 0 ? `Intermediate Stops: ${stops.join(" | ")}` : "",
          formData.extras.length > 0 ? `Extras: ${formData.extras.join(", ")}` : "",
          formData.driver_notes ? `Notes: ${formData.driver_notes}` : "",
          `Payment Method: ${formData.payment_method}`
        ].filter(Boolean).join(" \n")
      };

      if (journeyType === "return") {
        payload.return_journey_data = {
          return_date: formData.return_date,
          return_time: formData.return_time,
          return_flight_number: formData.return_flight_number,
          return_airport: formData.same_airport ? formData.outbound_airport : formData.return_airport,
          return_dropoff: formData.same_return_dropoff ? formData.pickup_address : formData.return_dropoff_address
        };
      }

      const res = await fetch(`${API_BASE}/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Booking creation failed.");
      }

      const data = await res.json();
      if (data.stripe_session_url) {
        window.location.href = data.stripe_session_url;
      } else {
        alert("Booking created successfully! Thank you for choosing Colchester Airport Taxi.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to process booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="booking-form" className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-sans text-slate-100">
      
      {/* Header Stepper Badges */}
      <div className="bg-slate-950/80 p-4 border-b border-slate-800 flex justify-between items-center text-xs px-4 sm:px-8">
        <div className={`flex items-center gap-2 font-semibold ${step >= 1 ? "text-yellow-400" : "text-slate-400"}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 1 ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
            1
          </span>
          <span>Journey</span>
        </div>
        <div className="h-0.5 w-8 sm:w-12 bg-slate-800"></div>
        <div className={`flex items-center gap-2 font-semibold ${step >= 2 ? "text-yellow-400" : "text-slate-400"}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 2 ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
            2
          </span>
          <span>Vehicle</span>
        </div>
        <div className="h-0.5 w-8 sm:w-12 bg-slate-800"></div>
        <div className={`flex items-center gap-2 font-semibold ${step >= 3 ? "text-yellow-400" : "text-slate-400"}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${step >= 3 ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
            3
          </span>
          <span>Passenger & Pay</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">
        
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: JOURNEY DETAILS */}
        {step === 1 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                1. Journey Details
              </h2>
              <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded font-semibold">
                Step 1 of 3
              </span>
            </div>

            {/* Journey Types Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "dropoff", label: "🛫 Airport Drop-off" },
                { id: "pickup", label: "🛬 Airport Pick-up" },
                { id: "return", label: "🔄 Airport Return" },
                { id: "point", label: "🚘 Point-to-Point" },
              ].map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setJourneyType(j.id)}
                  className={`p-2.5 text-center rounded-xl border text-xs font-medium transition ${
                    journeyType === j.id
                      ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                      : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>

            {/* Address & Airport Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Pickup Address */}
              {journeyType !== "pickup" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Pickup Address / Postcode <span className="text-yellow-400">*</span>
                  </label>
                  <AddressAutocomplete
                    name="pickup_address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                    value={formData.pickup_address}
                    onChange={(e) => handleInputChange("pickup_address", e.target.value)}
                    onSelect={handleAddressSelect("pickup")}
                    placeholder="e.g. Stanway, Colchester (CO3)"
                  />
                  {errors.pickup_address && <span className="text-[11px] text-red-400 mt-1 block">Pickup address is required.</span>}
                </div>
              )}

              {/* Airport Selection */}
              {journeyType !== "point" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {journeyType === "pickup" ? "Pickup Airport" : "Select Airport"} <span className="text-yellow-400">*</span>
                  </label>
                  <select
                    value={formData.outbound_airport}
                    onChange={(e) => handleInputChange("outbound_airport", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="STN">London Stansted (STN)</option>
                    <option value="LHR">London Heathrow (LHR)</option>
                    <option value="LGW">London Gatwick (LGW)</option>
                    <option value="LTN">London Luton (LTN)</option>
                    <option value="LCY">London City (LCY)</option>
                    <option value="SEN">Southend Airport (SEN)</option>
                  </select>
                </div>
              )}

              {/* Destination Address for Point to Point */}
              {(journeyType === "point" || journeyType === "pickup") && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Destination Address / Postcode <span className="text-yellow-400">*</span>
                  </label>
                  <AddressAutocomplete
                    name="destination_address"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                    value={formData.destination_address}
                    onChange={(e) => handleInputChange("destination_address", e.target.value)}
                    onSelect={handleAddressSelect("destination")}
                    placeholder="e.g. High St, Colchester (CO1)"
                  />
                  {errors.destination_address && <span className="text-[11px] text-red-400 mt-1 block">Destination address is required.</span>}
                </div>
              )}

              {/* Pickup Date & Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pickup Date <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.pickup_date}
                  onChange={(e) => handleInputChange("pickup_date", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
                {errors.pickup_date && <span className="text-[11px] text-red-400 mt-1 block">Pickup date is required.</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Pickup Time <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="time"
                  value={formData.pickup_time}
                  onChange={(e) => handleInputChange("pickup_time", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
                {errors.pickup_time && <span className="text-[11px] text-red-400 mt-1 block">Pickup time is required.</span>}
              </div>
            </div>

            {/* Inbound Flight No if Airport Pickup */}
            {journeyType === "pickup" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Inbound Flight No. <span className="text-yellow-400 font-semibold">*Required</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. FR1384"
                  value={formData.primary_flight_number}
                  onChange={(e) => handleInputChange("primary_flight_number", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
                {errors.primary_flight_number && <span className="text-[11px] text-red-400 mt-1 block">Flight number is required for airport pickups.</span>}
              </div>
            )}

            {/* Extra Stops Section */}
            <div className="space-y-2">
              {stops.map((stop, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Stop #${idx + 1} Address`}
                    value={stop}
                    onChange={(e) => updateStop(idx, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => removeStop(idx)}
                    className="text-xs text-red-400 hover:text-red-300 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStop}
                className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold inline-flex items-center gap-1 mt-1"
              >
                <span>+ Add Intermediate Stop along the way</span>
              </button>
            </div>

            {/* Return Leg Details Section */}
            {journeyType === "return" && (
              <div className="p-4 bg-slate-950 rounded-xl border border-yellow-400/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                    🔄 Return Leg Details
                  </span>
                  <span className="text-[10px] text-slate-400">Inbound Airport Run</span>
                </div>

                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="font-medium text-slate-200">Return from same airport?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange("same_airport", true)}
                      className={`px-3 py-1 rounded font-bold text-xs transition ${
                        formData.same_airport ? "bg-yellow-400 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("same_airport", false)}
                      className={`px-3 py-1 rounded font-bold text-xs transition ${
                        !formData.same_airport ? "bg-yellow-400 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {!formData.same_airport && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Return Airport <span className="text-yellow-400">*</span>
                    </label>
                    <select
                      value={formData.return_airport}
                      onChange={(e) => handleInputChange("return_airport", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="LHR">London Heathrow (LHR)</option>
                      <option value="STN">London Stansted (STN)</option>
                      <option value="LGW">London Gatwick (LGW)</option>
                      <option value="LTN">London Luton (LTN)</option>
                      <option value="LCY">London City (LCY)</option>
                      <option value="SEN">Southend Airport (SEN)</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="font-medium text-slate-200">Return to same address as pickup?</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleInputChange("same_return_dropoff", true)}
                      className={`px-3 py-1 rounded font-bold text-xs transition ${
                        formData.same_return_dropoff ? "bg-yellow-400 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("same_return_dropoff", false)}
                      className={`px-3 py-1 rounded font-bold text-xs transition ${
                        !formData.same_return_dropoff ? "bg-yellow-400 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {!formData.same_return_dropoff && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Return Destination Address / Postcode <span className="text-yellow-400">*</span>
                    </label>
                    <AddressAutocomplete
                      name="return_dropoff_address"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                      value={formData.return_dropoff_address}
                      onChange={(e) => handleInputChange("return_dropoff_address", e.target.value)}
                      onSelect={handleAddressSelect("return_dropoff")}
                      placeholder="e.g. Lexden, Colchester (CO3)"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Return Date <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.return_date}
                      onChange={(e) => handleInputChange("return_date", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                    />
                    {errors.return_date && <span className="text-[11px] text-red-400 mt-1 block">Return date required.</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Return Landing Time <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="time"
                      value={formData.return_time}
                      onChange={(e) => handleInputChange("return_time", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                    />
                    {errors.return_time && <span className="text-[11px] text-red-400 mt-1 block">Return time required.</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Return Flight No. <span className="text-yellow-400">*Required</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BA0245"
                      value={formData.return_flight_number}
                      onChange={(e) => handleInputChange("return_flight_number", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                    />
                    {errors.return_flight_number && <span className="text-[11px] text-red-400 mt-1 block">Return flight required.</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Passenger & Suitcase Counters */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-medium text-slate-300">Passengers</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustCount("passengers", -1)}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-yellow-400">{formData.passengers}</span>
                  <button
                    type="button"
                    onClick={() => adjustCount("passengers", 1)}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-xs font-medium text-slate-300">Suitcases</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustCount("suitcases", -1)}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-yellow-400">{formData.suitcases}</span>
                  <button
                    type="button"
                    onClick={() => adjustCount("suitcases", 1)}
                    className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Over Capacity Warning Banner */}
            {isOverCapacity && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                <div className="text-amber-400 font-bold text-lg">📞</div>
                <div>
                  <span className="font-bold block text-sm text-amber-200">Custom Group Requirement Needed</span>
                  <span>
                    Your request exceeds our standard minibus capacity (8 Passengers / 8 Suitcases). Please call us directly so we can make special arrangements for multiple vehicles or extra luggage trailers.
                  </span>
                  <div className="mt-2 font-bold text-yellow-400">
                    📞 Call Us: <a href="tel:01206000000" className="underline hover:text-white">01206 000 000</a>
                  </div>
                </div>
              </div>
            )}

            {/* Special Reqs Drawer Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSpecialReqs(!showSpecialReqs)}
                className="text-xs text-yellow-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>+ Add Special Requirements or Notes (Optional)</span>
              </button>

              {showSpecialReqs && (
                <div className="mt-3 p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">Select Extras</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { value: "child_seat", label: "Child Seat" },
                      { value: "booster_seat", label: "Booster Seat" },
                      { value: "wheelchair", label: "Wheelchair Accessible" },
                      { value: "large_luggage", label: "Oversized Baggage" },
                      { value: "pet_friendly", label: "Pet Friendly" },
                    ].map((item) => (
                      <label key={item.value} className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={formData.extras.includes(item.value)}
                          onChange={() => toggleExtra(item.value)}
                          className="accent-yellow-400"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Notes for Driver</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Extra stopover, terminal instructions..."
                      value={formData.driver_notes}
                      onChange={(e) => handleInputChange("driver_notes", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Continue Button */}
            {!isOverCapacity && (
              <button
                type="button"
                onClick={handleNextStep2}
                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Select Vehicle</span>
                <span>→</span>
              </button>
            )}
          </section>
        )}

        {/* STEP 2: CHOOSE VEHICLE */}
        {step === 2 && (
          <section className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
                2. Choose Vehicle Class
              </h2>
              <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded font-semibold">
                Step 2 of 3
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { code: "saloon", name: "Saloon", desc: "Max 4 Passengers • Max 2 Suitcases" },
                { code: "estate", name: "SUV / Estate", desc: "Max 4 Passengers • Max 3 Suitcases" },
                { code: "mpv", name: "MPV", desc: "Max 6 Passengers • Max 4 Suitcases" },
                { code: "minibus", name: "Minibus", desc: "Max 8 Passengers • Max 8 Suitcases" },
              ].map((v) => {
                const available = isVehicleAvailable(v.code);
                if (!available) return null;
                const price = getVehiclePrice(v.code);
                const selected = formData.vehicle_code === v.code;

                return (
                  <label
                    key={v.code}
                    onClick={() => handleInputChange("vehicle_code", v.code)}
                    className="block cursor-pointer"
                  >
                    <div
                      className={`border rounded-xl p-3 flex items-center justify-between transition ${
                        selected
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm text-white">{v.name}</span>
                        <p className="text-[11px] text-slate-400">{v.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-yellow-400">£{price}.00</span>
                        <span className="block text-[9px] text-slate-500">Fixed Fare</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl transition text-sm text-center"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep3}
                className="w-2/3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span>Continue to Passenger Details</span>
                <span>→</span>
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: PASSENGER & PAYMENT */}
        {step === 3 && (
          <section className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m16 11 2 2 4-4" />
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                3. Lead Passenger &amp; Payment
              </h2>
              <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded font-semibold">
                Step 3 of 3
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.passenger_name}
                  onChange={(e) => handleInputChange("passenger_name", e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                />
                {errors.passenger_name && <span className="text-[11px] text-red-400 mt-1 block">Full name is required.</span>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mobile (+44) <span className="text-yellow-400">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="07123456789"
                    value={formData.passenger_phone}
                    onChange={(e) => handleInputChange("passenger_phone", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                  {errors.passenger_phone && <span className="text-[11px] text-red-400 mt-1 block">Phone number is required.</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-yellow-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.passenger_email}
                    onChange={(e) => handleInputChange("passenger_email", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                  {errors.passenger_email && <span className="text-[11px] text-red-400 mt-1 block">Email address is required.</span>}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Payment Method</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { value: "express", icon: "🍎 / 🤖", label: "Apple/Google Pay" },
                  { value: "card", icon: "💳", label: "Card (Stripe)" },
                  { value: "cash", icon: "💵", label: "Cash to Driver" },
                ].map((pm) => (
                  <button
                    key={pm.value}
                    type="button"
                    onClick={() => handleInputChange("payment_method", pm.value)}
                    className={`p-3 text-center rounded-xl border font-bold text-white transition flex flex-col items-center gap-1 ${
                      formData.payment_method === pm.value
                        ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-sm">{pm.icon}</span>
                    <span className="text-[10px]">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary & Price Breakdown */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 mt-4">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Selected Vehicle:</span>
                <span className="text-slate-200 font-semibold uppercase">{formData.vehicle_code}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Estimated Fare:</span>
                <span>£{currentFare}.00</span>
              </div>
              {tollFee > 0 && (
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Airport Toll / Barrier Fee:</span>
                  <span>£{tollFee}.00</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Amount:</span>
                <span className="text-yellow-400 text-lg">£{totalPrice}.00</span>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3.5 rounded-xl transition text-sm text-center"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold py-3.5 rounded-xl transition uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>{loading ? "Processing..." : "Confirm & Pay"}</span>
                </button>
              </div>
            </div>
          </section>
        )}

      </form>

      <MapPickerModal
        open={showMapFor !== null}
        title={showMapFor === "pickup" ? "Pick your pickup location" : "Pick your destination location"}
        initial={
          showMapFor === "pickup"
            ? { lat: formData.pickup_lat, lng: formData.pickup_lng }
            : { lat: formData.destination_lat, lng: formData.destination_lng }
        }
        onClose={() => setShowMapFor(null)}
        onSelect={showMapFor === "pickup" ? handleMapSelect("pickup") : handleMapSelect("destination")}
      />
    </div>
  );
}

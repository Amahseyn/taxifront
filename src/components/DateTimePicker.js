"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./DateTimePicker.module.css";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISO(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function parseTypedTime(raw) {
  const text = (raw || "").trim().toLowerCase().replace(/\s+/g, "");
  if (!text) return null;
  let h = 0;
  let m = 0;
  let isPm = false;
  const mer = text.match(/(am|pm|a|p)$/);
  let cleaned = text;
  if (mer) {
    isPm = mer[1].startsWith("p");
    cleaned = text.slice(0, mer.index);
  }
  const range24 = cleaned.match(/^(\d{1,2})(?::|\.)?(\d{0,2})$/);
  if (range24) {
    h = parseInt(range24[1], 10);
    m = parseInt(range24[2] || "0", 10);
  } else {
    return null;
  }
  if (Number.isNaN(h) || Number.isNaN(m) || h > 23 || m > 59) return null;
  if (isPm && h < 12) h += 12;
  if (!isPm && h === 12) h = 0;
  return `${pad(h)}:${pad(m)}`;
}

function startOfToday() {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

// Build 15-minute time slots 00:00 -> 23:45
function buildTimeSlots() {
  const slots = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}

export default function DateTimePicker({
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateName = "date",
  timeName = "time",
  label = "Date / Time",
}) {
  const [openCal, setOpenCal] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [timeText, setTimeText] = useState("");
  const [viewMonth, setViewMonth] = useState(() => {
    const d = dateValue ? new Date(dateValue) : new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const wrapRef = useRef(null);
  const timeScrollerRef = useRef(null);
  const today = startOfToday();

  // Close popups on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenCal(false);
        setOpenTime(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // When opening the time popup, scroll the active slot into view
  useEffect(() => {
    if (openTime && timeScrollerRef.current) {
      const active = timeScrollerRef.current.querySelector(`.${styles.slotActive}`);
      if (active) active.scrollIntoView({ block: "center" });
    }
  }, [openTime]);

  const slots = buildTimeSlots();

  const selectedDate = dateValue ? new Date(dateValue) : null;

  const firstDay = new Date(viewMonth.y, viewMonth.m, 1).getDay();
  const daysInMonth = new Date(viewMonth.y, viewMonth.m + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    const m = viewMonth.m - 1;
    const y = m < 0 ? viewMonth.y - 1 : viewMonth.y;
    setViewMonth({ y, m: (m + 12) % 12 });
  };
  const nextMonth = () => {
    const m = viewMonth.m + 1;
    const y = m > 11 ? viewMonth.y + 1 : viewMonth.y;
    setViewMonth({ y, m: m % 12 });
  };

  const pickDate = (d) => {
    const iso = toISO(viewMonth.y, viewMonth.m, d);
    onDateChange({ target: { name: dateName, value: iso } });
    setOpenCal(false);
  };

  const displayDate = selectedDate
    ? `${pad(selectedDate.getDate())}/${pad(selectedDate.getMonth() + 1)}/${selectedDate.getFullYear()}`
    : "Select date";

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.triggers}>
        <button
          type="button"
          className={`${styles.trigger} ${openCal ? styles.triggerOpen : ""}`}
          onClick={() => {
            setOpenCal((v) => !v);
            setOpenTime(false);
          }}
          aria-haspopup="dialog"
          aria-expanded={openCal}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className={selectedDate ? styles.triggerText : styles.triggerPlaceholder}>
            {displayDate}
          </span>
          <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <button
          type="button"
          className={`${styles.trigger} ${openTime ? styles.triggerOpen : ""}`}
          onClick={() => {
            setOpenTime((v) => !v);
            setOpenCal(false);
          }}
          aria-haspopup="listbox"
          aria-expanded={openTime}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"></circle>
            <polyline points="12 7 12 12 15 14"></polyline>
          </svg>
          <span className={timeValue ? styles.triggerText : styles.triggerPlaceholder}>
            {timeValue || "Select time"}
          </span>
          <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Calendar popup */}
      {openCal && (
        <div className={styles.calendar} role="dialog" aria-label="Choose date">
          <div className={styles.calHeader}>
            <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span className={styles.calTitle}>{MONTHS[viewMonth.m]} {viewMonth.y}</span>
            <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
          <div className={styles.weekRow}>
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday}>{w}</span>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {cells.map((d, i) => {
              if (d === null) return <span key={`e${i}`} className={styles.emptyDay} />;
              const cellDate = new Date(viewMonth.y, viewMonth.m, d);
              const disabled = cellDate < today;
              const isSelected = selectedDate &&
                selectedDate.getFullYear() === viewMonth.y &&
                selectedDate.getMonth() === viewMonth.m &&
                selectedDate.getDate() === d;
              const isToday = cellDate.getTime() === today.getTime();
              return (
                <button
                  type="button"
                  key={d}
                  disabled={disabled}
                  className={`${styles.day} ${isSelected ? styles.daySelected : ""} ${isToday ? styles.dayToday : ""}`}
                  onClick={() => pickDate(d)}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Time popup */}
      {openTime && (
        <div className={styles.timePopup} role="listbox" aria-label="Choose time">
          <div className={styles.timeInputRow}>
            <input
              type="text"
              className={styles.timeInput}
              inputMode="text"
              placeholder="e.g. 14:30 or 2:30pm"
              value={timeText}
              onChange={(e) => setTimeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const parsed = parseTypedTime(timeText);
                  if (parsed) {
                    onTimeChange({ target: { name: timeName, value: parsed } });
                    setTimeText("");
                    setOpenTime(false);
                  }
                }
              }}
            />
            <button
              type="button"
              className={styles.timeApply}
              onClick={() => {
                const parsed = parseTypedTime(timeText);
                if (parsed) {
                  onTimeChange({ target: { name: timeName, value: parsed } });
                  setTimeText("");
                  setOpenTime(false);
                }
              }}
            >
              Set
            </button>
          </div>
          <div className={styles.timeScroller} ref={timeScrollerRef}>
            {slots.map((slot) => {
              const active = slot === timeValue;
              return (
                <button
                  type="button"
                  key={slot}
                  role="option"
                  aria-selected={active}
                  className={`${styles.slot} ${active ? styles.slotActive : ""}`}
                  onClick={() => {
                    onTimeChange({ target: { name: timeName, value: slot } });
                    setOpenTime(false);
                  }}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

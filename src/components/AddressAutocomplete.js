"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AddressAutocomplete.module.css";

/**
 * AddressAutocomplete
 * A text input with a suggestion dropdown backed by /api/autocomplete.
 *
 * Props:
 *  - value: current input value (controlled)
 *  - onChange: (e) => void  — standard input change handler
 *  - onSelect: (suggestion) => void — called when a suggestion is chosen
 *  - name, placeholder, required, className — passed to the input
 */
export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  name,
  placeholder,
  required,
  className,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const wrapRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const skipFetchRef = useRef(false);
  const latestQueryRef = useRef("");
  const listId = `${name || "addr"}-suggestions`;

  // Fetch suggestions (debounced) whenever the value changes.
  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }
    const query = (value || "").trim();
    latestQueryRef.current = query;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 1) {
      if (abortRef.current) abortRef.current.abort();
      debounceRef.current = setTimeout(() => {
        setSuggestions([]);
        setOpen(false);
        setLoading(false);
      }, 0);
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }

    debounceRef.current = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const res = await fetch("/api/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
          signal: controller.signal,
        });
        const data = await res.json();
        // Ignore responses for stale queries (a newer keystroke has since fired).
        if (latestQueryRef.current !== query) return;
        if (res.ok) {
          setSuggestions(data.suggestions || []);
          setOpen((data.suggestions || []).length > 0);
          setActiveIndex(-1);
        }
      } catch (err) {
        if (err.name !== "AbortError" && latestQueryRef.current === query) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (latestQueryRef.current === query) setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  // Close on outside click.
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const choose = (s) => {
    skipFetchRef.current = true;
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    onSelect && onSelect(s);
  };

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        e.preventDefault();
        choose(suggestions[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <input
        type="text"
        name={name}
        className={className}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
      />
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {open && suggestions.length > 0 && (
        <ul className={styles.list} role="listbox" id={listId}>
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === activeIndex}
              className={`${styles.item} ${i === activeIndex ? styles.itemActive : ""}`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

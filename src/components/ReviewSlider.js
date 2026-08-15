"use client";

import { useState, useEffect, useCallback } from "react";
import styles from "./ReviewSlider.module.css";

const reviews = [
  {
    text: "Great service, easy to book, prompt response. Ash was very polite and helpful during booking process and transfer. Thanks, will use again. Taxi rate is cheapest compared to other companies.",
    author: "Adriana Patriche",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocKhs3HSuIN0L7y2_wCG-mQPrkc_-TSbagV3ctqn0u9Pb6OxS4A=w120-h120-p-rp-mo-br100",
    location: "June 30, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "It was great experience, easy booking through the website and prompt response. Very reliable service, friendly driver and nice car.",
    author: "Esmaeil Gholami",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocKdjephBWtXI3jnmTGvFbfDLwDo2qGj5kAIFb7G7B6pm84fiA=w120-h120-p-rp-mo-br100",
    location: "May 23, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "👌🏻 Excellent service from Colchester Airport Taxi! Ash was our driver, and he was so polite and friendly from start to finish. He drove very safely and helped us with all of our baggage. His car was also very comfortable, which made the journey even better. The service was perfect. highly recommended!",
    author: "Mary .H",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocKalzzzwMCzjn66TPre33Ry7yarHY0yOq43R_L51H0OfhcYvQ=w120-h120-p-rp-mo-br100",
    location: "May 23, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "I had a booking with the company and it was fast and reliable. I reccomend to everyone",
    author: "Claudiu Sandra",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocJGJJpwYK4YDRStfv4fHcj5BEYHBDufYmD5OicZgwBrXOxYDA=w120-h120-p-rp-mo-br100",
    location: "May 14, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "Very nice and clean car and friendly driver",
    author: "Firat Emek",
    profile: "https://lh3.googleusercontent.com/a-/ALV-UjWuksh5O9huv8Hj_NpfWwCkM_L7W146vJ3uYUlGk2xuOvc0bd4=w120-h120-p-rp-mo-br100",
    location: "May 14, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "Excellent service received! Ash picked up my daughter at STN airport and took her safely home. Outstanding communication ensured a great peace of mind and a smooth pick at the airport. Highly recommended company!",
    author: "Tihamér Gyurkovits",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocJAHXU_ovqY5e5z1W6L_otv_1IlIppdR1cwppN9INdPcpNSJg=w120-h120-p-rp-mo-br100",
    location: "April 5, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "Nice and clean car , friendly driver",
    author: "Dr Adaugo Nwauwa",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocJqCr-5lZL_5faahBWRMz_k3rtYrlALyt_OhOdAXq_vqS2Gvw=w120-h120-p-rp-mo-br100",
    location: "February 23, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "Great service",
    author: "Nartay Tleuberdiyev",
    profile: "https://lh3.googleusercontent.com/a/ACg8ocJqCr-5lZL_5faahBWRMz_k3rtYrlALyt_OhOdAXq_vqS2Gvw=w120-h120-p-rp-mo-br100",
    location: "January 15, 2026",
    rating: 5,
    source: "Google",
  },
  {
    text: "Ash collected me from the airport. He was on time, polite and his car immaculate.  Highly recommend.",
    author: "James Gomm",
    profile: "https://lh3.googleusercontent.com/a-/ALV-UjVGi5IqHhzPU_XcYNp6bp_yIIm38mClGqoQISVUvBwlj-j9XeGulQ=w120-h120-p-rp-mo-br100",
    location: "October 30, 2025",
    rating: 5,
    source: "Google",
  },
  {
    text: "Excellent ride! The driver was punctual and friendly, and the car was comfortable and clean. The drive felt safe and smooth. Will book again!",
    author: "ali agahi",
    profile: "https://lh3.googleusercontent.com/a-/ALV-UjUmRymoN_nwzQjn4io-b4GXIH6RKNdP6kdD1ss5C5SHx4tMf9pw=w120-h120-p-rp-mo-br100",
    location: "October 30, 2025",
    rating: 5,
    source: "Google",
  },
];

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFB200" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function ReviewSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imgError, setImgError] = useState({});

  const onImgError = (i) => setImgError((prev) => ({ ...prev, [i]: true }));

  const goTo = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 250);
  }, [isAnimating]);

  const prev = () => goTo((current - 1 + reviews.length) % reviews.length);
  const next = useCallback(() => goTo((current + 1) % reviews.length), [goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  const review = reviews[current];

  return (
    <div
      className={styles.wrapper}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.overallRating}>
          <div className={styles.ratingScore}>5.0</div>
          <div className={styles.ratingMeta}>
            <div className={styles.starsRow}>
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <div className={styles.ratingLabel}>Based on 10 Google Reviews</div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.googleBadge}>
            <GoogleIcon />
            <span>Google Reviews</span>
          </div>
          <a
            className={styles.writeReview}
            href="https://www.google.com/maps/place//@51.857542,0.9020015,17z/data=!3m1!4b1!4m3!3m2!1s0x8bf9033a50837895:0xb3d777a306f8a569!12e1?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
          >
            Write a review
          </a>
        </div>
      </div>

      {/* Slide */}
      <div className={`${styles.slide} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
        <div className={styles.postedOn}>
          <GoogleIcon />
          <span>Posted on Google</span>
        </div>
        <div className={styles.starsRow}>
          {[...Array(review.rating)].map((_, i) => <StarIcon key={i} />)}
        </div>
        <blockquote className={styles.quote}>
          &ldquo;{review.text}&rdquo;
        </blockquote>
        <div className={styles.authorBlock}>
          {review.profile && !imgError[current] ? (
            <img
              src={review.profile}
              alt={review.author}
              className={styles.avatarImg}
              onError={() => onImgError(current)}
            />
          ) : (
            <div className={styles.avatar}>
              {review.author.charAt(0)}
            </div>
          )}
          <div>
            <div className={styles.authorName}>{review.author}</div>
            <div className={styles.authorLocation}>{review.location}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.controlBtn} onClick={prev} aria-label="Previous review">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className={styles.dots}>
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Review ${i + 1}`}
            />
          ))}
        </div>
        <button className={styles.controlBtn} onClick={next} aria-label="Next review">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

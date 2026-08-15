"use client";

import { useRef, useState, useEffect } from "react";
import styles from "./Gallery.module.css";

const images = [
  {
    thumb: "/IMG_2773-scaled-600x400.jpeg",
    full: "/gallery1.jpg", // We saw public/gallery1.jpg and other gallery images in public dir, let's keep the full path from the user's snippet, fallback to the thumb if needed, or use the wordpress scaled full urls or local /gallery*.jpg. Let's use the local thumb URL or full URL if they match. Wait! The snippet has "https://colchester-airport-taxi.co.uk/wp-content/uploads/..." which we can use for full size, or fallback to the same thumb. Let's use the exact full URLs for high quality.
    fullUrl: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2026/07/IMG_2773-scaled.jpeg",
    alt: "Minibus at LHR T3",
  },
  {
    thumb: "/IMG_2513-scaled-600x400.jpeg",
    fullUrl: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2026/05/IMG_2513-scaled.jpeg",
    alt: "Tesla at LHR T3",
  },
  {
    thumb: "/IMG_2807-scaled-600x400.jpeg",
    fullUrl: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2026/07/IMG_2807-scaled.jpeg",
    alt: "Tesla and VW",
  },
  {
    thumb: "/IMG_2799-scaled-600x400.jpeg",
    fullUrl: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2026/07/IMG_2799-scaled.jpeg",
    alt: "VW Inside",
  },
  {
    thumb: "/VW-at-Heathrow-T4-scaled-600x400.jpg",
    fullUrl: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2025/12/VW-at-Heathrow-T4-scaled.jpg",
    alt: "VW at Heathrow T4",
  },
  {
    thumb: "/IMG_2781-scaled-600x400.jpeg",
    fullUrl: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2026/07/IMG_2781-scaled.jpeg",
    alt: "Tesla Boot",
  },
  {
    thumb: "/IMG_1468-scaled-600x400.jpeg",
    fullUrl: "https://colchester-airport-taxi.co.uk/wp-content/uploads/2026/01/IMG_1468-scaled.jpeg",
    alt: "Tesla at Gatwick Airport",
  },
];

export default function Gallery() {
  const viewportRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  // Update active index on scroll
  const handleScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    
    const scrollLeft = viewport.scrollLeft;
    const width = viewport.clientWidth;
    
    // In desktop, 2 columns are shown. In mobile, 1 column is shown.
    // Calculate the item that is closest to the left edge
    const itemWidth = viewport.scrollWidth / images.length;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveIndex(Math.min(Math.max(0, index), images.length - 1));
  };

  // Autoplay (reference: 5s interval)
  useEffect(() => {
    if (isPaused) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    const timer = setInterval(() => {
      const children = viewport.firstElementChild?.children;
      if (!children || children.length === 0) return;
      const next = (activeIndex + 1) % images.length;
      const cell = children[next];
      if (cell) {
        viewport.scrollTo({
          left: cell.offsetLeft - viewport.offsetLeft,
          behavior: "smooth",
        });
      }
      setActiveIndex(next);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, isPaused]);

  const goTo = (index) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    
    const children = viewport.firstElementChild.children;
    if (children && children[index]) {
      const cell = children[index];
      viewport.scrollTo({
        left: cell.offsetLeft - viewport.offsetLeft,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const openLightbox = (index, e) => {
    e.preventDefault();
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextSlide(e);
      if (e.key === "ArrowLeft") prevSlide(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  return (
    <div
      className={styles.carouselContainer}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={styles.carousel}>
        <div className={styles.viewport} ref={viewportRef} onScroll={handleScroll}>
          <div className={styles.track}>
            {images.map((img, i) => (
              <div key={`gallery-${i}`} className={styles.cell}>
                <a
                  className={styles.slideLink}
                  href={img.fullUrl}
                  onClick={(e) => openLightbox(i, e)}
                >
                  <img
                    src={img.thumb}
                    alt={img.alt}
                    title={img.alt}
                    className={styles.img}
                  />
                  <div className={styles.overlay}>
                    <svg className={styles.zoomIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="11" y1="8" x2="11" y2="14"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
        
        <ol className={styles.dots}>
          {images.map((_, i) => (
            <li
              key={`dot-${i}`}
              className={`${styles.dot} ${activeIndex === i ? styles.selected : ""}`}
              aria-label={`Page dot ${i + 1}`}
              onClick={() => goTo(i)}
            ></li>
          ))}
        </ol>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button className={styles.closeBtn} onClick={closeLightbox}>&times;</button>
          
          <button className={`${styles.navBtn} ${styles.prev}`} onClick={prevSlide}>
            &#10094;
          </button>
          
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={images[lightboxIndex].fullUrl}
              alt={images[lightboxIndex].alt}
              className={styles.lightboxImg}
            />
            <div className={styles.caption}>
              {images[lightboxIndex].alt}
            </div>
          </div>

          <button className={`${styles.navBtn} ${styles.next}`} onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      )}
    </div>
  );
}

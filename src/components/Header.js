"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Brand Logo - comes first (left side) */}
        <Link href="/" className={styles.logo}>
          <img src="/site-logo.png" alt="Colchester Airport Taxi" className={styles.logoImg} />
        </Link>

        {/* Desktop Navigation - comes after logo (right side) */}
        <nav className={styles.nav} aria-label="Main Menu">
          <ul className={styles.menu}>
            <li className={styles.menuItem}>
              <Link href="/#faq" className={styles.navLink}>
                FAQ
              </Link>
            </li>
            <li className={`${styles.menuItem} ${styles.menuItemHasIcon}`}>
              <Link href="/booking" className={styles.bookBtn}>
                <i className="fa fa-taxi" aria-hidden="true"></i>
                <span>Book a ride</span>
              </Link>
            </li>
            <li id="social-in-menu" className={`${styles.menuItem} ${styles.socialGroup}`}>
              <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/profile.php?id=61585145488267" aria-label="facebook">
                <span className="screen-reader-text">facebook</span>
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://share.google/oMlYN6kr3WEyp0Uzd" aria-label="google-plus">
                <span className="screen-reader-text">google-plus</span>
                <i className="fa fa-google" aria-hidden="true"></i>
              </a>
              <a href="tel:01206701051" aria-label="phone">
                <span className="screen-reader-text">phone</span>
                <i className="fa fa-phone" aria-hidden="true"></i>
              </a>
              <a href="mailto:info@colchester-airport-taxi.co.uk" aria-label="email">
                <span className="screen-reader-text">email</span>
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Navigation Menu" aria-expanded={isOpen}>
          <span className="screen-reader-text">Menu</span>
          <span className={styles.linesButton} aria-hidden="true">
            <span className={styles.lines}></span>
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/#faq" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
            FAQ
          </Link>
          <Link href="/booking" className={styles.mobileBookBtn} onClick={() => setIsOpen(false)}>
            <i className="fa fa-taxi" aria-hidden="true"></i>
            <span>Book a ride</span>
          </Link>
          <div className={styles.mobileSocials}>
            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/profile.php?id=61585145488267" aria-label="facebook">
              <span className="screen-reader-text">facebook</span>
              <i className="fa fa-facebook" aria-hidden="true"></i>
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://share.google/oMlYN6kr3WEyp0Uzd" aria-label="google-plus">
              <span className="screen-reader-text">google-plus</span>
              <i className="fa fa-google" aria-hidden="true"></i>
            </a>
            <a href="tel:01206701051" aria-label="phone">
              <span className="screen-reader-text">phone</span>
              <i className="fa fa-phone" aria-hidden="true"></i>
            </a>
            <a href="mailto:info@colchester-airport-taxi.co.uk" aria-label="email">
              <span className="screen-reader-text">email</span>
              <i className="fa fa-envelope" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

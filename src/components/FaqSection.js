"use client";

import { useState } from "react";
import styles from "./FaqSection.module.css";

function HowToBookAnswer() {
  return (
    <div>
      <p><strong>How to Book Your Airport Transfer</strong></p>
      <p>Booking your Colchester airport taxi is quick and easy:</p>
      <p><strong>1. Book by Phone</strong><br />
        Call us on <a href="tel:01206701051"><strong>01206 701 051</strong></a> to make a booking or ask any questions about your journey.</p>
      <p><strong>2. Book Online</strong><br />
        Complete our online booking form here:<br />
        <a href="https://colchester-airport-taxi.co.uk/#booking-form">colchester-airport-taxi.co.uk/#booking-form</a></p>
      <p>Once we receive your booking request, we will respond as promptly as possible to confirm your booking or request any further information if needed.</p>
      <p>As your travel date approaches, your dedicated driver will contact you via text or WhatsApp to introduce themselves and share your vehicle details.</p>
      <p>Reliable, straightforward, and stress-free airport transfers.</p>
    </div>
  );
}

export default function FaqSection() {
  const faqs = [
    {
      question: "Can I pay by card or cash?",
      answer: <p>You can <strong>pay by card, cash, or contactless</strong>. We accept <strong>American Express,</strong> <strong>Visa, Mastercard, Apple Pay, and Google Pay</strong>, making it easy and convenient to pay your fare however you prefer.</p>
    },
    {
      question: "How early should I book?",
      answer: <p>We recommend booking <strong>at least 24 hours in advance</strong> to ensure availability, especially for early-morning or long-distance trips. However, if you need a last-minute booking, please <strong>call us on <a href="tel:+441206701701">01206 701 701</a></strong>, and we&rsquo;ll do our best to accommodate you.</p>
    },
    {
      question: "What if my flight is delayed?",
      answer: <p>No need to worry, we ask for the flight number and <strong>track it</strong>. If your flight is delayed, we&rsquo;ll automatically adjust your pick-up time so your driver arrives when you do. There are <strong>no extra charges</strong> for reasonable delays caused by the airline.</p>
    },
    {
      question: "Can I get an invoice?",
      answer: <p>We can send your <strong>invoice or receipt by email or text message</strong> after your journey. Please note that, for environmental reasons, we <strong>do not offer printed paper copies</strong>; our digital invoices include all the details you&rsquo;ll need for personal or business records.</p>
    },
    {
      question: "How can I book?",
      answer: <HowToBookAnswer />
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {faqs.map((faq, i) => {
        const isActive = activeIndex === i;
        return (
          <div key={`faq-${i}`} className={styles.faqItem}>
            <button 
              className={styles.questionButton} 
              onClick={() => toggleFaq(i)}
              aria-expanded={isActive}
            >
              <span>{faq.question}</span>
              <svg 
                className={`${styles.icon} ${isActive ? styles.iconActive : ""}`} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div className={`${styles.answer} ${isActive ? styles.answerActive : ""}`}>
              {faq.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
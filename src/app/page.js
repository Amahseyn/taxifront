import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FleetShowcase from "@/components/FleetShowcase";
import PricingCalculator from "@/components/PricingCalculator";
import ReviewSlider from "@/components/ReviewSlider";
import FaqSection from "@/components/FaqSection";
import ServicesCarousel from "@/components/ServicesCarousel";
import AreasMap from "@/components/AreasMap";
import Gallery from "@/components/Gallery";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroGradient} aria-hidden="true"></div>
          <div className={styles.heroInner}>
            <div className="container">
              <div className={styles.heroGrid}>
                <div className={styles.heroImgCol}>
                  <div className={styles.heroImgMask}>
                    <img src="/hero.jpg" alt="Tesla and Vw Hero v2" className={styles.heroImg} />
                  </div>
                </div>
                <div className={styles.heroTextCol}>
                  <h1 className={styles.heroTitle}>
                    Travel in comfort with <strong>Colchester Airport Taxi,</strong> your trusted local transfer service.
                  </h1>
                  <p className={styles.heroSubtitle}>
                    Based in <strong>Colchester</strong>, we proudly serve customers across <strong>Essex and surrounding areas</strong>, providing smooth, reliable transfers to <strong>all UK airports, seaports, and cruise terminals</strong>. Whether you're heading out or coming home, we'll make sure you arrive safely and on time. <strong>Clean, comfortable vehicles</strong> for every journey.
                  </p>
                  <a href="/booking" className={styles.heroBtn}>
                    <span>Book a ride</span>
                    <i className="fa fa-taxi" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.shapeDivider} aria-hidden="true">
            <svg className={styles.shapeDividerSvg} viewBox="0 0 1000 300" preserveAspectRatio="none">
              <path d="M 1000 299 l 2 -279 c -155 -36 -310 135 -415 164 c -102.64 28.35 -149 -32 -232 -31 c -80 1 -142 53 -229 80 c -65.54 20.34 -101 15 -126 11.61 v 54.39 z"></path>
              <path d="M 1000 286 l 2 -252 c -157 -43 -302 144 -405 178 c -101.11 33.38 -159 -47 -242 -46 c -80 1 -145.09 54.07 -229 87 c -65.21 25.59 -104.07 16.72 -126 10.61 v 22.39 z"></path>
              <path d="M 1000 300 l 1 -230.29 c -217 -12.71 -300.47 129.15 -404 156.29 c -103 27 -174 -30 -257 -29 c -80 1 -130.09 37.07 -214 70 c -61.23 24 -108 15.61 -126 10.61 v 22.39 z"></path>
            </svg>
          </div>
        </section>

        {/* Services We Offer Section */}
        <section id="services" className={styles.servicesSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Services We Offer</h2>
            </div>
            <ServicesCarousel />
          </div>
        </section>

        {/* Vehicles Section */}
        <section id="vehicles" className={styles.vehiclesSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Vehicles</h2>
            </div>
            <FleetShowcase />
          </div>
        </section>

        {/* Areas We Cover Section */}
        <section id="areas" className={styles.areasSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Areas We Cover</h2>
            </div>
            <AreasMap />
          </div>
        </section>

        {/* Airport Price Guide + FAQ */}
        <section id="faq" className={styles.faqBookingSection}>
          <div className="container">
            <div className={styles.faqCol}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Airport Price Guide</h2>
              </div>
              <PricingCalculator />
              <div className={styles.sectionHeader} style={{ marginTop: "48px" }}>
                <h3 className={styles.faqHeading}>Frequently Asked Questions</h3>
              </div>
              <FaqSection />
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-choose" className={styles.whySection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                Why Choose Colchester Airport Taxi Over <em>Ride-Sharing</em> Apps?
              </h2>
              <p className={styles.sectionSubtitle}>While ride-sharing apps like Uber focus on quick, on-demand trips, Colchester Airport Taxi prioritises stress-free airport transfers, where reliability and meeting your needs are key.</p>
            </div>
            <div className={styles.whyGrid}>
              <div className={styles.whyCard}>
                <div className={styles.whyNum}>1</div>
                <h3 className={styles.whyTitle}>Fixed Airport Prices - No Surges</h3>
                <p className={styles.whyDesc}>With ride-sharing apps, prices change constantly due to demand, traffic and other factors. We offer fixed, transparent pricing for all airport journeys; the price you&#39;re quoted is the price you pay.</p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyNum}>2</div>
                <h3 className={styles.whyTitle}>Pre-Booked &amp; Guaranteed Pickup</h3>
                <p className={styles.whyDesc}>Ride-sharing app drivers can cancel at the last minute.<br />We pre-schedule your journey, track your flight, and ensure your vehicle is ready, even if your flight is early or delayed.</p>
              </div>
              <div className={styles.whyCard}>
                <div className={styles.whyNum}>3</div>
                <h3 className={styles.whyTitle}>Professional Licensed Drivers</h3>
                <p className={styles.whyDesc}>Our drivers are: Fully licensed by the local council | DBS-checked | Experienced in airport transfers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className={styles.gallerySection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Gallery</h2>
            </div>
            <Gallery />
          </div>
        </section>

        {/* Reviews Section */}
        <section className={styles.reviewsSection}>
          <div className="container">
            <ReviewSlider />
          </div>
        </section>

        {/* Payment Methods Section */}
        <section className={styles.paymentsSection}>
          <div className="container">
            <p className={styles.paymentsTitle}>We Accept</p>
            <div className={styles.paymentsGrid}>
              <img src="/applepay.png" alt="Apple Pay" className={styles.paymentIcon} />
              <img src="/googlepay.png" alt="Google Pay" className={styles.paymentIcon} />
              <img src="/mastercard.png" alt="Mastercard" className={styles.paymentIcon} />
              <img src="/visa.png" alt="Visa" className={styles.paymentIcon} />
              <img src="/contactless.png" alt="Contactless" className={styles.paymentIcon} />
              <img src="/amex.png" alt="American Express" className={styles.paymentIcon} />
            </div>
          </div>
        </section>

        <WhatsAppButton />
      </main>
      <Footer />
    </div>
  );
}


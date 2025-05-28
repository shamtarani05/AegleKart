// StoreLocator.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/storelocator.module.css';

const StoreLocator = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log('Email submitted:', email);
    setSubmitted(true);
    setEmail('');
    
    // Reset the submitted state after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <div className={styles.comingSoonSection}>
          <div className={styles.contentWrapper}>
            <h1 className={styles.title}>Store Locator</h1>
            <div className={styles.badge}>Coming Soon</div>
            
            <p className={styles.description}>
              We're working hard to bring you a convenient way to find our stores near you.
              Our interactive store locator will help you discover our locations, view store hours,
              and get directions to your nearest store.
            </p>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>📍</div>
                <h3>Find Nearby Stores</h3>
                <p>Easily locate our stores closest to your current location</p>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🕒</div>
                <h3>Store Hours</h3>
                <p>View opening hours and plan your visit accordingly</p>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🗺️</div>
                <h3>Get Directions</h3>
                <p>Get turn-by-turn directions to your chosen store</p>
              </div>
            </div>
            
            <div className={styles.notificationForm}>
              <h2>Get Notified When It's Live</h2>
              <p>Be the first to know when our store locator launches</p>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className={styles.emailInput}
                  />
                  <button type="submit" className={styles.submitButton}>
                    Notify Me
                  </button>
                </div>
                
                {submitted && (
                  <div className={styles.successMessage}>
                    Thank you! We'll notify you when our store locator launches.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapOverlay}>
            <div className={styles.mapIcon}>🗺️</div>
            <h2>Interactive Map Coming Soon</h2>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoreLocator;
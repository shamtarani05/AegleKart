import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/notfound.module.css';

const NotFound = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <div className={styles.errorCode}>404</div>
            <h1 className={styles.title}>Page Not Found</h1>
            <p className={styles.description}>
              We couldn't find the page you were looking for. It might have been moved, 
              deleted, or perhaps never existed.
            </p>
            <div className={styles.actions}>
              <a href="/" className={styles.primaryButton}>
                Return to Home
              </a>
              <a href="/contact" className={styles.secondaryButton}>
                Contact Support
              </a>
            </div>
            <div className={styles.illustration}>
              <div className={styles.plantIllustration}>🌱</div>
              <div className={styles.searchIllustration}>🔍</div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
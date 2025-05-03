import React from 'react';
import styles from '../styles/footer.module.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <div className={styles.footerBrand}>
            <span className={styles.logoText}>Aegle</span>
            <span className={styles.logoTextAccent}>Kart</span>
            <p className={styles.tagline}>Wellness at your doorstep</p>
            <p className={styles.description}>Your trusted pharmacy platform delivering nationwide quality healthcare products.</p>
            <div className={styles.socialIcons}>
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://youtube.com" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Categories</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/medicines">Medicines</Link></li>
            <li><Link to="/healthcare">Healthcare</Link></li>
            <li><Link to="/baby-mother">Baby & Mother</Link></li>
            <li><Link to="/nutrition">Nutrition</Link></li>
            <li><Link to="/personal-care">Personal Care</Link></li>
            <li><Link to="/devices">Devices</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Quick Links</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/stores">Store Locator</Link></li>
            <li><Link to="/blog">Health Blog</Link></li>
            <li><Link to="/careers">Careers</Link></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Customer Support</h3>
          <ul className={styles.footerLinks}>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/returns">Return Policy</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/feedback">Send Feedback</Link></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className={styles.contactInfo}>
          <p><strong>Contact:</strong> +92 313-3502069 AEGLEKART | <a href="mailto:support@aeglekart.com">support@aeglekart.com</a></p>
        </div>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} AegleKart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
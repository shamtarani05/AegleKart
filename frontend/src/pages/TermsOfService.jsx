import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Shield, Book, Scale, Clock, FileText } from 'lucide-react';
import styles from '../styles/termsOfservice.module.css';

const TermsOfService = () => {
  // Function to scroll to specific section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Terms of Service</h1>
            <p className={styles.heroSubtitle}>Please read these terms carefully before using our services</p>
          </div>
        </section>

        {/* Terms Content */}
        <section className={styles.termsSection}>
          <div className={styles.termsContainer}>
            <div className={styles.termsLayout}>
              {/* Table of Contents Sidebar */}
              <div className={styles.tocSidebar}>
                <div className={styles.tocCard}>
                  <h2 className={styles.tocTitle}>
                    <FileText size={18} />
                    <span>Contents</span>
                  </h2>
                  
                  <ul className={styles.tocList}>
                    <li>
                      <button onClick={() => scrollToSection('introduction')}>
                        1. Introduction
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('accounts')}>
                        2. Accounts
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('purchases')}>
                        3. Purchases & Payments
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('shipping')}>
                        4. Shipping & Delivery
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('returns')}>
                        5. Returns & Refunds
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('privacy')}>
                        6. Privacy & Data
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('disclaimers')}>
                        7. Disclaimers
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('changes')}>
                        8. Changes to Terms
                      </button>
                    </li>
                    <li>
                      <button onClick={() => scrollToSection('contact')}>
                        9. Contact Information
                      </button>
                    </li>
                  </ul>
                  
                  <div className={styles.lastUpdated}>
                    <Clock size={16} />
                    <span>Last Updated: May 1, 2025</span>
                  </div>
                </div>
              </div>

              {/* Terms Content */}
              <div className={styles.termsContent}>
                <div className={styles.termsCard}>
                  <section id="introduction" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>1. Introduction</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        Welcome to our online store. These Terms of Service ("Terms") govern your use of our website, products, and services. By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the website.
                      </p>
                      <p>
                        Our products are primarily herbal and Ayurvedic supplements intended for wellness purposes. We strive to provide accurate information about our products, but we encourage you to consult with healthcare professionals before using any supplements or health products.
                      </p>
                    </div>
                  </section>

                  <section id="accounts" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>2. Accounts</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our website.
                      </p>
                      <p>
                        You are responsible for safeguarding the password that you use to access our website and for any activities or actions under your password. We encourage you to use passwords that are strong and unique to your account with us.
                      </p>
                      <p>
                        You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                      </p>
                    </div>
                  </section>

                  <section id="purchases" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>3. Purchases & Payments</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        All products are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice.
                      </p>
                      <p>
                        We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address.
                      </p>
                      <p>
                        We process payments through secure third-party payment processors. We do not store your full credit card information on our servers. By providing your payment information, you agree to pay all charges at the prices listed for your purchases.
                      </p>
                      <p>
                        Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in US Dollars.
                      </p>
                    </div>
                  </section>

                  <section id="shipping" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>4. Shipping & Delivery</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        We ship to addresses within the United States and to select international destinations. Shipping times are estimates and not guaranteed. We are not responsible for shipping delays caused by customs, weather, or other factors outside our control.
                      </p>
                      <p>
                        Standard shipping is free for orders over $50 within the continental United States. Additional shipping fees apply for express shipping options and international shipments.
                      </p>
                      <p>
                        You will receive a shipping confirmation email with tracking information when your order ships. It is your responsibility to provide accurate shipping information.
                      </p>
                    </div>
                  </section>

                  <section id="returns" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>5. Returns & Refunds</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        We offer a 30-day satisfaction guarantee for most products. If you are not completely satisfied with your purchase, you may return it within 30 days of receipt for a full refund of the purchase price, minus shipping costs.
                      </p>
                      <p>
                        To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging with all seals intact. Certain products, particularly those that affect health and hygiene, cannot be returned once opened.
                      </p>
                      <p>
                        To initiate a return, please contact our customer service team for a return merchandise authorization (RMA) number. Items returned without an RMA number may not be eligible for refund.
                      </p>
                      <p>
                        Refunds will be issued to the original payment method used for the purchase. Please allow 10-14 business days for the refund to be processed after we receive your returned item.
                      </p>
                    </div>
                  </section>

                  <section id="privacy" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>6. Privacy & Data</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        Your privacy is important to us. Our Privacy Policy, which is incorporated into these Terms by reference, explains how we collect, use, and protect the personal information you provide to us.
                      </p>
                      <p>
                        By using our website, you consent to our collection and use of personal information as described in our Privacy Policy. We will not sell your personal information to third parties.
                      </p>
                      <p>
                        We use cookies and similar technologies to enhance your experience on our website. You can manage your cookie preferences through your browser settings.
                      </p>
                    </div>
                  </section>

                  <section id="disclaimers" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>7. Disclaimers</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        Our products are not intended to diagnose, treat, cure, or prevent any disease. The information provided on our website is for educational purposes only and is not a substitute for professional medical advice.
                      </p>
                      <p>
                        We make no warranties or representations about the accuracy or completeness of the content on this site. All materials on this site are provided "as is" without warranty of any kind, either express or implied.
                      </p>
                      <p>
                        We do not guarantee, represent, or warrant that your use of our website will be uninterrupted, timely, secure, or error-free. We do not warrant that the results that may be obtained from the use of the website will be accurate or reliable.
                      </p>
                      <p>
                        In no case shall our company, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers, or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the services or any products procured using the service, or for any other claim related in any way to your use of the service or any product.
                      </p>
                    </div>
                  </section>

                  <section id="changes" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>8. Changes to Terms</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        We reserve the right to update, change, or replace any part of these Terms by posting updates and changes to our website. It is your responsibility to check our website periodically for changes.
                      </p>
                      <p>
                        Your continued use of or access to our website following the posting of any changes to these Terms constitutes acceptance of those changes.
                      </p>
                    </div>
                  </section>

                  <section id="contact" className={styles.termsSection}>
                    <h2 className={styles.sectionTitle}>9. Contact Information</h2>
                    <div className={styles.sectionContent}>
                      <p>
                        Questions about the Terms of Service should be sent to us at legal@herbalnature.com or by mail to:
                      </p>
                      <address className={styles.contactAddress}>
                        Herbal Nature Wellness<br />
                        Legal Department<br />
                        123 Green Avenue<br />
                        Portland, OR 97201<br />
                        United States
                      </address>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Shield size={24} />
              </div>
              <h3>Secure & Private</h3>
              <p>Your data is always protected</p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Book size={24} />
              </div>
              <h3>Transparent Policies</h3>
              <p>Clear terms for all customers</p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Scale size={24} />
              </div>
              <h3>Fair Practices</h3>
              <p>Committed to ethical business</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
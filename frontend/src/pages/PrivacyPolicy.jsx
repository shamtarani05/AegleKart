import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/policy.module.css';
import { Shield, Eye, FileText, Lock } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Privacy Policy</h1>
            <p className={styles.heroSubtitle}>How we protect and handle your personal information</p>
          </div>
        </section>

        {/* Policy Content */}
        <section className={styles.policySection}>
          <div className={styles.policyContainer}>
            <div className={styles.policyIntro}>
              <p>
                At Herbal Remedies, we are committed to protecting your privacy. This Privacy Policy explains how 
                we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
                Please read this policy carefully to understand our practices regarding your personal data.
              </p>
            </div>

            {/* Policy highlights */}
            <div className={styles.highlightsContainer}>
              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <Shield size={28} />
                </div>
                <h3>Data Protection</h3>
                <p>Your information is securely stored</p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <Eye size={28} />
                </div>
                <h3>Transparency</h3>
                <p>Clear information on data usage</p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <FileText size={28} />
                </div>
                <h3>Your Rights</h3>
                <p>Access and control your data</p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <Lock size={28} />
                </div>
                <h3>Security</h3>
                <p>Advanced encryption technology</p>
              </div>
            </div>

            {/* Detailed sections */}
            <div className={styles.policyContent}>
              <div className={styles.policySection}>
                <h2>Information We Collect</h2>
                <p>
                  We collect personal information that you provide to us when registering on our website, placing an order, 
                  subscribing to our newsletter, responding to a survey, filling out a form, or engaging with other features 
                  of our site.
                </p>
                <p>
                  The personal information we collect may include:
                </p>
                <ul className={styles.policyList}>
                  <li>Name, email address, mailing address, phone number</li>
                  <li>Billing information and payment details</li>
                  <li>Account preferences and health interests</li>
                  <li>Order history and product preferences</li>
                  <li>Any other information you choose to provide</li>
                </ul>
                <p>
                  We also automatically collect certain information about your device, including information about your web 
                  browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, 
                  as you browse the site, we collect information about the individual web pages that you view, what websites 
                  or search terms referred you to our site, and information about how you interact with the site.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>How We Use Your Information</h2>
                <p>
                  We use the information we collect to:
                </p>
                <ul className={styles.policyList}>
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders, products, services, and promotions</li>
                  <li>Provide customer support and respond to your inquiries</li>
                  <li>Improve and optimize our website and product offerings</li>
                  <li>Detect, prevent, and address technical issues and fraudulent activities</li>
                  <li>Comply with legal obligations</li>
                  <li>Send periodic emails regarding your orders or other products and services (if you have opted in)</li>
                </ul>
              </div>

              <div className={styles.policySection}>
                <h2>Information Sharing and Disclosure</h2>
                <p>
                  We may share your personal information in the following situations:
                </p>
                <ul className={styles.policyList}>
                  <li>
                    <strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors, 
                    service providers, contractors, or agents who perform services for us or on our behalf.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> We may share or transfer your information in connection with, or 
                    during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a 
                    portion of our business to another company.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> We may disclose your information where we are legally required to 
                    do so in order to comply with applicable law, governmental requests, judicial proceedings, court orders, 
                    or legal processes.
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with 
                    your consent.
                  </li>
                </ul>
                <p>
                  We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar tracking technologies to track activity on our site and hold certain information. 
                  Cookies are files with a small amount of data which may include an anonymous unique identifier. 
                </p>
                <p>
                  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
                  if you do not accept cookies, you may not be able to use some portions of our site.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Data Security</h2>
                <p>
                  We have implemented appropriate technical and organizational security measures designed to protect the 
                  security of any personal information we process. However, please also remember that we cannot guarantee 
                  that the internet itself is 100% secure.
                </p>
                <p>
                  We use secure, encrypted connections (SSL/TLS) on all pages where personal information is required. 
                  To protect your personal information, we take reasonable precautions and follow industry best practices 
                  to make sure it is not inappropriately lost, misused, accessed, disclosed, altered, or destroyed.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className={styles.policyList}>
                  <li>The right to access the personal information we have about you</li>
                  <li>The right to rectify or update your personal information</li>
                  <li>The right to erase or delete your personal information (in certain circumstances)</li>
                  <li>The right to restrict processing of your personal information</li>
                  <li>The right to data portability</li>
                  <li>The right to object to processing of your personal information</li>
                  <li>The right to opt-out of marketing communications</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the details provided at the end of this policy.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Children's Privacy</h2>
                <p>
                  Our site is not intended for children under 16 years of age. We do not knowingly collect personal 
                  information from children under 16. If you are a parent or guardian and you are aware that your child 
                  has provided us with personal information, please contact us so that we can take necessary actions.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Changes to This Privacy Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the 
                  new Privacy Policy on this page and updating the "Last Updated" date. We will also notify you through 
                  a prominent notice on our website prior to the changes becoming effective.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy 
                  Policy are effective when they are posted on this page.
                </p>
              </div>
            </div>

            <div className={styles.policyUpdated}>
              <p>Last Updated: April 25, 2025</p>
            </div>

            <div className={styles.policyContact}>
              <h3>Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <address className={styles.contactAddress}>
                <p>Herbal Remedies, Inc.</p>
                <p>123 Natural Way, Wellness Valley, CA 90210</p>
                <p>Email: <a href="mailto:privacy@herbalremedies.com">privacy@herbalremedies.com</a></p>
                <p>Phone: <a href="tel:+18005551234">1-800-555-1234</a></p>
              </address>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
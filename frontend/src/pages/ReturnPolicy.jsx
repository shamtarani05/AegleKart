import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/policy.module.css';
import { RefreshCw, Check, PackageX, Banknote } from 'lucide-react';

const ReturnPolicy = () => {
  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Return Policy</h1>
            <p className={styles.heroSubtitle}>Our commitment to your satisfaction</p>
          </div>
        </section>

        {/* Policy Content */}
        <section className={styles.policySection}>
          <div className={styles.policyContainer}>
            <div className={styles.policyIntro}>
              <p>
                At Herbal Remedies, we stand behind the quality of our products and want you to be completely 
                satisfied with your purchase. If you're not entirely happy with your order, we're here to help.
              </p>
            </div>

            {/* Policy highlights */}
            <div className={styles.highlightsContainer}>
              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <RefreshCw size={28} />
                </div>
                <h3>30-Day Returns</h3>
                <p>Return eligible items within 30 days</p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <Check size={28} />
                </div>
                <h3>Satisfaction Guarantee</h3>
                <p>We stand behind our products</p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <PackageX size={28} />
                </div>
                <h3>Easy Process</h3>
                <p>Simple return instructions</p>
              </div>

              <div className={styles.highlightCard}>
                <div className={styles.highlightIcon}>
                  <Banknote size={28} />
                </div>
                <h3>Refund Options</h3>
                <p>Store credit or original payment method</p>
              </div>
            </div>

            {/* Detailed sections */}
            <div className={styles.policyContent}>
              <div className={styles.policySection}>
                <h2>Return Eligibility</h2>
                <p>
                  To be eligible for a return, your item must be unused and in the same condition that you received it. 
                  It must also be in the original packaging.
                </p>
                <p>
                  Several types of goods are exempt from being returned. Perishable goods such as fresh herbs, 
                  custom products, and personal care items that have been opened cannot be returned.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Return Window</h2>
                <p>
                  You have 30 days from the date of delivery to initiate a return. After 30 days, we cannot offer 
                  you a refund or exchange.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Refunds</h2>
                <p>
                  Once we receive and inspect your return, we will send you an email to notify you that we have 
                  received your returned item. We will also notify you of the approval or rejection of your refund.
                </p>
                <p>
                  If approved, your refund will be processed according to the following guidelines:
                </p>
                <ul className={styles.policyList}>
                  <li>
                    <strong>Unopened Items:</strong> Full refund to original payment method
                  </li>
                  <li>
                    <strong>Opened Items:</strong> Store credit (excluding certain categories)
                  </li>
                  <li>
                    <strong>Damaged or Defective Items:</strong> Full refund or replacement (your choice)
                  </li>
                </ul>
                <p>
                  Refunds are typically processed within 3-5 business days, but it may take up to 5-10 business days 
                  for the refund to show in your account, depending on your financial institution.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Return Shipping</h2>
                <p>
                  Customers are responsible for return shipping costs unless the item is defective or we made an error. 
                  In these cases, we will provide a prepaid return shipping label.
                </p>
                <p>
                  We recommend using a trackable shipping service or purchasing shipping insurance for items of value. 
                  We cannot guarantee that we will receive your returned item.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>How to Initiate a Return</h2>
                <ol className={styles.policyOrderedList}>
                  <li>
                    Log into your account and navigate to your order history, or contact our customer service team 
                    at <a href="mailto:returns@herbalremedies.com">returns@herbalremedies.com</a>.
                  </li>
                  <li>
                    Complete the return form with your order number and the items you wish to return.
                  </li>
                  <li>
                    Once your return is approved, you will receive return instructions and a Return Authorization 
                    Number (RAN) via email.
                  </li>
                  <li>
                    Package your return securely, including the RAN inside the package.
                  </li>
                  <li>
                    Ship your return to the address provided in the return instructions.
                  </li>
                </ol>
              </div>

              <div className={styles.policySection}>
                <h2>Exchanges</h2>
                <p>
                  If you need to exchange an item for the same product (for example, due to size or damage), please 
                  follow the return process above and specify that you want an exchange. Once we receive the original 
                  item, we will ship the replacement.
                </p>
                <p>
                  If you need a different product instead, please return the original item for a refund and place a 
                  new order for the desired product.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Special Circumstances</h2>
                <h3>Damaged or Defective Items</h3>
                <p>
                  If you receive a damaged or defective item, please contact us immediately at 
                  <a href="mailto:returns@herbalremedies.com"> returns@herbalremedies.com</a> with photos of the damage. 
                  We will arrange for a return or replacement at no cost to you.
                </p>
                
                <h3>Gifts</h3>
                <p>
                  If the item was marked as a gift when purchased and shipped directly to you, you'll receive a gift 
                  credit for the value of your return. Once the returned item is received, a gift certificate will be 
                  emailed to you.
                </p>
              </div>

              <div className={styles.policySection}>
                <h2>Sale Items</h2>
                <p>
                  Only regularly priced items may be refunded. Sale items cannot be refunded unless they are defective 
                  or damaged. All clearance items are final sale.
                </p>
              </div>
            </div>

            <div className={styles.policyUpdated}>
              <p>Last Updated: April 20, 2025</p>
            </div>

            <div className={styles.policyContact}>
              <h3>Need Help With a Return?</h3>
              <p>
                If you have any questions about our return policy or need assistance with a return, please contact our 
                customer service team at <a href="mailto:returns@herbalremedies.com">returns@herbalremedies.com</a> or 
                call us at <a href="tel:+18005551234">1-800-555-1234</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnPolicy;
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/contactus.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset the form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Get In Touch</h1>
            <p className={styles.heroSubtitle}>We're here to answer your questions and help you find the right herbal solutions</p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className={styles.contactInfoSection}>
          <div className={styles.contactCards}>
            <div className={styles.contactCard}>
              <div className={styles.cardIcon}>
                <MapPin />
              </div>
              <h3 className={styles.cardTitle}>Visit Us</h3>
              <address className={styles.cardText}>
                123 Botanical Gardens<br />
                Green Valley, CA 94123<br />
                United States
              </address>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardIcon}>
                <Phone />
              </div>
              <h3 className={styles.cardTitle}>Call Us</h3>
              <p className={styles.cardText}>
                <a href="tel:+18005551234" className={styles.contactLink}>+1 (800) 555-1234</a><br />
                <a href="tel:+18005551235" className={styles.contactLink}>+1 (800) 555-1235</a>
              </p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardIcon}>
                <Mail />
              </div>
              <h3 className={styles.cardTitle}>Email Us</h3>
              <p className={styles.cardText}>
                <a href="mailto:info@herbalremedies.com" className={styles.contactLink}>info@herbalremedies.com</a><br />
                <a href="mailto:support@herbalremedies.com" className={styles.contactLink}>support@herbalremedies.com</a>
              </p>
            </div>

            <div className={styles.contactCard}>
              <div className={styles.cardIcon}>
                <Clock />
              </div>
              <h3 className={styles.cardTitle}>Opening Hours</h3>
              <p className={styles.cardText}>
                Monday - Friday: 9am - 6pm<br />
                Saturday: 10am - 4pm<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className={styles.contactFormSection}>
          <div className={styles.formAndMapContainer}>
            {/* Contact Form */}
            <div className={styles.formContainer}>
              <div className={styles.formHeader}>
                <MessageSquare className={styles.formHeaderIcon} />
                <h2 className={styles.formTitle}>Send Us a Message</h2>
              </div>
              
              {submitted ? (
                <div className={styles.thankYouMessage}>
                  <div className={styles.checkmarkCircle}>
                    <span className={styles.checkmark}>✓</span>
                  </div>
                  <h3>Thank you!</h3>
                  <p>Your message has been sent successfully. We'll get back to you soon.</p>
                </div>
              ) : (
                <form className={styles.contactForm} onSubmit={handleSubmit}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.formLabel}>Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={styles.formInput}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
               
                    <div className={styles.formGroup}>
                      <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={styles.formInput}
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                   
                  
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className={styles.formInput}
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.formLabel}>Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      className={styles.formTextarea}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className={styles.submitButton}>
                    <Send size={18} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
            
            {/* Map */}
            <div className={styles.mapContainer}>
              {/* This would normally be a Google Maps or other map integration */}
              <div className={styles.mapPlaceholder}>
                <img src="./image.png" alt="Our Location Map" className={styles.mapImage} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <h2 className={styles.sectionTitle}>Frequently Asked Contact Questions</h2>
            
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>What's the average response time for inquiries?</h3>
                <p className={styles.faqAnswer}>
                  We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our customer service line.
                </p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Do you offer consultations with herbalists?</h3>
                <p className={styles.faqAnswer}>
                  Yes, we offer both in-person and virtual consultations with our qualified herbalists. Please fill out the form and mention you'd like to schedule a consultation.
                </p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Can I visit your facility for a tour?</h3>
                <p className={styles.faqAnswer}>
                  We offer guided tours of our production facility on the first Friday of each month. Reservations are required and can be made through our contact form.
                </p>
              </div>
              
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>How can I apply to work with your company?</h3>
                <p className={styles.faqAnswer}>
                  Please visit our Careers page for current openings or send your resume to careers@herbalremedies.com with a cover letter explaining your interest.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Newsletter Signup */}
        <section className={styles.newsletterSection}>
          <div className={styles.newsletterContainer}>
            <h2 className={styles.newsletterTitle}>Stay Connected</h2>
            <p className={styles.newsletterText}>
              Subscribe to our newsletter for the latest product updates, herbal wellness tips, and exclusive offers.
            </p>
            
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterButton}>
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
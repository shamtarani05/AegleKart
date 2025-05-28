import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MessageSquare, Send, User, Mail, Phone, CheckCircle, AlertCircle, MapPin, Clock, PhoneCall } from 'lucide-react';
import styles from '../styles/feedback.module.css';

const Feedback = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    feedbackType: 'general',
    message: ''
  });

  // Form submission state
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Mock form submission
    // In a real application, you would send this data to your server
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your feedback. We will review it shortly!'
      });
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderNumber: '',
        feedbackType: 'general',
        message: ''
      });
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Send Feedback</h1>
            <p className={styles.heroSubtitle}>We value your opinions and suggestions</p>
          </div>
        </section>

        {/* Feedback Form Section */}
        <section className={styles.formSection}>
          <div className={styles.formContainer}>
            <div className={styles.formLayout}>
              {/* Feedback Form */}
              <div className={styles.formCard}>
                {formStatus.submitted && formStatus.success ? (
                  <div className={styles.successMessage}>
                    <div className={styles.successIcon}>
                      <CheckCircle size={48} />
                    </div>
                    <h2>Thank You!</h2>
                    <p>{formStatus.message}</p>
                    <button 
                      className={styles.newFeedbackButton}
                      onClick={() => setFormStatus({ submitted: false, success: false, message: '' })}
                    >
                      Send Another Feedback
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className={styles.formTitle}>
                      <MessageSquare size={20} />
                      <span>Share Your Thoughts</span>
                    </h2>
                    
                    <form onSubmit={handleSubmit} className={styles.feedbackForm}>
                      <div className={styles.formFields}>
                        <div className={styles.formGroup}>
                          <label htmlFor="name">Full Name*</label>
                          <div className={styles.inputWithIcon}>
                            
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your full name"
                              className={formErrors.name ? styles.inputError : ''}
                            />
                          </div>
                          {formErrors.name && <p className={styles.errorText}>{formErrors.name}</p>}
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="email">Email Address*</label>
                          <div className={styles.inputWithIcon}>
                            
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="your@email.com"
                              className={formErrors.email ? styles.inputError : ''}
                            />
                          </div>
                          {formErrors.email && <p className={styles.errorText}>{formErrors.email}</p>}
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="phone">Phone Number (Optional)</label>
                          <div className={styles.inputWithIcon}>
                           
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="Your phone number"
                            />
                          </div>
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="orderNumber">Order Number (If applicable)</label>
                          <input
                            type="text"
                            id="orderNumber"
                            name="orderNumber"
                            value={formData.orderNumber}
                            onChange={handleChange}
                            placeholder="e.g. ORD12345"
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="feedbackType">Feedback Type*</label>
                          <select
                            id="feedbackType"
                            name="feedbackType"
                            value={formData.feedbackType}
                            onChange={handleChange}
                          >
                            <option value="general">General Feedback</option>
                            <option value="product">Product Feedback</option>
                            <option value="website">Website Feedback</option>
                            <option value="shipping">Shipping & Delivery</option>
                            <option value="suggestion">Suggestion</option>
                            <option value="complaint">Complaint</option>
                          </select>
                        </div>
                        
                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                          <label htmlFor="message">Your Message*</label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Please provide as much detail as possible..."
                            rows="5"
                            className={formErrors.message ? styles.inputError : ''}
                          ></textarea>
                          {formErrors.message && <p className={styles.errorText}>{formErrors.message}</p>}
                        </div>
                      </div>
                      
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.submitButton}>
                          <Send size={18} />
                          <span>Send Feedback</span>
                        </button>
                      </div>
                      
                      <p className={styles.requiredNote}>* Required fields</p>
                    </form>
                  </>
                )}
              </div>

              {/* Feedback Info */}
              <div className={styles.infoCard}>
                <div className={styles.infoContent}>
                  <h2 className={styles.infoTitle}>We Value Your Input</h2>
                  
                  <div className={styles.infoSection}>
                    <h3>Why Your Feedback Matters</h3>
                    <p>
                      Your feedback helps us improve our products and services. We carefully review all submissions to better understand your needs and enhance your shopping experience.
                    </p>
                  </div>
                  
                  <div className={styles.infoSection}>
                    <h3>What Happens Next?</h3>
                    <p>
                      After submitting your feedback:
                    </p>
                    <ul className={styles.infoList}>
                      <li>You'll receive a confirmation email</li>
                      <li>Our team will review your submission</li>
                      <li>We may contact you for additional information</li>
                      <li>Your feedback will help shape our improvements</li>
                    </ul>
                  </div>
                  
                  <div className={styles.infoSection}>
                    <h3>Other Ways to Reach Us</h3>
                    <div className={styles.contactInfo}>
                      <div className={styles.contactMethod}>
                        <div className={styles.contactIcon}>
                          <PhoneCall size={18} />
                        </div>
                        <div>
                          <h4>Call Us</h4>
                          <p>(800) 555-0123</p>
                          <p className={styles.contactNote}>Mon-Fri: 9am-6pm EST</p>
                        </div>
                      </div>
                      
                      <div className={styles.contactMethod}>
                        <div className={styles.contactIcon}>
                          <Mail size={18} />
                        </div>
                        <div>
                          <h4>Email Support</h4>
                          <p>support@ecoshop.com</p>
                          <p className={styles.contactNote}>We respond within 24 hours</p>
                        </div>
                      </div>
                      
                      <div className={styles.contactMethod}>
                        <div className={styles.contactIcon}>
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h4>Visit Our Store</h4>
                          <p>123 Green Street, Suite 101</p>
                          <p>Eco City, EC 12345</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.responseTime}>
                    <Clock size={18} />
                    <p>We typically respond to all inquiries within 1-2 business days.</p>
                  </div>
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
                <MessageSquare size={28} />
              </div>
              <h3>Direct Communication</h3>
              <p>Share your thoughts directly with our team for faster resolution</p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <CheckCircle size={28} />
              </div>
              <h3>Easy Tracking</h3>
              <p>Follow the status of your feedback with our simple tracking system</p>
            </div>
            
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <User size={28} />
              </div>
              <h3>Personal Attention</h3>
              <p>Each feedback is personally reviewed by our dedicated support team</p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Feedback;
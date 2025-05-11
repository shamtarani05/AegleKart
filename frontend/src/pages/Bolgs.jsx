// HealthBlogComingSoon.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/blogs.module.css';

const Blog = () => {
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
            <h1 className={styles.title}>Health & Wellness Blog</h1>
            <div className={styles.badge}>Coming Soon</div>
            
            <p className={styles.description}>
              We're preparing a thoughtful collection of articles, resources, and expert insights 
              focused on holistic health, natural wellness, and sustainable living.
              Our goal is to empower you with knowledge to make informed decisions about your health journey.
            </p>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🌿</div>
                <h3>Natural Remedies</h3>
                <p>Explore the power of plant-based medicine and traditional healing practices</p>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🧘</div>
                <h3>Mindful Living</h3>
                <p>Tips for stress reduction, meditation, and finding balance in everyday life</p>
              </div>
              
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🥗</div>
                <h3>Nutrition Insights</h3>
                <p>Evidence-based nutrition advice for optimal health and wellbeing</p>
              </div>
            </div>
            
            <div className={styles.expertSection}>
              <h2>Written by Health Experts</h2>
              <div className={styles.expertProfiles}>
                <div className={styles.expertAvatar}>
                  <div className={styles.avatarPlaceholder}></div>
                  <p>Dr. Sarah Chen</p>
                  <span>Naturopathic Doctor</span>
                </div>
                <div className={styles.expertAvatar}>
                  <div className={styles.avatarPlaceholder}></div>
                  <p>Michael Torres</p>
                  <span>Holistic Nutritionist</span>
                </div>
                <div className={styles.expertAvatar}>
                  <div className={styles.avatarPlaceholder}></div>
                  <p>Emma Patel</p>
                  <span>Mind-Body Coach</span>
                </div>
              </div>
            </div>
            
            <div className={styles.notificationForm}>
              <h2>Get Health Insights Delivered</h2>
              <p>Be the first to receive our expert articles and exclusive wellness content</p>
              
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
                    Subscribe
                  </button>
                </div>
                
                {submitted && (
                  <div className={styles.successMessage}>
                    Thank you for subscribing! You'll be the first to know when our health blog launches.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        
        <div className={styles.previewSection}>
          <div className={styles.previewCard}>
            <div className={styles.previewContent}>
              <div className={styles.previewBadge}>Coming Soon</div>
              <h3>Understanding Herbal Adaptogens</h3>
              <p>How these powerful plants help your body respond to stress and restore balance</p>
              <div className={styles.previewMeta}>
                <span>By Dr. Sarah Chen</span>
                <span>8 min read</span>
              </div>
            </div>
          </div>
          
          <div className={styles.previewCard}>
            <div className={styles.previewContent}>
              <div className={styles.previewBadge}>Coming Soon</div>
              <h3>Seasonal Eating Guide: Spring</h3>
              <p>Nourish your body with fresh, local produce that supports your health naturally</p>
              <div className={styles.previewMeta}>
                <span>By Michael Torres</span>
                <span>6 min read</span>
              </div>
            </div>
          </div>
          
          <div className={styles.previewCard}>
            <div className={styles.previewContent}>
              <div className={styles.previewBadge}>Coming Soon</div>
              <h3>The Science of Deep Breathing</h3>
              <p>Simple techniques to activate your parasympathetic nervous system</p>
              <div className={styles.previewMeta}>
                <span>By Emma Patel</span>
                <span>5 min read</span>
              </div>
            </div>
          </div>
          
          <div className={styles.centerMessage}>
            <div className={styles.messageIcon}>📆</div>
            <h2>Launching June 2025</h2>
            <p>Our health experts are curating valuable content for you</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
// CareerPage.jsx
import React from 'react';
import Header from '../components/Header'; // Import your existing Header component
import Footer from '../components/Footer'; // Import your existing Footer component
import styles from '../styles/careerpage.module.css'; // CSS Module import

const CareerPage = () => {
  return (
    <div className={styles.page}>
      <Header />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Join Our Healthcare Revolution</h1>
          <p className={styles.heroSubtitle}>We're building the future of pharmacy services. Our career opportunities will be launching soon, bringing exciting roles where you can make a real difference in healthcare innovation.</p>
          <a href="#notify-me" className={styles.heroCta}>Get Notified</a>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className={styles.comingSoon}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Exciting Opportunities Coming Soon</h2>
          <p className={styles.sectionSubtitle}>We're preparing to launch careers that combine healthcare expertise with technological innovation. Here's a preview of the types of roles we'll be offering:</p>
          
          <div className={styles.jobCategories}>
            <div className={styles.jobCategory}>
              <div className={styles.jobCategoryIcon}>👩‍⚕️</div>
              <h3 className={styles.jobCategoryTitle}>Pharmacy Professionals</h3>
              <p className={styles.jobCategoryDescription}>Licensed pharmacists, pharmacy technicians, and medication management specialists who are passionate about digital healthcare transformation.</p>
            </div>
            
            <div className={styles.jobCategory}>
              <div className={styles.jobCategoryIcon}>💻</div>
              <h3 className={styles.jobCategoryTitle}>Technology Team</h3>
              <p className={styles.jobCategoryDescription}>Software developers, UX/UI designers, data scientists, and IT security specialists to build and maintain our cutting-edge platform.</p>
            </div>
            
            <div className={styles.jobCategory}>
              <div className={styles.jobCategoryIcon}>📱</div>
              <h3 className={styles.jobCategoryTitle}>Customer Experience</h3>
              <p className={styles.jobCategoryDescription}>Customer support specialists, patient care advocates, and digital experience managers focused on delivering exceptional service.</p>
            </div>
            
            <div className={styles.jobCategory}>
              <div className={styles.jobCategoryIcon}>📊</div>
              <h3 className={styles.jobCategoryTitle}>Operations & Logistics</h3>
              <p className={styles.jobCategoryDescription}>Supply chain managers, inventory specialists, and fulfillment coordinators to ensure efficient delivery of medications.</p>
            </div>
            
            <div className={styles.jobCategory}>
              <div className={styles.jobCategoryIcon}>🚀</div>
              <h3 className={styles.jobCategoryTitle}>Growth & Marketing</h3>
              <p className={styles.jobCategoryDescription}>Digital marketers, business development specialists, and healthcare partnership managers to expand our reach and impact.</p>
            </div>
            
            <div className={styles.jobCategory}>
              <div className={styles.jobCategoryIcon}>🧪</div>
              <h3 className={styles.jobCategoryTitle}>Innovation & Research</h3>
              <p className={styles.jobCategoryDescription}>Healthcare researchers, clinical information specialists, and innovation leads to help shape the future of digital pharmacy.</p>
            </div>
          </div>
          
          {/* Notification Form */}
          <div id="notify-me" className={styles.notificationForm}>
            <h3 className={styles.formTitle}>Be First To Know About New Opportunities</h3>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                <input type="text" id="name" className={styles.formInput} placeholder="Enter your full name" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                <input type="email" id="email" className={styles.formInput} placeholder="Enter your email address" required />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="interest" className={styles.formLabel}>Area of Interest</label>
                <select id="interest" className={styles.formInput} required>
                  <option value="" disabled selected>Select your area of interest</option>
                  <option value="pharmacy">Pharmacy Professionals</option>
                  <option value="tech">Technology Team</option>
                  <option value="cx">Customer Experience</option>
                  <option value="operations">Operations & Logistics</option>
                  <option value="growth">Growth & Marketing</option>
                  <option value="innovation">Innovation & Research</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <button type="submit" className={styles.formButton}>Notify Me When Jobs Launch</button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className={styles.whyJoin}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Join Our Team?</h2>
          
          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🌱</div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>Make a Real Impact</h3>
                <p className={styles.benefitDescription}>Help transform how people access and manage their medications, improving health outcomes through innovation.</p>
              </div>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>⚡</div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>Fast-Paced Growth</h3>
                <p className={styles.benefitDescription}>Join a rapidly expanding company with abundant opportunities for career advancement and professional development.</p>
              </div>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🏥</div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>Comprehensive Benefits</h3>
                <p className={styles.benefitDescription}>Enjoy competitive compensation, health insurance, wellness programs, and work-life balance initiatives.</p>
              </div>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🧠</div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>Continuous Learning</h3>
                <p className={styles.benefitDescription}>Access ongoing education, skill development programs, and opportunities to grow your healthcare and technology expertise.</p>
              </div>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🌍</div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>Remote Flexibility</h3>
                <p className={styles.benefitDescription}>Work from anywhere with our flexible remote policy for many positions, creating a global and diverse team.</p>
              </div>
            </div>
            
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>🔄</div>
              <div className={styles.benefitContent}>
                <h3 className={styles.benefitTitle}>Innovation Culture</h3>
                <p className={styles.benefitDescription}>Contribute to a collaborative environment where creative thinking and new ideas are encouraged and celebrated.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className={styles.values}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Core Values</h2>
          <p className={styles.sectionSubtitle}>These principles guide everything we do and shape our company culture. When you join our team, you'll be part of an organization committed to these values.</p>
          
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueCardColorBar}></div>
              <div className={styles.valueCardContent}>
                <h3 className={styles.valueCardTitle}>
                  <span className={styles.valueCardIcon}>⭐</span>
                  Patient First
                </h3>
                <p className={styles.valueCardDescription}>We put patients at the center of everything we do, ensuring their needs, safety, and wellbeing drive our decisions.</p>
              </div>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueCardColorBar}></div>
              <div className={styles.valueCardContent}>
                <h3 className={styles.valueCardTitle}>
                  <span className={styles.valueCardIcon}>🛡️</span>
                  Trust & Integrity
                </h3>
                <p className={styles.valueCardDescription}>We operate with the highest ethical standards, maintaining patient trust through transparency and accountability.</p>
              </div>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueCardColorBar}></div>
              <div className={styles.valueCardContent}>
                <h3 className={styles.valueCardTitle}>
                  <span className={styles.valueCardIcon}>🔍</span>
                  Continuous Improvement
                </h3>
                <p className={styles.valueCardDescription}>We're committed to constantly learning, iterating, and enhancing our services and workplace.</p>
              </div>
            </div>
            
            <div className={styles.valueCard}>
              <div className={styles.valueCardColorBar}></div>
              <div className={styles.valueCardContent}>
                <h3 className={styles.valueCardTitle}>
                  <span className={styles.valueCardIcon}>🤝</span>
                  Collaborative Spirit
                </h3>
                <p className={styles.valueCardDescription}>We believe diverse perspectives and teamwork lead to better outcomes for our patients and company.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareerPage;
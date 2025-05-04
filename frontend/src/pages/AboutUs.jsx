import React from 'react';
import { Leaf, Award, Heart, Users, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/aboutus.module.css';

const AboutUs = () => {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Our Story</h1>
            <p className={styles.heroSubtitle}>Empowering Health Through Nature's Wisdom</p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className={styles.missionSection}>
          <div className={styles.missionContent}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.missionText}>
              At Herbal Remedies, we're committed to delivering real, effective herbal medicines to those who need them most. 
              Our goal is simple: provide original, trustworthy, and natural products that truly make a difference in people’s lives. 
              By combining the healing wisdom of tradition with the precision of modern science, we ensure each remedy we offer is both safe and genuinely beneficial.
            </p>
            <div className={styles.missionIconsContainer}>
              <div className={styles.missionIconBox}>
                <div className={styles.iconCircle}>
                  <Leaf className={styles.icon} />
                </div>
                <h3 className={styles.iconTitle}>Natural</h3>
                <p className={styles.iconText}>Sourced from nature's finest ingredients</p>
              </div>
              <div className={styles.missionIconBox}>
                <div className={styles.iconCircle}>
                  <Award className={styles.icon} />
                </div>
                <h3 className={styles.iconTitle}>Quality</h3>
                <p className={styles.iconText}>Stringent quality control at every step</p>
              </div>
              <div className={styles.missionIconBox}>
                <div className={styles.iconCircle}>
                  <Heart className={styles.icon} />
                </div>
                <h3 className={styles.iconTitle}>Care</h3>
                <p className={styles.iconText}>Made with love and respect for tradition</p>
              </div>
            </div>
          </div>
        </section>

        {/* Company History */}
        <section className={styles.historySection}>
          <div className={styles.historyContent}>
            <div className={styles.historyText}>
              <h2 className={styles.sectionTitle}>Our History</h2>
              <p className={styles.historyParagraph}>
                Founded in 2025 by Mr. Sham Tarani, Herbal Remedies began as a small apothecary shop dedicated to preserving traditional herbal remedies from around the world.
              </p>
              <p className={styles.historyParagraph}>
                Over two decades later, we've grown into a trusted provider of natural health solutions while staying true to our roots. Our team of herbalists, naturopaths, and scientists work together to create formulations that honor tradition while meeting modern quality standards.
              </p>
              <p className={styles.historyParagraph}>
                Today, we're proud to offer over 500 products sourced from sustainable farms and wild-crafted sources, reaching customers in over 20 countries worldwide.
              </p>
            </div>
            <div className={styles.historyImage}>
              <img src="https://via.placeholder.com/500x400" alt="Our herbal laboratory" className={styles.historyImg} />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <p className={styles.teamIntro}>
            Our diverse team brings together experts in herbal medicine, product innovation, and scientific research.
          </p>

          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.teamMemberImage}>
                <img src="./shampic2.jpg" alt="Engr. Sham Tarani" className={styles.memberImg} />
              </div>
              <h3 className={styles.memberName}>Engr. Sham Tarani</h3>
              <p className={styles.memberTitle}>Founder & CEO</p>
              <p className={styles.memberBio}>A passionate innovator dedicated to building honest healthtech solutions that improve lives through natural healing.</p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.teamMemberImage}>
                <img src="./moizpic.jpg" alt="Engr. Abdul Moiz" className={styles.memberImg} />
              </div>
              <h3 className={styles.memberName}>Engr. Abdul Moiz</h3>
              <p className={styles.memberTitle}>Head of Product Management</p>
              <p className={styles.memberBio}>Oversees our product journey from idea to shelf, ensuring a smooth, effective experience for every customer.</p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.teamMemberImage}>
                <img src="https://via.placeholder.com/200" alt="Dr. Sineha" className={styles.memberImg} />
              </div>
              <h3 className={styles.memberName}>Dr. Sineha</h3>
              <p className={styles.memberTitle}>Head of Medicines & Research</p>
              <p className={styles.memberBio}>An expert in herbal science, leading our efforts to craft safe, effective, and research-backed formulations.</p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.teamMemberImage}>
                <img src="https://via.placeholder.com/200" alt="Dr. Anwar Rehman" className={styles.memberImg} />
              </div>
              <h3 className={styles.memberName}>Dr. Anwar Rehman</h3>
              <p className={styles.memberTitle}>Chief Scientific Officer</p>
              <p className={styles.memberBio}>A clinical pharmacology specialist who ensures every product meets the highest standards of scientific integrity and safety.</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.valuesContent}>
            <h2 className={styles.sectionTitle}>Our Values</h2>

            <div className={styles.valueCards}>
              <div className={styles.valueCard}>
                <div className={styles.valueIconContainer}>
                  <Users className={styles.valueIcon} />
                </div>
                <h3 className={styles.valueTitle}>Community</h3>
                <p className={styles.valueText}>
                  We support the communities where our ingredients are grown and give back through education and healthcare initiatives.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIconContainer}>
                  <Leaf className={styles.valueIcon} />
                </div>
                <h3 className={styles.valueTitle}>Sustainability</h3>
                <p className={styles.valueText}>
                  Our commitment to the planet includes sustainable harvesting practices, eco-friendly packaging, and carbon-neutral operations.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIconContainer}>
                  <Award className={styles.valueIcon} />
                </div>
                <h3 className={styles.valueTitle}>Excellence</h3>
                <p className={styles.valueText}>
                  We never compromise on quality and continually strive to improve our formulations and processes.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIconContainer}>
                  <Clock className={styles.valueIcon} />
                </div>
                <h3 className={styles.valueTitle}>Tradition</h3>
                <p className={styles.valueText}>
                  We honor the centuries of herbal wisdom that inform our modern approaches to wellness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className={styles.certificationsSection}>
          <h2 className={styles.sectionTitle}>Our Certifications</h2>
          <div className={styles.certificationsGrid}>
            <div className={styles.certificationItem}>
              <img src="https://via.placeholder.com/120" alt="Organic Certified" className={styles.certLogo} />
              <h3 className={styles.certName}>Certified Organic</h3>
            </div>
            <div className={styles.certificationItem}>
              <img src="https://via.placeholder.com/120" alt="GMP Certified" className={styles.certLogo} />
              <h3 className={styles.certName}>GMP Certified</h3>
            </div>
            <div className={styles.certificationItem}>
              <img src="https://via.placeholder.com/120" alt="Non-GMO Project" className={styles.certLogo} />
              <h3 className={styles.certName}>Non-GMO Project</h3>
            </div>
            <div className={styles.certificationItem}>
              <img src="https://via.placeholder.com/120" alt="B Corporation" className={styles.certLogo} />
              <h3 className={styles.certName}>B Corporation</h3>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

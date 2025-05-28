// HeroSection.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import styles from "../styles/herosection.module.css";

// Import Swiper styles
// Note: You'll need to install these dependencies:
// npm install swiper

// Add these imports in your main CSS file:
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const HeroSection = () => {
  // Hero slider data with improved gradient classes
  const heroSlides = [
    {
      id: 1,
      bgClass: styles.slideBgGreen,
      // icon: '', // Placeholder for herbal icon
      title: 'NATURAL REMEDIES',
      subtitle: 'FOR MODERN WELLNESS',
      tagline: 'Ancient wisdom meets contemporary healthcare',
      ctaText: 'Shop Ayurvedic',
      productImage: 'slide1.png', // Ayurvedic kit
    },
    {
      id: 2,
      bgClass: styles.slideBgBlue,
      // icon: '', // Placeholder for vitamin icon
      title: 'BOOST YOUR IMMUNITY',
      subtitle: 'NOT JUST A TREND',
      tagline: 'Scientifically formulated supplements for daily protection',
      ctaText: 'Explore Products',
      productImage: 'slide2.png', // Immunity supplements
    },
    {
      id: 3,
      bgClass: styles.slideBgPink,
      // icon: '', // Placeholder for skincare icon
      title: 'DERMATOLOGIST APPROVED',
      subtitle: 'SKINCARE ESSENTIALS',
      tagline: 'Clinical solutions for all skin types',
      ctaText: 'Shop Skincare',
      productImage: 'slide3.png', // Skincare collection
    }
  ];
  
  return (
    <section className={styles.heroSection}>
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: `swiper-pagination-bullet ${styles.swiperBullet}`,
          bulletActiveClass: `swiper-pagination-bullet-active ${styles.swiperBulletActive}`,
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className={styles.heroSwiper}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className={slide.bgClass}>
            <div className={styles.slideContent}>
              {/* Text Content */}
              <div className={styles.textContent}>
                {slide.icon && (
                  <div className={styles.iconContainer}>
                    <img
                      src={slide.icon}
                      alt="Category icon"
                      className={styles.categoryIcon}
                      // Use placeholder until you have actual images
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/60/60";
                      }}
                    />
                  </div>
                )}
                <h2 className={styles.slideTitle}>{slide.title}</h2>
                <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                <p className={styles.slideTagline}>{slide.tagline}</p>
                <button className={styles.ctaButton}>
                  <span className={styles.buttonText}>{slide.ctaText}</span>
                  <span className={styles.arrowIcon}>→</span>
                </button>
              </div>

              {/* Product Image */}
              <div className={styles.productImage}>
                <div className={styles.imageFrame}>
                  <img
                    src={slide.productImage}
                    alt="Featured product"
                    // Use placeholder until you have actual images
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/400/350";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className={styles.decorativeElements}>
              <div className={`${styles.decorCircle} ${styles.decorCircleLarge}`}></div>
              <div className={`${styles.decorCircle} ${styles.decorCircleMedium}`}></div>
              <div className={`${styles.decorCircle} ${styles.decorCircleSmall}`}></div>
              <div className={`${styles.decorCircle} ${styles.decorCircleXSmall}`}></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className={`swiper-button-prev ${styles.swiperButtonPrev}`}></div>
      <div className={`swiper-button-next ${styles.swiperButtonNext}`}></div>
    </section>
  );
};

export default HeroSection;
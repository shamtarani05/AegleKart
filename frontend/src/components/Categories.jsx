// Categories.jsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from '../styles/categories.module.css';

const categories = [
  { id: 1, name: "Personal Care", icon: "🧴", color: "#FFF3D0" },
  { id: 2, name: "Baby & Mother", icon: "👶", color: "#F0E0FF" },
  { id: 3, name: "Nutrition", icon: "🥗", color: "#E0F7D9" },
  { id: 4, name: "Devices", icon: "🩸", color: "#E6EDF2" },
  { id: 5, name: "Derma", icon: "👩‍⚕️", color: "#FFF0D6" },
  { id: 6, name: "Medicines", icon: "💊", color: "#E3F2FD" },
  { id: 7, name: "Healthcare", icon: "🩺", color: "#E8F5E9" },
  { id: 8, name: "Ayurvedic", icon: "🌿", color: "#F0F4C3" }
];

const CategorySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(5);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Responsive calculation for items to show
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setItemsToShow(2);
      else if (width < 768) setItemsToShow(3);
      else if (width < 1024) setItemsToShow(4);
      else setItemsToShow(5);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.max(0, categories.length - itemsToShow);

  const nextSlide = useCallback(() => {
    if (currentIndex >= totalSlides) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentIndex <= 0) {
      setCurrentIndex(totalSlides);
    } else {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, totalSlides]);

  // Auto-slide functionality with hover pause
  useEffect(() => {
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 5000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide, isHovering]);

  // Enhanced slide style with smoother animation
  const slideStyle = {
    transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
    transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Categories</h2>
          <div className={styles.navButtons}>
            <button 
              onClick={prevSlide} 
              className={`${styles.arrowBtn} ${currentIndex === 0 ? styles.disabled : styles.active}`}
              aria-label="Previous category"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide} 
              className={`${styles.arrowBtn} ${currentIndex >= totalSlides ? styles.disabled : styles.active}`}
              aria-label="Next category"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div 
          className={styles.sliderWrapper}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div 
            ref={sliderRef} 
            className={styles.slider} 
            style={slideStyle}
          >
            {categories.map((category) => (
              <Link 
                to={`/products/${category.name.toLowerCase()}`} 
                key={category.id} 
                className={styles.slide} 
                style={{ width: `${100 / itemsToShow}%` }}
              >
                <div className={styles.categoryItem}>
                  <div 
                    className={styles.iconCircle}
                    style={{ backgroundColor: category.color }}
                  >
                    <span className={styles.icon}>{category.icon}</span>
                  </div>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
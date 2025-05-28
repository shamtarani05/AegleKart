import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Autoplay module along with Navigation
import { Navigation, Autoplay } from 'swiper/modules';
import MedicineCard from './MedicineCard';
import styles from '../styles/topsellingproducts.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay'; // Import autoplay styles

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/sales',{}); // Updated endpoint

        if (!response.ok) {
          throw new Error('Failed to fetch top selling products');
        }

        const data = await response.json();
        setProducts(data.slice(0, 10)); // Limit to top 10
      } catch (err) {
        console.error('Error fetching top selling products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

 
  const handleViewAll = () => {
    navigate('/products/top-selling');
  };

  if (loading) {
    return (
      <div className={styles.outerContainer}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>Top Selling Items</h2>
          </div>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading top products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.outerContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Top Selling Items</h2>
          <button onClick={handleViewAll} className={styles.viewAllButton}>
            VIEW ALL
          </button>
        </div>

        <div className={styles.swiperContainer}>
          <div className={`custom-prev ${styles.customNavPrev}`}>
            <ChevronLeft size={20} />
          </div>
          
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={16}
            slidesPerView={1}
            navigation={{
              prevEl: '.custom-prev',
              nextEl: '.custom-next',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false, 
              pauseOnMouseEnter: true,
              stopOnLastSlide: false,
            }}
            loop={true}
            loopPreventsSlide={false}
            loopAdditionalSlides={5}
            speed={800}
            observer={true}
            observeParents={true}
            watchSlidesProgress={true}
            simulateTouch={true}
            allowTouchMove={true}
            preventClicks={false}
            preventClicksPropagation={false}
            breakpoints={{
              480: {
                slidesPerView: 2,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            className={styles.swiper}
          >
            {products.map((product) => (
              <SwiperSlide key={product._id} className={styles.swiperSlide}>
                <MedicineCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          <div className={`custom-next ${styles.customNavNext}`}>
            <ChevronRight size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;

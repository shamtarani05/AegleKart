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
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint for top selling products
        const response = await fetch('http://localhost:3000/products/top-selling');
        
        if (!response.ok) {
          throw new Error('Failed to fetch top selling products');
        }
        
        const data = await response.json();
        
        // Check if data is an array before using slice
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 10)); // Limit to top 10
        } else if (data.products && Array.isArray(data.products)) {
          // If the response has a 'products' property that's an array
          setProducts(data.products.slice(0, 10));
        } else {
          // If we can't find an array, log the data and set an error
          console.error('Unexpected data format:', data);
          setError('Unexpected data format received from server');
          setProducts([]); // Set empty array as fallback
        }
      } catch (err) {
        console.error('Error fetching top selling products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  // For development - use mock data
  useEffect(() => {
    if (loading === false && (error || products.length === 0)) {
      // Mock data with image URLs that match your theme
      const mockProducts = [
        {
          _id: 'mock-1',
          name: 'Centrum Adults Multivitamin Tablets',
          brandName: 'Centrum',
          price: 1800,
          discountedPrice: 1650,
          discount: 8,
          images: ["product.webp"], // Fixed: Changed string to array
          stockStatus: 'In Stock'
        },
        {
          _id: 'mock-2',
          name: 'Skin Aqua Clear White SPF-50 Cream',
          brandName: 'Skin Aqua',
          price: 2100,
          discountedPrice: 1890,
          discount: 10,
          images: ["product.webp"],
          stockStatus: 'In Stock'
        },
        {
          _id: 'mock-3',
          name: 'Meiji Big Milk Powder',
          brandName: 'Meiji',
          price: 4895,
          discountedPrice: 4650,
          discount: 5,
          images: ["product.webp"],
          stockStatus: 'In Stock'
        },
        {
          _id: 'mock-4',
          name: 'Eventone-C Cream',
          brandName: 'Eventone',
          price: 1895,
          discountedPrice: 1800,
          discount: 5,
          images: ["product.webp"],
          stockStatus: 'In Stock'
        },
        {
          _id: 'mock-5',
          name: 'Ozempic Injection Prefilled Pen',
          brandName: 'Ozempic',
          price: 28000,
          discountedPrice: 27748,
          discount: 1,
          images: ["product.webp"],
          stockStatus: 'In Stock'
        },
        {
          _id: 'mock-6',
          name: 'Senior Adult Diapers Size XL',
          brandName: 'Senior',
          price: 1600,
          discountedPrice: 1534,
          discount: 4,
          images: ["product.webp"],
          stockStatus: 'In Stock'
        }
      ];
      
      // Ensure all products have images as arrays
      const validatedProducts = mockProducts.map(product => ({
        ...product,
        // If images is not an array, convert it to an array
        images: Array.isArray(product.images) ? product.images : [product.images || "/api/placeholder/180/140"]
      }));
      
      setProducts(validatedProducts);
      setError(null);
    }
  }, [loading, error, products.length]);

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

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MedicineCard from '../components/MedicineCard';
import styles from '../styles/productspage.module.css';
import CategorySection from '../components/Categories';

const ProductsPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  // Slider states
  const [sliderGroups, setSliderGroups] = useState([]); // Groups of products (each group max 10 items)
  const [currentIndices, setCurrentIndices] = useState([]); // Index for each slider
  const [itemsPerView, setItemsPerView] = useState(4); // Number of items visible at once

  // Responsive adjustment
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setItemsPerView(1);
      else if (width < 900) setItemsPerView(2);
      else if (width < 1200) setItemsPerView(3);
      else setItemsPerView(4);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Full dummy data for e-pharmacy
    const dummyProducts = [
      {
        id: 1,
        category: 'Medicines',
        name: 'Paracetamol 500mg Tablets',
        image: '/04551.webp',
        price: 15,
        originalPrice: 20,
        manufacturer: 'ABC Pharmaceuticals',
        discount: '25%',
        stock: 100,
        description: 'Effective pain relief and fever reducer.',
        delivery: '1-2 days',
        isPrescriptionRequired: false,
        rating: 4.5,
      },
      {
        id: 2,
        category: 'Medicines',
        name: 'Ibuprofen 200mg Tablets',
        image: '/04551.webp',
        price: 18,
        originalPrice: 22,
        manufacturer: 'XYZ Pharma',
        discount: '18%',
        stock: 150,
        description: 'Reduces inflammation and pain.',
        delivery: '1-2 days',
        isPrescriptionRequired: false,
        rating: 4.3,
      },
      {
        id: 3,
        category: 'Medicines',
        name: 'Amoxicillin 250mg Capsules',
        image: '/04551.webp',
        price: 30,
        originalPrice: 40,
        manufacturer: 'CureWell',
        discount: '25%',
        stock: 75,
        description: 'Antibiotic for bacterial infections.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.7,
      },
      {
        id: 4,
        category: 'Medicines',
        name: 'Cetirizine 10mg Tablets',
        image: '/04551.webp',
        price: 10,
        originalPrice: 12,
        manufacturer: 'HealFast',
        discount: '16%',
        stock: 200,
        description: 'Relieves allergy symptoms.',
        delivery: '1 day',
        isPrescriptionRequired: false,
        rating: 4.1,
      },
      {
        id: 5,
        category: 'Medicines',
        name: 'Metformin 500mg Tablets',
        image: '/04551.webp',
        price: 25,
        originalPrice: 30,
        manufacturer: 'GlucoMed',
        discount: '17%',
        stock: 90,
        description: 'Used to control blood sugar levels.',
        delivery: '1-2 days',
        isPrescriptionRequired: true,
        rating: 4.6,
      },
      {
        id: 6,
        category: 'Medicines',
        name: 'Loratadine 10mg Tablets',
        image: '/04551.webp',
        price: 12,
        originalPrice: 15,
        manufacturer: 'AllerRelief',
        discount: '20%',
        stock: 130,
        description: 'Non-drowsy allergy relief.',
        delivery: '2 days',
        isPrescriptionRequired: false,
        rating: 4.2,
      },
      {
        id: 7,
        category: 'Medicines',
        name: 'Azithromycin 500mg Tablets',
        image: '/04551.webp',
        price: 45,
        originalPrice: 60,
        manufacturer: 'InfectoMed',
        discount: '25%',
        stock: 50,
        description: 'Antibiotic used to treat infections.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 8,
        category: 'Medicines',
        name: 'Aspirin 81mg Tablets',
        image: '/04551.webp',
        price: 14,
        originalPrice: 18,
        manufacturer: 'HeartCare',
        discount: '22%',
        stock: 110,
        description: 'Prevents blood clots and heart attacks.',
        delivery: '1 day',
        isPrescriptionRequired: true,
        rating: 4.5,
      },
      {
        id: 9,
        category: 'Medicines',
        name: 'Omeprazole 20mg Capsules',
        image: '/04551.webp',
        price: 20,
        originalPrice: 25,
        manufacturer: 'DigestPro',
        discount: '20%',
        stock: 95,
        description: 'Treats acid reflux and ulcers.',
        delivery: '2 days',
        isPrescriptionRequired: false,
        rating: 4.3,
      },
      {
        id: 10,
        category: 'Medicines',
        name: 'Losartan 50mg Tablets',
        image: '/04551.webp',
        price: 28,
        originalPrice: 35,
        manufacturer: 'BPHealth',
        discount: '20%',
        stock: 85,
        description: 'Used to treat high blood pressure.',
        delivery: '2 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 11,
        category: 'Medicines',
        name: 'Clopidogrel 75mg Tablets',
        image: '/04551.webp',
        price: 32,
        originalPrice: 42,
        manufacturer: 'CardioCare',
        discount: '23%',
        stock: 65,
        description: 'Prevents strokes and heart attacks.',
        delivery: '1-2 days',
        isPrescriptionRequired: true,
        rating: 4.5,
      },
      {
        id: 12,
        category: 'Medicines',
        name: 'Montelukast 10mg Tablets',
        image: '/04551.webp',
        price: 24,
        originalPrice: 30,
        manufacturer: 'BreatheEasy',
        discount: '20%',
        stock: 120,
        description: 'Prevents asthma and allergies.',
        delivery: '1 day',
        isPrescriptionRequired: false,
        rating: 4.2,
      },
      {
        id: 13,
        category: 'Medicines',
        name: 'Simvastatin 20mg Tablets',
        image: '/04551.webp',
        price: 27,
        originalPrice: 34,
        manufacturer: 'LipidDown',
        discount: '21%',
        stock: 90,
        description: 'Lowers cholesterol levels.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 14,
        category: 'Medicines',
        name: 'Hydrochlorothiazide 25mg Tablets',
        image: '/04551.webp',
        price: 19,
        originalPrice: 24,
        manufacturer: 'WaterBalance',
        discount: '21%',
        stock: 100,
        description: 'Used for fluid retention and high BP.',
        delivery: '2 days',
        isPrescriptionRequired: true,
        rating: 4.1,
      },
      {
        id: 15,
        category: 'Medicines',
        name: 'Dolo 650mg Tablets',
        image: '/04551.webp',
        price: 22,
        originalPrice: 28,
        manufacturer: 'ReliefPharma',
        discount: '21%',
        stock: 140,
        description: 'Pain reliever and fever reducer.',
        delivery: '1 day',
        isPrescriptionRequired: false,
        rating: 4.6,
      },
      {
        id: 6,
        category: 'Medicines',
        name: 'Loratadine 10mg Tablets',
        image: '/04551.webp',
        price: 12,
        originalPrice: 15,
        manufacturer: 'AllerRelief',
        discount: '20%',
        stock: 130,
        description: 'Non-drowsy allergy relief.',
        delivery: '2 days',
        isPrescriptionRequired: false,
        rating: 4.2,
      },
      {
        id: 7,
        category: 'Medicines',
        name: 'Azithromycin 500mg Tablets',
        image: '/04551.webp',
        price: 45,
        originalPrice: 60,
        manufacturer: 'InfectoMed',
        discount: '25%',
        stock: 50,
        description: 'Antibiotic used to treat infections.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 8,
        category: 'Medicines',
        name: 'Aspirin 81mg Tablets',
        image: '/04551.webp',
        price: 14,
        originalPrice: 18,
        manufacturer: 'HeartCare',
        discount: '22%',
        stock: 110,
        description: 'Prevents blood clots and heart attacks.',
        delivery: '1 day',
        isPrescriptionRequired: true,
        rating: 4.5,
      },
      {
        id: 9,
        category: 'Medicines',
        name: 'Omeprazole 20mg Capsules',
        image: '/04551.webp',
        price: 20,
        originalPrice: 25,
        manufacturer: 'DigestPro',
        discount: '20%',
        stock: 95,
        description: 'Treats acid reflux and ulcers.',
        delivery: '2 days',
        isPrescriptionRequired: false,
        rating: 4.3,
      },
      {
        id: 10,
        category: 'Medicines',
        name: 'Losartan 50mg Tablets',
        image: '/04551.webp',
        price: 28,
        originalPrice: 35,
        manufacturer: 'BPHealth',
        discount: '20%',
        stock: 85,
        description: 'Used to treat high blood pressure.',
        delivery: '2 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 11,
        category: 'Medicines',
        name: 'Clopidogrel 75mg Tablets',
        image: '/04551.webp',
        price: 32,
        originalPrice: 42,
        manufacturer: 'CardioCare',
        discount: '23%',
        stock: 65,
        description: 'Prevents strokes and heart attacks.',
        delivery: '1-2 days',
        isPrescriptionRequired: true,
        rating: 4.5,
      },
    
      // ... (rest of your product data would be here)
      // I'm using shortened data for clarity, but your real implementation would include all products
    ];
    

    const fetchDummyProductsByCategory = () => {
      setLoading(true);
      setTimeout(() => {
        try {
          const filtered = category
            ? dummyProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
            : dummyProducts;
          setProducts(filtered);
          setFilteredProducts(filtered);
          setLoading(false);
        } catch (err) {
          setError('Failed to load products.');
          setLoading(false);
          console.error(err);
        }
      }, 1000);
    };

    fetchDummyProductsByCategory();
  }, [category]);

  // Apply filters and search
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter first
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.manufacturer.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    // Apply price filter
    if (priceRange !== 'all') {
      switch(priceRange) {
        case 'under10':
          result = result.filter(p => p.price < 10);
          break;
        case '10to25':
          result = result.filter(p => p.price >= 10 && p.price <= 25);
          break;
        case '25to50':
          result = result.filter(p => p.price > 25 && p.price <= 50);
          break;
        case 'over50':
          result = result.filter(p => p.price > 50);
          break;
        default:
          break;
      }
    }
    
    // Apply rating filter
    if (ratingFilter !== 'all') {
      const minRating = parseInt(ratingFilter, 10);
      result = result.filter(p => p.rating >= minRating);
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
      default:
        // Assuming id is a proxy for popularity (lower id = more popular)
        result.sort((a, b) => a.id - b.id);
        break;
    }
    
    setFilteredProducts(result);
  }, [products, priceRange, ratingFilter, sortBy, searchQuery]);

  // Group products into chunks of 10 for separate sliders
  useEffect(() => {
    const chunks = [];
    for (let i = 0; i < filteredProducts.length; i += 12) {
      chunks.push(filteredProducts.slice(i, i + 12));
    }
    setSliderGroups(chunks);
    
    // Initialize current indices for each slider group
    setCurrentIndices(Array(chunks.length).fill(0));
  }, [filteredProducts]);

  const nextSlide = (sliderIndex) => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      const maxSlides = Math.ceil(sliderGroups[sliderIndex].length / itemsPerView) - 1;
      
      if (newIndices[sliderIndex] >= maxSlides) {
        newIndices[sliderIndex] = 0; // Loop back to start
      } else {
        newIndices[sliderIndex] += 1;
      }
      
      return newIndices;
    });
  };

  const prevSlide = (sliderIndex) => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      const maxSlides = Math.ceil(sliderGroups[sliderIndex].length / itemsPerView) - 1;
      
      if (newIndices[sliderIndex] <= 0) {
        newIndices[sliderIndex] = maxSlides; // Loop to end
      } else {
        newIndices[sliderIndex] -= 1;
      }
      
      return newIndices;
    });
  };

  // Handle dot navigation
  const handleDotClick = (sliderIndex, dotIndex) => {
    setCurrentIndices(prev => {
      const newIndices = [...prev];
      newIndices[sliderIndex] = dotIndex;
      return newIndices;
    });
  };

  return (
    <div className={styles.productsPageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search by medicine name, manufacturer, or description..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.searchButton}>
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingContainer}>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className={styles.filterSection}>
              <h2>Filter Options</h2>
              <div className={styles.filterOptions}>
                <div className={styles.filterGroup}>
                  <label>Price Range</label>
                  <select 
                    className={styles.filterSelect}
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    <option value="under10">Under $10</option>
                    <option value="10to25">$10 - $25</option>
                    <option value="25to50">$25 - $50</option>
                    <option value="over50">Over $50</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Rating</label>
                  <select 
                    className={styles.filterSelect}
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <option value="all">All Ratings</option>
                    <option value="4">4★ & Above</option>
                    <option value="3">3★ & Above</option>
                    <option value="2">2★ & Above</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label>Sort By</label>
                  <select 
                    className={styles.filterSelect}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <>
                {sliderGroups.map((group, groupIndex) => (
                  <div className={styles.productSliderSection} key={`slider-${groupIndex}`}>
                    <h2 className={styles.sectionTitle}>
                      {groupIndex === 0 ? 'Featured Products' : `More Products (${groupIndex + 1})`}
                    </h2>
                    
                    <div className={styles.sliderHeader}>
                      <div className={styles.sliderNavigation}>
                        <button 
                          onClick={() => prevSlide(groupIndex)} 
                          className={`${styles.sliderButton} ${styles.prevButton}`}
                          aria-label="Previous products"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button 
                          onClick={() => nextSlide(groupIndex)} 
                          className={`${styles.sliderButton} ${styles.nextButton}`}
                          aria-label="Next products"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.divider}></div>
                    
                    <div className={styles.sliderContainer}>
                      <div 
                        className={styles.slider} 
                        style={{ 
                          transform: `translateX(-${currentIndices[groupIndex] * (100 / itemsPerView) * itemsPerView}%)`,
                          transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
                        }}
                      >
                        {group.map(product => (
                          <div 
                            key={product.id} 
                            className={styles.sliderItem} 
                            style={{ 
                              flex: `0 0 ${100 / itemsPerView}%` 
                            }}
                          >
                            <div className={styles.medicineCardWrapper}>
                              <MedicineCard product={product} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Dot navigation similar to CategorySection */}
                    <div className={styles.sliderPagination}>
                      {Array(Math.ceil(group.length / itemsPerView)).fill().map((_, i) => (
                        <button 
                          key={i} 
                          className={`${styles.paginationDot} ${i === currentIndices[groupIndex] ? styles.activeDot : ''}`}
                          onClick={() => handleDotClick(groupIndex, i)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className={styles.noProducts}>No products found with the selected filters.</p>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductsPage;
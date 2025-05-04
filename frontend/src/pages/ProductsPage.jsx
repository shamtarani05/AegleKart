import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MedicineCard from '../components/MedicineCard';
import styles from '../styles/productspage.module.css';

const ProductsPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliderIndices, setSliderIndices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [priceRange, setPriceRange] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  // Constants
  const PRODUCTS_PER_SLIDER = 10;
  const CARDS_PER_VIEW = 4;

  useEffect(() => {
    // Full dummy data for e-pharmacy
    const dummyProducts = [
      {
        id: 1,
        category: 'medicine',
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
        category: 'supplement',
        name: 'Vitamin C 1000mg',
        image: '/04551.webp',
        price: 20,
        originalPrice: 25,
        manufacturer: 'HealthPlus',
        discount: '20%',
        stock: 50,
        description: 'Boosts immunity and antioxidant support.',
        delivery: '2-3 days',
        isPrescriptionRequired: false,
        rating: 4.8,
      },
      {
        id: 3,
        category: 'device',
        name: 'Digital Thermometer',
        image: '/04551.webp',
        price: 10,
        originalPrice: 15,
        manufacturer: 'MediTech',
        discount: '33%',
        stock: 30,
        description: 'Quick and accurate temperature readings.',
        delivery: '3-5 days',
        isPrescriptionRequired: false,
        rating: 4.2,
      },
      {
        id: 4,
        category: 'medicine',
        name: 'Ibuprofen 200mg Tablets',
        image: '/04551.webp',
        price: 18,
        originalPrice: 24,
        manufacturer: 'MediCare',
        discount: '25%',
        stock: 80,
        description: 'Reduces inflammation and pain.',
        delivery: '1-2 days',
        isPrescriptionRequired: false,
        rating: 4.6,
      },
      {
        id: 5,
        category: 'supplement',
        name: 'Omega-3 Fish Oil Capsules',
        image: '/04551.webp',
        price: 30,
        originalPrice: 40,
        manufacturer: 'NutriLife',
        discount: '25%',
        stock: 60,
        description: 'Supports heart and brain health.',
        delivery: '2-4 days',
        isPrescriptionRequired: false,
        rating: 4.7,
      },
      {
        id: 6,
        category: 'device',
        name: 'Blood Pressure Monitor',
        image: '/04551.webp',
        price: 50,
        originalPrice: 65,
        manufacturer: 'HealthGuard',
        discount: '23%',
        stock: 20,
        description: 'Track blood pressure at home.',
        delivery: '3-5 days',
        isPrescriptionRequired: false,
        rating: 4.3,
      },
      {
        id: 7,
        category: 'medicine',
        name: 'Amoxicillin 250mg Capsules',
        image: '/04551.webp',
        price: 25,
        originalPrice: 30,
        manufacturer: 'PharmaCure',
        discount: '17%',
        stock: 70,
        description: 'Antibiotic for bacterial infections.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 8,
        category: 'supplement',
        name: 'Calcium + Vitamin D3 Tablets',
        image: '/04551.webp',
        price: 22,
        originalPrice: 28,
        manufacturer: 'BoneStrong',
        discount: '21%',
        stock: 40,
        description: 'Supports bone health and calcium levels.',
        delivery: '1-3 days',
        isPrescriptionRequired: false,
        rating: 4.5,
      },
      {
        id: 9,
        category: 'device',
        name: 'Glucometer Kit',
        image: '/04551.webp',
        price: 45,
        originalPrice: 55,
        manufacturer: 'GlucoCare',
        discount: '18%',
        stock: 25,
        description: 'Monitor your blood glucose levels.',
        delivery: '3-5 days',
        isPrescriptionRequired: false,
        rating: 4.4,
      },
      {
        id: 10,
        category: 'medicine',
        name: 'Cetirizine 10mg Tablets',
        image: '/04551.webp',
        price: 12,
        originalPrice: 16,
        manufacturer: 'AllergyRelief',
        discount: '25%',
        stock: 90,
        description: 'Relieves allergy symptoms.',
        delivery: '1-2 days',
        isPrescriptionRequired: false,
        rating: 4.3,
      },
      {
        id: 11,
        category: 'medicine',
        name: 'Azithromycin 500mg',
        image: '/04551.webp',
        price: 14,
        originalPrice: 18,
        manufacturer: 'Zithromax',
        discount: '22%',
        stock: 60,
        description: 'Antibiotic used to treat respiratory infections.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.2,
      },
      {
        id: 12,
        category: 'medicine',
        name: 'Lisinopril 10mg',
        image: '/04551.webp',
        price: 10,
        originalPrice: 13,
        manufacturer: 'Teva',
        discount: '23%',
        stock: 80,
        description: 'Treats high blood pressure and heart failure.',
        delivery: '1-2 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 13,
        category: 'medicine',
        name: 'Atorvastatin 20mg',
        image: '/04551.webp',
        price: 16,
        originalPrice: 20,
        manufacturer: 'Pfizer',
        discount: '20%',
        stock: 70,
        description: 'Used to lower cholesterol levels.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.5,
      },
      {
        id: 14,
        category: 'medicine',
        name: 'Losartan 50mg',
        image: '/04551.webp',
        price: 11,
        originalPrice: 14,
        manufacturer: 'Sandoz',
        discount: '21%',
        stock: 65,
        description: 'Treats high blood pressure and protects kidneys.',
        delivery: '2 days',
        isPrescriptionRequired: true,
        rating: 4.3,
      },
      {
        id: 15,
        category: 'medicine',
        name: 'Omeprazole 20mg',
        image: '/04551.webp',
        price: 9,
        originalPrice: 11,
        manufacturer: 'Dr. Reddy’s',
        discount: '18%',
        stock: 90,
        description: 'Treats acid reflux and stomach ulcers.',
        delivery: '1-2 days',
        isPrescriptionRequired: false,
        rating: 4.4,
      },
      {
        id: 16,
        category: 'medicine',
        name: 'Clopidogrel 75mg',
        image: '/04551.webp',
        price: 13,
        originalPrice: 16,
        manufacturer: 'Sanofi',
        discount: '19%',
        stock: 50,
        description: 'Prevents blood clots after a heart attack.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.6,
      },
      {
        id: 17,
        category: 'medicine',
        name: 'Hydrochlorothiazide 25mg',
        image: '/04551.webp',
        price: 10,
        originalPrice: 12,
        manufacturer: 'Apotex',
        discount: '17%',
        stock: 55,
        description: 'Diuretic used to treat high blood pressure.',
        delivery: '1-2 days',
        isPrescriptionRequired: true,
        rating: 4.2,
      },
      {
        id: 18,
        category: 'supplement',
        name: 'Iron Tablets',
        image: '/04551.webp',
        price: 17,
        originalPrice: 22,
        manufacturer: 'IronHealth',
        discount: '23%',
        stock: 40,
        description: 'Improves hemoglobin levels.',
        delivery: '2-3 days',
        isPrescriptionRequired: false,
        rating: 4.4,
      },
      {
        id: 19,
        category: 'device',
        name: 'Nebulizer',
        image: '/04551.webp',
        price: 60,
        originalPrice: 75,
        manufacturer: 'BreathEZ',
        discount: '20%',
        stock: 15,
        description: 'Used for asthma and respiratory therapy.',
        delivery: '3-5 days',
        isPrescriptionRequired: false,
        rating: 4.5,
      },
      {
        id: 20,
        category: 'medicine',
        name: 'Metformin 500mg',
        image: '/04551.webp',
        price: 12,
        originalPrice: 15,
        manufacturer: 'Glenmark',
        discount: '20%',
        stock: 100,
        description: 'Controls blood sugar in type 2 diabetes.',
        delivery: '2 days',
        isPrescriptionRequired: true,
        rating: 4.6,
      },
      {
        id: 21,
        category: 'medicine',
        name: 'Amlodipine 5mg',
        image: '/04551.webp',
        price: 14,
        originalPrice: 18,
        manufacturer: 'Sun Pharma',
        discount: '22%',
        stock: 60,
        description: 'Treats high blood pressure and chest pain.',
        delivery: '1-2 days',
        isPrescriptionRequired: true,
        rating: 4.3,
      },
      {
        id: 22,
        category: 'medicine',
        name: 'Montelukast 10mg',
        image: '/04551.webp',
        price: 13,
        originalPrice: 17,
        manufacturer: 'Cipla',
        discount: '24%',
        stock: 70,
        description: 'Prevents asthma and allergy symptoms.',
        delivery: '2-3 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 23,
        category: 'medicine',
        name: 'Salbutamol Inhaler',
        image: '/04551.webp',
        price: 18,
        originalPrice: 22,
        manufacturer: 'GSK',
        discount: '18%',
        stock: 30,
        description: 'Relieves asthma and breathing difficulties.',
        delivery: '1-2 days',
        isPrescriptionRequired: true,
        rating: 4.5,
      },
      {
        id: 24,
        category: 'medicine',
        name: 'Levothyroxine 50mcg',
        image: '/04551.webp',
        price: 11,
        originalPrice: 14,
        manufacturer: 'Merck',
        discount: '21%',
        stock: 100,
        description: 'Used to treat hypothyroidism.',
        delivery: '2 days',
        isPrescriptionRequired: true,
        rating: 4.4,
      },
      {
        id: 25,
        category: 'supplement',
        name: 'Zinc Tablets',
        image: '/04551.webp',
        price: 15,
        originalPrice: 19,
        manufacturer: 'ZincPlus',
        discount: '21%',
        stock: 50,
        description: 'Boosts immune system and healing.',
        delivery: '2-3 days',
        isPrescriptionRequired: false,
        rating: 4.3,
      },
      {
        id: 26,
        category: 'device',
        name: 'Oximeter',
        image: '/04551.webp',
        price: 25,
        originalPrice: 30,
        manufacturer: 'PulseTrack',
        discount: '17%',
        stock: 40,
        description: 'Measures oxygen levels in blood.',
        delivery: '1-3 days',
        isPrescriptionRequired: false,
        rating: 4.4,
      },
      {
        id: 27,
        category: 'device',
        name: 'Infrared Thermometer',
        image: '/04551.webp',
        price: 35,
        originalPrice: 45,
        manufacturer: 'ThermoScan',
        discount: '22%',
        stock: 25,
        description: 'Non-contact temperature measurement.',
        delivery: '2-4 days',
        isPrescriptionRequired: false,
        rating: 4.5,
      },
      {
        id: 28,
        category: 'supplement',
        name: 'Multivitamin Gummies',
        image: '/04551.webp',
        price: 28,
        originalPrice: 35,
        manufacturer: 'GummyWell',
        discount: '20%',
        stock: 60,
        description: 'Daily nutrition support for adults.',
        delivery: '1-2 days',
        isPrescriptionRequired: false,
        rating: 4.6,
      },
      {
        id: 29,
        category: 'medicine',
        name: 'Dolo 650',
        image: '/04551.webp',
        price: 10,
        originalPrice: 13,
        manufacturer: 'Micro Labs',
        discount: '23%',
        stock: 150,
        description: 'Used for fever and mild to moderate pain.',
        delivery: '1-2 days',
        isPrescriptionRequired: false,
        rating: 4.7,
      },
    ];
    

    const fetchDummyProductsByCategory = () => {
      setLoading(true);
      setTimeout(() => {
        try {
          const filtered = category
            ? dummyProducts.filter((p) => p.category === category.toLowerCase())
            : dummyProducts;
          setProducts(filtered);
          setFilteredProducts(filtered);
          
          // Initialize slider indices
          const slidersCount = Math.ceil(filtered.length / PRODUCTS_PER_SLIDER);

          const initialIndices = Array(slidersCount).fill(0);
          setSliderIndices(initialIndices);
          
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
    
    // Reset slider indices when filters change
    const slidersCount = Math.ceil(result.length / PRODUCTS_PER_SLIDER);
    const initialIndices = Array(slidersCount).fill(0);
    setSliderIndices(initialIndices);
    
  }, [products, priceRange, ratingFilter, sortBy, searchQuery]);

  // Group products into sliders
  useEffect(() => {
    const groupedProducts = [];
    for (let i = 0; i < filteredProducts.length; i += PRODUCTS_PER_SLIDER) {
      groupedProducts.push(filteredProducts.slice(i, i + PRODUCTS_PER_SLIDER));
    }
    setDisplayedProducts(groupedProducts);
  }, [filteredProducts]);
  
  // Slider navigation
  const handlePrevSlide = (sliderIndex) => {
    setSliderIndices(prev => {
      const newIndices = [...prev];
      if (newIndices[sliderIndex] > 0) {
        newIndices[sliderIndex] -= 1;
      }
      return newIndices;
    });
  };

  const handleNextSlide = (sliderIndex, productsCount) => {
    setSliderIndices(prev => {
      const newIndices = [...prev];
      const maxSlideIndex = Math.max(0, Math.ceil(productsCount / CARDS_PER_VIEW) - 1);
      if (newIndices[sliderIndex] < maxSlideIndex) {
        newIndices[sliderIndex] += 1;
      } else {
        // Loop back to start when reaching the end
        newIndices[sliderIndex] = 0;
      }
      return newIndices;
    });
  };
  
  // Select specific page in pagination
  const handlePaginationClick = (sliderIndex, dotIndex) => {
    setSliderIndices(prev => {
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
                {displayedProducts.map((sliderProducts, sliderIdx) => (
                  <div className={styles.productSliderSection} key={`slider-${sliderIdx}`}>
                    <h2 className={styles.sectionTitle}>
                      {sliderIdx === 0 ? 'Featured Products' : `More Products (${sliderIdx + 1})`}
                    </h2>
                    
                    <div className={styles.sliderNavigation}>
                      <button 
                        className={`${styles.sliderButton} ${styles.prevButton} ${sliderIndices[sliderIdx] === 0 ? styles.disabled : ''}`}
                        onClick={() => handlePrevSlide(sliderIdx)}
                        disabled={sliderIndices[sliderIdx] === 0}
                      >
                        &lt;
                      </button>
                      <button 
                        className={`${styles.sliderButton} ${styles.nextButton}`}
                        onClick={() => handleNextSlide(sliderIdx, sliderProducts.length)}
                      >
                        &gt;
                      </button>
                    </div>
                    
                    <div className={styles.sliderContainer}>
                      <div 
                        className={styles.slider} 
                        style={{ transform: `translateX(-${sliderIndices[sliderIdx] * 100}%)` }}
                      >
                        {sliderProducts.map(product => (
                          <div key={product.id} className={styles.sliderItem}>
                            <div className={styles.medicineCardWrapper}>
                              <MedicineCard product={product} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className={styles.sliderPagination}>
                      {Array(Math.ceil(sliderProducts.length / CARDS_PER_VIEW)).fill().map((_, i) => (
                        <button 
                          key={i} 
                          className={`${styles.paginationDot} ${i === sliderIndices[sliderIdx] ? styles.activeDot : ''}`}
                          onClick={() => handlePaginationClick(sliderIdx, i)}
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
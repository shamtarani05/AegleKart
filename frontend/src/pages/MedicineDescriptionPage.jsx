// MedicineDescriptionPage.jsx
import { useState } from 'react';
import { Star, Heart, Clock, Check, Truck, ArrowLeft, Share2, Info, Shield, ChevronDown, Plus, Minus } from 'lucide-react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/medicinedescriptionpage.module.css';

// Sample product data - in real implementation this would come from your backend
const medicineData = {
  id: "med123",
  name: "Amlopress 5mg Tablet",
  brandName: "Cipla Pharmaceuticals",
  price: 189.50,
  discountedPrice: 152.75,
  discount: 20,
  rating: 4.7,
  reviewCount: 124,
  stockStatus: "In Stock",
  deliveryTime: "24 hours",
  description: "Amlopress 5mg Tablet is used to treat high blood pressure and prevent chest pain (angina). It helps to lower high blood pressure and thus reduces the chances of future heart attack and stroke. It is a calcium channel blocker which relaxes blood vessels, improving blood flow and oxygen supply.",
  packSize: "15 tablets per strip",
  composition: "Amlodipine 5mg",
  mfgDate: "June 2024",
  expDate: "May 2026",
  prescriptionRequired: true,
  images: [
    "/api/placeholder/350/350", 
    "/api/placeholder/350/350",
    "/api/placeholder/350/350"
  ],
  keyBenefits: [
    "Controls high blood pressure",
    "Prevents chest pain (angina)",
    "Reduces risk of heart attack",
    "Can be taken with or without food"
  ],
  sideEffects: [
    "Headache", 
    "Dizziness",
    "Edema (swelling)", 
    "Fatigue"
  ],
  usageDirections: "Take this medicine as advised by your doctor. Swallow it with water. It can be taken with or without food. It is best to take this medicine at the same time each day."
};

// Similar products - in real implementation would be fetched from backend
const similarProducts = [
  {
    id: "med124",
    name: "Telma 40mg Tablet",
    brandName: "Glenmark",
    price: 172.25,
    image: "/api/placeholder/100/100"
  },
  {
    id: "med125",
    name: "Atenolol 50mg Tablet",
    brandName: "Sun Pharma",
    price: 45.50,
    image: "/api/placeholder/100/100"
  },
  {
    id: "med126",
    name: "Metoprolol XL 50mg",
    brandName: "AstraZeneca",
    price: 220.75,
    image: "/api/placeholder/100/100"
  }
];

export default function MedicineDescriptionPage() {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <>
    <Header/>
    <div className={styles.pageContainer}>
      {/* Navigation breadcrumb */}
      <div className={styles.breadcrumbContainer}>
        <div className={styles.breadcrumbWrapper}>
          <span className={styles.breadcrumbLink}>Home</span>
          <span>/</span>
          <span className={styles.breadcrumbLink}>Medicines</span>
          <span>/</span>
          <span className={styles.breadcrumbLink}>Blood Pressure</span>
          <span>/</span>
          <span>{medicineData.name}</span>
        </div>
      </div>

      {/* Back button */}
      <div className={styles.container}>
        <button className={styles.backButton}>
          <ArrowLeft size={18} className={styles.backIcon} />
          Back to Medicines
        </button>
      </div>

      {/* Main content */}
      <div className={styles.container}>
        <div className={styles.mainCard}>
          {/* Product overview section */}
          <div className={styles.productGrid}>
            {/* Product images */}
            <div className={styles.productImageSection}>
              <div className={styles.mainImageContainer}>
                <img 
                  src={medicineData.images[activeImage]} 
                  alt={medicineData.name}
                  className={styles.mainImage}
                />
              </div>
              <div className={styles.imageThumbnailContainer}>
                {medicineData.images.map((img, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnailWrapper} ${activeImage === index ? styles.activeThumbnail : ''}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${medicineData.name} - view ${index + 1}`}
                      className={styles.thumbnailImage}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className={styles.productInfoSection}>
              <div className={styles.productHeader}>
                <div>
                  <h1 className={styles.productTitle}>{medicineData.name}</h1>
                  <p className={styles.brandInfo}>By <span className={styles.brandName}>{medicineData.brandName}</span></p>
                  
                  <div className={styles.ratingContainer}>
                    <div className={styles.ratingBadge}>
                      <Star size={16} className={styles.starIcon} />
                      <span className={styles.ratingText}>{medicineData.rating}</span>
                    </div>
                    <span className={styles.reviewCount}>{medicineData.reviewCount} Reviews</span>
                  </div>
                </div>
                
                <button className={styles.wishlistButton}>
                  <Heart size={24} />
                </button>
              </div>

              {medicineData.prescriptionRequired && (
                <div className={styles.prescriptionAlert}>
                  <Info size={18} className={styles.infoIcon} />
                  <span>This medicine requires a valid prescription</span>
                </div>
              )}

              <div className={styles.priceSection}>
                <div className={styles.priceDisplay}>
                  <span className={styles.currentPrice}>₹{medicineData.discountedPrice}</span>
                  <span className={styles.originalPrice}>₹{medicineData.price}</span>
                  <span className={styles.discountText}>{medicineData.discount}% off</span>
                </div>
                <p className={styles.taxInfo}>Inclusive of all taxes</p>
              </div>

              <div className={styles.deliveryInfoSection}>
                <div className={styles.infoItem}>
                  <Clock size={20} className={styles.infoIcon} />
                  <span className={styles.infoText}>
                    Delivery within <span className={styles.infoHighlight}>{medicineData.deliveryTime}</span>
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Check size={20} className={styles.checkIcon} />
                  <span className={styles.infoText}>
                    <span className={styles.stockStatus}>{medicineData.stockStatus}</span>
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <Truck size={20} className={styles.infoIcon} />
                  <div>
                    <span className={styles.infoText}>Free delivery on orders above ₹200</span>
                  </div>
                </div>
              </div>

              <div className={styles.quantitySection}>
                <div className={styles.quantitySelector}>
                  <label htmlFor="quantity" className={styles.quantityLabel}>Quantity:</label>
                  <div className={styles.quantityControls}>
                    <button 
                      className={styles.quantityButton} 
                      onClick={decrementQuantity}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantityValue}>{quantity}</span>
                    <button 
                      className={styles.quantityButton} 
                      onClick={incrementQuantity}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className={styles.packSizeInfo}>
                  <span className={styles.packSizeLabel}>Pack size: </span>
                  <span className={styles.packSizeValue}>{medicineData.packSize}</span>
                </div>
              </div>

              <div className={styles.actionButtonsContainer}>
                <button className={styles.addToCartButton}>
                  Add to Cart
                </button>
                <button className={styles.shareButton}>
                  <Share2 size={18} className={styles.shareIcon} />
                  Share
                </button>
              </div>

              <div className={styles.securityNote}>
                <Shield size={18} className={styles.shieldIcon} />
                <span className={styles.securityText}>100% Genuine Products | Secure Payments</span>
              </div>
            </div>
          </div>

          {/* Tabs section */}
          <div className={styles.tabsSection}>
            <div className={styles.tabsHeader}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'description' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'benefits' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits & Uses
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'sideEffects' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('sideEffects')}
              >
                Side Effects
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'directions' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('directions')}
              >
                Directions for Use
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Product Info
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'description' && (
                <div>
                  <h3 className={styles.tabContentTitle}>About {medicineData.name}</h3>
                  <p className={styles.tabContentText}>{medicineData.description}</p>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div>
                  <h3 className={styles.tabContentTitle}>Key Benefits</h3>
                  <ul className={styles.benefitsList}>
                    {medicineData.keyBenefits.map((benefit, index) => (
                      <li key={index} className={styles.benefitItem}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'sideEffects' && (
                <div>
                  <h3 className={styles.tabContentTitle}>Possible Side Effects</h3>
                  <p className={styles.tabContentText}>All medicines may cause side effects, but many people have no, or minor, side effects. Check with your doctor if any of these side effects persist or become bothersome:</p>
                  <ul className={styles.effectsList}>
                    {medicineData.sideEffects.map((effect, index) => (
                      <li key={index} className={styles.effectItem}>{effect}</li>
                    ))}
                  </ul>
                  <p className={styles.disclaimerText}>This is not a complete list of side effects and others may occur. Please consult your doctor or pharmacist for advice about side effects.</p>
                </div>
              )}

              {activeTab === 'directions' && (
                <div>
                  <h3 className={styles.tabContentTitle}>How to Use</h3>
                  <p className={styles.tabContentText}>{medicineData.usageDirections}</p>
                </div>
              )}

              {activeTab === 'info' && (
                <div className={styles.infoGrid}>
                  <div>
                    <h3 className={styles.tabContentTitle}>Product Information</h3>
                    <div className={styles.infoTable}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Brand</span>
                        <span className={styles.infoValue}>{medicineData.brandName}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Composition</span>
                        <span className={styles.infoValue}>{medicineData.composition}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Pack Size</span>
                        <span className={styles.infoValue}>{medicineData.packSize}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Mfg. Date</span>
                        <span className={styles.infoValue}>{medicineData.mfgDate}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Exp. Date</span>
                        <span className={styles.infoValue}>{medicineData.expDate}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className={styles.tabContentTitle}>Storage Instructions</h3>
                    <ul className={styles.storageList}>
                      <li className={styles.storageItem}>Store in a cool, dry place away from direct sunlight</li>
                      <li className={styles.storageItem}>Keep out of reach of children</li>
                      <li className={styles.storageItem}>Do not use after the expiry date</li>
                      <li className={styles.storageItem}>Store below 30°C</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className={styles.similarProductsSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Similar Products</h2>
            <div className={styles.navigationButtons}>
              <button className={styles.navButton}>
                <ArrowLeft size={18} />
              </button>
              <button className={styles.navButton}>
                <ArrowLeft size={18} className={styles.rotateIcon} />
              </button>
            </div>
          </div>
          
          <div className={styles.productsGrid}>
            {similarProducts.map(product => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productCardContent}>
                  <div className={styles.productImageContainer}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={styles.productThumbnail}
                    />
                  </div>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productBrand}>{product.brandName}</p>
                  <div className={styles.productFooter}>
                    <span className={styles.productPrice}>₹{product.price}</span>
                    <button className={styles.addButton}>Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          
          <div className={styles.faqList}>
            <div className={styles.faqItem}>
              <button className={styles.faqQuestion}>
                <span>Can I take this medicine without a prescription?</span>
                <ChevronDown size={20} />
              </button>
            </div>
            
            <div className={styles.faqItem}>
              <button className={styles.faqQuestion}>
                <span>What should I do if I miss a dose?</span>
                <ChevronDown size={20} />
              </button>
            </div>
            
            <div className={styles.faqItem}>
              <button className={styles.faqQuestion}>
                <span>Can I take this medicine during pregnancy?</span>
                <ChevronDown size={20} />
              </button>
            </div>
            
            <div className={styles.faqItem}>
              <button className={styles.faqQuestion}>
                <span>How should I store this medicine?</span>
                <ChevronDown size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className={styles.recentlyViewedSection}>
          <h2 className={styles.sectionTitle}>Recently Viewed</h2>
          
          <div className={styles.recentProductsGrid}>
            {similarProducts.slice(0, 6).map(product => (
              <div key={`rv-${product.id}`} className={styles.recentProductCard}>
                <div className={styles.recentProductContent}>
                  <div className={styles.recentProductImageContainer}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className={styles.recentProductImage}
                    />
                  </div>
                  <h3 className={styles.recentProductName}>{product.name}</h3>
                  <div className={styles.recentProductFooter}>
                    <span className={styles.recentProductPrice}>₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
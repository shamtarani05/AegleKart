// ProductDescriptionPage.jsx
import { useState } from 'react';
import { Star, Heart, Clock, Check, Truck, ArrowLeft, Share2, Info, Shield, ChevronDown, Plus, Minus } from 'lucide-react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/medicinedescriptionpage.module.css';

// Sample product data
const dummyProductData = {
  id: "med001",
  name: "Amlopress 5mg Tablet",
  brandName: "Cipla Pharmaceuticals",
  formula: "C20H25ClN2O5",
  price: 189.50,
  discountedPrice: 152.75,
  discount: 20,
  rating: 4.7,
  reviewCount: 124,
  stockStatus: "In Stock",
  deliveryTime: "24 hours",
  description: "Amlodipine tablet used to treat high blood pressure and angina. It relaxes blood vessels for better blood flow.",
  packSize: "15 tablets per strip",
  composition: "Amlodipine 5mg",
  mfgDate: "June 2024",
  expDate: "May 2026",
  prescriptionRequired: true,
  images: [
    "https://www.netmeds.com/images/product-v1/600x600/530530/amlopres_5mg_tablet_15_s_0.jpg" // Using placeholder image
  ],
  keyBenefits: [
    "Controls hypertension",
    "Prevents angina",
    "Improves blood circulation"
  ],
  sideEffects: ["Headache", "Swelling", "Dizziness"],
  usageDirections: "Take once daily with or without food.",
  similarProducts: [
    {
      id: "med002",
      name: "Telma 40mg Tablet",
      brandName: "Glenmark",
      price: 172.25,
      image: "/api/placeholder/100/100"
    },
    {
      id: "med003",
      name: "Atenolol 50mg Tablet",
      brandName: "Sun Pharma",
      price: 45.50,
      image: "/api/placeholder/100/100"
    },
    {
      id: "med004",
      name: "Metoprolol XL 50mg",
      brandName: "AstraZeneca",
      price: 220.75,
      image: "/api/placeholder/100/100"
    }
  ]
};

export default function ProductDescriptionPage() {
  // Use the dummy data directly
  const productData = dummyProductData;
  const similarProducts = productData.similarProducts || [];
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

  // Helper function to safely access nested properties
  const getValueSafely = (obj, path, defaultValue = '') => {
    if (!obj) return defaultValue;
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        return defaultValue;
      }
    }
    return result === null || result === undefined ? defaultValue : result;
  };

  // Handle empty images array
  const images = productData?.images?.length ? productData.images : ["/api/placeholder/350/350"];

  // Determine product category for breadcrumb (can be enhanced with real categorization logic)
  const productCategory = productData?.category || "Products";
  const productSubCategory = productData?.subCategory || "";

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        {/* Navigation breadcrumb */}
        <div className={styles.breadcrumbContainer}>
          <div className={styles.breadcrumbWrapper}>
            <span className={styles.breadcrumbLink}>Home</span>
            <span>/</span>
            <span className={styles.breadcrumbLink}>{productCategory}</span>
            {productSubCategory && (
              <>
                <span>/</span>
                <span className={styles.breadcrumbLink}>{productSubCategory}</span>
              </>
            )}
            <span>/</span>
            <span>{getValueSafely(productData, 'name')}</span>
          </div>
        </div>

        {/* Back button */}
        <div className={styles.container}>
          <button className={styles.backButton}>
            <ArrowLeft size={18} className={styles.backIcon} />
            Back to {productCategory}
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
                    src={images[activeImage]}
                    alt={getValueSafely(productData, 'name')}
                    className={styles.mainImage}
                  />
                </div>
                {images.length > 1 && (
                  <div className={styles.imageThumbnailContainer}>
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className={`${styles.thumbnailWrapper} ${activeImage === index ? styles.activeThumbnail : ''}`}
                        onClick={() => setActiveImage(index)}
                      >
                        <img
                          src={img}
                          alt={`${getValueSafely(productData, 'name')} - view ${index + 1}`}
                          className={styles.thumbnailImage}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className={styles.productInfoSection}>
                <div className={styles.productHeader}>
                  <div>
                    {productData?.name && (
                      <h1 className={styles.productTitle}>{productData.name}</h1>
                    )}

                    {productData?.brandName && (
                      <p className={styles.brandInfo}>By <span className={styles.brandName}>{productData.brandName}</span></p>
                    )}

                    {(productData?.rating || productData?.reviewCount) && (
                      <div className={styles.ratingContainer}>
                        {productData?.rating && (
                          <div className={styles.ratingBadge}>
                            <Star size={16} className={styles.starIcon} />
                            <span className={styles.ratingText}>{productData.rating}</span>
                          </div>
                        )}
                        {productData?.reviewCount && (
                          <span className={styles.reviewCount}>{productData.reviewCount} Reviews</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button className={styles.wishlistButton}>
                    <Heart size={24} />
                  </button>
                </div>

                {productData?.prescriptionRequired && (
                  <div className={styles.prescriptionAlert}>
                    <Info size={18} className={styles.infoIcon} />
                    <span>This product requires a valid prescription</span>
                  </div>
                )}

                {(productData?.price || productData?.discountedPrice) && (
                  <div className={styles.priceSection}>
                    <div className={styles.priceDisplay}>
                      {productData?.discountedPrice && (
                        <span className={styles.currentPrice}>₹{productData.discountedPrice}</span>
                      )}
                      {productData?.price && (
                        <span className={productData?.discountedPrice ? styles.originalPrice : styles.currentPrice}>
                          ₹{productData.price}
                        </span>
                      )}
                      {productData?.discount && (
                        <span className={styles.discountText}>{productData.discount}% off</span>
                      )}
                    </div>
                    <p className={styles.taxInfo}>Inclusive of all taxes</p>
                  </div>
                )}

                <div className={styles.deliveryInfoSection}>
                  {productData?.deliveryTime && (
                    <div className={styles.infoItem}>
                      <Clock size={20} className={styles.infoIcon} />
                      <span className={styles.infoText}>
                        Delivery within <span className={styles.infoHighlight}>{productData.deliveryTime}</span>
                      </span>
                    </div>
                  )}

                  {productData?.stockStatus && (
                    <div className={styles.infoItem}>
                      <Check size={20} className={styles.checkIcon} />
                      <span className={styles.infoText}>
                        <span className={styles.stockStatus}>{productData.stockStatus}</span>
                      </span>
                    </div>
                  )}

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

                  {productData?.packSize && (
                    <div className={styles.packSizeInfo}>
                      <span className={styles.packSizeLabel}>Pack size: </span>
                      <span className={styles.packSizeValue}>{productData.packSize}</span>
                    </div>
                  )}
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
                {productData?.description && (
                  <button
                    className={`${styles.tabButton} ${activeTab === 'description' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('description')}
                  >
                    Description
                  </button>
                )}

                {productData?.keyBenefits?.length > 0 && (
                  <button
                    className={`${styles.tabButton} ${activeTab === 'benefits' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('benefits')}
                  >
                    Benefits & Uses
                  </button>
                )}

                {productData?.sideEffects?.length > 0 && (
                  <button
                    className={`${styles.tabButton} ${activeTab === 'sideEffects' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('sideEffects')}
                  >
                    Side Effects
                  </button>
                )}

                {productData?.usageDirections && (
                  <button
                    className={`${styles.tabButton} ${activeTab === 'directions' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('directions')}
                  >
                    Directions for Use
                  </button>
                )}

                <button
                  className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Product Info
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'description' && productData?.description && (
                  <div>
                    <h3 className={styles.tabContentTitle}>About {getValueSafely(productData, 'name')}</h3>
                    <p className={styles.tabContentText}>{productData.description}</p>
                  </div>
                )}

                {activeTab === 'benefits' && productData?.keyBenefits?.length > 0 && (
                  <div>
                    <h3 className={styles.tabContentTitle}>Key Benefits</h3>
                    <ul className={styles.benefitsList}>
                      {productData.keyBenefits.map((benefit, index) => (
                        <li key={index} className={styles.benefitItem}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'sideEffects' && productData?.sideEffects?.length > 0 && (
                  <div>
                    <h3 className={styles.tabContentTitle}>Possible Side Effects</h3>
                    <p className={styles.tabContentText}>All products may cause side effects, but many people have no, or minor, side effects. Check with your doctor if any of these side effects persist or become bothersome:</p>
                    <ul className={styles.effectsList}>
                      {productData.sideEffects.map((effect, index) => (
                        <li key={index} className={styles.effectItem}>{effect}</li>
                      ))}
                    </ul>
                    <p className={styles.disclaimerText}>This is not a complete list of side effects and others may occur. Please consult your doctor or pharmacist for advice about side effects.</p>
                  </div>
                )}

                {activeTab === 'directions' && productData?.usageDirections && (
                  <div>
                    <h3 className={styles.tabContentTitle}>How to Use</h3>
                    <p className={styles.tabContentText}>{productData.usageDirections}</p>
                  </div>
                )}

                {activeTab === 'info' && (
                  <div className={styles.infoGrid}>
                    <div>
                      <h3 className={styles.tabContentTitle}>Product Information</h3>
                      <div className={styles.infoTable}>
                        {productData?.brandName && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Brand</span>
                            <span className={styles.infoValue}>{productData.brandName}</span>
                          </div>
                        )}

                        {productData?.composition && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Composition</span>
                            <span className={styles.infoValue}>{productData.composition}</span>
                          </div>
                        )}

                        {productData?.formula && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Formula</span>
                            <span className={styles.infoValue}>{productData.formula}</span>
                          </div>
                        )}

                        {productData?.packSize && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Pack Size</span>
                            <span className={styles.infoValue}>{productData.packSize}</span>
                          </div>
                        )}

                        {productData?.mfgDate && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Mfg. Date</span>
                            <span className={styles.infoValue}>{productData.mfgDate}</span>
                          </div>
                        )}

                        {productData?.expDate && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Exp. Date</span>
                            <span className={styles.infoValue}>{productData.expDate}</span>
                          </div>
                        )}

                        {/* Additional generic fields can be added dynamically */}
                        {Object.entries(productData || {}).map(([key, value]) => {
                          // Skip fields that are already displayed or should not be displayed in the info table
                          const skipFields = [
                            'name', 'brandName', 'composition', 'formula', 'packSize', 'mfgDate', 'expDate',
                            'price', 'discountedPrice', 'discount', 'rating', 'reviewCount', 'stockStatus',
                            'deliveryTime', 'description', 'keyBenefits', 'sideEffects', 'usageDirections',
                            'prescriptionRequired', 'images', 'similarProducts', 'id', 'category', 'subCategory'
                          ];

                          if (skipFields.includes(key) || typeof value === 'object') return null;

                          // Format the key for display (convert camelCase to Title Case)
                          const formattedKey = key.replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase());

                          return (
                            <div key={key} className={styles.infoRow}>
                              <span className={styles.infoLabel}>{formattedKey}</span>
                              <span className={styles.infoValue}>{value.toString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className={styles.tabContentTitle}>Storage Instructions</h3>
                      <ul className={styles.storageList}>
                        <li className={styles.storageItem}>Store in a cool, dry place away from direct sunlight</li>
                        <li className={styles.storageItem}>Keep out of reach of children</li>
                        <li className={styles.storageItem}>Do not use after the expiry date</li>
                        {productData?.storageInstructions?.map((instruction, index) => (
                          <li key={index} className={styles.storageItem}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {similarProducts?.length > 0 && (
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
                          src={product.image || "/api/placeholder/100/100"}
                          alt={product.name || "Product"}
                          className={styles.productThumbnail}
                        />
                      </div>
                      <h3 className={styles.productName}>{product.name || "Product Name"}</h3>
                      {product.brandName && <p className={styles.productBrand}>{product.brandName}</p>}
                      <div className={styles.productFooter}>
                        {product.price && <span className={styles.productPrice}>₹{product.price}</span>}
                        <button className={styles.addButton}>Add</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

            <div className={styles.faqList}>
              {(productData?.faqs || [
                { question: "Can I use this product without a prescription?" },
                { question: "What should I do if I miss a dose?" },
                { question: "Can I use this during pregnancy?" },
                { question: "How should I store this product?" }
              ]).map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <button className={styles.faqQuestion}>
                    <span>{faq.question}</span>
                    <ChevronDown size={20} />
                  </button>
                  {faq.answer && (
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed - Optional section that can be shown conditionally */}
          {productData?.recentlyViewed?.length > 0 && (
            <div className={styles.recentlyViewedSection}>
              <h2 className={styles.sectionTitle}>Recently Viewed</h2>

              <div className={styles.recentProductsGrid}>
                {productData.recentlyViewed.map(product => (
                  <div key={`rv-${product.id}`} className={styles.recentProductCard}>
                    <div className={styles.recentProductContent}>
                      <div className={styles.recentProductImageContainer}>
                        <img
                          src={product.image || "/api/placeholder/100/100"}
                          alt={product.name || "Product"}
                          className={styles.recentProductImage}
                        />
                      </div>
                      <h3 className={styles.recentProductName}>{product.name || "Product Name"}</h3>
                      <div className={styles.recentProductFooter}>
                        {product.price && <span className={styles.recentProductPrice}>₹{product.price}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
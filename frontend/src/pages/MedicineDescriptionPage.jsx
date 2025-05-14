// ProductDescriptionPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Clock, Check, Truck, ArrowLeft, Share2, Info, Shield, ChevronDown, Plus, Minus, MessageSquare } from 'lucide-react';
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/medicinedescriptionpage.module.css';
import useCartStore from '../stores/cart-store'; // Import the cart store

export default function ProductDescriptionPage() {
  const { id } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [openFaqIndex, setOpenFaqIndex] = useState(null); // Add state to track open FAQ
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userReview, setUserReview] = useState({
    userName: '',
    rating: 5,
    title: '',
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Cart store functions
  const addToCart = useCartStore(state => state.addToCart);

  useEffect(() => {
    // Fetch product data from API
    const fetchProductData = async () => {
      try {
        setLoading(true);
        console.log(id);
        const response = await fetch(`http://localhost:3000/products/details/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProductData(data);
        console.log(data)
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  useEffect(() => {
    // Fetch reviews when product data is loaded
    const fetchReviews = async () => {
      if (!productData || !productData._id) return;
      
      try {
        setReviewsLoading(true);
        const response = await fetch(`http://localhost:3000/reviews/product/${productData._id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }
        
        const reviewsData = await response.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [productData]);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle add to cart functionality
  const handleAddToCart = () => {
    if (productData) {
      const itemToAdd = {
        id: productData.id,
        name: productData.name,
        price: productData.discountedPrice || productData.price,
        image: productData.images?.[0] || "/api/placeholder/100/100",
        quantity: quantity,
        brandName: productData.brandName,
        category : productData.category
      };
      
      addToCart(itemToAdd);
      
      // Optional: Show confirmation message or toast notification
      alert(`Added ${quantity} ${productData.name} to cart`);
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

  // Check if product is in stock
  const isInStock = productData?.stockStatus?.toLowerCase() === 'in stock';

  // Toggle FAQ answer visibility
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Handle review form changes
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setUserReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle star rating click
  const handleStarClick = (rating) => {
    setUserReview(prev => ({
      ...prev,
      rating
    }));
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);
    
    // Validate form
    if (!userReview.userName.trim()) {
      setReviewError("Please enter your name");
      return;
    }
    if (!userReview.title.trim()) {
      setReviewError("Please enter a review title");
      return;
    }
    if (!userReview.comment.trim()) {
      setReviewError("Please enter your review comments");
      return;
    }
    
    try {
      setReviewSubmitting(true);
      
      const response = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: productData._id,
          ...userReview
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }
      
      // Reset form and show success message
      setUserReview({
        userName: '',
        rating: 5,
        title: '',
        comment: ''
      });
      
      setReviewSuccess(true);
      
      // Reload reviews and update product data to show new rating
      const reviewsResponse = await fetch(`http://localhost:3000/reviews/product/${productData._id}`);
      const newReviews = await reviewsResponse.json();
      setReviews(newReviews);
      
      // Refresh product data to get updated rating and review count
      const productResponse = await fetch(`http://localhost:3000/products/details/${id}`);
      const updatedProduct = await productResponse.json();
      setProductData(updatedProduct);
      
      // Hide form after successful submission
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading product information...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Handle error state
  if (error || !productData) {
    return (
      <>
        <Header />
        <div className={styles.errorContainer}>
          <h2>Something went wrong</h2>
          <p>{error || "Product not found"}</p>
          <button className={styles.backButton} onClick={() => window.history.back()}>
            <ArrowLeft size={18} className={styles.backIcon} />
            Back to Products
          </button>
        </div>
        <Footer />
      </>
    );
  }

  // Handle empty images array
  const images = productData?.images?.length ? productData.images : ["/api/placeholder/350/350"];

  // Determine product category for breadcrumb
  const productCategory = productData?.category || "Products";
  const productSubCategory = productData?.subCategory || "";
  const similarProducts = productData?.similarProducts || [];

  // Format dates if they exist
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    } catch (err) {
      console.log(err)
      return dateString; // Return as-is if can't be parsed
    }
  };

  const formattedMfgDate = formatDate(productData?.mfgDate);
  const formattedExpDate = formatDate(productData?.expDate);

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
          <button className={styles.backButton} onClick={() => window.history.back()}>
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

                  <button className={styles.wishlistButton} aria-label="Add to wishlist">
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
                      {isInStock ? (
                        <Check size={20} className={styles.checkIcon} />
                      ) : (
                        <Info size={20} className={styles.infoIcon} />
                      )}
                      <span className={styles.infoText}>
                        <span className={`${styles.stockStatus} ${isInStock ? styles.inStock : styles.outOfStock}`}>
                          {productData.stockStatus}
                        </span>
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
                        aria-label="Decrease quantity"
                        disabled={!isInStock}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantityValue}>{quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={incrementQuantity}
                        aria-label="Increase quantity"
                        disabled={!isInStock}
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
                  <button 
                    className={`${styles.addToCartButton} ${!isInStock ? styles.disabledButton : ''}`}
                    onClick={handleAddToCart}
                    disabled={!isInStock}
                  >
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
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

                <button
                  className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews {productData?.reviewCount > 0 && `(${productData.reviewCount})`}
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

                        {formattedMfgDate && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Mfg. Date</span>
                            <span className={styles.infoValue}>{formattedMfgDate}</span>
                          </div>
                        )}

                        {formattedExpDate && (
                          <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Exp. Date</span>
                            <span className={styles.infoValue}>{formattedExpDate}</span>
                          </div>
                        )}

                        {/* Additional generic fields can be added dynamically */}
                        {Object.entries(productData || {}).map(([key, value]) => {
                          // Skip fields that are already displayed or should not be displayed in the info table
                          const skipFields = [
                            'name', 'brandName', 'composition', 'formula', 'packSize', 'mfgDate', 'expDate',
                            'price', 'discountedPrice', 'discount', 'rating', 'reviewCount', 'stockStatus',
                            'deliveryTime', 'description', 'keyBenefits', 'sideEffects', 'usageDirections',
                            'prescriptionRequired', 'images', 'similarProducts', 'id', 'category', 'subCategory',
                            '_id', '__v', 'createdAt', 'updatedAt', 'quantity'
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

                {activeTab === 'reviews' && (
                  <div className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                      <div className={styles.reviewsOverview}>
                        <h3 className={styles.tabContentTitle}>Customer Reviews</h3>
                        {productData?.rating && productData?.reviewCount ? (
                          <div className={styles.ratingOverview}>
                            <div className={styles.ratingStars}>
                              <div className={styles.ratingValue}>{productData.rating}</div>
                              <div className={styles.starsDisplay}>
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star 
                                    key={star}
                                    size={18} 
                                    fill={star <= Math.round(productData.rating) ? "#FFB400" : "none"}
                                    color={star <= Math.round(productData.rating) ? "#FFB400" : "#D1D1D1"}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className={styles.reviewsCount}>
                              Based on {productData.reviewCount} {productData.reviewCount === 1 ? 'review' : 'reviews'}
                            </div>
                          </div>
                        ) : (
                          <div className={styles.noReviews}>
                            No reviews yet. Be the first to review this product.
                          </div>
                        )}
                      </div>
                      
                      <button 
                        className={styles.writeReviewButton}
                        onClick={() => setShowReviewForm(!showReviewForm)}
                      >
                        <MessageSquare size={16} />
                        {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                      </button>
                    </div>

                    {showReviewForm && (
                      <div className={styles.reviewFormContainer}>
                        <h4 className={styles.reviewFormTitle}>Write Your Review</h4>
                        
                        {reviewSuccess && (
                          <div className={styles.reviewSuccessMessage}>
                            Your review has been submitted successfully! Thank you for your feedback.
                          </div>
                        )}
                        
                        {reviewError && (
                          <div className={styles.reviewErrorMessage}>
                            {reviewError}
                          </div>
                        )}
                        
                        <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                          <div className={styles.formGroup}>
                            <label htmlFor="userName" className={styles.formLabel}>Name</label>
                            <input
                              type="text"
                              id="userName"
                              name="userName"
                              className={styles.formInput}
                              value={userReview.userName}
                              onChange={handleReviewChange}
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Rating</label>
                            <div className={styles.ratingInput}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                  key={star}
                                  size={24} 
                                  fill={star <= userReview.rating ? "#FFB400" : "none"}
                                  color={star <= userReview.rating ? "#FFB400" : "#D1D1D1"}
                                  className={styles.starInput}
                                  onClick={() => handleStarClick(star)}
                                />
                              ))}
                            </div>
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.formLabel}>Review Title</label>
                            <input
                              type="text"
                              id="title"
                              name="title"
                              className={styles.formInput}
                              value={userReview.title}
                              onChange={handleReviewChange}
                              placeholder="Summarize your review"
                              required
                            />
                          </div>
                          
                          <div className={styles.formGroup}>
                            <label htmlFor="comment" className={styles.formLabel}>Review Comment</label>
                            <textarea
                              id="comment"
                              name="comment"
                              className={styles.formTextarea}
                              value={userReview.comment}
                              onChange={handleReviewChange}
                              placeholder="Tell others about your experience with this product"
                              rows={4}
                              required
                            ></textarea>
                          </div>
                          
                          <button 
                            type="submit" 
                            className={styles.submitReviewButton}
                            disabled={reviewSubmitting}
                          >
                            {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </form>
                      </div>
                    )}
                    
                    <div className={styles.reviewsList}>
                      {reviewsLoading ? (
                        <div className={styles.reviewsLoading}>
                          <div className={styles.loadingSpinner}></div>
                          <p>Loading reviews...</p>
                        </div>
                      ) : reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <div key={review._id || index} className={styles.reviewItem}>
                            <div className={styles.reviewHeader}>
                              <div className={styles.reviewAuthor}>{review.userName}</div>
                              <div className={styles.reviewDate}>
                                {new Date(review.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className={styles.reviewRating}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                  key={star}
                                  size={16} 
                                  fill={star <= review.rating ? "#FFB400" : "none"}
                                  color={star <= review.rating ? "#FFB400" : "#D1D1D1"}
                                />
                              ))}
                              {review.verified && (
                                <span className={styles.verifiedBadge}>Verified Purchase</span>
                              )}
                            </div>
                            <h4 className={styles.reviewTitle}>{review.title}</h4>
                            <p className={styles.reviewComment}>{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noReviewsYet}>
                          No reviews yet for this product.
                        </div>
                      )}
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
                  <button className={styles.navButton} aria-label="Previous product">
                    <ArrowLeft size={18} />
                  </button>
                  <button className={styles.navButton} aria-label="Next product">
                    <ArrowLeft size={18} className={styles.rotateIcon} />
                  </button>
                </div>
              </div>

              <div className={styles.productsGrid}>
                {similarProducts.map(product => {
                  // Check if similar product is in stock
                  const isSimilarProductInStock = product.stockStatus?.toLowerCase() === 'in stock';
                  
                  return (
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
                          <button 
                            className={`${styles.addButton} ${!isSimilarProductInStock ? styles.disabledButton : ''}`}
                            disabled={!isSimilarProductInStock}
                          >
                            {isSimilarProductInStock ? 'Add' : 'Out of Stock'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>

            <div className={styles.faqList}>
              {(productData?.faqs || [
                { question: "Can I use this product without a prescription?", 
                  answer: productData?.prescriptionRequired ? 
                    "No, this product requires a valid prescription from a licensed healthcare professional." : 
                    "Yes, this product can be purchased without a prescription." },
                { question: "What should I do if I miss a dose?", 
                  answer: "If you miss a dose, take it as soon as you remember. If it's almost time for your next dose, skip the missed dose and continue with your regular dosing schedule. Do not take a double dose to make up for a missed one." },
                { question: "Can I use this during pregnancy?", 
                  answer: "It's best to consult with your doctor before using this product during pregnancy or breastfeeding." },
                { question: "How should I store this product?", 
                  answer: "Store in a cool, dry place away from direct sunlight and keep out of reach of children. Do not use after the expiry date." }
              ]).map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <button 
                    className={`${styles.faqQuestion} ${openFaqIndex === index ? styles.activeFaq : ''}`}
                    onClick={() => toggleFaq(index)}
                    aria-expanded={openFaqIndex === index}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      size={20} 
                      className={openFaqIndex === index ? styles.rotateIcon : ''}
                    />
                  </button>
                  {faq.answer && (
                    <div 
                      className={`${styles.faqAnswer} ${openFaqIndex === index ? styles.faqAnswerVisible : ''}`}
                      style={{ 
                        maxHeight: openFaqIndex === index ? '1000px' : '0',
                        opacity: openFaqIndex === index ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
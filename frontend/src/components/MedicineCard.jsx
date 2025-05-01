import { useState } from 'react';
import styles from '../styles/medicinecard.module.css'; 
import { Heart, ShoppingCart, Info, AlertCircle, Check } from 'lucide-react';

export default function MedicineCard({
  medicineName,
  image,
  price,
  originalPrice,
  manufacturer,
  discount,
  stock,
  description,
  delivery,
  isPrescriptionRequired
}) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img 
            src={image} 
            alt={medicineName} 
            className={styles.medicineImage} 
          />
          <button 
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={handleFavorite}
            aria-label="Add to favorites"
          >
            <Heart 
              size={20} 
              fill={isFavorite ? "#FF5722" : "none"} 
              color={isFavorite ? "#FF5722" : "#757575"} 
            />
          </button>
          {isPrescriptionRequired && <div className={styles.badge}>Rx</div>}
        </div>
        
        <div className={styles.contentContainer}>
          <h3 className={styles.medicineName}>{medicineName}</h3>
          <p className={styles.manufacturer}>Manufactured by {manufacturer}</p>
          
          <div className={styles.priceContainer}>
            <span className={styles.price}>₹{price}</span>
            {originalPrice && (
              <>
                <span className={styles.mrp}>MRP: <span className={styles.strikethrough}>₹{originalPrice}</span></span>
                {discount && <span className={styles.discount}>{discount}% OFF</span>}
              </>
            )}
          </div>
          
          <div className={styles.stockInfo}>
            {stock ? (
              <div className={styles.inStock}>
                <Check size={16} className={styles.checkIcon} />
                <span>In Stock</span>
              </div>
            ) : (
              <div className={styles.outOfStock}>
                <AlertCircle size={16} />
                <span>Out of Stock</span>
              </div>
            )}
            {delivery && <div className={styles.delivery}>Delivery in {delivery}</div>}
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              className={`${styles.addToCartButton} ${isAdded ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={!stock}
            >
              {isAdded ? (
                <>
                  <Check size={18} /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Add to Cart
                </>
              )}
            </button>
            <button 
              className={styles.infoButton}
              onClick={toggleInfo}
              aria-label="Show medication information"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
        
        <div className={`${styles.infoOverlay} ${showInfo ? styles.infoVisible : ''}`}>
          <div className={styles.infoPanel}>
            <div className={styles.infoHeader}>
              <h4 className={styles.infoTitle}>Medication Information</h4>
              <button 
                className={styles.closeButton}
                onClick={toggleInfo}
                aria-label="Close information"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <p className={styles.infoDescription}>
              {description}
            </p>
            {isPrescriptionRequired && (
              <div className={styles.infoAlert}>
                <AlertCircle size={16} />
                <span>Prescription required for purchase</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
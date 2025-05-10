import { useState } from 'react';
import styles from '../styles/medicinecard.module.css';
import { Heart, ShoppingCart, Info, AlertCircle, Check, X } from 'lucide-react';
import useCartStore from '../stores/cart-store';

export default function MedicineCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const addToCart = useCartStore((state) => state.addToCart);
  const handleAddToCart = () => {
    if (!product.stock) return; // Prevent adding to cart if out of stock
    addToCart(product);
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
            src={product.image || "/api/placeholder/180/140"} 
            alt={product.name} 
            className={styles.medicineImage} 
          />
          <button 
            className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteActive : ''}`}
            onClick={handleFavorite}
            aria-label="Add to favorites"
          >
            <Heart 
              size={16} 
              fill={isFavorite ? "#FF5722" : "none"} 
              color={isFavorite ? "#FF5722" : "#757575"} 
            />
          </button>
          {product.isPrescriptionRequired && <div className={styles.badge}>Rx</div>}
        </div>
        
        <div className={styles.contentContainer}>
          <h3 className={styles.medicineName}>{product.name}</h3>
          <p className={styles.manufacturer}>By {product.manufacturer}</p>
          
          <div className={styles.priceContainer}>
            <span className={styles.price}>₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className={styles.mrp}>MRP: <span className={styles.strikethrough}>₹{product.originalPrice}</span></span>
                {product.discount && <span className={styles.discount}>{product.discount}% OFF</span>}
              </>
            )}
          </div>
          
          <div className={styles.stockInfo}>
            {product.stock ? (
              <div className={styles.inStock}>
                <Check size={12} className={styles.checkIcon} />
                <span>In Stock</span>
              </div>
            ) : (
              <div className={styles.outOfStock}>
                <AlertCircle size={12} />
                <span>Out of Stock</span>
              </div>
            )}
            {product.delivery && <div className={styles.delivery}>Delivery: {product.delivery}</div>}
          </div>
          
          <div className={styles.buttonContainer}>
            <button 
              className={`${styles.addToCartButton} ${isAdded ? styles.added : ''}`}
              onClick={handleAddToCart}
              disabled={!product.stock}
            >
              {isAdded ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingCart size={14} /> Add
                </>
              )}
            </button>
            <button 
              className={styles.infoButton}
              onClick={toggleInfo}
              aria-label="Show medication information"
            >
              <Info size={14} />
            </button>
          </div>
        </div>
        
        {showInfo && (
          <div className={styles.infoOverlay}>
            <div className={styles.infoPanel}>
              <div className={styles.infoHeader}>
                <h4 className={styles.infoTitle}>Medication Info</h4>
                <button 
                  className={styles.closeButton}
                  onClick={toggleInfo}
                  aria-label="Close information"
                >
                  <X size={14} />
                </button>
              </div>
              <p className={styles.infoDescription}>
                {product.description || "No description available for this product."}
              </p>
              {product.isPrescriptionRequired && (
                <div className={styles.infoAlert}>
                  <AlertCircle size={12} />
                  <span>Prescription required for purchase</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
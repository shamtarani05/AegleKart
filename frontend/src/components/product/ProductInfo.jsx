import { useState, useEffect } from 'react';
import { Heart, Clock, Check, Truck, Share2, Shield, Plus, Minus, Star, Info } from 'lucide-react';
import styles from '../../styles/medicinedescriptionpage.module.css';
import QuantitySelector from './QuantitySelector';

export default function ProductInfo({ product, addToCart, getItemQuantity, cart }) {
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0);
  
  // Check if product is in stock
  const isInStock = product?.stockStatus?.toLowerCase() === 'in stock';
  
  // Update the cart quantity whenever the cart changes
  useEffect(() => {
    if (product) {
      const inCartQuantity = getItemQuantity(product._id || product.id);
      setCartQuantity(inCartQuantity);
    }
  }, [product, cart, getItemQuantity]);

  const incrementQuantity = () => {
    // Check both quantity setting and cart quantity
    const availableQuantity = (product.quantity || Infinity) - cartQuantity;
    if (availableQuantity > 0 && quantity < availableQuantity) {
      setQuantity(prev => prev + 1);
    } else if (availableQuantity <= 0) {
      alert(`You already have the maximum available quantity (${product.quantity}) in your cart.`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle add to cart functionality
  const handleAddToCart = () => {
    if (product) {
      // Calculate total quantity (current cart + what we're adding)
      const totalQuantity = cartQuantity + quantity;
      
      // Check if there's enough stock available
      if (product.quantity && totalQuantity > product.quantity) {
        const remainingQuantity = product.quantity - cartQuantity;
        
        if (remainingQuantity <= 0) {
          alert(`You already have the maximum quantity (${product.quantity}) in your cart.`);
        } else {
          alert(`You can only add ${remainingQuantity} more items. You already have ${cartQuantity} in your cart.`);
        }
        return;
      }
      
      const itemToAdd = {
        id: product._id || product.id, // Ensure consistent ID usage
        name: product.name,
        price: product.discountedPrice || product.price,
        image: product.images?.[0] || "/api/placeholder/100/100",
        quantity: quantity,
        brandName: product.brandName,
        category: product.category,
        maxQuantity: product.quantity || 0 // Store max quantity with item
      };
      
      const success = addToCart(itemToAdd);
      if (success) {
        // Optional: Show confirmation message or toast notification
        alert(`Added ${quantity} ${product.name} to cart`);
      }
    }
  };

  return (
    <div className={styles.productInfoSection}>
      <div className={styles.productHeader}>
        <div>
          {product?.name && (
            <h1 className={styles.productTitle}>{product.name}</h1>
          )}

          {product?.brandName && (
            <p className={styles.brandInfo}>By <span className={styles.brandName}>{product.brandName}</span></p>
          )}

          {(product?.rating || product?.reviewCount) && (
            <div className={styles.ratingContainer}>
              {product?.rating && (
                <div className={styles.ratingBadge}>
                  <Star size={16} className={styles.starIcon} />
                  <span className={styles.ratingText}>{product.rating}</span>
                </div>
              )}
              {product?.reviewCount && (
                <span className={styles.reviewCount}>{product.reviewCount} Reviews</span>
              )}
            </div>
          )}
        </div>

        <button className={styles.wishlistButton} aria-label="Add to wishlist">
          <Heart size={24} />
        </button>
      </div>

      {product?.prescriptionRequired && (
        <div className={styles.prescriptionAlert}>
          <Info size={18} className={styles.infoIcon} />
          <span>This product requires a valid prescription</span>
        </div>
      )}

      {(product?.price || product?.discountedPrice) && (
        <div className={styles.priceSection}>
          <div className={styles.priceDisplay}>
            {product?.discountedPrice && (
              <span className={styles.currentPrice}>PKR {product.discountedPrice}</span>
            )}
            {product?.price && (
              <span className={product?.discountedPrice ? styles.originalPrice : styles.currentPrice}>
                PKR {product.price}
              </span>
            )}
            {product?.discount && (
              <span className={styles.discountText}>{product.discount}% off</span>
            )}
          </div>
          <p className={styles.taxInfo}>Inclusive of all taxes</p>
        </div>
      )}

      <div className={styles.deliveryInfoSection}>
        {product?.deliveryTime && (
          <div className={styles.infoItem}>
            <Clock size={20} className={styles.infoIcon} />
            <span className={styles.infoText}>
              Delivery within <span className={styles.infoHighlight}>{product.deliveryTime}</span>
            </span>
          </div>
        )}

        {product?.stockStatus && (
          <div className={styles.infoItem}>
            {isInStock ? (
              <Check size={20} className={styles.checkIcon} />
            ) : (
              <Info size={20} className={styles.infoIcon} />
            )}
            <span className={styles.infoText}>
              <span className={`${styles.stockStatus} ${isInStock ? styles.inStock : styles.outOfStock}`}>
                {product.stockStatus}
              </span>
            </span>
          </div>
        )}

        <div className={styles.infoItem}>
          <Truck size={20} className={styles.infoIcon} />
          <div>
            <span className={styles.infoText}>Free delivery on orders above PKR 3000</span>
          </div>
        </div>
      </div>

      <QuantitySelector 
        quantity={quantity} 
        increment={incrementQuantity} 
        decrement={decrementQuantity} 
        isInStock={isInStock} 
        maxQuantity={product.quantity}
        cartQuantity={cartQuantity}
        packSize={product.packSize}
      />

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
  );
}

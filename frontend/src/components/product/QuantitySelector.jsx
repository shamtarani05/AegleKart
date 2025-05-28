import { Plus, Minus } from 'lucide-react';
import styles from '../../styles/medicinedescriptionpage.module.css';

export default function QuantitySelector({ 
  quantity, 
  increment, 
  decrement, 
  isOutStock,
  maxQuantity,
  cartQuantity,
  packSize
}) {
  return (
    <div className={styles.quantitySection}>
      <div className={styles.quantitySelector}>
        <label htmlFor="quantity" className={styles.quantityLabel}>Quantity:</label>
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityButton}
            onClick={decrement}
            aria-label="Decrease quantity"
            disabled={isOutStock || quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className={styles.quantityValue}>{quantity}</span>
          <button
            className={styles.quantityButton}
            onClick={increment}
            aria-label="Increase quantity"
            disabled={isOutStock || (maxQuantity && (quantity + cartQuantity) >= maxQuantity)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {packSize && (
        <div className={styles.packSizeInfo}>
          <span className={styles.packSizeLabel}>Pack size: </span>
          <span className={styles.packSizeValue}>{packSize}</span>
        </div>
      )}
      
      {maxQuantity && !isOutStock && (
        <div className={styles.availableStock}>
          <span className={styles.stockLabel}>Available: </span>
          <span className={styles.stockValue}>
            {maxQuantity} items 
            {cartQuantity > 0 && ` (${cartQuantity} in cart)`}
          </span>
        </div>
      )}
    </div>
  );
}

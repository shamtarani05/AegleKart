import { ArrowLeft } from 'lucide-react';
import styles from '../../styles/medicinedescriptionpage.module.css';

export default function SimilarProducts({ products, navigate, addToCart }) {
  // If no products or empty array, don't render anything
  if (!products || products.length === 0) {
    return null;
  }

  return (
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
        {products.map(product => {
          // Check if similar product is in stock
          const isSimilarProductInStock = product.stockStatus?.toLowerCase() === 'in stock';
          
          // Get the correct ID to use for navigation (use either id or _id)
          const productId = product.id || product._id;
          
          return (
            <div key={productId} className={styles.productCard} onClick={() => {
              navigate(`/product/${productId}`);
              window.scrollTo(0, 0);
            }}>
              <div className={styles.productCardContent}>
                <div className={styles.productImageContainer}>
                  <img
                    src={product.images?.[0] || "/api/placeholder/100/100"}
                    alt={product.name || "Product"}
                    className={styles.productThumbnail}
                  />
                </div>
                <h3 className={styles.productName}>{product.name || "Product Name"}</h3>
                {product.brandName && <p className={styles.productBrand}>{product.brandName}</p>}
                <div className={styles.productFooter}>
                  {product.discountedPrice && 
                    <span className={styles.productPrice}>PKR {product.discountedPrice}</span>
                  }
                  <button 
                    className={`${styles.addButton} ${!isSimilarProductInStock ? styles.disabledButton : ''}`}
                    disabled={!isSimilarProductInStock}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isSimilarProductInStock) {
                        addToCart({
                          id: productId,
                          name: product.name,
                          price: product.discountedPrice || product.price,
                          image: product.images?.[0],
                          quantity: 1,
                          maxQuantity: product.quantity || 0
                        });
                      }
                    }}
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
  );
}

import styles from '../../styles/medicinedescriptionpage.module.css';
import ReviewsSection from './ReviewsSection';

export default function ProductTabs({ productData, activeTab, setActiveTab }) {
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
            <h3 className={styles.tabContentTitle}>About {productData.name}</h3>
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

        {activeTab === 'reviews' && <ReviewsSection productData={productData} />}
      </div>
    </div>
  );
}

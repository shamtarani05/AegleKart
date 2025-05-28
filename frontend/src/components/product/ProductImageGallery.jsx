import { useState } from 'react';
import styles from '../../styles/medicinedescriptionpage.module.css';

export default function ProductImageGallery({ images = [], productName }) {
  const [activeImage, setActiveImage] = useState(0);
  
  // Handle empty images array
  const imagesList = images.length ? images : ["/api/placeholder/350/350"];

  return (
    <div className={styles.productImageSection}>
      <div className={styles.mainImageContainer}>
        <img
          src={imagesList[activeImage]}
          alt={productName}
          className={styles.mainImage}
        />
      </div>
      {imagesList.length > 1 && (
        <div className={styles.imageThumbnailContainer}>
          {imagesList.map((img, index) => (
            <div
              key={index}
              className={`${styles.thumbnailWrapper} ${activeImage === index ? styles.activeThumbnail : ''}`}
              onClick={() => setActiveImage(index)}
            >
              <img
                src={img}
                alt={`${productName} - view ${index + 1}`}
                className={styles.thumbnailImage}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

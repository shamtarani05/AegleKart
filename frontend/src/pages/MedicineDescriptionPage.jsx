// ProductDescriptionPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoadingState from '../components/common/LoadingState';
import styles from '../styles/medicinedescriptionpage.module.css';
import useCartStore from '../stores/cart-store';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductTabs from '../components/product/ProductTabs';
import SimilarProducts from '../components/product/SimilarProducts';
import FAQSection from '../components/product/FAQSection';

export default function ProductDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  
  // Cart store functions
  const addToCart = useCartStore(state => state.addToCart);
  const getItemQuantity = useCartStore(state => state.getItemQuantity);
  const cart = useCartStore(state => state.cart);

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
        console.log(data);
        
        // Similar products are now included directly in the response
        // No need for a separate fetch
        
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

  // Determine product category for breadcrumb
  const productCategory = productData?.category || "Products";
  const productSubCategory = productData?.subCategory || "";

  // Handle loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className={styles.container} style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh' // Ensure there's enough space for the loader
        }}>
          <LoadingState 
            message="Loading product information..." 
            spinnerColor="#00A36C" // Explicit green hex color
            textColor="#00A36C" // Matching text color
            style={{ color: 'green' }} // Fallback styling
          />
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
            <span>{productData.name}</span>
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
              <ProductImageGallery images={productData.images || []} productName={productData.name} />
              <ProductInfo 
                product={productData} 
                addToCart={addToCart}
                getItemQuantity={getItemQuantity} 
                cart={cart}
              />
            </div>

            {/* Tabs section */}
            <ProductTabs 
              productData={productData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Similar Products section - only render if similarProducts exists and has items */}
          {productData?.similarProducts?.length > 0 && (
            <SimilarProducts 
              products={productData.similarProducts} 
              navigate={navigate} 
              addToCart={addToCart}
            />
          )}

          {/* FAQ Section */}
          <FAQSection faqs={productData?.faqs} prescriptionRequired={productData?.prescriptionRequired} />
        </div>
      </div>
      <Footer />
    </>
  );
}
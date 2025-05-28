import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  X,
  Upload,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import AdminSidebar from '../components/admin/AdminSidebar';
import useAuthStore from '../stores/auth-store';
import styles from '../styles/addProduct.module.css';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
// Use service key for admin operations like storage uploads
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

const AddProductPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    formula: '',
    brandName: '',
    category: 'Medicines',
    discountedPrice: '',
    discount: '0',
    quantity: '1',
    stockStatus: 'In Stock',
    deliveryTime: '2-3 days',
    rating: '0',
    reviewCount: '0',
    description: '',
    packSize: '',
    composition: '',
    mfgDate: '',
    expDate: '',
    prescriptionRequired: false,
    images: [],
    keyBenefits: [''],
    sideEffects: [''],
    usageDirections: '',
    similarProducts: []
  });

  // For handling arrays with multiple inputs
  const [keyBenefits, setKeyBenefits] = useState(['']);
  const [sideEffects, setSideEffects] = useState(['']);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for submission status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // For numeric fields, ensure they're valid numbers
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle date changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add a new input field for key benefits
  const handleAddKeyBenefit = () => {
    setKeyBenefits([...keyBenefits, '']);
  };

  // Update a specific key benefit
  const handleKeyBenefitChange = (index, value) => {
    const newKeyBenefits = [...keyBenefits];
    newKeyBenefits[index] = value;
    setKeyBenefits(newKeyBenefits);
  };

  // Remove a key benefit
  const handleRemoveKeyBenefit = (index) => {
    const newKeyBenefits = keyBenefits.filter((_, i) => i !== index);
    setKeyBenefits(newKeyBenefits);
  };

  // Add a new input field for side effects
  const handleAddSideEffect = () => {
    setSideEffects([...sideEffects, '']);
  };

  // Update a specific side effect
  const handleSideEffectChange = (index, value) => {
    const newSideEffects = [...sideEffects];
    newSideEffects[index] = value;
    setSideEffects(newSideEffects);
  };

  // Remove a side effect
  const handleRemoveSideEffect = (index) => {
    const newSideEffects = sideEffects.filter((_, i) => i !== index);
    setSideEffects(newSideEffects);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }
    
    // Check file size - limit to 5MB per file
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('One or more files exceed the 5MB size limit. Please compress your images before uploading.');
      return;
    }
    
    // Check file type - only accept images
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      alert('Please upload only image files (JPG, PNG, GIF, etc.)');
      return;
    }
    
    setImageFiles([...imageFiles, ...files]);
    
    // Create preview URLs for the images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  // Remove an uploaded image
  const handleRemoveImage = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
    
    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);
  };

  // Upload images to Supabase Storage
  const uploadImagesToSupabase = async () => {
    if (imageFiles.length === 0) return [];
    
    setIsUploading(true);
    const uploadedUrls = [];
    
    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        // Set content type explicitly
        const options = {
          contentType: file.type,
          cacheControl: '3600'
        };
        
        const { data, error } = await supabase.storage
          .from('aeglekart')
          .upload(filePath, file, options);
        
        if (error) {
          console.error('Error uploading image:', error);
          throw new Error(`Error uploading image: ${error.message}`);
        }
        
        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('aeglekart')
          .getPublicUrl(filePath);
        
        uploadedUrls.push(urlData.publicUrl);
        
        // Update progress
        setUploadProgress(Math.floor(((i + 1) / imageFiles.length) * 100));
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error in uploading images:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // First, upload images to Supabase
      let uploadedImageUrls = [];
      
      if (imageFiles.length > 0) {
        try {
          uploadedImageUrls = await uploadImagesToSupabase();
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setSubmitError(`Image upload failed: ${uploadError.message}. Please try again.`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare the final form data with Supabase image URLs
      const finalFormData = {
        ...formData,
        id: generateProductId(),
        keyBenefits: keyBenefits.filter(item => item.trim() !== ''),
        sideEffects: sideEffects.filter(item => item.trim() !== ''),
        // Convert string number values to actual numbers
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        discountedPrice: formData.discount > 0 
          ? parseFloat(formData.price) * (1 - parseFloat(formData.discount)/100) 
          : null,
        quantity: parseInt(formData.quantity),
        rating: parseFloat(formData.rating),
        reviewCount: parseInt(formData.reviewCount),
        // Convert dates if provided
        mfgDate: formData.mfgDate ? formData.mfgDate : null,
        expDate: formData.expDate ? formData.expDate : null,
        // Use the Supabase uploaded image URLs
        images: uploadedImageUrls
      };
      
      console.log("Sending product data:", finalFormData);
      
      // Make API call to create the product
      const response = await fetch('http://localhost:3000/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }
      
      const result = await response.json();
      console.log('Product created:', result);
      
      setSubmitSuccess(true);
      
      // Show success message
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);
      
    } catch (error) {
      console.error('Error adding product:', error);
      setSubmitError(error.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate a random product ID
  const generateProductId = () => {
    return 'PRD' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.adminContentWrapper}>
        <AdminSidebar user={user} />
        
        <main className={styles.adminMainContent}>
          <div className={styles.adminHeader}>
            <div className={styles.pageTitle}>
              <button 
                className={styles.backButton}
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft size={20} />
              </button>
              <h1>Add New Product</h1>
            </div>
          </div>
          
          {/* Show submission status messages */}
          {submitError && (
            <div className={styles.errorMessage}>
              <AlertCircle size={18} />
              {submitError}
            </div>
          )}
          
          {submitSuccess && (
            <div className={styles.successMessage}>
              Product added successfully! Redirecting...
            </div>
          )}
          
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.productForm}>
              <div className={styles.formGrid}>
                {/* Basic Product Information */}
                <div className={styles.formSection}>
                  <h3>Basic Information</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Product Name*</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={styles.formControl}
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="brandName">Brand Name*</label>
                      <input 
                        type="text" 
                        id="brandName" 
                        name="brandName" 
                        value={formData.brandName}
                        onChange={handleInputChange}
                        required
                        className={styles.formControl}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="category">Category*</label>
                      <select 
                        id="category" 
                        name="category" 
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className={styles.formControl}
                      >
                        <option value="Medicines">Medicines</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Baby & Mother">Baby & Mother</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Devices">Devices</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="description">Product Description*</label>
                    <textarea 
                      id="description" 
                      name="description" 
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className={`${styles.formControl} ${styles.formTextarea}`}
                      rows="4"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="formula">Formula/Ingredients</label>
                    <textarea 
                      id="formula" 
                      name="formula" 
                      value={formData.formula}
                      onChange={handleInputChange}
                      className={`${styles.formControl} ${styles.formTextarea}`}
                      rows="2"
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="composition">Composition</label>
                    <input 
                      type="text" 
                      id="composition" 
                      name="composition" 
                      value={formData.composition}
                      onChange={handleInputChange}
                      className={styles.formControl}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="packSize">Pack Size</label>
                    <input 
                      type="text" 
                      id="packSize" 
                      name="packSize" 
                      value={formData.packSize}
                      onChange={handleInputChange}
                      placeholder="e.g., 10 tablets, 100ml"
                      className={styles.formControl}
                    />
                  </div>
                </div>
                
                {/* Pricing and Inventory */}
                <div className={styles.formSection}>
                  <h3>Pricing & Inventory</h3>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="price">Price (PKR)*</label>
                      <input 
                        type="number" 
                        id="price" 
                        name="price" 
                        min="0" 
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className={styles.formControl}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="discount">Discount (%)</label>
                      <input 
                        type="number" 
                        id="discount" 
                        name="discount" 
                        min="0" 
                        max="100"
                        value={formData.discount}
                        onChange={handleInputChange}
                        className={styles.formControl}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="quantity">Quantity*</label>
                      <input 
                        type="number" 
                        id="quantity" 
                        name="quantity" 
                        min="0"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        className={styles.formControl}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="stockStatus">Stock Status</label>
                      <select 
                        id="stockStatus" 
                        name="stockStatus" 
                        value={formData.stockStatus}
                        onChange={handleInputChange}
                        className={styles.formControl}
                      >
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                        <option value="Coming Soon">Coming Soon</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="deliveryTime">Delivery Time</label>
                    <input 
                      type="text" 
                      id="deliveryTime" 
                      name="deliveryTime" 
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 2-3 days"
                      className={styles.formControl}
                    />
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="mfgDate">Manufacturing Date</label>
                      <input 
                        type="date" 
                        id="mfgDate" 
                        name="mfgDate" 
                        value={formData.mfgDate}
                        onChange={handleDateChange}
                        className={styles.formControl}
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="expDate">Expiry Date</label>
                      <input 
                        type="date" 
                        id="expDate" 
                        name="expDate" 
                        value={formData.expDate}
                        onChange={handleDateChange}
                        className={styles.formControl}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formCheckbox}>
                    <input 
                      type="checkbox" 
                      id="prescriptionRequired" 
                      name="prescriptionRequired" 
                      checked={formData.prescriptionRequired}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="prescriptionRequired">Prescription Required</label>
                  </div>
                </div>
                
                {/* Product Details */}
                <div className={styles.formSection}>
                  <h3>Product Details</h3>
                  
                  <div className={styles.formGroup}>
                    <label htmlFor="usageDirections">Usage Directions</label>
                    <textarea 
                      id="usageDirections" 
                      name="usageDirections" 
                      value={formData.usageDirections}
                      onChange={handleInputChange}
                      className={`${styles.formControl} ${styles.formTextarea}`}
                      rows="3"
                    />
                  </div>
                  
                  {/* Key Benefits - Multiple inputs */}
                  <div className={styles.formGroup}>
                    <label>Key Benefits</label>
                    {keyBenefits.map((benefit, index) => (
                      <div key={index} className={styles.arrayInputContainer}>
                        <input 
                          type="text"
                          value={benefit}
                          onChange={(e) => handleKeyBenefitChange(index, e.target.value)}
                          className={`${styles.formControl} ${styles.arrayInput}`}
                          placeholder={`Benefit ${index + 1}`}
                        />
                        <button 
                          type="button" 
                          className={styles.removeButton}
                          onClick={() => handleRemoveKeyBenefit(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className={styles.addButton}
                      onClick={handleAddKeyBenefit}
                    >
                      <Plus size={16} />
                      <span>Add Benefit</span>
                    </button>
                  </div>
                  
                  {/* Side Effects - Multiple inputs */}
                  <div className={styles.formGroup}>
                    <label>Side Effects</label>
                    {sideEffects.map((effect, index) => (
                      <div key={index} className={styles.arrayInputContainer}>
                        <input 
                          type="text"
                          value={effect}
                          onChange={(e) => handleSideEffectChange(index, e.target.value)}
                          className={`${styles.formControl} ${styles.arrayInput}`}
                          placeholder={`Side Effect ${index + 1}`}
                        />
                        <button 
                          type="button" 
                          className={styles.removeButton}
                          onClick={() => handleRemoveSideEffect(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className={styles.addButton}
                      onClick={handleAddSideEffect}
                    >
                      <Plus size={16} />
                      <span>Add Side Effect</span>
                    </button>
                  </div>
                </div>
                
                {/* Product Images */}
                <div className={styles.formSection}>
                  <h3>Product Images</h3>
                  
                  <div className={styles.imageUploadContainer}>
                    <label htmlFor="productImages" className={styles.imageUploadLabel}>
                      <Upload size={24} />
                      <span>Drop images here or click to upload</span>
                      <span className={styles.imageUploadHint}>Upload high-quality product images (max 5)</span>
                    </label>
                    <input 
                      type="file" 
                      id="productImages" 
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className={styles.imageUploadInput}
                      disabled={imageFiles.length >= 5 || isUploading}
                    />
                    
                    {/* Upload Progress */}
                    {isUploading && (
                      <div className={styles.uploadProgress}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <span>Uploading images: {uploadProgress}%</span>
                      </div>
                    )}
                    
                    {imagePreviewUrls.length > 0 && (
                      <div className={styles.imagePreviewContainer}>
                        {imagePreviewUrls.map((image, index) => (
                          <div key={index} className={styles.imagePreview}>
                            <img src={image} alt={`Product ${index + 1}`} />
                            <button 
                              type="button" 
                              className={styles.removeImageButton}
                              onClick={() => handleRemoveImage(index)}
                              disabled={isUploading}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.formActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => navigate('/admin')}
                  disabled={isSubmitting || isUploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? 'Adding Product...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProductPage;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useAuthStore from '../stores/auth-store';
import AdminSidebar from '../components/admin/AdminSidebar';
import styles from '../styles/adminProducts.module.css';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // State for search, filters, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All Products');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  
  // Mock product data - in a real app, fetch from API
  const [products, setProducts] = useState([
    {
      id: 'PRD3F7A12',
      name: 'Paracetamol 500mg Tablets',
      category: 'Medicines',
      brandName: 'AeglePharm',
      price: 120,
      discountedPrice: 99,
      stockStatus: 'In Stock',
      quantity: 500,
      prescriptionRequired: true
    },
    {
      id: 'PRDBC892E',
      name: 'Vitamin C 1000mg',
      category: 'Nutrition',
      brandName: 'HealthVit',
      price: 350,
      discountedPrice: 299,
      stockStatus: 'In Stock',
      quantity: 200,
      prescriptionRequired: false
    },
    {
      id: 'PRD4D12A6',
      name: 'Digital Thermometer',
      category: 'Devices',
      brandName: 'MedTech',
      price: 499,
      discountedPrice: 399,
      stockStatus: 'In Stock',
      quantity: 75,
      prescriptionRequired: false
    },
    {
      id: 'PRD56FE8C',
      name: 'Antiseptic Cream',
      category: 'Healthcare',
      brandName: 'SkinCare',
      price: 180,
      discountedPrice: 149,
      stockStatus: 'Low Stock',
      quantity: 25,
      prescriptionRequired: false
    },
    {
      id: 'PRD78E2D1',
      name: 'Baby Shampoo',
      category: 'Baby & Mother',
      brandName: 'BabyCare',
      price: 250,
      discountedPrice: 220,
      stockStatus: 'In Stock',
      quantity: 120,
      prescriptionRequired: false
    },
    {
      id: 'PRD9A3F7B',
      name: 'Hand Sanitizer',
      category: 'Personal Care',
      brandName: 'PureHands',
      price: 150,
      discountedPrice: 130,
      stockStatus: 'In Stock',
      quantity: 300,
      prescriptionRequired: false
    },
    {
      id: 'PRDB21E4F',
      name: 'Amoxicillin 500mg',
      category: 'Medicines',
      brandName: 'AeglePharm',
      price: 280,
      discountedPrice: 240,
      stockStatus: 'In Stock',
      quantity: 150,
      prescriptionRequired: true
    },
    {
      id: 'PRDC5F83A',
      name: 'Protein Powder',
      category: 'Nutrition',
      brandName: 'FitLife',
      price: 1200,
      discountedPrice: 999,
      stockStatus: 'In Stock',
      quantity: 50,
      prescriptionRequired: false
    },
    {
      id: 'PRDE74B29',
      name: 'Blood Pressure Monitor',
      category: 'Devices',
      brandName: 'MedTech',
      price: 2500,
      discountedPrice: 1999,
      stockStatus: 'Out of Stock',
      quantity: 0,
      prescriptionRequired: false
    },
    {
      id: 'PRDF18E7C',
      name: 'Diaper Rash Cream',
      category: 'Baby & Mother',
      brandName: 'BabyCare',
      price: 320,
      discountedPrice: 280,
      stockStatus: 'In Stock',
      quantity: 85,
      prescriptionRequired: false
    },
    {
      id: 'PRD12G9H7',
      name: 'Cough Syrup',
      category: 'Medicines',
      brandName: 'AeglePharm',
      price: 160,
      discountedPrice: 140,
      stockStatus: 'In Stock',
      quantity: 120,
      prescriptionRequired: true
    },
  ]);
  
  // Filter categories
  const categories = [
    'All Products',
    'Medicines',
    'Healthcare',
    'Baby & Mother',
    'Nutrition',
    'Personal Care',
    'Devices'
  ];
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Filter products based on search and category filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.id.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = currentFilter === 'All Products' || product.category === currentFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Navigate to edit product page
  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };
  
  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // In a real app, make API call to delete product
      setProducts(products.filter(product => product.id !== productId));
    }
  };
  
  // View product details
  const handleViewProduct = (productId) => {
    navigate(`/admin/product-details/${productId}`);
  };

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.adminContentWrapper}>
        <AdminSidebar user={user} />
        
        <main className={styles.adminMainContent}>
          {/* Header with title and add product button */}
          <div className={styles.adminHeader}>
            <h1>Products</h1>
            <div className={styles.adminActions}>
              <Link to="/admin/add-product" className={styles.addProductButton}>
                <Plus size={16} />
                <span>Add Product</span>
              </Link>
            </div>
          </div>
          
          {/* Search and filter bar - updated to match screenshot */}
          <div className={styles.searchFilterBar}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search products by name or ID..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className={styles.filterDropdowns}>
              <span className={styles.filterLabel}>Category:</span>
              <select 
                className={styles.filterSelect}
                value={currentFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Products table - layout updated to match screenshot */}
          <div className={styles.productsTableContainer}>
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price </th>
                  <th>Discounted </th>
                  <th>Stock Status</th>
                  <th>Qty</th>
                  <th>Rx</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="10" className={styles.noProducts}>
                      No products found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td className={styles.productNameCell}>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.brandName}</td>
                      <td>PKR {product.price}</td>
                      <td>
                        {product.discountedPrice ? `PKR ${product.discountedPrice}` : '-'}
                      </td>
                      <td>
                        <span 
                          className={`${styles.stockStatus} ${styles[product.stockStatus.toLowerCase().replace(/\s+/g, '')]}`}
                        >
                          {product.stockStatus}
                        </span>
                      </td>
                      <td>{product.quantity}</td>
                      <td>
                        {product.prescriptionRequired ? (
                          <span className={styles.rxRequired}>Yes</span>
                        ) : (
                          <span className={styles.rxNotRequired}>No</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleViewProduct(product.id)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleEditProduct(product.id)}
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredProducts.length > productsPerPage && (
            <div className={styles.paginationContainer}>
              <button 
                className={styles.paginationButton}
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>
              
              <div className={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
              </div>
              
              <button 
                className={styles.paginationButton}
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminProductsPage;

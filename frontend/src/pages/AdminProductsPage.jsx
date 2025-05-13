import React, { useState, useEffect, useCallback } from 'react';
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
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import styles from '../styles/adminProducts.module.css';

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // State for search, filters, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('All Products');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsPerPage] = useState(10);
  
  // State for API data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  // Fetch products from API using useCallback to memoize the function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let queryParams = new URLSearchParams({
        page: currentPage,
        limit: productsPerPage
      });

      // Add category filter if not "All Products"
      if (currentFilter !== 'All Products') {
        queryParams.append('category', currentFilter);
      }

      // Add search query if exists
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery);
      }

      const response = await fetch(`http://localhost:3000/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentFilter, searchQuery, productsPerPage]);
  
  // Now useEffect has all the dependencies it needs
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle search change with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Navigate to edit product page
  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`);
  };
  
  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // In a real app, make API call to delete product
        // For now, just update the local state
        setProducts(products.filter(product => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };
  
  // View product details
  const handleViewProduct = (productId) => {
    navigate(`/admin/product-details/${productId}`);
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.adminContentWrapper}>
          <AdminSidebar user={user} />
          <main className={styles.adminMainContent}>
            <LoadingState message="Loading products..." />
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.adminContentWrapper}>
          <AdminSidebar user={user} />
          <main className={styles.adminMainContent}>
            <ErrorState error={error} onRetry={fetchProducts} />
          </main>
        </div>
      </div>
    );
  }

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
          
          {/* Search and filter bar */}
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
          
          {/* Products table */}
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="10" className={styles.noProducts}>
                      No products found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id || product.id}>
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
                          className={`${styles.stockStatus} ${styles[(product.stockStatus || 'Out of Stock').toLowerCase().replace(/\s+/g, '')]}`}
                        >
                          {product.stockStatus || 'Out of Stock'}
                        </span>
                      </td>
                      <td>{product.quantity || 0}</td>
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
                            onClick={() => handleViewProduct(product._id || product.id)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleEditProduct(product._id || product.id)}
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDeleteProduct(product._id || product.id)}
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
          {totalPages > 1 && (
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

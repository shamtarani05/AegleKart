import React, { useState, useEffect } from 'react';
import { 
  Search,
  Eye,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import useAuthStore from '../stores/auth-store';
import AdminSidebar from '../components/admin/AdminSidebar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import styles from '../styles/adminCustomers.module.css';

const AdminCustomersPage = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const customersPerPage = 8;

  // State for API data
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch customers from API
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/customers',{});
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setCustomers(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
      setLoading(false);
    }
  };

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Handle numeric values
    if (typeof aValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle string values
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // Handle date values
    if (sortBy === 'joinDate' || sortBy === 'lastOrder') {
      return sortOrder === 'asc'
        ? new Date(aValue) - new Date(bValue)
        : new Date(bValue) - new Date(aValue);
    }
    
    return 0;
  });

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(sortedCustomers.length / customersPerPage);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // View customer details
  const handleViewCustomer = (customerId) => {
    window.location.href = `/admin/customers/${customerId}`;
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Loading state
  if (loading) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.adminContentWrapper}>
          <AdminSidebar user={user} />
          <main className={styles.adminMainContent}>
            <LoadingState message="Loading customers..." />
          </main>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.adminContentWrapper}>
          <AdminSidebar user={user} />
          <main className={styles.adminMainContent}>
            <ErrorState error={error} onRetry={fetchCustomers} />
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
          {/* Header */}
          <div className={styles.adminHeader}>
            <h1>Customers</h1>
            <div className={styles.headerStats}>
              <div className={styles.headerStat}>
                <span className={styles.statValue}>{customers.length}</span>
                <span className={styles.statLabel}>Total Customers</span>
              </div>
              <div className={styles.headerStat}>
                <span className={styles.statValue}>
                  {customers.reduce((acc, customer) => acc + customer.totalOrders, 0)}
                </span>
                <span className={styles.statLabel}>Total Orders</span>
              </div>
              <div className={styles.headerStat}>
                <span className={styles.statValue}>
                  PKR {customers.reduce((acc, customer) => acc + customer.totalSpent, 0).toLocaleString()}
                </span>
                <span className={styles.statLabel}>Total Revenue</span>
              </div>
            </div>
          </div>
          
          {/* Search bar */}
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search customers by name, email, phone or location..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Customers table */}
          <div className={styles.customersTableContainer}>
            <table className={styles.customersTable}>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className={styles.sortableHeader}>
                    Customer
                    <span className={sortBy === 'name' ? styles.activeSortIcon : styles.sortIcon}>
                      {sortBy === 'name' && sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  </th>
                  <th>Contact Info</th>
          
                  <th onClick={() => handleSort('totalOrders')} className={styles.sortableHeader}>
                    Orders
                    <span className={sortBy === 'totalOrders' ? styles.activeSortIcon : styles.sortIcon}>
                      {sortBy === 'totalOrders' && sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  </th>
                  <th onClick={() => handleSort('totalSpent')} className={styles.sortableHeader}>
                    Total Spent
                    <span className={sortBy === 'totalSpent' ? styles.activeSortIcon : styles.sortIcon}>
                      {sortBy === 'totalSpent' && sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  </th>
                  <th onClick={() => handleSort('joinDate')} className={styles.sortableHeader}>
                    Customer Since
                    <span className={sortBy === 'joinDate' ? styles.activeSortIcon : styles.sortIcon}>
                      {sortBy === 'joinDate' && sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.noCustomers}>
                      No customers found matching your search.
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className={styles.customerNameCell}>
                        <div className={styles.customerName}>{customer.name}</div>
                        <div className={styles.customerId}>{customer.id}</div>
                      </td>
                      <td>
                        <div className={styles.contactInfo}>
                          <div className={styles.contactItem}>
                            <Mail size={14} className={styles.contactIcon} />
                            <span>{customer.email}</span>
                          </div>
                          <div className={styles.contactItem}>
                            <Phone size={14} className={styles.contactIcon} />
                            <span>{customer.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={styles.ordersInfo}>
                          <ShoppingBag size={14} className={styles.infoIcon} />
                          <span>{customer.totalOrders}</span>
                          <span className={styles.lastOrder}>
                            (last: {formatDate(customer.lastOrder)})
                          </span>
                        </div>
                      </td>
                      <td className={styles.amountCell}>PKR {customer.totalSpent.toLocaleString()}</td>
                      <td>
                        <div className={styles.joinInfo}>
                          <Calendar size={14} className={styles.infoIcon} />
                          <span>{formatDate(customer.joinDate)}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className={styles.viewButton}
                          onClick={() => handleViewCustomer(customer.id)}
                          title="View Customer Details"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredCustomers.length > customersPerPage && (
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

export default AdminCustomersPage;

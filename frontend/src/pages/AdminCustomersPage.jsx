import React, { useState } from 'react';
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
import styles from '../styles/adminCustomers.module.css';

const AdminCustomersPage = () => {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const customersPerPage = 8;

  // Mock customer data - in a real app, fetch from API
  const [customers] = useState([
    {
      id: 'CUST001',
      name: 'Raj Sharma',
      email: 'raj.sharma@example.com',
      phone: '+91 98765 43210',
      totalOrders: 12,
      totalSpent: 14500,
      lastOrder: '2023-11-12',
      joinDate: '2023-01-15',
      location: 'Mumbai, Maharashtra'
    },
    {
      id: 'CUST002',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 87654 32109',
      totalOrders: 8,
      totalSpent: 9800,
      lastOrder: '2023-11-05',
      joinDate: '2023-02-20',
      location: 'Ahmedabad, Gujarat'
    },
    {
      id: 'CUST003',
      name: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      phone: '+91 76543 21098',
      totalOrders: 15,
      totalSpent: 18600,
      lastOrder: '2023-11-15',
      joinDate: '2022-11-10',
      location: 'Delhi, NCR'
    },
    {
      id: 'CUST004',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      phone: '+91 65432 10987',
      totalOrders: 6,
      totalSpent: 7200,
      lastOrder: '2023-10-30',
      joinDate: '2023-04-05',
      location: 'Bangalore, Karnataka'
    },
    {
      id: 'CUST005',
      name: 'Vikas Singh',
      email: 'vikas.singh@example.com',
      phone: '+91 54321 09876',
      totalOrders: 10,
      totalSpent: 12300,
      lastOrder: '2023-11-08',
      joinDate: '2023-03-12',
      location: 'Pune, Maharashtra'
    },
    {
      id: 'CUST006',
      name: 'Neha Sharma',
      email: 'neha.sharma@example.com',
      phone: '+91 43210 98765',
      totalOrders: 4,
      totalSpent: 5600,
      lastOrder: '2023-09-25',
      joinDate: '2023-06-18',
      location: 'Chennai, Tamil Nadu'
    },
    {
      id: 'CUST007',
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 32109 87654',
      totalOrders: 9,
      totalSpent: 10800,
      lastOrder: '2023-11-11',
      joinDate: '2023-01-05',
      location: 'Hyderabad, Telangana'
    },
    {
      id: 'CUST008',
      name: 'Ananya Mishra',
      email: 'ananya.mishra@example.com',
      phone: '+91 21098 76543',
      totalOrders: 7,
      totalSpent: 8700,
      lastOrder: '2023-10-20',
      joinDate: '2023-05-22',
      location: 'Kolkata, West Bengal'
    },
    {
      id: 'CUST009',
      name: 'Deepak Joshi',
      email: 'deepak.joshi@example.com',
      phone: '+91 10987 65432',
      totalOrders: 11,
      totalSpent: 13400,
      lastOrder: '2023-11-02',
      joinDate: '2022-12-15',
      location: 'Jaipur, Rajasthan'
    },
    {
      id: 'CUST010',
      name: 'Meena Patel',
      email: 'meena.patel@example.com',
      phone: '+91 09876 54321',
      totalOrders: 5,
      totalSpent: 6200,
      lastOrder: '2023-10-15',
      joinDate: '2023-07-10',
      location: 'Surat, Gujarat'
    }
  ]);

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
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // View customer details
  const handleViewCustomer = (customerId) => {
    // In a real app, navigate to customer details page
    alert(`View customer details for: ${customerId}`);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                  ₹{customers.reduce((acc, customer) => acc + customer.totalSpent, 0).toLocaleString()}
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
                  <th onClick={() => handleSort('location')} className={styles.sortableHeader}>
                    Location
                    <span className={sortBy === 'location' ? styles.activeSortIcon : styles.sortIcon}>
                      {sortBy === 'location' && sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  </th>
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
                      <td>{customer.location}</td>
                      <td>
                        <div className={styles.ordersInfo}>
                          <ShoppingBag size={14} className={styles.infoIcon} />
                          <span>{customer.totalOrders}</span>
                          <span className={styles.lastOrder}>
                            (last: {formatDate(customer.lastOrder)})
                          </span>
                        </div>
                      </td>
                      <td className={styles.amountCell}>₹{customer.totalSpent.toLocaleString()}</td>
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

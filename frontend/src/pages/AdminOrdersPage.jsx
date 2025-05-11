import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  X
} from 'lucide-react';
import useAuthStore from '../stores/auth-store';
import AdminSidebar from '../components/admin/AdminSidebar';
import styles from '../styles/adminOrders.module.css';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // State for search, filters, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  // Mock orders data - in a real app, fetch from API
  const [orders, setOrders] = useState([
    {
      id: '#AEG12345',
      customer: 'Raj Sharma',
      email: 'raj.sharma@example.com',
      date: '2023-11-15 14:30',
      total: 1250,
      status: 'Pending',
      paymentMethod: 'Credit Card',
      items: 3
    },
    {
      id: '#AEG12346',
      customer: 'Priya Patel',
      email: 'priya.patel@example.com',
      date: '2023-11-15 10:15',
      total: 890,
      status: 'Processing',
      paymentMethod: 'UPI',
      items: 2
    },
    {
      id: '#AEG12347',
      customer: 'Amit Kumar',
      email: 'amit.kumar@example.com',
      date: '2023-11-14 16:45',
      total: 2100,
      status: 'Shipped',
      paymentMethod: 'Debit Card',
      items: 5
    },
    {
      id: '#AEG12348',
      customer: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      date: '2023-11-14 09:20',
      total: 550,
      status: 'Delivered',
      paymentMethod: 'Cash on Delivery',
      items: 1
    },
    {
      id: '#AEG12349',
      customer: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      date: '2023-11-13 11:30',
      total: 1850,
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      items: 4
    },
    {
      id: '#AEG12350',
      customer: 'Ananya Singh',
      email: 'ananya.singh@example.com',
      date: '2023-11-13 08:15',
      total: 760,
      status: 'Cancelled',
      paymentMethod: 'UPI',
      items: 2
    },
    {
      id: '#AEG12351',
      customer: 'Vikram Mehta',
      email: 'vikram.mehta@example.com',
      date: '2023-11-12 17:40',
      total: 3200,
      status: 'Delivered',
      paymentMethod: 'Debit Card',
      items: 6
    },
    {
      id: '#AEG12352',
      customer: 'Meera Reddy',
      email: 'meera.reddy@example.com',
      date: '2023-11-12 13:10',
      total: 980,
      status: 'Shipped',
      paymentMethod: 'Credit Card',
      items: 3
    },
    {
      id: '#AEG12353',
      customer: 'Sanjay Joshi',
      email: 'sanjay.joshi@example.com',
      date: '2023-11-11 16:30',
      total: 1450,
      status: 'Delivered',
      paymentMethod: 'Cash on Delivery',
      items: 4
    },
    {
      id: '#AEG12354',
      customer: 'Divya Sharma',
      email: 'divya.sharma@example.com',
      date: '2023-11-11 10:45',
      total: 660,
      status: 'Refunded',
      paymentMethod: 'UPI',
      items: 2
    },
    {
      id: '#AEG12355',
      customer: 'Arjun Patel',
      email: 'arjun.patel@example.com',
      date: '2023-11-10 09:20',
      total: 1120,
      status: 'Delivered',
      paymentMethod: 'Credit Card',
      items: 3
    }
  ]);
  
  // Status options for filtering
  const statusOptions = [
    'All Orders',
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Refunded'
  ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle status filter change
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };
  
  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesStatus = statusFilter === 'All Orders' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // View order details
  const handleViewOrder = (orderId) => {
    navigate(`/admin/order-details/${orderId}`);
  };
  
  // Print invoice
  const handlePrintInvoice = (orderId) => {
    // In a real app, generate and print invoice
    console.log(`Printing invoice for order ${orderId}`);
    window.alert(`Invoice for ${orderId} sent to printer.`);
  };
  
  // Cancel order
  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      // In a real app, make API call to cancel order
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
      );
      setOrders(updatedOrders);
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.adminContentWrapper}>
        <AdminSidebar user={user} />
        
        <main className={styles.adminMainContent}>
          {/* Header */}
          <div className={styles.adminHeader}>
            <h1>Orders</h1>
            <div className={styles.orderStats}>
              <div className={styles.orderStat}>
                <span className={styles.statNumber}>{orders.filter(order => order.status === 'Pending').length}</span>
                <span className={styles.statLabel}>Pending</span>
              </div>
              <div className={styles.orderStat}>
                <span className={styles.statNumber}>{orders.filter(order => order.status === 'Processing').length}</span>
                <span className={styles.statLabel}>Processing</span>
              </div>
              <div className={styles.orderStat}>
                <span className={styles.statNumber}>{orders.filter(order => order.status === 'Shipped').length}</span>
                <span className={styles.statLabel}>Shipped</span>
              </div>
              <div className={styles.orderStat}>
                <span className={styles.statNumber}>{orders.filter(order => order.status === 'Delivered').length}</span>
                <span className={styles.statLabel}>Delivered</span>
              </div>
            </div>
          </div>
          
          {/* Search and filter bar */}
          <div className={styles.searchFilterBar}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder="Search orders by ID, customer name or email..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className={styles.filterContainer}>
              <span className={styles.filterLabel}>Status:</span>
              <select 
                className={styles.filterSelect}
                value={statusFilter}
                onChange={handleStatusChange}
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Orders table */}
          <div className={styles.ordersTableContainer}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.noOrders}>
                      No orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className={styles.orderId}>{order.id}</td>
                      <td>{formatDate(order.date)}</td>
                      <td>
                        <div className={styles.customerInfo}>
                          <span className={styles.customerName}>{order.customer}</span>
                          <span className={styles.customerEmail}>{order.email}</span>
                        </div>
                      </td>
                      <td>{order.items} items</td>
                      <td className={styles.orderTotal}>₹{order.total.toLocaleString()}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <span className={`${styles.orderStatus} ${styles[order.status.toLowerCase()]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleViewOrder(order.id)}
                            title="View Order Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handlePrintInvoice(order.id)}
                            title="Print Invoice"
                          >
                            <Printer size={16} />
                          </button>
                          {!['Cancelled', 'Refunded'].includes(order.status) && (
                            <button 
                              className={`${styles.actionButton} ${styles.cancelButton}`}
                              onClick={() => handleCancelOrder(order.id)}
                              title="Cancel Order"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredOrders.length > ordersPerPage && (
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

export default AdminOrdersPage;

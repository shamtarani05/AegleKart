import React, { useState, useEffect } from 'react';
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
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import OrderInvoice from '../components/admin/OrderInvoice';
import styles from '../styles/adminOrders.module.css';

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // State for search, filters, pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  
  // State for API data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null); // Add this new state

  // State for invoice modal
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  // Add status options for dropdown
  const availableStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];

  // Fetch orders from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/orders',{});
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      setLoading(false);
    }
  };

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
  
  // Handle filter status change - rename the existing function
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Add this function to handle order status updates
  const handleStatusChange = async (order, newStatus) => {
    try {
      setUpdatingOrderId(order.orderId);
      
      const response = await fetch(`http://localhost:3000/orders/update-status/${order.orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }
      
      // Update local state to reflect the change
      setOrders(currentOrders => 
        currentOrders.map(o => 
          (o.orderId === order.orderId || o._id === order._id) ? { ...o, status: newStatus } : o
        )
      );
      
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdatingOrderId(null);
    }
  };
  
  // Filter orders based on search and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.id?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (order.customer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
                          
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
  
  // View order details - make sure we're providing the correct ID
  const handleViewOrder = (orderId) => {
    const id = orderId;
    console.log(`Navigating to order details: ${id}`);
    navigate(`/admin/order-details/${id}`);
  };
  
  // Print invoice
  const handlePrintInvoice = (orderId) => {
    // Find the order by ID
    const order = orders.find(order => (order.id === orderId || order._id === orderId || order.orderId === orderId));
    if (order) {
      setSelectedOrder(order);
      setShowInvoice(true);
    } else {
      console.error(`Order with ID ${orderId} not found`);
      alert("Couldn't find order details for printing.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.adminPageContainer}>
        <div className={styles.adminContentWrapper}>
          <AdminSidebar user={user} />
          <main className={styles.adminMainContent}>
            <LoadingState message="Loading orders..." />
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
            <ErrorState error={error} onRetry={fetchOrders} />
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
                onChange={handleStatusFilterChange}
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
                    <tr key={order.id || order._id}>
                      <td className={styles.orderId}>{order.orderId}</td>
                      <td>{formatDate(order.date || order.createdAt)}</td>
                      <td>
                        <div className={styles.customerInfo}>
                          <span className={styles.customerName}>{order.customer?.name}</span>
                          <span className={styles.customerEmail}>{order.customer?.email}</span>
                        </div>
                      </td>
                      <td>{order.products?.length || 0} items</td> {/* Changed from items to products */}
                      <td className={styles.orderTotal}>PKR {(order.total)?.toLocaleString()}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        {updatingOrderId === order.orderId ? (
                          <div className={styles.loadingStatus}>Updating...</div>
                        ) : (
                          <div className={styles.statusDropdownContainer}>
                            <select
                              className={`${styles.statusDropdown} ${styles[order.status.toLowerCase()]}`}
                              value={order.status}
                              onChange={(e) => handleStatusChange(order, e.target.value)}
                            >
                              {availableStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handleViewOrder(order.id || order._id)}
                            title="View Order Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className={styles.actionButton}
                            onClick={() => handlePrintInvoice(order.id || order._id)}
                            title="Print Invoice"
                          >
                            <Printer size={16} />
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
      
      {/* Invoice Modal */}
      {showInvoice && selectedOrder && (
        <OrderInvoice 
          order={selectedOrder}
          onClose={() => setShowInvoice(false)}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;

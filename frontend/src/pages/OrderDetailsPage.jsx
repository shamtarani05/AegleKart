import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  Calendar, 
  Clock,
  PhoneCall,
  Mail,
  Home,
  Printer
} from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import OrderInvoice from '../components/admin/OrderInvoice';
import useAuthStore from '../stores/auth-store';
import styles from '../styles/orderDetails.module.css';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  
  // Fetch order details and payment info on component mount
  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch order details
        const orderResponse = await fetch(`http://localhost:3000/orders/details/${id}`);
        
        if (!orderResponse.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const orderData = await orderResponse.json();
        setOrder(orderData.order);
        
        // Fetch payment details using the orderId
        if (orderData.order?.orderId) {
          try {
            const paymentResponse = await fetch(`http://localhost:3000/orders/payment/${orderData.order.orderId}`);
            if (paymentResponse.ok) {
              const paymentData = await paymentResponse.json();
              setPayment(paymentData.payment);
              console.log('Payment details:', paymentData.payment);
            }
          } catch (paymentErr) {
            console.error('Error fetching payment details:', paymentErr);
            // Don't set error state for payment failure as it's not critical
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  // Calculate order summary with correct discount application
  const calculateOrderSummary = (order) => {
    if (!order) return {};
    
    const subtotal = order.subtotal || 0;
    const tax = order.tax || 0;
    const shipping = order.shipping || 0;
    
    // Calculate the pre-discount total
    const preDiscountTotal = subtotal + tax + shipping;
    
    // Apply discount at the end
    let discountAmount = 0;
    if (order.discount && order.discount.value) {
      if (order.discount.type === 'percent') {
        // If percent discount, apply to the pre-discount total
        discountAmount = preDiscountTotal * (order.discount.value / 100);
      } else {
        // If fixed discount
        discountAmount = order.discount.value;
      }
    }
    
    // Final total after discount
    const total = preDiscountTotal - discountAmount;
    
    return {
      subtotal,
      tax,
      shipping,
      discountType: order.discount?.type || 'fixed',
      discountValue: order.discount?.value || 0,
      discountAmount,
      total: order.total || total
    };
  };

  // Handle print invoice
  const handlePrintInvoice = () => {
    if (order) {
      setShowInvoice(true);
    }
  };

  // Function to get formatted address from shipping info or payment billing info
  const getAddressForDisplay = () => {
    // Try to get address from payment first
    if (payment && payment.billing && payment.billing.address) {
      return payment.billing.address;
    }
    // Fall back to order shipping address
    return order.shippingAddress || null;
  };
  
  if (loading) {
    return (
      <div className={styles.adminPageContainer}>
        <AdminSidebar user={user} />
        <main className={styles.adminMainContent}>
          <LoadingState message="Loading order details..." />
        </main>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.adminPageContainer}>
        <AdminSidebar user={user} />
        <main className={styles.adminMainContent}>
          <div className={styles.backButtonContainer}>
            <button
              className={styles.backButton}
              onClick={() => navigate('/admin/orders')}
            >
              <ArrowLeft size={20} />
              <span>Back to Orders</span>
            </button>
          </div>
          <ErrorState 
            error={error}
            message="Failed to load order details"
            onRetry={() => {
              // Create a new function to retry fetching
              const fetchOrderData = async () => {
                setLoading(true);
                setError(null);
                
                try {
                  // Fetch order details
                  const orderResponse = await fetch(`http://localhost:3000/orders/details/${id}`);
                  
                  if (!orderResponse.ok) {
                    throw new Error('Failed to fetch order details');
                  }
                  
                  const orderData = await orderResponse.json();
                  setOrder(orderData.order);
                  
                  // Fetch payment details using the orderId
                  if (orderData.order?.orderId) {
                    try {
                      const paymentResponse = await fetch(`http://localhost:3000/orders/payment/${orderData.order.orderId}`);
                      if (paymentResponse.ok) {
                        const paymentData = await paymentResponse.json();
                        setPayment(paymentData.payment);
                      }
                    } catch (paymentErr) {
                      console.error('Error fetching payment details:', paymentErr);
                    }
                  }
                } catch (err) {
                  console.error('Error fetching order:', err);
                  setError(err.message || 'Failed to load order details');
                } finally {
                  setLoading(false);
                }
              };
              
              fetchOrderData();
            }}
          />
        </main>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className={styles.adminPageContainer}>
        <AdminSidebar user={user} />
        <main className={styles.adminMainContent}>
          <div className={styles.backButtonContainer}>
            <button
              className={styles.backButton}
              onClick={() => navigate('/admin/orders')}
            >
              <ArrowLeft size={20} />
              <span>Back to Orders</span>
            </button>
          </div>
          <div className={styles.noOrderFound}>
            <h2>Order Not Found</h2>
            <p>The order you are looking for does not exist or has been removed.</p>
          </div>
        </main>
      </div>
    );
  }
  
  const summary = calculateOrderSummary(order);

  return (
    <div className={styles.adminPageContainer}>
      <AdminSidebar user={user} />
      <main className={styles.adminMainContent}>
        {/* Header with action buttons */}
        <div className={styles.detailsHeader}>
          <div className={styles.headerLeft}>
            <button
              className={styles.backButton}
              onClick={() => navigate('/admin/orders')}
            >
              <ArrowLeft size={20} />
              <span>Back to Orders</span>
            </button>
            <h1>Order Details</h1>
          </div>
          <div className={styles.headerRight}>
            <button 
              className={styles.printButton}
              onClick={handlePrintInvoice}
            >
              <Printer size={20} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
        
        {/* Order Summary Card */}
        <div className={styles.orderSummaryCard}>
          <div className={styles.orderInfo}>
            <h2>Order #{order.orderId}</h2>
            <p className={styles.orderDate}>
              <Calendar size={16} />
              <span>Placed on {formatDate(order.createdAt)}</span>
            </p>
          </div>
          <div className={`${styles.orderStatus} ${styles[order.status?.toLowerCase()]}`}>
            {order.status}
          </div>
        </div>
        
        {/* Order Details Grid */}
        <div className={styles.detailsGrid}>
          {/* Customer Information */}
          <div className={styles.detailsCard}>
            <h3>Customer Information</h3>
            <div className={styles.cardContent}>
              <div className={styles.cardItem}>
                <strong>Name:</strong>
                <span>{order.customer?.name || 'N/A'}</span>
              </div>
              <div className={styles.cardItem}>
                <Mail size={16} />
                <strong>Email:</strong>
                <span>{order.customer?.email || 'N/A'}</span>
              </div>
              <div className={styles.cardItem}>
                <PhoneCall size={16} />
                <strong>Phone:</strong>
                <span>{order.customer?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {/* Shipping Address Card - Modified to show billing address if available */}
          <div className={styles.detailsCard}>
            <h3>{payment?.billing?.address ? 'Billing Address' : 'Shipping Address'}</h3>
            <div className={styles.cardContent}>
              <div className={styles.address}>
                <Home size={16} />
                <div>
                  {(() => {
                    const addressData = getAddressForDisplay();
                    if (!addressData) {
                      return <p>No address information available</p>;
                    }
                    
                    return (
                      <>
                        <p>{addressData.line1 || 'N/A'}</p>
                        {addressData.line2 && <p>{addressData.line2}</p>}
                        <p>
                          {addressData.city && `${addressData.city}, `}
                          {addressData.state && `${addressData.state} `}
                          {addressData.postalCode && addressData.postalCode}
                        </p>
                        <p>{addressData.country || 'Pakistan'}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Show customer's phone number from payment if available */}
              {payment?.billing?.phone && (
                <div className={styles.cardItem} style={{marginTop: "10px"}}>
                  <PhoneCall size={16} />
                  <strong>Phone:</strong>
                  <span>{payment.billing.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Details */}
          <div className={styles.detailsCard}>
            <h3>Payment Details</h3>
            <div className={styles.cardContent}>
              <div className={styles.cardItem}>
                <strong>Method:</strong>
                <span>{order.paymentMethod || 'Card'}</span>
              </div>
              <div className={styles.cardItem}>
                <strong>Status:</strong>
                <span>{order.status || 'Pending'}</span>
              </div>
              <div className={styles.cardItem}>
                <strong>Date:</strong>
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          
          {/* Order Timeline */}
          <div className={styles.detailsCard}>
            <h3>Order Timeline</h3>
            <div className={styles.timeline}>
              <div className={`${styles.timelineItem} ${styles.completed}`}>
                <div className={styles.timelineIcon}>
                  <Clock size={16} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitle}>Order Placed</p>
                  <p className={styles.timelineDate}>{formatDate(order.createdAt)}</p>
                </div>
              </div>
              
              <div className={`${styles.timelineItem} ${order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered' ? styles.completed : ''}`}>
                <div className={styles.timelineIcon}>
                  <Package size={16} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitle}>Processing</p>
                  <p className={styles.timelineDate}>
                    {order.status === 'Processing' ? 'In Progress' : (order.status === 'Shipped' || order.status === 'Delivered' ? 'Completed' : 'Pending')}
                  </p>
                </div>
              </div>
              
              <div className={`${styles.timelineItem} ${order.status === 'Shipped' || order.status === 'Delivered' ? styles.completed : ''}`}>
                <div className={styles.timelineIcon}>
                  <Truck size={16} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitle}>Shipped</p>
                  <p className={styles.timelineDate}>
                    {order.status === 'Shipped' ? 'In Transit' : (order.status === 'Delivered' ? 'Completed' : 'Pending')}
                  </p>
                </div>
              </div>
              
              <div className={`${styles.timelineItem} ${order.status === 'Delivered' ? styles.completed : ''}`}>
                <div className={styles.timelineIcon}>
                  <Home size={16} />
                </div>
                <div className={styles.timelineContent}>
                  <p className={styles.timelineTitle}>Delivered</p>
                  <p className={styles.timelineDate}>
                    {order.status === 'Delivered' ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className={styles.orderItemsCard}>
          <h3>Order Items</h3>
          <div className={styles.tableContainer}>
            <table className={styles.itemsTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products && order.products.length > 0 ? (
                  order.products.map((product, index) => (
                    <tr key={index}>
                      <td className={styles.productCell}>
                        <div className={styles.productInfo}>
                          <span className={styles.productName}>{product.name}</span>
                          {product.category && <span className={styles.productCategory}>{product.category}</span>}
                        </div>
                      </td>
                      <td>PKR {product.price?.toLocaleString()}</td>
                      <td>{product.quantity}</td>
                      <td className={styles.totalColumn}>PKR {(product.price * product.quantity).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className={styles.noItems}>No items found in this order</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Order Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal:</span>
              <span>PKR {summary.subtotal?.toLocaleString()}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Tax:</span>
              <span>PKR {summary.tax?.toLocaleString()}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Shipping:</span>
              <span>PKR {summary.shipping?.toLocaleString()}</span>
            </div>
            
            {summary.discountValue > 0 && (
              <div className={styles.summaryRow}>
                <span>
                  Discount 
                  {order.discount?.code && ` (${order.discount.code})`}:
                  {summary.discountType === 'percent' ? ` ${summary.discountValue}%` : ''}
                </span>
                <span className={styles.discountValue}>
                  - PKR {summary.discountAmount?.toLocaleString()}
                </span>
              </div>
            )}
            
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total:</span>
              <span>PKR {summary.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Invoice Modal */}
      {showInvoice && (
        <OrderInvoice 
          order={order} 
          payment={payment}
          onClose={() => setShowInvoice(false)} 
        />
      )}
    </div>
  );
};

export default OrderDetailsPage;

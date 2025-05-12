import React, { forwardRef } from 'react';
import styles from '../../styles/orderInvoice.module.css';
import logo from '../../assets/logo.png'; // Adjust path as needed

const OrderInvoice = forwardRef(({ order }, ref) => {
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

  // Calculate subtotal (before tax, shipping, etc)
  const calculateSubtotal = () => {
    if (!order.products || !Array.isArray(order.products)) return 0;
    
    return order.products.reduce((total, product) => {
      const price = product.discountedPrice || product.price || 0;
      const quantity = product.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  // Calculate tax amount (assuming tax is included in total)
  const calculateTax = () => {
    return order.tax || (order.total * 0.05); // Default to 5% if not specified
  };

  // Calculate shipping cost
  const calculateShipping = () => {
    return order.shippingCost || 0;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `PKR ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax();
  const shipping = calculateShipping();

  return (
    <div ref={ref} className={styles.invoice}>
      <div className={styles.invoiceHeader}>
        <div className={styles.logo}>
          <img src={logo} alt="AegleKart" />
          <h1>AegleKart</h1>
        </div>
        <div className={styles.invoiceDetails}>
          <h2>INVOICE</h2>
          <p><strong>Invoice #:</strong> {order.orderId || order._id}</p>
          <p><strong>Date:</strong> {formatDate(order.date || order.createdAt || new Date())}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod || 'Card'}</p>
          <p><strong>Status:</strong> <span className={styles[order.status?.toLowerCase() || 'pending']}>{order.status || 'Pending'}</span></p>
        </div>
      </div>

      <div className={styles.invoiceAddresses}>
        <div className={styles.billingAddress}>
          <h3>Billing Address</h3>
          <p>{order.customer?.name || 'Customer'}</p>
          <p>{order.billingAddress?.street || order.customer?.address?.street || ''}</p>
          <p>
            {order.billingAddress?.city || order.customer?.address?.city || ''}, 
            {order.billingAddress?.state || order.customer?.address?.state || ''} 
            {order.billingAddress?.postalCode || order.customer?.address?.postalCode || ''}
          </p>
          <p>{order.billingAddress?.country || order.customer?.address?.country || ''}</p>
          <p>{order.customer?.phone || ''}</p>
          <p>{order.customer?.email || ''}</p>
        </div>
        <div className={styles.shippingAddress}>
          <h3>Shipping Address</h3>
          <p>{order.customer?.name || 'Customer'}</p>
          <p>{order.shippingAddress?.street || order.customer?.address?.street || ''}</p>
          <p>
            {order.shippingAddress?.city || order.customer?.address?.city || ''}, 
            {order.shippingAddress?.state || order.customer?.address?.state || ''} 
            {order.shippingAddress?.postalCode || order.customer?.address?.postalCode || ''}
          </p>
          <p>{order.shippingAddress?.country || order.customer?.address?.country || ''}</p>
        </div>
      </div>

      <table className={styles.invoiceItems}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {(order.products || []).map((product, index) => (
            <tr key={index}>
              <td>{product.name || `Product ${index + 1}`}</td>
              <td>{product.description || `${product.brandName || ''} ${product.category || ''}`}</td>
              <td>{product.quantity || 1}</td>
              <td>{formatCurrency(product.discountedPrice || product.price || 0)}</td>
              <td>{formatCurrency((product.discountedPrice || product.price || 0) * (product.quantity || 1))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.invoiceSummary}>
        <div className={styles.summaryLabel}>Subtotal:</div>
        <div className={styles.summaryValue}>{formatCurrency(subtotal)}</div>
        
        <div className={styles.summaryLabel}>Tax:</div>
        <div className={styles.summaryValue}>{formatCurrency(tax)}</div>
        
        <div className={styles.summaryLabel}>Shipping:</div>
        <div className={styles.summaryValue}>{formatCurrency(shipping)}</div>
        
        <div className={`${styles.summaryLabel} ${styles.total}`}>Total:</div>
        <div className={`${styles.summaryValue} ${styles.total}`}>{formatCurrency(order.total || 0)}</div>
      </div>

      <div className={styles.invoiceFooter}>
        <p>Thank you for your purchase!</p>
        <p>For any questions or concerns regarding this invoice, please contact our customer service at support@aeglekart.com</p>
        <p>&copy; {new Date().getFullYear()} AegleKart. All rights reserved.</p>
      </div>
    </div>
  );
});

OrderInvoice.displayName = 'OrderInvoice';

export default OrderInvoice;

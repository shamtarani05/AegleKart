import React, { useRef } from 'react';
import { Printer, X } from 'lucide-react';
import styles from '../../styles/orderInvoice.module.css';

const OrderInvoice = ({ order, payment, onClose }) => {
  const invoiceRef = useRef();
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };
  
  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!order.products || !Array.isArray(order.products)) {
      return order.subtotal || 0;
    }
    return order.products.reduce((sum, product) => {
      return sum + ((product.price || 0) * (product.quantity || 1));
    }, 0);
  };

  // Calculate tax amount (8% tax)
  const calculateTax = () => {
    // If tax is provided in the order, use that
    if (order.tax !== undefined) return order.tax;
    // Otherwise calculate 8% tax
    return calculateSubtotal() * 0.08;
  };

  // Calculate shipping
  const getShippingCost = () => {
    return order.shipping || 0;
  };

  // Get discount information
  const getDiscountInfo = () => {
    // Check for various discount fields that might exist
    if (order.discount) {
      if (typeof order.discount === 'number') {
        return { value: order.discount, type: 'fixed' };
      } else if (order.discount.value) {
        return { 
          value: order.discount.value, 
          type: order.discount.type || 'fixed',
          code: order.discount.code
        };
      }
    } else if (order.promoDiscount) {
      return { value: order.promoDiscount, type: 'fixed' };
    }
    return { value: 0, type: 'fixed' };
  };

  // Format discount based on type
  const formatDiscount = () => {
    const { value, type } = getDiscountInfo();
    
    if (value <= 0) return null;
    
    if (type === 'percent') {
      return `${value}%`;
    } else {
      return `PKR ${value.toLocaleString()}`;
    }
  };

  // Calculate discount amount in PKR - applied at the end of calculation
  const calculateDiscountAmount = () => {
    const { value, type } = getDiscountInfo();
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = getShippingCost();
    
    if (value <= 0) return 0;
    
    // Apply discount after adding tax and shipping
    const preDiscountTotal = subtotal + tax + shipping;
    
    if (type === 'percent') {
      return preDiscountTotal * (value / 100);
    } else {
      return value;
    }
  };

  // Calculate final total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = getShippingCost();
    const discount = calculateDiscountAmount();
    
    return subtotal + tax + shipping - discount;
  };

  // Improved print function
  const handlePrint = () => {
    // Open a new window
    const printWindow = window.open('', '_blank');
    
    // Generate styles and HTML content
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${order.orderId || order._id}</title>
        <style>
          /* Reset and base styles */
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 20px;
            margin: 0;
          }
          
          /* Invoice styles */
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
          }
          
          .invoice-title {
            color: #16a34a;
            font-size: 32px;
            margin: 0;
          }
          
          .invoice-tagline {
            color: #666;
            font-size: 16px;
          }
          
          .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          
          .invoice-info {
            max-width: 50%;
          }
          
          .invoice-info h2 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #2c3e50;
          }
          
          .invoice-number {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .invoice-addresses {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          
          .address-block {
            width: 45%;
          }
          
          .address-block p {
            margin: 3px 0;
          }
          
          .address-title {
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          /* Table styles */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          
          th, td {
            padding: 12px 15px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          
          th {
            background-color: #f8f9fa;
            font-weight: bold;
          }
          
          /* Summary section */
          .invoice-summary {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }
          
          .invoice-totals {
            width: 350px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          
          .grand-total {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #ddd;
            padding-top: 10px;
            margin-top: 10px;
          }
          
          /* Payment and footer */
          .payment-details {
            margin-bottom: 30px;
          }
          
          .payment-details h3 {
            margin-bottom: 10px;
            font-size: 18px;
          }
          
          .invoice-footer {
            text-align: center;
            color: #666;
            margin-top: 50px;
            font-size: 14px;
          }
          
          .terms-conditions {
            font-size: 12px;
            margin-top: 15px;
          }
          
          /* Status colors */
          .pending { color: #f59e0b; }
          .processing { color: #3b82f6; }
          .shipped { color: #8b5cf6; }
          .delivered { color: #10b981; }
          .cancelled { color: #ef4444; }
          .refunded { color: #6b7280; }

          /* Print-specific */
          @page {
            size: auto;
            margin: 20mm;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1 class="invoice-title">AegleKart</h1>
            <p class="invoice-tagline">Your Health, Our Priority</p>
          </div>
          
          <div class="invoice-details">
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <div class="invoice-number">#${order.orderId || order._id || ''}</div>
              <div>
                <strong>Date Issued:</strong> ${formatDate(order.createdAt)}
              </div>
              <div>
                <strong>Status:</strong> 
                <span class="${order.status?.toLowerCase() || 'pending'}">${order.status || 'Pending'}</span>
              </div>
            </div>
          </div>
          
          <div class="invoice-addresses">
            <div class="address-block">
              <div class="address-title">From:</div>
              <p>AegleKart Pharmaceuticals</p>
              <p>123 Health Avenue</p>
              <p>Islamabad, Pakistan</p>
              <p>Email: support@aeglekart.com</p>
              <p>Phone: +92-123-4567890</p>
            </div>
            
            <div class="address-block">
              <div class="address-title">To:</div>
              <p>${customer.name}</p>
              <p>
                ${address.line1 || ''} 
                ${address.line2 ? `, ${address.line2}` : ''}
              </p>
              <p>
                ${address.city || ''} 
                ${address.state ? `, ${address.state}` : ''} 
                ${address.postalCode || ''}
              </p>
              <p>${address.country || 'Pakistan'}</p>
              <p>Email: ${customer.email}</p>
              <p>Phone: ${customer.phone}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.products && Array.isArray(order.products) ? 
                order.products.map((product, index) => `
                  <tr>
                    <td>${product.name || `Product ${index + 1}`}</td>
                    <td>${product.quantity || 1}</td>
                    <td>PKR ${(product.price || 0).toLocaleString()}</td>
                    <td>PKR ${((product.price || 0) * (product.quantity || 1)).toLocaleString()}</td>
                  </tr>
                `).join('') : 
                '<tr><td colspan="4">No items found</td></tr>'
              }
            </tbody>
          </table>
          
          <div class="invoice-summary">
            <div class="invoice-totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>PKR ${calculateSubtotal().toLocaleString()}</span>
              </div>
              
              <div class="total-row">
                <span>Tax (8%):</span>
                <span>PKR ${calculateTax().toLocaleString()}</span>
              </div>
              
              <div class="total-row">
                <span>Shipping:</span>
                <span>PKR ${getShippingCost().toLocaleString()}</span>
              </div>
              
              ${getDiscountInfo().value > 0 ? `
              <div class="total-row">
                <span>Discount (${formatDiscount()}):</span>
                <span>- PKR ${calculateDiscountAmount().toLocaleString()}</span>
              </div>
              ` : ''}
              
              ${getPromoCode() ? `
              <div class="total-row">
                <span>Promo Code:</span>
                <span>${getPromoCode()}</span>
              </div>
              ` : ''}
              
              <div class="total-row grand-total">
                <span>Total:</span>
                <span>PKR ${calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="payment-details">
            <h3>Payment Details</h3>
            <p><strong>Method:</strong> ${order.paymentMethod || 'Card'}</p>
            <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
            <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
          </div>
          
          <div class="invoice-footer">
            <p>Thank you for shopping with AegleKart!</p>
            <p>For any questions or concerns, please contact our customer support.</p>
            <p class="terms-conditions">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Write the content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = function() {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };
  
  // Get promo code
  const getPromoCode = () => {
    if (order.discount && order.discount.code) {
      return order.discount.code;
    } else if (order.promoCode) {
      return order.promoCode;
    }
    return null;
  };

  // Get the best available address from payment or order
  const getBillingAddress = () => {
    if (payment && payment.billing && payment.billing.address) {
      return payment.billing.address;
    }
    return order.shippingAddress || {};
  };
  
  // Get customer contact info with fallbacks
  const getCustomerInfo = () => {
    const result = {
      name: order.customer?.name || payment?.billing?.name || 'Customer',
      email: order.customer?.email || payment?.customer?.email || 'N/A',
      phone: payment?.billing?.phone || order.customer?.phone || 'N/A'
    };
    return result;
  };
  
  const address = getBillingAddress();
  const customer = getCustomerInfo();

  return (
    <div className={styles.invoiceModalOverlay}>
      <div className={styles.invoiceModalContent}>
        <div className={styles.invoiceHeader}>
          <h2>Invoice</h2>
          <div className={styles.invoiceActions}>
            <button 
              className={styles.printButton}
              onClick={handlePrint}
              title="Print Invoice"
            >
              <Printer size={18} />
              <span>Print</span>
            </button>
            <button 
              className={styles.closeButton}
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        
        {/* Printable invoice content */}
        <div id="printable-invoice" className={styles.invoicePrintableContent} ref={invoiceRef}>
          <div className={styles.invoiceBranding}>
            <h1>AegleKart</h1>
            <p className={styles.tagline}>Your Health, Our Priority</p>
          </div>
          
          <div className={styles.invoiceDetails}>
            <div className={styles.invoiceInfo}>
              <h2>INVOICE</h2>
              <div className={styles.invoiceNumber}>#{order.orderId || order._id}</div>
              <div className={styles.invoiceDate}>
                <strong>Date Issued:</strong> {formatDate(order.createdAt)}
              </div>
              <div className={styles.invoiceStatus}>
                <strong>Status:</strong> <span className={styles[order.status?.toLowerCase() || "pending"]}>{order.status || "Pending"}</span>
              </div>
            </div>
            
            <div className={styles.invoiceAddress}>
              <div className={styles.companyAddress}>
                <strong>From:</strong>
                <p>AegleKart Pharmaceuticals</p>
                <p>123 Health Avenue</p>
                <p>Islamabad, Pakistan</p>
                <p>Email: support@aeglekart.com</p>
                <p>Phone: +92-123-4567890</p>
              </div>
              
              <div className={styles.customerAddress}>
                <strong>To:</strong>
                <p>{customer.name}</p>
                <p>
                  {address.line1 || ""}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p>
                  {address.city || ""} 
                  {address.state ? `, ${address.state}` : ""} 
                  {address.postalCode || ""}
                </p>
                <p>{address.country || "Pakistan"}</p>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
              </div>
            </div>
          </div>
          
          <div className={styles.invoiceItems}>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products && Array.isArray(order.products) && order.products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <div className={styles.productDetails}>
                        <span className={styles.productName}>{product.name || `Product ${index + 1}`}</span>
                      </div>
                    </td>
                    <td>{product.quantity || 1}</td>
                    <td>PKR {(product.price || 0).toLocaleString()}</td>
                    <td>PKR {((product.price || 0) * (product.quantity || 1)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={styles.invoiceSummary}>
            <div className={styles.invoiceTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span>PKR {calculateSubtotal().toLocaleString()}</span>
              </div>
              
              <div className={styles.totalRow}>
                <span>Tax (8%):</span>
                <span>PKR {calculateTax().toLocaleString()}</span>
              </div>
              
              <div className={styles.totalRow}>
                <span>Shipping:</span>
                <span>PKR {getShippingCost().toLocaleString()}</span>
              </div>
              
              {/* Display discount if exists */}
              {getDiscountInfo().value > 0 && (
                <div className={styles.totalRow}>
                  <span>Discount ({formatDiscount()}):</span>
                  <span className={styles.discountValue}>- PKR {calculateDiscountAmount().toLocaleString()}</span>
                </div>
              )}
              
              {/* Display promo code if exists */}
              {getPromoCode() && (
                <div className={styles.totalRow}>
                  <span>Promo Code:</span>
                  <span>{getPromoCode()}</span>
                </div>
              )}
              
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total:</span>
                <span>PKR {calculateTotal().toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.invoicePayment}>
            <div className={styles.paymentDetails}>
              <h3>Payment Details</h3>
              <p><strong>Method:</strong> {order.paymentMethod || "Card"}</p>
              <p><strong>Status:</strong> {order.status || "Pending"}</p>
              <p><strong>Date:</strong> {formatDate(order.createdAt)}</p>
            </div>
          </div>
          
          <div className={styles.invoiceFooter}>
            <p>Thank you for shopping with AegleKart!</p>
            <p>For any questions or concerns, please contact our customer support.</p>
            <p className={styles.termsConditions}>
              This is a computer-generated invoice and does not require a signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoice;

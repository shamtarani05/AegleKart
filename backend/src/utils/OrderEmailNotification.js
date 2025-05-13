// orderEmailNotification.js
const nodemailer = require('nodemailer');
const config = require('../config/emailConfig');
const { generateInvoicePDF } = require('./invoiceGenerator');

/**
 * Initialize email transporter using Gmail
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

/**
 * Format currency in PKR
 * @param {Number} amount - Amount in PKR
 * @returns {String} - Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Generate product table HTML for email
 * @param {Array} products - Array of product objects
 * @returns {String} - HTML table of products
 */
const generateProductsTable = (products) => {
  return `
    <table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f8f9fa;">
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6;">Product</th>
          <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">Category</th>
          <th style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">Quantity</th>
          <th style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">Price</th>
          <th style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(product => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #dee2e6;">${product.name}</td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">${product.category || 'N/A'}</td>
            <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">${product.quantity}</td>
            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">${formatCurrency(product.price)}</td>
            <td style="padding: 12px; text-align: right; border-bottom: 1px solid #dee2e6;">${formatCurrency(product.price * product.quantity)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
};

/**
 * Generate order summary table HTML
 * @param {Object} orderData - Order information
 * @returns {String} - HTML table of order summary
 */
const generateOrderSummary = (orderData) => {
  return `
    <table style="width: 100%; max-width: 400px; margin-left: auto; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px; text-align: right;">Subtotal:</td>
        <td style="padding: 8px; text-align: right; font-weight: 500;">${formatCurrency(orderData.subtotal)}</td>
      </tr>
      ${orderData.tax ? `
      <tr>
        <td style="padding: 8px; text-align: right;">Tax:</td>
        <td style="padding: 8px; text-align: right; font-weight: 500;">${formatCurrency(orderData.tax)}</td>
      </tr>
      ` : ''}
      ${orderData.discount ? `
      <tr>
        <td style="padding: 8px; text-align: right;">Discount (${orderData.discount.code}):</td>
        <td style="padding: 8px; text-align: right; font-weight: 500; color: #28a745;">-${orderData.discount.type === 'percent' 
          ? orderData.discount.value + '%' 
          : formatCurrency(orderData.discount.value)}</td>
      </tr>
      ` : ''}
      ${orderData.shipping ? `
      <tr>
        <td style="padding: 8px; text-align: right;">Shipping:</td>
        <td style="padding: 8px; text-align: right; font-weight: 500;">${formatCurrency(orderData.shipping)}</td>
      </tr>
      ` : ''}
      <tr style="border-top: 2px solid #dee2e6;">
        <td style="padding: 8px; text-align: right; font-weight: 700;">Total:</td>
        <td style="padding: 8px; text-align: right; font-weight: 700;">${formatCurrency(orderData.total)}</td>
      </tr>
    </table>
  `;
};

/**
 * Generate shipping address HTML
 * @param {Object} address - Shipping address object
 * @returns {String} - Formatted address HTML
 */
const formatShippingAddress = (address) => {
  if (!address) return 'No shipping address provided';
  
  return `
    ${address.name || ''}<br>
    ${address.line1 || ''}<br>
    ${address.line2 ? address.line2 + '<br>' : ''}
    ${address.city ? address.city + ', ' : ''}${address.state || ''} ${address.postalCode || ''}<br>
    ${address.country || ''}
  `;
};

/**
 * Generate the full HTML email content
 * @param {Object} orderData - Complete order data
 * @returns {String} - Complete HTML email body
 */
const generateEmailHTML = (orderData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 650px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4a4a4a; margin-bottom: 10px;">Order Confirmation</h1>
        <p>Thank you for your purchase!</p>
      </div>
      
      <div style="margin-bottom: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
        <h2 style="margin-top: 0; color: #4a4a4a; font-size: 18px;">Order Details</h2>
        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleDateString('en-PK', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p><strong>Payment Method:</strong> ${orderData.paymentMethod || 'Card'}</p>
        <p><strong>Order Status:</strong> ${orderData.status}</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="color: #4a4a4a; font-size: 18px;">Purchased Items</h2>
        ${generateProductsTable(orderData.products)}
        ${generateOrderSummary(orderData)}
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
        <div style="width: 48%;">
          <h2 style="color: #4a4a4a; font-size: 18px;">Customer Information</h2>
          <p><strong>Name:</strong> ${orderData.customer.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${orderData.customer.email || 'N/A'}</p>
          <p><strong>Phone:</strong> ${orderData.customer.phone || 'N/A'}</p>
        </div>
        
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 14px;">
        <p>If you have any questions about your order, please contact our customer support.</p>
        <p>&copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send order confirmation email to customer
 * @param {Object} orderData - Complete order data 
 * @returns {Promise<Object>} - Email sending result
 */
const sendOrderConfirmationEmail = async (orderData) => {
  try {
    if (!orderData.customer || !orderData.customer.email) {
      throw new Error('Customer email not provided');
    }
    
    // Generate PDF invoice
    let pdfBuffer;
    try {
      pdfBuffer = await generateInvoicePDF(orderData);
    } catch (pdfError) {
      console.error('Error generating PDF invoice:', pdfError);
      // Continue with email sending even if PDF generation fails
    }

    const mailOptions = {
      from: `"${config.fromName}" <${process.env.SENDER_EMAIL}>`,
      to: orderData.customer.email,
      subject: `Order Confirmation #${orderData.orderId}`,
      html: generateEmailHTML(orderData),
      attachments: []
    };
    
    // Attach PDF invoice if generated successfully
    if (pdfBuffer) {
      mailOptions.attachments.push({
        filename: `invoice-${orderData.orderId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
      });
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${orderData.customer.email}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail
};
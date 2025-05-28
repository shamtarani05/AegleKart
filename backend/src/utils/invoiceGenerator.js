const PDFDocument = require('pdfkit');

/**
 * Generate a PDF invoice for an order with clean, minimal styling
 * @param {Object} orderData - Complete order data
 * @returns {Promise<Buffer>} - PDF buffer that can be attached to email
 */
const generateInvoicePDF = (orderData) => {
  return new Promise((resolve, reject) => {
    try {
      // Define colors for styling
      const colors = {
        green: '#2DB84C',      // AegleKart green for logo
        text: '#333333',       // Dark gray for main text
        lightText: '#666666',  // Light gray for secondary text
        borderColor: '#DDDDDD' // Light gray for borders
      };
      
      // Create a new PDF document
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        info: {
          Title: `Invoice ${orderData.orderId}`,
          Author: 'AegleKart',
          Subject: 'Invoice'
        }
      });
      
      // Collect PDF data in memory buffer
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Set default fill color
      doc.fillColor(colors.text);
      
      // Add current date to top left
      const currentDate = new Date().toLocaleString('en-PK', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
      doc.fontSize(9)
         .fillColor(colors.lightText)
         .text(currentDate, 50, 50);
      
      // Add invoice number to top right
      doc.fontSize(9)
         .fillColor(colors.lightText)
         .text(`Invoice ${orderData.orderId}`, 500, 50, { align: 'right' });
      
      // Add company name with green color
      doc.fontSize(30)
         .fillColor(colors.green)
         .text('AegleKart', 50, 100, { align: 'center' });
      
      // Add tagline
      doc.fontSize(12)
         .fillColor(colors.lightText)
         .text('Your Health, Our Priority', 50, 135, { align: 'center' });
      
      // Add space
      doc.moveDown(2);
      
      // Add "INVOICE" title
      doc.fontSize(20)
         .fillColor(colors.text)
         .text('INVOICE', 50, 180);
      
      // Add invoice number
      doc.fontSize(11)
         .text(`#${orderData.orderId}`, 50, 210);
      
      // Add date issued
      const dateIssued = new Date(orderData.createdAt).toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      doc.fontSize(11)
         .text(`Date Issued: ${dateIssued}`, 50, 230);
      
      // Add status
      doc.text(`Status: `, 50, 250);
      
      // Handle status color
      let statusColor = colors.green; // Default green for "paid"
      if (orderData.status.toLowerCase() === 'pending' || orderData.status.toLowerCase() === 'processing') {
        statusColor = '#0066CC'; // Blue for pending/processing
      } else if (orderData.status.toLowerCase() === 'cancelled') {
        statusColor = '#E53935'; // Red for cancelled
      }
      
      // Add colored status
      doc.fillColor(statusColor)
         .text(orderData.status, 95, 250, { continued: false });
      
      // Reset to default text color
      doc.fillColor(colors.text);
      
      // Add From section (left aligned)
      doc.text('From:', 50, 290);
      doc.fontSize(10)
         .text('AegleKart Pharmaceuticals', 50, 310);
      doc.text('123 Health Avenue', 50, 325);
      doc.text('Islamabad, Pakistan', 50, 340);
      doc.text(`Email: support@aeglekart.com`, 50, 355);
      doc.text(`Phone: +92-123-4567890`, 50, 370);
      
      // Add To section (right aligned)
      doc.fontSize(11)
         .text('To:', 300, 290);
      
      // Add customer info
      const customerName = orderData.customer?.name || orderData.shippingAddress?.name || 'N/A';
      doc.fontSize(10)
         .text(customerName, 300, 310);
      
      // Add shipping address if available
      if (orderData.shippingAddress) {
        const address = [
          orderData.shippingAddress.line1,
          orderData.shippingAddress.line2,
          orderData.shippingAddress.city,
          `${orderData.shippingAddress.state || ''} ${orderData.shippingAddress.postalCode || ''}`,
          orderData.shippingAddress.country
        ].filter(Boolean);
        
        let yPos = 325;
        address.forEach(line => {
          doc.text(line, 300, yPos);
          yPos += 15;
        });
        
        // Add customer email and phone if available
        if (orderData.customer?.email) {
          doc.text(`Email: ${orderData.customer.email}`, 300, yPos);
          yPos += 15;
        }
        
        if (orderData.customer?.phone) {
          doc.text(`Phone: ${orderData.customer.phone || 'N/A'}`, 300, yPos);
        }
      } else if (orderData.customer) {
        // Just add customer contact info if no shipping address
        doc.text(`Email: ${orderData.customer.email || 'N/A'}`, 300, 325);
        doc.text(`Phone: ${orderData.customer.phone || 'N/A'}`, 300, 340);
      }
      
      // Add item table - start with headers
      const tableTop = 430;
      const tableWidth = doc.page.width - 100;
      
      // Add divider line
      doc.strokeColor(colors.borderColor)
         .lineWidth(1)
         .moveTo(50, tableTop - 10)
         .lineTo(tableWidth + 50, tableTop - 10)
         .stroke();
      
      // Table headers
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Item', 50, tableTop)
         .text('Quantity', 300, tableTop, { width: 70, align: 'center' })
         .text('Unit Price', 370, tableTop, { width: 90, align: 'right' })
         .text('Total', 460, tableTop, { width: 80, align: 'right' });
      
      // Add divider line after headers
      doc.strokeColor(colors.borderColor)
         .lineWidth(1)
         .moveTo(50, tableTop + 20)
         .lineTo(tableWidth + 50, tableTop + 20)
         .stroke();
      
      // Format currency
      const formatAmount = (amount) => {
        return 'PKR ' + amount.toLocaleString('en-PK');
      };
      
      // Reset to regular font
      doc.font('Helvetica');
      
      // Add items
      let position = tableTop + 35;
      
      // Add each product row
      orderData.products.forEach(item => {
        // Check if we need a new page
        if (position > 700) {
          doc.addPage();
          position = 50;
          
          // Add table headers on new page
          doc.fontSize(10)
             .font('Helvetica-Bold')
             .text('Item', 50, position)
             .text('Quantity', 300, position, { width: 70, align: 'center' })
             .text('Unit Price', 370, position, { width: 90, align: 'right' })
             .text('Total', 460, position, { width: 80, align: 'right' });
             
          // Add divider line after headers
          doc.strokeColor(colors.borderColor)
             .lineWidth(1)
             .moveTo(50, position + 20)
             .lineTo(tableWidth + 50, position + 20)
             .stroke();
             
          position += 35;
          doc.font('Helvetica');
        }
        
        const amount = item.price * item.quantity;
        
        doc.fontSize(10)
           .text(item.name, 50, position, { width: 240 });
        doc.text(item.quantity.toString(), 300, position, { width: 70, align: 'center' });
        doc.text(formatAmount(item.price), 370, position, { width: 90, align: 'right' });
        doc.text(formatAmount(amount), 460, position, { width: 80, align: 'right' });
        
        position += 25;
      });
      
      // Add divider line at end of items
      doc.strokeColor(colors.borderColor)
         .lineWidth(1)
         .moveTo(50, position)
         .lineTo(tableWidth + 50, position)
         .stroke();
      
      position += 20;
      
      // Add summary section (right aligned)
      doc.text('Subtotal:', 370, position, { width: 90, align: 'right' });
      doc.text(formatAmount(orderData.subtotal), 460, position, { width: 80, align: 'right' });
      position += 20;
      
      // Add tax if applicable
      if (orderData.tax || orderData.tax === 0) {
        const taxPercentage = Math.round((orderData.tax / orderData.subtotal) * 100);
        doc.text(`Tax (${taxPercentage}%):`, 370, position, { width: 90, align: 'right' });
        doc.text(formatAmount(orderData.tax), 460, position, { width: 80, align: 'right' });
        position += 20;
      }
      
      // Add discount if applicable
      if (orderData.discount) {
        const discountText = `Discount (${orderData.discount.code}):`;
        const discountAmount = orderData.discount.type === 'percent' 
          ? orderData.subtotal * (orderData.discount.value / 100)
          : orderData.discount.value;
          
        doc.text(discountText, 370, position, { width: 90, align: 'right' });
        doc.text(`-${formatAmount(discountAmount)}`, 460, position, { width: 80, align: 'right' });
        position += 20;
      }
      
      // Add shipping if applicable
      if (orderData.shipping !== undefined) {
        doc.text('Shipping:', 370, position, { width: 90, align: 'right' });
        doc.text(formatAmount(orderData.shipping), 460, position, { width: 80, align: 'right' });
        position += 20;
      }
      
      // Add final divider line before total
      doc.strokeColor(colors.borderColor)
         .lineWidth(0.5)
         .moveTo(370, position)
         .lineTo(540, position)
         .stroke();
         
      position += 10;
      
      // Add total 
      doc.font('Helvetica-Bold')
         .text('Total:', 370, position, { width: 90, align: 'right' });
      doc.text(formatAmount(orderData.total), 460, position, { width: 80, align: 'right' });
      
      // Add page number at very bottom
      doc.font('Helvetica')
         .fontSize(8)
         .text(`${doc.page.pageNumber}/2`, 500, 800, { align: 'right' });
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePDF
};
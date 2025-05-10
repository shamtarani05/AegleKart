/**
 * Utility functions for generating unique IDs used across the application
 */

/**
 * Generate a unique order ID in the format ORD-YYYYMMDD-XXXX
 * @returns {string} Unique order ID
 */
function generateOrderId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `ORD-${year}${month}${day}-${randomPart}`;
}

/**
 * Generate a unique payment ID in the format PAY-YYYYMMDD-XXXX
 * @returns {string} Unique payment ID
 */
function generatePaymentId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  return `PAY-${year}${month}${day}-${randomPart}`;
}

module.exports = {
  generateOrderId,
  generatePaymentId
};
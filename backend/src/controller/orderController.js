const Order = require('../models/Order');
const Payment = require('../models/Payment');

/**
 * Verify payment status for an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Find the order
    const order = await Order.findOne({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Find the payment
    const payment = await Payment.findOne({ orderId: orderId });
    
    res.status(200).json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt
      },
      payment: payment ? {
        paymentId: payment.paymentId,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt
      } : null
    });
    
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
  }
};

/**
 * Get order details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.status(200).json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({ success: false, message: 'Error retrieving order details', error: error.message });
  }
};

/**
 * Get orders by customer email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getCustomerOrders = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Customer email is required' });
    }
    
    const orders = await Order.find({ 
      'customer.email': email 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders: orders.map(order => ({
        orderId: order.orderId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.length
      }))
    });
    
  } catch (error) {
    console.error('Error getting customer orders:', error);
    res.status(500).json({ success: false, message: 'Error retrieving customer orders', error: error.message });
  }
};

module.exports = {
  verifyPayment,
  getOrderDetails,
  getCustomerOrders
};
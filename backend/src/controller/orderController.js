const Order = require('../models/order-schema');
const Payment = require('../models/payment-schema');

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
    console.log(`Fetching order with ID: ${orderId}`);

    // Try to find by orderId first
    let order = await Order.findOne({ orderId: orderId });

    // If not found, try MongoDB _id or custom id field
    if (!order) {
      if (orderId.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(orderId);
      } else {
        order = await Order.findOne({ id: orderId });
      }
    }
    
    if (!order) {
      console.log(`Order not found: ${orderId}`);
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    console.log(`Order found: ${order.orderId}`);
    res.status(200).json({
      success: true,
      order
    });
    
  } catch (error) {
    console.error('Error getting order details:', error);
    res.status(500).json({ success: false, message: 'Error retrieving order details', error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    // Sort orders by createdAt in descending order (newest first)
    const orders = await Order.find({}).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: 'No Orders Yet' });
    }

    res.status(200).json(orders);
  } catch(error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ success: false, message: 'Error retrieving orders', error: error.message });
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

/**
 * Get payment details for an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const getPaymentByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`Fetching payment for orderId: ${orderId}`);
    
    // Find payment by orderId
    const payment = await Payment.findOne({ orderId });
    
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment information not found' });
    }
    
    res.status(200).json({
      success: true,
      payment
    });
    
  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({ success: false, message: 'Error retrieving payment details', error: error.message });
  }
};

/**
 * Update order status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Validate the status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    
    // Find the order by orderId
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Update the order status
    order.status = status;
    order.updatedAt = new Date();
    
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Error updating order status', error: error.message });
  }
};

module.exports = {
  verifyPayment,
  getOrderDetails,
  getCustomerOrders,
  getAllOrders,
  getPaymentByOrderId,
  updateOrderStatus
};
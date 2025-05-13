const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

// Debug middleware to track requests
router.use((req, res, next) => {
  console.log(`Orders API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Verify payment status for an order
router.get('/verify-payment/:orderId', orderController.verifyPayment);

// Get payment details for an order
router.get('/payment/:orderId', orderController.getPaymentByOrderId);

// Get order details by ID
router.get('/details/:orderId', orderController.getOrderDetails);

// Get order details
router.get('/:orderId', orderController.getOrderDetails);

// Get customer orders
router.get('/customer/:email', orderController.getCustomerOrders);

// Get all orders
router.get('/', orderController.getAllOrders);

// Update order status
router.put('/update-status/:orderId', orderController.updateOrderStatus);

module.exports = router;
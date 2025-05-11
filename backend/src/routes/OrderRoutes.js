const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controller/orderController');

// Verify payment status for an order
orderRouter.get('/verify-payment/:orderId', orderController.verifyPayment);

// Get order details
orderRouter.get('/:orderId', orderController.getOrderDetails);

// Get customer orders
orderRouter.get('/customer/:email', orderController.getCustomerOrders);

//Get All Orders
orderRouter.get('/', orderController.getAllOrders)

module.exports = orderRouter;
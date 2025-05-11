const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');

// Get all customers
router.get('/', customerController.getAllCustomers);

// Get single customer by ID
router.get('/:id', customerController.getCustomerById);

module.exports = router;

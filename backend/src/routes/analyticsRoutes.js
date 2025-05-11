const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analyticsController');

// Dashboard analytics routes
router.get('/stats', analyticsController.getDashboardStats);
router.get('/monthly-revenue', analyticsController.getMonthlyRevenue);
router.get('/category-distribution', analyticsController.getProductCategoryDistribution);
router.get('/recent-orders', analyticsController.getRecentOrders);

module.exports = router;

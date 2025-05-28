const express = require('express');
const { getTopSales } = require('../controller/topSalesController');

const topSalesRouter = express.Router();

// Route to fetch top 10 selling products
topSalesRouter.get('/', getTopSales);

module.exports = topSalesRouter;

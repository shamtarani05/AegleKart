const express = require('express');
const productRouter = express.Router();
const {getProductsbyCategory} = require('../controller/productController');


productRouter.get ('/:category' , getProductsbyCategory);

module.exports = productRouter;
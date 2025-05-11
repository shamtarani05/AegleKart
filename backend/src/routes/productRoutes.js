const express = require('express');
const productRouter = express.Router();
const {getProductsbyCategory, getAllProducts} = require('../controller/productController');


productRouter.get ('/:category' , getProductsbyCategory);
productRouter.get ('/', getAllProducts)

module.exports = productRouter;
const express = require('express');
const productRouter = express.Router();
const {getProductsbyCategory, getAllProducts,getProductById} = require('../controller/productController');


productRouter.get ('/:category' , getProductsbyCategory);
productRouter.get ('/', getAllProducts)
productRouter.get('/product/:id', getProductById)

module.exports = productRouter;
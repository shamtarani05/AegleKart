const express = require('express');
const productRouter = express.Router();
const {
  getProductsbyCategory, 
  getAllProducts, 
  createProduct, 
  deleteProduct,
  updateProduct,
  getProductById,
} = require('../controller/productController');

// Debug middleware to log requests
productRouter.use((req, res, next) => {
  console.log(`Product API Request: ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body type:', typeof req.body);
    console.log('Request body exists:', !!req.body);
  }
  next();
});

productRouter.get('/details/:id', getProductById);
productRouter.get('/:category', getProductsbyCategory);
productRouter.get('/', getAllProducts);
productRouter.post('/add', createProduct);
productRouter.put('/update/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

module.exports = productRouter;
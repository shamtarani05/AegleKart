const express = require('express');
const productRouter = express.Router();
<<<<<<< HEAD
const {getProductsbyCategory, getAllProducts,getProductById} = require('../controller/productController');
=======
const {
  getProductsbyCategory, 
  getAllProducts, 
  createProduct, 
  deleteProduct,
  updateProduct,
  getProductById
} = require('../controller/productController');
>>>>>>> a0efa8fedb5f15b104b001969652cca1b6633168

// Debug middleware to log requests
productRouter.use((req, res, next) => {
  console.log(`Product API Request: ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body type:', typeof req.body);
    console.log('Request body exists:', !!req.body);
  }
  next();
});

<<<<<<< HEAD
productRouter.get ('/:category' , getProductsbyCategory);
productRouter.get ('/', getAllProducts)
productRouter.get('/product/:id', getProductById)
=======
productRouter.get('/details/:id', getProductById);
productRouter.get('/:category', getProductsbyCategory);
productRouter.get('/', getAllProducts);
productRouter.post('/add', createProduct);
productRouter.put('/update/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);
>>>>>>> a0efa8fedb5f15b104b001969652cca1b6633168

module.exports = productRouter;
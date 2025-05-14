const express = require('express');
const reviewRouter = express.Router();
const {
  createReview,
  getProductReviews,
  deleteReview
} = require('../controller/reviewController');

// Debug middleware
reviewRouter.use((req, res, next) => {
  console.log(`Review API Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
reviewRouter.post('/', createReview);
reviewRouter.get('/product/:productId', getProductReviews);
reviewRouter.delete('/:id', deleteReview);

module.exports = reviewRouter;

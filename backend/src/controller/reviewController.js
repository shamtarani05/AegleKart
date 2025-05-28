const mongoose = require('mongoose');
const ReviewSchema = require('../models/review-schema');
const ProductSchema = require('../models/product-schema');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { productId, userName, rating, title, comment, userId } = req.body;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }

    // Check if product exists
    const productExists = await ProductSchema.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Create a new review object
    const newReview = new ReviewSchema({
      productId,
      userId: userId || '64a5f1d5b67824b46b999999', // Default user ID if not provided
      userName,
      rating,
      title,
      comment,
      verified: false // Default to false, can be updated based on purchase verification
    });

    // Save the review
    const savedReview = await newReview.save();

    // Update product rating and review count
    const allProductReviews = await ReviewSchema.find({ productId });
    const reviewCount = allProductReviews.length;
    const avgRating = allProductReviews.reduce((acc, review) => acc + review.rating, 0) / reviewCount;

    await ProductSchema.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: savedReview
    });
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Check for duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// Get all reviews for a product with pagination
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    
    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID'
      });
    }
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    
    // Get reviews with pagination
    const reviews = await ReviewSchema.find({ productId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limitNumber);
    
    // Get total count for pagination
    const totalReviews = await ReviewSchema.countDocuments({ productId });
    
    res.status(200).json({
      success: true,
      reviews,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalReviews / limitNumber),
      totalReviews
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Delete a review (optional - for admin or user to remove their own review)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    // Find the review
    const review = await ReviewSchema.findById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if the user owns this review or is an admin
    if (review.userId.toString() !== userId && !req.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this review'
      });
    }
    
    // Delete the review
    await ReviewSchema.findByIdAndDelete(id);
    
    // Update product rating and review count
    const productId = review.productId;
    const allProductReviews = await ReviewSchema.find({ productId });
    const reviewCount = allProductReviews.length;
    const avgRating = reviewCount > 0 
      ? allProductReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount 
      : 0;
    
    await ProductSchema.findByIdAndUpdate(productId, {
      rating: reviewCount > 0 ? parseFloat(avgRating.toFixed(1)) : 0,
      reviewCount
    });
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview
};

// coupon-schema.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define your Coupon schema
const couponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed', 'shipping'],
  },
  value: {  // This replaces 'discount' field
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  minOrder: {
    type: Number,
    required: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create the Coupon model - only if it doesn't exist already
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

module.exports = Coupon;

// IMPORTANT: REMOVE any references to the User model in this file.
// If you need to access the User model from this file, import it instead:
// const User = require('./user-schema');
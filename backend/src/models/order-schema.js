// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // Custom order ID (not using MongoDB _id)
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Stripe session ID
  stripeSessionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Order items
  products: [{
    id : {type : String},
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    category: {
      type: String,
      default: null
    }
  }],
  
  // Customer information
  customer: {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    }
  },
  
  // Shipping address
  shippingAddress: {
    line1: {
      type: String,
      default: null
    },
    line2: {
      type: String,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    postalCode: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    }
  },
  
  // Discount information
  discount: {
    code: {
      type: String,
      default: null
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed', 'shipping'], // Match with frontend discount types
    },
    value: {
      type: Number,
      default: null
    },
    id: {
      type: String
    }
  },
  
  // Order financial details
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: null
  },
  paymentMethod : {
    type: String,
    default : 'Card'
  },
  
  // Order status
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
}, { 
  // Disable the automatic creation of "createdAt" and "updatedAt" fields
  // since we're manually managing them
  timestamps: false 
});

module.exports = mongoose.model('Order', OrderSchema);
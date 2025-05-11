// models/Payment.js
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  // Custom payment ID (not using MongoDB _id)
  paymentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Reference to order ID
  orderId: {
    type: String,
    required: true,
    index: true
  },
  
  // Stripe payment intent ID
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Payment details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'bank_transfer', 'paypal', 'other']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'succeeded', 'failed', 'refunded', 'partially_refunded']
  },
  
  // Customer information
  customer: {
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      default: null
    }
  },
  
  // Billing information
  billing: {
    name: {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    },
    address: {
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
    }
  },
  
  // Card details (partial, for record keeping)
  cardDetails: {
    brand: {
      type: String,
      default: null
    },
    last4: {
      type: String,
      default: null
    },
    expMonth: {
      type: Number,
      default: null
    },
    expYear: {
      type: Number,
      default: null
    }
  },
  
  // Additional metadata
  metadata: {
    type: Object,
    default: {}
  },
  
  // Refund information if applicable
  refund: {
    amount: {
      type: Number,
      default: null
    },
    reason: {
      type: String,
      default: null
    },
    refundedAt: {
      type: Date,
      default: null
    }
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

module.exports = mongoose.model('Payment', PaymentSchema);
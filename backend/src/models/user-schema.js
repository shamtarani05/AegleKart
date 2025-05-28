// In your user-schema.js file
const mongoose = require('mongoose'); 
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: String,
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: String,
  phoneNumber: String,
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  coupons: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Coupon' 
  }],
});

// Pre-save hook to automatically populate coupons array for new users
userSchema.pre('save', async function(next) {
  // Only run this for new user documents (not on updates)
  if (this.isNew) {
    try {
      // Get the Coupon model
      const Coupon = mongoose.model('Coupon');
      // Find all available coupons (optionally, you could filter by validity date)
      const availableCoupons = await Coupon.find({ 
        validFrom: { $lte: new Date() }, 
        validUntil: { $gte: new Date() } 
      });
      // Add all coupon IDs to the user's coupons array
      this.coupons = availableCoupons.map(coupon => coupon._id);
      console.log(`Added ${this.coupons.length} coupons to new user: ${this.email}`);
    } catch (error) {
      console.error('Error populating coupons for new user:', error);
    }
  }
  next();
});

// Check if the model exists before creating it
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
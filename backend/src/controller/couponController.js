const Coupon = require('../models/coupon-schema');
const User = require('../models/user-schema'); // Changed from customer-schema

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      value,
      minOrder,
      description,
      validFrom,
      validUntil,
    } = req.body;

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ 
        message: 'A coupon with this code already exists' 
      });
    }

    // Create new coupon
    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      value: discountType === 'shipping' ? 0 : parseFloat(value),
      minOrder: parseFloat(minOrder),
      description,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      isActive: true
    });

    const savedCoupon = await coupon.save();
    
    // Add coupon to all users, creating the array if it doesn't exist
    await User.updateMany(
      {
        $or: [
          { coupons: { $exists: false } }, // Users without coupons field
          { coupons: { $ne: savedCoupon._id } } // Users who don't have this coupon
        ]
      },
      { 
        $addToSet: { coupons: savedCoupon._id } // $addToSet prevents duplicates
      }
    );

    res.status(201).json(savedCoupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(400).json({ message: error.message });
  }
};
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    // Remove coupon references from all users instead of customers
    await User.updateMany(
      { coupons: id },
      { $pull: { coupons: id } }
    );

    await Coupon.findByIdAndDelete(id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gt: new Date() }
    });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon' });
    }

    if (cartTotal < coupon.minOrder) {
      return res.status(400).json({
        message: `Minimum order amount of PKR ${coupon.minOrder} required`
      });
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      description: coupon.description,
      minOrder: coupon.minOrder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createCoupon,
  getAllCoupons,
  deleteCoupon,
  validateCoupon,
};

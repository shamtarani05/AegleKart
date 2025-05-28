const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user-schema');
const Coupon = require('../../models/coupon-schema'); // Make sure to import Coupon model

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Fetch complete coupon data for the user
        const userWithCoupons = await User.findOne({ _id: user._id })
            .populate('coupons') // This replaces coupon IDs with full documents
            .exec();

        // Prepare user data for JWT token
        const userData = {
            _id: userWithCoupons._id,
            email: userWithCoupons.email,
            fullName: userWithCoupons.fullName,
            phone : userWithCoupons.phone,
            role : userWithCoupons.role,
            coupons: userWithCoupons.coupons // Now contains full coupon documents
        };

        // Create JWT token
        const token = jwt.sign(userData, process.env.JWT_SECRET);

        res.status(200).json({
            token: token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = loginController;
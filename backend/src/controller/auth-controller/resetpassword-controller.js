const User = require('../../models/user-schema');
const OTP = require('../../models/otp-schema');
const bcrypt = require('bcrypt');

const resetPasswordController = async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        const otpvalue = parseInt(otp, 10); // ✅ fixed casing

        // Validate the OTP code
        const otpEntry = await OTP.findOne({
            contact: email,
            code: otpvalue,
        });

        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid or expired OTP code' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await User.updateOne({ email }, { password: hashedPassword });

        // Delete the OTP entry after successful password reset
        await OTP.deleteMany({ 'payload.email': email });

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
};

module.exports = resetPasswordController;

const User = require('../../models/user-schema');
const OTP = require('../../models/otp-schema');
const nodemailer = require('nodemailer');
require('dotenv').config();



const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});


const forgotPasswordController = async (req, res) => {
    try {
        const { email,purpose } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();


        await OTP.deleteMany({ 'payload.email': email });


        await OTP.create({
            contact: email,
            code: otpCode,
            payload: { email,purpose },
            expiresAt: new Date(Date.now() + 6 * 60 * 1000), // 5 minutes expiry
        });

        // Prepare email content with HTML formatting
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'AegleKart Password Reset OTP',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">AegleKart Password Reset</h2>
          <p>Your password reset verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 10px 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; border-radius: 4px;">
            ${otpCode}
          </div>
          <p>Please enter this code to complete your password reset.</p>
          <p><strong>Important:</strong> This code will expire in 5 minutes.</p>
          <p style="color: #777; font-size: 12px; margin-top: 30px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
      `,
            text: `Your AegleKart password reset code is: ${otpCode}. Please enter this code to complete your password reset. Do not share this code with anyone. It will expire in 5 minutes. If you did not request a password reset, please ignore this email.`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process request. Please try again later.'
        });
    }
};

module.exports = forgotPasswordController;
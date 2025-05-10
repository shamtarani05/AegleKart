const OTP = require('../../models/otp-schema');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

const resendOtpController = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, preferredMethod, purpose } = req.body;
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.deleteMany({ 'payload.email': email });

        // Prepare payload based on purpose
        let payload = {};
        if (purpose === 'signup') {
            if (!password) {
                return res.status(400).json({ success: false, message: 'Password is required for signup' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            payload = { fullName, email, password: hashedPassword, phoneNumber, purpose };
        } else if (purpose === 'forgotpassword') {
            payload = { email, purpose };
        } else {
            return res.status(400).json({ success: false, message: 'Invalid purpose' });
        }

        // Save the OTP
        await OTP.create({
            contact: email,
            code: otpCode,
            payload: payload,
            expiresAt: new Date(Date.now() + 6 * 60 * 1000), // 6 minutes expiry
        });

        // Email options
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'AegleKart Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333;">AegleKart Verification</h2>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f5f5f5; padding: 10px 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; border-radius: 4px;">
                        ${otpCode}
                    </div>
                    <p>Please enter this code to complete your verification.</p>
                    <p><strong>Important:</strong> This code will expire in 5 minutes.</p>
                    <p style="color: #777; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email or contact support.</p>
                </div>
            `,
            text: `Your AegleKart Verification code is: ${otpCode}. Please enter this code to complete your verification. This code will expire in 5 minutes.`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
        });

    } catch (error) {
        console.error('OTP send error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process request. Please try again later.',
        });
    }
};

module.exports = resendOtpController;

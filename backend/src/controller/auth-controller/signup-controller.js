const OTP = require('../../models/otp-schema');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const User = require('../../models/user-schema');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.AUTH_TOKEN);

const signupController = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, preferredMethod,purpose } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const contact = preferredMethod === 'email' ? email : phoneNumber;

    await OTP.create({
      contact,
      code: otpCode,
      payload: { fullName, email, password: hashedPassword, phoneNumber,purpose },
    });

    if (preferredMethod === 'email') {
      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'AegleKart User Verification OTP',
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">AegleKart User Verification</h2>
      <p>Your email verification code is:</p>
      <div style="background-color: #f5f5f5; padding: 10px 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; border-radius: 4px;">
        ${otpCode}
      </div>
      <p>Please enter this code to complete your verification.</p>
      <p><strong>Important:</strong> This code will expire in 5 minutes.</p>
      <p style="color: #777; font-size: 12px; margin-top: 30px;">If you did not request a verfication, please ignore this email or contact support if you have concerns.</p>
    </div>
  `,
        text: `Your AegleKart verfication code is: ${otpCode}. Please enter this code to complete your verfication. Do not share this code with anyone. It will expire in 5 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    } else {
      await twilioClient.messages.create({
        body: `Your OTP is: ${otpCode}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = signupController;

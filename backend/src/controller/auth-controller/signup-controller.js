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
    const { fullName, email, password, phoneNumber, preferredMethod } = req.body;

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
      payload: { fullName, email, password: hashedPassword, phoneNumber },
    });

    if (preferredMethod === 'email') {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'AegleKart Verification OTP',
        text: `Your AegleKart verification code is: ${otpCode} 
Please enter this code to complete your verification. 
Do not share this code with anyone. It will expire in 5 minutes.

Thank you for choosing AegleKart — your trusted healthcare partner.`,
      });
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

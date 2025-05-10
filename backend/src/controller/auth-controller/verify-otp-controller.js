const User = require('../../models/user-schema');
const OTP = require('../../models/otp-schema');

const verifyOtpController = async (req, res) => {
  const { contact, otp } = req.body;

  try {
    const record = await OTP.findOne({ contact, code: otp });
    if (!record || Date.now() - record.createdAt > 5 * 60 * 1000) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const { fullName, email, password, phoneNumber, purpose } = record.payload;
    if (purpose === 'signup') {
      const user = new User({ fullName, email, password, phoneNumber });
      await user.save();
      return res.status(201).json({ message: 'User verified and created successfully' });
      await OTP.deleteMany({ contact });

    }
    else if (purpose === 'forgotpassword') {

      res.status(201).json({ message: 'User verified and created successfully' });
    }
    else {
      return res.status(400).json({ message: 'Invalid purpose' });
    }
   


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

module.exports = verifyOtpController;

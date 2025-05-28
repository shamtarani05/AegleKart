const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  contact: String, 
  code: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Auto-delete after 5 mins
  payload: Object 
});

module.exports = mongoose.model('OTP', otpSchema);

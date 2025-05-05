const express = require('express')
const authrouter = express.Router()
const signupController = require('../controller/auth-controller/signup-controller');
const verifyOtpController = require('../controller/auth-controller/verify-otp-controller');

authrouter.post('/signup', signupController);
authrouter.post('/verify-otp', verifyOtpController);    

module.exports = authrouter;



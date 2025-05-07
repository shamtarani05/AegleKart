const express = require('express')
const authrouter = express.Router()
const signupController = require('../controller/auth-controller/signup-controller');
const verifyOtpController = require('../controller/auth-controller/verify-otp-controller');
const loginController = require('../controller/auth-controller/login-controller');
const verifyToken = require('../middlewares/verify-token');

authrouter.post('/signup', signupController);
authrouter.post('/verify-otp', verifyOtpController);    
authrouter.post('/login', loginController);

module.exports = authrouter;



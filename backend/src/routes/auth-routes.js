const express = require('express')
const authrouter = express.Router()
const signupController = require('../controller/auth-controller/signup-controller');
const verifyOtpController = require('../controller/auth-controller/verify-otp-controller');
const loginController = require('../controller/auth-controller/login-controller');
const verifyToken = require('../middlewares/verify-token');
const forgotPasswordController = require('../controller/auth-controller/forgotpassword-controller');
const resetPasswordController = require('../controller/auth-controller/resetpassword-controller');
const resendOtpController = require('../controller/auth-controller/resendotp-controller');
const logoutController = require('../controller/auth-controller/logout-controller');
authrouter.post('/signup', signupController);
authrouter.post('/verify-otp', verifyOtpController);    
authrouter.post('/login', loginController);
authrouter.post('/forgot-password', forgotPasswordController);
authrouter.post('/reset-password', resetPasswordController);
authrouter.post('/resend-otp', resendOtpController);
authrouter.post('/logout',  logoutController);


module.exports = authrouter;



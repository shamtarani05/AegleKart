const express = require('express');
const stripeRouter = express.Router();
const stripeController = require('../controller/stripeController');
const stripeWebhookMiddleware = require('../middlewares/stripeWebhook');
const verifyToken = require('../middlewares/verify-token')

// Create a checkout session
stripeRouter.post('/create-checkout-session',verifyToken, stripeController.createCheckoutSession);



module.exports = stripeRouter;
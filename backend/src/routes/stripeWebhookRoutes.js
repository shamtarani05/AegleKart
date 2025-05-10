// only export the webhook route here
const express = require('express');
const router = express.Router();
const stripeController = require('../controller/stripeController');
const stripeWebhookMiddleware = require('../middlewares/stripeWebhook');

// ⚠️ No JSON middleware here
router.post('/webhook', stripeWebhookMiddleware, stripeController.handleWebhook);

module.exports = router;

const stripe = require('../config/stripeConfig');

/**
 * Middleware to verify Stripe webhook signatures
 * Uses express.raw({type: 'application/json'}) before this middleware
 */
const stripeWebhookMiddleware = (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  try {
    // Verify the event came from Stripe
    const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    req.stripeEvent = event; // Attach event to request for controller to use
    next();
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = stripeWebhookMiddleware;
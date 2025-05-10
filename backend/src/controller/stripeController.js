const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { generateOrderId, generatePaymentId } = require('../utils/generateIds');
const { createStripeCoupon, parseSessionToOrderData } = require('../utils/stripe-helpers');
const stripe = require('../config/stripeConfig');

/**
 * Create a Stripe checkout session
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const createCheckoutSession = async (req, res) => {
  try {
    const { line_items, discount, success_url, cancel_url, customer_email, metadata } = req.body;

    const orderId = generateOrderId();

    const sessionMetadata = {
      order_id: orderId,
      ...metadata,
    };

    // Create Stripe coupon if discount exists
    let couponId = null;
    if (discount) {
      couponId = await createStripeCoupon(discount, stripe);
    }

    const subtotalAmount = line_items.reduce((total, item) => {
      // Only include actual product items (exclude shipping and tax for subtotal calculation)
      if (item.price_data?.product_data?.name !== 'Shipping' && 
          item.price_data?.product_data?.name !== 'Estimated Tax') {
        return total + (item.price_data.unit_amount * item.quantity);
      }
      return total;
    }, 0);

    const shippingIncludedInItems = line_items.some(item =>
      item.price_data?.product_data?.name === 'Shipping'
    );

    // Free shipping threshold in PKR paisa
    const freeShippingThreshold = 500000; // PKR 5,000 in paisa
    const shouldChargeShipping = !shippingIncludedInItems && subtotalAmount < freeShippingThreshold;

    // Standard shipping cost in PKR paisa
    const shippingAmount = shouldChargeShipping ? 35000 : 0; // PKR 350 in paisa

    // Ensure all line items have PKR currency
    const pkrLineItems = line_items.map(item => ({
      ...item,
      price_data: {
        ...item.price_data,
        currency: 'pkr',
      }
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: pkrLineItems,
      customer_email: customer_email,
      metadata: sessionMetadata,
      shipping_address_collection: {
        allowed_countries: ['PK'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingAmount,
              currency: 'pkr',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
      ...(couponId && {
        discounts: [{ coupon: couponId }],
      }),
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: cancel_url,
    });

    const newOrder = new Order({
      orderId: orderId,
      stripeSessionId: session.id,
      items: pkrLineItems
        .filter(item => 
          item.price_data?.product_data?.name !== 'Shipping' && 
          item.price_data?.product_data?.name !== 'Estimated Tax'
        )
        .map(item => ({
          name: item.price_data.product_data.name,
          price: item.price_data.unit_amount / 100, // Convert from paisa to PKR
          quantity: item.quantity,
          image: item.price_data.product_data.images?.[0] || null,
        })),
      customer: {
        email: customer_email,
      },
      shippingAddress: null,
      discount: discount ? {
        code: discount.name.replace('Promo: ', ''),
        type: discount.type,
        value: discount.type === 'percent' ? discount.amount / 100 : discount.amount / 100, // Convert from paisa to PKR or basis points to percentage
      } : null,
      subtotal: subtotalAmount / 100, // Convert from paisa to PKR
      total: null, // Will be updated after payment is completed
      status: 'pending',
      currency: 'PKR',
      createdAt: new Date(),
    });

    await newOrder.save();

    res.status(200).json({
      sessionId: session.id,
      orderId: orderId,
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session', error: error.message });
  }
};

/**
 * Handle Stripe webhook events
 */
const handleWebhook = async (req, res) => {
  const event = req.stripeEvent;

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object);
      break;
  }

  res.json({ received: true });
};

/**
 * Handle checkout.session.completed event
 */
const handleCheckoutSessionCompleted = async (session) => {
  const orderId = session.metadata.order_id;

  try {
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['line_items', 'customer', 'payment_intent'],
    });

    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    const orderData = parseSessionToOrderData(expandedSession);

    order.status = 'paid';
    order.customer = orderData.customer;
    order.shippingAddress = orderData.shippingAddress;
    order.total = orderData.total;
    order.updatedAt = new Date();

    await order.save();

    // Extract payment intent ID string instead of using the whole object
    const paymentIntentId = typeof expandedSession.payment_intent === 'string' 
      ? expandedSession.payment_intent 
      : expandedSession.payment_intent.id;

    const paymentId = generatePaymentId();
    const payment = new Payment({
      paymentId: paymentId,
      orderId: orderId,
      stripePaymentIntentId: paymentIntentId,
      amount: expandedSession.amount_total / 100, // Convert from paisa to PKR
      currency: 'PKR',
      paymentMethod: 'card',
      status: 'succeeded',
      customer: {
        email: expandedSession.customer_details.email,
        name: expandedSession.customer_details.name,
      },
      billing: {
        name: expandedSession.customer_details.name,
        email: expandedSession.customer_details.email,
        phone: expandedSession.customer_details.phone || null,
        address: {
          line1: expandedSession.customer_details.address?.line1 || null,
          line2: expandedSession.customer_details.address?.line2 || null,
          city: expandedSession.customer_details.address?.city || null,
          state: expandedSession.customer_details.address?.state || null,
          postalCode: expandedSession.customer_details.address?.postal_code || null,
          country: expandedSession.customer_details.address?.country || null,
        },
      },
      metadata: session.metadata,
      createdAt: new Date(),
    });

    await payment.save();
  } catch (error) {
    console.error(`Error processing checkout session: ${error.message}`);
  }
};

/**
 * Handle payment_intent.payment_failed event
 */
const handlePaymentIntentFailed = async (paymentIntent) => {
  const orderId = paymentIntent.metadata.order_id;

  try {
    await Order.findOneAndUpdate(
      { orderId: orderId },
      {
        status: 'failed',
        updatedAt: new Date(),
      }
    );
  } catch (error) {
    console.error(`Error updating failed order: ${error.message}`);
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhook,
};
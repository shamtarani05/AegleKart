/**
 * Helper functions for Stripe integration
 */

/**
 * Create a discount coupon in Stripe
 * @param {Object} discount - Discount object with type, amount, and name
 * @param {Object} stripe - Initialized Stripe client
 * @returns {Promise<string|null>} Coupon ID or null if creation fails
 */
async function createStripeCoupon(discount, stripe) {
  if (!discount) return null;
  
  try {
    const couponData = {
      name: discount.name,
      duration: 'once',
    };
    
    if (discount.type === 'percent') {
      couponData.percent_off = discount.amount / 100; // Convert from basis points
    } else {
      couponData.amount_off = discount.amount;
      couponData.currency = 'usd';
    }
    
    const coupon = await stripe.coupons.create(couponData);
    return coupon.id;
  } catch (error) {
    console.error('Error creating Stripe coupon:', error);
    return null;
  }
}

/**
 * Format order items for Stripe line items
 * @param {Array} items - Cart items
 * @returns {Array} Stripe formatted line items
 */
function formatLineItems(items) {
  return items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));
}

/**
 * Parse Stripe session data to match our Order model
 * @param {Object} session - Stripe session data
 * @returns {Object} Formatted data for our Order model
 */
function parseSessionToOrderData(session) {
  return {
    customer: {
      email: session.customer_details?.email || '',
      name: session.customer_details?.name || null,
      phone: session.customer_details?.phone || null,
    },
    shippingAddress: session.shipping_details?.address ? {
      line1: session.shipping_details.address.line1 || null,
      line2: session.shipping_details.address.line2 || null,
      city: session.shipping_details.address.city || null,
      state: session.shipping_details.address.state || null,
      postalCode: session.shipping_details.address.postal_code || null,
      country: session.shipping_details.address.country || null,
    } : null,
    total: session.amount_total ? session.amount_total / 100 : null, // Convert cents to dollars
  };
}

module.exports = {
  createStripeCoupon,
  formatLineItems,
  parseSessionToOrderData
};
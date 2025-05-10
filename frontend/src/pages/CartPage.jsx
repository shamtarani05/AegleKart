import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, RefreshCw,
  CreditCard, Truck, Tag, X, AlertCircle, CheckCircle
} from 'lucide-react';
import styles from '../styles/cartpage.module.css';
import useCartStore from '../stores/cart-store';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import useAuthStore from '../stores/auth-store';

// Initialize Stripe with your publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CartPage = () => {
  const { cart: cartItems, addToCart, removeFromCart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState('');
  const user = useAuthStore((state) => state.user);
  const token = localStorage.getItem('token');

  // Available promo codes - in a real app, these would be fetched from an API
  const availablePromoCodes = [
    { code: 'WELCOME20', discountType: 'percentage', value: 20, description: '20% off your order', minOrder: 2000 },
    { code: 'FREESHIP', discountType: 'shipping', value: 0, description: 'Free shipping', minOrder: 1500 },
    { code: 'FLAT500', discountType: 'fixed', value: 500, description: 'PKR 500 off your order', minOrder: 3000 }
  ];

  // Check if there's a successful checkout in the URL (returning from Stripe)
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');

    // Get orderId from localStorage that was saved before checkout redirect
    const orderId = localStorage.getItem('pendingOrderId');
    console.log('orderId', orderId, sessionId);
    
    if (orderId) {
      verifyPayment(orderId);
    }
  }, []);

  // Modified verifyPayment function
  const verifyPayment = async (orderId) => {
    try {
      setIsProcessing(true); // Show loading indicator during verification

      const response = await fetch(`http://localhost:3000/orders/verify-payment/${orderId}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Pass token in the headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error verifying payment');
      }

      const data = await response.json();

      if (data.success && data.order.status === 'paid') {
        // Only remove pendingOrderId AFTER successful verification
        localStorage.removeItem('pendingOrderId');
        setCheckoutSuccess('Your order was placed successfully!');
        clearCart(); // Clear the cart after successful purchase
      } else {
        // Payment verification failed but the request was successful
        setCheckoutError('Payment verification failed. Please contact customer support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setCheckoutError(`Payment verification error: ${error.message}`);
    } finally {
      setIsProcessing(false); // Hide loading indicator
    }
  };

  // Update item quantity
  const updateQuantity = (id, change) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + change);
    addToCart({ ...item, quantity: newQuantity - item.quantity });
  };

  // Remove item from cart
  const removeItem = (id) => {
    removeFromCart(id);
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const foundPromo = availablePromoCodes.find(
      promo => promo.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (foundPromo) {
      // Check if cart subtotal meets minimum order requirement
      if (subtotal < foundPromo.minOrder) {
        setPromoError(`This code requires a minimum order of PKR ${foundPromo.minOrder.toLocaleString('en-PK')}`);
        return;
      }

      setAppliedPromo(foundPromo);
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  // Remove applied promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Calculate order details
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.discountType === 'fixed') {
      discount = Math.min(appliedPromo.value, subtotal);
    }
  }

  // Free shipping threshold in PKR
  const shippingThreshold = 3000; 
  let shipping = subtotal > shippingThreshold ? 0 : 250;
  
  if (appliedPromo?.discountType === 'shipping') {
    shipping = 0;
  }

  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  // Format price in PKR
  const formatPKR = (amount) => {
    return `PKR ${amount.toLocaleString('en-PK')}`;
  };

  // Handle Stripe checkout
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setCheckoutError('');

      // Prepare the line items for Stripe
      const line_items = cartItems.map(item => ({
        price_data: {
          currency: 'pkr',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to paisa
        },
        quantity: item.quantity,
      }));

      // Add tax as a separate line item
      if (tax > 0) {
        line_items.push({
          price_data: {
            currency: 'pkr',
            product_data: {
              name: 'Estimated Tax',
            },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        });
      }

      // Add shipping as a separate line item if needed
      if (shipping > 0) {
        line_items.push({
          price_data: {
            currency: 'pkr',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: Math.round(shipping * 100),
          },
          quantity: 1,
        });
      }

      // Apply discount if there's a promo code
      let discountData = null;
      if (discount > 0) {
        discountData = {
          type: appliedPromo.discountType === 'percentage' ? 'percent' : 'fixed_amount',
          amount: appliedPromo.discountType === 'percentage'
            ? appliedPromo.value * 100 // For percentage, convert to basis points
            : Math.round(discount * 100), // For fixed amount, convert to paisa
          name: `Promo: ${appliedPromo.code}`,
        };
      }

      // Call our backend API to create a Stripe checkout session
      const response = await fetch('http://localhost:3000/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          line_items,
          discount: discountData,
          // Update success_url to include session_id 
          success_url: `${window.location.origin}/cart?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/cart?canceled=true`,
          customer_email: user?.email, // Get from user state
          metadata: {
            user_id: user?.id || 'guest', // Get from user state
          },
          user: user,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong with the checkout process');
      }

      const { sessionId, orderId } = await response.json();

      // Store orderId in localStorage for verification after redirect
      localStorage.setItem('pendingOrderId', orderId);

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }

    } catch (error) {
      setCheckoutError(error.message || 'An unexpected error occurred');
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Your Cart</h1>
            <p className={styles.heroSubtitle}>Review and checkout your selected items</p>
          </div>
        </section>

        <section className={styles.cartSection}>
          <div className={styles.cartContainer}>
            {isProcessing && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner}>
                  <RefreshCw size={32} className={styles.spinnerIcon} />
                  <p>Processing your order...</p>
                </div>
              </div>
            )}

            {checkoutSuccess && (
              <div className={styles.checkoutSuccessMessage}>
                <CheckCircle size={24} />
                <p>{checkoutSuccess}</p>
                <button
                  className={styles.continueShoppingButton}
                  onClick={() => navigate('/products/medicine')}
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {!checkoutSuccess && cartItems.length > 0 ? (
              <div className={styles.cartLayout}>
                <div className={styles.cartItems}>
                  <h2 className={styles.sectionTitle}>
                    Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                  </h2>

                  <div className={styles.cartItemsList}>
                    {cartItems.map(item => (
                      <div key={item.id} className={styles.cartItem}>
                        <div className={styles.itemImageContainer}>
                          <div className={styles.itemImage}>
                            <img src={item.image} alt={item.name} className={styles.productImage} />
                          </div>
                        </div>

                        <div className={styles.itemDetails}>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <p className={styles.itemPrice}>{formatPKR(item.price)}</p>
                        </div>

                        <div className={styles.itemActions}>
                          <div className={styles.quantityControl}>
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className={styles.quantityButton}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className={styles.quantity}>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className={styles.quantityButton}
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className={styles.removeButton}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                            Remove
                          </button>
                        </div>

                        <div className={styles.itemTotal}>
                          <p>{formatPKR(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cartActions}>
                    <button
                      className={styles.continueShoppingButton}
                      onClick={() => navigate('/products/medicine')}
                    >
                      <RefreshCw size={18} />
                      Continue Shopping
                    </button>
                  </div>
                </div>

                <div className={styles.orderSummary}>
                  <div className={styles.summaryCard}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>

                    <div className={styles.promoCodeSection}>
                      <h3 className={styles.promoCodeTitle}>
                        <Tag size={16} />
                        <span>Apply Promo Code</span>
                      </h3>

                      {appliedPromo ? (
                        <div className={styles.appliedPromoCode}>
                          <div className={styles.appliedPromoInfo}>
                            <span className={styles.appliedPromoTag}>{appliedPromo.code}</span>
                            <span>{appliedPromo.description}</span>
                          </div>
                          <button
                            onClick={removePromoCode}
                            className={styles.removePromoButton}
                            aria-label="Remove promo code"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.promoCodeForm}>
                          <div className={styles.promoCodeInput}>
                            <input
                              type="text"
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Enter promo code"
                              aria-label="Promo code"
                            />
                            <button
                              onClick={applyPromoCode}
                              className={styles.applyPromoButton}
                            >
                              Apply
                            </button>
                          </div>
                          {promoError && (
                            <p className={styles.promoError}>
                              <AlertCircle size={14} />
                              {promoError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className={styles.summaryContent}>
                      <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>{formatPKR(subtotal)}</span>
                      </div>
                      {appliedPromo && (
                        <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                          <span>Discount ({appliedPromo.code})</span>
                          <span>-{formatPKR(discount)}</span>
                        </div>
                      )}
                      <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : formatPKR(shipping)}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Estimated Tax</span>
                        <span>{formatPKR(tax)}</span>
                      </div>
                      <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                        <strong>Total</strong>
                        <strong>{formatPKR(total)}</strong>
                      </div>
                    </div>

                    <div className={styles.shippingNote}>
                      <Truck size={16} />
                      <p>
                        {subtotal > shippingThreshold
                          ? 'Your order qualifies for FREE shipping!'
                          : `Add ${formatPKR(shippingThreshold - subtotal)} more to qualify for FREE shipping`}
                      </p>
                    </div>

                    <button
                      className={styles.checkoutButton}
                      onClick={handleCheckout}
                      disabled={isProcessing || cartItems.length === 0}
                      aria-label="Proceed to checkout"
                    >
                      {isProcessing ? (
                        <span className={styles.loadingSpinner}>
                          <RefreshCw size={18} className={styles.spinnerIcon} />
                          Processing...
                        </span>
                      ) : (
                        <>
                          <span>Proceed to Checkout</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>

                    {checkoutError && (
                      <div className={styles.checkoutError}>
                        <AlertCircle size={18} />
                        <p>{checkoutError}</p>
                      </div>
                    )}

                    <div className={styles.paymentMethods}>
                      <p>We Accept:</p>
                      <div className={styles.paymentIcons}>
                        <CreditCard size={24} className={styles.paymentIcon} />
                        <img
                          src="/images/payment-icons/visa.svg"
                          alt="Visa"
                          className={styles.paymentIcon}
                        />
                        <img
                          src="/images/payment-icons/mastercard.svg"
                          alt="Mastercard"
                          className={styles.paymentIcon}
                        />
                        <img
                          src="/images/payment-icons/amex.svg"
                          alt="American Express"
                          className={styles.paymentIcon}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : !checkoutSuccess && (
              <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}>
                  <ShoppingCart size={64} />
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <button
                  className={styles.startShoppingButton}
                  onClick={() => navigate('/products/medicine')}
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <div className={styles.benefitsContainer}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <Truck size={24} />
              </div>
              <h3>Free Shipping</h3>
              <p>On orders over {formatPKR(shippingThreshold)}</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <RefreshCw size={24} />
              </div>
              <h3>30-Day Returns</h3>
              <p>Hassle-free returns</p>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>
                <ShoppingCart size={24} />
              </div>
              <h3>Secure Checkout</h3>
              <p>Safe & encrypted</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
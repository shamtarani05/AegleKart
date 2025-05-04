import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, RefreshCw,
  CreditCard, Truck, Tag, X
} from 'lucide-react';
import styles from '../styles/cartpage.module.css';
import useCartStore from '../stores/cart-store';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const cartItems = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const availablePromoCodes = [
    { code: 'WELCOME10', discountType: 'percentage', value: 10, description: '10% off your order' },
    { code: 'FREESHIP', discountType: 'shipping', value: 100, description: 'Free shipping' },
    { code: 'FLAT15', discountType: 'fixed', value: 15, description: '$15 off your order' }
  ];

  const updateQuantity = (id, change) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + change);
    addToCart({ ...item, quantity: newQuantity - item.quantity });
  };

  const removeItem = (id) => {
    removeFromCart(id);
  };

  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    const foundPromo = availablePromoCodes.find(
      promo => promo.code.toLowerCase() === promoCode.toLowerCase()
    );

    if (foundPromo) {
      setAppliedPromo(foundPromo);
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.discountType === 'fixed') {
      discount = Math.min(appliedPromo.value, subtotal);
    }
  }

  let shipping = subtotal > 50 ? 0 : 5.95;
  if (appliedPromo?.discountType === 'shipping') {
    shipping = 0;
  }

  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

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
            {cartItems.length > 0 ? (
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
                            <img src={item.image} alt={item.name} className={styles.placeholderImage} />
                          </div>
                        </div>

                        <div className={styles.itemDetails}>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                        </div>

                        <div className={styles.itemActions}>
                          <div className={styles.quantityControl}>
                            <button onClick={() => updateQuantity(item.id, -1)} className={styles.quantityButton}>
                              <Minus size={16} />
                            </button>
                            <span className={styles.quantity}>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className={styles.quantityButton}>
                              <Plus size={16} />
                            </button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className={styles.removeButton}>
                            <Trash2 size={18} />
                            Remove
                          </button>
                        </div>

                        <div className={styles.itemTotal}>
                          <p>${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cartActions}>
                    <button className={styles.continueShoppingButton} onClick={() => navigate('/products/medicine')}>
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
                          <button onClick={removePromoCode} className={styles.removePromoButton}>
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
                            />
                            <button onClick={applyPromoCode} className={styles.applyPromoButton}>
                              Apply
                            </button>
                          </div>
                          {promoError && <p className={styles.promoError}>{promoError}</p>}
                        </div>
                      )}
                    </div>

                    <div className={styles.summaryContent}>
                      <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      {appliedPromo && (
                        <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                          <span>Discount ({appliedPromo.code})</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className={styles.summaryRow}>
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Estimated Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                        <strong>Total</strong>
                        <strong>${total.toFixed(2)}</strong>
                      </div>
                    </div>

                    <div className={styles.shippingNote}>
                      <Truck size={16} />
                      <p>
                        {subtotal > 50
                          ? 'Your order qualifies for FREE shipping!'
                          : `Add $${(50 - subtotal).toFixed(2)} more to qualify for FREE shipping`}
                      </p>
                    </div>

                    <button className={styles.checkoutButton}>
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={18} />
                    </button>

                    <div className={styles.paymentMethods}>
                      <p>We Accept:</p>
                      <div className={styles.paymentIcons}>
                        <CreditCard size={24} className={styles.paymentIcon} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyCart}>
                <div className={styles.emptyCartIcon}>
                  <ShoppingCart size={64} />
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <button className={styles.startShoppingButton}>Start Shopping</button>
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
              <p>On orders over $50</p>
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
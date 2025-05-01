import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, RefreshCw, CreditCard, Truck, Tag, X } from 'lucide-react';
import styles from '../styles/cartpage.module.css';

const CartPage = () => {
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Organic Ashwagandha Root Powder',
      price: 24.99,
      quantity: 2,
      image: '/images/products/ashwagandha.jpg'
    },
    {
      id: 2,
      name: 'Herbal Wellness Tea Blend',
      price: 18.50,
      quantity: 1,
      image: '/images/products/tea-blend.jpg'
    },
    {
      id: 3,
      name: 'Pure Neem Extract - 60 Capsules',
      price: 29.95,
      quantity: 1,
      image: '/images/products/neem-capsules.jpg'
    }
  ]);

  // Promo code states
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Mock promo codes with different discount types
  const availablePromoCodes = [
    { code: 'WELCOME10', discountType: 'percentage', value: 10, description: '10% off your order' },
    { code: 'FREESHIP', discountType: 'shipping', value: 100, description: 'Free shipping' },
    { code: 'FLAT15', discountType: 'fixed', value: 15, description: '$15 off your order' }
  ];

  // Function to update item quantity
  const updateQuantity = (id, change) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) } 
          : item
      )
    );
  };

  // Function to remove item from cart
  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Function to apply promo code
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

  // Function to remove promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calculate discount
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.discountType === 'fixed') {
      discount = Math.min(appliedPromo.value, subtotal); // Ensure discount doesn't exceed subtotal
    }
  }

  // Calculate shipping
  let shipping = subtotal > 50 ? 0 : 5.95;
  if (appliedPromo && appliedPromo.discountType === 'shipping') {
    shipping = 0;
  }

  const tax = (subtotal - discount) * 0.08; // 8% tax rate after discount
  const total = subtotal - discount + shipping + tax;

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Your Cart</h1>
            <p className={styles.heroSubtitle}>Review and checkout your selected items</p>
          </div>
        </section>

        {/* Cart Content */}
        <section className={styles.cartSection}>
          <div className={styles.cartContainer}>
            {cartItems.length > 0 ? (
              <div className={styles.cartLayout}>
                {/* Cart Items */}
                <div className={styles.cartItems}>
                  <h2 className={styles.sectionTitle}>Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h2>
                  
                  <div className={styles.cartItemsList}>
                    {cartItems.map(item => (
                      <div key={item.id} className={styles.cartItem}>
                        <div className={styles.itemImageContainer}>
                          <div className={styles.itemImage}>
                            {/* Placeholder for actual image */}
                            <div className={styles.placeholderImage} aria-label={item.name}></div>
                          </div>
                        </div>
                        
                        <div className={styles.itemDetails}>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                        </div>
                        
                        <div className={styles.itemActions}>
                          <div className={styles.quantityControl}>
                            <button 
                              className={styles.quantityButton}
                              onClick={() => updateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <span className={styles.quantity}>{item.quantity}</span>
                            <button 
                              className={styles.quantityButton}
                              onClick={() => updateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button 
                            className={styles.removeButton}
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                            <span>Remove</span>
                          </button>
                        </div>
                        
                        <div className={styles.itemTotal}>
                          <p>${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.cartActions}>
                    <button className={styles.continueShoppingButton}>
                      <RefreshCw size={18} />
                      Continue Shopping
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className={styles.orderSummary}>
                  <div className={styles.summaryCard}>
                    <h2 className={styles.summaryTitle}>Order Summary</h2>
                    
                    {/* Promo Code Section */}
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
                            className={styles.removePromoButton} 
                            onClick={removePromoCode}
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
                              aria-label="Promo code input"
                            />
                            <button 
                              className={styles.applyPromoButton} 
                              onClick={applyPromoCode}
                            >
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
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
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
                        {/* Add more payment icons here if needed */}
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
                <button className={styles.startShoppingButton}>
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Shopping Benefits */}
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
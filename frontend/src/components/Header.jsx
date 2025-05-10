import { useState } from 'react';
import { Search, MapPin, Download, ShoppingCart, User, ChevronDown, Clock, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/header.module.css';
import useCartStore from '../stores/cart-store';
import useAuthStore from '../stores/auth-store';
import LoggedIn from './LoggedIn';
import CompactAddressDropdown from './Address';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const cartItems = useCartStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user; // Convert user object to boolean
  const clearUser = useAuthStore((state) => state.clearUser);

  const categories = [
    { name: 'Medicines', icon: null },
    { name: 'Healthcare', icon: null },
    { name: 'Baby & Mother', icon: null },
    { name: 'Nutrition', icon: null },
    { name: 'Personal Care', icon: null },
    { name: 'Devices', icon: null }
  ];

  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate('/auth'); // This will navigate to your Auth.jsx component
  };

  const handleCartClick = () => {
    navigate('/cart');
  }

  const handleLogout = async () => {
    console.log('Logout success');
    localStorage.removeItem('token');
    clearUser();
  };


  return (
    <header className={styles.header}>
      {/* Top Bar
      <div className={styles.promotionBar}>
        <span>🎉 Free delivery on orders above ₹499 | Use code AEGLE20 for 20% OFF on your first order</span>
      </div> */}

      {/* Main Header */}
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          {/* Logo Section */}
          <Link to='/' className={styles.logoSection}>
            <span className={styles.logoText}>Aegle</span>
            <span className={styles.logoTextAccent}>Kart</span>
            <div className={styles.tagline}>Wellness at your doorstep</div>
          </Link>

          {/* Search Bar */}
          <div className={styles.searchBarDesktop}>
            <input
              type="text"
              placeholder="Search for medicines, health products..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={styles.searchButton}>
              <Search className={styles.searchIcon} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            {/* Location Selector */}
            <div className={styles.locationSelector}>
              <CompactAddressDropdown />
            </div>

            {/* Conditional rendering for Account/LoggedIn using auth store */}
            {isLoggedIn ? (
              <LoggedIn
                userName={user.fullName || user.email || 'User'} // Use appropriate user property
                onLogout={handleLogout}
              />
            ) : (
              <button className={styles.accountButton}
                onClick={handleAccountClick}>
                <User className={styles.buttonIcon} />
                <span className={styles.buttonText}>Account</span>
              </button>
            )}

            {/* Cart */}
            <button className={styles.cartButton}
              onClick={handleCartClick}>
              <ShoppingCart className={styles.buttonIcon} />
              <span className={styles.buttonText}>Cart</span>
              <span className={styles.cartBadge}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={styles.searchBarMobile}>
          <input
            type="text"
            placeholder="Search AegleKart..."
            className={styles.searchInputMobile}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className={styles.searchButtonMobile}>
            <Search className={styles.searchIconMobile} />
          </button>
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className={styles.categoryNav}>
        <div className={styles.categoryContainer}>
          <ul className={styles.categoryList}>
            {categories.map((category, index) => (
              <li key={index} className={styles.categoryItem}>
                <a href="#" className={styles.categoryLink}>
                  {category.icon && <span className={styles.categoryIcon}>{category.icon}</span>}
                  {category.name}
                  <ChevronDown className={styles.categoryChevron} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
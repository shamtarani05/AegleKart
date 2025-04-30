import { useState } from 'react';
import { Search, MapPin, Download, ShoppingCart, User, ChevronDown, Clock, Heart } from 'lucide-react';
import styles from '../styles/header.module.css';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    { name: 'Medicines', icon: null},
    { name: 'Healthcare', icon: null },
    { name: 'Baby & Mother', icon: null },
    { name: 'Nutrition', icon: null },
    { name: 'Personal Care', icon: null },
    { name: 'Devices', icon: null }
  ];

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
          <div className={styles.logoSection}>
            <span className={styles.logoText}>Aegle</span>
            <span className={styles.logoTextAccent}>Kart</span>
            <div className={styles.tagline}>Wellness at your doorstep</div>
          </div>

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
              <MapPin className={styles.locationIcon} />
              <div className={styles.locationText}>
                <span className={styles.locationLabel}>Deliver to</span>
                <span className={styles.locationValue}>Select location</span>
              </div>
              <ChevronDown className={styles.chevronIcon} />
            </div>

            {/* User Account */}
            <button className={styles.accountButton}>
              <User className={styles.buttonIcon} />
              <span className={styles.buttonText}>Account</span>
            </button>

            {/* Cart */}
            <button className={styles.cartButton}>
              <ShoppingCart className={styles.buttonIcon} />
              <span className={styles.buttonText}>Cart</span>
              <span className={styles.cartBadge}>0</span>
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
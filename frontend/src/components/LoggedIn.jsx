import { useState } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import styles from '../styles/header.module.css';

export default function LoggedIn({ userName, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className={styles.loggedInContainer}>
      <button 
        className={styles.accountButton}
        onClick={toggleDropdown}
      >
        <User className={styles.buttonIcon} />
        <span className={styles.buttonText}>{userName}</span>
        <ChevronDown className={styles.chevronIcon} />
      </button>
      
      {dropdownOpen && (
        <div className={styles.logoutDropdown}>
          <button 
            className={styles.logoutButton}
            onClick={() => {
              onLogout();
              setDropdownOpen(false);
            }}
          >
            <LogOut className={styles.logoutIcon} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

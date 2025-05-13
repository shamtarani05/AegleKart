import { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import styles from '../styles/header.module.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function LoggedIn({ userName, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check user role on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === 'admin');
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const goToAdminPage = () => {
    navigate('/admin');
    setDropdownOpen(false);
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
          {isAdmin && (
            <button 
              className={styles.adminButton}
              onClick={goToAdminPage}
            >
              <Settings className={styles.adminIcon} />
              <span>Admin Dashboard</span>
            </button>
          )}
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
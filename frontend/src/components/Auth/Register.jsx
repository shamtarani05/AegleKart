import { useState } from 'react';
import styles from '../../styles/auth.module.css';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/auth-store';
import Alert from '../Alert'; // Import the new Alert component

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    preferredMethod: 'email',
    purpose : 'signup',
  });
  const [loading, setLoading] = useState(false);
  
  // Replace the simple error state with alert state
  const [alert, setAlert] = useState({
    message: '',
    type: '',
    isVisible: false
  });
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  };

  const showAlert = (message, type) => {
    setAlert({
      message,
      type,
      isVisible: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clear any existing alerts
    closeAlert();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      showAlert('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {  
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.ok) {
        showAlert('Verification code sent to your email!', 'success');
        setUser(formData);
        
        // Navigate after a short delay to allow the user to see the success message
        setTimeout(() => {
          navigate('/auth/verify-otp');
        }, 2100);
        return;
      }
      
      showAlert(data.message || 'Registration failed', 'error');
    } catch (err) {
      console.error(err);
      showAlert('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Create Account</h2>
      <p className={styles.formSubtitle}>Join AegleKart for all your pharmaceutical needs</p>
      
      {/* The alert component */}
      <Alert 
        message={alert.message}
        type={alert.type}
        isVisible={alert.isVisible}
        onClose={closeAlert}
      />
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="fullName" className={styles.label}>Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className={styles.input}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Register;
import { useState } from 'react';
import styles from '../../styles/auth.module.css';

const ForgotPassword = ({ onBackClick, navigateToOTP }) => {
  const [method, setMethod] = useState('email'); // 'phone' or 'email'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (method === 'email') {
      if (!email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';
    } else {
      if (!phone) newErrors.phone = 'Phone number is required';
      else if (!/^\d{11}$/.test(phone)) newErrors.phone = 'Enter a valid 11-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      // Here you would implement actual API call
      console.log('Reset password request via:', method, method === 'email' ? email : phone);
      
      // Simulate API call with a delay
      setTimeout(() => {
        setIsSubmitting(false);
        // Navigate to OTP verification
        navigateToOTP(method === 'email' ? email : '', method === 'phone' ? phone : '');
      }, 1000);
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ form: 'Failed to send reset instructions. Please try again.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authTabs}>
          <button 
            className={`${styles.tabButton} ${method === 'email' ? styles.activeTab : ''}`}
            onClick={() => setMethod('email')}
            type="button"
          >
            Email
          </button>
          <button 
            className={`${styles.tabButton} ${method === 'phone' ? styles.activeTab : ''}`}
            onClick={() => setMethod('phone')}
            type="button"
          >
            Phone
          </button>
        </div>
        
        <div className={styles.authContent}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Reset Your Password</h2>
            <p className={styles.formSubtitle}>We'll send you instructions to reset your password</p>
            
            {errors.form && <div className={styles.errorMessage}>{errors.form}</div>}
            
            <form className={styles.form} onSubmit={handleSubmit}>
              {method === 'email' ? (
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reset-email">Email Address</label>
                  <input
                    className={styles.input}
                    type="email"
                    id="reset-email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && <p className={styles.errorText}>{errors.email}</p>}
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="reset-phone">Phone Number</label>
                  <input
                    className={styles.input}
                    type="tel"
                    id="reset-phone"
                    placeholder="Enter your registered phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
                </div>
              )}
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </button>
              
              <button 
                type="button" 
                onClick={onBackClick} 
                className={styles.secondaryButton}
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
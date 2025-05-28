import { useState } from 'react';
import styles from '../../styles/auth.module.css';
import Alert from '../Alert'; // Import the Alert component we created
import useAuthStore from '../../stores/auth-store';

const ForgotPassword = ({ onBackClick, navigateToOTP }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useAuthStore((state) => state.setUser); 

  // Alert state for notifications
  const [alert, setAlert] = useState({
    message: '',
    type: '',
    isVisible: false
  });

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

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';
  

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsSubmitting(true);
  const user = { 
    email: email,
    purpose : 'forgotpassword',
   };
  setUser(user); 
  // Call backend API for email-based password reset
  const response = await fetch('http://localhost:3000/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (response.ok) {
    showAlert('Reset instructions sent to your email!', 'success');
    setTimeout(() => {
      navigateToOTP(email, '');
    }, 2100);
    setIsSubmitting(false);
    return;
  }
  showAlert(data.message || 'Failed to send reset instructions', 'error');
  setIsSubmitting(false);
} 
  

return (
  <div className={styles.authContainer}>
    {/* Alert component */}
    <Alert
      message={alert.message}
      type={alert.type}
      isVisible={alert.isVisible}
      onClose={closeAlert}
    />

    <div className={styles.authCard}>
      <div className={styles.authContent}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Reset Your Password</h2>
          <p className={styles.formSubtitle}>We'll send you instructions to reset your password</p>

          <form className={styles.form} onSubmit={handleSubmit}>
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
import { useState } from 'react';
import styles from '../../styles/auth.module.css';
import useAuthStore from '../../stores/auth-store';

const ResetPassword = ({ email, onResetComplete, onBackClick }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);
  const cleaUser = useAuthStore((state) => state.clearUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
   console.log('Resetting password for:', user.email, formData.password, user.otp);
    const response = await fetch('http://localhost:3000/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: formData.password,
        otp: user.otp,
      }),
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      console.log('Password reset successful:', data);
      cleaUser(); 
      onResetComplete();
    } else {
      const errData = await response.json();
      console.error('Reset failed:', errData);
      setError(errData.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authContent}>
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Create New Password</h2>
            <p className={styles.formSubtitle}>
              Enter a new password for your account: <strong>{email}</strong>
            </p>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="password">New Password</label>
                <input
                  className={styles.input}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                <input
                  className={styles.input}
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
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

export default ResetPassword;

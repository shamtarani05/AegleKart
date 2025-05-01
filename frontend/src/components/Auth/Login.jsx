import { useState } from 'react';
import styles from '../../styles/auth.module.css';

const Login = ({ navigateToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with your actual login API call
      // Example: const response = await loginUser(formData);
      console.log('Login attempt with:', formData);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful login
      // Example: localStorage.setItem('token', response.token);
      // Example: window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Welcome Back</h2>
      <p className={styles.formSubtitle}>Sign in to access your AegleKart account</p>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
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
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.forgotPassword}>
          <button 
            type="button" 
            onClick={navigateToForgotPassword}
            className={styles.forgotBtn}
          >
            Forgot Password?
          </button>
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
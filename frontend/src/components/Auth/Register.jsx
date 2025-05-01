import { useState } from 'react';
import styles from '../../styles/auth.module.css';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
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

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual registration API call
      // Example: const response = await registerUser(formData);
      console.log('Registration attempt with:', formData);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // On successful registration, navigate to OTP verification
      onRegisterSuccess(formData.email, formData.phoneNumber);
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Create Account</h2>
      <p className={styles.formSubtitle}>Join AegleKart for all your pharmaceutical needs</p>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      
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
import { useState } from 'react';
import styles from '../../styles/auth.module.css';
import  { useNavigate } from 'react-router-dom';

const Login = ({ navigateToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
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

    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert('Login Successfully');
      navigate('/');
      return;
    }
    setError(data.message || 'Login failed. Please try again.');
    setLoading(false);  


  }

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
            autocomplete="current-password"
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